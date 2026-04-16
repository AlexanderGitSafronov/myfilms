import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "@/components/ui/toast";
import { Navbar, MobileNav } from "@/components/layout/navbar";
import { PWARegister } from "@/components/pwa-register";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "MyFilms — Share Movie Recommendations",
    template: "%s | MyFilms",
  },
  description: "Collect, organize, and share your favorite movie recommendations with friends.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MyFilms",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "MyFilms",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="min-h-screen bg-black text-white antialiased">
        <SessionProvider>
          <ToastProvider>
            <Navbar />
            <main className="flex-1 pb-20 md:pb-0">
              {children}
            </main>
            <MobileNav />
            <PWARegister />
          </ToastProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
