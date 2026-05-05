"use client";

// =============================================================
// FILE: src/app/(main)/admin/(admin)/site-settings/admin-site_settings-client.tsx
// FINAL — Admin Site Settings Client (shadcn/ui theme, UsersListClient layout)
// - NO bootstrap classes
// - Tabs + Filters card + Content card
// - list/global_list use SiteSettingsList (shadcn)
// =============================================================

import * as React from "react";

import { RefreshCcw } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@ensotek/shared-ui/admin/ui/badge";
import { Button } from "@ensotek/shared-ui/admin/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ensotek/shared-ui/admin/ui/card";
import { Input } from "@ensotek/shared-ui/admin/ui/input";
import { Label } from "@ensotek/shared-ui/admin/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ensotek/shared-ui/admin/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ensotek/shared-ui/admin/ui/tabs";
import { useAdminTranslations } from "@/i18n";
import type { TranslateFn } from "@/i18n";
import { useListSiteSettingsAdminQuery } from "@/integrations/hooks";
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
  const isGlobalTab = tab === "smtp" || tab === "locales";

  return (
    <div className="w-full max-w-full space-y-6 overflow-x-hidden px-2 pb-6 md:px-0 md:pb-0">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="font-semibold text-lg">{t("admin.siteSettings.title")}</h1>
          <Badge variant="secondary">Kompozit</Badge>
        </div>
        <p className="text-muted-foreground text-sm">
          {isScopedBrand
            ? t("admin.siteSettings.scoped.description", { brand: String(brand || "") })
            : t("admin.siteSettings.description")}
        </p>
      </div>

      <Card>
        <CardHeader className="gap-2">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle className="text-base">{tabTitle(tab, t)}</CardTitle>
              <CardDescription>{tabDescription(tab, t)}</CardDescription>
            </div>

            <div className="flex items-center gap-2">
              {isGlobalTab ? <Badge variant="secondary">{t("admin.siteSettings.badges.global")}</Badge> : null}
              {!isGlobalTab && localeReady ? <Badge variant="secondary">{locale}</Badge> : null}
              {disabled ? <Badge variant="outline">{t("admin.siteSettings.messages.loading")}</Badge> : null}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 rounded-md border bg-muted/20 p-3 md:flex-row md:items-end md:justify-between">
            <div className="w-full space-y-2 md:max-w-xs">
              <Label>{t("admin.siteSettings.filters.language")}</Label>
              <Select
                value={localeReady ? locale : ""}
                onValueChange={(v) => {
                  setLocaleTouched(true);
                  setLocale(v);
                }}
                disabled={disabled || isGlobalTab}
              >
                <SelectTrigger className="w-full">
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
              title={t("admin.siteSettings.filters.refreshButton")}
            >
              <RefreshCcw className="size-4" />
              <span className="ml-2">{t("admin.siteSettings.filters.refreshButton")}</span>
            </Button>
          </div>

          {!localeReady ? (
            <div className="rounded-md border p-4 text-muted-foreground text-sm">
              {t("admin.siteSettings.management.loadingMeta")}
            </div>
          ) : (
            <Tabs value={tab} onValueChange={(v) => setTab(v as SettingsTab)}>
              <div className="-mx-2 overflow-x-auto px-2 md:mx-0 md:overflow-x-visible md:px-0">
                <TabsList className="inline-flex min-w-full flex-nowrap justify-start md:flex-wrap">
                  <TabsTrigger value="general" className="whitespace-nowrap">
                    {t("admin.siteSettings.tabs.general")}
                  </TabsTrigger>
                  <TabsTrigger value="seo" className="whitespace-nowrap">
                    {t("admin.siteSettings.tabs.seo")}
                  </TabsTrigger>
                  {!isScopedBrand ? (
                    <TabsTrigger value="smtp" className="whitespace-nowrap">
                      {t("admin.siteSettings.tabs.smtp")}
                    </TabsTrigger>
                  ) : null}
                  {!isScopedBrand ? (
                    <TabsTrigger value="cloudinary" className="whitespace-nowrap">
                      {t("admin.siteSettings.tabs.cloudinary")}
                    </TabsTrigger>
                  ) : null}
                  <TabsTrigger value="brand_media" className="whitespace-nowrap">
                    {t("admin.siteSettings.tabs.brandMedia")}
                  </TabsTrigger>
                  {!isScopedBrand ? (
                    <TabsTrigger value="api" className="whitespace-nowrap">
                      {t("admin.siteSettings.tabs.api")}
                    </TabsTrigger>
                  ) : null}
                  <TabsTrigger value="locales" className="whitespace-nowrap">
                    {t("admin.siteSettings.tabs.locales")}
                  </TabsTrigger>
                  {isScopedBrand ? (
                    <TabsTrigger value="home" className="whitespace-nowrap">
                      {t("admin.siteSettings.tabs.home")}
                    </TabsTrigger>
                  ) : null}
                  {!isScopedBrand ? (
                    <TabsTrigger value="branding" className="whitespace-nowrap">
                      {t("admin.siteSettings.tabs.branding")}
                    </TabsTrigger>
                  ) : null}
                </TabsList>
              </div>

              <TabsContent value="general" className="mt-4">
                <GeneralSettingsTab locale={locale} settingPrefix={brandPrefix} />
              </TabsContent>

              <TabsContent value="seo" className="mt-4">
                <SeoSettingsTab locale={locale} settingPrefix={brandPrefix} />
              </TabsContent>

              {!isScopedBrand ? (
                <TabsContent value="smtp" className="mt-4">
                  <SmtpSettingsTab locale={locale} />
                </TabsContent>
              ) : null}

              {!isScopedBrand ? (
                <TabsContent value="cloudinary" className="mt-4">
                  <CloudinarySettingsTab locale={locale} />
                </TabsContent>
              ) : null}

              <TabsContent value="brand_media" className="mt-4">
                <BrandMediaTab locale={locale} settingPrefix={brandPrefix} />
              </TabsContent>

              {!isScopedBrand ? (
                <TabsContent value="api" className="mt-4">
                  <ApiSettingsTab locale={locale} />
                </TabsContent>
              ) : null}

              <TabsContent value="locales" className="mt-4">
                <LocalesSettingsTab settingPrefix={brandPrefix} />
              </TabsContent>

              {isScopedBrand ? (
                <TabsContent value="home" className="mt-4">
                  <HomeSettingsTab locale={locale} settingPrefix={brandPrefix} />
                </TabsContent>
              ) : null}

              {!isScopedBrand ? (
                <TabsContent value="branding" className="mt-4">
                  <BrandingSettingsTab locale={locale} />
                </TabsContent>
              ) : null}
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
