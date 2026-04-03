'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { Menu, X, ChevronDown, MoveRight, Mail, Phone, MapPin } from 'lucide-react';
import { localizedPath } from '@/seo';

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

function normalizeItems(raw: Record<string, unknown>[]): MenuItem[] {
  return raw
    .map((r) => ({
      title: String(r.title ?? r.label ?? ''),
      url: String(r.url ?? r.href ?? '#'),
      children: Array.isArray(r.children) ? normalizeItems(r.children as any) : [],
    }))
    .filter((i) => i.title);
}

export function Header({
  menuItems,
  logoUrl,
  locale,
}: {
  menuItems: Record<string, unknown>[];
  logoUrl: string;
  locale: string;
}) {
  const t = useTranslations('nav');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const items = normalizeItems(menuItems);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'py-3 bg-[var(--color-bg-secondary)]/85 backdrop-blur-2xl border-b border-white/10 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.5)]' 
          : 'py-5 bg-transparent border-b border-transparent'
      }`}
      suppressHydrationWarning
    >
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo Area */}
          <Link 
            href={localizedPath(locale, '/')} 
            className="flex items-center gap-3 group relative transition-all duration-300 active:scale-95"
          >
            {logoUrl ? (
              <div className="relative h-9 lg:h-11 w-auto min-w-[120px]">
                <Image
                  src={logoUrl}
                  alt="MOE Kompozit"
                  fill
                  className="object-contain brightness-110 group-hover:brightness-125 transition-all duration-300 drop-shadow-sm"
                  priority
                />
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <div className="size-9 bg-brand rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(var(--primary-500),0.3)] group-hover:scale-110 transition-transform duration-500">
                  <MoveRight className="size-5 text-white -rotate-45" />
                </div>
                <span className="text-xl lg:text-2xl font-bold font-[var(--font-display)] tracking-tighter flex items-baseline gap-1">
                  <span className="text-[var(--color-text-primary)]">MOE</span>
                  <span className="text-brand">Kompozit</span>
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Navigation - Centered Design */}
          <nav 
            className="hidden lg:flex items-center gap-x-2 xl:gap-x-4 glass-premium rounded-full px-2 py-1.5 border-white/5 bg-white/[0.03]" 
            aria-label="Main navigation"
          >
            {items.map((item) => (
              <div key={item.url} className="group relative">
                <Link
                  href={item.url!}
                  className="relative flex items-center gap-1.5 rounded-full px-5 py-2 text-[13px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)] transition-all duration-300 hover:text-[var(--color-text-primary)] hover:bg-white/5"
                >
                  {item.title}
                  {(item.children?.length ?? 0) > 0 && (
                    <ChevronDown className="size-3.5 opacity-40 transition-transform duration-300 group-hover:rotate-180 group-hover:opacity-100" />
                  )}
                  {/* Underline Indicator */}
                  <span className="absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 bg-brand transition-all duration-300 group-hover:w-1/2" />
                </Link>
                
                {(item.children?.length ?? 0) > 0 && (
                  <div className="invisible absolute -left-4 top-full pt-4 w-72 opacity-0 transition-all duration-300 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 translate-y-3">
                    <div className="glass-premium rounded-3xl border border-white/10 bg-[var(--color-bg-secondary)]/98 p-4 shadow-[0_30px_100px_rgba(0,0,0,0.6)] backdrop-blur-3xl overflow-hidden carbon-mesh">
                      <div className="absolute inset-0 bg-brand/5 pointer-events-none" />
                      {item.children!.map((child) => (
                        <Link
                          key={child.url}
                          href={child.url!}
                          className="flex items-center gap-3 rounded-2xl px-4 py-3.5 text-[13px] font-semibold text-[var(--color-text-secondary)] transition-all duration-300 hover:bg-white/5 hover:text-brand"
                        >
                          <div className="size-1.5 rounded-full bg-brand/30" />
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Action Group */}
          <div className="flex items-center gap-2 lg:gap-4">
            <div className="hidden sm:flex items-center gap-2 lg:gap-3">
              <ThemeToggle />
              <LanguageSwitcher locale={locale} />
            </div>

            <Link
              href={localizedPath(locale, '/offer')}
              className="btn-primary shimmer-btn glow-hover relative hidden items-center gap-2 rounded-2xl px-7 py-3 text-[13px] font-bold uppercase tracking-[0.1em] shadow-[0_15px_35px_-10px_rgba(var(--primary-700),0.4)] transition-all duration-300 active:scale-95 sm:flex"
            >
              <span>{t('offer')}</span>
              <MoveRight className="size-4 opacity-70 group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Mobile Trigger */}
            <button
              type="button"
              className="relative size-11 flex items-center justify-center rounded-2xl lg:hidden glass-premium border-white/10 hover:bg-white/10 transition-all duration-300 text-[var(--color-text-primary)]"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
              <span className="sr-only">Menu</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Mesh Overlay */}
      <div 
        className={`fixed inset-0 z-[-1] bg-black/60 backdrop-blur-sm transition-opacity duration-500 lg:hidden ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileOpen(false)}
      />

      <nav 
        className={`fixed inset-x-0 top-full h-[calc(100dvh-80px)] overflow-y-auto lg:hidden bg-[var(--color-bg-secondary)]/98 backdrop-blur-3xl border-t border-white/5 transition-all duration-500 ease-in-out shadow-2xl ${
          mobileOpen ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-10 opacity-0 pointer-events-none'
        }`}
      >
        <div className="p-6 space-y-8 max-w-lg mx-auto">
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.url} className="space-y-1 py-1">
                <Link
                  href={item.url!}
                  className="flex items-center justify-between rounded-2xl px-5 py-4 text-lg font-bold text-[var(--color-text-primary)] hover:bg-white/5 transition-colors border border-transparent hover:border-white/5"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.title}
                  {(item.children?.length ?? 0) > 0 && <ChevronDown className="size-5 opacity-40" />}
                </Link>
                {item.children?.map((child) => (
                  <Link
                    key={child.url}
                    href={child.url!}
                    className="flex items-center gap-3 rounded-xl px-10 py-3 text-sm font-medium text-[var(--color-text-secondary)] hover:bg-white/5 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    <div className="size-1 rounded-full bg-brand/50" />
                    {child.title}
                  </Link>
                ))}
              </div>
            ))}
          </div>

          {/* Mobile Quick Actions */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="flex flex-col items-center gap-3 p-4 glass-premium rounded-[2rem] border-white/5">
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Display</span>
              <ThemeToggle />
            </div>
            <div className="flex flex-col items-center gap-3 p-4 glass-premium rounded-[2rem] border-white/5">
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Language</span>
              <LanguageSwitcher locale={locale} />
            </div>
          </div>

          <Link
            href={localizedPath(locale, '/offer')}
            className="btn-primary shimmer-btn glow-hover flex items-center justify-center gap-3 rounded-2xl px-6 py-5 text-lg font-bold uppercase tracking-widest shadow-xl"
            onClick={() => setMobileOpen(false)}
          >
            {t('offer')}
            <MoveRight className="size-5" />
          </Link>

          {/* Industrial Brand Hints */}
          <div className="pt-10 border-t border-white/5 grid gap-6 text-[var(--color-text-muted)]">
            <div className="flex items-center gap-4">
               <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                  <Phone className="size-5 text-brand" />
               </div>
               <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Engineering Hot-line</p>
                  <p className="font-bold text-[var(--color-text-secondary)]">+90 262 555 00 00</p>
               </div>
            </div>
            <div className="flex items-center gap-4">
               <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                  <Mail className="size-5 text-brand" />
               </div>
               <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Project Specs</p>
                  <p className="font-bold text-[var(--color-text-secondary)]">hello@moekompozit.com</p>
               </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
