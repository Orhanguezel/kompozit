'use client';

import { useState } from 'react';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

interface ProductGalleryProps {
  images: string[];
  alt: string;
}

/**
 * Ürün detay sayfası çoklu görsel galerisi.
 * Ana görsel + küçük görsel şeridi; küçük görsele tıklayınca ana görsel değişir.
 */
export function ProductGallery({ images, alt }: ProductGalleryProps) {
  const safeImages = images.filter(
    (src) => typeof src === 'string' && src.trim().length > 0,
  );
  const [activeIndex, setActiveIndex] = useState(0);

  if (safeImages.length === 0) return null;

  const current: string =
    safeImages[Math.min(activeIndex, safeImages.length - 1)] ?? safeImages[0]!;

  return (
    <div className="space-y-4">
      {/* Ana görsel */}
      <div className="group relative aspect-square cursor-zoom-in overflow-hidden rounded-sm border border-[color-mix(in_srgb,var(--color-gold)_15%,transparent)] bg-(--color-bg-secondary) shadow-2xl shadow-black/10 dark:shadow-black/40">
        <OptimizedImage
          key={current}
          src={current}
          alt={alt}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>

      {/* Küçük görseller — yalnızca birden fazla görsel varsa */}
      {safeImages.length > 1 && (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {safeImages.map((src, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={`${src}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`${alt} - görsel ${index + 1}`}
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
