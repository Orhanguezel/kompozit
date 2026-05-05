import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { localizedPath } from '@/seo/helpers';

import type { FooterSocialNavItem } from '@/lib/footer-social';

interface FooterSection {
  title?: string;
  items?: { label?: string; url?: string }[];
  [key: string]: unknown;
}

interface ContactInfo {
  companyName?: string;
  company_name?: string;
  phone?: string;
  phone_2?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  city?: string;
  working_hours?: string;
  hours?: string;
  [key: string]: unknown;
}

function normalizeSections(raw: Record<string, unknown>[], locale: string): FooterSection[] {
  return raw.map((s) => ({
    title: String(s.title ?? s.name ?? ''),
    items: Array.isArray(s.items)
      ? s.items.map((i: any) => {
          const rawUrl = String(i.url ?? i.href ?? '#');
          const isInternal = !rawUrl.startsWith('http') && rawUrl !== '#';
          const p = isInternal && !rawUrl.startsWith('/') ? `/${rawUrl}` : rawUrl;
          const url = isInternal ? localizedPath(locale, p) : p;
          return {
            label: String(i.label ?? i.title ?? ''),
            url,
          };
        })
      : [],
  }));
}

export function Footer({
  sections,
  locale,
  logo,
  socialNav = [],
  contactInfo = {},
  footerContent = {},
}: {
  sections: Record<string, unknown>[];
  locale: string;
  logo?: { default: string; dark: string; light: string; alt?: string };
  socialNav?: FooterSocialNavItem[];
  contactInfo?: Record<string, unknown>;
  footerContent?: Record<string, unknown>;
}) {
  const t = useTranslations('footer');
  const normalized = normalizeSections(sections, locale);
  const year = new Date().getFullYear();

  const contact = contactInfo as ContactInfo;
  const phone = contact.phone?.trim();
  const whatsapp = contact.whatsapp?.trim();
  const email = contact.email?.trim();
  const address = contact.address?.trim();
  const hours = contact.working_hours?.trim() || contact.hours?.trim();
  const companyName = contact.companyName?.trim() || contact.company_name?.trim();
  const logoSrc = logo?.light || logo?.default || logo?.dark;
  const logoAlt = logo?.alt || 'MOE Kompozit';

  const footerDesc = String(footerContent?.description || '').trim();
  const footerRights = String(footerContent?.rights || '').trim();
  const ensotekRelation = String(footerContent?.ensotek_relation || '').trim();
  const designedBy = String(footerContent?.designed_by || '').trim();
  const privacyLabel = String(footerContent?.privacy_label || '').trim();
  const termsLabel = String(footerContent?.terms_label || '').trim();
  const footerPhone = String(footerContent?.phone || '').trim();
  const footerEmail = String(footerContent?.email || '').trim();
  const footerAddress = String(footerContent?.address || '').trim();

  const hasContact = !!(
    phone ||
    whatsapp ||
    email ||
    address ||
    hours ||
    footerPhone ||
    footerEmail ||
    footerAddress
  );

  return (
    <footer className="footer-cc relative overflow-hidden" id="footer">
      {/* Premium Background Elements */}
      <div className="carbon-texture absolute inset-0 opacity-[0.03] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-(--color-gold) to-transparent opacity-20" />
      
      <div className="mx-auto max-w-325 px-6 lg:px-12 relative z-10">
        <div className="footer-top-cc">
          {/* Brand + Contact Column */}
          <div className="space-y-8 lg:pr-8">
            {/* Logo */}
            {logoSrc ? (
              <Link href={localizedPath(locale, '/')} className="inline-block transition-transform duration-300 hover:scale-105">
                <Image
                  src={logoSrc}
                  alt={logoAlt}
                  width={220}
                  height={66}
                  className="h-14 w-auto object-contain"
                />
              </Link>
            ) : null}

            <div className="space-y-6">
              {/* Tagline */}
              <p className="max-w-xs text-sm font-light leading-relaxed text-(--silver)">
                {footerDesc || t('description')}
              </p>

              <div className="max-w-xs border-l-2 border-(--gold)/30 pl-4 py-1">
                <p className="text-[11px] font-medium uppercase tracking-[1px] text-(--silver)/80">
                  {ensotekRelation || t('ensotekRelation')}
                </p>
                <a
                  href="https://www.ensotek.com.tr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-1 text-xs font-semibold text-(--gold) transition-colors hover:text-(--white)"
                >
                  ENSOTEK &rsaquo;
                </a>
              </div>
            </div>

            {/* Contact info */}
            {hasContact && (
              <div className="space-y-4 pt-4">
                <p className="font-display text-[10px] font-bold uppercase tracking-[4px] text-(--white) opacity-90">
                  {t('contact')}
                </p>

                <div className="grid gap-3">
                  {(footerPhone || phone) && (
                    <a
                      href={`tel:${(footerPhone || phone!).replace(/\s/g, '')}`}
                      className="group flex items-center gap-3 text-sm font-light text-(--silver) transition-colors hover:text-(--gold)"
                    >
                      <div className="size-8 rounded-full border border-(--color-gold)/10 bg-(--color-gold)/5 flex items-center justify-center transition-colors group-hover:border-(--color-gold)/30 group-hover:bg-(--color-gold)/10">
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 6.75Z" />
                        </svg>
                      </div>
                      <span className="font-display tracking-[1px]">{footerPhone || phone}</span>
                    </a>
                  )}

                  {(footerEmail || email) && (
                    <a
                      href={`mailto:${footerEmail || email}`}
                      className="group flex items-center gap-3 text-sm font-light text-(--silver) transition-colors hover:text-(--gold)"
                    >
                      <div className="size-8 rounded-full border border-(--color-gold)/10 bg-(--color-gold)/5 flex items-center justify-center transition-colors group-hover:border-(--color-gold)/30 group-hover:bg-(--color-gold)/10">
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                        </svg>
                      </div>
                      <span className="truncate">{footerEmail || email}</span>
                    </a>
                  )}

                  {(footerAddress || address) && (
                    <div className="flex items-start gap-3 text-sm font-light text-(--silver)">
                      <div className="size-8 mt-1 rounded-full border border-(--color-gold)/10 bg-(--color-gold)/5 flex items-center justify-center">
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                        </svg>
                      </div>
                      <span className="leading-relaxed py-1">
                        {footerAddress || address}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Dynamic nav sections */}
          {normalized.map((section) => (
            <div key={section.title} className="space-y-8">
              <p className="font-display text-[11px] font-bold uppercase tracking-[4px] text-(--white) relative inline-block pb-2">
                {section.title}
                <span className="absolute bottom-0 left-0 w-8 h-px bg-(--gold)" />
              </p>
              <ul className="space-y-4">
                {section.items?.map((item) => (
                  <li key={item.url}>
                    <Link
                      href={item.url!}
                      className="text-xs font-light text-(--silver) transition-all duration-300 hover:text-(--gold) hover:pl-2 flex items-center gap-2 group"
                    >
                      <span className="size-1 rounded-full bg-(--gold) opacity-0 group-hover:opacity-100 transition-opacity" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-cc pt-10 pb-6">
          <div className="space-y-2">
            <p className="text-[10px] font-medium uppercase tracking-[2px] text-(--silver)/70">
              &copy; {year} MOE Kompozit. {footerRights || t('rights')}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center lg:justify-end gap-x-8 gap-y-4">
            <Link
              href={localizedPath(locale, '/legal/privacy')}
              className="text-[10px] font-bold uppercase tracking-[2.5px] text-(--silver) hover:text-(--gold) transition-colors"
            >
              {privacyLabel || t('privacy')}
            </Link>

            {termsLabel && (
              <Link
                href={localizedPath(locale, '/legal/terms')}
                className="text-[10px] font-bold uppercase tracking-[2.5px] text-(--silver) hover:text-(--gold) transition-colors"
              >
                {termsLabel || t('terms')}
              </Link>
            )}

            <div className="flex items-center gap-6">
              {socialNav.map((item) => (
                <a
                  key={item.id}
                  href={item.href || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-bold uppercase tracking-[2.5px] text-(--silver) hover:text-(--gold) transition-colors"
                  title={item.id}
                >
                  {item.id}
                </a>
              ))}
            </div>

            {/* GWD Design credit */}
            <span className="text-[10px] font-medium uppercase tracking-[2px] text-(--silver)/60">
              {designedBy || t('designed_by')}{' '}
              <a
                href="https://guezelwebdesign.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-(--gold) opacity-100 transition-colors hover:text-(--white) font-bold"
              >
                GWD
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
