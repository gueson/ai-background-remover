import { Suspense } from 'react';
import { Metadata } from 'next';
import { PricingPage } from './PricingClient';

export const metadata: Metadata = {
  title: 'Pricing – RemoveBG',
  description: 'Simple, transparent pricing for RemoveBG. Start free, upgrade when you need more.',
};

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
}

export default function PricingPageWrapper() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PricingPage />
    </Suspense>
  );
}
