import 'server-only';

import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, MessagesSquare, Shield, Zap, Settings, Truck } from 'lucide-react';
import { API_BASE_URL, resolvePublicAssetUrl } from '@/lib/utils';
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
import { productFaqData } from '@/seo/faq-data';

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
  const ogImg =
    product.image_url != null && String(product.image_url).trim()
      ? (resolvePublicAssetUrl(product.image_url) ?? product.image_url)
      : undefined;
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
    ogImage: ogImg,
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
  const tProd = await getTranslations({ locale, namespace: 'products' });
  const product = await fetchProduct(slug, locale);
  if (!product) notFound();
  const [related, b2bContent, contactInfo] = await Promise.all([
    fetchRelatedContent(product, slug, locale),
    fetchProductsB2bContent(locale),
    fetchParsedContactInfo(locale),
  ]);
  const localeKey = locale.startsWith('en') ? 'en' : 'tr';
  const faqEntries = productFaqData[slug]?.[localeKey] ?? [];
  const breadcrumbs = [
    { label: t('nav.home'), href: localizedPath(locale, '/') },
    { label: t('nav.products'), href: localizedPath(locale, '/products') },
    { label: product.title },
  ];
  const heroImage =
    product.image_url != null && String(product.image_url).trim()
      ? (resolvePublicAssetUrl(product.image_url) ?? product.image_url)
      : undefined;
  const schemaItems = [
    ...buildOrganizationSchemaItems(locale, {
      description: typeof product.description === 'string' ? product.description : undefined,
      contact: contactInfo,
      pagePath: `/products/${slug}`,
    }),
    jsonld.product({
      name: product.title,
      description: product.description,
      image: heroImage,
      url: localizedUrl(locale, `/products/${slug}`),
      brand: 'MOE Kompozit',
    }),
    jsonld.breadcrumb(
      breadcrumbs.map((item) => ({
        name: item.label,
        url: item.href ? localizedUrl(locale, item.href.replace(`/${locale}`, '') || '/') : localizedUrl(locale, `/products/${slug}`),
      })),
    ),
    ...(faqEntries.length > 0
      ? [
          jsonld.faqPage({
            url: localizedUrl(locale, `/products/${slug}`),
            mainEntity: faqEntries,
          }),
        ]
      : []),
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--color-carbon)] text-[var(--color-cream)]">
      <div className="gold-grid-bg pointer-events-none absolute inset-0 opacity-[0.35]" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,var(--color-carbon)_0%,color-mix(in_srgb,var(--color-graphite)_40%,var(--color-carbon))_45%,var(--color-carbon)_100%)] opacity-90" aria-hidden />

      <div className="section-py relative z-10">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <JsonLd
            data={jsonld.graph(schemaItems)}
          />
          <Breadcrumbs
            items={breadcrumbs}
            className="mb-8"
            olClassName="text-[var(--color-light)] [&_a:hover]:text-[var(--color-gold)] [&_span.font-medium]:text-[var(--color-off-white)]"
          />

          <div className="grid gap-12 lg:grid-cols-[1fr_minmax(0,34rem)] xl:gap-20">
            {/* Product Image Stage */}
            <div className="relative">
              <div className="sticky top-28">
                <div className="group aspect-square cursor-zoom-in overflow-hidden rounded-sm border border-[color-mix(in_srgb,var(--color-gold)_15%,transparent)] bg-[var(--color-graphite)] shadow-2xl shadow-black/40">
                  {heroImage && (
                    <OptimizedImage
                      src={heroImage}
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
                   <div className="h-[2px] w-8 rounded-full bg-[var(--color-gold)]" />
                   <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[var(--color-gold)]">
                     {tProd('detailEyebrow')}
                   </span>
                </div>
                <h1 className="text-balance font-[var(--font-display)] text-4xl font-normal tracking-tight text-[var(--color-off-white)] lg:text-6xl">
                  {product.title}
                </h1>
                
                {product.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {product.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="border border-[color-mix(in_srgb,var(--color-gold)_20%,transparent)] bg-[color-mix(in_srgb,var(--color-gold)_6%,transparent)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[var(--color-gold)] backdrop-blur-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </header>

              <div className="relative border-t border-[color-mix(in_srgb,var(--color-gold)_10%,transparent)] pt-10">
                <h3 className="mb-6 text-xs font-bold uppercase tracking-[0.25em] text-[var(--color-gold)]">
                  {tProd('technicalScope')}
                </h3>
                {product.description && (
                  <div
                    className="prose prose-invert prose-lg max-w-none text-[var(--color-silver)] prose-headings:font-[var(--font-display)] prose-headings:font-normal prose-headings:tracking-tight prose-headings:text-[var(--color-off-white)] prose-a:text-[var(--color-gold)] hover:prose-a:underline"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                )}
              </div>

              {/* Technical Specifications Section */}
              <div className="border-t border-[color-mix(in_srgb,var(--color-gold)_10%,transparent)] pt-10">
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

              <div className="rounded-sm border border-[color-mix(in_srgb,var(--color-gold)_12%,transparent)] bg-[color-mix(in_srgb,var(--color-graphite)_85%,transparent)] p-6 lg:flex lg:items-center lg:justify-between lg:gap-8">
                <div className="max-w-xl space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--color-gold)]">
                    {b2bContent.detailEyebrow}
                  </p>
                  <p className="text-base font-bold tracking-tight text-[var(--color-off-white)]">
                    {b2bContent.detailTitle}
                  </p>
                  <p className="text-sm leading-relaxed text-[var(--color-silver)]">
                    {b2bContent.detailBody}
                  </p>
                </div>
                <Link
                  href={`${localizedPath(locale, '/contact')}?product=${encodeURIComponent(product.title)}`}
                  className="mt-5 inline-flex flex-shrink-0 items-center gap-2 rounded-sm border border-[color-mix(in_srgb,var(--color-gold)_25%,transparent)] bg-[color-mix(in_srgb,var(--color-gold)_8%,transparent)] px-5 py-3 text-sm font-bold text-[var(--color-cream)] transition-all hover:border-[var(--color-gold)] hover:bg-[color-mix(in_srgb,var(--color-gold)_14%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-carbon)] lg:mt-0"
                >
                  <MessagesSquare className="size-4 text-[var(--color-gold)]" />
                  {b2bContent.talkToEngineering}
                  <ArrowRight className="size-4 opacity-60" />
                </Link>
              </div>

              <div className="border-t border-[color-mix(in_srgb,var(--color-gold)_10%,transparent)] pt-10">
                 <BrandCtaPanel
                  title={b2bContent.requestQuote}
                  description={t('common.offerCtaDescription')}
                  action={(
                    <Link
                      href={`${localizedPath(locale, '/offer')}?product=${encodeURIComponent(product.title)}`}
                      className="btn-primary shimmer-btn glow-hover inline-flex items-center gap-3 rounded-sm px-10 py-5 text-sm font-bold shadow-xl shadow-black/30 transition-all active:scale-95"
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
               { icon: <Shield className="size-6 text-[var(--color-gold)]" />, key: 'reliability', content: b2bContent.reliability },
               { icon: <Settings className="size-6 text-[var(--color-gold)]" />, key: 'engineering', content: b2bContent.engineering },
               { icon: <Zap className="size-6 text-[var(--color-gold)]" />, key: 'speed', content: b2bContent.speed },
               { icon: <Truck className="size-6 text-[var(--color-gold)]" />, key: 'logistics', content: b2bContent.logistics }
             ].map((feature, index) => (
               <Reveal key={feature.key} delay={index * 100}>
                 <div className="flex h-full flex-col items-center border border-[color-mix(in_srgb,var(--color-gold)_10%,transparent)] bg-[var(--color-graphite)] p-8 text-center transition-all group hover:border-[color-mix(in_srgb,var(--color-gold)_22%,transparent)]">
                    <div className="mb-6 flex size-14 items-center justify-center rounded-sm border border-[color-mix(in_srgb,var(--color-gold)_15%,transparent)] bg-[color-mix(in_srgb,var(--color-gold)_6%,transparent)] transition-all duration-500 group-hover:bg-[color-mix(in_srgb,var(--color-gold)_14%,transparent)]">
                       {feature.icon}
                    </div>
                    <h4 className="mb-3 text-sm font-bold uppercase tracking-widest text-[var(--color-off-white)]">
                       {feature.content.title}
                    </h4>
                    <p className="text-xs leading-relaxed text-[var(--color-silver)] opacity-80">
                       {feature.content.desc}
                    </p>
                 </div>
               </Reveal>
             ))}
          </div>

          <div className="mt-24 grid gap-8 lg:grid-cols-3">
             <Reveal delay={100}>
               <div className="h-full border border-[color-mix(in_srgb,var(--color-gold)_10%,transparent)] bg-[var(--color-graphite)] p-8">
                  <RelatedLinks
                    title={t('common.relatedProducts')}
                    hrefBase={localizedPath(locale, '/products')}
                    items={related.products}
                  />
               </div>
             </Reveal>
             <Reveal delay={200}>
               <div className="h-full border border-[color-mix(in_srgb,var(--color-gold)_10%,transparent)] bg-[var(--color-graphite)] p-8">
                  <RelatedLinks
                    title={t('common.relatedGallery')}
                    hrefBase={localizedPath(locale, '/gallery')}
                    items={related.galleries}
                  />
               </div>
             </Reveal>
             <Reveal delay={300}>
               <div className="h-full border border-[color-mix(in_srgb,var(--color-gold)_10%,transparent)] bg-[var(--color-graphite)] p-8">
                  <RelatedLinks
                    title={t('common.relatedArticles')}
                    hrefBase={localizedPath(locale, '/blog')}
                    items={related.blogPosts}
                  />
               </div>
             </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
