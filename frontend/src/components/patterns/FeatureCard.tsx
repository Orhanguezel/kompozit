import type { ReactNode } from 'react';

export function FeatureCard({
  icon,
  title,
  description,
  index,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  index?: number;
}) {
  return (
    <div className="glass-premium glow-hover group relative overflow-hidden rounded-[2rem] p-8 transition-all hover:-translate-y-1">
      {index !== undefined && (
        <span className="absolute -right-4 -top-6 text-[8rem] font-bold opacity-[0.03] select-none pointer-events-none group-hover:opacity-[0.06] transition-opacity">
          {String(index + 1).padStart(2, '0')}
        </span>
      )}
      <div className="flex size-16 items-center justify-center rounded-2xl bg-brand/10 text-brand border border-brand/20 group-hover:bg-brand group-hover:text-white transition-all duration-500">
        {icon}
      </div>
      <h3 className="mt-6 text-xl font-bold tracking-tight">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)] opacity-80">{description}</p>
    </div>
  );
}
