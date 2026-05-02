// =============================================================
// FILE: src/config/app-config.ts
// Admin Panel Config — DB'den gelen branding verileri için fallback
// =============================================================

import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export type AdminBrandingConfig = {
  app_name: string;
  app_copyright: string;
  html_lang: string;
  theme_color: string;
  favicon_16: string;
  favicon_32: string;
  apple_touch_icon: string;
  meta: {
    title: string;
    description: string;
    og_url: string;
    og_title: string;
    og_description: string;
    og_image: string;
    twitter_card: string;
  };
};

export const DEFAULT_BRANDING: AdminBrandingConfig = {
  app_name: "MOE Kompozit Admin Panel",
  app_copyright: "MOE Kompozit",
  html_lang: "tr",
  theme_color: "#ea580c",
  favicon_16: "/uploads/kompozit/brand/favicon-32.png",
  favicon_32: "/uploads/kompozit/brand/favicon-32.png",
  apple_touch_icon: "/uploads/kompozit/brand/apple-touch-icon.png",
  meta: {
    title: "MOE Kompozit Admin Panel",
    description: "MOE Kompozit icin urun, galeri, teklif, blog ve site ayarlarini yoneten bagimsiz admin paneli.",
    og_url: "https://karbonkompozit.com.tr/admin",
    og_title: "MOE Kompozit Admin Panel",
    og_description: "Kompozit projeleri icin icerik, medya, teklif ve site ayari yonetim ekrani.",
    og_image: "/uploads/kompozit/brand/logo-light.png",
    twitter_card: "summary_large_image",
  },
};

export const APP_CONFIG = {
  name: DEFAULT_BRANDING.app_name,
  version: packageJson.version,
  copyright: `© ${currentYear}, ${DEFAULT_BRANDING.app_copyright}.`,
  meta: {
    title: DEFAULT_BRANDING.meta.title,
    description: DEFAULT_BRANDING.meta.description,
  },
  branding: DEFAULT_BRANDING,
} as const;
