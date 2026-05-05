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
      className={`group relative block overflow-hidden bg-[var(--color-bg-secondary)] shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] ${aspectClassName}`}
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
      <div className="absolute inset-0 bg-black/38 transition-colors duration-700 group-hover:bg-black/48" />

      <div className="absolute inset-0 flex items-center p-6 sm:p-8">
        <div className="max-w-[92%] border-l-2 border-[var(--color-gold)] bg-[#050505]/92 px-5 py-4 shadow-[0_22px_70px_rgba(0,0,0,0.62)] ring-1 ring-white/10 backdrop-blur-md transition-colors duration-500 group-hover:bg-[#050505]/96">
          {meta ? (
            <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--color-gold)]">
              {meta}
            </div>
          ) : null}
          <h3 className="font-[var(--font-display)] text-[1.6rem] font-normal uppercase leading-tight tracking-[0.08em] text-[#fffaf0] drop-shadow-[0_2px_14px_rgba(0,0,0,1)] sm:text-[2rem]">
            {title}
          </h3>
          <div className="mt-3 grid grid-rows-[0fr] opacity-0 transition-all duration-500 group-hover:grid-rows-[1fr] group-hover:opacity-100">
             <div className="overflow-hidden">
                {description ? (
                  <p className="pb-1 text-sm leading-relaxed text-white/82 line-clamp-2">
                    {description}
                  </p>
                ) : null}
             </div>
          </div>
        </div>
      </div>

      <div className="absolute right-6 top-6 flex size-12 scale-0 items-center justify-center border border-white/20 bg-black/45 text-white backdrop-blur-md transition-all duration-500 group-hover:scale-100 group-hover:rotate-90">
        <Plus className="size-6" />
      </div>
    </Link>
  );
}
