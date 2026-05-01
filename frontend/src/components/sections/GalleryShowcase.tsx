import 'server-only';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Reveal } from '@/components/motion/Reveal';
import { resolvePublicAssetUrl } from '@/lib/utils';

function galleryItemImageSrc(item: Record<string, unknown>): string {
  const raw =
    (typeof item.cover_image_url === 'string' && item.cover_image_url) ||
    (typeof item.cover_image_url_resolved === 'string' && item.cover_image_url_resolved) ||
    (typeof item.cover_image === 'string' && item.cover_image) ||
    (typeof item.image_url === 'string' && item.image_url) ||
    (typeof item.imageSrc === 'string' && item.imageSrc) ||
    '';
  const resolved = resolvePublicAssetUrl(raw);
  return (resolved ?? raw) || '/media/gallery-placeholder.svg';
}

function galleryItemCategory(item: Record<string, unknown>): string {
  if (typeof item.category === 'string' && item.category.trim()) return item.category;
  if (typeof item.module_key === 'string' && item.module_key.trim()) return item.module_key;
  return 'Portfolio';
}

export async function GalleryShowcase({ locale, items = [] }: { locale: string; items?: any[] }) {
  const t = await getTranslations({ locale, namespace: 'home.gallery' });

  // Use provided items or fallback if empty
  const galleryItems = items.length > 0 ? items.slice(0, 6) : [];

  return (
    <section className="section-py bg-[var(--carbon)]" id="gallery">
      <div className="mx-auto max-w-[1300px] px-6 lg:px-12 text-center mb-16">
        <Reveal>
          <span className="section-label-cc">{t('sectionLabel')}</span>
          <h2 className="section-title-cc">{t('title')}</h2>
        </Reveal>
      </div>

      <div className="industrial-grid-cc lg:grid-cols-4 lg:grid-rows-2">
        {galleryItems.map((item, index) => {
          const row = item as Record<string, unknown>;
          const isLarge = index === 0 || index === 3;
          const title = typeof row.title === 'string' ? row.title : '';
          return (
            <Reveal
              key={(row.id as string | number) || index}
              delay={index * 100}
              className={`grid-item-cc group relative overflow-hidden ${isLarge ? 'lg:row-span-2 h-[400px] lg:h-[800px]' : 'h-[400px]'}`}
            >
              <Image
                src={galleryItemImageSrc(row)}
                alt={title}
                fill
                unoptimized
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />

              {/* Overlay Caption */}
              <div className="absolute inset-0 z-10 flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent to-transparent p-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                 <span className="font-display text-[0.7rem] uppercase tracking-[3px] text-[var(--gold)]">
                   {galleryItemCategory(row)}
                 </span>
                 <h4 className="mt-2 font-display text-[1.4rem] font-normal uppercase tracking-[3px] text-[var(--white)]">
                   {title}
                 </h4>
              </div>

              {/* Decorative Weave Pattern */}
              <div className="absolute inset-0 z-0 bg-[url('/media/weave-pattern.svg')] opacity-0 transition-opacity duration-500 group-hover:opacity-10" />
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
