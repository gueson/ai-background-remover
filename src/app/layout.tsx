import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Background Remover - Privacy-First Image Processing",
  description: "Remove image backgrounds instantly in your browser. No uploads, no tracking. Fast, free, and privacy-focused.",
  keywords: ["background remover", "image processing", "privacy", "client-side", "AI"],
  openGraph: {
    title: "AI Background Remover",
    description: "Remove image backgrounds instantly in your browser",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
