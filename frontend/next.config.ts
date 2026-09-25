import type { NextConfig } from 'next';
import path from 'node:path';
import createNextIntlPlugin from 'next-intl/plugin';
import { BRAND_ASSET_ROOT } from './src/lib/brand-assets';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  staticPageGenerationTimeout: 180,
  turbopack: {
    root: path.resolve(process.cwd(), '../..'),
  },

  async redirects() {
    return [
      { source: '/icon', destination: `${BRAND_ASSET_ROOT}/icons/apple-touch-icon.png`, permanent: false },
      { source: '/apple-icon', destination: `${BRAND_ASSET_ROOT}/icons/apple-touch-icon.png`, permanent: false },
      { source: '/blog/:slug', destination: '/tr/blog/:slug', permanent: true },
      { source: '/sitemap.xlm', destination: '/sitemap.xml', permanent: true },
      { source: '/', destination: '/tr', permanent: false },
      // Cozumler bolumu 2026-09-25'te kaldirildi; urun/kategori karsiliklarina kalici yonlendirme.
      { source: '/solutions', destination: '/tr/products', permanent: true },
      { source: '/tr/solutions', destination: '/tr/products', permanent: true },
      { source: '/tr/solutions/solution-planters', destination: '/tr/products?category=peyzaj-urunleri-ctp', permanent: true },
      { source: '/tr/solutions/solution-coffins', destination: '/tr/products/kompozit-tabut', permanent: true },
      { source: '/tr/solutions/solution-storage-tanks', destination: '/tr/products/ctp-su-deposu', permanent: true },
      { source: '/tr/solutions/solution-custom-b2b', destination: '/tr/products?category=ozel-uretim', permanent: true },
      { source: '/tr/solutions/:slug*', destination: '/tr/products', permanent: true },
      { source: '/en/solutions', destination: '/en/products', permanent: true },
      { source: '/en/solutions/solution-planters', destination: '/en/products/decorative-composite-planters-vases', permanent: true },
      { source: '/en/solutions/solution-coffins', destination: '/en/products/composite-coffin', permanent: true },
      { source: '/en/solutions/solution-storage-tanks', destination: '/en/products/frp-water-storage-tank', permanent: true },
      { source: '/en/solutions/solution-custom-b2b', destination: '/en/products?category=custom-manufacturing', permanent: true },
      { source: '/en/solutions/:slug*', destination: '/en/products', permanent: true },
      // Yalniz stok gorsel iceren galeriler pasif (2026-09-25, seed 334); urun galerisine.
      { source: '/tr/gallery/karbon-fiber-panel-uygulama-galerisi', destination: '/tr/gallery/moe-kompozit-urun-galerisi', permanent: true },
      { source: '/tr/gallery/ctp-govde-paneli-uretim-galerisi', destination: '/tr/gallery/moe-kompozit-urun-galerisi', permanent: true },
      { source: '/en/gallery/carbon-fiber-panel-application-gallery', destination: '/en/gallery/moe-kompozit-product-gallery', permanent: true },
      { source: '/en/gallery/frp-enclosure-panel-production-gallery', destination: '/en/gallery/moe-kompozit-product-gallery', permanent: true },
      // EN kategori slug'lari TR adlariyla esitlendi (2026-09-25, seed 332).
      ...[
        ['frp-products', 'municipal-products'],
        ['fiberglass-products', 'amusement-park-products'],
        ['industrial-profiles', 'landscape-products'],
      ].map(([from, to]) => ({
        source: '/en/products',
        has: [{ type: 'query' as const, key: 'category', value: from }],
        destination: `/en/products?category=${to}`,
        permanent: true,
      })),
    ];
  },

  async rewrites() {
    // Always use local backend for server-side rewrites to avoid external loop
    const backendBase = (
      process.env.BACKEND_INTERNAL_URL ||
      process.env.BACKEND_URL ||
      'http://127.0.0.1:8186'
    ).replace(/\/api\/?$/, '');

    return [
      { source: '/api/:path*', destination: `${backendBase}/api/:path*` },
      { source: '/uploads/:path*', destination: `${backendBase}/uploads/:path*` },
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
          // includeSubDomains bilerek yok: mail.<domain> yalniz HTTP sunuyor,
          // kapsama alinirsa webmail tarayicida acilmaz. preload da bu yuzden yok.
          ...(isProd
            ? [{ key: 'Strict-Transport-Security', value: 'max-age=31536000' }]
            : []),
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
