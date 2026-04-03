'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Globe } from 'lucide-react';
import { localizedPath } from '@/seo';
import { FALLBACK_LOCALE } from '@/i18n/locales';

const LOCALE_META: Record<string, { label: string; flag: string }> = {
  tr: { label: 'Türkçe', flag: '🇹🇷' },
  en: { label: 'English', flag: '🇬🇧' },
};

export function LanguageSwitcher({ locale }: { locale: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const locales = Object.keys(LOCALE_META);
  if (locales.length <= 1) return null;

  function switchLocale(next: string) {
    const segments = pathname.split('/').filter(Boolean);
    const pathWithoutLocale =
      segments[0] && segments[0] in LOCALE_META ? `/${segments.slice(1).join('/')}` : pathname;
    const normalizedPath = pathWithoutLocale === '' ? '/' : pathWithoutLocale;
    const target = localizedPath(next || FALLBACK_LOCALE, normalizedPath);
    router.push(target);
  }

  return (
    <div className="relative group" suppressHydrationWarning>
      <button
        type="button"
        className="flex items-center gap-1.5 rounded-xl border border-white/5 bg-white/5 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-[var(--color-text-secondary)] transition-all hover:bg-white/10 hover:text-brand"
      >
        <Globe className="size-3.5" />
        <span>{locale}</span>
      </button>
      <div
        className="invisible absolute right-0 top-full mt-2 w-48 origin-top-right scale-95 opacity-0 transition-all group-hover:visible group-hover:scale-100 group-hover:opacity-100"
        suppressHydrationWarning
      >
        <div className="glass-premium rounded-2xl border border-white/10 bg-[var(--color-bg-secondary)]/95 p-2 shadow-2xl backdrop-blur-xl">
          {locales.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => switchLocale(l)}
              className={`group flex w-full items-center justify-between gap-3 rounded-xl px-4 py-2.5 text-sm transition-all ${
                l === locale
                  ? 'bg-brand/10 font-bold text-brand'
                  : 'text-[var(--color-text-secondary)] hover:bg-white/5 hover:text-[var(--color-text-primary)]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg leading-none">{LOCALE_META[l]?.flag}</span>
                <span>{LOCALE_META[l]?.label}</span>
              </div>
              {l === locale && <div className="size-1.5 rounded-full bg-brand shadow-sm shadow-brand/50" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
