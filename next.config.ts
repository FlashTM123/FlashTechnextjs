import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["mongoose", "@prisma/client", "prisma"],
};

export default nextConfig;
