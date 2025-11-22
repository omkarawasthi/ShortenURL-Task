import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/:code([A-Za-z0-9]{6,8})",
        destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/:code`,
      },
    ];
  },
};

export default nextConfig;