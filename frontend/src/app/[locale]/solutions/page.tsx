import 'server-only';

import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { buildPageMetadata, JsonLd, jsonld, localizedPath, localizedUrl } from '@/seo';
import { SectionHeader } from '@/components/patterns/SectionHeader';
import { ListingCard } from '@/components/patterns/ListingCard';
import { Reveal } from '@/components/motion/Reveal';
import { fetchSolutions } from '@/features/solutions';
import { getFallbackSolutions } from '@/lib/content-fallbacks';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'solutions' });
  return buildPageMetadata({
    locale,
    pathname: '/solutions',
    title: t('metaTitle'),
    description: t('metaDescription'),
  });
}

export default async function SolutionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tSol = await getTranslations({ locale, namespace: 'solutions' });
  const data = await fetchSolutions(locale);
  const items = data && data.length > 0 ? data : getFallbackSolutions(locale);

  return (
    <div className="section-py bg-[var(--color-bg-muted)] relative overflow-hidden">
      <div className="surface-dark-shell carbon-mesh absolute inset-0 opacity-[0.03] pointer-events-none" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-8">
        <JsonLd
          data={jsonld.graph([
            jsonld.collectionPage({
              name: tSol('listTitle'),
              description: tSol('listDescription'),
              url: localizedUrl(locale, '/solutions'),
              mainEntity: jsonld.itemList(
                items.slice(0, 24).map((item: { title?: string; slug?: string }) => ({
                  name: String(item.title ?? ''),
                  url: item.slug ? localizedUrl(locale, `/solutions/${item.slug}`) : localizedUrl(locale, '/offer'),
                })),
              ),
            }),
          ])}
        />
        <SectionHeader
          title={tSol('listTitle')}
          description={tSol('listDescription')}
          label={tSol('sectionLabel')}
          align="left"
        />

        {items.length === 0 ? (
          <p className="mt-10 text-[var(--color-text-secondary)]">{tSol('empty')}</p>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item: any, index: number) => (
              <Reveal key={item.id ?? item.slug} delay={80 * (index + 1)}>
                <ListingCard
                  href={item.slug ? localizedPath(locale, `/solutions/${item.slug}`) : localizedPath(locale, '/offer')}
                  title={item.title}
                  description={item.description ?? item.summary}
                  imageSrc={item.image_url ?? item.featured_image}
                  specs={item.specs}
                  category={item.category}
                  imageAlt={item.title}
                  imageSizes="(max-width: 768px) 100vw, 33vw"
                  imageAspectClassName="aspect-[16/10]"
                />
              </Reveal>
            ))}
          </div>
        )}

        <div className="mt-14 text-center">
          <Link
            href={localizedPath(locale, '/offer')}
            className="btn-primary shimmer-btn glow-hover inline-flex items-center gap-2 rounded-xl px-8 py-4 font-semibold"
          >
            {tSol('ctaOffer')}
            <ArrowRight className="size-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
