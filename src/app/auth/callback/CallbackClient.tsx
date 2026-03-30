'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Fetch with timeout
async function fetchWithTimeout(url: string, options: RequestInit, timeout = 5000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(timeoutId);
  }
}

export function CallbackClient() {
  const router = useRouter();
  const [error, setError] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      if (!supabase) {
        setError('Supabase not configured');
        return;
      }

      try {
        // Extract redirect URL from query params
        const urlParams = new URLSearchParams(window.location.search);
        const redirectTo = urlParams.get('redirect') || '/';

        // Get session and user in parallel (faster)
        const [{ data: { session }, error: sessionError }, { data: { user } }] = await Promise.all([
          supabase.auth.getSession(),
          supabase.auth.getUser(),
        ]);

        if (sessionError) throw new Error(sessionError.message);
        if (!session) throw new Error('No session received');

        // Store tokens immediately
        localStorage.setItem('supabase_access_token', session.access_token);
        if (session.refresh_token) {
          localStorage.setItem('supabase_refresh_token', session.refresh_token);
        }

        // Try to get backend JWT in parallel (id_token and access_token)
        // Don't wait too long - user can still use the app
        const sessionWithIdToken = session as any;
        const idToken = sessionWithIdToken.id_token;
        
        const backendTokenPromise = Promise.any([
          idToken
            ? fetchWithTimeout(`${API_URL}/api/auth/google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: idToken }),
              }).then(r => r.json()).then(d => d.success ? d.data?.token : null)
            : Promise.resolve(null),
          session.access_token
            ? fetchWithTimeout(`${API_URL}/api/auth/supabase-exchange`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ access_token: session.access_token }),
              }).then(r => r.json()).then(d => d.success ? d.data?.token : null)
            : Promise.resolve(null),
        ]).catch(() => null);

        // Store user info
        if (user) {
          localStorage.setItem('user', JSON.stringify({
            id: user.id,
            email: user.email,
            name: user.user_metadata?.full_name,
            avatar: user.user_metadata?.avatar_url,
            provider: 'GOOGLE',
          }));
        }

        // Try to get backend token (non-blocking, don't wait too long)
        const token = await Promise.race([
          backendTokenPromise,
          new Promise<string | null>(resolve => setTimeout(() => resolve(null), 3000)),
        ]);
        
        if (token) {
          localStorage.setItem('token', token);
        }

        // Redirect immediately - auth is complete
        router.push(redirectTo);
      } catch (err: any) {
        console.error('Auth callback error:', err);
        setError(err.message || 'Authentication failed');
      }
    };

    handleCallback();
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Authentication Failed</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => router.push('/login')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  // Loading state - minimal, just show spinner
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Signing you in...</p>
      </div>
    </div>
  );
}
