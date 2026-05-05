import 'server-only';

import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { API_BASE_URL, resolvePublicAssetUrl } from '@/lib/utils';
import { JsonLd, buildPageMetadataFromSettings, jsonld, localizedPath, localizedUrl } from '@/seo';
import { ListingCard } from '@/components/patterns/ListingCard';
import { SectionHeader } from '@/components/patterns/SectionHeader';
import { getFallbackProducts } from '@/lib/content-fallbacks';
import { buildMediaAlt } from '@/lib/media-seo';
import { SeoIssueBeacon } from '@/components/monitoring/SeoIssueBeacon';
import { ProductB2bBanner } from '@/components/sections/ProductB2bBanner';
import { fetchProductsB2bContent } from '@/features/site-settings/products-b2b';
import { Reveal } from '@/components/motion/Reveal';

async function fetchProducts(locale: string, filters?: { category?: string; tag?: string }) {
  const params = new URLSearchParams({
    item_type: 'kompozit',
    is_active: '1',
    locale,
    limit: '50',
  });
  if (filters?.category) params.set('category_slug', filters.category);
  if (filters?.tag) params.set('tag', filters.tag);
  try {
    const res = await fetch(`${API_BASE_URL}/products?${params}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data as any)?.items ?? [];
  } catch {
    return [];
  }
}

async function fetchCategories(locale: string) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/categories?module_key=kompozit&is_active=1&locale=${locale}`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data as any)?.items ?? [];
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; tag?: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { category, tag } = await searchParams;
  const [t, seoT] = await Promise.all([
    getTranslations({ locale, namespace: 'products' }),
    getTranslations({ locale, namespace: 'seo' }),
  ]);
  return buildPageMetadataFromSettings({
    locale,
    pathname: '/products',
    pageKey: 'products',
    fallback: {
      title: locale.startsWith('en')
        ? `${t('title')} - Carbon Fiber, FRP and Fiberglass Parts`
        : `${t('title')} - Karbon Fiber, CTP ve Cam Elyaf Parcalar`,
      description: seoT('productsDescription'),
    },
    noIndex: Boolean(category || tag),
  });
}

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; tag?: string }>;
}) {
  const { locale } = await params;
  const { category, tag } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  const [products, categories, b2bContent] = await Promise.all([
    fetchProducts(locale, { category, tag }),
    fetchCategories(locale),
    fetchProductsB2bContent(locale),
  ]);
  const fallbackProducts = getFallbackProducts(locale);
  const hasFilters = Boolean(category || tag);
  const visibleProducts = products.length > 0 ? products : hasFilters ? [] : fallbackProducts;

  return (
    <main className="relative bg-[var(--carbon)]">
      <div className="section-py relative z-10">
        <div className="mx-auto max-w-[1300px] px-6 lg:px-12">
          <JsonLd
            data={jsonld.graph([
              jsonld.collectionPage({
                name: t('products.title'),
                description: t('products.description'),
                url: localizedUrl(locale, '/products'),
                mainEntity: jsonld.itemList(
                  visibleProducts.slice(0, 12).map((item: any) => ({
                    name: item.title,
                    url: item.slug ? localizedUrl(locale, `/products/${item.slug}`) : localizedUrl(locale, '/offer'),
                  })),
                ),
              }),
            ])}
          />

          <Reveal>
            <div className="mb-16">
              <span className="section-label-cc">Catalogue</span>
              <h1 className="section-title-cc">{t('products.title')}</h1>
              <p className="section-subtitle-cc">{t('products.description')}</p>
            </div>
          </Reveal>

          <ProductB2bBanner locale={locale} content={b2bContent} />

          {/* Category filter */}
          {categories.length > 0 && (
            <div className="mt-12 mb-16 flex flex-wrap gap-4">
              <Link
                href={localizedPath(locale, '/products')}
                className={`px-6 py-3 text-[10px] font-bold uppercase tracking-[3px] transition-all duration-300 border ${
                  !category
                    ? 'border-[var(--gold)] bg-[var(--gold)] text-[var(--carbon)]'
                    : 'border-[var(--gold)]/15 bg-transparent text-[var(--silver)] hover:border-[var(--gold)]/40 hover:text-[var(--gold)]'
                }`}
              >
                {t('products.allCategories')}
              </Link>
              {categories.map((c: any) => (
                <Link
                  key={c.id}
                  href={`${localizedPath(locale, '/products')}?category=${encodeURIComponent(c.slug)}`}
                  className={`px-6 py-3 text-[10px] font-bold uppercase tracking-[3px] transition-all duration-300 border ${
                    category === c.slug
                      ? 'border-[var(--gold)] bg-[var(--gold)] text-[var(--carbon)]'
                      : 'border-[var(--gold)]/15 bg-transparent text-[var(--silver)] hover:border-[var(--gold)]/40 hover:text-[var(--gold)]'
                  }`}
                >
                  {c.name}
                </Link>
              ))}
            </div>
          )}

          {/* Product grid */}
          <div className="relative">
            {products.length === 0 && !visibleProducts.length && (
              <div className="border border-[var(--gold)]/10 p-16 text-center bg-[var(--graphite)] mb-12">
                <SeoIssueBeacon
                  type="soft-404"
                  pathname={localizedPath(locale, '/products')}
                  reason={category || tag ? 'catalog-filter-empty' : 'products-list-empty'}
                />
                <p className="font-display text-[1.8rem] uppercase tracking-[4px] text-[var(--white)]">
                  {t('products.noProducts')}
                </p>
                <p className="mt-6 text-sm font-light text-[var(--silver)] max-w-md mx-auto">
                  {locale === 'en'
                    ? 'Sample product lines are being synchronized. Contact our team for immediate technical specs.'
                    : 'Urun hatlari senkronize ediliyor. Teknik detaylar ve teklif icin dogrudan iletisime gecebilirsiniz.'}
                </p>
              </div>
            )}

            <div className="industrial-grid-cc sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visibleProducts.map((p: any, index: number) => (
                <Reveal key={p.id ?? p.title} delay={index * 40} className="grid-item-cc">
                  <ListingCard
                    listIndex={index + 1}
                    visualVariant={index}
                    href={p.slug ? localizedPath(locale, `/products/${p.slug}`) : `${localizedPath(locale, '/offer')}?product=${encodeURIComponent(p.title)}`}
                    title={p.title}
                    description={p.description}
                    lineLabel={t('common.listingEngineeringLine')}
                    imageSrc={
                      p.image_url
                        ? (resolvePublicAssetUrl(p.image_url) ?? p.image_url)
                        : undefined
                    }
                    specs={p.specs}
                    category={p.category_name || p.category}
                    badge={p.is_featured ? (locale === 'en' ? 'Featured' : 'Öne Çıkan') : undefined}
                    imageAlt={buildMediaAlt({
                      locale,
                      kind: 'product',
                      title: p.title,
                      alt: p.alt,
                      caption: p.caption,
                      description: p.description,
                    })}
                    imageSizes="(max-width: 768px) 50vw, 25vw"
                    imageAspectClassName="h-[450px]"
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
