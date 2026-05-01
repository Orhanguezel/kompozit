'use client';

import Image from 'next/image';
import { Reveal } from '@/components/motion/Reveal';

interface Reference {
  id?: string;
  title: string;
  featured_image?: string | null;
  featured_image_alt?: string | null;
  website_url?: string | null;
}

interface ReferenceLogosProps {
  references: Reference[];
  label?: string;
}

export function ReferenceLogos({ references, label = 'TRUSTED BY' }: ReferenceLogosProps) {
  if (!references || references.length === 0) return null;

  return (
    <div className="w-full">
      <Reveal>
         <div className="flex items-center gap-6 mb-10 overflow-hidden">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-text-secondary)] opacity-40 whitespace-nowrap">
               {label}
            </span>
            <div className="h-px w-full bg-border/20" />
         </div>
      </Reveal>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6 lg:gap-8">
        {references.map((ref, i) => (
          <Reveal key={ref.id || ref.title} delay={i * 50}>
             <div className="glass-premium flex aspect-[3/2] items-center justify-center rounded-2xl border-white/5 bg-white/[0.01] p-6 grayscale transition-all hover:grayscale-0 hover:bg-white/[0.04] group">
                {ref.featured_image ? (
                  <Image
                    src={ref.featured_image}
                    alt={ref.featured_image_alt || ref.title}
                    width={120}
                    height={60}
                    className="max-h-full w-auto object-contain transition-transform group-hover:scale-110"
                  />
                ) : (
                  <span className="text-sm font-bold opacity-20 uppercase tracking-tighter">{ref.title}</span>
                )}
             </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
