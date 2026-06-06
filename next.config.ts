import type { NextConfig } from "next";
import { getBuildLocale } from "./src/lib/buildLocale";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_BUILD_LOCALE: getBuildLocale(),
  },
  reactStrictMode: true,
  poweredByHeader: false,
  trailingSlash: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io", pathname: "/images/**" },
    ],
  },
  /** Windows-on a webpack pack cache néha ENOENT / hiányzó chunk hibát okoz dev módban */
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
