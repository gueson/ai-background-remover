import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';

export const metadata: Metadata = {
  title: 'Cookie Policy - AI Background Remover | Cookie Preferences',
  description: 'Learn about how we use cookies on our website and how to manage your cookie preferences. We use cookies to enhance your browsing experience.',
  keywords: [
    'cookie policy',
    'cookie preferences',
    'website cookies',
    'AI background remover cookies',
    'cookie management',
    'privacy settings',
  ],
  openGraph: {
    title: 'Cookie Policy - AI Background Remover',
    description: 'Learn about how we use cookies and how to manage your preferences.',
    url: 'https://www.background-remover-tools.online/cookie-policy',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <Header />
        
        <main className="py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Cookie Policy</h1>
          <p className="text-gray-600 mb-8">
            Last updated: May 21, 2026
          </p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">What Are Cookies?</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and to provide information to the website owners.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Types of Cookies We Use</h2>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Essential Cookies</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              These cookies are necessary for the website to function properly. They enable basic functions like page navigation and access to secure areas of the website.
            </p>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Analytics Cookies</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
            </p>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Authentication Cookies</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              If you create an account, these cookies are used to remember your login information and keep you logged in.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">How to Manage Cookies</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              You can manage your cookie preferences through your browser settings. Most browsers allow you to block or delete cookies. Please note that blocking essential cookies may affect the functionality of our website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to This Policy</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              If you have any questions about this Cookie Policy, please contact us at{' '}
              <a href="mailto:support@background-remover-tools.online" className="text-blue-600 hover:underline">
                support@background-remover-tools.online
              </a>.
            </p>
          </section>
        </main>

        <footer className="mt-16 py-8 px-6 text-center text-sm text-gray-600 border-t border-gray-200">
          <div className="flex flex-wrap justify-center gap-6 mb-4">
            <Link href="/privacy-policy" className="hover:text-gray-900">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-gray-900">Terms of Service</Link>
            <Link href="/cookie-policy" className="hover:text-gray-900">Cookie Policy</Link>
          </div>
          <p>© {new Date().getFullYear()} AI Background Remover. All rights reserved.</p>
          <p className="mt-2">Contact: <a href="mailto:support@background-remover-tools.online" className="text-blue-600">support@background-remover-tools.online</a></p>
        </footer>
      </div>
    </div>
  );
}
