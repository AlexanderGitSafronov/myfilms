import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: { ignoreBuildErrors: true },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
  // PWA service worker is handled manually via public/sw.js
  // next-pwa is skipped since it's incompatible with Turbopack (Next.js 16+)
};

export default nextConfig;
