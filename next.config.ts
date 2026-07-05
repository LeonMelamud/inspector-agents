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
  trailingSlash: true,

  // Prevent trailingSlash redirects on .well-known files and static discovery files
  async rewrites() {
    return [
      // Serve /.well-known/mcp → /.well-known/mcp.json (standard MCP discovery path)
      {
        source: '/.well-known/mcp',
        destination: '/.well-known/mcp.json',
      },
      {
        source: '/.well-known/:file',
        destination: '/.well-known/:file',
      },
      {
        source: '/.well-known/mcp/:file',
        destination: '/.well-known/mcp/:file',
      },
      {
        source: '/.well-known/agent-skills/:file',
        destination: '/.well-known/agent-skills/:file',
      },
    ];
  },

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
      // CORS for MCP endpoint (cross-origin AI agent callers)
      {
        source: '/api/mcp',
        headers: [
          ...securityHeaders,
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'POST, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
      // CORS for .well-known discovery files
      {
        source: '/.well-known/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, OPTIONS',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400',
          },
        ],
      },
      // Content-Type for api-catalog (RFC 9727 requires linkset+json)
      {
        source: '/.well-known/api-catalog',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/linkset+json',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
      // Content-Type for OAuth protected resource
      {
        source: '/.well-known/oauth-protected-resource',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/json',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
      // CORS for static markdown/text files
      {
        source: '/:path*.md',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Content-Type',
            value: 'text/markdown; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
