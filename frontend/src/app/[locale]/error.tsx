'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

import { FALLBACK_LOCALE } from '@/i18n/locales';

export default function LocaleSegmentError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const locale = useLocale();
  const t = useTranslations('errors');

  useEffect(() => {
    console.error(error);
  }, [error]);

  const homeHref = locale === FALLBACK_LOCALE ? '/' : `/${locale}`;

  return (
    <div className="section-py mx-auto max-w-lg px-4 text-center">
      <h1 className="font-display text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
        {t('title')}
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-secondary)]">{t('description')}</p>
      {error.digest ? (
        <p className="mt-2 font-mono text-xs text-[var(--color-text-muted)]">ID: {error.digest}</p>
      ) : null}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => reset()}
          className="btn-primary rounded-xl px-6 py-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
        >
          {t('retry')}
        </button>
        <Link
          href={homeHref}
          className="btn-secondary rounded-xl px-6 py-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
        >
          {t('home')}
        </Link>
      </div>
    </div>
  );
}
