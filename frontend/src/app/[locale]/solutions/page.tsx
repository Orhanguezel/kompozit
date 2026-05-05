import 'server-only';

import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { buildPageMetadataFromSettings, JsonLd, jsonld, localizedPath, localizedUrl } from '@/seo';
import { SectionHeader } from '@/components/patterns/SectionHeader';
import { ListingCard } from '@/components/patterns/ListingCard';
import { Reveal } from '@/components/motion/Reveal';
import { fetchSolutions } from '@/features/solutions';
import { resolvePublicAssetUrl } from '@/lib/utils';
import { getFallbackSolutions } from '@/lib/content-fallbacks';

function getSolutionSlug(item: Record<string, unknown>): string {
  const candidates = [
    item.slug,
    item.slug_tr,
    item.slug_en,
    (item.i18n as Record<string, unknown> | undefined)?.slug,
    (item.translation as Record<string, unknown> | undefined)?.slug,
  ];

  for (const value of candidates) {
    if (typeof value === 'string' && value.trim()) return value.trim();
  }

  return '';
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const [t, seoT] = await Promise.all([
    getTranslations({ locale, namespace: 'solutions' }),
    getTranslations({ locale, namespace: 'seo' }),
  ]);
  return buildPageMetadataFromSettings({
    locale,
    pathname: '/solutions',
    pageKey: 'solutions',
    fallback: {
      title: t('metaTitle'),
      description: seoT('solutionsDescription'),
    },
  });
}

export default async function SolutionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [tSol, tCommon] = await Promise.all([
    getTranslations({ locale, namespace: 'solutions' }),
    getTranslations({ locale, namespace: 'common' }),
  ]);
  const data = await fetchSolutions(locale);
  const items = data && data.length > 0 ? data : getFallbackSolutions(locale);

  return (
    <main className="relative bg-[var(--carbon)]">
      <JsonLd
        data={jsonld.graph([
          jsonld.collectionPage({
            name: tSol('listTitle'),
            description: tSol('listDescription'),
            url: localizedUrl(locale, '/solutions'),
            mainEntity: jsonld.itemList(
              items.slice(0, 24).map((item: { title?: string; slug?: string }) => ({
                name: String(item.title ?? ''),
                url: getSolutionSlug(item as Record<string, unknown>)
                  ? localizedUrl(locale, `/solutions/${getSolutionSlug(item as Record<string, unknown>)}`)
                  : localizedUrl(locale, '/solutions'),
              })),
            ),
          }),
        ])}
      />

      <section className="section-py">
        <div className="mx-auto max-w-[1300px] px-6 lg:px-12">
          <Reveal>
            <div className="mb-16">
              <span className="section-label-cc">{tSol('sectionLabel') || 'Engineering Solutions'}</span>
              <h1 className="section-title-cc">{tSol('listTitle')}</h1>
              <p className="section-subtitle-cc">{tSol('listDescription')}</p>
            </div>
          </Reveal>

          {items.length === 0 ? (
            <p className="text-[var(--silver)] opacity-60">{tSol('empty')}</p>
          ) : (
            <div className="industrial-grid-cc sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item: any, index: number) => {
                const solutionSlug = getSolutionSlug(item);

                return (
                  <Reveal key={item.id ?? solutionSlug ?? item.title} delay={index * 50} className="grid-item-cc">
                    <ListingCard
                      listIndex={index + 1}
                      visualVariant={index}
                      href={solutionSlug ? localizedPath(locale, `/solutions/${solutionSlug}`) : localizedPath(locale, '/solutions')}
                      title={item.title}
                      lineLabel={tCommon('listingEngineeringLine')}
                      description={item.description ?? item.summary}
                      imageSrc={
                        resolvePublicAssetUrl(item.image_url ?? item.featured_image) ??
                        item.image_url ??
                        item.featured_image
                      }
                      specs={item.specs}
                      category={item.category}
                      imageAlt={item.title}
                      imageSizes="(max-width: 768px) 100vw, 33vw"
                      imageAspectClassName="h-[450px]"
                    />
                  </Reveal>
                );
              })}
            </div>
          )}

          <Reveal delay={400}>
            <div className="mt-24 border-t border-[var(--gold)]/10 pt-16 text-center">
              <h2 className="font-display text-[1.8rem] uppercase tracking-[4px] text-[var(--white)] mb-8">
                 {tSol('ctaOffer')}
              </h2>
              <Link
                href={localizedPath(locale, '/offer')}
                className="hero-btn-primary shimmer-btn"
              >
                {tCommon('requestOffer')}
                <ArrowRight className="size-5" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
