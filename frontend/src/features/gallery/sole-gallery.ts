import 'server-only';

import { API_BASE_URL } from '@/lib/utils';

/**
 * Tek aktif galeri varsa liste sayfasi gereksizdir: /gallery dogrudan o galeriye
 * kalici yonlenir, sitemap/llms listeden cikar. Ikinci galeri acildiginda liste
 * sayfasi kendiliginden geri gelir. API hatasinda null (liste sayfasi korunur).
 */
export async function fetchSoleGallerySlug(locale: string): Promise<string | null> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/galleries?module_key=kompozit&is_active=1&locale=${encodeURIComponent(locale)}&limit=2`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return null;
    const data = await res.json();
    const rows = (Array.isArray(data) ? data : (data as { items?: unknown[] })?.items ?? []) as { slug?: unknown }[];
    return rows.length === 1 && typeof rows[0]?.slug === 'string' && rows[0].slug ? rows[0].slug : null;
  } catch {
    return null;
  }
}

/** `/gallery` adresi tek galeriye yonlenirken dogrudan o galeriyi gosterir (ara 308 adimi yok). */
export async function galleryPath(locale: string): Promise<string> {
  const sole = await fetchSoleGallerySlug(locale);
  return sole ? `/gallery/${sole}` : '/gallery';
}

/** Menu/footer kayitlarindaki `/gallery` ve `/{locale}/gallery` baglantilarini tek galeriye cevirir. */
export function pointGalleryLinks<T>(value: T, locale: string, sole: string | null): T {
  if (!sole) return value;
  const walk = (node: unknown): unknown => {
    if (Array.isArray(node)) return node.map(walk);
    if (!node || typeof node !== 'object') return node;
    const out: Record<string, unknown> = {};
    for (const [key, child] of Object.entries(node as Record<string, unknown>)) {
      if ((key === 'url' || key === 'href') && typeof child === 'string') {
        out[key] = child === '/gallery' ? `/gallery/${sole}`
          : child === `/${locale}/gallery` ? `/${locale}/gallery/${sole}`
          : child;
      } else {
        out[key] = walk(child);
      }
    }
    return out;
  };
  return walk(value) as T;
}
