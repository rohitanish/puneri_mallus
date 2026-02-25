import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bhfrgcphqmbocplfcvbg.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // This helps prevent "Infinite redirect" loops if middleware 
  // and Supabase redirects collide
  skipTrailingSlashRedirect: true, 
};

export default nextConfig;