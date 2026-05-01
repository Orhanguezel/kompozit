import 'server-only';

import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

import { ListingCard } from '@/components/patterns/ListingCard';
import { SectionHeader } from '@/components/patterns/SectionHeader';
import { JsonLd, buildPageMetadata, jsonld, localizedUrl } from '@/seo';
import { fetchReferences } from '@/features/references';
import { getFallbackReferences } from '@/lib/content-fallbacks';
import { absoluteAssetUrl } from '@/lib/utils';
import { Reveal } from '@/components/motion/Reveal';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const [t, seoT] = await Promise.all([
    getTranslations({ locale, namespace: 'references' }),
    getTranslations({ locale, namespace: 'seo' }),
  ]);

  return buildPageMetadata({
    locale,
    pathname: '/references',
    title: locale.startsWith('en')
      ? `${t('title')} - Enterprise Collaboration and Delivery Discipline`
      : `${t('title')} - Kurumsal Is Birligi ve Teslim Disiplini`,
    description: seoT('referencesDescription'),
  });
}

export default async function ReferencesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const references = await fetchReferences(locale, { limit: 24, revalidate: 300 });
  const visibleReferences = references.length > 0 ? references : getFallbackReferences(locale);

  return (
    <div className="min-h-screen bg-[var(--color-carbon)] relative overflow-hidden text-[var(--color-cream)]">
      <div className="gold-grid-bg pointer-events-none absolute inset-0 opacity-[0.2]" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--color-carbon)_80%)] opacity-80" aria-hidden />

      <div className="section-py relative z-10">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <JsonLd
            data={jsonld.graph([
              jsonld.collectionPage({
                name: t('references.title'),
                description: t('references.description'),
                url: localizedUrl(locale, '/references'),
                mainEntity: jsonld.itemList(
                  visibleReferences.map((item: any) => ({
                    name: item.title,
                    url: item.website_url || localizedUrl(locale, '/references'),
                  })),
                ),
              }),
            ])}
          />

          <SectionHeader
            title={t('references.title')}
            description={t('references.description')}
            label={t('references.trustLabel')}
            align="left"
          />

          {references.length === 0 ? (
            <div className="glass-premium mt-12 rounded-[2rem] p-10 border-white/5 bg-white/[0.02]">
              <p className="text-lg font-bold tracking-tight">{t('references.noReferences')}</p>
            </div>
          ) : null}

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {visibleReferences.map((item: any, index: number) => (
              <Reveal key={item.id ?? item.title} delay={100 * (index % 6)}>
                <ListingCard
                  href={item.website_url || localizedUrl(locale, '/references')}
                  title={item.title}
                  lineLabel={t('common.listingReferenceLine')}
                  description={item.summary || item.description}
                  imageSrc={absoluteAssetUrl(item.featured_image || item.imageSrc) || undefined}
                  imageAlt={item.featured_image_alt ?? item.title}
                  imageSizes="(max-width: 768px) 100vw, 33vw"
                  imageAspectClassName="aspect-[16/10]"
                  footer={
                    <div className="text-xs font-bold uppercase tracking-widest text-brand">
                      {item.website_url ? t('references.viewWebsite') : t('references.viewAll')}
                    </div>
                  }
                />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
