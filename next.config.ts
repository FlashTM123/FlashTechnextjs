import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["mongoose", "@prisma/client", "prisma"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn2.cellphones.com.vn",
      },
      {
        protocol: "https",
        hostname: "cellphones.com.vn",
      },
      {
        protocol: "https",
        hostname: "github.com",
      }
    ],
  },
};

export default nextConfig;
