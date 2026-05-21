import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Header } from "@/components/Header";
import UploadArea from "@/components/UploadArea";
import ImagePreview from "@/components/ImagePreview";
import FeatureCard from "@/components/FeatureCard";
import FAQSection from "@/components/FAQSection";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Background Remover - Remove Image Backgrounds Online Free",
  description: "Free AI-powered background remover. Remove image backgrounds instantly in your browser. 100% privacy - no uploads, no tracking, all processing done client-side. Fast, secure, and completely free to use.",
  keywords: [
    "free background remover",
    "remove background online",
    "AI background remover free",
    "online background remover",
    "remove bg online",
    "transparent background maker",
    "image background remover",
    "privacy-focused image editing",
    "client-side image processing",
    "AI image editing",
  ],
  openGraph: {
    title: "AI Background Remover - Free Online Background Removal",
    description: "Remove image backgrounds instantly with AI. 100% privacy protection - all processing in your browser.",
    url: "https://www.background-remover-tools.online/",
    images: [
      {
        url: "https://www.background-remover-tools.online/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AI Background Remover - Remove Image Backgrounds Online",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Background Remover - Free Online Background Removal",
    description: "AI-powered background remover with complete privacy. All processing happens in your browser.",
    images: [
      {
        url: "https://www.background-remover-tools.online/twitter-image.jpg",
        width: 1200,
        height: 630,
        alt: "AI Background Remover",
        type: "image/jpeg",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
};

export const viewport = {
  themeColor: "hsl(var(--primary))",
};

export default function Home() {
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <Header />
      </div>

      {/* Value Proposition */}
      <section className="text-center mx-auto max-w-3xl py-12 px-4">
        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-4">
          Remove Image Backgrounds Instantly
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Fast, private, and 100% client-side background removal. No uploads, no data collection, no servers.
        </p>
        <UploadArea />
      </section>

      {/* Feature Highlights */}
      <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
          Why Choose Us?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: "⚡",
              title: "Ultra-Fast",
              description: "Backgrounds processed in 2-5 seconds, even on mobile devices.",
            },
            {
              icon: "🛡️",
              title: "Privacy-First",
              description: "All processing happens in your browser – your images never leave your device.",
            },
            {
              icon: "📱",
              title: "Mobile-Ready",
              description: "Perfectly responsive design for smartphones, tablets, and desktops.",
            },
            {
              icon: "🔒",
              title: "100% Secure",
              description: "No servers, no accounts, no tracking. Your data stays yours.",
            },
            {
              icon: "🎯",
              title: "No Sign-Up Required",
              description: "Get instant results without creating an account.",
            },
            {
              icon: "🎨",
              title: "Easy Editing",
              description: "Adjust edges, add new backgrounds, and fine-tune results.",
            },
          ].map((feature) => (
            <FeatureCard
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </section>

      {/* FAQ */}
      <FAQSection />

      <footer className="mt-16 py-8 px-6 text-center text-sm text-gray-600 border-t border-gray-200 max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-center gap-6 mb-4">
          <Link href="/privacy-policy" className="hover:text-gray-900">Privacy Policy</Link>
          <Link href="/terms-of-service" className="hover:text-gray-900">Terms of Service</Link>
          <Link href="/cookie-policy" className="hover:text-gray-900">Cookie Policy</Link>
        </div>
        <p>© {new Date().getFullYear()} AI Background Remover. All rights reserved.</p>
        <p className="mt-2">Contact: <a href="mailto:support@background-remover-tools.online" className="text-blue-600">support@background-remover-tools.online</a></p>
      </footer>
    </>
  );
}