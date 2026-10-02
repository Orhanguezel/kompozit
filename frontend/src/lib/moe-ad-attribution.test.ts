import { expect, test } from 'bun:test';
import { getMoeAdAttribution, withMoeAdAttribution } from './moe-ad-attribution';

test('MOE click IDs require separate advertising consent and clear on withdrawal', () => {
  const values = new Map<string, string>();
  const store = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value); }, removeItem: (key: string) => { values.delete(key); } };
  const session = new Map<string, string>();
  const sessionStore = { getItem: (key: string) => session.get(key) ?? null, setItem: (key: string, value: string) => { session.set(key, value); }, removeItem: (key: string) => { session.delete(key); } };
  Object.assign(globalThis, { localStorage: store, sessionStorage: sessionStore, window: { location: { search: '?gclid=GCLID_123456&utm_source=google' } } });
  expect(getMoeAdAttribution()).toBeUndefined();
  expect(session.size).toBe(0);
  values.set('ensotek.analytics-consent.v1', JSON.stringify({ value: 'granted', advertising: false, expires: Date.now() + 60000 }));
  expect(getMoeAdAttribution()).toBeUndefined();
  values.set('ensotek.analytics-consent.v1', JSON.stringify({ value: 'granted', advertising: true, expires: Date.now() + 60000 }));
  expect(withMoeAdAttribution({ form_data: { product: 'planter' } }, false).form_data?.ad_attribution).toBeUndefined();
  const enriched = withMoeAdAttribution({ form_data: { product: 'planter' } }, true);
  expect(enriched.form_data?.product).toBe('planter');
  expect(enriched.form_data?.ad_attribution).toEqual({ consent: true, consentVersion: 'ensotek.analytics-consent.v1', formConsentVersion: 'moe-offer-ads-v1', gclid: 'GCLID_123456' });
  (globalThis.window as any).location.search = '';
  expect(getMoeAdAttribution()?.gclid).toBe('GCLID_123456');
  values.set('ensotek.analytics-consent.v1', JSON.stringify({ value: 'denied', advertising: false, expires: Date.now() + 60000 }));
  expect(getMoeAdAttribution()).toBeUndefined();
  expect(session.size).toBe(0);
});
