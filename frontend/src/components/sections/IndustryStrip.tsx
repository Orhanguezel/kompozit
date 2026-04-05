import 'server-only';

import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Shield, Zap, Leaf, Warehouse, Wrench } from 'lucide-react';

import { localizedPath } from '@/seo';
import { Reveal } from '@/components/motion/Reveal';

const INDUSTRY_KEYS = ['defense', 'energy', 'landscaping', 'storage', 'custom'] as const;

const icons = {
  defense: Shield,
  energy: Zap,
  landscaping: Leaf,
  storage: Warehouse,
  custom: Wrench,
} as const;

export async function IndustryStrip({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'home.industries' });
  const solutionsHref = localizedPath(locale, '/solutions');

  return (
    <section className="section-py bg-[var(--graphite)]">
      <div className="mx-auto max-w-[1300px] px-6 lg:px-12 text-center">
        <Reveal>
          <span className="section-label-cc">{t('sectionLabel')}</span>
          <h2 className="section-title-cc">{t('title')}</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg font-light leading-relaxed text-[var(--silver)]">
            {t('subtitle')}
          </p>
        </Reveal>

        <ul className="industrial-grid-cc mt-20 sm:grid-cols-2 lg:grid-cols-5">
          {INDUSTRY_KEYS.map((key, index) => {
            const Icon = icons[key];
            return (
              <Reveal key={key} delay={index * 100} className="grid-item-cc">
                <Link
                  href={solutionsHref}
                  className="group relative flex h-full flex-col p-10 text-center transition-all duration-500 hover:bg-[var(--carbon)]"
                >
                  <Icon className="mx-auto mb-8 size-10 text-[var(--gold)] opacity-80 transition-transform duration-500 group-hover:scale-110" />
                  <h3 className="font-display text-[1.2rem] font-normal uppercase tracking-[3px] text-[var(--white)]">
                    {t(`items.${key}.title`)}
                  </h3>
                  <p className="mt-4 text-xs font-light leading-relaxed text-[var(--silver)] opacity-80">
                    {t(`items.${key}.description`)}
                  </p>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
