import 'server-only';

import { getTranslations } from 'next-intl/server';
import { Reveal } from '@/components/motion/Reveal';
import type { HomeMaterialsContent } from '@/features/site-settings/home';

export async function MaterialCards({ locale, fromApi }: { locale: string; fromApi?: HomeMaterialsContent | null }) {
  const t = await getTranslations({ locale, namespace: 'home.materials' });

  const sectionLabel = fromApi?.sectionLabel || t('sectionLabel');
  const title = fromApi?.title || t('title');
  const subtitle = fromApi?.subtitle || t('subtitle');

  const cards = fromApi?.items?.length
    ? fromApi.items.map((item) => ({
        key: item.id,
        name: item.name,
        description: item.description,
        abbr: item.id === 'carbon' ? 'CF' : 'GF',
        specs: Object.entries(item.specs).map(([k, v]) => ({ key: k, label: v.label, value: v.value })),
      }))
    : [
        {
          key: 'carbon',
          abbr: 'CF',
          name: t('carbon.name'),
          description: t('carbon.description'),
          specs: ['tensile', 'density', 'modulus', 'thermal'].map((sk) => ({
            key: sk,
            label: t(`carbon.specs.${sk}.label`),
            value: t(`carbon.specs.${sk}.value`),
          })),
        },
        {
          key: 'frp',
          abbr: 'GF',
          name: t('frp.name'),
          description: t('frp.description'),
          specs: ['tensile', 'density', 'modulus', 'thermal'].map((sk) => ({
            key: sk,
            label: t(`frp.specs.${sk}.label`),
            value: t(`frp.specs.${sk}.value`),
          })),
        },
      ];

  return (
    <section className="section-py bg-(--graphite)" data-testid="material-cards">
      <div className="mx-auto max-w-[1300px] px-6 lg:px-12">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="section-label-cc">{sectionLabel}</span>
            <h2 className="section-title-cc">{title}</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg font-light leading-relaxed text-[var(--silver)]">
              {subtitle}
            </p>
          </div>
        </Reveal>

        <div className="industrial-grid-cc mt-20 lg:grid-cols-2">
          {cards.map(({ key, abbr, name, description, specs }) => (
            <Reveal key={key} className="grid-item-cc group relative p-8 lg:p-16">
              <div className="mb-10 flex size-16 items-center justify-center border border-[var(--gold)] font-display text-[1.5rem] font-normal tracking-[4px] text-[var(--gold)] transition-colors group-hover:bg-[var(--gold)] group-hover:text-[var(--carbon)]">
                {abbr}
              </div>
              <h3 className="font-display text-[2rem] font-normal uppercase tracking-[4px] text-[var(--white)]">
                {name}
              </h3>
              <p className="mt-6 text-base font-light leading-relaxed text-[var(--silver)] opacity-80">
                {description}
              </p>

              <dl className="mt-12 grid grid-cols-2 gap-0.5 bg-[var(--gold)]/10">
                {specs.map((s) => (
                  <div key={s.key} className="bg-[var(--carbon)] p-6 transition-colors hover:bg-[var(--graphite)]">
                    <dt className="text-[0.65rem] font-bold uppercase tracking-[3px] text-[var(--silver)] opacity-60">
                      {s.label}
                    </dt>
                    <dd className="mt-2 font-display text-[1.8rem] font-normal text-[var(--gold)]">
                      {s.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
