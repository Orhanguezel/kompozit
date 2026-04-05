import 'server-only';

import type { CSSProperties, ReactNode } from 'react';
import type { Metadata } from 'next';
import { Bebas_Neue, Cormorant_Garamond, DM_Sans } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';

import { getLocaleSettings } from '@/i18n/locale-settings';
import { fetchSetting, fetchMenuItems, fetchFooterSections } from '@/i18n/server';
import { getTranslations } from 'next-intl/server';
import { siteUrlBase, asStr, asObj } from '@/seo';
import { resolvePublicAssetUrl } from '@/lib/utils';
import { ensureFooterSections, ensureMenuItems } from '@/lib/navigation-fallback';
import { buildFooterSocialNavFromSetting } from '@/lib/footer-social';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ClientShell } from '@/components/layout/ClientShell';
import { THEME_INTENT, THEME_TEMPLATE } from '@/theme/templates';
import { ThemeBootScript } from '@/scripts/theme-boot';
import { DeferredToaster } from '@/components/layout/DeferredToaster';

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

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
  preload: false,
});

const dmSans = DM_Sans({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
});

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

  const [seo, siteLogo, legacyLogo, siteOgDefaultImage] = await Promise.all([
    fetchSetting('seo', locale),
    fetchSetting('site_logo', locale),
    fetchSetting('logo', locale),
    fetchSetting('site_og_default_image', locale),
  ]);

  const t = await getTranslations({ locale, namespace: 'seo' });
  const val = readSettingValue(seo);
  const logoValue = { ...readSettingValue(legacyLogo), ...readSettingValue(siteLogo) };
  const ogValue = readSettingValue(siteOgDefaultImage);

  const title = asStr(val.site_title) || t('defaultTitle');
  const description = asStr(val.site_description) || t('defaultDescription');
  const faviconUrl =
    resolvePublicAssetUrl(
      pickFirstString(logoValue.favicon_url, logoValue.favicon, logoValue.icon_url),
    ) ?? undefined;
  const appleTouchIconUrl =
    resolvePublicAssetUrl(
      pickFirstString(logoValue.apple_touch_icon_url, logoValue.apple_touch_icon),
    ) ?? undefined;
  const ogImageRaw = pickFirstString(val.og_image, ogValue.url, ogValue.image_url);
  const ogImage = ogImageRaw
    ? (resolvePublicAssetUrl(ogImageRaw) ?? ogImageRaw)
    : undefined;

  return {
    title: { default: title, template: `%s | MOE Kompozit` },
    description,
    metadataBase: new URL(siteUrl),
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
      siteName: 'MOE Kompozit',
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    twitter: {
      card: ogImage ? 'summary_large_image' : 'summary',
      ...(ogImage ? { images: [ogImage] } : {}),
    },
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

  const [menuItems, footerSections, siteLogoSetting, legacyLogoSetting, brandingSetting, socialsSetting, contactInfoSetting] =
    await Promise.all([
      fetchMenuItems(locale),
      fetchFooterSections(locale),
      fetchSetting('site_logo', locale),
      fetchSetting('logo', locale),
      fetchSetting('branding', '*'),
      fetchSetting('socials', locale),
      fetchSetting('contact_info', locale),
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
  const lightLogoRaw = pickFirstString(logoValue.logo_light_url, logoValue.logo_url, logoValue.url);
  const darkLogoRaw = pickFirstString(logoValue.logo_dark_url, logoValue.logo_url, logoValue.url);
  const logoConfigs = {
    default: (resolvePublicAssetUrl(darkLogoRaw) ?? darkLogoRaw) || '/media/logo-dark.png',
    dark: (resolvePublicAssetUrl(lightLogoRaw) ?? lightLogoRaw) || '/media/logo-light.png',
    light: (resolvePublicAssetUrl(lightLogoRaw) ?? lightLogoRaw) || '/media/logo-light.png',
  };
  const stableMenuItems = ensureMenuItems(menuItems, locale, navT);
  const stableFooterSections = ensureFooterSections(footerSections, locale, navT, footerT);
  const footerSocialNav = buildFooterSocialNavFromSetting(readSettingValue(socialsSetting));
  const contactInfo = readSettingValue(contactInfoSetting);

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
      </head>
      <body
        className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)] antialiased"
        data-theme-mode="dark"
        suppressHydrationWarning
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header menuItems={stableMenuItems} logo={logoConfigs} locale={locale} activeLocales={activeLocales} />
          <main className="flex-1 pt-[5.5rem] lg:pt-24">{children}</main>
          <Footer sections={stableFooterSections} locale={locale} socialNav={footerSocialNav} contactInfo={contactInfo} />
          <ClientShell />
          <DeferredToaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
