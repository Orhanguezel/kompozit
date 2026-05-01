import 'server-only';

import { getTranslations } from 'next-intl/server';

import type { HomeStatsBarContent } from '@/features/site-settings/home';

export async function StatsBar({
  locale,
  fromApi,
}: {
  locale: string;
  fromApi?: HomeStatsBarContent | null;
}) {
  const t = await getTranslations({ locale, namespace: 'home.stats' });

  const stats =
    fromApi?.items?.length === 4
      ? fromApi.items.map((item) => ({ number: item.value, label: item.label }))
      : [
          { number: t('yoeNumber'), label: t('yoeLabel') },
          { number: t('projectsNumber'), label: t('projectsLabel') },
          { number: t('standardNumber'), label: t('standardLabel') },
          { number: t('certNumber'), label: t('certLabel') },
        ];

  return (
    <section
      className="stats-bar-cc"
      aria-label={t('ariaLabel')}
      data-testid="stats-bar"
    >
      <div className="mx-auto grid max-w-[1300px] grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={`${item.number}-${item.label}`}
            className="stats-item-cc max-lg:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(4n)]:border-r-0"
          >
            <p className="font-[var(--font-display)] font-normal text-[3.5rem] leading-none text-[var(--gold)]">
              {item.number}
            </p>
            <p className="mt-3 text-[0.75rem] font-medium uppercase tracking-[4px] text-[var(--silver)]">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
