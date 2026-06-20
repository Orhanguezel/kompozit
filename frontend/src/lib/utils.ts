import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

const PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8186/api';
const INTERNAL_API_BASE_URL = `${
  process.env.BACKEND_INTERNAL_URL ||
  process.env.BACKEND_URL ||
  'http://127.0.0.1:8186'
}`.replace(/\/api\/?$/, '');

export const API_BASE_URL =
  typeof window === 'undefined' && PUBLIC_API_BASE_URL.startsWith('/')
    ? `${INTERNAL_API_BASE_URL}/api`
    : PUBLIC_API_BASE_URL;

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.karbonkompozit.com.tr';

export function absoluteAssetUrl(value?: string | null): string | null {
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  const normalized = value.startsWith('/') ? value : `/${value}`;
  return `${API_BASE_URL.replace(/\/api\/?$/, '')}${normalized}`;
}

/** Backend static path'leri Next.js rewrites ile proxy edilir (/uploads/, /media/, /storage/).
 *  Absolute URL'ler (https://) olduğu gibi döner. Diğerleri kök-relative kalır. */
export function resolvePublicAssetUrl(value?: string | null): string | null {
  if (!value) return null;
  const trimmed = String(value).trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const normalized = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return normalized;
}

/** HTML iceren metni duz metne cevirir — kart/ozet alanlarinda <h2>, <p> gibi
 *  etiketlerin yazi olarak gorunmesini onler. */
export function stripHtmlToText(value?: string | null): string {
  if (!value) return '';
  return String(value)
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;|&apos;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}
