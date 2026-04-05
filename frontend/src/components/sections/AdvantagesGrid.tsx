import 'server-only';
import { getTranslations } from 'next-intl/server';
import { Reveal } from '@/components/motion/Reveal';

const ADVANTAGE_KEYS = ['performance', 'durability', 'design', 'thermal', 'longevity', 'sustainability'] as const;

export async function AdvantagesGrid({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'home.advantages' });

  return (
    <section className="section-py bg-[var(--graphite)]" id="advantages">
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

        <div className="industrial-grid-cc mt-20 sm:grid-cols-2 lg:grid-cols-3">
          {ADVANTAGE_KEYS.map((key, index) => (
            <Reveal key={key} delay={index * 100} className="grid-item-cc group relative p-10 lg:p-12">
              <div className="absolute top-0 right-0 p-8 font-display text-[2rem] leading-none text-[var(--gold)] opacity-10 transition-opacity group-hover:opacity-30">
                {String(index + 1).padStart(2, '0')}
              </div>
              <h3 className="font-display text-[1.4rem] font-normal uppercase tracking-[3px] text-[var(--white)] transition-colors group-hover:text-[var(--gold)]">
                {t(`items.${key}.title`)}
              </h3>
              <p className="mt-6 text-sm font-light leading-relaxed text-[var(--silver)] opacity-80">
                {t(`items.${key}.description`)}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
