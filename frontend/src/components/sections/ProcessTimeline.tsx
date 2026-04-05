import 'server-only';

import { getTranslations } from 'next-intl/server';
import { Reveal } from '@/components/motion/Reveal';

const STEP_KEYS = ['design', 'mold', 'production', 'quality', 'delivery'] as const;

export async function ProcessTimeline({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'home.process' });

  return (
    <section className="section-py bg-(--graphite)" id="process">
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

        <div className="relative mt-20">
          {/* Central line */}
          <div className="absolute left-[2rem] top-0 h-full w-px bg-gradient-to-b from-[var(--gold)] to-transparent lg:left-1/2" />

          {/* Steps */}
          <div className="space-y-24 lg:space-y-32">
            {STEP_KEYS.map((key, index) => {
              const num = String(index + 1).padStart(2, '0');
              const isEven = (index + 1) % 2 === 0;

              return (
                <Reveal key={key} delay={index * 100}>
                <div className="process-step-cc">
                  {/* Desktop Odd: Content | Number */}
                  {!isEven ? (
                    <>
                      <div className="order-2 pl-12 text-left lg:order-1 lg:pl-0 lg:pr-24 lg:text-right">
                        <Reveal>
                          <h3 className="font-display text-[1.5rem] font-normal uppercase tracking-[3px] text-[var(--white)]">
                            {t(`steps.${key}.title`)}
                          </h3>
                          <p className="mt-4 text-base font-light leading-relaxed text-[var(--silver)] lg:ml-auto lg:max-w-md">
                            {t(`steps.${key}.body`)}
                          </p>
                        </Reveal>
                      </div>
                      <div className="order-1 flex w-[4rem] items-start justify-center lg:order-2 lg:w-auto">
                         <div className="sticky-num-cc">{num}</div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Desktop Even: Number | Content */}
                      <div className="order-1 flex w-[4rem] items-start justify-center lg:w-auto">
                         <div className="sticky-num-cc">{num}</div>
                      </div>
                      <div className="order-2 pl-12 text-left lg:pl-24">
                        <Reveal>
                          <h3 className="font-display text-[1.5rem] font-normal uppercase tracking-[3px] text-[var(--white)]">
                            {t(`steps.${key}.title`)}
                          </h3>
                          <p className="mt-4 text-base font-light leading-relaxed text-[var(--silver)] lg:mr-auto lg:max-w-md">
                            {t(`steps.${key}.body`)}
                          </p>
                        </Reveal>
                      </div>
                    </>
                  )}
                </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
