import 'server-only';

import { getTranslations } from 'next-intl/server';
import { Reveal } from '@/components/motion/Reveal';

export async function MaterialCards({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'home.materials' });

  const cards = [
    { key: 'carbon' as const, abbr: 'CF' as const, specKeys: ['tensile', 'density', 'modulus', 'thermal'] as const },
    { key: 'frp' as const, abbr: 'GF' as const, specKeys: ['tensile', 'density', 'modulus', 'thermal'] as const },
  ];

  return (
    <section className="section-py bg-(--graphite)" data-testid="material-cards">
      <div className="mx-auto max-w-[1300px] px-6 lg:px-12">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="section-label-cc">{t('sectionLabel')}</span>
            <h2 className="section-title-cc">{t('title')}</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg font-light leading-relaxed text-[var(--silver)]">
              {t('subtitle')}
            </p>
          </div>
        </Reveal>

        <div className="industrial-grid-cc mt-20 lg:grid-cols-2">
          {cards.map(({ key, abbr, specKeys }) => (
            <Reveal key={key} className="grid-item-cc group relative p-8 lg:p-16">
              <div className="mb-10 flex size-16 items-center justify-center border border-[var(--gold)] font-display text-[1.5rem] font-normal tracking-[4px] text-[var(--gold)] transition-colors group-hover:bg-[var(--gold)] group-hover:text-[var(--carbon)]">
                {abbr}
              </div>
              <h3 className="font-display text-[2rem] font-normal uppercase tracking-[4px] text-[var(--white)]">
                {t(`${key}.name`)}
              </h3>
              <p className="mt-6 text-base font-light leading-relaxed text-[var(--silver)] opacity-80">
                {t(`${key}.description`)}
              </p>
              
              <div className="mt-12 grid grid-cols-2 gap-0.5 bg-[var(--gold)]/10">
                {specKeys.map((sk) => (
                  <div key={sk} className="bg-[var(--carbon)] p-6 transition-colors hover:bg-[var(--graphite)]">
                    <dt className="text-[0.65rem] font-bold uppercase tracking-[3px] text-[var(--silver)] opacity-60">
                      {t(`${key}.specs.${sk}.label`)}
                    </dt>
                    <dd className="mt-2 font-display text-[1.8rem] font-normal text-[var(--gold)]">
                      {t(`${key}.specs.${sk}.value`)}
                    </dd>
                  </div>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
