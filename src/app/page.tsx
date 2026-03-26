import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/Header";
import UploadArea from "@/components/UploadArea";
import ImagePreview from "@/components/ImagePreview";
import FeatureCard from "@/components/FeatureCard";
import FAQSection from "@/components/FAQSection";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Background Remover – Remove Backgrounds Online",
  description: "Privacy-first image background removal. Upload photos directly in your browser – no uploads, no tracking, 100% client-side processing.",
  keywords: [
    "background remover",
    "image processing",
    "privacy-focused",
    "client-side AI",
    "AI tools",
    "fast image editing",
  ],
  openGraph: {
    title: "AI Background Remover",
    description: "Remove image backgrounds instantly in your browser",
    images: [
      {
        url: "",
        width: 1200,
        height: 630,
        alt: "AI Background Remover – Remove Backgrounds Online",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "AI Background Remover",
    description: "Privacy-first image background removal",
    images: [
      {
        url: "",
        width: 1200,
        height: 630,
        alt: "AI Background Remover – Remove Backgrounds Online",
      },
    ],
  },
  themeColor: "hsl(var(--primary))",
};

export const viewport = {
  themeColor: "hsl(var(--primary))",
};

export default function Home() {
  return (
    <>
      <Header />

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
        © {new Date().getFullYear()} AI Background Remover. All rights reserved.
      </footer>
    </>
  );
}