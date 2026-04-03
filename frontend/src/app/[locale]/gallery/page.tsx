import 'server-only';

import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { API_BASE_URL } from '@/lib/utils';
import { JsonLd, buildPageMetadata, jsonld, localizedPath, localizedUrl } from '@/seo';
import { MediaOverlayCard } from '@/components/patterns/MediaOverlayCard';
import { SectionHeader } from '@/components/patterns/SectionHeader';
import { buildMediaAlt, buildMediaSchemaText } from '@/lib/media-seo';
import { SeoIssueBeacon } from '@/components/monitoring/SeoIssueBeacon';
import { getFallbackGalleries } from '@/lib/content-fallbacks';

import { Reveal } from '@/components/motion/Reveal';

const GALLERY_PLACEHOLDER_SRC = '/media/gallery-placeholder.svg';

async function fetchGalleries(locale: string) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/galleries?module_key=kompozit&is_active=1&locale=${locale}&limit=50&sort=display_order&orderDir=asc`,
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
  const t = await getTranslations({ locale, namespace: 'gallery' });
  return buildPageMetadata({
    locale,
    pathname: '/gallery',
    title: locale.startsWith('en')
      ? `${t('title')} - Composite Production and Project Visuals`
      : `${t('title')} - Kompozit Uretim ve Proje Gorselleri`,
    description: t('description'),
  });
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const galleries = await fetchGalleries(locale);
  const visibleGalleries = galleries.length > 0 ? galleries : getFallbackGalleries(locale);

  return (
    <div className="min-h-screen bg-[var(--color-bg-muted)] relative overflow-hidden">
      <div className="surface-dark-shell carbon-mesh absolute inset-0 opacity-[0.03] pointer-events-none" />
      
      <div className="section-py relative z-10">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <JsonLd
            data={jsonld.graph([
              jsonld.collectionPage({
                name: t('gallery.title'),
                description: t('gallery.description'),
                url: localizedUrl(locale, '/gallery'),
                mainEntity: jsonld.itemList(
                  visibleGalleries.map((gallery: any) => ({
                    name: gallery.title,
                    url: gallery.slug
                      ? localizedUrl(locale, `/gallery/${gallery.slug}`)
                      : localizedUrl(locale, '/gallery'),
                  })),
                ),
              }),
            ])}
          />
          <SectionHeader
            title={t('gallery.title')}
            description={t('gallery.description')}
            label="Visuals"
            align="left"
          />

          <div className="mt-12">
            {galleries.length === 0 && (
              <div className="glass-premium rounded-[2rem] p-12 text-center border-white/5 bg-white/[0.02] mb-12">
                <SeoIssueBeacon
                  type="soft-404"
                  pathname={localizedPath(locale, '/gallery')}
                  reason="gallery-list-empty"
                />
                <p className="text-xl font-bold tracking-tight">
                  {t('gallery.noGalleries')}
                </p>
                <p className="mt-4 text-sm text-[var(--color-text-muted)] opacity-70">
                  {locale === 'en'
                    ? 'Sample project visuals are being processed. Check back for high-definition production stages.'
                    : 'Proje gorselleri uretim hattindan aktariliyor. Yuksek cozunurluklu uretim asamalarimiz yakinda burada olacak.'}
                </p>
              </div>
            )}
            
            <div className="grid gap-6 sm:grid-cols-2 lg:auto-rows-[22rem] lg:grid-cols-3 xl:gap-8">
              {visibleGalleries.map((g: any, index: number) => {
                const bentoClasses = [
                  'lg:col-span-2 lg:row-span-1', // Wide
                  'lg:col-span-1 lg:row-span-2', // Tall
                  'lg:col-span-1 lg:row-span-1', // Square
                  'lg:col-span-1 lg:row-span-1', // Square
                  'lg:col-span-2 lg:row-span-1', // Wide
                ];
                const gridClass = bentoClasses[index % bentoClasses.length] || '';
                const media = buildMediaAlt({
                   locale,
                   kind: 'gallery-cover',
                   title: g.title,
                   alt: g.cover_image_alt,
                   description: g.description,
                });

                return (
                  <Reveal key={g.id ?? g.title} delay={100 * (index % 6)} className={gridClass}>
                    <MediaOverlayCard
                      href={g.slug ? localizedPath(locale, `/gallery/${g.slug}`) : localizedPath(locale, '/gallery')}
                      src={g.cover_image_url_resolved || g.cover_image || g.imageSrc || GALLERY_PLACEHOLDER_SRC}
                      alt={media}
                      title={g.title}
                      meta={g.image_count != null ? `${g.image_count} ${t('common.viewAll').toLowerCase()}` : undefined}
                      description={g.description}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      aspectClassName="h-full w-full"
                    />
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
