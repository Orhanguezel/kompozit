import 'server-only';

import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

import { normalizeRichContent } from '@/lib/rich-content';
import { fetchParsedContactInfo } from '@/lib/contact-info';
import { ContentPageHeader } from '@/components/patterns/ContentPageHeader';
import { BrandCtaPanel } from '@/components/patterns/BrandCtaPanel';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
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
  const breadcrumbs = [
    { label: t('nav.home'), href: localizedPath(locale, '/') },
    { label: t('nav.solutions'), href: localizedPath(locale, '/solutions') },
    { label: asText(page.title) },
  ];
  const jsonLdBreadcrumb = [
    { name: t('nav.home'), url: localizedUrl(locale, '/') },
    { name: t('nav.solutions'), url: localizedUrl(locale, '/solutions') },
    { name: asText(page.title), url: localizedUrl(locale, `/solutions/${slug}`) },
  ];

  return (
    <div className="section-py">
      <div className="mx-auto max-w-3xl px-4 lg:px-8">
        <JsonLd
          data={jsonld.graph([
            ...buildOrganizationSchemaItems(locale, {
              description: asText(page.description ?? page.summary),
              contact: contactInfo,
              pagePath: `/solutions/${slug}`,
            }),
            jsonld.breadcrumb(jsonLdBreadcrumb),
          ])}
        />
        <Breadcrumbs items={breadcrumbs} />
        <ContentPageHeader
          title={asText(page.title)}
          description={asText(page.description ?? page.summary)}
        />
        {content ? (
          <div
            className="prose prose-theme prose-lg mt-8 max-w-none leading-relaxed prose-p:mb-5 prose-p:leading-relaxed prose-headings:scroll-mt-24 prose-headings:mt-10 prose-headings:mb-4 prose-li:my-1.5 md:prose-xl"
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
                  href={`${localizedPath(locale, '/offer')}?context=${encodeURIComponent(asText(page.title))}`}
                  className="btn-contrast inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
                >
                  {t('nav.offer')}
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href={localizedPath(locale, '/contact')}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-5 py-3 text-sm font-semibold text-[var(--color-text-primary)] transition-colors hover:bg-white/5"
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
