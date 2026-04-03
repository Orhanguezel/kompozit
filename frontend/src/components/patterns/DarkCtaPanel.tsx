import type { ReactNode } from 'react';

export function DarkCtaPanel({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action: ReactNode;
}) {
  return (
    <div className="glass-premium carbon-mesh shadow-dark-panel relative mx-auto max-w-4xl overflow-hidden rounded-[2.5rem] p-10 text-center lg:p-16 border-white/10 backdrop-blur-3xl">
      <div className="absolute -left-10 -top-10 size-40 rounded-full bg-brand/20 blur-3xl" />
      <div className="absolute -right-10 -bottom-10 size-40 rounded-full bg-brand/10 blur-3xl" />
      <div className="relative z-10">
        <h2 className="surface-dark-heading text-3xl font-bold tracking-tight lg:text-5xl text-balance">{title}</h2>
        <p className="surface-dark-text mx-auto mt-6 max-w-2xl text-lg leading-relaxed opacity-80">{description}</p>
        <div className="mt-10 flex justify-center">
          {action}
        </div>
      </div>
    </div>
  );
}
