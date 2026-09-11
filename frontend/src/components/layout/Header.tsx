'use client';

import { APP_NAME } from '@/lib/brand-name';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { BrandLogo } from './BrandLogo';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { Mail, Phone, X } from 'lucide-react';
import offerStyles from './header-offer.module.css';
import { DesktopMegaMenu, type HeaderMenuItem, type HeaderContactInfo } from './DesktopMegaMenu';
import { resolvePublicAssetUrl } from '@/lib/utils';
import { localizedPath } from '@/seo/helpers';

const ThemeToggle = dynamic(
  () => import('@/components/theme/ThemeToggle').then((m) => m.ThemeToggle),
  {
    ssr: false,
    loading: () => (
      <span className="inline-flex h-10 w-10 shrink-0 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm shadow-inner" />
    ),
  },
);

const LanguageSwitcher = dynamic(
  () => import('./LanguageSwitcher').then((m) => m.LanguageSwitcher),
  {
    ssr: false,
    loading: () => (
      <span className="inline-flex h-10 w-12 shrink-0 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-inner" />
    ),
  },
);

function normalizeItems(raw: Record<string, unknown>[], locale: string): HeaderMenuItem[] {
  return raw
    .map((r) => {
      const rawUrl = String(r.url ?? r.href ?? '#');
      let url = !rawUrl.startsWith('http') && !rawUrl.startsWith('/') && rawUrl !== '#' ? `/${rawUrl}` : rawUrl;

      if (!url.startsWith('http') && url !== '#') {
        url = localizedPath(locale, url);
      }

      return {
        title: String(r.title ?? r.label ?? ''),
        url,
        image: resolvePublicAssetUrl(String(r.image_url ?? r.image ?? '')) || undefined,
        description: String(r.description ?? '').replace(/<[^>]*>/g, '').trim(),
        children: Array.isArray(r.children)
          ? normalizeItems(r.children as Record<string, unknown>[], locale)
          : [],
      };
    })
    .filter((i) => i.title);
}

function isSolutionsItem(item: HeaderMenuItem): boolean {
  const path = String(item.url || '').toLowerCase();
  const normalized = path.replace(/^\/[a-z]{2}(?=\/)/, '');
  return normalized === '/solutions' || normalized.startsWith('/solutions?');
}

export function Header({
  menuItems,
  logo,
  locale,
  activeLocales,
  contactInfo,
}: {
  menuItems: Record<string, unknown>[];
  logo?: { default: string; dark: string; light: string; alt?: string };
  locale: string;
  /** `getLocaleSettings().activeLocales` — dil seçicide yalnızca bunlar listelenir */
  activeLocales?: string[];
  contactInfo?: HeaderContactInfo;
}) {
  const t = useTranslations('nav');
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);
  const mobileNavRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!mobileOpen) return;
    const menu = mobileNavRef.current;
    if (!menu) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const controls = () => Array.from(menu.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex="0"]'))
      .filter(node => node.getClientRects().length > 0);
    const frame = requestAnimationFrame(() => controls()[0]?.focus());
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); setMobileOpen(false); }
      if (event.key !== 'Tab') return;
      const fields = controls();
      const first = fields[0], last = fields.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    menu.addEventListener('keydown', onKeyDown);
    const opener = mobileToggleRef.current;
    return () => {
      cancelAnimationFrame(frame);
      menu.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      opener?.focus();
    };
  }, [mobileOpen]);
  const [scrolled, setScrolled] = useState(false);
  const items = normalizeItems(menuItems, locale);
  const darkLogoSrc = logo?.dark || logo?.default || logo?.light;
  const logoAlt = logo?.alt || APP_NAME;
  const phone = contactInfo?.phone?.trim() || '';
  const email = contactInfo?.email?.trim() || '';
  const isTurkish = locale.startsWith('tr');
  const offerLabel = t('offer');
  const offerWords = offerLabel.trim().split(/\s+/);
  const offerBreakAt = Math.max(1, Math.ceil(offerWords.length / 2));
  const offerLines = [offerWords.slice(0, offerBreakAt).join(' '), offerWords.slice(offerBreakAt).join(' ')].filter(Boolean).join('\n');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
    <header
      className={`fixed left-0 right-0 top-0 z-50 w-full transition-all duration-500 ease-out ${
        scrolled
          ? 'header-shell-scrolled py-3'
          : 'border-b border-transparent bg-transparent py-5'
      }`}
      suppressHydrationWarning
    >
      <div className="mx-auto flex max-w-[1300px] items-center justify-between gap-6 px-6 lg:px-12">
        <Link
          href={localizedPath(locale, '/')}
          title={`${logoAlt} ana sayfa`}
          aria-label={`${logoAlt} ana sayfa`}
          className="group relative flex shrink-0 items-center gap-3 transition-all duration-300 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-carbon)]"
        >
          {darkLogoSrc && logo ? (
            <div className={`shrink-0 transition-all duration-300 group-hover:opacity-80 ${scrolled ? 'h-10 lg:h-12' : 'h-12 lg:h-14'}`}>
              <BrandLogo logo={logo} priority />
            </div>
          ) : (
            <>
              <div className="diamond-branding-icon shrink-0"></div>
              <span className="font-[var(--font-display)] text-[1.35rem] uppercase tracking-[6px] text-[var(--white)] lg:text-[1.8rem]">
                {logoAlt}
              </span>
            </>
          )}
        </Link>

        <DesktopMegaMenu items={items} locale={locale} contact={contactInfo} />

        <div className="flex items-center gap-3 lg:gap-5">
          <div className="hidden items-center gap-2 sm:flex lg:gap-3">
            <ThemeToggle />
            <LanguageSwitcher locale={locale} activeLocales={activeLocales} />
          </div>

          <Link
            href={localizedPath(locale, '/offer')}
            aria-label={offerLabel}
            className={`${offerStyles.cta} ${offerStyles.desktop}`}
          >
            <span className={offerStyles.label} aria-hidden="true">{offerLines}</span>
            <span className={offerStyles.hoverLabel} aria-hidden="true">{offerLines}</span>
          </Link>

          <button
            type="button"
            className="flex size-11 items-center justify-center p-2 xl:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            ref={mobileToggleRef}
            aria-controls="mobile-site-navigation"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? (
              <X className="size-6 text-[var(--color-cream)]" />
            ) : (
              <span className="flex h-[14px] w-[28px] flex-col justify-between" aria-hidden>
                <span className="h-0.5 w-full rounded-full bg-[var(--color-text-primary)]" />
                <span className="h-0.5 w-full rounded-full bg-[var(--color-text-primary)]" />
                <span className="h-0.5 w-full rounded-full bg-[var(--color-text-primary)]" />
              </span>
            )}
          </button>
        </div>
      </div>
    </header>

      {/* Header disina render edilir: kaydirmada header'a gelen backdrop-filter (Safari'de -webkit-)
          position:fixed icin containing block olusturur ve menuyu header kutusuna hapseder. */}
      <nav
        id="mobile-site-navigation"
        ref={mobileNavRef}
        className={`fixed inset-0 z-50 overflow-y-auto bg-[var(--carbon)] transition-all duration-700 ease-in-out xl:hidden ${
          mobileOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!mobileOpen}
        inert={!mobileOpen}
      >
        <div className="gold-grid-bg pointer-events-none absolute inset-0 opacity-10" aria-hidden="true" />

        {/* Mobile Header Bar */}
        <div className="flex h-24 items-center justify-between border-b border-[var(--gold)]/10 px-6">
           <Link href={localizedPath(locale, '/')} title={`${logoAlt} ana sayfa`} className="flex items-center gap-4" onClick={() => setMobileOpen(false)}>
              {darkLogoSrc && logo ? (
                <div className="h-12 shrink-0">
                  <BrandLogo logo={logo} />
                </div>
              ) : (
                <>
                  <div className="diamond-branding-icon"></div>
                  <span className="font-display text-[1.4rem] uppercase tracking-[6px] text-[var(--white)]">
                    {logoAlt}
                  </span>
                </>
              )}
           </Link>
           <button
             onClick={() => setMobileOpen(false)}
             className="flex size-12 items-center justify-center border border-[var(--gold)]/15 bg-white/5 text-[var(--gold)]"
             aria-label="Close menu"
           >
             <X className="size-6" />
           </button>
        </div>

        <div className="relative z-10 mx-auto max-w-lg space-y-8 px-6 py-10 sm:px-8 sm:py-12">
          <ul className="space-y-2.5">
            {items.map((item, index) => (
              <li key={item.url} style={{ transitionDelay: `${index * 50}ms` }} className={`transition-all duration-500 ${mobileOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                <Link
                  href={item.url!}
                  title={`${item.title} sayfasına git`}
                  className="block rounded-xl px-3 py-2 font-display text-2xl uppercase leading-tight tracking-[1px] text-[var(--white)] transition-colors hover:bg-white/5 hover:text-[var(--gold)] sm:text-3xl"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.title}
                </Link>
                {item.children?.length && !isSolutionsItem(item) ? (
                  <div className="ml-3 mt-2 grid gap-2 border-l border-[var(--gold)]/15 pl-4">
                    {item.children.map((child) => (
                      <Link
                        key={child.url}
                        href={child.url!}
                        title={`${child.title} sayfasına git`}
                        className="rounded-lg px-3 py-2 text-sm font-semibold uppercase tracking-[1.5px] text-[var(--silver)] transition-colors hover:bg-white/5 hover:text-[var(--gold)]"
                        onClick={() => setMobileOpen(false)}
                      >
                        {child.title}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </li>
            ))}
          </ul>

          <div className="grid gap-5 border-t border-[var(--gold)]/10 pt-8">
            <Link
              href={localizedPath(locale, '/offer')}
              aria-label={offerLabel}
              className={`${offerStyles.cta} ${offerStyles.mobile}`}
              onClick={() => setMobileOpen(false)}
            >
              <span className={offerStyles.label} aria-hidden="true">{offerLines}</span>
              <span className={offerStyles.hoverLabel} aria-hidden="true">{offerLines}</span>
            </Link>

            <div className="grid grid-cols-2 gap-3">
               <div className="flex flex-col items-center gap-2 border border-[var(--gold)]/10 bg-white/5 p-4">
                 <span className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--silver)]">{isTurkish ? 'Tema' : 'Theme'}</span>
                 <ThemeToggle />
               </div>
               <div className="flex flex-col items-center gap-2 border border-[var(--gold)]/10 bg-white/5 p-4">
                 <span className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--silver)]">{isTurkish ? 'Dil' : 'Locale'}</span>
                 <LanguageSwitcher locale={locale} activeLocales={activeLocales} />
               </div>
            </div>
          </div>

          <div className="grid gap-5 border-t border-[var(--gold)]/10 pt-8 text-[var(--silver)]">
            <div className="flex min-w-0 items-center gap-4 group">
              <div className="flex size-11 shrink-0 items-center justify-center border border-[var(--gold)]/15 bg-white/5 group-hover:bg-[var(--gold)] transition-colors">
                <Phone className="size-5 text-[var(--gold)] group-hover:text-[var(--carbon)] transition-colors" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[3px] opacity-40">{isTurkish ? 'Telefon' : 'Direct Line'}</p>
                <p className="font-display text-lg uppercase tracking-[1.5px] text-[var(--white)]">{phone}</p>
              </div>
            </div>
            <div className="flex min-w-0 items-center gap-4 group">
              <div className="flex size-11 shrink-0 items-center justify-center border border-[var(--gold)]/15 bg-white/5 group-hover:bg-[var(--gold)] transition-colors">
                <Mail className="size-5 text-[var(--gold)] group-hover:text-[var(--carbon)] transition-colors" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[3px] opacity-40">{isTurkish ? 'E-posta' : 'Inquiries'}</p>
                <p className="[overflow-wrap:anywhere] font-display text-lg uppercase tracking-[1.5px] text-[var(--white)]">{email}</p>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
