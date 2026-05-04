"use client";

// =============================================================
// FILE: src/app/(main)/admin/(admin)/site-settings/_components/SiteSettingsList.tsx
// guezelwebdesign – Site Ayarları Liste Bileşeni (shadcn/ui)
// - FIX: Hide SEO keys in global(*) list.
// - UI: Card + Table (desktop), Card list (mobile)
// - FIX: <a href> => next/link (no full reload)
// - Preview fallback -> object/array OR string(JSON) => JSON preview
// - NO inline styles
// =============================================================

import * as React from "react";

import Link from "next/link";

import { Badge } from "@ensotek/shared-ui/admin/ui/badge";
import { Button } from "@ensotek/shared-ui/admin/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ensotek/shared-ui/admin/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@ensotek/shared-ui/admin/ui/table";
import { useAdminTranslations } from "@/i18n";
import type { SettingValue, SiteSetting } from "@/integrations/shared";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

/* ----------------------------- helpers ----------------------------- */

function isSeoKey(key: string): boolean {
  const k = String(key || "")
    .trim()
    .toLowerCase();
  if (!k) return false;

  return (
    k === "seo" ||
    k === "site_seo" ||
    k === "site_meta_default" ||
    k.startsWith("seo_") ||
    k.startsWith("seo|") ||
    k.startsWith("site_seo|") ||
    k.startsWith("ui_seo") ||
    k.startsWith("ui_seo_")
  );
}

/**
 * Some rows may store JSON as string in DB.
 * For list preview, attempt to parse if it "looks like JSON".
 */
function coercePreviewValue(input: SettingValue): SettingValue {
  if (input === null || input === undefined) return input;

  if (typeof input === "object") return input;

  if (typeof input === "string") {
    const s = input.trim();
    if (!s) return input;

    const looksJson = (s.startsWith("{") && s.endsWith("}")) || (s.startsWith("[") && s.endsWith("]"));

    if (!looksJson) return input;

    try {
      return JSON.parse(s) as any;
    } catch {
      return input;
    }
  }

  return input;
}

function humanizeSettingKey(key: string): string {
  const raw = String(key || "").trim();
  if (!raw) return "";
  const noPrefix = raw.includes("__") ? raw.split("__").slice(1).join("__") : raw;
  return noPrefix
    .replace(/[_\-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

/* ----------------------------- types ----------------------------- */

export type SiteSettingsListProps = {
  settings?: SiteSetting[];
  loading: boolean;

  onEdit?: (setting: SiteSetting) => void;
  onDelete?: (setting: SiteSetting) => void;

  /**
   * Edit action can be a link.
   * Example: (s) => `/admin/site-settings/${encodeURIComponent(s.key)}?locale=${selectedLocale}`
   */
  getEditHref?: (setting: SiteSetting) => string;

  selectedLocale: string; // 'en' | 'de' | '*'
};

/* ----------------------------- component ----------------------------- */

export const SiteSettingsList: React.FC<SiteSettingsListProps> = ({
  settings,
  loading,
  onEdit,
  onDelete,
  getEditHref,
  selectedLocale,
}) => {
  const adminLocale = usePreferencesStore((s) => s.adminLocale);
  const t = useAdminTranslations(adminLocale || undefined);

  const filtered = React.useMemo(() => {
    const arr = Array.isArray(settings) ? settings : [];
    if (selectedLocale === "*") return arr.filter((s) => s && !isSeoKey(s.key));
    return arr;
  }, [settings, selectedLocale]);

  const hasData = filtered.length > 0;

  const dash = t("admin.siteSettings.list.dash", undefined, "—");

  const formatValuePreviewI18n = (v: SettingValue): string => {
    const vv = coercePreviewValue(v);
    if (vv === null || vv === undefined) return dash;

    if (typeof vv === "string") {
      const s = vv.trim();
      if (s.length <= 80) return s;
      return `${s.slice(0, 77)}...`;
    }

    if (typeof vv === "number" || typeof vv === "boolean") return String(vv);

    if (Array.isArray(vv)) {
      if (vv.length === 0) return "[]";
      return t("admin.siteSettings.list.preview.array", { count: vv.length }, `Array [${vv.length} items]`);
    }

    if (typeof vv === "object") {
      const keys = Object.keys(vv);
      if (keys.length === 0) return "{}";
      if (keys.length <= 3) return `{ ${keys.join(", ")} }`;
      return t("admin.siteSettings.list.preview.object", { count: keys.length }, `Object {${keys.length} fields}`);
    }

    try {
      const s = JSON.stringify(vv);
      if (s.length <= 80) return s;
      return `${s.slice(0, 77)}...`;
    } catch {
      return String(vv as any);
    }
  };

  const formatDateI18n = (v?: string | null): string => {
    if (!v) return dash;
    try {
      return new Date(v).toLocaleString(adminLocale || undefined);
    } catch {
      return dash;
    }
  };

  const renderEditAction = (s: SiteSetting) => {
    const href = getEditHref?.(s);

    if (href) {
      return (
        <Button asChild variant="outline" size="sm">
          <Link prefetch={false} href={href}>
            {t("admin.siteSettings.actions.edit")}
          </Link>
        </Button>
      );
    }

    if (onEdit) {
      return (
        <Button type="button" variant="outline" size="sm" onClick={() => onEdit(s)}>
          {t("admin.siteSettings.actions.edit")}
        </Button>
      );
    }

    return null;
  };

  return (
    <Card>
      <CardHeader className="gap-2">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-base">{t("admin.siteSettings.list.title")}</CardTitle>
            <CardDescription className="text-sm">
              <span className="text-muted-foreground">{t("admin.siteSettings.list.description")}</span>{" "}
              <span className="text-muted-foreground">
                (<span className="font-medium text-foreground">{selectedLocale || dash}</span>)
              </span>
              {selectedLocale === "*" ? (
                <span className="text-muted-foreground">
                  {" • "}
                  {t("admin.siteSettings.list.hideSeoNote")}
                </span>
              ) : null}
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            {selectedLocale ? <Badge variant="secondary">{selectedLocale}</Badge> : null}
            {loading ? <Badge variant="outline">{t("admin.siteSettings.messages.loading")}</Badge> : null}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* ===================== DESKTOP TABLE (md+) ===================== */}
        <div className="hidden md:block">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[25%]">{t("admin.siteSettings.list.columns.key")}</TableHead>
                  <TableHead className="w-[8%]">{t("admin.siteSettings.list.columns.locale")}</TableHead>
                  <TableHead className="w-[35%]">{t("admin.siteSettings.list.columns.value")}</TableHead>
                  <TableHead className="w-[15%]">{t("admin.siteSettings.list.columns.updatedAt")}</TableHead>
                  <TableHead className="w-[17%] text-right">{t("admin.siteSettings.list.columns.actions")}</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {hasData ? (
                  filtered.map((s) => (
                    <TableRow key={`${s.key}_${s.locale || "none"}`}>
                      <TableCell className="wrap-break-word align-top font-medium">
                        <div>{humanizeSettingKey(s.key)}</div>
                        <div className="mt-1 text-muted-foreground text-xs">
                          <code>{s.key}</code>
                        </div>
                      </TableCell>

                      <TableCell className="align-top">
                        {s.locale ? (
                          <Badge variant="outline">{s.locale}</Badge>
                        ) : (
                          <span className="text-muted-foreground">{dash}</span>
                        )}
                      </TableCell>

                      <TableCell className="align-top">
                        <div className="max-w-md overflow-hidden text-ellipsis text-muted-foreground text-xs">
                          <code className="rounded bg-muted px-1.5 py-0.5">{formatValuePreviewI18n(s.value)}</code>
                        </div>
                      </TableCell>

                      <TableCell className="align-top">
                        <span className="text-muted-foreground text-xs">{formatDateI18n(s.updated_at)}</span>
                      </TableCell>

                      <TableCell className="text-right align-top">
                        <div className="inline-flex items-center gap-2">
                          {renderEditAction(s)}
                          {onDelete ? (
                            <Button type="button" variant="destructive" size="sm" onClick={() => onDelete(s)}>
                              {t("admin.siteSettings.actions.delete")}
                            </Button>
                          ) : null}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                      {t("admin.siteSettings.list.noRecords")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* ===================== MOBILE CARDS (sm and down) ===================== */}
        <div className="md:hidden">
          <div className="rounded-md border">
            {hasData ? (
              <div className="divide-y">
                {filtered.map((s) => {
                  const editAction = renderEditAction(s);
                  return (
                    <div key={`${s.key}_${s.locale || "none"}`} className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <div className="wrap-break-word font-medium">{humanizeSettingKey(s.key)}</div>
                            <div className="w-full text-muted-foreground text-[11px]">
                              <code>{s.key}</code>
                            </div>
                            {s.locale ? <Badge variant="outline">{s.locale}</Badge> : null}
                          </div>

                          <div className="wrap-break-word text-muted-foreground text-xs">
                            {formatValuePreviewI18n(s.value)}
                          </div>

                          <div className="text-muted-foreground text-xs">
                            {t("admin.siteSettings.list.updatedAtLabel")}: {formatDateI18n(s.updated_at)}
                          </div>
                        </div>
                      </div>

                      {editAction || onDelete ? (
                        <div className="mt-4 grid gap-2">
                          {editAction ? <div className="grid">{editAction}</div> : null}
                          {onDelete ? (
                            <Button type="button" variant="destructive" size="sm" onClick={() => onDelete(s)}>
                              {t("admin.siteSettings.actions.delete")}
                            </Button>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-10 text-center text-muted-foreground text-sm">
                {t("admin.siteSettings.list.noRecords")}
              </div>
            )}
          </div>

          <div className="mt-2 text-muted-foreground text-xs">
            {t("admin.siteSettings.list.mobileNote")}
            {selectedLocale === "*" ? ` ${t("admin.siteSettings.list.mobileHideSeoSuffix")}` : ""}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

SiteSettingsList.displayName = "SiteSettingsList";
