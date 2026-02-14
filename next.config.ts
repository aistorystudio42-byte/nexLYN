import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'tglsjszlkgkfjuyvqdfy.supabase.co', // Storage için gerekebilir
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
