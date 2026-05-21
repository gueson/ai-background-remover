import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';

export const metadata: Metadata = {
  title: 'Terms of Service - AI Background Remover | Service Agreement',
  description: 'Terms and conditions for using AI Background Remover service. Understand your rights and responsibilities when using our background removal tool.',
  keywords: [
    'terms of service',
    'service agreement',
    'terms and conditions',
    'AI background remover terms',
    'image editing terms',
    'online service terms',
  ],
  openGraph: {
    title: 'Terms of Service - AI Background Remover',
    description: 'Terms and conditions for using our service.',
    url: 'https://www.background-remover-tools.online/terms-of-service',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <Header />
        
        <main className="py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
          <p className="text-gray-600 mb-8">
            Last updated: May 21, 2026
          </p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Introduction</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              These Terms of Service ("Terms") govern your use of the AI Background Remover website and services ("Service"). By accessing or using our Service, you agree to be bound by these Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Use of Service</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              You may use our Service for personal and commercial purposes. You agree not to misuse the Service or use it for any illegal or unauthorized purpose.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Intellectual Property</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              The Service and its original content, features, and functionality are and will remain the exclusive property of AI Background Remover. You retain all rights to the images you process using our Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Disclaimer of Warranties</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              The Service is provided "as is" and "as available" without any warranties of any kind. We do not guarantee that the Service will be uninterrupted or error-free.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Limitation of Liability</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              In no event shall AI Background Remover be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to Terms</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We reserve the right to modify or replace these Terms at any time. Your continued use of the Service after any changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Governing Law</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              If you have any questions about these Terms, please contact us at{' '}
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
