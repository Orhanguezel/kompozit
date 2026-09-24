/** Versioned public assets: only the shipped legacy artwork is upgraded.
 * Custom media selected in site_settings continues to take precedence.
 */
export const BRAND_ASSET_ROOT = '/brand/moe-2026-09-09';

const legacyLogos = new Set([
  '/uploads/kompozit/brand/logo.png',
  '/uploads/kompozit/brand/moe_logo_refined_v2.png',
  '/uploads/kompozit/brand/logo-dark.png',
  '/uploads/kompozit/brand/logo-light.png',
  '/uploads/kompozit/brand/kompozit_logo.jpeg',
  '/uploads/kompozit/brand/kompozit_logo.png',
  '/media/logo.png',
  '/media/logo-dark.png',
  '/media/logo-light.png',
]);

function localPath(value: string): string {
  if (value.startsWith('/')) return value.split(/[?#]/)[0] || value;
  try {
    const url = new URL(value);
    return ['karbonkompozit.com.tr', 'www.karbonkompozit.com.tr'].includes(url.hostname)
      ? url.pathname
      : value;
  } catch {
    return value;
  }
}

export function resolveBrandLogo(value: string, locale: string, mode: 'light' | 'dark'): string {
  if (!value) return "";
  if (!legacyLogos.has(localPath(value))) return value;
  const language = locale.toLowerCase().startsWith('tr') ? 'tr' : 'en';
  return `${BRAND_ASSET_ROOT}/logo-1-${language}-${mode}-600.webp`;
}

export function resolveBrandIcon(value: string, kind: 'favicon' | 'apple'): string {
  const legacy = kind === 'favicon'
    ? ['/uploads/kompozit/brand/favicon-32.png', '/media/favicon.ico', '/favicon.ico', '/icon']
    : ['/uploads/kompozit/brand/apple-touch-icon.png', '/apple-icon'];
  if (!value || localPath(value) === '/neutral-icon.svg') return `${BRAND_ASSET_ROOT}/icons/apple-touch-icon.png`;
  if (!legacy.includes(localPath(value))) return value;
  return `${BRAND_ASSET_ROOT}/icons/apple-touch-icon.png`;
}
