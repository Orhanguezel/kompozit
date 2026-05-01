import type { MetadataRoute } from 'next';
import { localeAlternates, localizedUrl } from '@/seo/helpers';
import { AVAILABLE_LOCALES } from '@/i18n/locales';
import { API_BASE_URL } from '@/lib/utils';
import { KOMPOZIT_SOLUTIONS_MODULE_KEY } from '@/features/solutions';

type SitemapItem = {
  slug: string;
  updated_at?: string | null;
  created_at?: string | null;
  title?: string | null;
  description?: string | null;
  image_url?: string | null;
  image_alt?: string | null;
};

function sitemapEntry(
  locale: string,
  path: string,
  entry: Omit<MetadataRoute.Sitemap[number], 'url' | 'alternates'> = {},
): MetadataRoute.Sitemap[number] {
  return {
    url: localizedUrl(locale, path),
    alternates: {
      languages: localeAlternates(path),
    },
    ...entry,
  };
}

function withDefaultParams(endpoint: string): string {
  const joiner = endpoint.includes('?') ? '&' : '?';
  return `${API_BASE_URL}${endpoint}${joiner}is_active=1&limit=500`;
}

async function fetchItems(endpoint: string): Promise<SitemapItem[]> {
  try {
    const res = await fetch(withDefaultParams(endpoint), {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const items = Array.isArray(data) ? data : (data as any)?.items ?? [];
    return items
      .filter((item: any) => item?.slug)
      .map((item: any) => ({
        slug: item.slug,
        updated_at: item.updated_at ?? null,
        created_at: item.created_at ?? null,
        title: item.title ?? item.name ?? null,
        description: item.description ?? item.meta_description ?? null,
        image_url:
          item.image_url ??
          item.image_url_resolved ??
          item.cover_image_url_resolved ??
          item.cover_image ??
          null,
        image_alt: item.alt ?? item.cover_image_alt ?? item.title ?? item.name ?? null,
      }));
  } catch {
    return [];
  }
}

async function fetchLegalItems(): Promise<SitemapItem[]> {
  return fetchLegalItemsForLocale('tr');
}

async function fetchSolutionsItems(locale: string): Promise<SitemapItem[]> {
  try {
    const qs = new URLSearchParams({
      module_key: KOMPOZIT_SOLUTIONS_MODULE_KEY,
      locale,
      is_published: '1',
      limit: '200',
    });
    const res = await fetch(`${API_BASE_URL}/custom_pages?${qs.toString()}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const items = Array.isArray(data) ? data : (data as { items?: unknown[] })?.items ?? [];
    return items
      .filter((item: any) => item?.slug)
      .map((item: any) => ({
        slug: item.slug,
        updated_at: item.updated_at ?? null,
        created_at: item.created_at ?? null,
      }));
  } catch {
    return [];
  }
}

async function fetchLegalItemsForLocale(locale: string): Promise<SitemapItem[]> {
  const legalSlugs =
    locale.startsWith('en')
      ? ['privacy', 'terms']
      : ['privacy', 'terms'];

  const rows = await Promise.all(
    legalSlugs.map(async (slug) => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/custom_pages/by-slug/${encodeURIComponent(slug)}?locale=${encodeURIComponent(locale)}`,
          { next: { revalidate: 3600 } },
        );
        if (!res.ok) return null;
        const data = await res.json();
        if (!data?.slug) return null;
        return {
          slug: data.slug,
          updated_at: data.updated_at ?? null,
          created_at: data.created_at ?? null,
        } satisfies SitemapItem;
      } catch {
        return null;
      }
    }),
  );

  return rows.filter(Boolean) as SitemapItem[];
}

function resolveLastModified(item?: SitemapItem): Date | undefined {
  const value = item?.updated_at || item?.created_at;
  return value ? new Date(value) : undefined;
}

function toAbsoluteImageUrl(value?: string | null): string | null {
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  const normalized = value.startsWith('/') ? value : `/${value}`;
  return `${API_BASE_URL.replace(/\/api\/?$/, '')}${normalized}`;
}

function resolveSitemapImages(item?: SitemapItem): string[] | undefined {
  const url = toAbsoluteImageUrl(item?.image_url);
  return url ? [url] : undefined;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locales = AVAILABLE_LOCALES;

  const entries: MetadataRoute.Sitemap = [];

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

  for (const locale of locales) {
    const [products, galleries, blogPosts, solutionPages, legalPages] = await Promise.all([
      fetchItems(`/products?item_type=kompozit&locale=${encodeURIComponent(locale)}`),
      fetchItems(`/galleries?module_key=kompozit&locale=${encodeURIComponent(locale)}`),
      fetchItems(`/custom_pages?module_key=kompozit_blog&locale=${encodeURIComponent(locale)}`),
      fetchSolutionsItems(locale),
      fetchLegalItemsForLocale(locale),
    ]);

    for (const route of staticRoutes) {
      entries.push(sitemapEntry(locale, route.path || '/', {
        changeFrequency: route.changeFrequency,
        priority: route.priority,
      }));
    }

    for (const item of products) {
      entries.push(sitemapEntry(locale, `/products/${item.slug}`, {
        lastModified: resolveLastModified(item),
        changeFrequency: 'weekly',
        priority: 0.8,
        images: resolveSitemapImages(item),
      }));
    }

    for (const item of galleries) {
      entries.push(sitemapEntry(locale, `/gallery/${item.slug}`, {
        lastModified: resolveLastModified(item),
        changeFrequency: 'monthly',
        priority: 0.6,
        images: resolveSitemapImages(item),
      }));
    }

    for (const item of blogPosts) {
      entries.push(sitemapEntry(locale, `/blog/${item.slug}`, {
        lastModified: resolveLastModified(item),
        changeFrequency: 'monthly',
        priority: 0.7,
        images: resolveSitemapImages(item),
      }));
    }

    for (const item of solutionPages) {
      entries.push(sitemapEntry(locale, `/solutions/${item.slug}`, {
        lastModified: resolveLastModified(item),
        changeFrequency: 'monthly',
        priority: 0.72,
      }));
    }

    for (const item of legalPages) {
      entries.push(sitemapEntry(locale, `/legal/${item.slug}`, {
        lastModified: resolveLastModified(item),
        changeFrequency: 'yearly',
        priority: 0.3,
      }));
    }
  }

  return entries;
}
