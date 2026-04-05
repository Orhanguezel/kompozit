import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',

  async rewrites() {
    // Always use local backend for server-side rewrites to avoid external loop
    const backendBase = (
      process.env.BACKEND_INTERNAL_URL ||
      process.env.BACKEND_URL ||
      'http://127.0.0.1:8186'
    ).replace(/\/api\/?$/, '');

    return [
      { source: '/uploads/:path*', destination: `${backendBase}/uploads/:path*` },
      { source: '/media/:path*',   destination: `${backendBase}/media/:path*` },
      { source: '/storage/:path*', destination: `${backendBase}/storage/:path*` },
    ];
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    minimumCacheTTL: 2592000,
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'karbonkompozit.com.tr' },
      { protocol: 'https', hostname: 'www.karbonkompozit.com.tr' },
      { protocol: 'https', hostname: 'example.guezelwebdesig.com' },
      { protocol: 'http' as const, hostname: 'localhost', port: '8186' },
      { protocol: 'http' as const, hostname: '127.0.0.1', port: '8186' },
    ],
  },

  experimental: {
    optimizePackageImports: ['lucide-react', 'sonner', '@tanstack/react-query'],
  },

  async headers() {
    const isProd = process.env.NODE_ENV === 'production';
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
      ...(isProd
        ? [{
            source: '/_next/static/(.*)',
            headers: [
              { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
            ],
          }]
        : []),
    ];
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },

  compress: true,
  poweredByHeader: false,
};

export default withNextIntl(nextConfig);
