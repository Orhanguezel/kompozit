import 'server-only';

import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { API_BASE_URL, resolvePublicAssetUrl } from '@/lib/utils';
import { JsonLd, buildPageMetadata, jsonld, localizedPath, localizedUrl } from '@/seo';
import { buildOrganizationSchemaItems } from '@/seo/organization-schema';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { fetchRelatedContent } from '@/lib/related-content';
import { fetchParsedContactInfo } from '@/lib/contact-info';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { RelatedLinks } from '@/components/seo/RelatedLinks';
import { buildMediaAlt, buildMediaCaption, buildMediaSchemaText, isMeaningfulMediaDate, resolveMediaDimensions } from '@/lib/media-seo';

const GALLERY_PLACEHOLDER_SRC = '/media/gallery-placeholder.svg';

async function fetchGallery(slug: string, locale: string) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/galleries/${encodeURIComponent(slug)}?locale=${locale}`,
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
  const gallery = await fetchGallery(slug, locale);
  if (!gallery) return {};
  return buildPageMetadata({
    locale,
    pathname: `/gallery/${slug}`,
    title:
      gallery.meta_title ||
      (locale.startsWith('en')
        ? `${gallery.title} - Composite Project Gallery`
        : `${gallery.title} - Kompozit Proje Galerisi`),
    description:
      gallery.meta_description ||
      gallery.description ||
      (locale.startsWith('en')
        ? `${gallery.title}. Review visuals from composite production steps, project details and completed applications.`
        : `${gallery.title}. Kompozit uretim adimlari, proje detaylari ve tamamlanan uygulamalardan gorselleri inceleyin.`),
    ogImage: gallery.cover_image_url || gallery.cover_image_url_resolved || gallery.cover_image,
    includeLocaleAlternates: false,
  });
}

export default async function GalleryDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale });
  const gallery = await fetchGallery(slug, locale);
  if (!gallery) notFound();

  const images = Array.isArray(gallery.images)
    ? gallery.images.map((img: Record<string, unknown>) => {
        const raw =
          (typeof img.image_url_resolved === 'string' && img.image_url_resolved) ||
          (typeof img.asset_url === 'string' && img.asset_url) ||
          (typeof img.image_url === 'string' && img.image_url) ||
          '';
        const resolved = resolvePublicAssetUrl(raw) ?? raw;
        return {
          ...img,
          image_url_resolved: resolved,
          width: img.width || img.asset_width,
          height: img.height || img.asset_height,
        };
      })
    : [];
  const related = await fetchRelatedContent(gallery, slug, locale);
  const contactInfo = await fetchParsedContactInfo(locale);
  const galleryUrl = localizedUrl(locale, `/gallery/${slug}`);
  const breadcrumbs = [
    { label: t('nav.home'), href: localizedPath(locale, '/') },
    { label: t('nav.gallery'), href: localizedPath(locale, '/gallery') },
    { label: gallery.title },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--color-carbon)] text-[var(--color-cream)]">
      <div className="gold-grid-bg pointer-events-none absolute inset-0 opacity-[0.25]" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,var(--color-carbon)_0%,color-mix(in_srgb,var(--color-graphite)_40%,var(--color-carbon))_45%,var(--color-carbon)_100%)] opacity-90" aria-hidden />

      <div className="section-py relative z-10">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <JsonLd
            data={jsonld.graph([
              ...buildOrganizationSchemaItems(locale, {
                description: typeof gallery.description === 'string' ? gallery.description : undefined,
                contact: contactInfo,
                pagePath: `/gallery/${slug}`,
              }),
              jsonld.imageGallery({
                name: gallery.title,
                description: gallery.description,
                url: galleryUrl,
                images: (images.length > 0 ? images : [{
                  image_url_resolved: gallery.cover_image_url || gallery.cover_image_url_resolved,
                  image_url: gallery.cover_image_url || gallery.cover_image,
                  alt: gallery.cover_image_alt,
                  caption: gallery.description,
                  width: 1200,
                  height: 800,
                  updated_at: gallery.updated_at,
                }]).map((img: any) => {
                  const media = buildMediaSchemaText({
                    locale,
                    kind: images.length > 0 ? 'gallery' : 'gallery-cover',
                    title: gallery.title,
                    alt: img.alt,
                    caption: img.caption,
                    description: gallery.description,
                  });
                  const dimensions = resolveMediaDimensions({
                    width: img.width,
                    height: img.height,
                    fallbackWidth: 1200,
                    fallbackHeight: 800,
                  });

                  return jsonld.imageObject({
                    contentUrl: img.image_url_resolved || img.image_url || gallery.cover_image_url || gallery.cover_image_url_resolved || gallery.cover_image || GALLERY_PLACEHOLDER_SRC,
                    name: media.alt,
                    caption: media.caption || media.alt,
                    width: dimensions.width,
                    height: dimensions.height,
                    dateModified: isMeaningfulMediaDate(img.updated_at) ? img.updated_at : undefined,
                  });
                }),
              }),
              jsonld.breadcrumb(
                breadcrumbs.map((item) => ({
                  name: item.label,
                  url: item.href ? localizedUrl(locale, item.href.replace(`/${locale}`, '') || '/') : galleryUrl,
                })),
              ),
            ])}
          />
          <Breadcrumbs
            items={breadcrumbs}
            className="mb-10"
            olClassName="text-[var(--color-light)] [&_a:hover]:text-[var(--color-gold)] [&_span.font-medium]:text-[var(--color-off-white)]"
          />

          <header className="mb-16 space-y-6">
            <div className="flex items-center gap-3">
               <div className="h-[2px] w-8 rounded-full bg-[var(--color-gold)]" />
               <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[var(--color-gold)]">
                 Project Insight
               </span>
            </div>
            <h1 className="text-balance font-[var(--font-display)] text-4xl font-normal tracking-tight text-[var(--color-off-white)] lg:text-7xl uppercase">
              {gallery.title}
            </h1>
            {gallery.description && (
              <p className="max-w-2xl text-lg font-light leading-relaxed text-[var(--color-silver)] lg:text-xl">
                {gallery.description}
              </p>
            )}
          </header>

        {images.length > 0 ? (
          <div className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3">
            {images
              .sort((a: any, b: any) => a.display_order - b.display_order)
              .map((img: any) => {
                const dimensions = resolveMediaDimensions({
                  width: img.width,
                  height: img.height,
                  fallbackWidth: 800,
                  fallbackHeight: 600,
                });
                const caption = buildMediaCaption({
                  title: gallery.title,
                  caption: img.caption,
                  description: gallery.description,
                });

                return (
                  <div
                    key={img.id}
                    className="mb-4 break-inside-avoid overflow-hidden rounded-xl"
                  >
                    <OptimizedImage
                      src={String(img.image_url_resolved || img.image_url || '')}
                      alt={buildMediaAlt({
                        locale,
                        kind: 'gallery',
                        title: gallery.title,
                        alt: img.alt,
                        caption: img.caption,
                        description: gallery.description,
                      })}
                      width={dimensions.width}
                      height={dimensions.height}
                      className="w-full rounded-xl"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {caption && (
                      <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                        {caption}
                      </p>
                    )}
                  </div>
                );
              })}
          </div>
        ) : (
          <div className="mt-8 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
            <OptimizedImage
              src={
                resolvePublicAssetUrl(
                  gallery.cover_image_url || gallery.cover_image_url_resolved || gallery.cover_image,
                ) ??
                gallery.cover_image_url ??
                gallery.cover_image_url_resolved ??
                gallery.cover_image ??
                GALLERY_PLACEHOLDER_SRC
              }
              alt={buildMediaAlt({
                locale,
                kind: 'gallery-cover',
                title: gallery.title,
                alt: gallery.cover_image_alt,
                description: gallery.description,
              })}
              width={1200}
              height={800}
              className="h-auto w-full"
              sizes="100vw"
            />
          </div>
        )}

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <RelatedLinks
            title={t('common.relatedGallery')}
            hrefBase={localizedPath(locale, '/gallery')}
            items={related.galleries}
          />
          <RelatedLinks
            title={t('common.relatedProducts')}
            hrefBase={localizedPath(locale, '/products')}
            items={related.products}
          />
          <RelatedLinks
            title={t('common.relatedArticles')}
            hrefBase={localizedPath(locale, '/blog')}
            items={related.blogPosts}
          />
        </div>
        </div>
      </div>
    </div>
  );
}
