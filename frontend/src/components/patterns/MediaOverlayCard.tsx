import type { ReactNode } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

type MediaOverlayCardProps = {
  href: string;
  src: string;
  alt: string;
  title: string;
  description?: string;
  meta?: ReactNode;
  sizes: string;
  aspectClassName?: string;
};

export function MediaOverlayCard({
  href,
  src,
  alt,
  title,
  description,
  meta,
  sizes,
  aspectClassName = 'aspect-[3/2]',
}: MediaOverlayCardProps) {
  return (
    <Link
      href={href}
      className={`group relative block overflow-hidden rounded-[2rem] bg-[var(--color-bg-dark)] shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-muted)] ${aspectClassName}`}
    >
      <OptimizedImage
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
        sizes={sizes}
      />

      {/* Texture and Overlay */}
      <div className="absolute inset-0 carbon-texture opacity-10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-60 transition-all duration-700 group-hover:opacity-90 group-hover:via-black/70" />

      <div className="absolute inset-0 flex flex-col justify-end p-8">
        <div className="translate-y-6 transition-all duration-500 ease-out group-hover:translate-y-0">
          {meta ? (
            <div className="mb-4 inline-flex items-center rounded-full border border-[var(--color-gold)]/30 bg-[var(--color-gold)]/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--color-gold)] backdrop-blur-md">
              {meta}
            </div>
          ) : null}
          <h3 className="font-[var(--font-display)] text-[2rem] font-normal uppercase leading-none tracking-[0.08em] text-white">
            {title}
          </h3>
          <div className="mt-4 grid grid-rows-[0fr] opacity-0 transition-all duration-500 group-hover:grid-rows-[1fr] group-hover:opacity-80">
             <div className="overflow-hidden">
                {description ? (
                  <p className="pb-2 text-sm italic leading-relaxed text-white/70 line-clamp-2">
                    {description}
                  </p>
                ) : null}
             </div>
          </div>
        </div>
      </div>

      <div className="absolute right-6 top-6 size-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white scale-0 transition-all duration-500 group-hover:scale-100 group-hover:rotate-90">
        <Plus className="size-6" />
      </div>
    </Link>
  );
}
