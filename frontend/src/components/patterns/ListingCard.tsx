import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight, Cpu } from 'lucide-react';
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
};

export function ListingCard({
  href,
  title,
  description,
  imageSrc,
  imageAlt = '',
  imageSizes = '(max-width: 768px) 100vw, 33vw',
  imageAspectClassName = 'aspect-[4/3]',
  footer,
  specs,
  category,
  badge,
  lineLabel,
}: ListingCardProps) {
  return (
    <Link
      href={href}
      className="glass-premium glow-hover group block overflow-hidden rounded-[2.5rem] border-white/5 bg-white/[0.02] transition-all duration-500 hover:-translate-y-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-muted)]"
    >
      {imageSrc ? (
        <div className={`relative overflow-hidden bg-[var(--color-border)] ${imageAspectClassName}`}>
          {/* Overlay on Hover */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 backdrop-blur-[2px]" />
          
          <OptimizedImage
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
            sizes={imageSizes}
          />
          
          {/* Category/Badge Top Right */}
          {(category || badge) && (
             <div className="absolute top-4 right-4 z-20">
                <span className="glass-premium rounded-full px-4 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-brand border-brand/30 bg-brand/10 backdrop-blur-md shadow-xl">
                   {badge || category}
                </span>
             </div>
          )}

          {/* Specs overlay: hover on md+; touch devices get strip below image */}
          {specs && specs.length > 0 ? (
            <div className="absolute inset-0 z-20 hidden flex-col justify-end p-6 opacity-0 translate-y-4 transition-all duration-500 md:flex md:group-hover:translate-y-0 md:group-hover:opacity-100">
              <div className="mb-8 flex flex-wrap gap-2">
                {specs.slice(0, 3).map((spec, i) => (
                  <span
                    key={i}
                    className="glass-premium rounded-lg border border-white/10 bg-white/10 px-3 py-1 text-[10px] font-bold text-white backdrop-blur-md"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <div className="absolute bottom-4 right-4 z-30 hidden translate-y-4 opacity-0 transition-all delay-100 duration-500 md:block md:group-hover:translate-y-0 md:group-hover:opacity-100">
            <div className="flex size-12 items-center justify-center rounded-2xl border border-white/20 bg-brand text-white shadow-2xl">
              <ArrowRight className="size-6" />
            </div>
          </div>
        </div>
      ) : null}
      {imageSrc && specs && specs.length > 0 ? (
        <div className="flex flex-wrap gap-2 border-t border-white/10 bg-black/25 px-6 py-3 md:hidden">
          {specs.slice(0, 3).map((spec, i) => (
            <span
              key={i}
              className="rounded-lg border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[var(--color-text-primary)]"
            >
              {spec}
            </span>
          ))}
        </div>
      ) : null}
      <div className="p-8">
        {lineLabel ? (
          <div className="mb-3 flex items-center gap-2">
            <Cpu className="size-3 text-brand opacity-60" aria-hidden />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] opacity-40">{lineLabel}</span>
          </div>
        ) : null}
        <h3 className="text-xl font-bold tracking-tight line-clamp-2 group-hover:text-brand transition-colors duration-300">{title}</h3>
        {description ? (
          <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-secondary)] line-clamp-3 opacity-70 group-hover:opacity-100 transition-opacity">
            {description}
          </p>
        ) : null}
        {footer ? <div className="mt-6">{footer}</div> : null}
      </div>
    </Link>
  );
}
