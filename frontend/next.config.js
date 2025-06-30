/**
 * Next.js Configuration
 * QR Code-Based Instructional System - Frontend Configuration
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Environment variables available to the client
  env: {
    CUSTOM_KEY: 'my-value',
  },
  
  // API routes configuration
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*', // Proxy to Backend
      },
    ];
  },
  
  // Images configuration for media handling
  images: {
    domains: [
      'localhost',
      // Add Supabase storage domain when configured
    ],
  },
  
  // Using pages directory (default behavior)
};

module.exports = nextConfig; 