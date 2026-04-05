import type { ReactNode } from 'react';

export function DarkCtaPanel({
  title,
  description,
  action,
  secondaryAction,
}: {
  title: string;
  description: string;
  action: ReactNode;
  secondaryAction?: ReactNode;
}) {
  return (
    <div className="relative z-[1] mx-auto max-w-4xl px-4 text-center">
      <h2 className="surface-dark-heading text-balance font-[var(--font-display)] text-[clamp(2.5rem,6vw,4.5rem)] font-normal uppercase tracking-[2px] leading-[1.05]">
        {title}
      </h2>
      <p className="surface-dark-text mx-auto mb-12 mt-8 max-w-[600px] text-base font-light leading-relaxed text-[var(--color-silver)] lg:text-lg">
        {description}
      </p>
      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap">
        {action}
        {secondaryAction}
      </div>
    </div>
  );
}
