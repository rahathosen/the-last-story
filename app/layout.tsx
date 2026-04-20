import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { Inter, Lora, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const lora = Lora({
  subsets: ["latin"],
  variable: "--font-serif",
});
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "The Last Story",
  description: "Every soul will taste death",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
    shortcut: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${lora.variable} dark`}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
