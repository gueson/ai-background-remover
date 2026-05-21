import { Suspense } from 'react';
import { Metadata } from 'next';
import { PricingPage } from './PricingClient';

export const metadata: Metadata = {
  title: 'Pricing - AI Background Remover | Free and Premium Plans',
  description: 'Simple, transparent pricing for AI Background Remover. Start free with basic features, upgrade to premium for advanced capabilities. No hidden fees, cancel anytime.',
  keywords: [
    'background remover pricing',
    'AI background remover cost',
    'image editing pricing',
    'free background remover',
    'premium background remover',
    'subscription plans',
    'image processing pricing',
  ],
  openGraph: {
    title: 'Pricing - AI Background Remover',
    description: 'Simple, transparent pricing. Start free, upgrade when you need more.',
    url: 'https://www.background-remover-tools.online/pricing',
  },
  robots: {
    index: true,
    follow: true,
  },
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
