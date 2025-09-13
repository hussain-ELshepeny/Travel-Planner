import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "k6nfs0y2jz.ufs.sh",
      },
    ],
  },
};

export default nextConfig;
