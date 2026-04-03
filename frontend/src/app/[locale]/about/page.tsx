'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ContentPageHeader } from '@/components/patterns/ContentPageHeader';
import { InfoListPanel } from '@/components/patterns/InfoListPanel';
import { JsonLd, organizationJsonLd, localizedPath, localizedUrl, jsonld } from '@/seo';

export default function AboutPage({
  params: { locale },
  page,
  pageContent,
}: {
  params: { locale: string };
  page: any;
  pageContent: string;
}) {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-[var(--color-bg-muted)] relative overflow-hidden">
      <div className="surface-dark-shell carbon-mesh absolute inset-0 opacity-[0.03] pointer-events-none" />
      
      <div className="section-py relative z-10">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <JsonLd
            data={jsonld.graph([
              jsonld.org(
                organizationJsonLd(locale, {
                  description: t('about.description'),
                }),
              ),
              jsonld.aboutPage({
                name: t('about.title'),
                description: t('about.description'),
                url: localizedUrl(locale, '/about'),
              }),
            ])}
          />
          <ContentPageHeader
            title={page?.title || t('about.title')}
            description={t('about.description')}
            label={t('about.label')}
            features={[
              t('about.sections.expertiseItems.one'),
              t('about.sections.expertiseItems.two'),
              t('about.sections.expertiseItems.three'),
            ]}
          />

          {/* Stats Bar */}
          <div className="mt-16 grid gap-4 grid-cols-2 lg:grid-cols-3 mb-20">
             <div className="glass-premium p-8 rounded-[2rem] border-white/5 bg-white/[0.02] text-center">
                <p className="text-4xl font-bold tracking-tighter text-brand mb-2">{t('about.sections.stats.experience')}</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">{t('about.sections.stats.expLabel')}</p>
             </div>
             <div className="glass-premium p-8 rounded-[2rem] border-white/5 bg-white/[0.02] text-center">
                <p className="text-4xl font-bold tracking-tighter text-brand mb-2">{t('about.sections.stats.projects')}</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">{t('about.sections.stats.projectsLabel')}</p>
             </div>
             <div className="glass-premium p-8 rounded-[2rem] border-white/5 bg-white/[0.02] text-center col-span-2 lg:col-span-1">
                <p className="text-4xl font-bold tracking-tighter text-brand mb-2">{t('about.sections.stats.capacity')}</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">{t('about.sections.stats.capacityLabel')}</p>
             </div>
          </div>

          <div className="grid gap-12 lg:grid-cols-[1fr_minmax(24rem,0.8fr)]">
            {/* Main Content Rail */}
            <div className="space-y-16">
              <section className="prose prose-theme prose-lg max-w-none">
                <p className="lead font-medium text-[var(--color-text-secondary)] opacity-90 italic border-l-4 border-brand pl-8 py-2">
                  {page?.intro || t('about.intro')}
                </p>
                {pageContent && (
                   <div dangerouslySetInnerHTML={{ __html: pageContent }} className="mt-12" />
                )}
              </section>

              <div className="grid gap-8 sm:grid-cols-2">
                <InfoListPanel
                  title={t('about.sections.expertiseTitle')}
                  items={[
                    t('about.sections.expertiseItems.one'),
                    t('about.sections.expertiseItems.two'),
                    t('about.sections.expertiseItems.three'),
                  ]}
                  accentText="Core Capabilities"
                />
                <InfoListPanel
                  title={t('about.sections.processTitle')}
                  items={[
                    t('about.sections.processItems.one'),
                    t('about.sections.processItems.two'),
                    t('about.sections.processItems.three'),
                  ]}
                  accentText="Agile Workflow"
                />
              </div>

               <div className="pt-12 border-t border-white/5">
                 <InfoListPanel
                    title={t('about.sections.certifications.title')}
                    items={Object.values(t.raw('about.sections.certifications.items') as Record<string, string>)}
                    accentText="Authorized Operations"
                  />
               </div>
            </div>

            {/* Sidebar Rail */}
            <aside className="space-y-8">
              <div className="sticky top-28 space-y-8">
                <div className="glass-premium p-8 rounded-[2.5rem] border-brand/20 bg-brand/5">
                   <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-brand mb-6">Partnership</h3>
                   <p className="text-2xl font-bold tracking-tight mb-8">Ready to initiate a composite project?</p>
                   <Link
                      href={localizedPath(locale, '/contact')}
                      className="btn-primary shimmer-btn glow-hover flex items-center justify-center gap-3 w-full py-4 rounded-xl font-bold"
                   >
                      Request a Technical Quote
                      <ArrowRight className="size-5" />
                   </Link>
                </div>

                <div className="glass-premium p-8 rounded-[2.5rem] border-white/5 bg-white/[0.02]">
                   <h3 className="text-sm font-bold uppercase tracking-[0.2em] mb-6">Expert Sectors</h3>
                   <ul className="space-y-4">
                      {[
                        t('about.sections.sectorsItems.one'),
                        t('about.sections.sectorsItems.two'),
                        t('about.sections.sectorsItems.three'),
                      ].map((sector, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm font-medium opacity-80">
                           <div className="size-1.5 rounded-full bg-brand" />
                           {sector}
                        </li>
                      ))}
                   </ul>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
