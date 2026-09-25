import Link from 'next/link';
import Image from 'next/image';
import { localizedPath } from '@/seo/helpers';
import { resolvePublicAssetUrl } from '@/lib/utils';
import { measuredMedia } from '@/lib/measured-media';
import type { ProductCatalog } from '@/features/gallery/product-catalog';

/**
 * Urun katalogu galerisi: kategori bolumleri, gorseller kirpilmadan kendi oraninda.
 * Olculmus boyut varsa gercek oran kullanilir (CLS yok); yoksa 4:3 kutuda `contain`.
 * Her fotograf kendi urun sayfasina baglanir.
 */
export function ProductCatalogGallery({ locale, catalog }: { locale: string; catalog: ProductCatalog }) {
  const en = locale.startsWith('en');
  const photoLabel = (n: number) => (en ? `${n} photo${n === 1 ? '' : 's'}` : `${n} fotoğraf`);
  const sections = catalog.groups.map((group, index) => ({ ...group, anchor: `kategori-${group.slug || index + 1}` }));

  return (
    <div className="space-y-16">
      <nav aria-label={en ? 'Product groups' : 'Ürün grupları'} className="flex flex-wrap gap-2">
        {sections.map((group) => (
          <a
            key={group.anchor}
            href={`#${group.anchor}`}
            className="inline-flex items-center gap-2 border border-[var(--color-border)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[2px] text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]"
          >
            {group.name}
            <span className="text-[var(--color-brand)]">{group.photos.length}</span>
          </a>
        ))}
      </nav>

      {sections.map((group) => (
        <section key={group.anchor} id={group.anchor} aria-labelledby={`${group.anchor}-title`} className="scroll-mt-28">
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3 border-b border-[var(--color-border)] pb-4">
            <h2 id={`${group.anchor}-title`} className="font-[var(--font-display)] text-2xl font-normal uppercase tracking-tight lg:text-3xl">
              {group.name}
            </h2>
            <span className="text-xs font-semibold uppercase tracking-[2px] text-[var(--color-text-secondary)]">
              {photoLabel(group.photos.length)}
            </span>
          </div>

          <div className="columns-2 gap-3 sm:gap-4 lg:columns-3 xl:columns-4">
            {group.photos.map((photo) => {
              const src = resolvePublicAssetUrl(photo.src) ?? photo.src;
              const size = measuredMedia(photo.src);
              return (
                <figure key={photo.src} className="mb-3 break-inside-avoid sm:mb-4">
                  <Link
                    href={localizedPath(locale, `/products/${photo.productSlug}`)}
                    className="group block overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] transition-colors hover:border-[var(--color-brand)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand)]"
                  >
                    {size ? (
                      <Image
                        src={src}
                        alt={photo.alt}
                        width={size.width}
                        height={size.height}
                        sizes="(max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        className="h-auto w-full transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <span className="relative block aspect-[4/3] bg-[var(--color-bg)]">
                        <Image
                          src={src}
                          alt={photo.alt}
                          fill
                          sizes="(max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                          className="object-contain"
                        />
                      </span>
                    )}
                    <figcaption className="border-t border-[var(--color-border)] px-2.5 py-2 text-[12px] font-semibold sm:px-3 sm:py-2.5 sm:text-[13px] leading-snug text-[var(--color-text-primary)] group-hover:text-[var(--color-brand)]">
                      {photo.productTitle}
                    </figcaption>
                  </Link>
                </figure>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
