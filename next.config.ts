import type { NextConfig } from "next";
import { getBuildLocale } from "./src/lib/buildLocale";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_BUILD_LOCALE: getBuildLocale(),
  },
  trailingSlash: true,
  images: {
    unoptimized: true,
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
