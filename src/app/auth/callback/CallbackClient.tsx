'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

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
