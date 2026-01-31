import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ React Compiler açık
  reactCompiler: true,

  // ✅ Docker / Dokploy için ZORUNLU
  output: "standalone",

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "supabase.kuzeybatihaber.cloud",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "commons.wikimedia.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "tr.wikipedia.org",
        pathname: "/**",
      },
    ],

    // 🔥 BU SATIR EKSİKTİ
    qualities: [40, 75],
  },

  experimental: {
    scrollRestoration: true,
  },
};

export default nextConfig;
