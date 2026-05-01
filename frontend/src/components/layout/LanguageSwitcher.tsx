'use client';

import { useEffect, useRef, useState } from 'react';
import { Globe } from 'lucide-react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { AVAILABLE_LOCALES } from '@/i18n/locales';

const LOCALE_META: Record<string, { label: string; flag: string }> = {
  tr: { label: 'Türkçe', flag: '🇹🇷' },
  en: { label: 'English', flag: '🇬🇧' },
};

export function LanguageSwitcher({
  locale,
  activeLocales,
}: {
  locale: string;
  /** Site ayarından gelen aktif diller; boşsa `AVAILABLE_LOCALES` */
  activeLocales?: string[];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const fromSettings = (activeLocales ?? []).filter((code) => code in LOCALE_META);
  /** Yalnızca tek dil dönen API varsayılanı (ör. sadece `tr`) switcher'ı gizliyordu; 2+ tanımlıysa API'ye uy, değilse JSON'daki tüm diller */
  const locales =
    fromSettings.length >= 2
      ? fromSettings
      : (AVAILABLE_LOCALES as string[]).filter((code) => code in LOCALE_META);

  useEffect(() => {
    function onDocPointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('pointerdown', onDocPointerDown);
    return () => document.removeEventListener('pointerdown', onDocPointerDown);
  }, []);

  if (locales.length <= 1) return null;

  function switchLocale(next: string) {
    if (next === locale) {
      setOpen(false);
      return;
    }
    setOpen(false);
    router.replace(pathname, { locale: next });
  }

  return (
    <div ref={rootRef} className="relative" suppressHydrationWarning>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={LOCALE_META[locale]?.label ?? locale}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-xl border border-white/5 bg-white/5 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-[var(--color-text-secondary)] transition-all hover:bg-white/10 hover:text-brand"
      >
        <Globe className="size-3.5 shrink-0" />
        <span>{LOCALE_META[locale]?.label ?? locale}</span>
      </button>

      <div
        role="listbox"
        className={`absolute right-0 top-full z-[60] mt-2 w-48 origin-top-right rounded-2xl border border-white/10 bg-[var(--color-bg-secondary)]/95 p-2 shadow-2xl backdrop-blur-xl transition-all ${
          open ? 'visible scale-100 opacity-100' : 'invisible scale-95 opacity-0 pointer-events-none'
        }`}
        suppressHydrationWarning
      >
        {locales.map((l) => (
          <button
            key={l}
            type="button"
            role="option"
            aria-selected={l === locale}
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
  );
}
