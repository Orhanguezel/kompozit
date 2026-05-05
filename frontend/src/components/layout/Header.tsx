'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { ChevronDown, Mail, MoveRight, Phone, X } from 'lucide-react';
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

interface MenuItem {
  title?: string;
  url?: string;
  children?: MenuItem[];
  [key: string]: unknown;
}

type HeaderContactInfo = {
  email?: string;
  phone?: string;
};

function normalizeItems(raw: Record<string, unknown>[], locale: string): MenuItem[] {
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
        children: Array.isArray(r.children)
          ? normalizeItems(r.children as Record<string, unknown>[], locale)
          : [],
      };
    })
    .filter((i) => i.title);
}

function isSolutionsItem(item: MenuItem): boolean {
  const path = String(item.url || '').toLowerCase();
  const normalized = path.replace(/^\/[a-z]{2}(?=\/)/, '');
  return normalized === '/solutions' || normalized.startsWith('/solutions?');
}

const navLinkClass =
  "relative text-[0.8rem] font-medium uppercase tracking-[3px] text-[var(--light)] transition-colors duration-300 after:pointer-events-none after:absolute after:bottom-[-4px] after:left-0 after:h-px after:w-0 after:bg-[var(--gold)] after:transition-all after:duration-300 hover:text-[var(--gold)] hover:after:w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--carbon)]";

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
  const [scrolled, setScrolled] = useState(false);
  const items = normalizeItems(menuItems, locale);
  const logoSrc = logo?.dark || logo?.default || logo?.light;
  const mobileLogoSrc = logo?.light || logo?.default || logo?.dark;
  const logoAlt = logo?.alt || 'MOE Kompozit';
  const phone = contactInfo?.phone?.trim() || '';
  const email = contactInfo?.email?.trim() || '';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
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
          className="group relative flex shrink-0 items-center gap-3 transition-all duration-300 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-carbon)]"
        >
          {logoSrc ? (
            <div
              suppressHydrationWarning
              className={`relative transition-all duration-500 ${
                scrolled
                  ? 'h-8 lg:h-9'
                  : 'h-11 lg:h-12'
              }`}
            >
              <Image
                src={logoSrc}
                alt={logoAlt}
                width={300}
                height={80}
                className="h-full w-auto object-contain object-center transition-all duration-300 group-hover:opacity-80 drop-shadow-sm"
                priority
                fetchPriority="high"
              />
            </div>
          ) : (
            <>
              <div className="diamond-branding-icon shrink-0"></div>
              <span className="font-[var(--font-display)] text-[1.35rem] uppercase tracking-[6px] text-[var(--white)] lg:text-[1.8rem]">
                MOE KOMPOZİT
              </span>
            </>
          )}
        </Link>

        <nav className="hidden flex-1 justify-center xl:flex" aria-label="Main navigation">
          <ul className="flex list-none items-center gap-10">
            {items.map((item) => (
              <li key={item.url} className="group relative">
                <Link href={item.url!} className={`inline-flex items-center gap-1.5 ${navLinkClass}`}>
                  {item.title}
                  {(item.children?.length ?? 0) > 0 && !isSolutionsItem(item) && (
                    <ChevronDown className="size-3 opacity-50 transition-transform duration-300 group-hover:rotate-180" />
                  )}
                </Link>

                {(item.children?.length ?? 0) > 0 && !isSolutionsItem(item) && (
                  <div className="invisible absolute -left-4 top-full z-[60] w-72 translate-y-3 pt-4 opacity-0 transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="rounded-2xl border border-white/10 bg-[var(--color-bg-secondary)]/98 p-4 shadow-[0_30px_100px_rgba(0,0,0,0.6)] backdrop-blur-3xl">
                      {item.children!.map((child) => (
                        <Link
                          key={child.url}
                          href={child.url!}
                          className="flex items-center gap-3 rounded-xl px-4 py-3 text-[0.8rem] font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-white/5 hover:text-[var(--color-gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]"
                        >
                          <div className="size-1.5 rounded-full bg-[var(--color-gold)]/40" />
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3 lg:gap-5">
          <div className="hidden items-center gap-2 sm:flex lg:gap-3">
            <ThemeToggle />
            <LanguageSwitcher locale={locale} activeLocales={activeLocales} />
          </div>

          <Link
            href={localizedPath(locale, '/offer')}
            className="relative hidden items-center border border-[var(--gold)] bg-transparent px-7 py-2.5 text-[0.75rem] font-semibold uppercase tracking-[3px] text-[var(--gold)] transition-all duration-300 after:hidden hover:bg-[var(--gold)] hover:text-[var(--carbon)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--carbon)] sm:inline-flex"
          >
            {t('offer')}
          </Link>

          <button
            type="button"
            className="flex size-11 items-center justify-center p-2 xl:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? (
              <X className="size-6 text-[var(--color-cream)]" />
            ) : (
              <span className="flex h-[14px] w-[28px] flex-col justify-between" aria-hidden>
                <span className="h-px w-full rounded-full bg-[var(--color-cream)]" />
                <span className="h-px w-full rounded-full bg-[var(--color-cream)]" />
                <span className="h-px w-full rounded-full bg-[var(--color-cream)]" />
              </span>
            )}
          </button>
        </div>
      </div>

      <nav
        className={`fixed inset-0 z-50 overflow-y-auto bg-[var(--carbon)] transition-all duration-700 ease-in-out xl:hidden ${
          mobileOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!mobileOpen}
      >
        <div className="gold-grid-bg absolute inset-0 opacity-10" />

        {/* Mobile Header Bar */}
        <div className="flex h-24 items-center justify-between border-b border-[var(--gold)]/10 px-6">
           <Link href={localizedPath(locale, '/')} className="flex items-center gap-4" onClick={() => setMobileOpen(false)}>
              {mobileLogoSrc ? (
                <div className="relative h-8 w-[140px] shrink-0">
                  <Image
                    src={mobileLogoSrc}
                    alt={logoAlt}
                    fill
                    sizes="210px"
                    className="object-contain object-left"
                  />
                </div>
              ) : (
                <>
                  <div className="diamond-branding-icon"></div>
                  <span className="font-display text-[1.4rem] uppercase tracking-[6px] text-[var(--white)]">
                    MOE KOMPOZİT
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

        <div className="mx-auto max-w-lg space-y-12 p-10 py-20 relative z-10">
          <ul className="space-y-4">
            {items.map((item, index) => (
              <li key={item.url} style={{ transitionDelay: `${index * 50}ms` }} className={`transition-all duration-500 ${mobileOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                <Link
                  href={item.url!}
                  className="block font-display text-[2.8rem] uppercase leading-tight tracking-[-1px] text-[var(--white)] hover:text-[var(--gold)]"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.title}
                </Link>
                {item.children?.length && !isSolutionsItem(item) ? (
                  <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2">
                    {item.children.map((child) => (
                      <Link
                        key={child.url}
                        href={child.url!}
                        className="text-xs font-bold uppercase tracking-[2px] text-[var(--silver)] opacity-60 hover:text-[var(--gold)] hover:opacity-100"
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

          <div className="grid gap-6 border-t border-[var(--gold)]/10 pt-16">
            <Link
              href={localizedPath(locale, '/offer')}
              className="hero-btn-primary shimmer-btn w-full justify-center"
              onClick={() => setMobileOpen(false)}
            >
              {t('offer')}
              <MoveRight className="size-5" />
            </Link>

            <div className="grid grid-cols-2 gap-4">
               <div className="flex flex-col items-center gap-2 border border-[var(--gold)]/10 bg-white/5 p-6">
                 <span className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--silver)]">Theme</span>
                 <ThemeToggle />
               </div>
               <div className="flex flex-col items-center gap-2 border border-[var(--gold)]/10 bg-white/5 p-6">
                 <span className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--silver)]">Locale</span>
                 <LanguageSwitcher locale={locale} activeLocales={activeLocales} />
               </div>
            </div>
          </div>

          <div className="grid gap-8 border-t border-[var(--gold)]/10 pt-16 text-[var(--silver)]">
            <div className="flex items-center gap-6 group">
              <div className="flex size-14 shrink-0 items-center justify-center border border-[var(--gold)]/15 bg-white/5 group-hover:bg-[var(--gold)] transition-colors">
                <Phone className="size-6 text-[var(--gold)] group-hover:text-[var(--carbon)] transition-colors" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[3px] opacity-40">Direct Line</p>
                <p className="font-display text-[1.4rem] uppercase tracking-[2px] text-[var(--white)]">{phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-6 group">
              <div className="flex size-14 shrink-0 items-center justify-center border border-[var(--gold)]/15 bg-white/5 group-hover:bg-[var(--gold)] transition-colors">
                <Mail className="size-6 text-[var(--gold)] group-hover:text-[var(--carbon)] transition-colors" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[3px] opacity-40">Inquiries</p>
                <p className="font-display text-[1.4rem] uppercase tracking-[2px] text-[var(--white)]">{email}</p>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
