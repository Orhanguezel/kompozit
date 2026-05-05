import 'server-only';

import type { CSSProperties, ReactNode } from 'react';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';

import { getLocaleSettings } from '@/i18n/locale-settings';
import { fetchSetting, fetchMenuItems, fetchFooterSections } from '@/i18n/server';
import { getTranslations } from 'next-intl/server';
import { siteUrlBase, asStr, asObj, localeAlternates, localizedUrl } from '@/seo';
import { resolvePublicAssetUrl } from '@/lib/utils';
import { ensureFooterSections, ensureMenuItems } from '@/lib/navigation-fallback';
import { buildFooterSocialNavFromSetting } from '@/lib/footer-social';
import { fetchParsedContactInfo } from '@/lib/contact-info';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ClientShell } from '@/components/layout/ClientShell';
import { THEME_INTENT, THEME_TEMPLATE } from '@/theme/templates';
import { ThemeBootScript } from '@/scripts/theme-boot';
import { DeferredToaster } from '@/components/layout/DeferredToaster';
import { JsonLd, jsonld } from '@/seo';

function readSettingValue(input: unknown): Record<string, unknown> {
  const raw = (input as { value?: unknown } | null)?.value;
  return asObj(raw);
}

function pickFirstString(...values: unknown[]): string {
  for (const value of values) {
    const normalized = asStr(value).trim();
    if (normalized) return normalized;
  }

  return '';
}

function pickSettingUrl(input: unknown): string {
  const value = readSettingValue(input);
  return pickFirstString(value.url, value.image_url, value.logo_url, value.logo_light_url, value.logo_dark_url);
}

const bebasNeue = { variable: 'font-display' };
const cormorant = { variable: 'font-serif' };
const dmSans = { variable: 'font-sans' };

export async function generateStaticParams() {
  const { activeLocales } = await getLocaleSettings();
  return activeLocales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const siteUrl = siteUrlBase();

  const [seo, siteMetaDefault, siteLogo, legacyLogo, siteOgDefaultImage] = await Promise.all([
    fetchSetting('seo', locale),
    fetchSetting('site_meta_default', locale),
    fetchSetting('site_logo', locale),
    fetchSetting('logo', locale),
    fetchSetting('site_og_default_image', locale),
  ]);

  const t = await getTranslations({ locale, namespace: 'seo' });
  const val = readSettingValue(seo);
  const metaVal = readSettingValue(siteMetaDefault);
  const logoValue = { ...readSettingValue(legacyLogo), ...readSettingValue(siteLogo) };
  const ogValue = readSettingValue(siteOgDefaultImage);
  const openGraphValue = asObj(val.open_graph);
  const twitterValue = asObj(val.twitter);
  const robotsValue = asObj(val.robots);
  const ogImages = Array.isArray(openGraphValue.images)
    ? openGraphValue.images.map((item) => asStr(item).trim()).filter(Boolean)
    : [];

  const siteName = pickFirstString(val.site_name, logoValue.logo_alt, 'MOE Kompozit');
  const title = pickFirstString(metaVal.title, val.site_title, val.title_default, t('defaultTitle'));
  const description = pickFirstString(
    metaVal.description,
    val.site_description,
    val.description,
    t('defaultDescription'),
  );
  const titleTemplate = pickFirstString(val.title_template) || `%s | ${siteName}`;
  const faviconUrl =
    resolvePublicAssetUrl(
      pickFirstString(logoValue.favicon_url, logoValue.favicon, logoValue.icon_url),
    ) ?? undefined;
  const appleTouchIconUrl =
    resolvePublicAssetUrl(
      pickFirstString(logoValue.apple_touch_icon_url, logoValue.apple_touch_icon),
    ) ?? undefined;
  const ogImageRaw = pickFirstString(ogImages[0], val.og_image, ogValue.url, ogValue.image_url);
  const ogImage = ogImageRaw
    ? (resolvePublicAssetUrl(ogImageRaw) ?? ogImageRaw)
    : undefined;
  const robotsNoIndex = robotsValue.noindex === true;
  const robotsIndex = robotsValue.index !== false && !robotsNoIndex;
  const robotsFollow = robotsValue.follow !== false;

  return {
    title: { default: title, template: titleTemplate },
    description,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: localizedUrl(locale, '/'),
      languages: localeAlternates('/'),
    },
    icons: {
      ...(faviconUrl
        ? {
            icon: [
              { url: faviconUrl, sizes: '16x16' },
              { url: faviconUrl, sizes: '32x32' },
            ],
          }
        : {}),
      ...(appleTouchIconUrl ? { apple: appleTouchIconUrl } : {}),
    },
    openGraph: {
      type: pickFirstString(openGraphValue.type, val.og_type, 'website') as 'website',
      title,
      description,
      siteName,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    twitter: {
      card: (pickFirstString(twitterValue.card) || (ogImage ? 'summary_large_image' : 'summary')) as
        | 'summary'
        | 'summary_large_image',
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    robots: { index: robotsIndex, follow: robotsFollow },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { activeLocales } = await getLocaleSettings();
  const messages = await getMessages({ locale });
  const navT = await getTranslations({ locale, namespace: 'nav' });
  const footerT = await getTranslations({ locale, namespace: 'footer' });

  const [
    menuItems,
    footerSections,
    siteLogoSetting,
    siteLogoDarkSetting,
    siteLogoLightSetting,
    legacyLogoSetting,
    brandingSetting,
    socialsSetting,
    companyProfileSetting,
    contactInfo,
  ] =
    await Promise.all([
      fetchMenuItems(locale),
      fetchFooterSections(locale),
      fetchSetting('site_logo', locale, { revalidate: 60 }),
      fetchSetting('site_logo_dark', locale, { revalidate: 60 }),
      fetchSetting('site_logo_light', locale, { revalidate: 60 }),
      fetchSetting('logo', locale, { revalidate: 60 }),
      fetchSetting('branding', '*'),
      fetchSetting('socials', '*'),
      fetchSetting('company_profile', locale),
      fetchParsedContactInfo(locale),
    ]);

  const logoValue = { ...readSettingValue(legacyLogoSetting), ...readSettingValue(siteLogoSetting) };
  const branding = readSettingValue(brandingSetting);
  const brandingVars = {
    ...(branding.primary_color ? { '--color-gold': branding.primary_color as string } : {}),
    ...(branding.accent_color ? { '--color-gold-bright': branding.accent_color as string } : {}),
    ...(branding.dark_color ? { '--color-carbon': branding.dark_color as string } : {}),
    ...(branding.graphite_color ? { '--color-graphite': branding.graphite_color as string } : {}),
    ...(branding.steel_color ? { '--color-steel': branding.steel_color as string } : {}),
    ...(branding.silver_color ? { '--color-silver': branding.silver_color as string } : {}),
    ...(branding.cream_color ? { '--color-cream': branding.cream_color as string } : {}),
  } as CSSProperties;
  const defaultLogoRaw = pickFirstString(pickSettingUrl(siteLogoSetting), logoValue.logo_url, logoValue.url);
  const darkLogoRaw = pickFirstString(pickSettingUrl(siteLogoDarkSetting), logoValue.logo_dark_url, defaultLogoRaw);
  const lightLogoRaw = pickFirstString(pickSettingUrl(siteLogoLightSetting), logoValue.logo_light_url, defaultLogoRaw);
  const logoAlt = pickFirstString(logoValue.alt, logoValue.logo_alt, branding.brand_name, 'MOE Kompozit');
  const logoConfigs = {
    default: (resolvePublicAssetUrl(defaultLogoRaw) ?? defaultLogoRaw),
    dark: (resolvePublicAssetUrl(darkLogoRaw) ?? darkLogoRaw),
    light: (resolvePublicAssetUrl(lightLogoRaw) ?? lightLogoRaw),
    alt: logoAlt,
  };
  const stableMenuItems = ensureMenuItems(menuItems, locale, navT);
  const stableFooterSections = ensureFooterSections(footerSections, locale, navT, footerT);
  const footerSocialNav = buildFooterSocialNavFromSetting(readSettingValue(socialsSetting));
  const companyProfile = readSettingValue(companyProfileSetting);
  const footerContactInfo = {
    ...contactInfo,
    companyName: asStr(companyProfile.company_name) || contactInfo.companyName,
  };
  const siteUrl = siteUrlBase();
  const orgLogoRaw = pickFirstString(logoConfigs.default, logoConfigs.dark, logoConfigs.light);
  const orgLogoUrl = orgLogoRaw
    ? (/^https?:\/\//i.test(orgLogoRaw) ? orgLogoRaw : `${siteUrl}${orgLogoRaw.startsWith('/') ? orgLogoRaw : `/${orgLogoRaw}`}`)
    : `${siteUrl}/icon`;
  const sameAs = Object.values(readSettingValue(socialsSetting))
    .filter((value): value is string => typeof value === 'string' && /^https?:\/\//i.test(value));
  const orgGraph = jsonld.graph([
    jsonld.org({
      '@id': `${siteUrl}#/schema/organization`,
      name: 'MOE Kompozit',
      url: siteUrl,
      logo: orgLogoUrl,
      description:
        'Karbon fiber, CTP / FRP ve hibrit kompozit urun uretimi yapan Ensotek alt markasi.',
      email: asStr(contactInfo.email) || 'offers@moekompozit.com',
      telephone: asStr(contactInfo.phone) || undefined,
      address: asStr(contactInfo.address) || undefined,
      sameAs,
      knowsAbout: [
        'Karbon fiber',
        'CTP tank',
        'FRP boru',
        'Pultruzyon profil',
        'Kompozit malzeme',
      ],
    }),
    jsonld.website({
      name: 'MOE Kompozit',
      url: siteUrl,
      description: 'Endustriyel kompozit uretim ve B2B proje cozumleri.',
      publisher: { '@id': `${siteUrl}#/schema/organization` },
      inLanguage: ['tr', 'en'],
    }),
  ]);

  return (
    <html
      lang={locale}
      className={`${bebasNeue.variable} ${cormorant.variable} ${dmSans.variable}`}
      data-theme-template={THEME_TEMPLATE}
      data-theme-intent={THEME_INTENT}
      data-theme-mode="dark"
      data-theme-preset="default"
      style={brandingVars}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <ThemeBootScript />
        <JsonLd data={orgGraph} />
      </head>
      <body
        className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)] antialiased"
        data-theme-mode="dark"
        suppressHydrationWarning
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header menuItems={stableMenuItems} logo={logoConfigs} locale={locale} activeLocales={activeLocales} />
          <main className="flex-1 pt-[5.5rem] lg:pt-24">{children}</main>
          <Footer
            sections={stableFooterSections}
            locale={locale}
            logo={logoConfigs}
            socialNav={footerSocialNav}
            contactInfo={footerContactInfo}
          />
          <ClientShell whatsappPhone={contactInfo.whatsapp || contactInfo.phone} />
          <DeferredToaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
