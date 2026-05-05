import 'server-only';

import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { notFound } from 'next/navigation';
import { absoluteAssetUrl, API_BASE_URL } from '@/lib/utils';
import { normalizeRichContent } from '@/lib/rich-content';
import { JsonLd, buildPageMetadata, jsonld, localizedPath, localizedUrl, organizationJsonLd } from '@/seo';
import { buildOrganizationSchemaItems } from '@/seo/organization-schema';
import { BrandCtaPanel } from '@/components/patterns/BrandCtaPanel';
import { fetchRelatedContent } from '@/lib/related-content';
import { fetchParsedContactInfo } from '@/lib/contact-info';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { RelatedLinks } from '@/components/seo/RelatedLinks';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { buildMediaAlt } from '@/lib/media-seo';
import { BlogEngagementPanelClient } from '@/components/blog/BlogEngagementPanelClient';
import { SocialShare } from '@/components/blog/SocialShare';

const BLOG_PLACEHOLDER_SRC = '/media/blog-placeholder.svg';

function getPostImage(post: { image_url?: string | null; featured_image?: string | null }) {
  return post.image_url || post.featured_image || null;
}

async function fetchPost(slug: string, locale: string) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/custom-pages/by-slug/${encodeURIComponent(slug)}?locale=${locale}`,
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
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await fetchPost(slug, locale);
  if (!post) return {};
  return buildPageMetadata({
    locale,
    pathname: `/blog/${slug}`,
    title:
      post.meta_title ||
      (locale.startsWith('en')
        ? `${post.title} - Composite Engineering Insight`
        : `${post.title} - Kompozit Muhendislik Notu`),
    description:
      post.meta_description ||
      (locale.startsWith('en')
        ? `${post.title}. Read technical guidance on material selection, production methods and industrial composite applications.`
        : `${post.title}. Malzeme secimi, uretim yontemleri ve endustriyel kompozit uygulamalari icin teknik icerigi inceleyin.`),
    ogImage: getPostImage(post),
    openGraphType: 'article',
    includeLocaleAlternates: false,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale });
  const post = await fetchPost(slug, locale);
  if (!post) notFound();
  const content = normalizeRichContent(post.content);
  const [related, contactInfo] = await Promise.all([
    fetchRelatedContent(post, slug, locale),
    fetchParsedContactInfo(locale),
  ]);
  const org = organizationJsonLd(locale);
  const postImage = getPostImage(post);
  const imageSrc = absoluteAssetUrl(postImage) || BLOG_PLACEHOLDER_SRC;
  const breadcrumbs = [
    { label: t('nav.home'), href: localizedPath(locale, '/') },
    { label: t('nav.blog'), href: localizedPath(locale, '/blog') },
    { label: post.title },
  ];
  const postUrl = localizedUrl(locale, `/blog/${slug}`);

  return (
    <article className="relative min-h-screen overflow-hidden bg-[var(--color-bg)] text-[var(--color-text-primary)]">
      <div className="gold-grid-bg pointer-events-none absolute inset-0 opacity-[0.12] dark:opacity-[0.2]" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,var(--color-bg)_0%,color-mix(in_srgb,var(--color-bg-secondary)_55%,var(--color-bg))_45%,var(--color-bg)_100%)] opacity-90" aria-hidden />

      <div className="section-py relative z-10">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <JsonLd
            data={jsonld.graph([
              ...buildOrganizationSchemaItems(locale, {
                description: typeof post.description === 'string' ? post.description : undefined,
                contact: contactInfo,
                pagePath: `/blog/${slug}`,
              }),
              jsonld.article({
                headline: post.title,
                description: post.description,
                image: postImage ?? undefined,
                datePublished: post.created_at,
                dateModified: post.updated_at,
                publisher: {
                  name: org.name,
                  logo: org.logo as string | undefined,
                },
              }),
              jsonld.breadcrumb(
                breadcrumbs.map((item) => ({
                  name: item.label,
                  url: item.href ? localizedUrl(locale, item.href.replace(`/${locale}`, '') || '/') : localizedUrl(locale, `/blog/${slug}`),
                })),
              ),
            ])}
          />
          <Breadcrumbs
            items={breadcrumbs}
            className="mb-10"
            olClassName="text-[var(--color-text-secondary)] [&_a:hover]:text-[var(--color-gold)] [&_span.font-medium]:text-[var(--color-text-primary)]"
          />

          <header className="mb-12 space-y-6">
            <div className="flex items-center gap-3">
               <div className="h-[2px] w-8 rounded-full bg-[var(--color-gold)]" />
               <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[var(--color-gold)]">
                 Technical Insight
               </span>
            </div>
            <h1 className="text-balance font-[var(--font-display)] text-4xl font-normal tracking-tight text-[var(--color-text-primary)] lg:text-7xl uppercase">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 border-t border-[color-mix(in_srgb,var(--color-gold)_10%,transparent)] pt-6">
               {post.created_at && (
                <p className="text-sm font-light text-[var(--color-text-secondary)]">
                  {new Date(post.created_at).toLocaleDateString(locale, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
               )}
               <div className="size-1 rounded-full bg-[var(--color-gold)]/40" />
               <p className="text-sm font-light text-[var(--color-text-secondary)] opacity-70">Expert Content</p>
            </div>
          </header>

          <div className="relative mb-16 aspect-[21/9] overflow-hidden rounded-sm border border-[color-mix(in_srgb,var(--color-gold)_15%,transparent)] bg-[var(--color-bg-secondary)] shadow-2xl shadow-black/10 dark:shadow-black/30">
            <OptimizedImage
              src={imageSrc}
              alt={buildMediaAlt({
                locale,
                kind: 'blog',
                title: post.title,
                alt: post.featured_image_alt,
                caption: post.description,
                description: post.description,
              })}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1000px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)]/40 to-transparent dark:from-[var(--color-bg)]/60" />
          </div>

          {content && (
            <div
              className="prose prose-lg max-w-none text-[var(--color-text-secondary)] prose-p:text-[var(--color-text-secondary)] prose-headings:font-[var(--font-display)] prose-headings:font-normal prose-headings:tracking-tight prose-headings:text-[var(--color-text-primary)] prose-strong:text-[var(--color-text-primary)] prose-li:text-[var(--color-text-secondary)] prose-a:text-[var(--color-gold)] hover:prose-a:underline md:prose-xl"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}

          <div className="mt-16 border-t border-[color-mix(in_srgb,var(--color-gold)_10%,transparent)] pt-10">
            <SocialShare
              url={postUrl}
              title={post.title}
              texts={{
                label: t('blog.share.label'),
                copyLink: t('blog.share.copyLink'),
                copied: t('blog.share.copied'),
                copyError: t('blog.share.copyError'),
                buttonTitle: t('blog.share.buttonTitle'),
              }}
            />
          </div>

          <div className="mt-12">
            <BlogEngagementPanelClient
              locale={locale}
              postId={post.id}
              texts={{
                title: t('blog.engagement.title'),
                subtitle: t('blog.engagement.subtitle'),
                likeButton: t('blog.engagement.likeButton'),
                emptyTitle: t('blog.engagement.emptyTitle'),
                emptyText: t('blog.engagement.emptyText'),
                formLabel: t('blog.engagement.formLabel'),
                formTitle: t('blog.engagement.formTitle'),
                formDescription: t('blog.engagement.formDescription'),
                namePlaceholder: t('blog.engagement.namePlaceholder'),
                emailPlaceholder: t('blog.engagement.emailPlaceholder'),
                commentPlaceholder: t('blog.engagement.commentPlaceholder'),
                moderationNote: t('blog.engagement.moderationNote'),
                submit: t('blog.engagement.submit'),
                submitSuccess: t('blog.engagement.submitSuccess'),
                submitError: t('blog.engagement.submitError'),
              }}
              commonTexts={{
                loading: t('common.loading'),
                error: t('common.error'),
              }}
            />
          </div>

          <div className="mt-20 border-t border-[color-mix(in_srgb,var(--color-gold)_10%,transparent)] pt-12">
            <BrandCtaPanel
              title={t('common.offerCtaTitle')}
              description={t('common.offerCtaDescription')}
              action={(
                <Link
                  href={`${localizedPath(locale, '/offer')}?product=${encodeURIComponent(post.title)}`}
                  className="hero-btn-primary shimmer-btn glow-hover"
                >
                  {t('nav.offer')}
                  <ArrowRight className="size-5" />
                </Link>
              )}
            />
          </div>

          <div className="mt-24 grid gap-8 lg:grid-cols-3">
             <div className="h-full border border-[color-mix(in_srgb,var(--color-gold)_10%,transparent)] bg-[var(--color-bg-secondary)] p-8">
              <RelatedLinks
                title={t('common.relatedArticles')}
                hrefBase={localizedPath(locale, '/blog')}
                items={related.blogPosts}
              />
             </div>
             <div className="h-full border border-[color-mix(in_srgb,var(--color-gold)_10%,transparent)] bg-[var(--color-bg-secondary)] p-8">
              <RelatedLinks
                title={t('common.relatedProducts')}
                hrefBase={localizedPath(locale, '/products')}
                items={related.products}
              />
             </div>
             <div className="h-full border border-[color-mix(in_srgb,var(--color-gold)_10%,transparent)] bg-[var(--color-bg-secondary)] p-8">
              <RelatedLinks
                title={t('common.relatedGallery')}
                hrefBase={localizedPath(locale, '/gallery')}
                items={related.galleries}
              />
             </div>
          </div>
        </div>
      </div>
    </article>
  );
}
