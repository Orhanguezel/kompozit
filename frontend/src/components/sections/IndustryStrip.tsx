import 'server-only';

import { getTranslations } from 'next-intl/server';
import { Reveal } from '@/components/motion/Reveal';
import type { HomeIndustriesContent } from '@/features/site-settings/home';

export async function IndustryStrip({ locale, fromApi }: { locale: string; fromApi?: HomeIndustriesContent | null }) {
  const t = await getTranslations({ locale, namespace: 'home.industries' });

  const sectionLabel = fromApi?.sectionLabel || t('sectionLabel');
  const title = fromApi?.title || t('title');
  const subtitle = fromApi?.subtitle || t('subtitle');

  const industries = fromApi?.items?.length
    ? fromApi.items
    : [
        { id: 'defense', title: t('items.defense.title'), description: t('items.defense.description') },
        { id: 'energy', title: t('items.energy.title'), description: t('items.energy.description') },
        { id: 'transport', title: t('items.transport.title'), description: t('items.transport.description') },
        { id: 'construction', title: t('items.construction.title'), description: t('items.construction.description') },
        { id: 'marine', title: t('items.marine.title'), description: t('items.marine.description') },
      ];

  return (
    <section className="section-py relative overflow-hidden bg-[var(--carbon)]">
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full bg-[radial-gradient(circle_at_center,var(--gold)_0%,transparent_70%)]" />
      </div>

      <div className="relative mx-auto max-w-[1300px] px-6 lg:px-12">
        <Reveal>
          <div className="flex flex-col items-center justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <span className="section-label-cc">{sectionLabel}</span>
              <h2 className="section-title-cc text-left">{title}</h2>
              <p className="mt-4 text-lg font-light text-[var(--silver)]">
                {subtitle}
              </p>
            </div>
          </div>
        </Reveal>

        <div className="mt-20 grid grid-cols-1 gap-0.5 bg-[var(--gold)]/10 sm:grid-cols-2 lg:grid-cols-5">
          {industries.map((ind) => (
            <Reveal key={ind.id} className="bg-[var(--graphite)] p-8 transition-colors hover:bg-[var(--carbon)]">
              <div className="mb-6 h-px w-12 bg-[var(--gold)]" />
              <h3 className="font-display text-xl font-normal uppercase tracking-[2px] text-[var(--white)]">
                {ind.title}
              </h3>
              <p className="mt-4 text-sm font-light leading-relaxed text-[var(--silver)] opacity-70">
                {ind.description}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
