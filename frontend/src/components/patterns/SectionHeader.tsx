import type { ReactNode } from 'react';

type SectionHeaderProps = {
  title: string;
  description?: string;
  label?: string;
  align?: 'left' | 'center';
  action?: ReactNode;
};

export function SectionHeader({
  title,
  description,
  label,
  align = 'left',
  action,
}: SectionHeaderProps) {
  const isCentered = align === 'center';

  return (
    <div className={`flex gap-10 ${isCentered ? 'flex-col items-center text-center' : 'flex-col lg:flex-row lg:items-end lg:justify-between'}`}>
      <div className={isCentered ? 'max-w-3xl' : 'max-w-4xl'}>
        {label ? (
          <div className={`flex items-center gap-4 mb-6 ${isCentered ? 'justify-center' : ''}`}>
             <div className="h-px w-10 bg-[var(--color-gold)] opacity-60" />
             <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--color-gold-bright)]">{label}</span>
          </div>
        ) : null}
        <h2 className="text-4xl font-normal tracking-tight lg:text-5xl font-[var(--font-display)] leading-[1.1] text-balance text-[var(--color-text-primary)]">
          {title}
        </h2>
        {description ? (
          <p className={`mt-6 text-lg leading-relaxed text-[var(--color-text-secondary)] opacity-80 ${isCentered ? 'mx-auto' : ''}`}>
            {description}
          </p>
        ) : null}
      </div>
      {action ? (
        <div className="flex-shrink-0 lg:pb-2">
          {action}
        </div>
      ) : null}
    </div>
  );
}
