type Thing = Record<string, unknown>;

export function graph(items: Thing[]): Thing {
  return { '@context': 'https://schema.org', '@graph': items };
}

export function org(input: {
  '@id'?: string;
  name: string;
  url: string;
  logo?: string;
  image?: string;
  description?: string;
  email?: string;
  telephone?: string;
  address?: string | Thing;
  sameAs?: string[];
  knowsAbout?: string[];
  areaServed?: Array<string | Thing>;
}): Thing {
  return {
    '@type': 'Organization',
    ...(input['@id'] ? { '@id': input['@id'] } : {}),
    name: input.name,
    url: input.url,
    ...(input.logo ? { logo: input.logo } : {}),
    ...(input.image ? { image: input.image } : {}),
    ...(input.description ? { description: input.description } : {}),
    ...(input.email ? { email: input.email } : {}),
    ...(input.telephone ? { telephone: input.telephone } : {}),
    ...(input.address ? { address: input.address } : {}),
    ...(input.sameAs?.length ? { sameAs: input.sameAs } : {}),
    ...(input.knowsAbout?.length ? { knowsAbout: input.knowsAbout } : {}),
    ...(input.areaServed?.length ? { areaServed: input.areaServed } : {}),
  };
}

export function website(input: {
  name: string;
  url: string;
  description?: string;
  publisher?: { '@id': string };
  inLanguage?: string | string[];
}): Thing {
  return {
    '@type': 'WebSite',
    name: input.name,
    url: input.url,
    ...(input.description ? { description: input.description } : {}),
    ...(input.publisher ? { publisher: input.publisher } : {}),
    ...(input.inLanguage ? { inLanguage: input.inLanguage } : {}),
  };
}

export function localBusiness(input: {
  '@id'?: string;
  name: string;
  url: string;
  description?: string;
  email?: string;
  telephone?: string;
  address?: string | Thing;
  image?: string;
  openingHours?: string;
  parentOrganization?: { '@id': string };
}): Thing {
  return {
    '@type': 'LocalBusiness',
    ...(input['@id'] ? { '@id': input['@id'] } : {}),
    name: input.name,
    url: input.url,
    ...(input.description ? { description: input.description } : {}),
    ...(input.email ? { email: input.email } : {}),
    ...(input.telephone ? { telephone: input.telephone } : {}),
    ...(input.address ? { address: input.address } : {}),
    ...(input.image ? { image: input.image } : {}),
    ...(input.openingHours ? { openingHours: input.openingHours } : {}),
    ...(input.parentOrganization ? { parentOrganization: input.parentOrganization } : {}),
  };
}

export function product(input: {
  name: string;
  description?: string;
  image?: string;
  url?: string;
  brand?: string;
}): Thing {
  return {
    '@type': 'Product',
    name: input.name,
    ...(input.description ? { description: input.description } : {}),
    ...(input.image ? { image: input.image } : {}),
    ...(input.url ? { url: input.url } : {}),
    ...(input.brand
      ? { brand: { '@type': 'Brand', name: input.brand } }
      : {}),
  };
}

export function article(input: {
  headline: string;
  description?: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
  publisher?: {
    name: string;
    logo?: string;
  };
}): Thing {
  return {
    '@type': 'Article',
    headline: input.headline,
    ...(input.description ? { description: input.description } : {}),
    ...(input.image ? { image: input.image } : {}),
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
    ...(input.author
      ? { author: { '@type': 'Person', name: input.author } }
      : {}),
    ...(input.publisher
      ? {
          publisher: {
            '@type': 'Organization',
            name: input.publisher.name,
            ...(input.publisher.logo ? { logo: input.publisher.logo } : {}),
          },
        }
      : {}),
  };
}

export function breadcrumb(
  items: { name: string; url: string }[],
): Thing {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function itemList(
  items: { name: string; url: string }[],
): Thing {
  return {
    '@type': 'ItemList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      url: item.url,
    })),
  };
}

export function imageObject(input: {
  contentUrl: string;
  name?: string;
  caption?: string;
  width?: number;
  height?: number;
  dateModified?: string;
}): Thing {
  return {
    '@type': 'ImageObject',
    contentUrl: input.contentUrl,
    ...(input.name ? { name: input.name } : {}),
    ...(input.caption ? { caption: input.caption } : {}),
    ...(input.width ? { width: input.width } : {}),
    ...(input.height ? { height: input.height } : {}),
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
  };
}

export function imageGallery(input: {
  name: string;
  description?: string;
  url: string;
  images: Thing[];
}): Thing {
  return {
    '@type': 'ImageGallery',
    name: input.name,
    url: input.url,
    ...(input.description ? { description: input.description } : {}),
    hasPart: input.images,
  };
}

export function collectionPage(input: {
  name: string;
  description?: string;
  url: string;
  mainEntity?: Thing;
}): Thing {
  return {
    '@type': 'CollectionPage',
    name: input.name,
    url: input.url,
    ...(input.description ? { description: input.description } : {}),
    ...(input.mainEntity ? { mainEntity: input.mainEntity } : {}),
  };
}

export function aboutPage(input: {
  name: string;
  description?: string;
  url: string;
}): Thing {
  return {
    '@type': 'AboutPage',
    name: input.name,
    url: input.url,
    ...(input.description ? { description: input.description } : {}),
  };
}

export function contactPage(input: {
  name: string;
  description?: string;
  url: string;
}): Thing {
  return {
    '@type': 'ContactPage',
    name: input.name,
    url: input.url,
    ...(input.description ? { description: input.description } : {}),
  };
}
