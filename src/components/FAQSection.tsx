'use client';

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "How does this tool protect my privacy?",
    answer: "All image processing is done locally in your browser. Your images never leave your device and are never uploaded to any server. We do not collect, store, or transmit any of your data."
  },
  {
    question: "What image formats are supported?",
    answer: "We support common formats including PNG, JPG, JPEG, and WEBP. Maximum file size is 10MB."
  },
  {
    question: "How fast is the processing?",
    answer: "Most images are processed in 2-5 seconds. Speed depends on image size and your device performance."
  },
  {
    question: "Do I need to register an account?",
    answer: "No registration required. We maintain an account-free, tracking-free experience. Just open the website and start using."
  },
  {
    question: "Can I download the processed images?",
    answer: "Yes. After processing, your image with transparent background is displayed. Click the download button to save it locally."
  },
  {
    question: "Does it support batch processing?",
    answer: "Currently, only single image processing is supported. Batch processing is under development. Stay tuned!"
  },
  {
    question: "What should I do if processing fails?",
    answer: "Please ensure your image has appropriate dimensions and format. If problems persist, try refreshing the page or using a different browser."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 px-4 md:px-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        {faqData.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden"
          >
            <button
              className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition"
              onClick={() => toggleFAQ(index)}
              aria-expanded={openIndex === index}
            >
              <span className="font-medium text-gray-900">{faq.question}</span>
              <span className="text-gray-500 text-xl">
                {openIndex === index ? '−' : '+'}
              </span>
            </button>
            {openIndex === index && (
              <div className="px-6 pb-4 text-gray-600">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}