import 'server-only';

import type { ParsedContactInfo } from '@/lib/contact-info';
import * as jsonld from './jsonld';
import { stripTrailingSlash } from './helpers';
import { buildOrganizationSchemaItems } from './organization-schema';

export function buildHomePageSchemaGraph(
  locale: string,
  input: { siteUrl: string; seoDescription: string; contact: ParsedContactInfo },
) {
  const base = stripTrailingSlash(input.siteUrl);
  const orgId = `${base}#/schema/organization`;
  const items: Record<string, unknown>[] = [
    ...buildOrganizationSchemaItems(locale, {
      description: input.seoDescription,
      contact: input.contact,
      pagePath: '/contact',
    }),
    jsonld.website({
      name: 'MOE Kompozit',
      url: base,
      description: input.seoDescription,
      publisher: { '@id': orgId },
      inLanguage: locale.startsWith('en') ? ['en', 'tr'] : ['tr', 'en'],
    }),
  ];

  return jsonld.graph(items);
}
