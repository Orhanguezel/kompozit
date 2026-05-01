import Link from 'next/link';

import { cn } from '@/lib/utils';
import { JsonLd, jsonld, siteUrlBase } from '@/seo';

type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function Breadcrumbs({
  items,
  className,
  olClassName,
}: {
  items: BreadcrumbItem[];
  className?: string;
  olClassName?: string;
}) {
  const siteUrl = siteUrlBase();
  const toAbsoluteUrl = (href: string) =>
    /^https?:\/\//i.test(href) ? href : `${siteUrl}${href.startsWith('/') ? '' : '/'}${href}`;
  const breadcrumbData = jsonld.breadcrumb(
    items.map((item) => ({
      name: item.label,
      url: item.href ? toAbsoluteUrl(item.href) : siteUrl,
    })),
  );

  return (
    <>
      <JsonLd data={breadcrumbData} />
      <nav aria-label="Breadcrumb" className={cn('mb-6', className)}>
        <ol
          className={cn(
            'flex flex-wrap items-center gap-2 text-sm text-[var(--color-text-secondary)]',
            olClassName,
          )}
        >
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={`${item.label}-${index}`} className="flex items-center gap-2">
                {item.href && !isLast ? (
                  <Link href={item.href} className="hover:text-[var(--color-text-primary)] hover:underline">
                    {item.label}
                  </Link>
                ) : (
                  <span className={isLast ? 'font-medium text-[var(--color-text-primary)]' : ''}>
                    {item.label}
                  </span>
                )}
                {!isLast && <span aria-hidden="true">/</span>}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
