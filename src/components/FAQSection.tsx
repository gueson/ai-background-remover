import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "这个工具如何保护我的隐私？",
    answer: "所有图像处理都在您的浏览器本地完成，图片不会上传到任何服务器。我们不会收集、存储或传输您的任何数据。"
  },
  {
    question: "支持哪些图片格式？",
    answer: "支持 PNG、JPG、JPEG、WEBP 等常见格式。最大支持 10MB 的图片。"
  },
  {
    question: "处理速度有多快？",
    answer: "大多数图片在 2-5 秒内完成处理，具体速度取决于图片大小和您的设备性能。"
  },
  {
    question: "需要注册账号吗？",
    answer: "完全不需要。我们坚持无账户、无追踪的纯粹体验，打开网页即可使用。"
  },
  {
    question: "处理后的图片可以下载吗？",
    answer: "可以。处理完成后会自动显示透明背景的 PNG 图片，您可以点击下载按钮保存到本地。"
  },
  {
    question: "是否支持批量处理？",
    answer: "目前每次只能处理一张图片。批量处理功能正在开发中，敬请期待。"
  },
  {
    question: "如果处理失败怎么办？",
    answer: "请确保图片尺寸适中且格式正确。如果问题持续，请尝试刷新页面或使用其他浏览器。"
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
        常见问题
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