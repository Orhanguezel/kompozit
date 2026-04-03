import 'server-only';

import { fetchSetting } from '@/i18n/server';

export type ParsedContactInfo = {
  companyName: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
};

const DEFAULTS: ParsedContactInfo = {
  companyName: 'MOE Kompozit',
  address: '',
  phone: '',
  email: 'info@karbonkompozit.com.tr',
  hours: 'Pazartesi - Cuma, 09:00 - 18:00',
};

export function parseContactSettingValue(value: unknown): ParsedContactInfo {
  let raw: Record<string, unknown> = {};
  if (value == null) {
    raw = {};
  } else if (typeof value === 'string') {
    try {
      raw = JSON.parse(value) as Record<string, unknown>;
    } catch {
      raw = {};
    }
  } else if (typeof value === 'object' && !Array.isArray(value)) {
    raw = value as Record<string, unknown>;
  }

  return {
    companyName: String(raw.company_name ?? DEFAULTS.companyName),
    address: String(raw.address ?? DEFAULTS.address),
    phone: String(raw.phone ?? DEFAULTS.phone),
    email: String(raw.email ?? DEFAULTS.email),
    hours: String(raw.hours ?? DEFAULTS.hours),
  };
}

export async function fetchParsedContactInfo(
  locale: string,
  options?: { revalidate?: number },
): Promise<ParsedContactInfo> {
  try {
    const row = await fetchSetting('contact_info', locale, {
      revalidate: options?.revalidate ?? 3600,
    });
    if (!row?.value) return { ...DEFAULTS };
    return parseContactSettingValue(row.value);
  } catch {
    return { ...DEFAULTS };
  }
}
