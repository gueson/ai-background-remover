'use client';

import { AuthProvider } from '@/lib/authContext';
import { Analytics } from '@vercel/analytics/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <Analytics />
    </AuthProvider>
  );
}
