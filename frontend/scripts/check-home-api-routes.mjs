/**
 * HEAD/GET smoke: ana sayfa ve layout'un kullandığı public API uçları 200 dönmeli.
 *
 *   node scripts/check-home-api-routes.mjs
 *   node scripts/check-home-api-routes.mjs --offline
 *
 * Env: SMOKE_API_BASE_URL | NEXT_PUBLIC_API_URL | http://127.0.0.1:8086/api
 */
const API_BASE = (process.env.SMOKE_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8086/api').replace(
  /\/$/,
  '',
);
const offline = process.argv.includes('--offline') || process.env.SMOKE_HOME_API_OFFLINE === '1';
const LOCALES = ['tr', 'en'];

const SITE_SETTING_KEYS = [
  'home.hero',
  'home.metrics',
  'home.value_props',
  'home.stats',
  'home.testimonial',
  'home.about',
  'contact_info',
];

function assert(ok, msg) {
  if (!ok) throw new Error(msg);
}

async function checkOk(url, label) {
  let res;
  try {
    res = await fetch(url, { method: 'GET', redirect: 'manual' });
  } catch (e) {
    assert(false, `${label}: fetch failed — ${e?.message || e}`);
  }
  assert(res.ok, `${label}: HTTP ${res.status} — ${url}`);
}

async function main() {
  if (offline) {
    console.log('Home API routes check skipped (--offline).');
    return;
  }

  for (const locale of LOCALES) {
    for (const key of SITE_SETTING_KEYS) {
      const u = new URL(`${API_BASE}/site_settings/${encodeURIComponent(key)}`);
      u.searchParams.set('locale', locale);
      u.searchParams.set('prefix', 'kompozit__');
      await checkOk(u.toString(), `site_settings ${key} (${locale})`);
    }

    const products = new URL(`${API_BASE}/products`);
    products.searchParams.set('item_type', 'kompozit');
    products.searchParams.set('is_active', '1');
    products.searchParams.set('locale', locale);
    products.searchParams.set('limit', '6');
    await checkOk(products.toString(), `products (${locale})`);

    const galleries = new URL(`${API_BASE}/galleries`);
    galleries.searchParams.set('module_key', 'kompozit');
    galleries.searchParams.set('is_active', '1');
    galleries.searchParams.set('locale', locale);
    galleries.searchParams.set('limit', '6');
    await checkOk(galleries.toString(), `galleries (${locale})`);

    const blog = new URL(`${API_BASE}/custom_pages`);
    blog.searchParams.set('module_key', 'kompozit_blog');
    blog.searchParams.set('is_active', '1');
    blog.searchParams.set('locale', locale);
    blog.searchParams.set('limit', '3');
    await checkOk(blog.toString(), `custom_pages blog (${locale})`);
  }

  for (const locale of LOCALES) {
    const menu = new URL(`${API_BASE}/menu-items`);
    menu.searchParams.set('locale', locale);
    menu.searchParams.set('is_active', '1');
    menu.searchParams.set('site_id', 'kompozit');
    await checkOk(menu.toString(), `menu-items (${locale})`);

    const footer = new URL(`${API_BASE}/footer-sections`);
    footer.searchParams.set('locale', locale);
    footer.searchParams.set('is_active', '1');
    footer.searchParams.set('site_id', 'kompozit');
    await checkOk(footer.toString(), `footer-sections (${locale})`);
  }

  console.log(`Home API routes OK — ${API_BASE}`);
}

main().catch((err) => {
  console.error(err.message || err);
  console.error('\nTip: backend yoksa: node scripts/check-home-api-routes.mjs --offline');
  process.exitCode = 1;
});
