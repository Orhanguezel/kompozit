import 'server-only';

import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { ContentPageHeader } from '@/components/patterns/ContentPageHeader';
import { InfoListPanel } from '@/components/patterns/InfoListPanel';
import { ContactFormClient } from '@/components/sections/ContactForm';
import { GoogleMap } from '@/components/widgets/GoogleMap';
import { fetchParsedContactInfo } from '@/lib/contact-info';
import {
  JsonLd,
  buildPageMetadata,
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
  const t = await getTranslations({ locale, namespace: 'contact' });
  return buildPageMetadata({
    locale,
    pathname: '/contact',
    title: locale.startsWith('en')
      ? `${t('title')} - Technical Contact for Sampling and Quotes`
      : `${t('title')} - Numune ve Teklif Icin Teknik Iletisim`,
    description: t('description'),
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

  return (
    <div className="min-h-screen bg-[var(--color-bg-muted)] relative overflow-hidden">
      <div className="surface-dark-shell carbon-mesh absolute inset-0 opacity-[0.03] pointer-events-none" />
      
      <div className="section-py relative z-10">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <JsonLd
            data={jsonld.graph([
              jsonld.contactPage({
                name: t('contact.title'),
                description: t('contact.description'),
                url: localizedUrl(locale, '/contact'),
              }),
              ...buildOrganizationSchemaItems(locale, {
                description: t('contact.description'),
                contact: info,
                pagePath: '/contact',
              }),
            ])}
          />
          
          <ContentPageHeader
            title={t('contact.title')}
            description={t('contact.description')}
            label={t('contact.label')}
            features={t.raw('contact.features')}
          />

          <div className="mt-16 grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
            <Reveal delay={100}>
              <div className="glass-premium rounded-[2.5rem] p-8 lg:p-12 border-white/5 bg-white/[0.02]">
                <ContactFormClient locale={locale} />
              </div>
            </Reveal>

            <div className="space-y-8">
              <Reveal delay={200}>
                <section className="glass-premium rounded-[2.5rem] p-8 border-white/5 bg-white/[0.01]">
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand mb-8 italic">
                    {t('contact.officeLabel')} / {t('contact.info.title')}
                  </h2>
                  <div className="space-y-6 text-sm text-[var(--color-text-secondary)]">
                    <div className="group">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2 opacity-40">
                        {t('contact.info.address')}
                      </p>
                      <p className="text-lg font-bold text-[var(--color-text-primary)] leading-snug">
                        {info.companyName}<br/>
                        {info.address}
                      </p>
                    </div>
                    
                    <div className="grid gap-6 sm:grid-cols-2">
                       {info.phone && (
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2 opacity-40">
                            {t('contact.info.phone')}
                          </p>
                          <a
                            href={`tel:${info.phone.replace(/\s/g, '')}`}
                            className="text-lg font-bold text-brand hover:opacity-80 transition-opacity"
                          >
                            {info.phone}
                          </a>
                        </div>
                      )}
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2 opacity-40">
                          {t('contact.info.email')}
                        </p>
                        <a
                          href={`mailto:${info.email}`}
                          className="text-lg font-bold text-[var(--color-text-primary)] hover:text-brand transition-colors break-all"
                        >
                          {info.email}
                        </a>
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2 opacity-40">
                        {t('contact.info.hours')}
                      </p>
                      <p className="font-medium">{info.hours}</p>
                    </div>
                  </div>
                </section>
              </Reveal>

              <Reveal delay={300}>
                <InfoListPanel
                  title={t('contact.response.title')}
                  items={responseItems}
                  accentText="Our Commitment"
                />
              </Reveal>

              <Reveal delay={400}>
                <div className="glass-premium overflow-hidden rounded-[2.5rem] p-2 border-white/5">
                  <GoogleMap className="h-72 w-full overflow-hidden rounded-[2rem]" />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
