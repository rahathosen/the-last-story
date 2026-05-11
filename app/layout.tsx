import type React from "react";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Inter, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ServiceWorkerRegister } from "@/components/sw-register";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://laststory.vercel.app",
  ),
  title: {
    default: "The Last Story",
    template: "%s — The Last Story",
  },
  description:
    "Every soul will taste death — A quiet space to share final words, memories, and stories of love.",
  manifest: "/site.webmanifest",
  appleWebApp: {
    capable: true,
    title: "The Last Story",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://laststory.vercel.app",
    siteName: "The Last Story",
    title: "The Last Story",
    description:
      "Every soul will taste death — A quiet space to share final words and memories.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Last Story",
    description:
      "Every soul will taste death — A quiet space to share final words and memories.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} dark`}>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#0f172a" />
      </head>
      <body>
        {children}
        <Analytics />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
