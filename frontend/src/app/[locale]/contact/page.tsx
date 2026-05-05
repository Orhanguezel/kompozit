import 'server-only';

import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { ContentPageHeader } from '@/components/patterns/ContentPageHeader';
import { InfoListPanel } from '@/components/patterns/InfoListPanel';
import { ContactFormSection } from '@/components/sections/ContactFormSection';
import { GoogleMap } from '@/components/widgets/GoogleMap';
import { fetchParsedContactInfo } from '@/lib/contact-info';
import {
  JsonLd,
  buildPageMetadataFromSettings,
  buildOrganizationSchemaItems,
  jsonld,
  localizedUrl,
} from '@/seo';

import { Reveal } from '@/components/motion/Reveal';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const [t, seoT] = await Promise.all([
    getTranslations({ locale, namespace: 'contact' }),
    getTranslations({ locale, namespace: 'seo' }),
  ]);
  return buildPageMetadataFromSettings({
    locale,
    pathname: '/contact',
    pageKey: 'contact',
    fallback: {
      title: locale.startsWith('en')
        ? `${t('title')} - Technical Contact for Sampling and Quotes`
        : `${t('title')} - Numune ve Teklif Icin Teknik Iletisim`,
      description: seoT('contactDescription'),
    },
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const info = await fetchParsedContactInfo(locale);
  const responseItems = Object.values(t.raw('contact.response.items') as Record<string, string>);
  const contactUrl = localizedUrl(locale, '/contact');
  const faqEntities = [1, 2, 3, 4, 5].map((i) => ({
    question: t(`contact.faq.q${i}`),
    answer: t(`contact.faq.a${i}`),
  }));

  return (
    <main className="relative bg-[var(--carbon)]">
      <div className="gold-grid-bg absolute inset-0 z-0 opacity-20" />

      <div className="section-py relative z-10">
        <div className="mx-auto max-w-[1300px] px-6 lg:px-12">
          <JsonLd
            data={jsonld.graph([
              jsonld.contactPage({
                name: t('contact.title'),
                description: t('contact.description'),
                url: contactUrl,
              }),
              ...buildOrganizationSchemaItems(locale, {
                description: t('contact.description'),
                contact: info,
                pagePath: '/contact',
              }),
              jsonld.faqPage({
                url: contactUrl,
                mainEntity: faqEntities,
              }),
            ])}
          />

          <Reveal>
            <div className="mb-20">
              <span className="section-label-cc">{t('contact.label')}</span>
              <h1 className="section-title-cc">{t('contact.title')}</h1>
              <p className="section-subtitle-cc">{t('contact.description')}</p>
            </div>
          </Reveal>

          <div className="grid gap-16 lg:grid-cols-[450px_1fr] lg:items-start">
            <div className="space-y-12">
              <Reveal delay={200}>
                <section className="p-10 border border-[var(--gold)]/15 bg-[var(--graphite)]">
                  <h2 className="font-display text-[0.7rem] uppercase tracking-[4px] text-[var(--gold)] mb-10">
                    {t('contact.info.title')}
                  </h2>
                  <div className="space-y-10">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[2px] mb-4 text-[var(--silver)] opacity-60">
                        {t('contact.info.address')}
                      </p>
                      <p className="text-xl font-display uppercase tracking-[3px] text-[var(--white)] leading-snug">
                        {info.companyName}<br/>
                        {info.address}
                      </p>
                    </div>

                    <div className="grid gap-8 sm:grid-cols-2">
                       {info.phone && (
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[2px] mb-4 text-[var(--silver)] opacity-60">
                            {t('contact.info.phone')}
                          </p>
                          <a
                            href={`tel:${info.phone.replace(/\s/g, '')}`}
                            className="text-xl font-display uppercase tracking-[3px] text-[var(--gold)] hover:text-[var(--white)] transition-colors"
                          >
                            {info.phone}
                          </a>
                        </div>
                      )}
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[2px] mb-4 text-[var(--silver)] opacity-60">
                          {t('contact.info.email')}
                        </p>
                        <a
                          href={`mailto:${info.email}`}
                          className="text-lg font-display uppercase tracking-[2px] text-[var(--white)] hover:text-[var(--gold)] transition-colors break-all"
                        >
                          {info.email}
                        </a>
                      </div>
                    </div>
                  </div>
                </section>
              </Reveal>

              <Reveal delay={300}>
                <div className="p-10 border border-[var(--gold)]/10 bg-[var(--graphite)] backdrop-blur-sm">
                  <h3 className="font-display text-[1rem] uppercase tracking-[3px] text-[var(--white)] mb-8 border-b border-[var(--gold)]/10 pb-4">
                    {t('contact.response.title')}
                  </h3>
                  <ul className="space-y-6">
                    {responseItems.map((item, i) => (
                      <li key={i} className="flex gap-4 text-sm font-light text-[var(--silver)] leading-relaxed">
                        <span className="text-[var(--gold)] font-bold">◇</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>

            <ContactFormSection locale={locale} />
          </div>

          <section className="mt-32 max-w-4xl" aria-labelledby="contact-faq-heading">
            <Reveal>
              <div className="mb-16">
                <span className="section-label-cc">Inquiry</span>
                <h2 id="contact-faq-heading" className="section-title-cc text-[3.5rem]">
                  {t('contact.faq.title')}
                </h2>
                <p className="section-subtitle-cc">
                  {t('contact.faq.intro')}
                </p>
              </div>
            </Reveal>

            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Reveal key={i} delay={i * 50}>
                  <div className="py-10 border-b border-[var(--gold)]/10 group transition-all hover:bg-[var(--gold)]/[0.02] px-8">
                    <dt className="font-display text-[1.4rem] uppercase tracking-[3px] text-[var(--white)] group-hover:text-[var(--gold)] transition-colors">
                      {t(`contact.faq.q${i}`)}
                    </dt>
                    <dd className="mt-6 text-base font-light leading-relaxed text-[var(--silver)] group-hover:text-[var(--white)] transition-colors">
                      {t(`contact.faq.a${i}`)}
                    </dd>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
