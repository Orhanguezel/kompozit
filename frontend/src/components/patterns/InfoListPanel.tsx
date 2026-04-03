import { Check } from "lucide-react";

type InfoListPanelProps = {
  title: string;
  items: string[];
  accentText?: string;
};

export function InfoListPanel({
  title,
  items,
  accentText,
}: InfoListPanelProps) {
  return (
    <section className="glass-premium glow-hover h-full flex flex-col rounded-[2rem] p-8 border-white/5 bg-white/[0.02]">
      <h2 className="text-xl font-bold tracking-tight mb-6">{title}</h2>
      <ul className="flex-1 space-y-4">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <div className="mt-1 flex-shrink-0 size-5 rounded-full bg-brand/10 flex items-center justify-center border border-brand/20">
               <Check className="size-3 text-brand" />
            </div>
            <span className="text-sm leading-relaxed text-[var(--color-text-secondary)] opacity-80">{item}</span>
          </li>
        ))}
      </ul>
      {accentText ? (
        <div className="mt-8 pt-6 border-t border-white/5">
          <p className="text-xs font-bold uppercase tracking-wider text-brand">{accentText}</p>
        </div>
      ) : null}
    </section>
  );
}
