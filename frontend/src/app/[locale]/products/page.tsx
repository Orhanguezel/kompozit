import 'server-only';

import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { API_BASE_URL } from '@/lib/utils';
import { JsonLd, buildPageMetadata, jsonld, localizedPath, localizedUrl } from '@/seo';
import { ListingCard } from '@/components/patterns/ListingCard';
import { SectionHeader } from '@/components/patterns/SectionHeader';
import { getFallbackProducts } from '@/lib/content-fallbacks';
import { buildMediaAlt } from '@/lib/media-seo';
import { SeoIssueBeacon } from '@/components/monitoring/SeoIssueBeacon';
import { ProductB2bBanner } from '@/components/sections/ProductB2bBanner';
import { fetchProductsB2bContent } from '@/features/site-settings/products-b2b';

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
  const t = await getTranslations({ locale, namespace: 'products' });
  return buildPageMetadata({
    locale,
    pathname: '/products',
    title: locale.startsWith('en')
      ? `${t('title')} - Carbon Fiber, FRP and Fiberglass Parts`
      : `${t('title')} - Karbon Fiber, CTP ve Cam Elyaf Parcalar`,
    description: t('description'),
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
  const t = await getTranslations({ locale });

  const [products, categories, b2bContent] = await Promise.all([
    fetchProducts(locale, { category, tag }),
    fetchCategories(locale),
    fetchProductsB2bContent(locale),
  ]);
  const fallbackProducts = getFallbackProducts(locale);
  const visibleProducts = products.length > 0 ? products : fallbackProducts;

  return (
    <div className="min-h-screen bg-[var(--color-bg-muted)] relative overflow-hidden">
      <div className="surface-dark-shell carbon-mesh absolute inset-0 opacity-[0.03] pointer-events-none" />
      
      <div className="section-py relative z-10">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
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
          <SectionHeader
            title={t('products.title')}
            description={t('products.description')}
            label="Catalogue"
          />

          <ProductB2bBanner locale={locale} content={b2bContent} />

          {/* Category filter */}
          {categories.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href={localizedPath(locale, '/products')}
                className={`rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  !category
                    ? 'bg-brand text-white shadow-lg shadow-brand/20'
                    : 'glass-premium border-white/5 bg-white/5 text-[var(--color-text-secondary)] hover:bg-white/10 hover:text-[var(--color-text-primary)]'
                }`}
              >
                {t('products.allCategories')}
              </Link>
              {categories.map((c: any) => (
                <Link
                  key={c.id}
                  href={`${localizedPath(locale, '/products')}?category=${encodeURIComponent(c.slug)}`}
                  className={`rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                    category === c.slug
                      ? 'bg-brand text-white shadow-lg shadow-brand/20'
                      : 'glass-premium border-white/5 bg-white/5 text-[var(--color-text-secondary)] hover:bg-white/10 hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  {c.name}
                </Link>
              ))}
            </div>
          )}

          {/* Product grid */}
          <div className="mt-12">
            {products.length === 0 && (
              <div className="glass-premium rounded-[2rem] p-12 text-center border-white/5 bg-white/[0.02] mb-12">
                <SeoIssueBeacon
                  type="soft-404"
                  pathname={localizedPath(locale, '/products')}
                  reason={category || tag ? 'catalog-filter-empty' : 'products-list-empty'}
                />
                <p className="text-xl font-bold tracking-tight">
                  {t('products.noProducts')}
                </p>
                <p className="mt-4 text-sm text-[var(--color-text-muted)] opacity-70">
                  {locale === 'en'
                    ? 'Sample product lines are being synchronized. Contact our team for immediate technical specs.'
                    : 'Urun hatlari senkronize ediliyor. Teknik detaylar ve teklif icin dogrudan iletisime gecebilirsiniz.'}
                </p>
              </div>
            )}
            
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visibleProducts.map((p: any, index: number) => (
                <div key={p.id ?? p.title} className="motion-fade-up" style={{ animationDelay: `${index * 50}ms` }}>
                  <ListingCard
                    href={p.slug ? localizedPath(locale, `/products/${p.slug}`) : `${localizedPath(locale, '/offer')}?product=${encodeURIComponent(p.title)}`}
                    title={p.title}
                    description={p.description}
                    lineLabel={t('common.listingEngineeringLine')}
                    imageSrc={p.image_url}
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
                    imageAspectClassName="aspect-[3/4]"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
