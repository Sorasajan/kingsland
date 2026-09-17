import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The generated Prisma client + pg driver use native Node APIs that
  // shouldn't be bundled/traced by webpack for server code.
  serverExternalPackages: ["@prisma/client", "@prisma/adapter-pg", "pg"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "flagcdn.com",
      },
    ],
  },
};

export default nextConfig;
