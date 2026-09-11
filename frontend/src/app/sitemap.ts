import type { MetadataRoute } from 'next';
import { localeAlternates, localizedUrl } from '@/seo/helpers';
import { AVAILABLE_LOCALES, hasLocale } from '@/i18n/locales';
import { getLocaleSettings } from '@/i18n/locale-settings';
import { DETAIL_SECTIONS, detailSitemap } from '@/seo/inventory';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { activeLocales } = await getLocaleSettings();
  const locales = activeLocales.filter(hasLocale);
  const sitemapLocales = locales.length ? locales : AVAILABLE_LOCALES;
  const staticRoutes = [
    { path: '', changeFrequency: 'weekly' as const, priority: 1.0 },
    { path: '/products', changeFrequency: 'weekly' as const, priority: 0.9 },
    { path: '/solutions', changeFrequency: 'weekly' as const, priority: 0.75 },
    { path: '/references', changeFrequency: 'monthly' as const, priority: 0.7 },
    { path: '/gallery', changeFrequency: 'weekly' as const, priority: 0.8 },
    { path: '/blog', changeFrequency: 'weekly' as const, priority: 0.7 },
    { path: '/about', changeFrequency: 'monthly' as const, priority: 0.6 },
    { path: '/contact', changeFrequency: 'monthly' as const, priority: 0.7 },
    { path: '/offer', changeFrequency: 'monthly' as const, priority: 0.8 },
  ];

  const dynamicEntries = await Promise.all(DETAIL_SECTIONS.map(detailSitemap));
  return [
    ...sitemapLocales.flatMap(locale => staticRoutes.map(route => ({
      url: localizedUrl(locale, route.path || '/'), changeFrequency: route.changeFrequency, priority: route.priority,
      alternates: { languages: localeAlternates(route.path || '/', sitemapLocales) },
    }))),
    ...dynamicEntries.flat().filter(entry => sitemapLocales.some(locale => new URL(entry.url).pathname.startsWith(`/${locale}/`))),
  ];
}
