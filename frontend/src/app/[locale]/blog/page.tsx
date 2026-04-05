import 'server-only';

import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { API_BASE_URL, resolvePublicAssetUrl } from '@/lib/utils';
import { JsonLd, buildPageMetadata, jsonld, localizedPath, localizedUrl } from '@/seo';
import { ListingCard } from '@/components/patterns/ListingCard';
import { SectionHeader } from '@/components/patterns/SectionHeader';
import { getFallbackBlogPosts } from '@/lib/content-fallbacks';
import { buildMediaAlt } from '@/lib/media-seo';
import { SeoIssueBeacon } from '@/components/monitoring/SeoIssueBeacon';

import { Reveal } from '@/components/motion/Reveal';

async function fetchBlogPosts(locale: string) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/custom_pages?module_key=kompozit_blog&is_active=1&locale=${locale}&limit=50`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data as any)?.items ?? [];
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });
  return buildPageMetadata({
    locale,
    pathname: '/blog',
    title: locale.startsWith('en')
      ? `${t('title')} - Composite Engineering and Production Insights`
      : `${t('title')} - Kompozit Muhendislik ve Uretim Notlari`,
    description: t('description'),
  });
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const posts = await fetchBlogPosts(locale);
  const fallbackPosts = getFallbackBlogPosts(locale);
  const visiblePosts = posts.length > 0 ? posts : fallbackPosts;

  return (
    <div className="min-h-screen bg-[var(--color-carbon)] relative overflow-hidden text-[var(--color-cream)]">
      <div className="gold-grid-bg pointer-events-none absolute inset-0 opacity-[0.2]" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--color-carbon)_85%)] opacity-90" aria-hidden />
      
      <div className="section-py relative z-10">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <JsonLd
            data={jsonld.graph([
              jsonld.collectionPage({
                name: t('blog.title'),
                description: t('blog.description'),
                url: localizedUrl(locale, '/blog'),
                mainEntity: jsonld.itemList(
                  visiblePosts.slice(0, 12).map((item: any) => ({
                    name: item.title,
                    url: item.slug ? localizedUrl(locale, `/blog/${item.slug}`) : localizedUrl(locale, '/contact'),
                  })),
                ),
              }),
            ])}
          />
          <SectionHeader
            title={t('blog.title')}
            description={t('blog.description')}
            label="Expertise"
            align="left"
          />

          <div className="mt-12">
            {posts.length === 0 && (
              <div className="glass-premium rounded-[2rem] p-12 text-center border-white/5 bg-white/[0.02] mb-12">
                <SeoIssueBeacon
                  type="soft-404"
                  pathname={localizedPath(locale, '/blog')}
                  reason="blog-list-empty"
                />
                <p className="text-xl font-bold tracking-tight">
                  {t('blog.noPosts')}
                </p>
                <p className="mt-4 text-sm text-[var(--color-text-muted)] opacity-70">
                  {locale === 'en'
                    ? 'Our engineering blog is being updated with the latest composite trend sheets.'
                    : 'Muhendislik blogumuz kompozit sektorundeki en yeni teknik raporlarla guncelleniyor.'}
                </p>
              </div>
            )}
            
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {visiblePosts.map((post: any, index: number) => (
                <Reveal key={post.id ?? post.title} delay={100 * (index % 6)}>
                  <ListingCard
                    href={post.slug ? localizedPath(locale, `/blog/${post.slug}`) : localizedPath(locale, '/contact')}
                    title={post.title}
                    lineLabel={t('common.listingArticleLine')}
                    description={post.description}
                    imageSrc={
                      resolvePublicAssetUrl(post.image_url ?? post.featured_image) ??
                      post.image_url ??
                      post.featured_image
                    }
                    imageAlt={buildMediaAlt({
                      locale,
                      kind: 'blog',
                      title: post.title,
                      alt: post.alt,
                      caption: post.description,
                      description: post.description,
                    })}
                    imageSizes="(max-width: 768px) 100vw, 33vw"
                    imageAspectClassName="aspect-[16/10]"
                    footer={
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand group/btn">
                         {t('blog.readMore')}
                         <div className="h-[1px] w-6 bg-brand transition-all group-hover/btn:w-10" />
                      </div>
                    }
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
