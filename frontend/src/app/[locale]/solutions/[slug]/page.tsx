import 'server-only';

import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

import { normalizeRichContent } from '@/lib/rich-content';
import { fetchParsedContactInfo } from '@/lib/contact-info';
import { BrandCtaPanel } from '@/components/patterns/BrandCtaPanel';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { buildMediaAlt } from '@/lib/media-seo';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { solutionFaqData } from '@/seo/faq-data';
import { howToSteps } from '@/seo/how-to-steps';
import {
  JsonLd,
  buildOrganizationSchemaItems,
  buildPageMetadata,
  jsonld,
  localizedPath,
  localizedUrl,
} from '@/seo';
import { fetchSolutionBySlug } from '@/features/solutions';

function asText(v: unknown): string {
  if (v == null) return '';
  if (typeof v === 'string') return v;
  return String(v);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const page = await fetchSolutionBySlug(slug, locale);
  if (!page) return {};
  const title = asText(page.meta_title) || asText(page.title);
  const description =
    asText(page.meta_description) ||
    asText(page.description) ||
    asText(page.summary) ||
    title;
  return buildPageMetadata({
    locale,
    pathname: `/solutions/${slug}`,
    title,
    description,
    ogImage: page.image_url ?? page.featured_image,
    includeLocaleAlternates: true,
  });
}

export default async function SolutionDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale });
  const tSol = await getTranslations({ locale, namespace: 'solutions' });
  const page = await fetchSolutionBySlug(slug, locale);
  if (!page) notFound();
  const contactInfo = await fetchParsedContactInfo(locale);

  const content = normalizeRichContent(page.content);
  const pageDescription = asText(page.description ?? page.summary);
  const pageTitle = asText(page.title);
  const heroImage = asText(page.image_url ?? page.featured_image ?? '');
  const breadcrumbs = [
    { label: t('nav.home'), href: localizedPath(locale, '/') },
    { label: t('nav.solutions'), href: localizedPath(locale, '/solutions') },
    { label: pageTitle },
  ];
  const localeKey = locale.startsWith('en') ? 'en' : 'tr';
  const jsonLdBreadcrumb = [
    { name: t('nav.home'), url: localizedUrl(locale, '/') },
    { name: t('nav.solutions'), url: localizedUrl(locale, '/solutions') },
    { name: pageTitle, url: localizedUrl(locale, `/solutions/${slug}`) },
  ];
  const faqEntries = solutionFaqData[slug]?.[localeKey] ?? [];
  const howToEntries = howToSteps[slug]?.[localeKey] ?? [];
  const schemaItems = [
    ...buildOrganizationSchemaItems(locale, {
      description: pageDescription,
      contact: contactInfo,
      pagePath: `/solutions/${slug}`,
    }),
    jsonld.breadcrumb(jsonLdBreadcrumb),
    ...(faqEntries.length > 0
      ? [
          jsonld.faqPage({
            url: localizedUrl(locale, `/solutions/${slug}`),
            mainEntity: faqEntries,
          }),
        ]
      : []),
    ...(howToEntries.length > 0
      ? [
          jsonld.howTo({
            name: localeKey === 'en' ? `${pageTitle} - Production Flow` : `${pageTitle} - Uretim Sureci`,
            description: pageDescription,
            step: howToEntries,
          }),
        ]
      : []),
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--color-carbon)] text-[var(--color-cream)]">
      <div className="gold-grid-bg pointer-events-none absolute inset-0 opacity-[0.35]" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,var(--color-carbon)_0%,color-mix(in_srgb,var(--color-graphite)_35%,var(--color-carbon))_50%,var(--color-carbon)_100%)] opacity-95"
        aria-hidden
      />

      <section className="relative z-10 border-b border-[color-mix(in_srgb,var(--color-gold)_12%,transparent)]">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          <JsonLd data={jsonld.graph(schemaItems)} />
          <Breadcrumbs
            items={breadcrumbs}
            className="mb-0"
            olClassName="text-[var(--color-light)] [&_a:hover]:text-[var(--color-gold)] [&_span.font-medium]:text-[var(--color-off-white)]"
          />
        </div>
        <div className="mx-auto grid max-w-7xl gap-12 px-4 pb-16 pt-2 lg:grid-cols-2 lg:px-8 lg:pb-24 lg:pt-4">
          {heroImage ? (
            <div className="relative aspect-[16/10] min-h-[200px] overflow-hidden border border-[color-mix(in_srgb,var(--color-gold)_15%,transparent)] bg-[var(--color-graphite)] lg:min-h-[340px]">
              <OptimizedImage
                src={heroImage}
                alt={buildMediaAlt({
                  locale,
                  kind: 'blog',
                  title: pageTitle,
                  alt: (page as { cover_image_alt?: string }).cover_image_alt,
                  description: pageDescription,
                })}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          ) : null}
          <div className={heroImage ? '' : 'lg:col-span-2'}>
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[var(--color-gold)]">
              {tSol('detailHeroEyebrow')}
            </p>
            <h1 className="mt-4 text-balance font-[var(--font-display)] text-4xl font-normal tracking-tight text-[var(--color-off-white)] lg:text-6xl">
              {pageTitle}
            </h1>
            {pageDescription ? (
              <p className="mt-6 max-w-2xl text-lg font-light leading-relaxed text-[var(--color-silver)]">
                {pageDescription}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <div className="relative z-10 mx-auto max-w-3xl px-4 py-16 lg:px-8">
        {content ? (
          <div
            className="prose prose-invert prose-lg max-w-none leading-relaxed prose-p:mb-5 prose-p:leading-relaxed prose-headings:scroll-mt-24 prose-headings:mt-10 prose-headings:mb-4 prose-headings:font-[var(--font-display)] prose-headings:font-normal prose-headings:text-[var(--color-off-white)] prose-li:my-1.5 prose-a:text-[var(--color-gold)] md:prose-xl"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : null}

        <div className="mt-12">
          <BrandCtaPanel
            title={tSol('detailCtaTitle')}
            description={tSol('detailCtaDescription')}
            action={(
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={`${localizedPath(locale, '/offer')}?context=${encodeURIComponent(pageTitle)}`}
                  className="btn-primary shimmer-btn inline-flex items-center gap-2 rounded-sm px-5 py-3 text-sm font-semibold transition-opacity hover:opacity-95"
                >
                  {t('nav.offer')}
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href={localizedPath(locale, '/contact')}
                  className="inline-flex items-center gap-2 rounded-sm border border-[color-mix(in_srgb,var(--color-gold)_25%,transparent)] px-5 py-3 text-sm font-semibold text-[var(--color-cream)] transition-colors hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]"
                >
                  {t('nav.contact')}
                </Link>
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
}
