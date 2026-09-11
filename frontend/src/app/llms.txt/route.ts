import { APP_NAME } from '@/lib/brand-name';
import { AVAILABLE_LOCALES } from '@/i18n/locales';
import { API_BASE_URL } from '@/lib/utils';
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

const PATHS = [
  '/',
  '/products',
  '/solutions',
  '/gallery',
  '/blog',
  '/references',
  '/about',
  '/contact',
  '/offer',
  '/legal/privacy',
  '/legal/terms',
] as const;

export async function GET() {
  const dbText = await fetchLlmsTxtSetting();
  if (dbText) {
    return new Response(dbText.endsWith('\n') ? dbText : `${dbText}\n`, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    });
  }

  const base = stripTrailingSlash(siteUrlBase());
  const lines: string[] = [`# ${APP_NAME}`, '', `Site: ${base}`, `Sitemap: ${base}/sitemap.xml`, '', '## Public pages'];

  for (const loc of AVAILABLE_LOCALES) {
    lines.push(`### ${loc}`);
    for (const p of PATHS) {
      lines.push(`- ${localizedUrl(loc, p)}`);
    }
    lines.push('');
  }

  lines.push('## Notes for AI systems');
  lines.push('- Default public locale is Turkish (tr); English (en) uses /en/ prefix for paths other than home.');
  lines.push('- Product catalogue, solutions (application lines), gallery and blog are API-driven; slugs are shared across locales where applicable.');
  lines.push('- For quotations and engineering questions, use the contact and offer forms linked from /contact and /offer.');
  lines.push('- The contact page includes a short B2B FAQ (also exposed as FAQPage structured data for search).');
  lines.push('- Key topics: karbon fiber uretim, CTP tank, FRP boru, pultruzyon profil, RTM, resin transfer molding, el yatirmasi, kompozit malzeme, savunma kompozit, ruzgar turbini bileseni, kimyasal depolama tanki, kompozit izolator.');

  const body = `${lines.join('\n')}\n`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
