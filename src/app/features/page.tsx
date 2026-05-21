import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { Header } from '@/components/Header';

export const metadata: Metadata = {
  title: 'Features - AI Background Remover | Powerful Image Background Removal',
  description: 'Discover the powerful features of our AI background remover. Lightning-fast processing, 100% privacy protection, cross-platform compatibility, and more. Remove backgrounds instantly in your browser.',
  keywords: [
    'AI background remover features',
    'background remover tool features',
    'online image editing features',
    'client-side image processing',
    'privacy-focused image editing',
    'fast background removal',
    'AI-powered image editing',
  ],
  openGraph: {
    title: 'Features - AI Background Remover',
    description: 'Discover the powerful features of our AI-powered background removal tool.',
    url: 'https://www.background-remover-tools.online/features',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function FeaturesPage() {
  const features = [
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Process images in just 2-5 seconds. Our optimized AI model delivers instant results without compromising quality.',
    },
    {
      icon: '🛡️',
      title: '100% Privacy',
      description: 'All processing happens directly in your browser. Your images never leave your device, ensuring complete privacy and security.',
    },
    {
      icon: '🎯',
      title: 'AI-Powered Precision',
      description: 'Advanced AI technology accurately detects and removes backgrounds, even around fine details like hair and transparent objects.',
    },
    {
      icon: '📱',
      title: 'Works Everywhere',
      description: 'Fully responsive design that works perfectly on desktop, tablet, and mobile devices.',
    },
    {
      icon: '🎨',
      title: 'Multiple Formats',
      description: 'Support for PNG, JPG, JPEG, and WEBP. Export your processed images in the format that best suits your needs.',
    },
    {
      icon: '🔧',
      title: 'Easy Integration',
      description: 'Simple API available for developers who want to integrate background removal into their own applications.',
    },
  ];

  const useCases = [
    {
      title: 'E-Commerce',
      description: 'Create professional product images with clean backgrounds. Perfect for online stores and marketplaces.',
    },
    {
      title: 'Photography',
      description: 'Quickly remove distracting backgrounds from portraits and event photos.',
    },
    {
      title: 'Graphic Design',
      description: 'Isolate subjects for collages, presentations, and marketing materials.',
    },
    {
      title: 'Social Media',
      description: 'Create eye-catching posts with transparent backgrounds. Stand out in crowded feeds.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <Header />
      </div>

      {/* Hero */}
      <section className="text-center mx-auto max-w-3xl py-16 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Powerful Features for Perfect Results
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Everything you need to remove backgrounds quickly, accurately, and securely.
        </p>
        <Link href="/">
          <Button>Try It Free</Button>
        </Link>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Core Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 px-4 md:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Perfect For Every Use Case
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase) => (
              <div
                key={useCase.title}
                className="bg-white p-6 rounded-lg shadow-sm"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {useCase.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {useCase.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-16 px-4 md:px-8 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Why Choose Our Tool?
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-4 px-6 text-left font-semibold text-gray-900">Feature</th>
                <th className="py-4 px-6 text-center font-semibold text-gray-900">Us</th>
                <th className="py-4 px-6 text-center font-semibold text-gray-500">Others</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-4 px-6 text-gray-700">100% Client-Side</td>
                <td className="py-4 px-6 text-center text-green-600">✓</td>
                <td className="py-4 px-6 text-center text-red-500">✗</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-4 px-6 text-gray-700">No Registration</td>
                <td className="py-4 px-6 text-center text-green-600">✓</td>
                <td className="py-4 px-6 text-center text-red-500">✗</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-4 px-6 text-gray-700">Free to Use</td>
                <td className="py-4 px-6 text-center text-green-600">✓</td>
                <td className="py-4 px-6 text-center text-gray-500">Limited</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-4 px-6 text-gray-700">Privacy Protected</td>
                <td className="py-4 px-6 text-center text-green-600">✓</td>
                <td className="py-4 px-6 text-center text-red-500">✗</td>
              </tr>
              <tr>
                <td className="py-4 px-6 text-gray-700">Instant Results</td>
                <td className="py-4 px-6 text-center text-green-600">✓</td>
                <td className="py-4 px-6 text-center text-gray-500">Varies</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-16 px-4 bg-blue-50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Remove backgrounds from your images in seconds. No signup required.
          </p>
          <Link href="/">
            <Button size="lg">Try It Now</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center text-sm text-gray-600 border-t border-gray-200 max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-center gap-6 mb-4">
          <Link href="/privacy-policy" className="hover:text-gray-900">Privacy Policy</Link>
          <Link href="/terms-of-service" className="hover:text-gray-900">Terms of Service</Link>
          <Link href="/cookie-policy" className="hover:text-gray-900">Cookie Policy</Link>
        </div>
        <p>© {new Date().getFullYear()} AI Background Remover. All rights reserved.</p>
        <p className="mt-2">Contact: <a href="mailto:support@background-remover-tools.online" className="text-blue-600">support@background-remover-tools.online</a></p>
      </footer>
    </div>
  );
}
