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
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-60 transition-opacity group-hover:opacity-80" />
      
      <div className="absolute inset-0 flex flex-col justify-end p-8">
        <div className="translate-y-4 transition-transform duration-500 group-hover:translate-y-0">
          {meta ? (
            <div className="mb-3 inline-flex items-center rounded-full bg-brand/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand backdrop-blur-md border border-brand/20">
              {meta}
            </div>
          ) : null}
          <h3 className="text-2xl font-bold text-white tracking-tight">{title}</h3>
          <div className="grid grid-rows-[0fr] transition-all duration-500 group-hover:grid-rows-[1fr] group-hover:mt-3">
             <div className="overflow-hidden">
                {description ? (
                  <p className="text-sm leading-relaxed text-white/70 line-clamp-2">
                    {description}
                  </p>
                ) : null}
             </div>
          </div>
        </div>
      </div>

      <div className="absolute right-6 top-6 size-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white scale-0 transition-transform duration-500 group-hover:scale-100">
        <Plus className="size-6" />
      </div>
    </Link>
  );
}
