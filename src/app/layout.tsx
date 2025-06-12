import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AIMandi - AI-Powered File Converter",
  description: "Transform your files with AI-powered conversion technology. Fast, secure, and reliable file conversions at your fingertips.",
  keywords: "file converter, PDF converter, document converter, image converter, AI converter",
  authors: [{ name: "AIMandi Team" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#667eea",
  openGraph: {
    title: "AIMandi - AI-Powered File Converter",
    description: "Transform your files with AI-powered conversion technology",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AIMandi - AI-Powered File Converter",
    description: "Transform your files with AI-powered conversion technology",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}