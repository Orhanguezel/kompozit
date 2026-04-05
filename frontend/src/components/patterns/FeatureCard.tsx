import type { ReactNode } from 'react';

interface FeatureCardProps {
  icon?: ReactNode;
  title: string;
  description: string;
  index?: number;
}

export function FeatureCard({ title, description, index }: FeatureCardProps) {
  const paddedIndex = index != null ? String(index + 1).padStart(2, '0') : null;

  return (
    <article className="advantage-home-card group h-full">
      {paddedIndex && (
         <div className="mb-6 font-[var(--font-display)] text-[4rem] leading-none text-[var(--color-gold)] opacity-5 transition-opacity group-hover:opacity-10 select-none">
           {paddedIndex}
         </div>
      )}
      <h3 className="font-[var(--font-display)] text-[1.5rem] font-normal uppercase tracking-[3px] text-[var(--color-cream)] transition-colors group-hover:text-[var(--color-gold)]">
        {title}
      </h3>
      <p className="mt-4 text-[0.95rem] font-light leading-relaxed text-[var(--color-silver)] opacity-80">
        {description}
      </p>
    </article>
  );
}
