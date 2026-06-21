import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "JEE Math Pro — Master JEE Advanced Mathematics",
  description:
    "A comprehensive platform for JEE Advanced Mathematics preparation. Find the right resources, explore multiple solution approaches, learn from common mistakes, and get AI-powered step-by-step explanations.",
  keywords: [
    "JEE Advanced",
    "Mathematics",
    "IIT JEE",
    "JEE preparation",
    "Math solutions",
    "JEE questions",
  ],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        {/* No-JS safety: scroll-reveal elements start at opacity:0 and are
            unveiled by an IntersectionObserver. If JS is disabled, force them
            visible so content can never get stuck invisible. */}
        <noscript>
          {/* eslint-disable-next-line react/no-danger */}
          <style dangerouslySetInnerHTML={{ __html: '.animate-on-load{opacity:1 !important;}' }} />
        </noscript>
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
