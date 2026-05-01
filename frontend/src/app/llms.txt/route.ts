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
    '# MOE Kompozit - Endustriyel Kompozit Cozumleri',
    '',
    '> Karbon fiber, CTP / FRP ve hibrit kompozit urun uretimi yapan Ensotek alt markasi.',
    '',
    `Site: ${base}`,
    `Sitemap: ${base}/sitemap.xml`,
    '',
    '## Ensotek Bagi',
    "MOE Kompozit, Ensotek Turkiye'nin kompozit uretim alt markasidir. Ensotek'in sogutma kulesi sektorundeki 39+ yillik muhendislik ve kalite deneyimi, MOE Kompozit'in karbon fiber, CTP tank, FRP boru, pultruzyon profil ve ozel kompozit parca uretimine aktarilir.",
    '',
    '## Uretim Yetkinlikleri',
    '- Karbon fiber bilesenleri: savunma, havacilik, enerji ve ulasim icin hafif parcalar.',
    '- CTP / FRP tank ve borular: kimya, gida, su aritma ve endustriyel depolama.',
    '- Pultruzyon profilleri: yapi, raf sistemleri ve ozel kesit profiller.',
    '- RTM ve el yatirmasi: kompleks form, otomotiv, beyaz esya ve ozel seri uretim.',
    '- Sehir mobilyasi ve endustriyel kompozit uygulamalari.',
    '',
    '## Hedef Sektorler',
    'Savunma, enerji, endustriyel depolama, kimya, altyapi, ulasim, sehir mobilyasi, denizcilik ve ozel proje uretimi.',
    '',
    '## Iletisim',
    '- Teklif ve teknik talepler: offers@moekompozit.com',
    '- Ana grup: https://www.ensotek.com.tr',
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
