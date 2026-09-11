import { APP_NAME } from '@/lib/brand-name';
import type { MetadataRoute } from 'next';
import { resolveBrandIcon } from '@/lib/brand-assets';
import { fetchSetting } from '@/i18n/server';
import { asObj } from '@/seo/helpers';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const setting = await fetchSetting("site_logo", "tr");
  const logo = asObj(setting?.value);
  const icon = resolveBrandIcon(String(logo.favicon_url || logo.favicon || ""), "favicon");
  return {
    name: APP_NAME,
    short_name: APP_NAME,
    description: 'Industrial solutions in carbon fiber, FRP and fiberglass composite manufacturing.',
    start_url: '/tr',
    display: 'standalone',
    background_color: '#111820',
    theme_color: '#111820',
    icons: [{ src: icon, sizes: "any" }],
  };
}
