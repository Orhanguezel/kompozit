import 'server-only';

import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, MessagesSquare, Shield, Zap, Settings, Truck } from 'lucide-react';
import { API_BASE_URL } from '@/lib/utils';
import { JsonLd, buildOrganizationSchemaItems, buildPageMetadata, jsonld, localizedPath, localizedUrl } from '@/seo';
import { BrandCtaPanel } from '@/components/patterns/BrandCtaPanel';
import { TechnicalSpecs } from '@/components/patterns/TechnicalSpecs';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { fetchRelatedContent } from '@/lib/related-content';
import { fetchParsedContactInfo } from '@/lib/contact-info';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { RelatedLinks } from '@/components/seo/RelatedLinks';
import { buildMediaAlt } from '@/lib/media-seo';
import { Reveal } from '@/components/motion/Reveal';
import { fetchProductsB2bContent } from '@/features/site-settings/products-b2b';

async function fetchProduct(slug: string, locale: string) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/products/by-slug/${encodeURIComponent(slug)}?locale=${locale}&item_type=kompozit`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await fetchProduct(slug, locale);
  if (!product) return {};
  return buildPageMetadata({
    locale,
    pathname: `/products/${slug}`,
    title:
      product.meta_title ||
      (locale.startsWith('en')
        ? `${product.title} - Composite Part Details and Quote`
        : `${product.title} - Kompozit Parca Detayi ve Teklif`),
    description:
      product.meta_description ||
      (locale.startsWith('en')
        ? `Review ${product.title} for composite applications, including technical scope, production fit and project-specific quotation details.`
        : `${product.title} icin teknik kapsam, uretim uygunlugu ve proje bazli teklif detaylarini inceleyin.`),
    ogImage: product.image_url,
    includeLocaleAlternates: false,
  });
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale });
  const product = await fetchProduct(slug, locale);
  if (!product) notFound();
  const [related, b2bContent, contactInfo] = await Promise.all([
    fetchRelatedContent(product, slug, locale),
    fetchProductsB2bContent(locale),
    fetchParsedContactInfo(locale),
  ]);
  const breadcrumbs = [
    { label: t('nav.home'), href: localizedPath(locale, '/') },
    { label: t('nav.products'), href: localizedPath(locale, '/products') },
    { label: product.title },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg-muted)] relative overflow-hidden">
      <div className="surface-dark-shell carbon-mesh absolute inset-0 opacity-[0.03] pointer-events-none" />
      
      <div className="section-py relative z-10">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <JsonLd
            data={jsonld.graph([
              ...buildOrganizationSchemaItems(locale, {
                description: typeof product.description === 'string' ? product.description : undefined,
                contact: contactInfo,
                pagePath: `/products/${slug}`,
              }),
              jsonld.product({
                name: product.title,
                description: product.description,
                image: product.image_url,
                url: localizedUrl(locale, `/products/${slug}`),
                brand: 'MOE Kompozit',
              }),
              jsonld.breadcrumb(
                breadcrumbs.map((item) => ({
                  name: item.label,
                  url: item.href ? localizedUrl(locale, item.href.replace(`/${locale}`, '') || '/') : localizedUrl(locale, `/products/${slug}`),
                })),
              ),
            ])}
          />
          <div className="glass-premium inline-flex items-center rounded-full px-4 py-2 border-white/5 bg-white/[0.02] mb-8">
             <Breadcrumbs items={breadcrumbs} />
          </div>

          <div className="grid gap-12 lg:grid-cols-[1fr_minmax(0,34rem)] xl:gap-20">
            {/* Product Image Stage */}
            <div className="relative">
              <div className="sticky top-28">
                <div className="glass-premium rounded-[2.5rem] aspect-square overflow-hidden border-white/10 bg-white/[0.03] shadow-2xl group cursor-zoom-in">
                  {product.image_url && (
                    <OptimizedImage
                      src={product.image_url}
                      alt={buildMediaAlt({
                        locale,
                        kind: 'product',
                        title: product.title,
                        alt: product.alt,
                        caption: product.caption,
                        description: product.description,
                      })}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  )}
                </div>
                
                {/* Image thumbnails/gallery if they exist would go here */}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-10">
              <header className="space-y-6">
                <div className="flex items-center gap-3">
                   <div className="h-[2px] w-8 bg-brand rounded-full" />
                   <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand/80">Product Detail</span>
                </div>
                <h1 className="text-4xl font-bold tracking-tight lg:text-6xl text-balance">{product.title}</h1>
                
                {product.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {product.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="glass-premium rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)] border-white/5 bg-white/5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </header>

              <div className="relative pt-10 border-t border-white/5">
                <h3 className="text-xs font-bold uppercase tracking-widest text-brand mb-6">Technical Scope</h3>
                {product.description && (
                  <div
                    className="prose prose-theme prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-brand hover:prose-a:underline"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                )}
              </div>

              {/* Technical Specifications Section */}
              <div className="pt-10 border-t border-white/5">
                <TechnicalSpecs 
                  specs={
                    product.specs_json 
                      ? (typeof product.specs_json === 'string' ? JSON.parse(product.specs_json) : product.specs_json)
                      : [
                        { label: 'Material Base', value: (product.tags?.[0] || 'Carbon/GRP Hybrid') },
                        { label: 'Surface Finish', value: 'Technical Matte / Gloss Options' },
                        { label: 'Process Origin', value: 'Precision Compression / Hand-lay' },
                        { label: 'Production Fit', value: 'B2B Batch & High-Volume' }
                      ]
                  } 
                />
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 lg:flex lg:items-center lg:justify-between lg:gap-8">
                <div className="max-w-xl space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand/90">
                    {b2bContent.detailEyebrow}
                  </p>
                  <p className="text-base font-bold tracking-tight text-[var(--color-text-primary)]">
                    {b2bContent.detailTitle}
                  </p>
                  <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                    {b2bContent.detailBody}
                  </p>
                </div>
                <Link
                  href={`${localizedPath(locale, '/contact')}?product=${encodeURIComponent(product.title)}`}
                  className="mt-5 inline-flex flex-shrink-0 items-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] px-5 py-3 text-sm font-bold text-[var(--color-text-primary)] transition-all hover:border-brand/30 hover:bg-white/[0.08] lg:mt-0"
                >
                  <MessagesSquare className="size-4 text-brand" />
                  {b2bContent.talkToEngineering}
                  <ArrowRight className="size-4 opacity-60" />
                </Link>
              </div>

              <div className="pt-10 border-t border-white/5">
                 <BrandCtaPanel
                  title={b2bContent.requestQuote}
                  description={t('common.offerCtaDescription')}
                  action={(
                    <Link
                      href={`${localizedPath(locale, '/offer')}?product=${encodeURIComponent(product.title)}`}
                      className="btn-primary shimmer-btn glow-hover inline-flex items-center gap-3 rounded-xl px-10 py-5 text-sm font-bold shadow-xl shadow-brand/20 transition-all active:scale-95"
                    >
                      {t('nav.offer')}
                      <ArrowRight className="size-5" />
                    </Link>
                  )}
                />
              </div>
            </div>
          </div>

          {/* B2B Trust Grid */}
          <div className="mt-24 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
             {[
               { icon: <Shield className="size-6 text-brand" />, key: 'reliability', content: b2bContent.reliability },
               { icon: <Settings className="size-6 text-brand" />, key: 'engineering', content: b2bContent.engineering },
               { icon: <Zap className="size-6 text-brand" />, key: 'speed', content: b2bContent.speed },
               { icon: <Truck className="size-6 text-brand" />, key: 'logistics', content: b2bContent.logistics }
             ].map((feature) => (
               <Reveal key={feature.key}>
                 <div className="glass-premium flex h-full flex-col items-center p-8 rounded-[2rem] border-white/5 bg-white/[0.01] text-center group hover:bg-white/[0.04] transition-all">
                    <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-brand/10 border border-brand/10 group-hover:bg-brand group-hover:text-white transition-all duration-500">
                       {feature.icon}
                    </div>
                    <h4 className="text-sm font-bold uppercase tracking-widest text-white mb-3">
                       {feature.content.title}
                    </h4>
                    <p className="text-xs leading-relaxed text-[var(--color-text-secondary)] opacity-60">
                       {feature.content.desc}
                    </p>
                 </div>
               </Reveal>
             ))}
          </div>

          <div className="mt-24 grid gap-8 lg:grid-cols-3">
             <div className="glass-premium p-8 rounded-[2rem] border-white/5 bg-white/[0.01]">
                <RelatedLinks
                  title={t('common.relatedProducts')}
                  hrefBase={localizedPath(locale, '/products')}
                  items={related.products}
                />
             </div>
             <div className="glass-premium p-8 rounded-[2rem] border-white/5 bg-white/[0.01]">
                <RelatedLinks
                  title={t('common.relatedGallery')}
                  hrefBase={localizedPath(locale, '/gallery')}
                  items={related.galleries}
                />
             </div>
             <div className="glass-premium p-8 rounded-[2rem] border-white/5 bg-white/[0.01]">
                <RelatedLinks
                  title={t('common.relatedArticles')}
                  hrefBase={localizedPath(locale, '/blog')}
                  items={related.blogPosts}
                />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
