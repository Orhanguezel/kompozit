const ORDER = ['linkedin', 'instagram', 'youtube'] as const;

export type FooterSocialNavItem = {
  id: (typeof ORDER)[number];
  href: string;
};

function normalizeHref(raw: string): string | null {
  const v = raw.trim();
  if (!v) return null;
  if (v.startsWith('http://') || v.startsWith('https://')) return v;
  return `https://${v.replace(/^\/+/, '')}`;
}

/** Maps site_settings `socials` (admin structured form) to footer nav items. */
export function buildFooterSocialNavFromSetting(value: unknown): FooterSocialNavItem[] {
  const o =
    value && typeof value === 'object' && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};
  return ORDER.map((id) => ({
    id,
    href: normalizeHref(String(o[id] ?? '')),
  })).filter((item): item is FooterSocialNavItem => Boolean(item.href));
}
