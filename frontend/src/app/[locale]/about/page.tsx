import 'server-only';

import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { API_BASE_URL } from '@/lib/utils';
import { normalizeRichContent } from '@/lib/rich-content';
import { ContentPageHeader } from '@/components/patterns/ContentPageHeader';
import { InfoListPanel } from '@/components/patterns/InfoListPanel';
import {
  JsonLd,
  buildPageMetadataFromSettings,
  jsonld,
  localizedPath,
  localizedUrl,
  organizationJsonLd,
} from '@/seo';
import { Reveal } from '@/components/motion/Reveal';

async function fetchAboutCustomPage(locale: string) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/custom-pages/by-slug/${encodeURIComponent('about')}?locale=${locale}`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const page = await fetchAboutCustomPage(locale);
  const [t, seoT] = await Promise.all([
    getTranslations({ locale, namespace: 'about' }),
    getTranslations({ locale, namespace: 'seo' }),
  ]);
  const fallbackTitle = page?.meta_title || page?.title || t('title');
  const fallbackDescription =
    page?.meta_description || page?.description || page?.summary || seoT('aboutDescription');
  return buildPageMetadataFromSettings({
    locale,
    pathname: '/about',
    pageKey: 'about',
    fallback: { title: fallbackTitle, description: fallbackDescription },
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const page = await fetchAboutCustomPage(locale);
  const pageContent = page?.content != null ? normalizeRichContent(page.content) : '';
  const intro =
    typeof page?.summary === 'string' && page.summary.trim()
      ? page.summary
      : typeof page?.description === 'string' && page.description.trim()
        ? page.description
        : t('about.intro');
  const headerTitle = typeof page?.title === 'string' && page.title.trim() ? page.title : t('about.title');

  return (
    <main className="relative bg-[var(--carbon)]">
      <div className="gold-grid-bg absolute inset-0 z-0 opacity-20" />

      <div className="section-py relative z-10">
        <div className="mx-auto max-w-[1300px] px-6 lg:px-12">
          <JsonLd
            data={jsonld.graph([
              jsonld.org(
                organizationJsonLd(locale, {
                  description: t('about.description'),
                }),
              ),
              jsonld.aboutPage({
                name: headerTitle,
                description: t('about.description'),
                url: localizedUrl(locale, '/about'),
              }),
            ])}
          />

          <Reveal>
            <div className="mb-20">
              <span className="section-label-cc">{t('about.label')}</span>
              <h1 className="section-title-cc">{headerTitle}</h1>
              <p className="section-subtitle-cc">{t('about.description')}</p>
            </div>
          </Reveal>

          {/* Stats Bar (Industrial Style) */}
          <div className="industrial-grid-cc mb-24 sm:grid-cols-2 lg:grid-cols-3">
             <Reveal delay={100} className="grid-item-cc p-12 text-center group">
               <p className="font-display text-[3.5rem] leading-none text-[var(--gold)] transition-transform group-hover:scale-110">
                 {t('about.sections.stats.experience')}
               </p>
               <p className="mt-4 text-[10px] font-bold uppercase tracking-[3px] text-[var(--silver)] opacity-60">
                 {t('about.sections.stats.expLabel')}
               </p>
             </Reveal>
             <Reveal delay={200} className="grid-item-cc p-12 text-center group">
               <p className="font-display text-[3.5rem] leading-none text-[var(--gold)] transition-transform group-hover:scale-110">
                 {t('about.sections.stats.projects')}
               </p>
               <p className="mt-4 text-[10px] font-bold uppercase tracking-[3px] text-[var(--silver)] opacity-60">
                 {t('about.sections.stats.projectsLabel')}
               </p>
             </Reveal>
             <Reveal delay={300} className="grid-item-cc p-12 text-center group sm:col-span-2 lg:col-span-1">
               <p className="font-display text-[3.5rem] leading-none text-[var(--gold)] transition-transform group-hover:scale-110">
                 {t('about.sections.stats.capacity')}
               </p>
               <p className="mt-4 text-[10px] font-bold uppercase tracking-[3px] text-[var(--silver)] opacity-60">
                 {t('about.sections.stats.capacityLabel')}
               </p>
             </Reveal>
          </div>

          <div className="grid gap-20 lg:grid-cols-[1fr_350px]">
            <div className="space-y-20">
              <Reveal>
                <section className="prose prose-invert prose-lg max-w-none">
                  <p className="font-serif text-[1.4rem] font-normal italic leading-snug text-[var(--gold)] border-l-2 border-[var(--gold)]/30 pl-10 py-2">
                    {intro}
                  </p>
                  {pageContent ? (
                    <div className="mt-16 text-[var(--silver)] font-light leading-relaxed space-y-6" dangerouslySetInnerHTML={{ __html: pageContent }} />
                  ) : null}
                </section>
              </Reveal>

              <div className="grid gap-12 sm:grid-cols-2">
                <Reveal delay={100}>
                  <div className="p-10 border border-[var(--gold)]/10 bg-[var(--graphite)] backdrop-blur-sm">
                    <h3 className="font-display text-[1.2rem] uppercase tracking-[3px] text-[var(--white)] mb-8 border-b border-[var(--gold)]/10 pb-4">
                      {t('about.sections.expertiseTitle')}
                    </h3>
                    <ul className="space-y-4">
                       {[
                         t('about.sections.expertiseItems.one'),
                         t('about.sections.expertiseItems.two'),
                         t('about.sections.expertiseItems.three'),
                       ].map((item, i) => (
                         <li key={i} className="flex gap-4 text-sm font-light text-[var(--silver)]">
                           <span className="text-[var(--gold)] font-bold">◆</span>
                           {item}
                         </li>
                       ))}
                    </ul>
                  </div>
                </Reveal>

                <Reveal delay={200}>
                  <div className="p-10 border border-[var(--gold)]/10 bg-[var(--graphite)] backdrop-blur-sm">
                    <h3 className="font-display text-[1.2rem] uppercase tracking-[3px] text-[var(--white)] mb-8 border-b border-[var(--gold)]/10 pb-4">
                      {t('about.sections.processTitle')}
                    </h3>
                    <ul className="space-y-4">
                       {[
                         t('about.sections.processItems.one'),
                         t('about.sections.processItems.two'),
                         t('about.sections.processItems.three'),
                       ].map((item, i) => (
                         <li key={i} className="flex gap-4 text-sm font-light text-[var(--silver)]">
                           <span className="text-[var(--gold)] font-bold">◇</span>
                           {item}
                         </li>
                       ))}
                    </ul>
                  </div>
                </Reveal>
              </div>

              <Reveal delay={300}>
                <section className="border-l-2 border-[var(--gold)]/40 bg-[var(--gold)]/[0.04] px-8 py-10">
                  <span className="section-label-cc">{t('about.ensotek.label')}</span>
                  <h2 className="mt-4 font-display text-[2rem] font-normal uppercase tracking-[4px] text-[var(--white)]">
                    {t('about.ensotek.title')}
                  </h2>
                  <p className="mt-6 max-w-3xl text-sm font-light leading-relaxed text-[var(--silver)]">
                    {t('about.ensotek.description')}
                  </p>
                  <a
                    href="https://www.ensotek.com.tr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[3px] text-[var(--gold)] transition-colors hover:text-[var(--white)]"
                  >
                    {t('about.ensotek.cta')}
                    <ArrowRight className="size-4" />
                  </a>
                </section>
              </Reveal>
            </div>

            <aside>
              <Reveal delay={400} className="sticky top-32 space-y-8">
                <div className="p-10 border border-[var(--gold)]/20 bg-[var(--gold)]/5">
                  <h3 className="font-display text-[0.7rem] uppercase tracking-[4px] text-[var(--gold)] mb-6">
                    {t('about.sidebar.partnershipTitle')}
                  </h3>
                  <p className="font-display text-[1.8rem] leading-tight text-[var(--white)] mb-10">
                    {t('about.sidebar.partnershipLead')}
                  </p>
                  <Link
                    href={localizedPath(locale, '/contact')}
                    className="hero-btn-primary shimmer-btn w-full justify-center"
                  >
                    {t('about.sidebar.partnershipCta')}
                    <ArrowRight className="size-5" />
                  </Link>
                </div>

                <div className="p-10 border border-[var(--gold)]/10 bg-[var(--graphite)]">
                  <h3 className="font-display text-[0.7rem] uppercase tracking-[4px] text-[var(--white)] mb-8">
                    {t('about.sidebar.sectorsHeading')}
                  </h3>
                  <ul className="space-y-5">
                    {[
                      t('about.sections.sectorsItems.one'),
                      t('about.sections.sectorsItems.two'),
                      t('about.sections.sectorsItems.three'),
                    ].map((sector, i) => (
                      <li key={i} className="flex items-center gap-4 text-xs font-bold uppercase tracking-[2px] text-[var(--silver)] group transition-colors hover:text-[var(--gold)]">
                        <div className="size-1.5 bg-[var(--gold)]/40 transition-colors group-hover:bg-[var(--gold)]" />
                        {sector}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}
