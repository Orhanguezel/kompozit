import 'server-only';

import { API_BASE_URL } from '@/lib/utils';

import { KOMPOZIT_SOLUTIONS_MODULE_KEY } from './solutions.constants';

export async function fetchSolutions(locale: string) {
  try {
    const qs = new URLSearchParams({
      module_key: KOMPOZIT_SOLUTIONS_MODULE_KEY,
      is_published: '1',
      locale,
      limit: '50',
      sort: 'display_order',
      orderDir: 'asc',
    });
    const res = await fetch(`${API_BASE_URL}/custom_pages?${qs.toString()}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data as { items?: unknown[] })?.items ?? [];
  } catch {
    return [];
  }
}

export async function fetchSolutionBySlug(slug: string, locale: string) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/custom_pages/by-slug/${encodeURIComponent(slug)}?locale=${encodeURIComponent(locale)}`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return null;
    const row = await res.json();
    if (!row || row.module_key !== KOMPOZIT_SOLUTIONS_MODULE_KEY) return null;
    return row;
  } catch {
    return null;
  }
}
