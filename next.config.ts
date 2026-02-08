import type { NextConfig } from 'next';

/**
 * Security headers for the application
 */
const securityHeaders = [
  {
    key: 'X-Frame-Options',
    value: 'DENY', // Prevent clickjacking
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff', // Prevent MIME sniffing
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block', // Enable XSS filter
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains', // HSTS - 1 year
  },
];

const nextConfig: NextConfig = {
  // Removed `output: 'export'` — incompatible with API routes (/api/subscribe).
  // Deploy to Vercel for automatic serverless function support.
  images: {
    unoptimized: true,
  },
  trailingSlash: true,

  // Security headers applied to all routes including API
  // For static export, configure headers in hosting provider
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      // Additional headers for API routes
      {
        source: '/api/:path*',
        headers: [
          ...securityHeaders,
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
