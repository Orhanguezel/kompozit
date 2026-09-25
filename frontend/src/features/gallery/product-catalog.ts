import 'server-only';

import { API_BASE_URL, stripHtmlToText } from '@/lib/utils';

/**
 * Galerinin kaynagi urun katalogu olabilir (admin: `galleries.source_type`).
 * Bu durumda gorseller galeriye tek tek yuklenmez; aktif urunlerin fotograflarindan
 * turetilir. Yeni urun fotografi yuklendiginde galeri kendiliginden guncellenir.
 */
export const PRODUCT_CATALOG_SOURCE = 'product_catalog';

export type CatalogPhoto = {
  src: string;
  alt: string;
  productTitle: string;
  productSlug: string;
};

export type CatalogGroup = {
  name: string;
  slug: string | null;
  photos: CatalogPhoto[];
};

export type ProductCatalog = {
  groups: CatalogGroup[];
  photoCount: number;
  productCount: number;
};

type CatalogProductRow = {
  title?: string | null;
  slug?: string | null;
  alt?: string | null;
  image_url?: string | null;
  images?: unknown;
  category?: { name?: string | null; slug?: string | null } | string | null;
};

export function isProductCatalogGallery(gallery: { source_type?: unknown } | null | undefined): boolean {
  return gallery?.source_type === PRODUCT_CATALOG_SOURCE;
}

/** `/media/...` genel doku/stok gorselleridir; urunun kendisini gostermez. */
function isStockImage(url: string): boolean {
  return url.startsWith('/media/');
}

function imageList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === 'string' ? item : (item as { url?: unknown; image_url?: unknown })?.url ?? (item as { image_url?: unknown })?.image_url))
    .filter((url): url is string => typeof url === 'string' && url.trim().length > 0)
    .map((url) => url.trim());
}

/**
 * Urun satirlarindan (onem sirasiyla gelir) kategori gruplu fotograf listesi uretir.
 *
 * Bir gorsel bir urunun altinda yalnizca su durumda gosterilir:
 * - o urunun kapak gorselidir, ya da
 * - yalnizca o urunde kullanilir ve baska bir urunun kapagi degildir.
 * Birden fazla urune dolgu olarak eklenmis malzeme/proses gorselleri boylece elenir.
 * Kapagi stok gorsel olan urunlerin gercek fotografi yoktur; katalogda yer almaz.
 * Her gorsel en fazla bir kez gosterilir.
 */
export function buildProductCatalog(rows: CatalogProductRow[], locale: string): ProductCatalog {
  const usage = new Map<string, number>();
  for (const row of rows) {
    for (const url of new Set([String(row.image_url ?? '').trim(), ...imageList(row.images)])) {
      if (url) usage.set(url, (usage.get(url) ?? 0) + 1);
    }
  }

  const products = rows.filter((row) => {
    const cover = String(row.image_url ?? '').trim();
    return row.slug && row.title && cover && !isStockImage(cover);
  });
  const covers = new Set(products.map((row) => String(row.image_url).trim()));

  const photoWord = locale.startsWith('en') ? 'photo' : 'fotoğraf';
  const groups = new Map<string, CatalogGroup>();
  const seen = new Set<string>();
  let productCount = 0;

  for (const row of products) {
    const cover = String(row.image_url).trim();
    const title = stripHtmlToText(row.title);
    const slug = String(row.slug);
    const photos: CatalogPhoto[] = [];

    for (const url of new Set([cover, ...imageList(row.images)])) {
      if (isStockImage(url) || seen.has(url)) continue;
      const own = url === cover || ((usage.get(url) ?? 0) === 1 && !covers.has(url));
      if (!own) continue;
      seen.add(url);
      const alt = url === cover && row.alt ? stripHtmlToText(row.alt) : `${title} — ${photoWord} ${photos.length + 1}`;
      photos.push({ src: url, alt, productTitle: title, productSlug: slug });
    }
    if (photos.length === 0) continue;
    productCount += 1;

    const category = typeof row.category === 'object' && row.category ? row.category : null;
    const name = String((category?.name ?? (typeof row.category === 'string' ? row.category : '')) || '').trim() || title;
    const key = name.toLowerCase();
    const group = groups.get(key) ?? { name, slug: String(category?.slug ?? '').trim() || null, photos: [] };
    group.photos.push(...photos);
    groups.set(key, group);
  }

  const list = [...groups.values()];
  return { groups: list, photoCount: list.reduce((sum, g) => sum + g.photos.length, 0), productCount };
}

export async function fetchProductCatalog(locale: string): Promise<ProductCatalog> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/products?item_type=kompozit&is_active=1&locale=${encodeURIComponent(locale)}&limit=200&sort=order_num&order=desc`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return { groups: [], photoCount: 0, productCount: 0 };
    const data = await res.json();
    const rows = (Array.isArray(data) ? data : (data as { items?: unknown[] })?.items ?? []) as CatalogProductRow[];
    return buildProductCatalog(rows, locale);
  } catch {
    return { groups: [], photoCount: 0, productCount: 0 };
  }
}

/** Liste/ana sayfa kartlari icin: urun katalogu galerisinin kapagi ilk urun fotografidir. */
export async function withCatalogCovers<T extends { source_type?: unknown }>(galleries: T[], locale: string): Promise<T[]> {
  if (!galleries.some(isProductCatalogGallery)) return galleries;
  const catalog = await fetchProductCatalog(locale);
  const first = catalog.groups[0]?.photos[0];
  if (!first) return galleries;
  return galleries.map((gallery) =>
    isProductCatalogGallery(gallery)
      ? { ...gallery, cover_image_url: first.src, cover_image_alt: first.alt, image_count: catalog.photoCount }
      : gallery,
  );
}
