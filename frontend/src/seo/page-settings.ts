import 'server-only';

import type { Metadata } from 'next';

import { fetchSetting } from '@/i18n/server';
import { resolvePublicAssetUrl } from '@/lib/utils';

import { buildPageMetadata } from './helpers';

export type PageSeoKey =
  | 'home'
  | 'about'
  | 'contact'
  | 'products'
  | 'product-detail'
  | 'solutions'
  | 'solution-detail'
  | 'gallery'
  | 'gallery-detail'
  | 'references'
  | 'blog'
  | 'blog-post'
  | 'offer'
  | 'legal';

export type PageSeoEntry = {
  title: string;
  description: string;
  og_image: string;
  no_index: boolean;
};

const EMPTY_ENTRY: PageSeoEntry = { title: '', description: '', og_image: '', no_index: false };

function asObject(input: unknown): Record<string, unknown> {
  return typeof input === 'object' && input !== null && !Array.isArray(input)
    ? (input as Record<string, unknown>)
    : {};
}

function coerceJson(value: unknown): unknown {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (!(trimmed.startsWith('{') || trimmed.startsWith('['))) return value;
  try {
    return JSON.parse(trimmed);
  } catch {
    return value;
  }
}

function readEntry(raw: unknown, pageKey: PageSeoKey): PageSeoEntry {
  const settingValue = coerceJson(asObject(raw).value);
  const pages = asObject(settingValue);
  const entry = asObject(pages[pageKey]);
  return {
    title: typeof entry.title === 'string' ? entry.title : '',
    description: typeof entry.description === 'string' ? entry.description : '',
    og_image: typeof entry.og_image === 'string' ? entry.og_image : '',
    no_index: Boolean(entry.no_index),
  };
}

/**
 * Reads a single page's SEO entry from the locale-scoped `seo_pages`
 * site setting, falling back to the global ('*') row if the locale
 * row is missing. Returns an entry with empty strings when absent;
 * callers decide their own translation/code fallback.
 */
export async function fetchPageSeo(
  locale: string,
  pageKey: PageSeoKey,
): Promise<PageSeoEntry> {
  const localized = await fetchSetting('seo_pages', locale);
  const localeEntry = readEntry(localized, pageKey);
  if (localeEntry.title || localeEntry.description || localeEntry.og_image || localeEntry.no_index) {
    return localeEntry;
  }
  const global = await fetchSetting('seo_pages', '*');
  const globalEntry = readEntry(global, pageKey);
  if (globalEntry.title || globalEntry.description || globalEntry.og_image || globalEntry.no_index) {
    return globalEntry;
  }
  return EMPTY_ENTRY;
}

export type PageMetadataInput = {
  locale: string;
  pathname: string;
  pageKey: PageSeoKey;
  fallback: { title: string; description: string };
  ogImage?: string | null;
  noIndex?: boolean;
  openGraphType?: 'website' | 'article';
  includeLocaleAlternates?: boolean;
  authorName?: string;
  publisherName?: string;
};

/**
 * Builds Next.js Metadata using the admin-managed `seo_pages` setting,
 * with a translation/code fallback supplied by the caller. The fallback
 * keeps the site rendering when the DB row is empty.
 */
export async function buildPageMetadataFromSettings(input: PageMetadataInput): Promise<Metadata> {
  const entry = await fetchPageSeo(input.locale, input.pageKey);

  const title = entry.title || input.fallback.title;
  const description = entry.description || input.fallback.description;
  const ogFromEntry = entry.og_image ? resolvePublicAssetUrl(entry.og_image) ?? entry.og_image : '';
  const ogImage = ogFromEntry || input.ogImage || undefined;
  const noIndex = entry.no_index || input.noIndex || false;

  return buildPageMetadata({
    locale: input.locale,
    pathname: input.pathname,
    title,
    description,
    ogImage,
    noIndex,
    openGraphType: input.openGraphType,
    includeLocaleAlternates: input.includeLocaleAlternates,
    authorName: input.authorName,
    publisherName: input.publisherName,
  });
}
