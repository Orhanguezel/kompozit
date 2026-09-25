import Link from 'next/link';
import guides from '@/seo/page-guides.json';
import { APP_NAME } from '@/lib/brand-name';
import { JsonLd, jsonld, localizedPath, localizedUrl } from '@/seo';

type GuideKey = keyof typeof guides;

export function PageGuide({ locale, pageKey }: { locale: string; pageKey: GuideKey }) {
  const en = locale.startsWith('en');
  const [heading, entries] = guides[pageKey][en ? 'en' : 'tr'] as [string, [string, string][]];
  const links = en
    ? [['products', 'Explore composite products'], ['references', 'Review references'], ['gallery', 'View the production gallery'], ['offer', 'Send project requirements']]
    : [['products', 'Kompozit ürünleri inceleyin'], ['references', 'Referansları inceleyin'], ['gallery', 'Üretim galerisini görün'], ['offer', 'Proje gereksinimlerini gönderin']];
  return (
    <section className="relative section-py bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]" data-page-guide={pageKey}>
      <div className="mx-auto max-w-5xl space-y-8 px-6 lg:px-12">
        <h2 className="text-2xl font-semibold sm:text-3xl">{heading}</h2>
        {entries.map(([question, answer]) => (
          <div key={question} className="space-y-3" data-guide-answer>
            <h3 className="text-xl font-semibold">{question}</h3>
            <p className="leading-8 text-[var(--color-text-secondary)]">{answer}</p>
          </div>
        ))}
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          {links.filter(([key]) => key !== pageKey).map(([key, label]) => <Link key={key} href={localizedPath(locale, `/${key}`)} className="underline underline-offset-4">{label}</Link>)}
        </div>
        <p className="text-sm text-[var(--color-text-secondary)]">
          {en ? 'Published by ' : 'Yayınlayan: '}<Link href={localizedPath(locale, '/about')} className="underline">{APP_NAME}</Link>
          {' · '}{en ? 'Guide updated: ' : 'Rehber güncellemesi: '}<time dateTime="2026-09-22">{en ? '22 September 2026' : '22 Eylül 2026'}</time>
        </p>
        {/* Contact and offer already provide their own FAQPage graph. */}
        {!['contact', 'offer'].includes(pageKey) && <JsonLd data={jsonld.faqPage({ url: localizedUrl(locale, pageKey === 'home' ? '/' : `/${pageKey}`), mainEntity: entries.map(([question, answer]) => ({ question, answer })) })} />}
      </div>
    </section>
  );
}
