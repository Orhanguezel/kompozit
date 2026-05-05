import 'server-only';

import { fetchSetting } from '@/i18n/server';

export type ParsedContactInfo = {
  companyName: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  hours: string;
};

const DEFAULTS: ParsedContactInfo = {
  companyName: 'MOE Kompozit',
  address: '',
  phone: '',
  whatsapp: '',
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
    whatsapp: String(raw.whatsapp ?? raw.phone ?? DEFAULTS.whatsapp),
    email: String(raw.email ?? DEFAULTS.email),
    hours: String(raw.working_hours ?? raw.hours ?? DEFAULTS.hours),
  };
}

const DAY_LABELS: Record<string, Record<string, string>> = {
  tr: {
    mon: 'Pazartesi',
    tue: 'Sali',
    wed: 'Carsamba',
    thu: 'Persembe',
    fri: 'Cuma',
    sat: 'Cumartesi',
    sun: 'Pazar',
  },
  en: {
    mon: 'Monday',
    tue: 'Tuesday',
    wed: 'Wednesday',
    thu: 'Thursday',
    fri: 'Friday',
    sat: 'Saturday',
    sun: 'Sunday',
  },
};

type BusinessHourRow = { day?: string; open?: string; close?: string; closed?: boolean };

export function parseBusinessHoursSettingValue(value: unknown, locale: string): string {
  const rows = Array.isArray(value) ? (value as BusinessHourRow[]) : [];
  if (!rows.length) return DEFAULTS.hours;

  const labels: Record<string, string> = locale.startsWith('en')
    ? { ...DAY_LABELS.en }
    : { ...DAY_LABELS.tr };
  const openRows = rows.filter((row) => row && !row.closed && row.open && row.close);
  if (!openRows.length) return locale.startsWith('en') ? 'Closed' : 'Kapali';

  const first = openRows[0] as BusinessHourRow;
  const last = openRows[openRows.length - 1] as BusinessHourRow;
  const firstLabel = labels[String(first.day || '')] || String(first.day || '');
  const lastLabel = labels[String(last.day || '')] || String(last.day || '');
  const dayRange = first.day === last.day ? firstLabel : `${firstLabel} - ${lastLabel}`;

  return `${dayRange}: ${first.open} - ${first.close}`;
}

export async function fetchParsedContactInfo(
  locale: string,
  options?: { revalidate?: number },
): Promise<ParsedContactInfo> {
  try {
    const [contactRow, hoursRow] = await Promise.all([
      fetchSetting('contact_info', '*', {
        revalidate: options?.revalidate ?? 3600,
      }),
      fetchSetting('businessHours', '*', {
        revalidate: options?.revalidate ?? 3600,
      }),
    ]);
    const parsed = contactRow?.value ? parseContactSettingValue(contactRow.value) : { ...DEFAULTS };
    return {
      ...parsed,
      hours: parseBusinessHoursSettingValue(hoursRow?.value, locale) || parsed.hours,
    };
  } catch {
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
}
