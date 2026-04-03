import { CheckCircle2 } from 'lucide-react';

export function ContentPageHeader({
  title,
  description,
  intro,
  label,
  features,
}: {
  title: string;
  description?: string;
  intro?: string;
  label?: string;
  features?: string[] | Record<string, string>;
}) {
  const featureList = features 
    ? (Array.isArray(features) ? features : Object.values(features))
    : [];

  return (
    <div className="relative pb-10 border-b border-white/10">
      {label && (
        <div className="flex items-center gap-3 mb-6">
          <div className="h-[2px] w-8 bg-brand rounded-full" />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand/80">{label}</span>
        </div>
      )}
      <h1 className="text-4xl font-bold tracking-tight lg:text-6xl text-balance">{title}</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-center">
        <div>
          {description ? (
            <p className="text-xl font-medium leading-relaxed text-[var(--color-text-primary)] opacity-90">{description}</p>
          ) : null}
          {intro ? (
            <p className="mt-6 text-base leading-relaxed text-[var(--color-text-secondary)] opacity-80">{intro}</p>
          ) : null}
        </div>
        {featureList.length > 0 && (
          <div className="hidden lg:block">
             <div className="glass-premium rounded-2xl p-6 border-brand/20 bg-brand/5">
                <p className="text-xs font-bold uppercase tracking-widest text-brand mb-3">Key Focus</p>
                <ul className="space-y-2">
                   {featureList.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                         <CheckCircle2 className="size-4 text-brand" /> {feature}
                      </li>
                   ))}
                </ul>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
