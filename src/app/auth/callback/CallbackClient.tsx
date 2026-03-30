'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function CallbackClient() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      if (!supabase) {
        setError('Supabase not configured');
        setLoading(false);
        return;
      }

      try {
        // Extract redirect URL from query params before Supabase processes them
        const urlParams = new URLSearchParams(window.location.search);
        const redirectTo = urlParams.get('redirect') || '/';

        // Get the session from Supabase callback URL (handled by Supabase SDK)
        const { data: { session }, error: supabaseError } = await supabase.auth.getSession();
        console.log('Callback: session received', !!session, session?.user?.email);

        if (supabaseError) {
          throw new Error(supabaseError.message);
        }

        if (!session) {
          throw new Error('No session received from Supabase');
        }

        console.log('Supabase session received:', !!session.access_token);

        // Store Supabase tokens in localStorage
        localStorage.setItem('supabase_access_token', session.access_token);
        if (session.refresh_token) {
          localStorage.setItem('supabase_refresh_token', session.refresh_token);
        }

        // Get user info from Supabase
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError) {
          throw new Error(userError.message);
        }

        console.log('Supabase user:', user?.email);

        // Exchange Supabase token for our backend JWT
        // This is required so backend APIs (quota, etc.) can authenticate the user
        let backendToken: string | null = null;
        try {
          // Try using id_token first (may be Google ID token)
          // Cast to any because TypeScript may not know about id_token on Session type
          const sessionWithIdToken = session as any;
          if (sessionWithIdToken.id_token) {
            const backendRes = await fetch(`${API_URL}/api/auth/google`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token: sessionWithIdToken.id_token }),
            });
            
            if (backendRes.ok) {
              const backendData = await backendRes.json();
              if (backendData.success && backendData.data?.token) {
                backendToken = backendData.data.token;
                console.log('Backend JWT received via id_token');
              }
            }
          }
          
          // Fallback: try supabase-exchange endpoint with access_token
          if (!backendToken && session.access_token) {
            const backendRes = await fetch(`${API_URL}/api/auth/supabase-exchange`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ access_token: session.access_token }),
            });
            
            if (backendRes.ok) {
              const backendData = await backendRes.json();
              if (backendData.success && backendData.data?.token) {
                backendToken = backendData.data.token;
                console.log('Backend JWT received via supabase-exchange');
              }
            }
          }
        } catch (e) {
          console.warn('Failed to get backend JWT:', e);
        }

        // Store backend JWT if received
        if (backendToken) {
          localStorage.setItem('token', backendToken);
        }

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

        // Redirect to original destination (e.g. /pricing after OAuth from login)
        router.push(redirectTo);
      } catch (err: any) {
        console.error('Auth callback error:', err);
        setError(err.message || 'Authentication failed');
        setLoading(false);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Signing you in...</p>
        </div>
      </div>
    );
  }

  return null;
}
