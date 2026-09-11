'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

interface ProductGalleryProps {
  images: string[];
  alt: string;
}

/**
 * Ürün detay sayfası çoklu görsel galerisi.
 * Oklar, ana görsele tıklama ve küçük görsel şeridiyle döngüsel gezinme.
 */
export function ProductGallery({ images, alt }: ProductGalleryProps) {
  const isTurkish = useLocale().startsWith('tr');
  const safeImages = images.filter(
    (src) => typeof src === 'string' && src.trim().length > 0,
  );
  const [activeIndex, setActiveIndex] = useState(0);

  if (safeImages.length === 0) return null;

  const selectedIndex = Math.min(activeIndex, safeImages.length - 1);
  const current = safeImages[selectedIndex]!;
  const hasMultipleImages = safeImages.length > 1;
  const previousLabel = isTurkish ? 'Önceki görsel' : 'Previous image';
  const nextLabel = isTurkish ? 'Sonraki görsel' : 'Next image';
  const navigate = (step: number) => setActiveIndex((index) =>
    (Math.min(index, safeImages.length - 1) + step + safeImages.length) % safeImages.length,
  );
  const arrowClass = 'absolute top-1/2 z-20 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-(--color-border) bg-(--color-bg) text-(--color-text-primary) shadow-lg transition-colors hover:bg-(--color-brand) hover:text-(--color-bg-dark) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-gold) focus-visible:ring-offset-2';

  return (
    <div
      className="space-y-4"
      role="group"
      aria-label={isTurkish ? 'Ürün görselleri' : 'Product images'}
      onKeyDown={(event) => {
        if (!hasMultipleImages || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
        event.preventDefault();
        navigate(event.key === 'ArrowLeft' ? -1 : 1);
      }}
    >
      {/* Ana görsel */}
      <div className="relative aspect-square overflow-hidden rounded-sm border border-[color-mix(in_srgb,var(--color-gold)_15%,transparent)] bg-(--color-bg-secondary) shadow-2xl shadow-black/10 dark:shadow-black/40">
        <OptimizedImage
          key={current}
          src={current}
          alt={alt}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        {hasMultipleImages && (
          <>
            <button
              type="button"
              aria-label={nextLabel}
              onClick={() => navigate(1)}
              className="absolute inset-0 z-10 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--color-gold)"
            />
            <button type="button" aria-label={previousLabel} onClick={() => navigate(-1)} className={`${arrowClass} left-3`}>
              <ChevronLeft className="size-6" aria-hidden="true" />
            </button>
            <button type="button" aria-label={nextLabel} onClick={() => navigate(1)} className={`${arrowClass} right-3`}>
              <ChevronRight className="size-6" aria-hidden="true" />
            </button>
            <span className="pointer-events-none absolute bottom-3 right-3 z-20 rounded-full bg-(--color-bg) px-3 py-1.5 text-xs font-semibold tabular-nums text-(--color-text-primary)" aria-live="polite" aria-atomic="true">
              <span className="sr-only">{isTurkish ? 'Görsel' : 'Image'} </span>
              {selectedIndex + 1} / {safeImages.length}
            </span>
          </>
        )}
      </div>

      {/* Küçük görseller — yalnızca birden fazla görsel varsa */}
      {hasMultipleImages && (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {safeImages.map((src, index) => {
            const isActive = index === selectedIndex;
            return (
              <button
                key={`${src}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`${alt} - ${isTurkish ? 'görsel' : 'image'} ${index + 1}`}
                aria-current={isActive}
                className={`relative aspect-square overflow-hidden rounded-sm border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-gold) ${
                  isActive
                    ? 'border-(--color-gold) ring-1 ring-(--color-gold)'
                    : 'border-[color-mix(in_srgb,var(--color-gold)_12%,transparent)] opacity-70 hover:opacity-100 hover:border-[color-mix(in_srgb,var(--color-gold)_40%,transparent)]'
                }`}
              >
                <OptimizedImage
                  src={src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 25vw, 140px"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
