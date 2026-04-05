import 'server-only';

import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

import { fetchReferences, type PublicReference } from '@/features/references';
import { getFallbackReferences } from '@/lib/content-fallbacks';
import { absoluteAssetUrl } from '@/lib/utils';
import { localizedPath } from '@/seo';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { SectionHeader } from '@/components/patterns/SectionHeader';
import { ArrowRight } from 'lucide-react';

function stripLegacyLocalePrefix(path: string): string {
  const m = path.match(/^\/(tr|en)(\/.*|$)/i);
  if (!m) return path.startsWith('/') ? path : `/${path}`;
  if (!m[2] || m[2] === '') return '/';
  return m[2];
}

function hrefForFallbackPath(locale: string, websiteUrl?: string): string {
  if (!websiteUrl?.trim()) return localizedPath(locale, '/references');
  const raw = websiteUrl.trim();
  if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;
  const pathOnly = stripLegacyLocalePrefix(raw);
  return localizedPath(locale, pathOnly);
}

type StripItem = {
  key: string;
  title: string;
  href: string;
  external: boolean;
  imageSrc?: string;
  imageAlt: string;
};

function mapApiRef(locale: string, item: PublicReference): StripItem {
  const extUrl = item.website_url?.trim() ?? '';
  const external = extUrl.startsWith('http://') || extUrl.startsWith('https://');
  const href = external ? extUrl : extUrl ? hrefForFallbackPath(locale, extUrl) : localizedPath(locale, '/references');
  const imageSrc = item.featured_image ? absoluteAssetUrl(item.featured_image) : undefined;
  return {
    key: String(item.id ?? item.title),
    title: item.title,
    href,
    external,
    imageSrc: imageSrc || undefined,
    imageAlt: item.featured_image_alt ?? item.title,
  };
}

export async function ReferencesTrustStrip({ locale }: { locale: string }) {
  const t = await getTranslations({ locale });
  const apiRefs = await fetchReferences(locale, { limit: 8, featuredOnly: true, revalidate: 300 });
  const fallbacks = getFallbackReferences(locale);

  const items: StripItem[] =
    apiRefs.length > 0
      ? apiRefs.map((r) => mapApiRef(locale, r))
      : fallbacks.slice(0, 6).map((item, index) => ({
          key: `fb-${index}-${item.title}`,
          title: item.title,
          href: hrefForFallbackPath(locale, item.websiteUrl),
          external: false,
          imageSrc: item.imageSrc,
          imageAlt: item.title,
        }));

  if (items.length === 0) return null;

  return (
    <section className="section-py border-y border-[color-mix(in_srgb,var(--color-gold)_10%,transparent)] bg-[var(--color-graphite)]">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeader
          title={t('home.references.title')}
          description={t('home.references.subtitle')}
          label={t('home.references.sectionLabel')}
          align="center"
          action={(
            <Link
              href={localizedPath(locale, '/references')}
              className="hidden items-center gap-2 text-sm font-bold text-[var(--color-brand)] transition-all hover:gap-3 sm:flex"
            >
              {t('home.references.cta')}
              <ArrowRight className="size-4" />
            </Link>
          )}
        />

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-8 md:gap-x-14">
          {items.map((item) => {
            const inner = (
              <>
                {item.imageSrc ? (
                  <div className="relative h-12 w-36 opacity-80 transition-opacity duration-300 group-hover:opacity-100">
                    <OptimizedImage
                      src={item.imageSrc}
                      alt={item.imageAlt}
                      fill
                      className="object-contain object-center transition-all duration-500 grayscale group-hover:grayscale-0 group-hover:scale-105"
                      sizes="144px"
                    />
                  </div>
                ) : (
                  <span className="max-w-[10rem] text-center text-xs font-bold uppercase tracking-widest text-[var(--color-text-secondary)] transition-colors group-hover:text-[var(--color-brand)]">
                    {item.title}
                  </span>
                )}
              </>
            );

            const className =
              'group flex min-h-[3.5rem] min-w-[6rem] items-center justify-center rounded-2xl border border-white/5 bg-white/[0.02] px-4 py-3 transition-all hover:border-brand/20 hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-muted)]';

            if (item.external) {
              return (
                <a
                  key={item.key}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={className}
                >
                  {inner}
                </a>
              );
            }

            return (
              <Link key={item.key} href={item.href} className={className}>
                {inner}
              </Link>
            );
          })}
        </div>

        <div className="mt-8 flex justify-center sm:hidden">
          <Link
            href={localizedPath(locale, '/references')}
            className="inline-flex items-center gap-2 text-sm font-bold text-[var(--color-brand)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-muted)]"
          >
            {t('home.references.cta')}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
