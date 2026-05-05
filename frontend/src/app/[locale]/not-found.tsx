'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { BrandCtaPanel } from '@/components/patterns/BrandCtaPanel';
import { localizedPath } from '@/seo/helpers';

export default function NotFound() {
  const t = useTranslations('error');
  const params = useParams();
  const locale = (params?.locale as string) || 'tr';

  return (
    <main className="section-py min-h-[60vh] flex items-center">
      <div className="mx-auto max-w-2xl px-4 text-center lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">
          404
        </p>
        <div className="mt-6">
          <BrandCtaPanel
            title={t('notFoundTitle')}
            description={t('notFoundDescription')}
            action={(
              <Link
                href={localizedPath(locale, '/')}
                className="btn-contrast mt-5 inline-flex rounded-lg px-6 py-3.5 font-bold uppercase tracking-widest text-[13px] shadow-lg transition-all hover:scale-105 active:scale-95"
              >
                {t('backToHome')}
              </Link>
            )}
          />
        </div>
      </div>
    </main>
  );
}
