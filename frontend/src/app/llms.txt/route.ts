import { AVAILABLE_LOCALES } from '@/i18n/locales';
import { localizedUrl, siteUrlBase, stripTrailingSlash } from '@/seo/helpers';

export const revalidate = 86400;

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
  const base = stripTrailingSlash(siteUrlBase());
  const lines: string[] = [
    '# MOE Kompozit',
    '',
    'Industrial B2B manufacturer of carbon fiber, FRP/fiberglass (GRP) and composite parts: panels, enclosures, prototypes, custom series production and export-oriented delivery.',
    '',
    `Site: ${base}`,
    `Sitemap: ${base}/sitemap.xml`,
    '',
    '## Primary pages (localized)',
  ];

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

  const body = `${lines.join('\n')}\n`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
