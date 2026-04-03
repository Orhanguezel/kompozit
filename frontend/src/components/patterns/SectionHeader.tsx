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
    <div className={`flex gap-8 ${isCentered ? 'flex-col items-center text-center' : 'flex-row items-end justify-between'}`}>
      <div className={isCentered ? 'max-w-3xl' : ''}>
        {label ? (
          <div className={`flex items-center gap-3 mb-3 ${isCentered ? 'justify-center' : ''}`}>
            <div className="h-[2px] w-8 bg-brand rounded-full" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand/80">{label}</span>
          </div>
        ) : null}
        <h2 className="text-3xl font-bold tracking-tight lg:text-4xl text-balance">{title}</h2>
        {description ? (
          <p className={`mt-4 text-base leading-relaxed text-[var(--color-text-secondary)] opacity-80 ${isCentered ? 'mx-auto' : ''}`}>
            {description}
          </p>
        ) : null}
      </div>
      {action ? (
        <div className="flex-shrink-0">
          {action}
        </div>
      ) : null}
    </div>
  );
}
