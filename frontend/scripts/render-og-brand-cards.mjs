import sharp from 'sharp';
import { mkdir, readFile, copyFile, readdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, join } from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const output = resolve(root, '../output/og-brand-refresh-2026-09-22');
const publicDir = join(root, 'public/og');
const art = join(output, 'backgrounds');
await mkdir(art, { recursive: true });
await mkdir(join(output, 'originals'), { recursive: true });
for (const f of await readdir(publicDir)) {
  if (f.endsWith('.png') || f.endsWith('.txt')) {
    await copyFile(join(publicDir, f), join(output, 'originals', f), 1).catch(e => { if (e.code !== 'EEXIST') throw e; });
  }
}
const sources = JSON.parse(await readFile(join(output, 'generated-sources.json'), 'utf8'));
for (const entry of sources) {
  await copyFile(entry.path, join(art, `${entry.key}.png`), 1).catch(e => { if (e.code !== 'EEXIST') throw e; });
}
const cards = [
  ['about', ['Hakkımızda'], ['About Us']],
  ['blog', ['Kompozit', 'Dünyasından'], ['Composite', 'Insights']],
  ['contact', ['İletişim'], ['Contact Us']],
  ['gallery-detail', ['Projeden', 'Detaylar'], ['Project', 'Highlights']],
  ['gallery', ['Üretim ve', 'Proje Galerisi'], ['Production &', 'Project Gallery']],
  ['legal', ['Yasal Bilgiler'], ['Legal Information']],
  ['offer', ['Projeniz İçin', 'Teklif Alın'], ['Request a', 'Project Quote']],
  ['product-detail', ['Ürün', 'Detayları'], ['Product', 'Details']],
  ['products', ['Kompozit', 'Ürünlerimiz'], ['Composite', 'Products']],
  ['references', ['Referanslarımız'], ['Our References']],
  ['solution-detail', ['Uygulamaya Özel', 'Çözümler'], ['Application-Specific', 'Solutions']],
];
const svg = body => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">${body}</svg>`);
const escape = s => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;');
const catalog = [];
for (const locale of ['tr', 'en']) {
  // Preserve official logo pixels. Only rearrange its existing wordmark to the right.
  const logoPath = join(root, `public/brand/moe-2026-09-09/logo-1-${locale}-dark-600.webp`);
  const split = locale === 'tr' ? 156 : 166;
  const monogram = await sharp(logoPath).extract({ left: 0, top: 0, width: 600, height: split }).resize(280).png().toBuffer();
  const wordmark = await sharp(logoPath).extract({ left: 0, top: split, width: 600, height: 220 - split }).resize(310).png().toBuffer();
  const horizontal = await sharp({ create: { width: 614, height: 80, channels: 4, background: '#00000000' } })
    .composite([{ input: monogram, left: 0, top: 0 }, { input: wordmark, left: 304, top: 27 }]).png().toBuffer();
  await writeFile(join(root, `public/brand/moe-2026-09-09/og-horizontal-${locale}.png`), horizontal);
  for (const [key, tr, en] of cards) {
    const lines = locale === 'en' ? en : tr;
    const size = Math.max(...lines.map(s => s.length)) > 18 ? 40 : 46;
    const subtitle = locale === 'en' ? 'Carbon Fiber · FRP · Fiberglass' : 'Karbon Fiber · CTP · Cam Elyaf';
    const type = svg(`<defs><linearGradient id="shade"><stop stop-color="#080a0c" stop-opacity=".5"/><stop offset=".6" stop-color="#080a0c" stop-opacity="0"/></linearGradient></defs><rect width="1200" height="630" fill="url(#shade)"/><g font-family="DejaVu Sans,sans-serif"><g font-size="${size}" fill="#fff" font-weight="700">${lines.map((line, i) => `<text x="48" y="${280 + i * 60}">${escape(line)}</text>`).join('')}</g><rect x="48" y="385" width="80" height="5" fill="#f36b21"/><text x="48" y="434" font-size="23" fill="#d2d6da">${escape(subtitle)}</text><text x="48" y="580" font-size="23" fill="#c3c8cc">karbonkompozit.com.tr</text></g>`);
    const name = `og-${key}${locale === 'en' ? '-en' : ''}.png`;
    await sharp(join(art, `${key}.png`)).resize(1200, 630, { fit: 'cover' }).composite([
      { input: type, left: 0, top: 0 },
      { input: await sharp(horizontal).resize(490).png().toBuffer(), left: 48, top: 54 },
    ]).png().toFile(join(publicDir, name));
    catalog.push({ key, locale, file: name, title: lines.join(' '), width: 1200, height: 630 });
  }
  const home = await sharp(join(art, `home-${locale}.png`)).resize(1200, 630).composite([
    { input: horizontal, left: 44, top: 27 },
  ]).png().toBuffer();
  const name = `og-home${locale === 'en' ? '-en' : ''}.png`;
  await writeFile(join(publicDir, name), home);
  await writeFile(join(publicDir, `moe-product-collage-v6-${locale}.png`), home);
  await writeFile(join(publicDir, `moe-product-collage-v5-${locale}.png`), home);
  if (locale === 'tr') for (const version of [1, 3]) await writeFile(join(publicDir, `moe-product-collage-v${version}.png`), home);
  catalog.push({ key: 'home', locale, file: name, title: locale === 'en' ? 'MOE Composite' : 'MOE Kompozit', width: 1200, height: 630 });
}
await writeFile(join(output, 'catalog.json'), JSON.stringify(catalog, null, 2) + '\n');
await writeFile(join(output, 'index.html'), `<!doctype html><html lang="tr"><meta charset="utf-8"><title>MOE OG — TR / EN</title><style>body{background:#101215;color:#eee;font:16px system-ui;margin:32px}main{display:grid;grid-template-columns:1fr 1fr;gap:24px}img{width:100%;border-radius:10px}figure{margin:0}figcaption{padding:8px}</style><h1>MOE OG kartları — Türkçe / English</h1><main>${cards.map(c => c[0]).concat('home').flatMap(key => catalog.filter(c => c.key === key)).map(c => `<figure><img src="../../frontend/public/og/${c.file}"><figcaption>${c.locale.toUpperCase()} — ${c.title}</figcaption></figure>`).join('')}</main></html>`);
console.log(`Rendered ${catalog.length} cards with official brand assets.`);
