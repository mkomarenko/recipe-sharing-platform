import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  
  // Optimize images
  images: {
    domains: ['localhost', 'lrnglcnmjowbgpniouog.supabase.co'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Enable experimental features for better performance
  experimental: {
    // Optimize package imports
    optimizePackageImports: ['@supabase/supabase-js'],
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

export default nextConfig
