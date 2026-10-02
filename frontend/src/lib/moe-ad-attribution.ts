'use client';

import { hasAdvertisingConsent } from '../../../../packages/shared-ui/public/components/analytics/ConsentGate';

const KEY = 'moe.ads-click.v1';
const FIELDS = ['gclid', 'gbraid', 'wbraid'] as const;
type ClickField = typeof FIELDS[number];
export type MoeAdAttribution = { consent: true; consentVersion: 'ensotek.analytics-consent.v1'; formConsentVersion: 'moe-offer-ads-v1' } & Partial<Record<ClickField, string>>;

function safeClickId(raw: string | null): string | undefined {
  const value = (raw || '').trim();
  return /^[A-Za-z0-9._~-]{6,500}$/.test(value) ? value : undefined;
}

export function clearMoeAdClick() {
  try { sessionStorage.removeItem(KEY); } catch { /* Optional storage. */ }
}

/** Only reads/stores click IDs after the separate advertising choice is granted. */
export function getMoeAdAttribution(): MoeAdAttribution | undefined {
  if (typeof window === 'undefined') return;
  if (!hasAdvertisingConsent()) { clearMoeAdClick(); return; }
  const params = new URLSearchParams(window.location.search);
  const fresh: Partial<Record<ClickField, string>> = {};
  for (const field of FIELDS) {
    const value = safeClickId(params.get(field));
    if (value) fresh[field] = value;
  }
  let stored: Partial<Record<ClickField, string>> = {};
  try {
    const saved = JSON.parse(sessionStorage.getItem(KEY) || 'null');
    if (saved?.expires > Date.now() && saved?.value && typeof saved.value === 'object') {
      for (const field of FIELDS) {
        const value = safeClickId(saved.value[field]);
        if (value) stored[field] = value;
      }
    }
  } catch { /* Storage unavailable. */ }
  const click = Object.keys(fresh).length ? fresh : stored;
  if (Object.keys(fresh).length) {
    try { sessionStorage.setItem(KEY, JSON.stringify({ value: click, expires: Date.now() + 30 * 60 * 1000 })); } catch { /* Optional storage. */ }
  }
  return { consent: true, consentVersion: 'ensotek.analytics-consent.v1', formConsentVersion: 'moe-offer-ads-v1', ...click };
}

export function withMoeAdAttribution<T extends object>(payload: T, formConsent: boolean): T & { form_data?: Record<string, unknown> } {
  const adAttribution = getMoeAdAttribution();
  if (!formConsent || !adAttribution || !FIELDS.some(field => adAttribution[field])) return payload;
  const existing = 'form_data' in payload ? (payload as { form_data?: Record<string, unknown> }).form_data : undefined;
  return { ...payload, form_data: { ...existing, ad_attribution: adAttribution } };
}
