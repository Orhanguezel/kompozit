"use client";

// =============================================================
// FILE: src/app/(main)/admin/(admin)/site-settings/admin-site_settings-client.tsx
// FINAL — Admin Site Settings Client (shadcn/ui theme, UsersListClient layout)
// - NO bootstrap classes
// - Tabs + Filters card + Content card
// - list/global_list use SiteSettingsList (shadcn)
// =============================================================

import * as React from "react";

import { ChevronRight, Globe, Home, ImageIcon, Languages, Mail, RefreshCcw, Settings, Sliders } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@ensotek/shared-ui/admin/ui/badge";
import { Button } from "@ensotek/shared-ui/admin/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ensotek/shared-ui/admin/ui/card";
import { Label } from "@ensotek/shared-ui/admin/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ensotek/shared-ui/admin/ui/select";
import { useAdminTranslations } from "@/i18n";
import type { TranslateFn } from "@/i18n";
import { useListSiteSettingsAdminQuery } from "@/integrations/hooks";
import { cn } from "@/lib/utils";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

import { ApiSettingsTab } from "../tabs/api-settings-tab";
import { BrandMediaTab } from "../tabs/brand-media-tab";
import { BrandingSettingsTab } from "../tabs/branding-settings-tab";
import { CloudinarySettingsTab } from "../tabs/cloudinary-settings-tab";
// tabs (content sources)
import { GeneralSettingsTab } from "../tabs/general-settings-tab";
import { HomeSettingsTab } from "../tabs/home-settings-tab";
import { LocalesSettingsTab } from "../tabs/locales-settings-tab";
import { SeoSettingsTab } from "../tabs/seo-settings-tab";
import { SmtpSettingsTab } from "../tabs/smtp-settings-tab";

/* ----------------------------- helpers ----------------------------- */

type SettingsTab =
  | "general"
  | "seo"
  | "smtp"
  | "cloudinary"
  | "brand_media"
  | "api"
  | "locales"
  | "branding"
  | "home";

type LocaleOption = { value: string; label: string; isDefault?: boolean; isActive?: boolean };
type LocaleConfigItem = {
  code?: string;
  label?: string;
  is_default?: boolean;
  is_active?: boolean;
};
type ErrorWithMessage = {
  data?: {
    error?:
      | {
          message?: string;
        }
      | string;
    message?: string;
  };
  error?: string;
};

type SettingsMenuItem = {
  value: SettingsTab;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
};

function getLocaleDisplayName(code: string): string {
  try {
    return new Intl.DisplayNames([code], { type: "language" }).of(code) || code;
  } catch {
    return code;
  }
}

function safeStr(v: unknown) {
  return v === null || v === undefined ? "" : String(v);
}

function getErrMessage(err: unknown, fallback: string): string {
  const anyErr = typeof err === "object" && err !== null ? (err as ErrorWithMessage) : undefined;
  const errField = anyErr?.data?.error;
  const m1 = typeof errField === "object" && errField !== null ? errField.message : undefined;
  if (typeof m1 === "string" && m1.trim()) return m1;
  const m1b = errField;
  if (typeof m1b === "string" && m1b.trim()) return m1b;
  const m2 = anyErr?.data?.message;
  if (typeof m2 === "string" && m2.trim()) return m2;
  const m3 = anyErr?.error;
  if (typeof m3 === "string" && m3.trim()) return m3;
  return fallback;
}

function buildLocalesOptions(appLocales: LocaleConfigItem[] | undefined, defaultLocale: unknown): LocaleOption[] {
  const items = Array.isArray(appLocales) ? appLocales : [];
  const def = typeof defaultLocale === "string" ? defaultLocale : safeStr(defaultLocale);

  const sorted = [...items].sort((a, b) => {
    const aa = a?.is_active === false ? 1 : 0;
    const bb = b?.is_active === false ? 1 : 0;
    if (aa !== bb) return aa - bb;
    return String(a?.code || "").localeCompare(String(b?.code || ""));
  });

  const mapped: LocaleOption[] = sorted
    .filter((x) => x?.code)
    .map((x) => {
      const code = String(x.code);
      const labelBase = x.label ? `${x.label} (${code})` : code;
      return {
        value: code,
        label: labelBase,
        isDefault: x.is_default === true,
        isActive: x.is_active !== false,
      };
    });

  if (!mapped.length) {
    return [
      {
        value: def || "de",
        label: `${getLocaleDisplayName(def || "de")} (${def || "de"})`,
        isDefault: true,
        isActive: true,
      },
      { value: "en", label: `${getLocaleDisplayName("en")} (en)`, isDefault: false, isActive: true },
      { value: "tr", label: `${getLocaleDisplayName("tr")} (tr)`, isDefault: false, isActive: true },
    ];
  }
  return mapped;
}

function pickInitialLocale(appLocales: LocaleConfigItem[] | undefined, defaultLocale: unknown): string {
  const items = Array.isArray(appLocales) ? appLocales : [];
  const def = typeof defaultLocale === "string" ? defaultLocale.trim() : safeStr(defaultLocale).trim();

  if (def) return def;

  const firstActive = items.find((x) => x?.is_active !== false && x?.code)?.code;
  return firstActive ? String(firstActive) : "de";
}

function tabTitle(tab: SettingsTab, t: TranslateFn): string {
  if (tab === "general") return t("admin.siteSettings.tabs.general");
  if (tab === "seo") return t("admin.siteSettings.tabs.seo");
  if (tab === "smtp") return t("admin.siteSettings.tabs.smtp");
  if (tab === "cloudinary") return t("admin.siteSettings.tabs.cloudinary");
  if (tab === "brand_media") return t("admin.siteSettings.tabs.brandMedia");
  if (tab === "api") return t("admin.siteSettings.tabs.api");
  if (tab === "locales") return t("admin.siteSettings.tabs.locales");
  if (tab === "branding") return t("admin.siteSettings.tabs.branding");
  return t("admin.siteSettings.tabs.home");
}

function tabDescription(tab: SettingsTab, t: TranslateFn): string {
  if (tab === "general") return t("admin.siteSettings.general.title");
  if (tab === "seo") return t("admin.siteSettings.tabs.seo");
  if (tab === "smtp") return t("admin.siteSettings.tabs.smtp");
  if (tab === "cloudinary") return t("admin.siteSettings.cloudinary.title");
  if (tab === "brand_media") return t("admin.siteSettings.brandMedia.title");
  if (tab === "api") return t("admin.siteSettings.api.title");
  if (tab === "locales") return t("admin.siteSettings.locales.title");
  if (tab === "branding") return t("admin.siteSettings.branding.title");
  return t("admin.siteSettings.management.homeContent");
}

/* ----------------------------- main component ----------------------------- */

const KOMPOZIT_BRAND = "kompozit";
const KOMPOZIT_PREFIX = "kompozit__";

export default function AdminSiteSettingsClient() {
  const brand = KOMPOZIT_BRAND;
  const brandPrefix = KOMPOZIT_PREFIX;
  const isScopedBrand = true;
  const appLocalesKey = `${brandPrefix || ""}app_locales`;
  const localeSettingsQ = useListSiteSettingsAdminQuery({
    locale: "*",
    keys: [appLocalesKey],
    limit: 20,
    offset: 0,
    sort: "key",
    order: "asc",
  });

  const localeRows = React.useMemo(() => {
    const row = (localeSettingsQ.data ?? []).find((item) => item.key === appLocalesKey);
    return Array.isArray(row?.value) ? (row.value as LocaleConfigItem[]) : [];
  }, [localeSettingsQ.data, appLocalesKey]);

  const localeOptions: LocaleOption[] = React.useMemo(() => buildLocalesOptions(localeRows, ""), [localeRows]);

  const initialLocale = React.useMemo(() => pickInitialLocale(localeRows, ""), [localeRows]);

  const [tab, setTab] = React.useState<SettingsTab>("general");
  const [locale, setLocale] = React.useState<string>("");
  const [localeTouched, setLocaleTouched] = React.useState<boolean>(false);

  const adminLocale = usePreferencesStore((s) => s.adminLocale);
  const t = useAdminTranslations(adminLocale || undefined);

  React.useEffect(() => {
    if (!localeTouched && adminLocale) {
      setLocale(adminLocale);
    }
  }, [adminLocale, localeTouched]);

  React.useEffect(() => {
    if (!locale && !localeTouched && initialLocale) {
      setLocale(initialLocale);
    }
  }, [initialLocale, locale, localeTouched]);

  const disabled = localeSettingsQ.isFetching || localeSettingsQ.isLoading;

  const onRefresh = async () => {
    try {
      await localeSettingsQ.refetch();
      toast.success(t("admin.siteSettings.filters.refreshed"));
    } catch (err) {
      toast.error(getErrMessage(err, t("admin.siteSettings.messages.error")));
    }
  };

  const localeReady = Boolean(locale?.trim());
  const isGlobalTab = tab === "smtp" || tab === "api" || tab === "locales";
  const menuItems: SettingsMenuItem[] = React.useMemo(
    () => [
      {
        value: "general",
        label: t("admin.siteSettings.tabs.general"),
        description: t("admin.siteSettings.general.title"),
        icon: Settings,
      },
      {
        value: "home",
        label: t("admin.siteSettings.tabs.home"),
        description: t("admin.siteSettings.management.homeContent"),
        icon: Home,
      },
      {
        value: "seo",
        label: t("admin.siteSettings.tabs.seo"),
        description: t("admin.siteSettings.tabs.seo"),
        icon: Globe,
      },
      {
        value: "brand_media",
        label: t("admin.siteSettings.tabs.brandMedia"),
        description: t("admin.siteSettings.brandMedia.title"),
        icon: ImageIcon,
      },
      {
        value: "smtp",
        label: t("admin.siteSettings.tabs.smtp"),
        description: t("admin.siteSettings.tabs.smtp"),
        icon: Mail,
      },
      {
        value: "api",
        label: t("admin.siteSettings.tabs.api"),
        description: t("admin.siteSettings.api.title"),
        icon: Sliders,
      },
      {
        value: "locales",
        label: t("admin.siteSettings.tabs.locales"),
        description: t("admin.siteSettings.locales.title"),
        icon: Languages,
      },
    ],
    [t],
  );

  const activeMenuItem = React.useMemo(
    () => menuItems.find((item) => item.value === tab) ?? menuItems[0],
    [menuItems, tab],
  );

  return (
    <div className="w-full max-w-full space-y-10 overflow-x-hidden pb-8">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-[var(--industrial-gold)]" />
            <span className="font-semibold text-[10px] uppercase tracking-[0.22em] text-[var(--industrial-gold)]">
              Kompozit Ayar Merkezi
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-serif text-3xl text-foreground md:text-4xl">{t("admin.siteSettings.title")}</h1>
              <Badge className="border border-[var(--industrial-gold)]/25 bg-[var(--industrial-gold)]/10 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-[var(--industrial-gold)] hover:bg-[var(--industrial-gold)]/10">
                Kompozit
              </Badge>
            </div>
            <p className="max-w-2xl text-muted-foreground text-sm leading-relaxed">
              {isScopedBrand
                ? t("admin.siteSettings.scoped.description", { brand: String(brand || "") })
                : t("admin.siteSettings.description")}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-[28px] border border-border/70 bg-card/60 p-4 shadow-sm backdrop-blur md:min-w-80">
          <div className="space-y-2">
            <Label className="ml-1 font-semibold text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {t("admin.siteSettings.filters.language")}
            </Label>
            <Select
              value={localeReady ? locale : ""}
              onValueChange={(v) => {
                setLocaleTouched(true);
                setLocale(v);
              }}
              disabled={disabled || isGlobalTab}
            >
              <SelectTrigger
                className={cn(
                  "h-12 rounded-2xl border-border/80 bg-background/40 text-sm transition-all focus:ring-[var(--industrial-gold)]/40",
                  isGlobalTab && "opacity-50 grayscale",
                )}
              >
                <SelectValue
                  placeholder={
                    isGlobalTab
                      ? t("admin.siteSettings.filters.globalPlaceholder")
                      : t("admin.siteSettings.filters.selectLanguage")
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {(localeOptions ?? []).map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                    {o.isDefault ? ` • ${t("admin.siteSettings.filters.defaultSuffix")}` : ""}
                    {o.isActive === false ? ` • ${t("admin.siteSettings.filters.inactiveSuffix")}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={onRefresh}
            disabled={disabled}
            className="h-11 rounded-2xl"
            title={t("admin.siteSettings.filters.refreshButton")}
          >
            <RefreshCcw className="size-4" />
            <span className="ml-2">{t("admin.siteSettings.filters.refreshButton")}</span>
          </Button>
        </div>
      </div>

      <div className="grid items-start gap-8 xl:grid-cols-[300px_1fr]">
        <aside className="space-y-5">
          <Card className="overflow-hidden rounded-[32px] border-border/70 bg-card/55 p-4 shadow-xl backdrop-blur">
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = tab === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setTab(item.value)}
                    className={cn(
                      "group flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left transition-all duration-200",
                      isActive
                        ? "border-[var(--industrial-gold)]/25 bg-[var(--industrial-gold)]/10 text-[var(--industrial-gold)] shadow-sm"
                        : "border-transparent text-muted-foreground hover:border-border hover:bg-muted/30 hover:text-foreground",
                    )}
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <Icon
                        className={cn(
                          "size-4 shrink-0 transition-colors",
                          isActive ? "text-[var(--industrial-gold)]" : "text-muted-foreground group-hover:text-foreground",
                        )}
                      />
                      <span className="truncate font-semibold text-[11px] uppercase tracking-[0.12em]">{item.label}</span>
                    </span>
                    {isActive ? <ChevronRight className="size-4 shrink-0 text-[var(--industrial-gold)]" /> : null}
                  </button>
                );
              })}
            </nav>
          </Card>

          <Card className="rounded-[32px] border-[var(--industrial-gold)]/15 bg-[var(--industrial-gold)]/[0.035] p-7 text-center shadow-inner backdrop-blur">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-[var(--industrial-gold)]/10 text-[var(--industrial-gold)] shadow-[0_0_18px_rgba(212,175,55,0.14)]">
              <Globe className="size-5" />
            </div>
            <h3 className="font-serif text-lg text-foreground">{t("admin.siteSettings.badges.global")}</h3>
            <p className="mt-3 text-muted-foreground text-[11px] uppercase leading-relaxed tracking-[0.12em]">
              SMTP, API ve dil ayarları tüm diller için ortak yönetilir.
            </p>
          </Card>
        </aside>

        <Card className="relative min-h-[700px] overflow-hidden rounded-[36px] border-border/70 bg-card/55 shadow-xl backdrop-blur">
          <div className="pointer-events-none absolute right-0 top-0 p-12 opacity-[0.035]">
            {activeMenuItem ? <activeMenuItem.icon className="size-72" /> : null}
          </div>

          <CardHeader className="border-b border-border/70 bg-muted/20 p-7 md:p-10">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
              <div className="space-y-2">
                <CardTitle className="font-serif text-2xl text-foreground md:text-3xl">
                  {activeMenuItem?.label ?? tabTitle(tab, t)}
                </CardTitle>
                <CardDescription className="max-w-2xl text-base leading-relaxed">
                  {activeMenuItem?.description ?? tabDescription(tab, t)}
                </CardDescription>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {isGlobalTab ? (
                  <Badge className="bg-[var(--industrial-gold)] px-4 py-1.5 text-[9px] uppercase tracking-[0.2em] text-[var(--carbon-onyx)] hover:bg-[var(--industrial-gold)]">
                    {t("admin.siteSettings.badges.global")}
                  </Badge>
                ) : null}
                {!isGlobalTab && localeReady ? (
                  <Badge
                    variant="outline"
                    className="border-[var(--industrial-gold)]/30 bg-[var(--industrial-gold)]/5 px-4 py-1.5 text-[9px] uppercase tracking-[0.2em] text-[var(--industrial-gold)]"
                  >
                    {locale}
                  </Badge>
                ) : null}
                {disabled ? (
                  <Badge variant="outline" className="px-4 py-1.5 text-[9px] uppercase tracking-[0.2em]">
                    {t("admin.siteSettings.messages.loading")}
                  </Badge>
                ) : null}
              </div>
            </div>
          </CardHeader>

          <CardContent className="relative z-10 p-5 md:p-10">
            {!localeReady ? (
              <div className="rounded-2xl border border-border/70 bg-background/30 p-5 text-muted-foreground text-sm">
                {t("admin.siteSettings.management.loadingMeta")}
              </div>
            ) : (
              <div className="animate-in fade-in zoom-in-95 duration-300">
                {tab === "general" ? <GeneralSettingsTab locale={locale} settingPrefix={brandPrefix} /> : null}

                {tab === "seo" ? <SeoSettingsTab locale={locale} settingPrefix={brandPrefix} /> : null}

                {tab === "smtp" ? <SmtpSettingsTab locale={locale} /> : null}

                {!isScopedBrand && tab === "cloudinary" ? <CloudinarySettingsTab locale={locale} /> : null}

                {tab === "brand_media" ? <BrandMediaTab locale={locale} settingPrefix={brandPrefix} /> : null}

                {tab === "api" ? <ApiSettingsTab locale={locale} /> : null}

                {tab === "locales" ? <LocalesSettingsTab settingPrefix={brandPrefix} /> : null}

                {isScopedBrand && tab === "home" ? (
                  <HomeSettingsTab locale={locale} settingPrefix={brandPrefix} />
                ) : null}

                {!isScopedBrand && tab === "branding" ? <BrandingSettingsTab locale={locale} /> : null}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
