import { APP_NAME } from '@/lib/brand-name';
import { AVAILABLE_LOCALES } from '@/i18n/locales';
import { API_BASE_URL } from '@/lib/utils';
import { fetchAllPageSeo, type PageSeoKey } from '@/seo/page-settings';
import { localizedUrl, siteUrlBase, stripTrailingSlash } from '@/seo/helpers';

export const revalidate = 86400;

async function fetchLlmsTxtSetting(): Promise<string | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/site_settings/kompozit__llms_txt?locale=tr`, {
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const val = data?.value ?? data?.setting?.value;
    return typeof val === 'string' && val.trim() ? val : null;
  } catch {
    return null;
  }
}

/**
 * The panel text is authored independently and historically repeated the
 * `Site:` / `Sitemap:` lines this route emits from the canonical origin.
 * Two conflicting copies (www and apex) confuse the readers llms.txt exists
 * for, so the generated pair wins and the authored duplicates are dropped.
 */
function stripDuplicateOrigins(text: string): string {
  return text
    .split('\n')
    .filter((line) => !/^\s*(site|sitemap)\s*:/i.test(line))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** Paths listed for every locale, mapped to the `seo_pages` entry that names them. */
const PAGES: ReadonlyArray<{ path: string; key: PageSeoKey; fallbackLabel: string }> = [
  { path: '/', key: 'home', fallbackLabel: 'Home' },
  { path: '/products', key: 'products', fallbackLabel: 'Products' },
  { path: '/solutions', key: 'solutions', fallbackLabel: 'Solutions' },
  { path: '/gallery', key: 'gallery', fallbackLabel: 'Gallery' },
  { path: '/blog', key: 'blog', fallbackLabel: 'Blog' },
  { path: '/references', key: 'references', fallbackLabel: 'References' },
  { path: '/about', key: 'about', fallbackLabel: 'About' },
  { path: '/contact', key: 'contact', fallbackLabel: 'Contact' },
  { path: '/offer', key: 'offer', fallbackLabel: 'Request a quote' },
  { path: '/legal/privacy', key: 'legal', fallbackLabel: 'Privacy policy' },
  { path: '/legal/terms', key: 'legal', fallbackLabel: 'Terms of use' },
];

/** llms.txt entries are one line each; collapse whitespace and cap the description. */
function oneLine(value: string, maxLength = 160): string {
  const flat = value.replace(/\s+/g, ' ').trim();
  if (flat.length <= maxLength) return flat;
  return `${flat.slice(0, maxLength - 1).trimEnd()}…`;
}

export async function GET() {
  const base = stripTrailingSlash(siteUrlBase());
  const primaryLocale = AVAILABLE_LOCALES[0] ?? 'tr';
  const [dbText, ...seoByLocale] = await Promise.all([
    fetchLlmsTxtSetting(),
    ...AVAILABLE_LOCALES.map((loc) => fetchAllPageSeo(loc)),
  ]);

  const authored = dbText?.trim() ? stripDuplicateOrigins(dbText) : `# ${APP_NAME}`;
  const lines: string[] = [
    authored,
    '',
    `Site: ${base}`,
    `Sitemap: ${base}/sitemap.xml`,
    '',
  ];

  // Key facts: the audited llms.txt structure expects an about/key-facts block.
  // Everything here is read from the managed home entry — nothing is invented.
  const primarySeo = seoByLocale[0] ?? {};
  const homeEntry = primarySeo.home;
  if (homeEntry?.description) {
    lines.push('## Key facts');
    lines.push(`- ${oneLine(homeEntry.description, 240)}`);
    lines.push(`- Languages: ${AVAILABLE_LOCALES.join(', ')}`);
    lines.push(`- Company profile: ${localizedUrl(primaryLocale, '/about')}`);
    lines.push(`- Quotation requests: ${localizedUrl(primaryLocale, '/offer')}`);
    lines.push('');
  }

  lines.push('## Public pages');
  AVAILABLE_LOCALES.forEach((loc, index) => {
    const seo = seoByLocale[index] ?? {};
    lines.push(`### ${loc}`);
    for (const page of PAGES) {
      const entry = seo[page.key];
      const label = oneLine(entry?.title || page.fallbackLabel, 90);
      const url = localizedUrl(loc, page.path);
      // Legal pages share one `seo_pages` entry, so its description would repeat
      // on both; the distinct fallback label already identifies them.
      const describable = page.key !== 'legal';
      const description = describable && entry?.description ? oneLine(entry.description) : '';
      lines.push(description ? `- [${label}](${url}): ${description}` : `- [${label}](${url})`);
    }
    lines.push('');
  });

  lines.push('## Notes for AI systems');
  lines.push(`- Default public locale is ${primaryLocale}; every locale is served under its own /<locale> prefix, including the home page.`);
  lines.push('- Product catalogue, solutions (application lines), gallery and blog are API-driven; slugs are shared across locales where applicable.');
  lines.push('- For quotations and engineering questions, use the contact and offer forms linked from /contact and /offer.');
  lines.push('- The contact and offer pages include a short B2B FAQ, also exposed as FAQPage structured data.');

  const body = `${lines.join('\n')}\n`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
