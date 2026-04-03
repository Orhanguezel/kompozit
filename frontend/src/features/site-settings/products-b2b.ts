import 'server-only';

import { getTranslations } from 'next-intl/server';

import { fetchSetting } from '@/i18n/server';

type ProductB2bFeature = {
  title: string;
  desc: string;
};

export type ProductsB2bContent = {
  catalogEyebrow: string;
  catalogTitle: string;
  catalogBody: string;
  requestQuote: string;
  talkToEngineering: string;
  detailEyebrow: string;
  detailTitle: string;
  detailBody: string;
  reliability: ProductB2bFeature;
  engineering: ProductB2bFeature;
  speed: ProductB2bFeature;
  logistics: ProductB2bFeature;
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function asObject(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function normalizeFeature(value: unknown): ProductB2bFeature | null {
  const source = asObject(value);
  if (!source) return null;

  const feature = {
    title: String(source.title ?? '').trim(),
    desc: String(source.desc ?? '').trim(),
  };

  return isNonEmptyString(feature.title) && isNonEmptyString(feature.desc) ? feature : null;
}

function normalizeProductsB2b(value: unknown): Partial<ProductsB2bContent> | null {
  const source = asObject(value);
  if (!source) return null;

  const reliability = normalizeFeature(source.reliability);
  const engineering = normalizeFeature(source.engineering);
  const speed = normalizeFeature(source.speed);
  const logistics = normalizeFeature(source.logistics);

  return {
    catalogEyebrow: String(source.catalogEyebrow ?? '').trim(),
    catalogTitle: String(source.catalogTitle ?? '').trim(),
    catalogBody: String(source.catalogBody ?? '').trim(),
    requestQuote: String(source.requestQuote ?? '').trim(),
    talkToEngineering: String(source.talkToEngineering ?? '').trim(),
    detailEyebrow: String(source.detailEyebrow ?? '').trim(),
    detailTitle: String(source.detailTitle ?? '').trim(),
    detailBody: String(source.detailBody ?? '').trim(),
    ...(reliability ? { reliability } : {}),
    ...(engineering ? { engineering } : {}),
    ...(speed ? { speed } : {}),
    ...(logistics ? { logistics } : {}),
  };
}

export async function fetchProductsB2bContent(locale: string): Promise<ProductsB2bContent> {
  const t = await getTranslations({ locale, namespace: 'products' });
  const row = await fetchSetting('products.b2b', locale, { revalidate: 300 });
  const source = normalizeProductsB2b(row?.value) ?? {};

  return {
    catalogEyebrow: isNonEmptyString(source.catalogEyebrow)
      ? source.catalogEyebrow
      : t('b2b.catalogEyebrow'),
    catalogTitle: isNonEmptyString(source.catalogTitle) ? source.catalogTitle : t('b2b.catalogTitle'),
    catalogBody: isNonEmptyString(source.catalogBody) ? source.catalogBody : t('b2b.catalogBody'),
    requestQuote: isNonEmptyString(source.requestQuote)
      ? source.requestQuote
      : t('b2b.requestQuote'),
    talkToEngineering: isNonEmptyString(source.talkToEngineering)
      ? source.talkToEngineering
      : t('b2b.talkToEngineering'),
    detailEyebrow: isNonEmptyString(source.detailEyebrow)
      ? source.detailEyebrow
      : t('b2b.detailEyebrow'),
    detailTitle: isNonEmptyString(source.detailTitle) ? source.detailTitle : t('b2b.detailTitle'),
    detailBody: isNonEmptyString(source.detailBody) ? source.detailBody : t('b2b.detailBody'),
    reliability: source.reliability ?? {
      title: t('b2b.reliability.title'),
      desc: t('b2b.reliability.desc'),
    },
    engineering: source.engineering ?? {
      title: t('b2b.engineering.title'),
      desc: t('b2b.engineering.desc'),
    },
    speed: source.speed ?? {
      title: t('b2b.speed.title'),
      desc: t('b2b.speed.desc'),
    },
    logistics: source.logistics ?? {
      title: t('b2b.logistics.title'),
      desc: t('b2b.logistics.desc'),
    },
  };
}
