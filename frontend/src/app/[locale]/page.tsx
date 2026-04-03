import 'server-only';

import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Shield, Zap, Settings, Truck } from 'lucide-react';

import { absoluteAssetUrl, API_BASE_URL } from '@/lib/utils';
import { JsonLd, buildPageMetadata, localizedPath, siteUrlBase } from '@/seo';
import { buildHomePageSchemaGraph } from '@/seo/home-jsonld';
import { NewsletterForm } from '@/components/sections/NewsletterForm';
import { ReferencesTrustStrip } from '@/components/sections/ReferencesTrustStrip';
import { DarkCtaPanel } from '@/components/patterns/DarkCtaPanel';
import { FeatureCard } from '@/components/patterns/FeatureCard';
import { ListingCard } from '@/components/patterns/ListingCard';
import { MediaOverlayCard } from '@/components/patterns/MediaOverlayCard';
import { SectionHeader } from '@/components/patterns/SectionHeader';
import { Reveal } from '@/components/motion/Reveal';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { getFallbackBlogPosts, getFallbackGalleries, getFallbackProducts } from '@/lib/content-fallbacks';
import { fetchParsedContactInfo } from '@/lib/contact-info';
import { fetchHomePageContent } from '@/features/site-settings/home';
import { buildMediaAlt } from '@/lib/media-seo';

const GALLERY_PLACEHOLDER_SRC = '/media/gallery-placeholder.svg';
const BLOG_PLACEHOLDER_SRC = '/media/blog-placeholder.svg';

function homeHref(locale: string, path: string): string {
  const p = (path || '').trim();
  if (!p.startsWith('/') || p.startsWith('//')) return localizedPath(locale, '/');
  return localizedPath(locale, p);
}

async function fetchFeaturedProducts(locale: string) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/products?item_type=kompozit&is_active=1&is_featured=1&locale=${locale}&limit=8`,
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
      `${API_BASE_URL}/galleries?module_key=kompozit&is_active=1&is_featured=1&locale=${locale}&limit=6`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data as any)?.items ?? [];
  } catch {
    return [];
  }
}

async function fetchFeaturedBlogPosts(locale: string) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/custom_pages?module_key=kompozit_blog&is_active=1&locale=${locale}&limit=3`,
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
    description: t('defaultDescription'),
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  const [products, galleries, blogPosts, homeContent, contactForLd] = await Promise.all([
    fetchFeaturedProducts(locale),
    fetchFeaturedGalleries(locale),
    fetchFeaturedBlogPosts(locale),
    fetchHomePageContent(locale),
    fetchParsedContactInfo(locale),
  ]);

  const siteUrl = siteUrlBase();
  const { hero: heroApi, metrics: metricsApi, valueProps: valuePropsApi } = homeContent;

  const baseMetrics = t.raw('home.hero.metrics') as Record<string, string>;
  const heroMetrics = metricsApi
    ? {
        prototypeTitle: metricsApi.items[0]?.title ?? baseMetrics.prototypeTitle,
        prototypeDesc: metricsApi.items[0]?.description ?? baseMetrics.prototypeDesc,
        productionTitle: metricsApi.items[1]?.title ?? baseMetrics.productionTitle,
        productionDesc: metricsApi.items[1]?.description ?? baseMetrics.productionDesc,
        engineeringTitle: metricsApi.items[2]?.title ?? baseMetrics.engineeringTitle,
        engineeringDesc: metricsApi.items[2]?.description ?? baseMetrics.engineeringDesc,
      }
    : {
        prototypeTitle: baseMetrics.prototypeTitle,
        prototypeDesc: baseMetrics.prototypeDesc,
        productionTitle: baseMetrics.productionTitle,
        productionDesc: baseMetrics.productionDesc,
        engineeringTitle: baseMetrics.engineeringTitle,
        engineeringDesc: baseMetrics.engineeringDesc,
      };

  const baseSteps = t.raw('home.hero.steps') as Record<string, string>;
  const heroSteps = metricsApi
    ? {
        oneTitle: metricsApi.workflowSteps[0]?.title ?? baseSteps.oneTitle,
        oneDesc: metricsApi.workflowSteps[0]?.description ?? baseSteps.oneDesc,
        twoTitle: metricsApi.workflowSteps[1]?.title ?? baseSteps.twoTitle,
        twoDesc: metricsApi.workflowSteps[1]?.description ?? baseSteps.twoDesc,
        threeTitle: metricsApi.workflowSteps[2]?.title ?? baseSteps.threeTitle,
        threeDesc: metricsApi.workflowSteps[2]?.description ?? baseSteps.threeDesc,
      }
    : {
        oneTitle: baseSteps.oneTitle,
        oneDesc: baseSteps.oneDesc,
        twoTitle: baseSteps.twoTitle,
        twoDesc: baseSteps.twoDesc,
        threeTitle: baseSteps.threeTitle,
        threeDesc: baseSteps.threeDesc,
      };

  const baseStats = t.raw('home.hero.stats') as Record<string, string>;
  const heroStats = metricsApi
    ? {
        stepsValue: metricsApi.stats[0]?.value ?? baseStats.stepsValue,
        stepsLabel: metricsApi.stats[0]?.label ?? baseStats.stepsLabel,
        b2bValue: metricsApi.stats[1]?.value ?? baseStats.b2bValue,
        b2bLabel: metricsApi.stats[1]?.label ?? baseStats.b2bLabel,
      }
    : {
        stepsValue: baseStats.stepsValue,
        stepsLabel: baseStats.stepsLabel,
        b2bValue: baseStats.b2bValue,
        b2bLabel: baseStats.b2bLabel,
      };
  const visibleProducts = products.length > 0 ? products.slice(0, 8) : getFallbackProducts(locale);
  const visibleBlogPosts = blogPosts.length > 0 ? blogPosts.slice(0, 3) : getFallbackBlogPosts(locale);
  const visibleGalleries = galleries.length > 0 ? galleries.slice(0, 6) : getFallbackGalleries(locale);
  const [featuredBlogPost, ...secondaryBlogPosts] = visibleBlogPosts;
  const featuredBlogImageSrc =
    absoluteAssetUrl(featuredBlogPost?.image_url || featuredBlogPost?.featured_image) ||
    BLOG_PLACEHOLDER_SRC;

  const whyUsItems = [
    { icon: Shield, key: 'quality' },
    { icon: Zap, key: 'experience' },
    { icon: Settings, key: 'custom' },
    { icon: Truck, key: 'delivery' },
  ] as const;

  return (
    <>
      <JsonLd
        data={buildHomePageSchemaGraph(locale, {
          siteUrl,
          seoDescription: t('seo.defaultDescription'),
          contact: contactForLd,
        })}
      />

      {/* Hero */}
      <section className="surface-dark-shell carbon-mesh backdrop-blur-[2px]">
        <div className="surface-hero-glow-brand motion-float-soft absolute left-[-8rem] top-16 h-72 w-72 rounded-full blur-3xl opacity-40" />
        <div className="surface-hero-glow-muted motion-float-soft absolute right-[-6rem] top-24 h-80 w-80 rounded-full blur-3xl opacity-20" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 lg:grid-cols-[minmax(0,1.2fr)_minmax(24rem,0.8fr)] lg:px-8 lg:py-32">
          <div className="motion-fade-up max-w-3xl">
            <span className="surface-glass-dark shimmer-btn inline-flex rounded-full px-5 py-1.5 text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-brand-light)] border-brand/20">
              {heroApi?.badge ?? t('home.hero.badge')}
            </span>
            <h1 className="surface-dark-heading motion-fade-up motion-delay-1 mt-6 max-w-4xl text-balance text-4xl font-bold lg:text-6xl">
              {heroApi?.title ?? t('home.hero.title')}
            </h1>
            <p className="surface-dark-text motion-fade-up motion-delay-2 mt-6 max-w-2xl text-lg leading-8">
              {heroApi?.subtitle ?? t('home.hero.subtitle')}
            </p>
            <div className="motion-fade-up motion-delay-3 mt-10 flex flex-wrap gap-5">
              <Link
                href={heroApi?.primaryCtaHref ? homeHref(locale, heroApi.primaryCtaHref) : localizedPath(locale, '/products')}
                className="btn-primary shimmer-btn glow-hover inline-flex items-center gap-3 rounded-xl px-8 py-4 font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {heroApi?.primaryCtaLabel ?? t('home.hero.cta')}
                <ArrowRight className="size-5" />
              </Link>
              <Link
                href={heroApi?.secondaryCtaHref ? homeHref(locale, heroApi.secondaryCtaHref) : localizedPath(locale, '/offer')}
                className="glass-premium surface-glass-hover surface-dark-heading inline-flex items-center gap-3 rounded-xl px-8 py-4 font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {heroApi?.secondaryCtaLabel ?? t('home.hero.ctaSecondary')}
              </Link>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              <div className="glass-premium motion-fade-up motion-delay-2 rounded-2xl p-5 border-white/5">
                <p className="surface-dark-heading text-2xl font-bold tracking-tight">{heroMetrics.prototypeTitle}</p>
                <p className="surface-dark-text mt-1 text-xs font-medium uppercase tracking-wider opacity-80">{heroMetrics.prototypeDesc}</p>
              </div>
              <div className="glass-premium motion-fade-up motion-delay-3 rounded-2xl p-5 border-white/5">
                <p className="surface-dark-heading text-2xl font-bold tracking-tight">{heroMetrics.productionTitle}</p>
                <p className="surface-dark-text mt-1 text-xs font-medium uppercase tracking-wider opacity-80">{heroMetrics.productionDesc}</p>
              </div>
              <div className="glass-premium motion-fade-up motion-delay-4 rounded-2xl p-5 border-white/5">
                <p className="surface-dark-heading text-2xl font-bold tracking-tight">{heroMetrics.engineeringTitle}</p>
                <p className="surface-dark-text mt-1 text-xs font-medium uppercase tracking-wider opacity-80">{heroMetrics.engineeringDesc}</p>
              </div>
            </div>
          </div>

          <div className="motion-slide-right motion-delay-2 flex items-stretch justify-center lg:justify-end">
            <div className="glass-premium shadow-hero-panel w-full max-w-xl rounded-[2.5rem] p-4 border-white/10">
              <div className="glass-premium rounded-[2rem] p-8 border-white/5 bg-white/[0.02]">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="surface-dark-text text-[10px] font-bold uppercase tracking-[0.25em] opacity-70">
                      {heroApi?.workflowLabel ?? t('home.hero.workflowLabel')}
                    </p>
                    <h2 className="surface-dark-heading mt-3 text-3xl font-bold tracking-tight">
                      {heroApi?.workflowTitle ?? t('home.hero.workflowTitle')}
                    </h2>
                  </div>
                  <div className="glass-premium rounded-2xl px-5 py-4 text-right border-brand/30 bg-brand/10">
                    <p className="surface-dark-heading text-3xl font-bold text-gradient-brand">
                      {heroApi?.workflowBadgeTitle ?? t('home.hero.workflowBadgeTitle')}
                    </p>
                    <p className="surface-dark-text text-[10px] font-bold uppercase tracking-wider">
                      {heroApi?.workflowBadgeSubtitle ?? t('home.hero.workflowBadgeSubtitle')}
                    </p>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <div className="glass-premium rounded-2xl px-5 py-5 border-white/5 hover:bg-white/[0.04] transition-colors group">
                    <p className="surface-dark-heading text-sm font-bold flex items-center gap-3">
                      <span className="size-6 rounded-full bg-brand/20 text-brand text-[10px] flex items-center justify-center border border-brand/30">
                        {metricsApi?.workflowSteps[0]?.step ?? '01'}
                      </span>
                      {heroSteps.oneTitle}
                    </p>
                    <p className="surface-dark-text mt-2 text-sm leading-relaxed opacity-80 pl-9">
                      {heroSteps.oneDesc}
                    </p>
                  </div>
                  <div className="glass-premium rounded-2xl px-5 py-5 border-white/5 hover:bg-white/[0.04] transition-colors group">
                    <p className="surface-dark-heading text-sm font-bold flex items-center gap-3">
                      <span className="size-6 rounded-full bg-brand/20 text-brand text-[10px] flex items-center justify-center border border-brand/30">
                        {metricsApi?.workflowSteps[1]?.step ?? '02'}
                      </span>
                      {heroSteps.twoTitle}
                    </p>
                    <p className="surface-dark-text mt-2 text-sm leading-relaxed opacity-80 pl-9">
                      {heroSteps.twoDesc}
                    </p>
                  </div>
                  <div className="glass-premium rounded-2xl px-5 py-5 border-white/5 hover:bg-white/[0.04] transition-colors group">
                    <p className="surface-dark-heading text-sm font-bold flex items-center gap-3">
                      <span className="size-6 rounded-full bg-brand/20 text-brand text-[10px] flex items-center justify-center border border-brand/30">
                        {metricsApi?.workflowSteps[2]?.step ?? '03'}
                      </span>
                      {heroSteps.threeTitle}
                    </p>
                    <p className="surface-dark-text mt-2 text-sm leading-relaxed opacity-80 pl-9">
                      {heroSteps.threeDesc}
                    </p>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="glass-premium rounded-2xl px-6 py-6 border-white/5">
                    <p className="surface-dark-heading text-4xl font-bold tracking-tighter text-gradient-brand">{heroStats.stepsValue}</p>
                    <p className="surface-dark-text mt-1 text-xs font-bold uppercase tracking-widest opacity-60">{heroStats.stepsLabel}</p>
                  </div>
                  <div className="glass-premium rounded-2xl px-6 py-6 border-white/5">
                    <p className="surface-dark-heading text-4xl font-bold tracking-tighter text-gradient-brand">{heroStats.b2bValue}</p>
                    <p className="surface-dark-text mt-1 text-xs font-bold uppercase tracking-widest opacity-60">{heroStats.b2bLabel}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="section-py">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="motion-fade-up">
            <SectionHeader
            title={valuePropsApi?.title ?? t('home.whyUs.title')}
            description={valuePropsApi?.subtitle ?? t('home.whyUs.subtitle')}
            label={valuePropsApi?.sectionLabel ?? (t('home.whyUs.sectionLabel') || 'Reliability')}
            align="center"
            />
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {whyUsItems.map(({ icon: Icon, key }, index) => {
              const fromDb = valuePropsApi?.items?.find((i) => i.key === key);
              return (
                <div key={key} className={`motion-fade-up motion-delay-${Math.min(index + 1, 4)}`}>
                  <FeatureCard
                    icon={<Icon className="size-7 text-[var(--color-brand)] group-hover:text-white transition-colors" />}
                    title={fromDb?.title ?? t(`home.whyUs.${key}`)}
                    description={fromDb?.description ?? t(`home.whyUs.${key}Desc`)}
                    index={index}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="section-py bg-[var(--color-bg-muted)]">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="motion-fade-up">
              <SectionHeader
              title={t('home.products.title')}
              description={t('home.products.subtitle')}
              label={t('home.products.sectionLabel') || 'Solutions'}
              action={(
                <Link
                  href={localizedPath(locale, '/products')}
                  className="hidden items-center gap-2 text-sm font-bold text-[var(--color-brand)] transition-all hover:gap-3 sm:flex"
                >
                  {t('common.viewAll')} <ArrowRight className="size-4" />
                </Link>
              )}
              />
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {visibleProducts.map((p: any, index: number) => (
                <div key={p.id ?? p.title} className={`motion-fade-up motion-delay-${(index % 4) + 1}`}>
                  <ListingCard
                    href={p.slug ? localizedPath(locale, `/products/${p.slug}`) : `${localizedPath(locale, '/offer')}?product=${encodeURIComponent(p.title)}`}
                    title={p.title}
                    description={p.description}
                    imageSrc={p.image_url}
                    imageAlt={buildMediaAlt({
                      locale,
                      kind: 'product',
                      title: p.title,
                      alt: p.alt,
                      caption: p.caption,
                      description: p.description,
                    })}
                    imageSizes="(max-width: 768px) 50vw, 25vw"
                    imageAspectClassName="aspect-[4/3]"
                    specs={p.specs}
                    category={p.category}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

      <ReferencesTrustStrip locale={locale} />

      {/* Gallery preview */}
      <section className="section-py">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="motion-fade-up">
            <SectionHeader
            title={t('home.gallery.title')}
            description={t('home.gallery.subtitle')}
            label={t('home.gallery.sectionLabel') || 'Visuals'}
            action={(
              <Link
                href={localizedPath(locale, '/gallery')}
                className="hidden items-center gap-2 text-sm font-bold text-[var(--color-brand)] transition-all hover:gap-3 sm:flex"
              >
                {t('common.viewAll')} <ArrowRight className="size-4" />
              </Link>
            )}
            />
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:auto-rows-[22rem] lg:grid-cols-3">
            {visibleGalleries.map((g: any, index: number) => {
              const bentoClasses = [
                'lg:col-span-2 lg:row-span-1', // Item 1: Wide
                'lg:col-span-1 lg:row-span-2', // Item 2: Tall
                'lg:col-span-1 lg:row-span-1', // Item 3: Square
                'lg:col-span-1 lg:row-span-1', // Item 4: Square
                'lg:col-span-2 lg:row-span-1', // Item 5: Wide
              ];
              const gridClass = bentoClasses[index % bentoClasses.length] || '';
              
              return (
                <Reveal key={g.id ?? g.title} delay={120 * (index + 1)} className={gridClass}>
                  <MediaOverlayCard
                    href={g.slug ? localizedPath(locale, `/gallery/${g.slug}`) : localizedPath(locale, '/gallery')}
                    src={absoluteAssetUrl(g.cover_image_url_resolved || g.cover_image || g.imageSrc) || GALLERY_PLACEHOLDER_SRC}
                    alt={buildMediaAlt({
                      locale,
                      kind: 'gallery-cover',
                      title: g.title,
                      alt: g.cover_image_alt,
                      description: g.description,
                    })}
                    title={g.title}
                    meta={g.image_count != null ? `${g.image_count} ${t('gallery.viewAll').toLowerCase()}` : undefined}
                    description={g.description}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    aspectClassName="h-full w-full"
                  />
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="section-py bg-[var(--color-bg-muted)] overflow-hidden relative">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 relative z-10">
          <Reveal>
            <SectionHeader
            title={t('home.blog.title')}
            description={t('home.blog.subtitle')}
            label={t('home.blog.sectionLabel') || 'Expertise'}
            />
          </Reveal>
          <Reveal className="mt-12" delay={120}>
            {featuredBlogPost ? (
              <article className="glass-premium overflow-hidden rounded-[2.5rem] bg-white/[0.03] border-brand/5 shadow-2xl transition-all hover:shadow-brand/5">
                <div className="grid gap-0 lg:grid-cols-2">
                  <div className="relative aspect-[16/10] lg:aspect-auto overflow-hidden bg-[var(--color-border)]">
                    <OptimizedImage
                      src={featuredBlogImageSrc}
                      alt={buildMediaAlt({
                        locale,
                        kind: 'blog',
                        title: featuredBlogPost.title,
                        alt: featuredBlogPost.alt,
                        caption: featuredBlogPost.description,
                        description: featuredBlogPost.description,
                      })}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover transition-transform duration-1000 hover:scale-105"
                    />
                    <div className="absolute left-6 top-6">
                       <span className="glass-premium rounded-full px-4 py-1 fontSize-[10px] uppercase font-bold tracking-widest text-brand border-brand/20">Featured Insight</span>
                    </div>
                  </div>
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <h3 className="text-balance text-3xl font-bold tracking-tight text-[var(--color-text-primary)] lg:text-4xl">
                      {featuredBlogPost.title || t('home.blog.spotlightTitle')}
                    </h3>
                    <p className="mt-6 text-lg leading-relaxed text-[var(--color-text-secondary)] opacity-80">
                      {featuredBlogPost.description || t('home.blog.spotlightBodyPrimary')}
                    </p>
                    
                    <div className="glass-premium mt-8 rounded-[1.5rem] p-6 border-white/5 bg-white/[0.02]">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand">
                        {t('home.blog.insightLabel')}
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)] opacity-90 italic">
                        "{t('home.blog.insightText')}"
                      </p>
                    </div>

                    <Link
                      href={featuredBlogPost?.slug ? localizedPath(locale, `/blog/${featuredBlogPost.slug}`) : localizedPath(locale, '/blog')}
                      className="btn-primary shimmer-btn glow-hover mt-10 inline-flex w-fit items-center gap-3 rounded-xl px-8 py-4 font-bold transition-all hover:scale-[1.02]"
                    >
                      {t('blog.readMore')}
                      <ArrowRight className="size-5" />
                    </Link>
                  </div>
                </div>
              </article>
            ) : null}
          </Reveal>

          <Reveal className="mt-16">
            <div className="flex items-center gap-6 mb-8">
               <h3 className="text-xl font-bold tracking-tight">{t('home.blog.archiveLabel')}</h3>
               <div className="h-px flex-1 bg-border/40" />
               <Link
                href={localizedPath(locale, '/blog')}
                className="items-center gap-2 text-sm font-bold text-brand hover:underline flex"
              >
                {t('common.viewAll')} <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              {secondaryBlogPosts.map((post: any, index: number) => (
                <Reveal key={post.id ?? post.title} delay={120 * (index + 1)}>
                  <article
                    className="glass-premium glow-hover group h-full flex flex-col rounded-[2rem] p-8 border-white/5 bg-white/[0.02] hover:-translate-y-1 transition-all"
                  >
                    <div className="flex-1">
                      <h3 className="text-xl font-bold tracking-tight group-hover:text-brand transition-colors">
                        {post.title}
                      </h3>
                      <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-secondary)] opacity-80 line-clamp-3">
                        {post.description}
                      </p>
                    </div>
                    <Link
                      href={post.slug ? localizedPath(locale, `/blog/${post.slug}`) : localizedPath(locale, '/blog')}
                      className="mt-8 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand transition-all hover:gap-3"
                    >
                      {t('blog.readMore')}
                      <ArrowRight className="size-4" />
                    </Link>
                  </article>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA Section */}
      <section className="surface-dark-shell carbon-mesh py-24 relative overflow-hidden">
        <div className="surface-hero-glow-brand motion-float-soft absolute right-0 top-0 h-96 w-96 rounded-full blur-3xl opacity-30" />
        <div className="surface-hero-glow-muted motion-float-soft absolute left-0 bottom-0 h-64 w-64 rounded-full blur-3xl opacity-10" />
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
          <Reveal>
            <DarkCtaPanel
            title={t('common.offerCtaTitle')}
            description={t('common.offerCtaDescription')}
            action={(
              <Link
                href={localizedPath(locale, '/offer')}
                className="btn-primary shimmer-btn glow-hover mt-10 inline-flex items-center gap-3 rounded-xl px-10 py-5 text-lg font-bold transition-all hover:scale-[1.05]"
              >
                {t('common.requestOffer')}
                <ArrowRight className="size-6" />
              </Link>
            )}
            />
          </Reveal>
        </div>
      </section>

      {/* Newsletter */}
      <section className="section-py surface-dark-shell carbon-mesh overflow-hidden py-24">
        <div className="surface-hero-glow-brand absolute right-[-5rem] top-[-5rem] h-64 w-64 rounded-full blur-3xl opacity-20" />
        <div className="mx-auto max-w-2xl px-4 text-center relative z-10">
          <Reveal>
            <h2 className="text-3xl font-bold tracking-tight surface-dark-heading lg:text-4xl">{t('home.newsletter.title')}</h2>
            <p className="mt-4 text-lg surface-dark-text opacity-70">
              {t('home.newsletter.subtitle')}
            </p>
          </Reveal>
          <Reveal className="mt-10" delay={200}>
            <div className="glass-premium p-2 pr-2 rounded-[1.5rem] bg-white/[0.05] border-white/10 max-w-lg mx-auto">
               <NewsletterForm locale={locale} />
            </div>
            <p className="mt-6 text-[10px] uppercase font-bold tracking-[0.25em] surface-dark-text opacity-40">
               Zero spam. Industrial level confidentiality.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
