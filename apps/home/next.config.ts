import type { NextConfig } from "next";

const cartServiceUrl = (
  process.env.CART_SERVICE_URL || "http://localhost:3001"
).replace(/\/+$/, "");

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fakestoreapi.com",
        pathname: "/img/**",
      },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async rewrites() {
    return [
      {
        source: "/cart",
        destination: `${cartServiceUrl}/cart`,
      },
      {
        source: "/cart/:path*",
        destination: `${cartServiceUrl}/cart/:path*`,
      },
    ];
  },
};

export default nextConfig;

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
