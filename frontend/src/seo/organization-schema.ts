import type { ParsedContactInfo } from '@/lib/contact-info';
import * as jsonld from './jsonld';
import { absoluteUrl, localizedUrl, organizationJsonLd, siteUrlBase, stripTrailingSlash } from './helpers';

function knowsAboutForLocale(locale: string): string[] {
  return locale.startsWith('en')
    ? [
        'Carbon fiber reinforced polymer',
        'Fiberglass (FRP/GRP) composites',
        'Industrial composite manufacturing',
        'B2B custom parts and enclosures',
      ]
    : [
        'Karbon fiber takviyeli kompozit',
        'Cam elyaf / CTP (FRP) kompozit',
        'Endustriyel kompozit uretim',
        'B2B ozel parca ve muhafaza',
      ];
}

export function buildOrganizationSchemaItems(
  locale: string,
  input: {
    description?: string;
    contact: ParsedContactInfo;
    pagePath?: string;
  },
): Record<string, unknown>[] {
  const siteRoot = stripTrailingSlash(siteUrlBase());
  const orgId = `${siteRoot}#/schema/organization`;
  const localBusinessId = `${siteRoot}#/schema/local-business`;
  const logo = absoluteUrl('/icon');
  const orgPayload = organizationJsonLd(locale, {
    description: input.description,
    email: input.contact.email || undefined,
    telephone: input.contact.phone || undefined,
    address: input.contact.address || undefined,
  });

  const items: Record<string, unknown>[] = [
    jsonld.org({
      '@id': orgId,
      ...orgPayload,
      image: logo,
      knowsAbout: knowsAboutForLocale(locale),
      areaServed: [
        { '@type': 'Country', name: 'Turkey' },
        { '@type': 'AdministrativeArea', name: 'International' },
      ],
    }),
  ];

  const hasPhysicalSignal =
    Boolean(input.contact.address?.trim()) || Boolean(input.contact.phone?.trim());

  if (hasPhysicalSignal) {
    items.push(
      jsonld.localBusiness({
        '@id': localBusinessId,
        parentOrganization: { '@id': orgId },
        name: input.contact.companyName,
        url: localizedUrl(locale, input.pagePath || '/contact'),
        description: input.description,
        email: input.contact.email || undefined,
        telephone: input.contact.phone || undefined,
        address: input.contact.address?.trim() || undefined,
        image: logo,
        openingHours: input.contact.hours || undefined,
      }),
    );
  }

  return items;
}
