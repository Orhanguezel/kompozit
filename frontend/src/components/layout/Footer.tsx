import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { localizedPath } from '@/seo';

interface FooterSection {
  title?: string;
  items?: { label?: string; url?: string }[];
  [key: string]: unknown;
}

function normalizeSections(raw: Record<string, unknown>[]): FooterSection[] {
  return raw.map((s) => ({
    title: String(s.title ?? s.name ?? ''),
    items: Array.isArray(s.items)
      ? s.items.map((i: any) => ({
          label: String(i.label ?? i.title ?? ''),
          url: String(i.url ?? i.href ?? '#'),
        }))
      : [],
  }));
}

export function Footer({
  sections,
  locale,
}: {
  sections: Record<string, unknown>[];
  locale: string;
}) {
  const t = useTranslations('footer');
  const normalized = normalizeSections(sections);
  const year = new Date().getFullYear();

  return (
    <footer className="surface-dark-shell carbon-mesh relative border-t border-white/5 bg-[var(--color-bg-dark)] py-20 overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute right-0 bottom-0 size-64 rounded-full bg-brand/5 blur-3xl" />
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Brand column */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold tracking-tight text-white">
              MOE <span className="text-brand">Kompozit</span>
            </h3>
            <p className="text-sm leading-relaxed text-[var(--color-text-on-dark)] opacity-50 max-w-xs">
              {t('description')}
            </p>
            <div className="flex items-center gap-4 pt-4">
               <div className="glass-premium rounded-xl p-3 border-white/5 bg-white/5">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-brand">Industrial Grade</div>
               </div>
            </div>
          </div>

          {/* Dynamic sections */}
          {normalized.map((section) => (
            <div key={section.title} className="space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.items?.map((item) => (
                  <li key={item.url}>
                    <Link
                      href={item.url!}
                      className="text-sm font-medium text-[var(--color-text-on-dark)] opacity-60 hover:opacity-100 hover:text-brand transition-all flex items-center gap-2 group"
                    >
                      <div className="size-1 rounded-full bg-brand scale-0 group-hover:scale-100 transition-transform" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-20 flex flex-col items-center justify-between gap-6 border-t border-white/5 pt-10 sm:flex-row">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">
            &copy; {year} MOE Kompozit. {t('rights')}
          </p>
          <div className="flex gap-8">
            <Link
              href={localizedPath(locale, '/legal/privacy')}
              className="text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors"
            >
              {t('privacy')}
            </Link>
            <Link
              href={localizedPath(locale, '/legal/terms')}
              className="text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors"
            >
              {t('terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
