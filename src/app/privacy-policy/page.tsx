import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';

export const metadata: Metadata = {
  title: 'Privacy Policy - AI Background Remover | Your Privacy Matters',
  description: 'Learn how we protect your privacy. All image processing happens locally in your browser - your images never leave your device. No data collection, no tracking, complete privacy protection.',
  keywords: [
    'privacy policy',
    'AI background remover privacy',
    'image processing privacy',
    'data protection',
    'privacy-focused image editing',
    'no data collection',
    'client-side processing',
  ],
  openGraph: {
    title: 'Privacy Policy - AI Background Remover',
    description: 'Learn how we protect your privacy with client-side processing.',
    url: 'https://www.background-remover-tools.online/privacy-policy',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <Header />
        
        <main className="py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">
            Last updated: May 21, 2026
          </p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Introduction</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              At AI Background Remover, we are committed to protecting your privacy. Our tool is designed with privacy as the top priority. All image processing is performed locally in your browser, which means your images never leave your device and are never uploaded to our servers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Collection</h2>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No Image Data Collection</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              We do not collect, store, or transmit any of your image data. All background removal processing happens locally in your web browser using client-side AI technology. Your images remain entirely under your control.
            </p>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Usage Data (Optional)</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              If you create an account, we may collect basic account information such as your email address for authentication purposes. This information is stored securely and is never shared with third parties.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cookies</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We use cookies to enhance your experience on our website. You can manage your cookie preferences through your browser settings. For more information, please see our{' '}
              <Link href="/cookie-policy" className="text-blue-600 hover:underline">
                Cookie Policy
              </Link>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Third-Party Services</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our website may use third-party services for authentication (Google OAuth) and analytics. These services have their own privacy policies, and we encourage you to review them.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Rights</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              You have the right to access, correct, or delete any personal information we may hold. Since we do not process or store your images, there is no image data to manage.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to This Policy</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at{' '}
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
