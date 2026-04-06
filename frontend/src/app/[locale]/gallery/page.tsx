import 'server-only';

import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { API_BASE_URL, resolvePublicAssetUrl } from '@/lib/utils';
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
    <main className="relative bg-[var(--carbon)]">
      <div className="gold-grid-bg absolute inset-0 z-0 opacity-20" />
      
      <div className="section-py relative z-10">
        <div className="mx-auto max-w-[1300px] px-6 lg:px-12">
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
          
          <Reveal>
            <div className="mb-16">
              <span className="section-label-cc">Portfolio</span>
              <h1 className="section-title-cc">{t('gallery.title')}</h1>
              <p className="section-subtitle-cc">{t('gallery.description')}</p>
            </div>
          </Reveal>

          <div className="mt-12">
            {galleries.length === 0 && !visibleGalleries.length && (
              <div className="border border-[var(--gold)]/10 p-16 text-center bg-[var(--graphite)] mb-12">
                <SeoIssueBeacon
                  type="soft-404"
                  pathname={localizedPath(locale, '/gallery')}
                  reason="gallery-list-empty"
                />
                <p className="font-display text-[1.8rem] uppercase tracking-[4px] text-[var(--white)]">
                   {t('gallery.noGalleries')}
                </p>
                <p className="mt-6 text-sm font-light text-[var(--silver)] max-w-md mx-auto">
                  {locale === 'en'
                    ? 'Sample project visuals are being processed. Check back for high-definition production stages.'
                    : 'Proje gorselleri uretim hattindan aktariliyor. Yuksek cozunurluklu uretim asamalarimiz yakinda burada olacak.'}
                </p>
              </div>
            )}
            
            <div className="industrial-grid-cc sm:grid-cols-2 lg:grid-cols-4">
              {visibleGalleries.map((g: any, index: number) => {
                const isLarge = index === 0 || index === 3;
                const media = buildMediaAlt({
                   locale,
                   kind: 'gallery-cover',
                   title: g.title,
                   alt: g.cover_image_alt,
                   description: g.description,
                });

                return (
                  <Reveal 
                    key={g.id ?? g.title} 
                    delay={index * 50} 
                    className={`grid-item-cc group relative overflow-hidden ${isLarge ? 'lg:row-span-2 h-[450px] lg:h-[900px]' : 'h-[450px]'}`}
                  >
                    <MediaOverlayCard
                      href={g.slug ? localizedPath(locale, `/gallery/${g.slug}`) : localizedPath(locale, '/gallery')}
                      src={
                        resolvePublicAssetUrl(
                          g.cover_image_url || g.cover_image_url_resolved || g.cover_image || g.imageSrc,
                        ) ??
                        g.cover_image_url ??
                        g.cover_image_url_resolved ??
                        g.cover_image ??
                        g.imageSrc ??
                        GALLERY_PLACEHOLDER_SRC
                      }
                      alt={media}
                      title={g.title}
                      meta={g.image_count != null ? `${g.image_count} FILES` : undefined}
                      description={g.description}
                      sizes="(max-width: 768px) 100vw, 25vw"
                      aspectClassName="h-full w-full"
                    />
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
