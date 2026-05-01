import 'server-only';

import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { ContentPageHeader } from '@/components/patterns/ContentPageHeader';
import { InfoListPanel } from '@/components/patterns/InfoListPanel';
import { OfferFormClient } from '@/components/sections/OfferForm';
import { JsonLd, buildPageMetadata, jsonld, localizedUrl } from '@/seo';

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ product?: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { product } = await searchParams;
  const [t, seoT] = await Promise.all([
    getTranslations({ locale, namespace: 'offer' }),
    getTranslations({ locale, namespace: 'seo' }),
  ]);
  return buildPageMetadata({
    locale,
    pathname: '/offer',
    title: locale.startsWith('en')
      ? `${t('title')} - Composite Quote, Feasibility and Lead Time`
      : `${t('title')} - Kompozit Teklif, Uygunluk ve Termin`,
    description: seoT('offerDescription'),
    noIndex: Boolean(product),
  });
}

export default async function OfferPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ product?: string }>;
}) {
  const { locale } = await params;
  const { product } = await searchParams;
  const t = await getTranslations({ locale });
  const benefitItems = Object.values(t.raw('offer.benefits.items') as Record<string, string>);
  const summaryItems = Object.values(
    t.raw('offer.summary.items') as Record<string, { title: string; body: string }>,
  );
  const faqEntries = [
    { question: t('offer.faq.q1'), answer: t('offer.faq.a1') },
    { question: t('offer.faq.q2'), answer: t('offer.faq.a2') },
    { question: t('offer.faq.q3'), answer: t('offer.faq.a3') },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--color-carbon)] text-[var(--color-cream)]">
      <div className="gold-grid-bg pointer-events-none absolute inset-0 opacity-[0.2]" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--color-carbon)_80%)] opacity-80" aria-hidden />

      <div className="section-py relative z-10">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <JsonLd
          data={jsonld.graph([
            jsonld.contactPage({
              name: t('offer.title'),
              description: t('offer.description'),
              url: localizedUrl(locale, '/offer'),
            }),
            jsonld.faqPage({
              url: localizedUrl(locale, '/offer'),
              mainEntity: faqEntries,
            }),
          ])}
        />
        <ContentPageHeader
          title={t('offer.title')}
          description={t('offer.description')}
        />
        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {summaryItems.map((item) => (
            <article
              key={item.title}
              className="glass-premium rounded-[2rem] border border-white/5 bg-white/[0.02] p-6"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand/90">
                {t('offer.summary.title')}
              </p>
              <h2 className="mt-3 text-lg font-bold tracking-tight">{item.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                {item.body}
              </p>
            </article>
          ))}
        </section>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <OfferFormClient locale={locale} preselectedProduct={product} />
          <aside>
            <InfoListPanel
              title={t('offer.benefits.title')}
              items={benefitItems}
              accentText={t('common.freeOfObligation')}
            />
          </aside>
        </div>
        <section className="mt-12 rounded-[2rem] border border-white/5 bg-white/[0.02] p-8">
          <h2 className="text-2xl font-bold tracking-tight">{t('offer.faq.title')}</h2>
          <div className="mt-6 space-y-5">
            {faqEntries.map((item) => (
              <article key={item.question} className="border-t border-white/5 pt-5 first:border-t-0 first:pt-0">
                <h3 className="text-base font-bold tracking-tight">{item.question}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  {item.answer}
                </p>
              </article>
            ))}
          </div>
        </section>
        </div>
      </div>
    </div>
  );
}
