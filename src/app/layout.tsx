import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.background-remover-tools.online"),
  title: {
    default: "AI Background Remover - Remove Image Backgrounds Online",
    template: "%s | AI Background Remover",
  },
  description: "AI-powered background remover tool. Remove image backgrounds instantly in your browser with 100% privacy. No uploads, no tracking, fast and free.",
  keywords: [
    "background remover",
    "remove background",
    "image background remover",
    "AI background remover",
    "free background remover",
    "online background remover",
    "client-side AI",
    "privacy-focused image processing",
    "remove bg",
    "transparent background",
  ],
  authors: [{ name: "AI Background Remover Team" }],
  creator: "AI Background Remover",
  publisher: "AI Background Remover",
  openGraph: {
    title: "AI Background Remover - Remove Image Backgrounds Instantly",
    description: "AI-powered background remover. Remove image backgrounds instantly in your browser with complete privacy protection.",
    type: "website",
    locale: "en_US",
    url: "https://www.background-remover-tools.online/",
    siteName: "AI Background Remover",
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
    title: "AI Background Remover - Remove Image Backgrounds Instantly",
    description: "AI-powered background remover with 100% privacy. All processing happens in your browser.",
    site: "@backgroundremover",
    creator: "@backgroundremover",
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
  alternates: {
    canonical: "https://www.background-remover-tools.online/",
  },
  themeColor: "#2563eb",
  applicationName: "AI Background Remover",
  appleWebApp: {
    capable: true,
    title: "AI Background Remover",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: [
      {
        url: "/favicon.svg",
        sizes: "180x180",
        type: "image/svg+xml",
      },
    ],
    other: [
      {
        rel: "icon",
        url: "/favicon.svg",
        sizes: "192x192",
        type: "image/svg+xml",
      },
      {
        rel: "icon",
        url: "/favicon.svg",
        sizes: "512x512",
        type: "image/svg+xml",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-VTW8FVTJT8"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-VTW8FVTJT8');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
