// =============================================================
// FILE: src/app/(main)/admin/(admin)/site-settings/tabs/seo-settings-tab.tsx
// SEO Ayarları — Sayfa-bazlı inline düzenleme + canlı önizleme
// (goldmoodastro pattern; kompozit tokens & pages)
// =============================================================

"use client";

import React, { useMemo, useState } from "react";

import { Badge } from "@ensotek/shared-ui/admin/ui/badge";
import { Button } from "@ensotek/shared-ui/admin/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ensotek/shared-ui/admin/ui/card";
import { Input } from "@ensotek/shared-ui/admin/ui/input";
import { Label } from "@ensotek/shared-ui/admin/ui/label";
import { Switch } from "@ensotek/shared-ui/admin/ui/switch";
import { Textarea } from "@ensotek/shared-ui/admin/ui/textarea";
import { ChevronDown, ChevronUp, Globe, Save } from "lucide-react";
import { toast } from "sonner";

import { AdminImageUploadField } from "@/app/(main)/admin/_components/common/AdminImageUploadField";
import { useAdminTranslations } from "@/i18n";
import { useGetSiteSettingAdminByKeyQuery, useUpdateSiteSettingAdminMutation } from "@/integrations/hooks";
import { cn } from "@/lib/utils";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

// karbonkompozit.com.tr sayfa haritası
const PAGE_KEYS = [
  { key: "home", path: "/" },
  { key: "about", path: "/about" },
  { key: "contact", path: "/contact" },
  { key: "products", path: "/products" },
  { key: "product-detail", path: "/products/[slug]" },
  { key: "solutions", path: "/solutions" },
  { key: "solution-detail", path: "/solutions/[slug]" },
  { key: "gallery", path: "/gallery" },
  { key: "gallery-detail", path: "/gallery/[slug]" },
  { key: "references", path: "/references" },
  { key: "blog", path: "/blog" },
  { key: "blog-post", path: "/blog/[slug]" },
  { key: "offer", path: "/offer" },
  { key: "legal", path: "/legal/[slug]" },
] as const;

const SITE_DOMAIN = "www.karbonkompozit.com.tr";
const SITE_NAME_FALLBACK = "Karbonkompozit";

type PageSeo = {
  title: string;
  description: string;
  og_image: string;
  no_index: boolean;
};

function coerce(v: unknown): unknown {
  if (typeof v === "string") {
    try {
      return JSON.parse(v);
    } catch {
      return v;
    }
  }
  return v;
}

function extractPages(raw: any): Record<string, PageSeo> {
  const obj = (coerce(raw?.value ?? raw) as Record<string, any>) ?? {};
  const result: Record<string, PageSeo> = {};
  for (const cfg of PAGE_KEYS) {
    const p = obj[cfg.key];
    result[cfg.key] = {
      title: String(p?.title ?? ""),
      description: String(p?.description ?? ""),
      og_image: String(p?.og_image ?? ""),
      no_index: Boolean(p?.no_index),
    };
  }
  return result;
}

export type SeoSettingsTabProps = {
  locale: string;
  settingPrefix?: string;
};

export const SeoSettingsTab: React.FC<SeoSettingsTabProps> = ({ locale, settingPrefix }) => {
  const adminLocale = usePreferencesStore((s) => s.adminLocale);
  const t = useAdminTranslations(adminLocale || undefined);
  const fullKey = `${settingPrefix || ""}seo_pages`;

  const { data, isLoading, isFetching, refetch } = useGetSiteSettingAdminByKeyQuery(
    { key: fullKey, locale },
    { refetchOnMountOrArgChange: true },
  );

  const [updateSetting, { isLoading: isSaving }] = useUpdateSiteSettingAdminMutation();
  const busy = isLoading || isFetching || isSaving;

  const serverPages = useMemo(() => extractPages(data), [data]);
  const [localPages, setLocalPages] = useState<Record<string, PageSeo> | null>(null);
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set(["home"]));

  React.useEffect(() => {
    if (data) setLocalPages(extractPages(data));
  }, [data]);

  const pages = localPages ?? serverPages;

  const toggleExpand = (key: string) => {
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const expandAll = () => setExpandedKeys(new Set(PAGE_KEYS.map((c) => c.key)));
  const collapseAll = () => setExpandedKeys(new Set());

  const updatePage = (key: string, patch: Partial<PageSeo>) => {
    setLocalPages((prev) => {
      const base = prev ?? serverPages;
      return { ...base, [key]: { ...base[key], ...patch } };
    });
  };

  const handleSave = async () => {
    if (!localPages) return;
    try {
      await updateSetting({ key: fullKey, locale, value: localPages as any }).unwrap();
      toast.success(t("admin.siteSettings.seo.inline.saved", undefined, "SEO ayarları kaydedildi"));
      await refetch();
    } catch (err: any) {
      toast.error(err?.data?.error?.message || t("admin.siteSettings.seo.inline.saveError", undefined, "Kayıt hatası"));
    }
  };

  const isDirty = Boolean(localPages) && JSON.stringify(localPages) !== JSON.stringify(serverPages);

  return (
    <Card>
      <CardHeader className="gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base">
              {t("admin.siteSettings.seo.inline.title", undefined, "SEO Ayarları")}
            </CardTitle>
            <CardDescription>
              {t(
                "admin.siteSettings.seo.inline.description",
                undefined,
                "Her sayfa için title, description, OG görseli ve indexleme ayarı.",
              )}
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">
              {t("admin.siteSettings.filters.language")}: {locale}
            </Badge>
            {isDirty && (
              <Badge variant="outline" className="animate-pulse border-amber-500/40 bg-amber-500/10 text-amber-600">
                {t("admin.siteSettings.seo.inline.dirty", undefined, "Kaydedilmedi")}
              </Badge>
            )}
            <Button type="button" onClick={handleSave} disabled={busy || !isDirty} size="sm">
              <Save className="mr-2 size-4" />
              {t("admin.siteSettings.seo.inline.save", undefined, "Kaydet")}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {busy && !localPages && (
          <div className="flex justify-center py-6">
            <Badge variant="secondary" className="animate-pulse">
              {t("admin.siteSettings.seo.inline.loading", undefined, "Yükleniyor...")}
            </Badge>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={expandAll}>
            <ChevronDown className="mr-2 size-3.5" />
            {t("admin.siteSettings.seo.inline.expandAll", undefined, "Tümünü Aç")}
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={collapseAll}>
            <ChevronUp className="mr-2 size-3.5" />
            {t("admin.siteSettings.seo.inline.collapseAll", undefined, "Tümünü Kapat")}
          </Button>
        </div>

        <div className="space-y-3">
          {PAGE_KEYS.map((cfg) => {
            const page = pages[cfg.key] || { title: "", description: "", og_image: "", no_index: false };
            const isExpanded = expandedKeys.has(cfg.key);
            const pageLabel = t(`admin.siteSettings.seo.pageLabels.${cfg.key}`, undefined, cfg.key);

            return (
              <div
                key={cfg.key}
                className={cn(
                  "overflow-hidden rounded-lg border transition-colors",
                  isExpanded ? "border-primary/40 bg-card shadow-sm" : "border-border bg-card/50 hover:bg-card",
                )}
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 p-4 text-left focus:outline-none"
                  onClick={() => toggleExpand(cfg.key)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex size-9 items-center justify-center rounded-full border transition-colors",
                        isExpanded
                          ? "border-primary/30 bg-primary/10 text-primary"
                          : "border-border bg-muted text-muted-foreground",
                      )}
                    >
                      <Globe className="size-4" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={cn("font-medium text-sm", isExpanded ? "text-primary" : "text-foreground")}>
                          {pageLabel}
                        </span>
                        <code className="rounded border bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                          {cfg.path}
                        </code>
                        {page.no_index && (
                          <Badge variant="outline" className="border-destructive/40 bg-destructive/10 text-destructive">
                            noindex
                          </Badge>
                        )}
                      </div>
                      {!isExpanded && page.title && (
                        <p className="max-w-xl truncate text-muted-foreground text-xs">{page.title}</p>
                      )}
                    </div>
                  </div>
                  <div
                    className={cn(
                      "flex size-7 items-center justify-center rounded-full transition-colors",
                      isExpanded ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
                    )}
                  >
                    {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t bg-background/50 p-5">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1fr]">
                      {/* Sol: Form */}
                      <div className="space-y-5">
                        <div className="space-y-2">
                          <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                            {t("admin.siteSettings.seo.inline.fieldTitle", undefined, "Başlık (title)")}
                          </Label>
                          <Input
                            value={page.title}
                            onChange={(e) => updatePage(cfg.key, { title: e.target.value })}
                            disabled={busy}
                            placeholder={t(
                              "admin.siteSettings.seo.inline.placeholderTitle",
                              undefined,
                              "Karbonkompozit — ...",
                            )}
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                              {t("admin.siteSettings.seo.inline.fieldDescription", undefined, "Açıklama (description)")}
                            </Label>
                            <span
                              className={cn(
                                "font-mono text-[10px]",
                                page.description.length > 160 ? "text-amber-600" : "text-muted-foreground",
                              )}
                            >
                              {page.description.length} / 160
                            </span>
                          </div>
                          <Textarea
                            value={page.description}
                            onChange={(e) => updatePage(cfg.key, { description: e.target.value })}
                            disabled={busy}
                            rows={3}
                            placeholder={t(
                              "admin.siteSettings.seo.inline.placeholderDescription",
                              undefined,
                              "Sayfanın kısa özeti — ideal 140-160 karakter.",
                            )}
                          />
                        </div>

                        <div className="rounded-lg border bg-muted/30 p-4">
                          <AdminImageUploadField
                            label={t("admin.siteSettings.seo.inline.ogImage", undefined, "OG Görsel (1200×630)")}
                            folder={`seo/${cfg.key}`}
                            bucket="public"
                            metadata={{ module_key: "seo", page: cfg.key, locale }}
                            value={page.og_image}
                            onChange={(url) => updatePage(cfg.key, { og_image: url })}
                            disabled={busy}
                          />
                        </div>

                        <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
                          <Switch
                            checked={page.no_index}
                            onCheckedChange={(v) => updatePage(cfg.key, { no_index: v })}
                            disabled={busy}
                          />
                          <Label className="text-sm">
                            {t(
                              "admin.siteSettings.seo.inline.noindex",
                              undefined,
                              "Bu sayfayı arama motorlarından gizle (noindex)",
                            )}
                          </Label>
                        </div>
                      </div>

                      {/* Sağ: Önizlemeler */}
                      <div className="space-y-5">
                        <div className="space-y-2">
                          <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                            {t("admin.siteSettings.seo.inline.googlePreview", undefined, "Google Önizleme")}
                          </Label>
                          <div className="rounded-lg border bg-[#202124] p-4 shadow-inner">
                            <div className="space-y-1">
                              <p className="truncate font-sans text-[11px] text-[#dadce0]">
                                {SITE_DOMAIN} › {locale}
                                {cfg.path === "/" ? "" : cfg.path}
                              </p>
                              <p className="cursor-pointer truncate font-sans text-[18px] text-[#8ab4f8] hover:underline">
                                {page.title ||
                                  t("admin.siteSettings.seo.inline.siteName", undefined, SITE_NAME_FALLBACK)}
                              </p>
                              <p className="line-clamp-2 font-sans text-[13px] text-[#bdc1c6] leading-snug">
                                {page.description ||
                                  t(
                                    "admin.siteSettings.seo.inline.noDescription",
                                    undefined,
                                    "Henüz açıklama girilmedi.",
                                  )}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                            {t("admin.siteSettings.seo.inline.socialPreview", undefined, "Sosyal Medya Önizleme")}
                          </Label>
                          <div className="flex flex-col overflow-hidden rounded-lg border shadow-inner">
                            <div className="relative flex aspect-[1.91/1] items-center justify-center border-b bg-muted">
                              {page.og_image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={page.og_image}
                                  alt=""
                                  className="absolute inset-0 size-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = "none";
                                  }}
                                />
                              ) : (
                                <div className="space-y-2 text-center opacity-60">
                                  <Globe className="mx-auto size-8 text-muted-foreground" />
                                  <span className="block text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                                    {t("admin.siteSettings.seo.inline.noOgImage", undefined, "OG görsel yok")}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="space-y-1 bg-card p-4">
                              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                                karbonkompozit.com.tr
                              </p>
                              <p className="truncate font-semibold text-foreground text-sm">
                                {page.title ||
                                  t("admin.siteSettings.seo.inline.siteName", undefined, SITE_NAME_FALLBACK)}
                              </p>
                              <p className="line-clamp-2 text-muted-foreground text-xs leading-relaxed">
                                {page.description ||
                                  t(
                                    "admin.siteSettings.seo.inline.noDescription",
                                    undefined,
                                    "Henüz açıklama girilmedi.",
                                  )}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {isDirty && (
          <div className="flex justify-end border-t pt-4">
            <Button type="button" onClick={handleSave} disabled={busy}>
              <Save className="mr-2 size-4" />
              {t("admin.siteSettings.seo.inline.saveAll", undefined, "Tümünü Kaydet")}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
