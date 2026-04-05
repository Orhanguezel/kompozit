import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { localizedPath } from '@/seo';

import type { FooterSocialNavItem } from '@/lib/footer-social';

interface FooterSection {
  title?: string;
  items?: { label?: string; url?: string }[];
  [key: string]: unknown;
}

interface ContactInfo {
  phone?: string;
  phone_2?: string;
  email?: string;
  address?: string;
  city?: string;
  working_hours?: string;
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
  socialNav = [],
  contactInfo = {},
}: {
  sections: Record<string, unknown>[];
  locale: string;
  socialNav?: FooterSocialNavItem[];
  contactInfo?: Record<string, unknown>;
}) {
  const t = useTranslations('footer');
  const normalized = normalizeSections(sections, locale);
  const year = new Date().getFullYear();

  const contact = contactInfo as ContactInfo;
  const phone = contact.phone?.trim();
  const email = contact.email?.trim();
  const address = contact.address?.trim();
  const hours = contact.working_hours?.trim();

  const hasContact = !!(phone || email || address);

  return (
    <footer className="footer-cc" id="footer">
      <div className="mx-auto max-w-325 px-6 lg:px-12">
        <div className="footer-top-cc">

          {/* Brand + Contact Column */}
          <div className="space-y-8">
            {/* Logo */}
            <Link href={localizedPath(locale, '/')} className="inline-block">
              <Image
                src="/media/logo-light.png"
                alt="MOE Kompozit"
                width={220}
                height={66}
                className="h-14 w-auto object-contain"
              />
            </Link>

            {/* Tagline */}
            <p className="max-w-xs text-sm font-light leading-relaxed text-(--silver) opacity-80">
              {t('description')}
            </p>

            {/* Contact info */}
            {hasContact && (
              <div className="space-y-3 pt-2">
                <h4 className="font-display text-[10px] font-bold uppercase tracking-[3px] text-(--white)">
                  {t('contact')}
                </h4>

                {phone && (
                  <a
                    href={`tel:${phone.replace(/\s/g, '')}`}
                    className="flex items-start gap-2 text-xs font-light text-(--silver) transition-colors hover:text-(--gold)"
                  >
                    <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 opacity-60" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 6.75Z" />
                    </svg>
                    <span>{phone}</span>
                  </a>
                )}

                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="flex items-start gap-2 text-xs font-light text-(--silver) transition-colors hover:text-(--gold)"
                  >
                    <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 opacity-60" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
                    <span>{email}</span>
                  </a>
                )}

                {address && (
                  <div className="flex items-start gap-2 text-xs font-light text-(--silver) opacity-75">
                    <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 opacity-60" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg>
                    <span className="leading-relaxed">{address}</span>
                  </div>
                )}

                {hours && (
                  <div className="flex items-start gap-2 text-xs font-light text-(--silver) opacity-60">
                    <svg className="mt-0.5 h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    <span>{hours}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Dynamic nav sections */}
          {normalized.map((section) => (
            <div key={section.title} className="space-y-6">
              <h4 className="font-display text-[10px] font-bold uppercase tracking-[3px] text-(--white)">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.items?.map((item) => (
                  <li key={item.url}>
                    <Link
                      href={item.url!}
                      className="text-xs font-light text-(--silver) transition-colors hover:text-(--gold)"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-cc pt-10">
          <p className="text-[10px] font-medium uppercase tracking-[2px] text-(--silver) opacity-60">
            &copy; {year} MOE Kompozit. {t('rights')}
          </p>

          <div className="flex flex-wrap items-center gap-6">
            <Link
              href={localizedPath(locale, '/legal/privacy')}
              className="text-[10px] font-medium uppercase tracking-[2px] text-(--silver) hover:text-(--gold)"
            >
              {t('privacy')}
            </Link>

            {socialNav.map((item) => (
              <a
                key={item.id}
                href={item.href || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-medium uppercase tracking-[2px] text-(--silver) hover:text-(--gold)"
              >
                {t(`social.${item.id}`)}
              </a>
            ))}

            {/* GWD Design credit */}
            <span className="text-[10px] font-medium uppercase tracking-[2px] text-(--silver) opacity-40">
              {t('designed_by')}{' '}
              <a
                href="https://guezelwebdesign.com"
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-100 transition-opacity hover:opacity-80"
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
