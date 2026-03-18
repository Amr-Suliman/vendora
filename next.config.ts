import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ecommerce.routemisr.com',
        pathname: '/Route-Academy-*/*'
      }
    ]
  },
  turbopack: {
    root: path.resolve(__dirname),
  }
};

export default nextConfig;