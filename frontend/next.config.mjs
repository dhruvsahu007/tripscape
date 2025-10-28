/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove these in production - they're only for development
  typescript: {
    ignoreBuildErrors: false, // Set to false for production
  },
  eslint: {
    ignoreDuringBuilds: false, // Set to false for production
  },
  images: {
    unoptimized: false, // Set to false for production
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  },
  // Production optimizations
  compress: true,
  poweredByHeader: false,
  // Output configuration for different deployment platforms
  // output: 'standalone', // Uncomment for Docker deployments
}

export default nextConfig
