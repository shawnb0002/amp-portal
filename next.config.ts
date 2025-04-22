import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@radix-ui/react-use-effect-event': path.resolve('./hooks/useEffectEvent.ts'),
    };
    return config;
  },
};

export default nextConfig;
