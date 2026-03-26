'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { Header } from '@/components/Header';

export default function PricingPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '' });

  const showModal = (title: string, message: string) => {
    setModalContent({ title, message });
    setModalOpen(true);
  };

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
      onCtaClick: () => showModal('Get Started', 'You can start using the tool immediately! No signup required. Your free plan includes 10 images per month.'),
    },
    {
      name: 'Pro',
      price: '$9',
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
      cta: 'Start Free Trial',
      popular: true,
      onCtaClick: () => showModal('Pro Plan', 'Pro features are coming soon! This will include unlimited images, API access, and priority processing. Leave your email to get notified when it launches.'),
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
      onCtaClick: () => showModal('Enterprise', 'Enterprise solutions are available for organizations needing custom quotas, dedicated support, and on-premise deployment. Contact us for pricing.'),
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
      <Header />

      {/* Hero */}
      <section className="text-center mx-auto max-w-3xl py-16 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          Start free, upgrade when you need more.
        </p>
        <p className="text-gray-500 text-sm">
          All plans include our core background removal features.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 px-4 md:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`p-8 rounded-2xl border-2 ${
                plan.popular
                  ? 'border-blue-500 shadow-lg relative'
                  : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-gray-500 ml-1">{plan.period}</span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mt-2">
                  {plan.description}
                </p>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                onClick={plan.onCtaClick}
                className="w-full"
                variant={plan.popular ? 'primary' : 'outline'}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 px-4 md:px-8 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
          Compare Plans
        </h2>
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
              <tr className="border-b border-gray-100">
                <td className="py-4 px-6 text-gray-700">Monthly images</td>
                <td className="py-4 px-6 text-center">10</td>
                <td className="py-4 px-6 text-center font-medium text-blue-600">Unlimited</td>
                <td className="py-4 px-6 text-center">Unlimited</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-4 px-6 text-gray-700">Output quality</td>
                <td className="py-4 px-6 text-center">Standard</td>
                <td className="py-4 px-6 text-center font-medium text-blue-600">HD</td>
                <td className="py-4 px-6 text-center">HD+</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-4 px-6 text-gray-700">Processing priority</td>
                <td className="py-4 px-6 text-center">Normal</td>
                <td className="py-4 px-6 text-center font-medium text-blue-600">High</td>
                <td className="py-4 px-6 text-center">Highest</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-4 px-6 text-gray-700">API access</td>
                <td className="py-4 px-6 text-center">✗</td>
                <td className="py-4 px-6 text-center font-medium text-blue-600">✓</td>
                <td className="py-4 px-6 text-center">✓</td>
              </tr>
              <tr>
                <td className="py-4 px-6 text-gray-700">Support</td>
                <td className="py-4 px-6 text-center">Community</td>
                <td className="py-4 px-6 text-center font-medium text-blue-600">Email</td>
                <td className="py-4 px-6 text-center">Dedicated</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 md:px-8 bg-gray-50 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {faqs.map((faq) => (
            <div key={faq.question} className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Still have questions?
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Our team is here to help. Contact us anytime.
          </p>
          <Button variant="outline" onClick={() => showModal('Contact Support', 'You can reach us at support@removebg.example.com. We typically respond within 24 hours.')}>
            Contact Support
          </Button>
        </div>
      </section>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle>{modalContent.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">{modalContent.message}</p>
              <Button onClick={() => setModalOpen(false)} className="w-full">
                Got it
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Footer */}
      <footer className="py-8 px-6 text-center text-sm text-gray-600 border-t border-gray-200 max-w-7xl mx-auto">
        © {new Date().getFullYear()} AI Background Remover. All rights reserved.
      </footer>
    </div>
  );
}
