import 'server-only';

import dynamic from 'next/dynamic';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Shield, Zap, Settings, Truck, Cpu, Award, MoveRight } from 'lucide-react';

import { API_BASE_URL, resolvePublicAssetUrl } from '@/lib/utils';
import { JsonLd, buildPageMetadata, localizedPath, siteUrlBase } from '@/seo';
import { buildHomePageSchemaGraph } from '@/seo/home-jsonld';
import { ReferencesTrustStrip } from '@/components/sections/ReferencesTrustStrip';
import { StatsBar } from '@/components/sections/StatsBar';
import { MaterialCards } from '@/components/sections/MaterialCards';
import { ProcessTimeline } from '@/components/sections/ProcessTimeline';
import { IndustryStrip } from '@/components/sections/IndustryStrip';
import { HomeTestimonial } from '@/components/sections/HomeTestimonial';
import { HomeContact } from '@/components/sections/HomeContact';
import { AdvantagesGrid } from '@/components/sections/AdvantagesGrid';
import { GalleryShowcase } from '@/components/sections/GalleryShowcase';
import { DarkCtaPanel } from '@/components/patterns/DarkCtaPanel';
import { ListingCard } from '@/components/patterns/ListingCard';
import { SectionHeader } from '@/components/patterns/SectionHeader';
import { Reveal } from '@/components/motion/Reveal';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { getFallbackGalleries, getFallbackProducts } from '@/lib/content-fallbacks';
import { fetchParsedContactInfo } from '@/lib/contact-info';
import { fetchHomePageContent } from '@/features/site-settings/home';
import { buildMediaAlt } from '@/lib/media-seo';

const GALLERY_PLACEHOLDER_SRC = '/media/gallery-placeholder.svg';
const PRODUCT_PLACEHOLDER_SRC = '/media/product-placeholder.svg';

const NewsletterFormLazy = dynamic(() =>
  import('@/components/sections/NewsletterForm').then((m) => m.NewsletterForm),
);

function homeHref(locale: string, path: string): string {
  const p = (path || '').trim();
  if (!p.startsWith('/') || p.startsWith('//')) return localizedPath(locale, '/');
  return localizedPath(locale, p);
}

async function fetchFeaturedProducts(locale: string) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/products?item_type=kompozit&is_active=1&locale=${locale}&limit=6`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data as any)?.items ?? [];
  } catch {
    return [];
  }
}

async function fetchFeaturedGalleries(locale: string) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/galleries?module_key=kompozit&is_active=1&locale=${locale}&limit=6`,
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
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo' });

  return buildPageMetadata({
    locale,
    pathname: '/',
    title: locale.startsWith('en')
      ? 'Carbon Fiber, FRP and Fiberglass Composite Manufacturing'
      : 'Karbon Fiber, CTP ve Cam Elyaf Kompozit Uretimi',
    description: t('homeDescription'),
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  const [products, galleries, homeContent, contactForLd] = await Promise.all([
    fetchFeaturedProducts(locale),
    fetchFeaturedGalleries(locale),
    fetchHomePageContent(locale),
    fetchParsedContactInfo(locale),
  ]);

  const siteUrl = siteUrlBase();
  const { hero: heroApi, valueProps: valuePropsApi, statsBar: statsBarApi, testimonial: testimonialApi, about: aboutApi } =
    homeContent;

  const visibleProducts = products.length > 0 ? products.slice(0, 6) : getFallbackProducts(locale).slice(0, 6);
  const visibleGalleries = galleries.length > 0 ? galleries.slice(0, 6) : getFallbackGalleries(locale);
  const aboutVisualRaw =
    (visibleGalleries[0] as { cover_image?: string | null; imageSrc?: string; image_url?: string })
      ?.cover_image ||
    (visibleGalleries[0] as { imageSrc?: string })?.imageSrc ||
    (visibleGalleries[0] as { image_url?: string })?.image_url ||
    (visibleProducts[0] as { image_url?: string | null })?.image_url;
  const aboutVisualSrc =
    resolvePublicAssetUrl(aboutVisualRaw) ?? aboutVisualRaw ?? GALLERY_PLACEHOLDER_SRC;

  const whyUsItems = [
    { icon: Shield, key: 'quality' },
    { icon: Zap, key: 'experience' },
    { icon: Settings, key: 'custom' },
    { icon: Truck, key: 'delivery' },
    { icon: Cpu, key: 'innovation' },
    { icon: Award, key: 'certification' },
  ] as const;

  return (
    <main className="relative bg-[var(--carbon)]">
      <JsonLd
        data={buildHomePageSchemaGraph(locale, {
          siteUrl,
          seoDescription: t('seo.defaultDescription'),
          contact: contactForLd,
        })}
      />

      {/* --- HERO SECTION --- */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="gold-grid-bg absolute inset-0 z-[1]" />

        <div className="container relative z-10 mx-auto px-8 text-center">
          <Reveal>
            <span className="hero-label">
              {heroApi?.badge ?? 'Foundational Engineering'}
            </span>
          </Reveal>

          <Reveal delay={200}>
            <h1
              dangerouslySetInnerHTML={{
                __html: heroApi?.title ?? (t.raw('home.hero.title') as string)
              }}
            />
          </Reveal>

          <Reveal delay={400}>
            <p className="hero-subtitle">
              {heroApi?.subtitle ?? t('home.hero.subtitle')}
            </p>
          </Reveal>

          <Reveal delay={600}>
            <div className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-8">
              <Link
                href={heroApi?.primaryCtaHref ? homeHref(locale, heroApi.primaryCtaHref) : localizedPath(locale, '/products')}
                className="hero-btn-primary shimmer-btn"
              >
                {heroApi?.primaryCtaLabel ?? t('home.hero.cta')}
                <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                href={heroApi?.secondaryCtaHref ? homeHref(locale, heroApi.secondaryCtaHref) : localizedPath(locale, '/offer')}
                className="hero-btn-outline"
              >
                {heroApi?.secondaryCtaLabel ?? t('home.hero.ctaSecondary')}
              </Link>
            </div>
          </Reveal>
        </div>

        {/* Scroll Hint */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
          <div className="flex h-12 w-6 justify-center rounded-full border border-[var(--gold)]/30 backdrop-blur-sm">
            <div className="mt-2 h-2 w-1 animate-bounce bg-[var(--gold)]" />
          </div>
        </div>
      </section>

      <StatsBar locale={locale} fromApi={statsBarApi} />

      {/* --- ABOUT SECTION --- */}
      <section id="about" className="section-py relative overflow-hidden bg-[var(--carbon)]">
        <div className="mx-auto max-w-[1300px] px-6 lg:px-12">
          <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
            {/* Left: Content */}
            <div className="order-2 lg:order-1">
              <Reveal>
                <span className="section-label-cc">{aboutApi?.label || t('home.whyUs.sectionLabel')}</span>
                <h2 className="section-title-cc" dangerouslySetInnerHTML={{ __html: aboutApi?.title || t('home.whyUs.title') }} />

                <h3 className="font-serif text-[1.4rem] font-normal italic leading-snug text-[var(--gold)] lg:text-[1.8rem] opacity-90">
                   {aboutApi?.tagline || t('home.testimonial.quote')}
                </h3>

                <p className="mt-8 text-base font-light leading-[1.8] text-[var(--silver)] lg:text-lg">
                  {aboutApi?.intro || t('home.whyUs.subtitle')}
                </p>

                <div className="mt-12 grid gap-8 sm:grid-cols-2">
                  <div className="group space-y-4">
                    <div className="flex size-14 items-center justify-center border border-[var(--gold)]/20 bg-[var(--gold)]/5 transition-all group-hover:bg-[var(--gold)]/10">
                      <Cpu className="size-6 text-[var(--gold)]" />
                    </div>
                    <h4 className="font-display text-base uppercase tracking-[2px] text-[var(--white)]">
                      {t('home.hero.metrics.engineeringTitle')}
                    </h4>
                    <p className="text-sm font-light leading-relaxed text-[var(--silver)]">
                      {t('home.hero.metrics.engineeringDesc')}
                    </p>
                  </div>

                  <div className="group space-y-4">
                    <div className="flex size-14 items-center justify-center border border-[var(--gold)]/20 bg-[var(--gold)]/5 transition-all group-hover:bg-[var(--gold)]/10">
                      <Zap className="size-6 text-[var(--gold)]" />
                    </div>
                    <h4 className="font-display text-base uppercase tracking-[2px] text-[var(--white)]">
                      {t('home.hero.metrics.prototypeTitle')}
                    </h4>
                    <p className="text-sm font-light leading-relaxed text-[var(--silver)]">
                      {t('home.hero.metrics.prototypeDesc')}
                    </p>
                  </div>
                </div>

                <div className="mt-12 pt-8">
                  <Link
                    href={localizedPath(locale, '/about')}
                    className="group relative inline-flex items-center gap-4 border border-[var(--gold)] px-10 py-5 text-[0.85rem] font-bold uppercase tracking-[3px] text-[var(--gold)] transition-all duration-300 hover:bg-[var(--gold)] hover:text-[var(--carbon)]"
                  >
                    {t('common.readMore')}
                    <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </Reveal>
            </div>

            {/* Right: Visual */}
            <div className="order-1 lg:order-2">
              <Reveal delay={200}>
                <div className="relative mx-auto max-w-[500px]">
                  <div className="about-img-main">
                    <div className="absolute inset-0 z-10 bg-gradient-to-br from-black/40 via-transparent to-black/20" />
                    <div className="gold-grid-bg pointer-events-none absolute inset-0 z-10 opacity-[0.05]" />
                    <div className="animate-scan absolute left-0 top-0 z-20 h-px w-full bg-gradient-to-r from-transparent via-[var(--gold)]/50 to-transparent" />
                    <Image
                      src={aboutVisualSrc}
                      alt="Kompozit üretim görseli"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                  <div className="about-accent-square hidden lg:block" />

                  {/* Floating Metric */}
                  <div className="absolute -left-8 -top-8 z-30 hidden lg:block">
                    <div className="border border-[var(--gold)]/30 bg-[var(--carbon)] p-8 shadow-2xl backdrop-blur-3xl">
                      <p className="font-display text-[2.5rem] leading-none text-[var(--gold)]">
                        {t('home.stats.yoeNumber').split('+')[0]}+
                      </p>
                      <p className="mt-2 text-[0.65rem] font-bold uppercase tracking-[3px] text-[var(--silver)]">
                         {t('home.stats.yoeLabel')}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <MaterialCards locale={locale} />

      {/* --- INDUSTRIES (Full Bleed Grid) --- */}
      <IndustryStrip locale={locale} />

      {/* --- PRODUCTS (Showcase Grid) --- */}
      <section className="section-py bg-[var(--carbon)]">
        <div className="mx-auto max-w-[1300px] px-6 lg:px-12">
          <Reveal>
            <div className="mb-16 flex items-end justify-between border-b border-[var(--gold)]/10 pb-8">
              <div className="max-w-2xl">
                <span className="section-label-cc">{t('home.products.sectionLabel') || 'Solutions'}</span>
                <h2 className="section-title-cc mb-0">{t('home.products.title')}</h2>
              </div>
              <Link
                href={localizedPath(locale, '/products')}
                className="hidden items-center gap-3 text-[0.75rem] font-bold uppercase tracking-[3px] text-[var(--gold)] transition-all hover:gap-4 lg:flex"
              >
                {t('common.viewAll')} <ArrowRight className="size-5" />
              </Link>
            </div>
          </Reveal>

          <div className="industrial-grid-cc sm:grid-cols-2 lg:grid-cols-3">
            {visibleProducts.map((p: any, index: number) => (
              <Reveal key={p.id ?? p.title} delay={(index % 3) * 100} className="grid-item-cc">
                <ListingCard
                  listIndex={index + 1}
                  visualVariant={index}
                  href={p.slug ? localizedPath(locale, `/products/${p.slug}`) : localizedPath(locale, '/products')}
                  title={p.title}
                  description={p.description}
                  lineLabel={t('common.listingEngineeringLine')}
                  imageSrc={
                    resolvePublicAssetUrl(p.image_url) ?? p.image_url ?? PRODUCT_PLACEHOLDER_SRC
                  }
                  imageAlt={p.title}
                  imageSizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  imageAspectClassName="h-[450px]"
                  specs={p.specs}
                  category={p.category}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --- PROCESS (Timeline) --- */}
      <ProcessTimeline locale={locale} />

      {/* --- ADVANTAGES (Why us) --- */}
      <AdvantagesGrid locale={locale} />

      {/* --- PORTFOLIO (Gallery) --- */}
      <GalleryShowcase locale={locale} items={visibleGalleries} />

      {/* --- CTA / TRUST --- */}
      <section className="section-py relative overflow-hidden bg-(--graphite)">
        <div className="carbon-texture absolute inset-0 opacity-[0.05]" />
        <div className="mx-auto max-w-[1300px] px-6 text-center lg:px-12">
          <Reveal>
            <div className="mx-auto max-w-3xl">
              <span className="section-label-cc">{t('common.contactUs')}</span>
              <h2 className="section-title-cc">{t('common.offerCtaTitle')}</h2>
              <p className="mb-14 text-lg font-light leading-relaxed text-[var(--silver)]">
                {t('common.offerCtaDescription')}
              </p>

              <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
                <Link
                  href={localizedPath(locale, '/contact')}
                  className="hero-btn-primary shimmer-btn"
                >
                  {t('common.requestOffer')}
                  <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <div className="flex items-center gap-3 px-6 py-4">
                  <Shield className="size-5 text-[var(--gold)]/60" />
                  <span className="text-sm font-medium tracking-wide text-[var(--silver)]/80">
                    {t('common.freeOfObligation')}
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* --- CONTACT FORM --- */}
      <HomeContact
        contactInfo={contactForLd}
        labels={{
          label: t('contact.label'),
          title: t('contact.form.title'),
          description: t('contact.form.subtitle'),
          namePlaceholder: t('common.name'),
          emailPlaceholder: t('common.email'),
          messagePlaceholder: t('common.message'),
          submit: t('common.send'),
          response: t('contact.features.one') || 'Response within 24 hours',
          infoLabels: {
            email: t('contact.info.email'),
            phone: t('contact.info.phone'),
            address: t('contact.info.address'),
            hours: t('contact.info.hours'),
          }
        }}
      />
    </main>
  );
}
