import { localizedPath } from '@/seo/helpers';

type TranslateFn = (key: string) => string;

export interface MenuItemLike {
  title: string;
  url: string;
  children?: MenuItemLike[];
}

interface CategoryLike {
  name?: unknown;
  title?: unknown;
  slug?: unknown;
}

export interface FooterSectionLike {
  title: string;
  items: Array<{ label: string; url: string }>;
}

export function buildDefaultMenu(locale: string, t: TranslateFn): MenuItemLike[] {
  return [
    { title: t('home'), url: localizedPath(locale, '/') },
    { title: t('products'), url: localizedPath(locale, '/products') },
    { title: t('solutions'), url: localizedPath(locale, '/solutions') },
    { title: t('gallery'), url: localizedPath(locale, '/gallery') },
    { title: t('blog'), url: localizedPath(locale, '/blog') },
    { title: t('about'), url: localizedPath(locale, '/about') },
    { title: t('contact'), url: localizedPath(locale, '/contact') },
  ];
}

export function ensureMenuItems(
  input: Record<string, unknown>[],
  locale: string,
  t: TranslateFn,
  categories: CategoryLike[] = [],
): Record<string, unknown>[] {
  const baseItems = input && input.length > 0
    ? input
    : buildDefaultMenu(locale, t) as unknown as Record<string, unknown>[];

  const categoryChildren = categories
    .map((category) => {
      const title = String(category.name ?? category.title ?? '').trim();
      const slug = String(category.slug ?? '').trim();
      if (!title || !slug) return null;

      return {
        title,
        url: `/products?category=${encodeURIComponent(slug)}`,
      };
    })
    .filter((item): item is MenuItemLike => Boolean(item));

  if (categoryChildren.length === 0) return baseItems;

  const allProductsTitle = locale.startsWith('en') ? 'All Products' : 'Tüm Ürünler';

  return baseItems.map((item) => {
    const rawUrl = String(item.url ?? item.href ?? '').trim();
    const normalizedUrl = rawUrl
      .replace(/^https?:\/\/[^/]+/i, '')
      .replace(/^\/[a-z]{2}(?=\/|$)/i, '')
    const path = (normalizedUrl.split('?')[0] ?? '').replace(/\/$/, '') || '/';

    if (path !== '/products') return item;

    return {
      ...item,
      children: [
        { title: allProductsTitle, url: '/products' },
        ...categoryChildren,
      ],
    };
  });
}

export function buildDefaultFooterSections(
  locale: string,
  navT: TranslateFn,
  footerT: TranslateFn,
): FooterSectionLike[] {
  return [
    {
      title: footerT('sections.explore'),
      items: [
        { label: navT('products'), url: localizedPath(locale, '/products') },
        { label: navT('solutions'), url: localizedPath(locale, '/solutions') },
        { label: navT('references'), url: localizedPath(locale, '/references') },
        { label: navT('gallery'), url: localizedPath(locale, '/gallery') },
        { label: navT('blog'), url: localizedPath(locale, '/blog') },
        { label: navT('offer'), url: localizedPath(locale, '/offer') },
      ],
    },
    {
      title: footerT('sections.company'),
      items: [
        { label: navT('about'), url: localizedPath(locale, '/about') },
        { label: navT('contact'), url: localizedPath(locale, '/contact') },
      ],
    },
    {
      title: footerT('sections.legal'),
      items: [
        { label: footerT('privacy'), url: localizedPath(locale, '/legal/privacy') },
        { label: footerT('terms'), url: localizedPath(locale, '/legal/terms') },
      ],
    },
  ];
}

export function ensureFooterSections(
  input: Record<string, unknown>[],
  locale: string,
  navT: TranslateFn,
  footerT: TranslateFn,
): Record<string, unknown>[] {
  const fallbackSections = buildDefaultFooterSections(locale, navT, footerT);

  const totalItems = input.reduce((sum, s) => sum + (Array.isArray(s.items) ? s.items.length : 0), 0);
  if (input.length === 0 || totalItems === 0) {
    return fallbackSections as unknown as Record<string, unknown>[];
  }

  const existingUrls = new Set<string>();
  for (const section of input) {
    const items = Array.isArray(section.items) ? section.items : [];
    for (const item of items) {
      const url = String((item as any)?.url ?? (item as any)?.href ?? '').trim();
      if (url) existingUrls.add(url);
    }
  }

  const quickLinks = fallbackSections
    .flatMap((section) => section.items)
    .filter((item) => !existingUrls.has(item.url));

  // Localization override for section titles
  // Mapping of common API titles to translation keys
  const sectionTitleMap: Record<string, string> = {
    'Explore': 'sections.explore',
    'Kesfet': 'sections.explore',
    'Kategoriler': 'sections.explore',
    'Company': 'sections.company',
    'Kurumsal': 'sections.company',
    'Legal': 'sections.legal',
    'Yasal': 'sections.legal',
    'Hizli Baglantilar': 'sections.quickLinks',
    'Baglantilar': 'sections.quickLinks',
  };

  const processedInput = input.map(section => {
    const title = String(section.title || '');
    const tKey = sectionTitleMap[title];
    return {
      ...section,
      title: tKey ? footerT(tKey) : title
    };
  });

  if (quickLinks.length === 0) return processedInput;

  return [
    ...processedInput,
    {
      title: footerT('sections.quickLinks'),
      items: quickLinks,
    },
  ];
}
