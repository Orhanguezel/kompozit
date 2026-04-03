import 'server-only';

import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { ArrowRight, FileText, MessagesSquare } from 'lucide-react';

import type { ProductsB2bContent } from '@/features/site-settings/products-b2b';
import { localizedPath } from '@/seo';

export async function ProductB2bBanner({
  locale,
  content,
}: {
  locale: string;
  content?: ProductsB2bContent;
}) {
  const t = await getTranslations({ locale, namespace: 'products' });
  const b2b = content ?? {
    catalogEyebrow: t('b2b.catalogEyebrow'),
    catalogTitle: t('b2b.catalogTitle'),
    catalogBody: t('b2b.catalogBody'),
    requestQuote: t('b2b.requestQuote'),
    talkToEngineering: t('b2b.talkToEngineering'),
    detailEyebrow: t('b2b.detailEyebrow'),
    detailTitle: t('b2b.detailTitle'),
    detailBody: t('b2b.detailBody'),
    reliability: {
      title: t('b2b.reliability.title'),
      desc: t('b2b.reliability.desc'),
    },
    engineering: {
      title: t('b2b.engineering.title'),
      desc: t('b2b.engineering.desc'),
    },
    speed: {
      title: t('b2b.speed.title'),
      desc: t('b2b.speed.desc'),
    },
    logistics: {
      title: t('b2b.logistics.title'),
      desc: t('b2b.logistics.desc'),
    },
  };

  return (
    <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm lg:p-10">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand/90">
            {b2b.catalogEyebrow}
          </p>
          <h2 className="text-xl font-bold tracking-tight text-balance text-[var(--color-text-primary)] lg:text-2xl">
            {b2b.catalogTitle}
          </h2>
          <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
            {b2b.catalogBody}
          </p>
        </div>
        <div className="flex flex-shrink-0 flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href={localizedPath(locale, '/offer')}
            className="btn-primary shimmer-btn glow-hover inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold shadow-lg shadow-brand/15 transition-all active:scale-[0.98]"
          >
            <FileText className="size-4" />
            {b2b.requestQuote}
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href={localizedPath(locale, '/contact')}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-6 py-3.5 text-sm font-bold text-[var(--color-text-primary)] transition-all hover:border-brand/30 hover:bg-white/[0.07] active:scale-[0.98]"
          >
            <MessagesSquare className="size-4 text-brand" />
            {b2b.talkToEngineering}
          </Link>
        </div>
      </div>
    </div>
  );
}
