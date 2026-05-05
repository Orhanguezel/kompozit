import 'server-only';

import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { ContactPage as ContactPageContainer } from '@/components/containers/contact/ContactPage';
import { fetchParsedContactInfo } from '@/lib/contact-info';
import {
  JsonLd,
  buildPageMetadataFromSettings,
  buildOrganizationSchemaItems,
  jsonld,
  localizedUrl,
} from '@/seo';

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
    <>
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
      <ContactPageContainer
        locale={locale}
        info={info}
        labels={{
          label: t('contact.label'),
          title: t('contact.title'),
          description: t('contact.description'),
          infoTitle: t('contact.info.title'),
          addressLabel: t('contact.info.address'),
          phoneLabel: t('contact.info.phone'),
          emailLabel: t('contact.info.email'),
          hoursLabel: t('contact.info.hours'),
          responseTitle: t('contact.response.title'),
          responseItems,
          faqTitle: t('contact.faq.title'),
          faqIntro: t('contact.faq.intro'),
          faqItems: faqEntities,
        }}
      />
    </>
  );
}
