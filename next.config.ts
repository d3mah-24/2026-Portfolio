import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // 404 page for URLs outside the /[locale] root layouts (e.g. /xx)
    globalNotFound: true,
  },
  async redirects() {
    // Always land on English; no browser-language detection.
    return [{ source: "/", destination: "/en", permanent: false }];
  },
};

export default nextConfig;
