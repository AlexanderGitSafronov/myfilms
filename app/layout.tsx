import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "@/components/ui/toast";
import { Navbar, MobileNav } from "@/components/layout/navbar";
import { PWARegister } from "@/components/pwa-register";
import { I18nProvider } from "@/lib/i18n-context";
import { getServerLocale } from "@/lib/i18n-server";
import { SplashLoader } from "@/components/ui/page-loader";
import { CookieBanner } from "@/components/cookie-banner";
import { LegalFooter } from "@/components/layout/legal-footer";

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
  viewportFit: "cover",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getServerLocale();
  return (
    <html lang={locale} className={`${inter.variable} dark`}>
      <head>
        <link rel="icon" type="image/svg+xml" href="/icons/icon.svg" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192.png" />
        {/* iOS PWA splash screens */}
        <link rel="apple-touch-startup-image" href="/icons/splash/splash-1290x2796.png" media="screen and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/icons/splash/splash-1179x2556.png" media="screen and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/icons/splash/splash-1284x2778.png" media="screen and (device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/icons/splash/splash-1170x2532.png" media="screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/icons/splash/splash-1125x2436.png" media="screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/icons/splash/splash-1242x2688.png" media="screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/icons/splash/splash-828x1792.png" media="screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/icons/splash/splash-1242x2208.png" media="screen and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/icons/splash/splash-750x1334.png" media="screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/icons/splash/splash-2048x2732.png" media="screen and (device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/icons/splash/splash-1668x2388.png" media="screen and (device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/icons/splash/splash-1536x2048.png" media="screen and (device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
        {/* Prefetch key routes for instant navigation */}
        <link rel="prefetch" href="/feed" />
        <link rel="prefetch" href="/lists" />
        <link rel="prefetch" href="/explore" />
        <link rel="prefetch" href="/profile" />
      </head>
      <body className="min-h-screen flex flex-col bg-black text-white antialiased">
        <I18nProvider initialLocale={locale}>
        <SessionProvider>
          <ToastProvider>
            <SplashLoader />
            <Navbar />
            <main className="flex-1 pb-20 md:pb-0">
              {children}
            </main>
            <LegalFooter />
            <MobileNav />
            <PWARegister />
            <CookieBanner />
          </ToastProvider>
        </SessionProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
