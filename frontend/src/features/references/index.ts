import 'server-only';

import { API_BASE_URL } from '@/lib/utils';

export type PublicReference = {
  id?: string;
  title: string;
  slug?: string;
  summary?: string;
  website_url?: string | null;
  featured_image?: string | null;
  featured_image_alt?: string | null;
  is_featured?: boolean;
  locale_resolved?: string;
};

export async function fetchReferences(
  locale: string,
  options?: { limit?: number; featuredOnly?: boolean; revalidate?: number },
): Promise<PublicReference[]> {
  try {
    const params = new URLSearchParams({
      locale,
      limit: String(options?.limit ?? 12),
      sort: 'display_order',
      orderDir: 'asc',
    });

    if (options?.featuredOnly) params.set('is_featured', '1');

    const res = await fetch(`${API_BASE_URL}/references?${params.toString()}`, {
      next: { revalidate: options?.revalidate ?? 300 },
    });

    if (!res.ok) return [];

    const data = await res.json();
    return Array.isArray(data) ? (data as PublicReference[]) : ((data as any)?.items ?? []);
  } catch {
    return [];
  }
}
