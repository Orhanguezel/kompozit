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
    <section className="section-py bg-[var(--color-bg)] text-[var(--color-text-primary)]" id="gallery">
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
              <div className="absolute inset-0 z-10 flex items-center bg-black/38 p-6 transition-colors duration-500 group-hover:bg-black/48 sm:p-8 lg:p-10">
                <div className="max-w-[92%] border-l-2 border-[var(--color-gold)] bg-[#050505]/92 px-5 py-4 shadow-[0_22px_70px_rgba(0,0,0,0.62)] ring-1 ring-white/10 backdrop-blur-md sm:px-6 sm:py-5">
                 <span className="font-display text-[0.68rem] uppercase tracking-[3px] text-[var(--color-gold)] drop-shadow-[0_1px_8px_rgba(0,0,0,0.9)]">
                   {galleryItemCategory(row)}
                 </span>
                 <h3 className="mt-2 font-display text-[1.25rem] font-normal uppercase leading-tight tracking-[2.5px] text-[#fffaf0] drop-shadow-[0_2px_14px_rgba(0,0,0,1)] sm:text-[1.45rem]">
                   {title}
                 </h3>
                </div>
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
