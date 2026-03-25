'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { googleAuth, saveToken } from '@/lib/auth';

export function CallbackClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      router.replace('/login?error=' + encodeURIComponent(error));
      return;
    }

    if (!code) {
      router.replace('/login?error=no_code');
      return;
    }

    // Exchange code for token at backend
    googleAuth(code, 'code')
      .then((res) => {
        saveToken(res.data.token);
        router.replace('/');
      })
      .catch((err) => {
        router.replace('/login?error=' + encodeURIComponent(err.message));
      });
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-gray-600">Signing in...</p>
      </div>
    </div>
  );
}
