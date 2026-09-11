/** Read-only API -> sitemap -> HTML regression for published translations. */
import assert from 'node:assert/strict';
const origin = (process.env.CHECK_ORIGIN || 'https://www.karbonkompozit.com.tr').replace(/\/$/, '');
const publicOrigin = (process.env.PUBLIC_ORIGIN || 'https://www.karbonkompozit.com.tr').replace(/\/$/, '');
const api = process.env.CHECK_API || `${publicOrigin}/api`;
const locales = ['tr', 'en'];
const sources = [
  {section:'blog', endpoint:'custom-pages', filters:{module_key:'kompozit_blog',is_published:'1'}},
  {section:'products', endpoint:'products', filters:{item_type:'kompozit',is_active:'1'}},
];
async function get(url) {
  const res = await fetch(url, {signal:AbortSignal.timeout(30000),redirect:'manual'});
  assert.equal(res.status,200,`${url}: HTTP ${res.status}`);return res;
}
const xml = await (await get(`${origin}/sitemap.xml`)).text();
const blocks = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(m=>m[1]);
function translatedLinks(markup) {
 return [...markup.matchAll(/<(?:xhtml:)?link\b[^>]*>/g)].map(m=>Object.fromEntries([...m[0].matchAll(/([a-z-]+)="([^"]*)"/gi)].map(a=>[a[1].toLowerCase(),a[2]])));
}
let checked=0;
for (const source of sources) {
 const inventory = {};
 for(const locale of locales) {
  const records=[]; const seen=new Set();
  for(let offset=0;offset<10000;offset+=200) {
   const query=new URLSearchParams({...source.filters,locale,language:locale,limit:'200',offset:String(offset)});
   const json=await (await get(`${api}/${source.endpoint}?${query}`)).json();
   const rows=Array.isArray(json)?json:json.data;assert.ok(Array.isArray(rows),'Invalid API response');
   for(const row of rows) {assert.ok(!seen.has(row.id),'Pagination repeated ID');seen.add(row.id);records.push(row);}
   if(rows.length<200)break;
   assert.ok(offset<9800,'Pagination exhausted');
  }
  inventory[locale]=records.filter(r=>r.slug&&r.id&&(!r.locale||r.locale===locale)&&r.is_active!==0&&r.is_active!==false&&r.is_published!==0&&r.is_published!==false);
  assert.ok(inventory[locale].length,`Unexpected empty ${source.section}/${locale}`);
 }
 for(const locale of locales) for(const row of inventory[locale]) {
  const path=`/${locale}/${source.section}/${row.slug}`, expected=publicOrigin+path;
  const block=blocks.find(b=>b.includes(`<loc>${expected}</loc>`));assert.ok(block,`Missing sitemap URL ${expected}`);
  const html=await (await get(origin+path)).text();
  const canonical=html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/i)?.[1];
  assert.equal(decodeURI(canonical||''),decodeURI(expected),`Wrong canonical ${expected}`);
  for(const other of locales) {
   const translation=inventory[other].find(r=>r.id===row.id);if(!translation)continue;
   const target=`${publicOrigin}/${other}/${source.section}/${translation.slug}`;
   assert.ok(translatedLinks(block).some(l=>l.hreflang===other&&l.href===target),`Sitemap lacks translated ID target ${target}`);
   assert.ok(translatedLinks(html).some(l=>l.hreflang===other&&l.href===target),`HTML lacks translated ID target ${target}`);
  }
  checked++;
 }
}
console.log(`API/sitemap/HTML translation regression passed: ${checked} published detail URLs`);
