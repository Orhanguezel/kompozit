const API_BASE = (process.env.SMOKE_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8086/api').replace(/\/$/, '');
const LOCALES = ['tr', 'en'];
const KEYS = ['home.hero', 'home.metrics', 'home.value_props'];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function fetchSetting(key, locale) {
  const url = new URL(`${API_BASE}/site_settings/${encodeURIComponent(key)}`);
  url.searchParams.set('locale', locale);
  url.searchParams.set('prefix', 'kompozit__');

  const res = await fetch(url);
  assert(res.ok, `Failed to fetch ${key} (${locale}): ${res.status}`);
  const data = await res.json();
  return data?.value ?? null;
}

function validateHero(value, locale) {
  assert(value && typeof value === 'object' && !Array.isArray(value), `home.hero must be object (${locale})`);
  for (const field of [
    'badge',
    'title',
    'subtitle',
    'primaryCtaLabel',
    'primaryCtaHref',
    'secondaryCtaLabel',
    'secondaryCtaHref',
    'workflowLabel',
    'workflowTitle',
    'workflowBadgeTitle',
    'workflowBadgeSubtitle',
  ]) {
    assert(typeof value[field] === 'string' && value[field].trim(), `home.hero.${field} missing (${locale})`);
  }
}

function validateMetrics(value, locale) {
  assert(value && typeof value === 'object' && !Array.isArray(value), `home.metrics must be object (${locale})`);
  assert(Array.isArray(value.items) && value.items.length === 3, `home.metrics.items must have 3 entries (${locale})`);
  assert(Array.isArray(value.workflowSteps) && value.workflowSteps.length === 3, `home.metrics.workflowSteps must have 3 entries (${locale})`);
  assert(Array.isArray(value.stats) && value.stats.length === 2, `home.metrics.stats must have 2 entries (${locale})`);
}

function validateValueProps(value, locale) {
  assert(value && typeof value === 'object' && !Array.isArray(value), `home.value_props must be object (${locale})`);
  assert(typeof value.sectionLabel === 'string' && value.sectionLabel.trim(), `home.value_props.sectionLabel missing (${locale})`);
  assert(typeof value.title === 'string' && value.title.trim(), `home.value_props.title missing (${locale})`);
  assert(typeof value.subtitle === 'string' && value.subtitle.trim(), `home.value_props.subtitle missing (${locale})`);
  assert(Array.isArray(value.items) && value.items.length >= 4, `home.value_props.items must have at least 4 entries (${locale})`);
}

async function main() {
  for (const locale of LOCALES) {
    const [hero, metrics, valueProps] = await Promise.all(KEYS.map((key) => fetchSetting(key, locale)));
    validateHero(hero, locale);
    validateMetrics(metrics, locale);
    validateValueProps(valueProps, locale);
  }

  console.log(`Home content smoke check passed against ${API_BASE} for locales: ${LOCALES.join(', ')}`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exitCode = 1;
});
