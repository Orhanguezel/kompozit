import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { API_BASE_URL } from '@/lib/utils';
import { normalizeRichContent } from '@/lib/rich-content';
import { ContentPageHeader } from '@/components/patterns/ContentPageHeader';
import { RichContentDisplay } from '@/components/ui/RichContentDisplay';
import { buildPageMetadata } from '@/seo';

async function fetchCustomPage(slug: string, locale: string) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/custom-pages/by-slug/${encodeURIComponent(slug)}?locale=${locale}`,
      { next: { revalidate: 3600 } },
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
  const page = await fetchCustomPage(slug, locale);
  if (!page) return {};
  return buildPageMetadata({
    locale,
    pathname: `/pages/${slug}`,
    title: page.meta_title || page.title || slug,
    description: page.meta_description || page.summary || page.title || '',
  });
}

export default async function CustomPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const page = await fetchCustomPage(slug, locale);
  if (!page) notFound();

  const content = normalizeRichContent(page.content);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--color-carbon)] text-[var(--color-cream)]">
      <div className="gold-grid-bg pointer-events-none absolute inset-0 opacity-[0.1]" aria-hidden />

      <div className="section-py relative z-10">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <ContentPageHeader
            title={page.title}
            description={page.summary || ''}
          />
          {content && (
            <RichContentDisplay
              html={content}
              className="prose prose-theme mt-8 max-w-none"
            />
          )}
        </div>
      </div>
    </div>
  );
}
