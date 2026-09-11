import 'server-only';
import type { ProductCategoryPreview } from '@/lib/product-categories';
import { getLocaleSettings, API_BASE_URL } from './locale-settings';

type JsonLike = string | number | boolean | null | JsonLike[] | { [key: string]: JsonLike };
type SettingRow = { value: JsonLike } | null;

export async function fetchActiveLocales(): Promise<string[]> {
  const { activeLocales } = await getLocaleSettings();
  return activeLocales;
}

export async function getDefaultLocale(): Promise<string> {
  const { defaultLocale } = await getLocaleSettings();
  return defaultLocale;
}

export async function fetchSetting(
  key: string,
  locale: string,
  options?: { revalidate?: number },
): Promise<SettingRow> {
  try {
    const url = `${API_BASE_URL}/site_settings/${encodeURIComponent(key)}?locale=${encodeURIComponent(locale)}&prefix=kompozit__`;
    const res = await fetch(url, {
      next: { revalidate: options?.revalidate ?? 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data ?? null;
  } catch {
    return null;
  }
}

export async function fetchSliders(locale?: string): Promise<Record<string, unknown>[]> {
  try {
    const params = new URLSearchParams();
    if (locale) params.set('locale', locale);
    params.set('is_active', '1');
    const res = await fetch(`${API_BASE_URL}/sliders?${params}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data as any)?.items ?? [];
  } catch {
    return [];
  }
}

export async function fetchMenuItems(locale: string): Promise<Record<string, unknown>[]> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/menu_items?locale=${encodeURIComponent(locale)}&is_active=1&location=header&nested=1`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data as any)?.items ?? [];
  } catch {
    return [];
  }
}

export async function fetchProductCategories(locale: string): Promise<Record<string, unknown>[]> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/categories?module_key=kompozit&is_active=1&locale=${encodeURIComponent(locale)}`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data as any)?.items ?? [];
  } catch {
    return [];
  }
}

export async function fetchActiveProductCategoryPreviews(locale: string): Promise<ProductCategoryPreview[]> {
  try {
    const params = new URLSearchParams({
      item_type: 'kompozit',
      is_active: '1',
      locale,
      limit: '200',
      sort: 'order_num',
      order: 'desc',
    });
    const res = await fetch(`${API_BASE_URL}/products?${params}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const products: Array<{ category?: { id?: string; name?: string; slug?: string }; image_url?: string }> =
      Array.isArray(data) ? data : data?.items ?? [];
    const categories = new Map<string, ProductCategoryPreview>();
    for (const product of products) {
      const slug = String(product.category?.slug ?? '').trim();
      const id = String(product.category?.id ?? '').trim();
      const name = String(product.category?.name ?? '').trim();
      if (!id || !slug || !name) continue;
      const image = String(product.image_url ?? '').trim();
      if (!categories.has(id) || (!categories.get(id)?.image_url && image)) {
        categories.set(id, { id, name, slug, image_url: image });
      }
    }
    return [...categories.values()];
  } catch {
    return [];
  }
}

export async function fetchFooterSections(locale: string): Promise<Record<string, unknown>[]> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/footer_sections?locale=${encodeURIComponent(locale)}&is_active=1`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data as any)?.items ?? [];
  } catch {
    return [];
  }
}
