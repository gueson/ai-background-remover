'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { Header } from '@/components/Header';
import { useAuth } from '@/lib/authContext';

declare global {
  interface Window {
    paypal?: {
      Buttons: (config: any) => { render: (selector: string) => void };
    };
  }
}

export function PricingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '' });
  const [paypalReady, setPaypalReady] = useState(false);
  const [paypalError, setPaypalError] = useState('');
  const [loadingPaypal, setLoadingPaypal] = useState(false);
  const [proPlanLoading, setProPlanLoading] = useState(false);
  const paypalContainerRef = useRef<HTMLDivElement>(null);
  const paypalRendered = useRef(false);

  const success = searchParams.get('success');
  const canceled = searchParams.get('canceled');

  const showModal = (title: string, message: string) => {
    setModalContent({ title, message });
    setModalOpen(true);
  };

  // Load PayPal JS SDK
  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    if (!clientId) {
      console.log('PayPal Client ID not configured');
      setPaypalError('PayPal is not configured on this site.');
      return;
    }

    // Avoid double-loading
    if (document.querySelector(`script[src*="paypal.com/sdk"]`)) {
      if (window.paypal) setPaypalReady(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&intent=subscription&vault=true`;
    script.async = true;
    script.onload = () => {
      console.log('PayPal SDK loaded');
      setPaypalReady(true);
    };
    script.onerror = () => {
      console.error('Failed to load PayPal SDK');
      setPaypalError('Failed to load PayPal. Please check your internet connection.');
    };
    document.body.appendChild(script);
  }, []);

  // Pricing for inline plans (no pre-created Plan ID needed)
  const PLAN_PRICE = process.env.NEXT_PUBLIC_PAYPAL_PLAN_PRICE || '1.00';
  const PLAN_ID = process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID;

  // Render PayPal button when SDK is ready + user is authenticated
  useEffect(() => {
    if (!paypalReady || !window.paypal || !paypalContainerRef.current) return;
    if (!user) return; // Wait for user to be logged in
    if (paypalRendered.current) return; // Already rendered

    paypalRendered.current = true;

    window.paypal.Buttons({
      style: {
        layout: 'vertical',
        color: 'blue',
        shape: 'rect',
        label: 'subscribe',
        height: 45,
      },
      createSubscription: async (_data: any, actions: any) => {
        setLoadingPaypal(true);
        return actions.subscription.create({
          plan_id: PLAN_ID,
        });
      },
      onApprove: async (_data: any, actions: any) => {
        window.location.href = '/pricing?success=true&subscribed=true';
        setLoadingPaypal(false);
      },
      onError: (err: any) => {
        console.error('PayPal error:', err);
        setPaypalError('Payment failed. Please try again.');
        setLoadingPaypal(false);
      },
      onCancel: () => {
        window.location.href = '/pricing?canceled=true';
      },
    }).render('#paypal-button-container');
  }, [paypalReady, user, PLAN_PRICE, PLAN_ID]);

  const handleProClick = () => {
    if (authLoading) {
      setProPlanLoading(true);
      return;
    }
    if (!user) {
      // Redirect to login, then back to pricing to continue payment
      router.push('/login?redirect=/pricing');
      return;
    }
    // User is logged in — PayPal button is already showing (or loading)
  };

  // When auth finishes loading and user is set, ensure PayPal re-renders
  useEffect(() => {
    if (!authLoading && user && paypalReady && !paypalRendered.current && paypalContainerRef.current) {
      paypalRendered.current = true;
      if (window.paypal) {
        window.paypal.Buttons({
          style: {
            layout: 'vertical',
            color: 'blue',
            shape: 'rect',
            label: 'subscribe',
            height: 45,
          },
          createSubscription: async (_data: any, actions: any) => {
            setLoadingPaypal(true);
            return actions.subscription.create({
              plan_id: PLAN_ID,
            });
          },
          onApprove: async (_data: any, actions: any) => {
            window.location.href = '/pricing?success=true&subscribed=true';
            setLoadingPaypal(false);
          },
          onError: (err: any) => {
            console.error('PayPal error:', err);
            setPaypalError('Payment failed. Please try again.');
            setLoadingPaypal(false);
          },
          onCancel: () => {
            window.location.href = '/pricing?canceled=true';
          },
        }).render('#paypal-button-container');
      }
    }
  }, [authLoading, user, paypalReady, PLAN_PRICE, PLAN_ID]);

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for occasional use',
      features: [
        '10 images per month',
        'Basic background removal',
        'PNG and JPG export',
        'Standard processing speed',
        'Community support',
      ],
      cta: 'Get Started',
      popular: false,
      onCtaClick: () => { window.location.href = '/'; },
    },
    {
      name: 'Pro',
      price: PLAN_PRICE === '1.00' ? '$1' : '$9',
      period: '/month',
      description: 'For professionals and teams',
      features: [
        'Unlimited images',
        'HD quality output',
        'All formats supported',
        'Priority processing',
        'API access',
        'Email support',
      ],
      cta: authLoading ? 'Loading...' : !user ? 'Subscribe Now' : loadingPaypal ? 'Connecting to PayPal...' : 'Subscribe',
      popular: true,
      onCtaClick: handleProClick,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For organizations with scale needs',
      features: [
        'Everything in Pro',
        'Custom quotas',
        'Dedicated support',
        'Custom integration',
        'SLA guarantee',
        'On-premise option',
      ],
      cta: 'Contact Sales',
      popular: false,
      onCtaClick: () => showModal('Enterprise', 'Enterprise solutions available. Contact enterprise@removebg.example.com for pricing and custom quotas.'),
    },
  ];

  const faqs = [
    {
      question: 'How does the free plan work?',
      answer: 'The free plan gives you 10 image credits per month. Credits reset on the 1st of each month and do not roll over.',
    },
    {
      question: 'Can I upgrade or downgrade anytime?',
      answer: 'Yes! You can change your plan at any time. Changes take effect immediately, and we prorate any differences.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, Mastercard, American Express) and PayPal.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Absolutely. All processing happens locally in your browser. We never see or store your images.',
    },
    {
      question: 'Do you offer refunds?',
      answer: 'Yes, we offer a 30-day money-back guarantee for all paid plans. No questions asked.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <Header />
      </div>

      {success === 'true' && (
        <div className="bg-green-50 border-b border-green-200 py-4 px-4 text-center">
          <p className="text-green-700 font-medium">
            ✅ Payment successful! Welcome to Pro. Your subscription is now active.
          </p>
        </div>
      )}

      {canceled === 'true' && (
        <div className="bg-yellow-50 border-b border-yellow-200 py-4 px-4 text-center">
          <p className="text-yellow-700">Payment was canceled. No charge was made.</p>
        </div>
      )}

      <section className="text-center mx-auto max-w-3xl py-16 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-lg text-gray-600 mb-4">Start free, upgrade when you need more.</p>
      </section>

      <section className="py-16 px-4 md:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`p-8 rounded-2xl border-2 ${plan.popular ? 'border-blue-500 shadow-lg relative' : 'border-gray-200'}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">Most Popular</span>
                </div>
              )}
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  {plan.period && <span className="text-gray-500 ml-1">{plan.period}</span>}
                </div>
                <p className="text-gray-600 text-sm mt-2">{plan.description}</p>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              {plan.name === 'Pro' ? (
                <div>
                  {paypalError && (
                    <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600 text-center">
                      {paypalError}
                    </div>
                  )}
                  {user && paypalReady ? (
                    <div id="paypal-button-container" ref={paypalContainerRef} className={loadingPaypal ? 'opacity-50 pointer-events-none' : ''} />
                  ) : (
                    <Button
                      onClick={plan.onCtaClick}
                      className="w-full"
                      variant="primary"
                      disabled={authLoading || proPlanLoading}
                    >
                      {plan.cta}
                    </Button>
                  )}
                  {!user && !authLoading && (
                    <p className="text-center text-xs text-gray-400 mt-2">
                      Login required before subscribing
                    </p>
                  )}
                </div>
              ) : (
                <Button
                  onClick={plan.onCtaClick}
                  className="w-full"
                  variant={plan.popular ? 'primary' : 'outline'}
                >
                  {plan.cta}
                </Button>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 px-4 md:px-8 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Compare Plans</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-4 px-6 text-left font-semibold text-gray-900">Feature</th>
                <th className="py-4 px-6 text-center font-semibold text-gray-900">Free</th>
                <th className="py-4 px-6 text-center font-semibold text-blue-600">Pro</th>
                <th className="py-4 px-6 text-center font-semibold text-gray-900">Enterprise</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[
                ['Monthly images', '10', 'Unlimited', 'Unlimited'],
                ['Output quality', 'Standard', 'HD', 'HD+'],
                ['Processing priority', 'Normal', 'High', 'Highest'],
                ['API access', '✗', '✓', '✓'],
                ['Support', 'Community', 'Email', 'Dedicated'],
              ].map(([feature, free, pro, enterprise]) => (
                <tr key={feature as string} className="border-b border-gray-100">
                  <td className="py-4 px-6 text-gray-700">{feature}</td>
                  <td className="py-4 px-6 text-center">{free}</td>
                  <td className="py-4 px-6 text-center font-medium text-blue-600">{pro}</td>
                  <td className="py-4 px-6 text-center">{enterprise}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="py-16 px-4 md:px-8 bg-gray-50 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {faqs.map((faq) => (
            <div key={faq.question} className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="text-center py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Still have questions?</h2>
          <p className="text-lg text-gray-600 mb-6">Our team is here to help. Contact us anytime.</p>
          <Button variant="outline" onClick={() => showModal('Contact Support', 'support@removebg.example.com')}>
            Contact Support
          </Button>
        </div>
      </section>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardHeader><CardTitle>{modalContent.title}</CardTitle></CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">{modalContent.message}</p>
              <Button onClick={() => setModalOpen(false)} className="w-full">Got it</Button>
            </CardContent>
          </Card>
        </div>
      )}

      <footer className="py-8 px-6 text-center text-sm text-gray-600 border-t border-gray-200 max-w-7xl mx-auto">
        © {new Date().getFullYear()} RemoveBG. All rights reserved.
      </footer>
    </div>
  );
}
