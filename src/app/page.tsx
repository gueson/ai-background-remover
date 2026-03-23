"use client";

import { useState } from "react";
import { UploadArea } from "@/components/UploadArea";
import { FeaturesSection } from "@/components/FeaturesSection";
import { FAQSection } from "@/components/FAQSection";
import Header from "@/components/Header";

export default function HomePage() {
  const [processingResult, setProcessingResult] = useState<any>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            AI-Powered Background Remover
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            Privacy-first image background removal. All processing happens 
            in your browser — no uploads, no tracking, completely free.
          </p>
          
          <div className="max-w-3xl mx-auto">
            <UploadArea onResult={setProcessingResult} />
          </div>
        </section>

        {/* Features */}
        <FeaturesSection />

        {/* FAQ */}
        <FAQSection />
      </main>

      <footer className="mt-16 py-8 text-center text-gray-500">
        <p>&copy; 2024 AI Background Remover. Privacy-focused tool.</p>
      </footer>
    </div>
  );
}