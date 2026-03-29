'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { Header } from '@/components/Header';

export function ResetPasswordClient() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setError('Supabase not configured.');
      return;
    }

    const supabaseClient = supabase;
    let subscription: { unsubscribe: () => void } | null = null;

    const exchangeTokenForSession = async (token: string) => {
      // Call Supabase /verify endpoint to exchange the recovery token for a session
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=recovery`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''}`,
        },
        body: JSON.stringify({
          email: '', // Not needed when using token
          token,
          type: 'recovery',
        }),
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      if (data.error) {
        return null;
      }

      // Set the session in Supabase client
      const { data: sessionData, error } = await supabaseClient.auth.setSession({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      });

      if (error) {
        console.error('setSession error:', error);
        return null;
      }

      return sessionData.session;
    };

    const checkSession = async () => {
      // Check URL hash for errors from Supabase redirect (error=access_denied, etc.)
      const hashParams = new URLSearchParams(window.location.hash.slice(1));
      const hashError = hashParams.get('error');
      const hashErrorDesc = hashParams.get('error_description');

      if (hashError) {
        // Clear the hash error from URL to keep UI clean
        window.history.replaceState(null, '', window.location.pathname);
        if (hashErrorDesc) {
          setError(decodeURIComponent(hashErrorDesc.replace(/\+/g, ' ')));
        } else if (hashError === 'otp_expired') {
          setError('This reset link has expired. Please request a new one.');
        } else {
          setError('Reset link is invalid. Please request a new one.');
        }
        return false;
      }

      // Check URL for token in query params (from custom email template flow)
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const type = urlParams.get('type');

      if (token && type === 'recovery') {
        // Exchange token for session
        const session = await exchangeTokenForSession(token);
        if (session) {
          setReady(true);
          return true;
        }
        // Token exchange failed
        setError('This reset link is invalid or has expired. Please request a new one.');
        return false;
      }

      // Fallback: try getSession (for hash-based token from original flow)
      const { data: { session } } = await supabaseClient.auth.getSession();
      if (session) {
        setReady(true);
        return true;
      }
      return false;
    };

    // Set up auth state listener
    const setupListener = () => {
      subscription = supabaseClient.auth.onAuthStateChange((event, session) => {
        if (event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN') {
          if (session) {
            setReady(true);
            setError('');
          }
        }
      }).data.subscription;
    };

    checkSession().then((found) => {
      if (!found) {
        setupListener();
        setTimeout(async () => {
          const { data: { session } } = await supabaseClient.auth.getSession();
          if (session) {
            setReady(true);
          } else if (!ready) {
            setError('Invalid or expired reset link. Please request a new one.');
          }
        }, 1000);
      }
    });

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    if (!supabase) {
      setError('Supabase not configured.');
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setDone(true);
    setLoading(false);
  };

  if (done) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <Header />
        </div>
        <main className="flex items-center justify-center py-16 px-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center">Password Updated</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                Your password has been reset successfully.
                <br />You can now sign in with your new password.
              </p>
              <div className="pt-4">
                <Link href="/login">
                  <Button className="w-full">Sign In</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (!ready && !error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <Header />
        </div>
        <main className="flex items-center justify-center py-16 px-4">
          <Card className="w-full max-w-md">
            <CardContent className="text-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Verifying reset link...</p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <Header />
      </div>

      <main className="flex items-center justify-center py-16 px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Set New Password</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
                {!ready && (
                  <div className="mt-3">
                    <Link href="/forgot-password">
                      <Button variant="outline" size="sm" className="w-full">
                        Request New Link
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}

            {ready && (
              <form onSubmit={handleReset} className="space-y-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    New password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 pr-10"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm new password
                  </label>
                  <input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    autoComplete="new-password"
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Password'}
                </Button>
              </form>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                <Link href="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                  Back to Sign In
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="py-8 px-6 text-center text-sm text-gray-600 border-t border-gray-200 max-w-7xl mx-auto">
        © {new Date().getFullYear()} RemoveBG. All rights reserved.
      </footer>
    </div>
  );
}
