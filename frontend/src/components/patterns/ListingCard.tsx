import type { ReactNode } from 'react';
import Link from 'next/link';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

type ListingCardProps = {
  href: string;
  title: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
  imageSizes?: string;
  imageAspectClassName?: string;
  footer?: ReactNode;
  specs?: string[];
  category?: string;
  badge?: string;
  /** Micro-label above title (e.g. localized “Engineering-grade”). Omit to hide the row. */
  lineLabel?: string;
  /** 1-based index for decorative numbering (01, 02, …) in showcase layouts. */
  listIndex?: number;
  /** Rotates placeholder gradient when `imageSrc` is missing (0–5). */
  visualVariant?: number;
};

export function ListingCard({
  href,
  title,
  description,
  imageSrc,
  imageAlt = '',
  imageSizes = '(max-width: 768px) 100vw, 33vw',
  listIndex,
  specs,
}: ListingCardProps) {
  const paddedIndex = listIndex != null ? String(listIndex).padStart(2, '0') : null;
  const geometricIcon = listIndex === 1 ? '■' : listIndex === 2 ? '◆' : '◇';

  return (
    <Link
      href={href}
      className="product-card-cc group border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] shadow-[0_18px_60px_rgba(0,0,0,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] dark:bg-[var(--color-surface-muted)] dark:shadow-[0_18px_60px_rgba(0,0,0,0.24)]"
    >
      {/* Visual Area */}
      <div className="product-visual-cc">
        {imageSrc ? (
          <OptimizedImage
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes={imageSizes}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-bg-secondary)] to-[var(--color-surface-muted)]" />
        )}

        {/* Absolute Overlays */}
        <div className="absolute inset-x-0 top-0 z-10 p-6">
          <div className="flex items-center justify-between">
            <span className="font-display text-[0.7rem] uppercase tracking-[3px] text-[var(--color-gold)] opacity-80">
              {paddedIndex ? `${paddedIndex} / PRODUCT` : 'PRODUCT'}
            </span>
          </div>
        </div>

        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <span className="font-display text-[4rem] text-[var(--color-gold)] opacity-10 transition-opacity duration-500 group-hover:opacity-20">
            {geometricIcon}
          </span>
        </div>
      </div>

      {/* Info Area */}
      <div className="p-8 lg:p-10">
        <h3 className="line-clamp-1 font-display text-[1.4rem] font-normal uppercase tracking-[3px] text-[var(--color-text-primary)] transition-colors duration-300 group-hover:text-[var(--color-gold)]">
          {title}
        </h3>

        {description && (
          <p className="mt-4 line-clamp-3 text-sm font-light leading-relaxed text-[var(--color-text-secondary)]">
            {description}
          </p>
        )}

        {specs && specs.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {specs.slice(0, 4).map((spec, i) => (
              <span
                key={i}
                className="border border-[var(--color-gold)]/20 bg-[var(--color-gold)]/5 px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-[var(--color-gold)]"
              >
                {spec}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
