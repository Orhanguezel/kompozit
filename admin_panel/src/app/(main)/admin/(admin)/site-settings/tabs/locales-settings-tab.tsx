"use client";

import * as React from "react";

import { RefreshCcw } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@ensotek/shared-ui/admin/ui/badge";
import { Button } from "@ensotek/shared-ui/admin/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ensotek/shared-ui/admin/ui/card";
import { Switch } from "@ensotek/shared-ui/admin/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@ensotek/shared-ui/admin/ui/table";
import { normLocaleTag, useAdminTranslations } from "@/i18n";
import { useListSiteSettingsAdminQuery, useUpdateSiteSettingAdminMutation } from "@/integrations/hooks";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

type LocaleRow = {
  code: string;
  label: string;
  is_active: boolean;
};

function nativeLocaleLabel(code: string): string {
  try {
    return new Intl.DisplayNames([code], { type: "language" }).of(code) || code.toUpperCase();
  } catch {
    return code.toUpperCase();
  }
}

function toShortLocale(v: unknown): string {
  return normLocaleTag(v);
}

function safeStr(v: unknown): string {
  return v === null || v === undefined ? "" : String(v);
}

function normalizeRows(raw: unknown): LocaleRow[] {
  const arr = Array.isArray(raw) ? raw : [];

  const out: LocaleRow[] = [];
  const seen = new Set<string>();

  for (const item of arr as any[]) {
    const code = toShortLocale(item?.code ?? item);
    if (!code || seen.has(code)) continue;
    seen.add(code);

    const label = safeStr(item?.label).trim();
    out.push({
      code,
      label: label || code.toUpperCase(),
      is_active: item?.is_active === undefined ? true : Boolean(item?.is_active),
    });
  }

  return out.sort((a, b) => {
    const aa = a.is_active ? 0 : 1;
    const bb = b.is_active ? 0 : 1;
    if (aa !== bb) return aa - bb;
    return a.code.localeCompare(b.code);
  });
}

const TOP_20_LOCALES_PRESET: LocaleRow[] = [
  "de",
  "en",
  "tr",
  "es",
  "fr",
  "it",
  "pt",
  "ru",
  "ar",
  "hi",
  "bn",
  "pa",
  "ja",
  "ko",
  "zh",
  "id",
  "vi",
  "th",
  "nl",
  "pl",
].map((code, index) => ({
  code,
  label: nativeLocaleLabel(code),
  is_active: index < 3,
}));

export function LocalesSettingsTab({ settingPrefix }: { settingPrefix?: string }) {
  const adminLocale = usePreferencesStore((s) => s.adminLocale);
  const t = useAdminTranslations(adminLocale || undefined);

  const appLocalesKey = `${settingPrefix || ""}app_locales`;
  const localesQ = useListSiteSettingsAdminQuery({
    locale: "*",
    keys: [appLocalesKey],
    limit: 20,
    offset: 0,
    sort: "key",
    order: "asc",
  });
  const [updateSetting, { isLoading: isSaving }] = useUpdateSiteSettingAdminMutation();

  const [rows, setRows] = React.useState<LocaleRow[]>([]);
  const [touched, setTouched] = React.useState(false);

  React.useEffect(() => {
    if (touched) return;
    const appLocalesRow = (localesQ.data ?? []).find((row) => row.key === appLocalesKey);
    setRows(normalizeRows(appLocalesRow?.value));
  }, [localesQ.data, appLocalesKey, touched]);

  const busy = isSaving || localesQ.isFetching || localesQ.isLoading;

  const persist = async (nextRows: LocaleRow[]) => {
    const payload = nextRows.map((r, index) => ({
      code: r.code,
      label: r.label,
      is_default: index === 0 && r.is_active,
      is_active: r.is_active,
    }));

    try {
      await updateSetting({ key: appLocalesKey, locale: "*", value: payload }).unwrap();
      toast.success(t("admin.siteSettings.locales.saved"));
    } catch (err: any) {
      const msg = err?.data?.error?.message || err?.message || t("admin.siteSettings.locales.saveError");
      toast.error(msg);
      throw err;
    }
  };

  const onToggleActive = async (code: string, val: boolean) => {
    const prevRows = rows;

    setTouched(true);
    const nextRows = rows.map((r) => (r.code === code ? { ...r, is_active: val } : r));
    setRows(nextRows);

    try {
      await persist(nextRows);
    } catch {
      setRows(prevRows);
      setTouched(false);
    }
  };

  const onPresetDeEnTr = async () => {
    const prevRows = rows;

    setTouched(true);
    const nextRows: LocaleRow[] = [
      { code: "de", label: nativeLocaleLabel("de"), is_active: true },
      { code: "en", label: nativeLocaleLabel("en"), is_active: true },
      { code: "tr", label: nativeLocaleLabel("tr"), is_active: true },
    ];
    setRows(nextRows);

    try {
      await persist(nextRows);
    } catch {
      setRows(prevRows);
      setTouched(false);
    }
  };

  const onPresetTop20 = async () => {
    const prevRows = rows;

    setTouched(true);
    const nextRows = TOP_20_LOCALES_PRESET.slice();
    setRows(nextRows);

    try {
      await persist(nextRows);
    } catch {
      setRows(prevRows);
      setTouched(false);
    }
  };

  return (
    <Card>
      <CardHeader className="gap-2">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-base">{t("admin.siteSettings.locales.title")}</CardTitle>
            <CardDescription>{t("admin.siteSettings.locales.description")}</CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {settingPrefix
                ? `${t("admin.siteSettings.badges.global")} · ${settingPrefix}`
                : t("admin.siteSettings.badges.global")}
            </Badge>
            {busy ? <Badge variant="outline">{t("admin.siteSettings.messages.loading")}</Badge> : null}
            <Button
              variant="outline"
              size="icon"
              disabled={busy}
              onClick={async () => {
                try {
                  await localesQ.refetch();
                } catch {
                  toast.error(t("admin.siteSettings.messages.error"));
                }
              }}
              title={t("admin.siteSettings.actions.refresh")}
            >
              <RefreshCcw className={busy ? "size-4 animate-spin" : "size-4"} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="rounded-md border border-dashed p-3 text-muted-foreground text-sm">
          {t("admin.siteSettings.locales.frontendFallbackNote")}
        </div>

        {!rows.length ? (
          <div className="rounded-md border p-4 text-muted-foreground text-sm">
            <div className="mb-3">{t("admin.siteSettings.locales.empty")}</div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={onPresetDeEnTr} disabled={busy}>
                {t("admin.siteSettings.locales.presetDeEnTr")}
              </Button>
              <Button variant="outline" onClick={onPresetTop20} disabled={busy}>
                {t("admin.siteSettings.locales.presetTop20")}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={onPresetDeEnTr} disabled={busy}>
                {t("admin.siteSettings.locales.presetDeEnTr")}
              </Button>
              <Button variant="outline" onClick={onPresetTop20} disabled={busy}>
                {t("admin.siteSettings.locales.presetTop20")}
              </Button>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-28">{t("admin.siteSettings.locales.table.code")}</TableHead>
                    <TableHead>{t("admin.siteSettings.locales.table.label")}</TableHead>
                    <TableHead className="w-28 text-center">{t("admin.siteSettings.locales.table.active")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((r) => (
                    <TableRow key={r.code}>
                      <TableCell className="font-mono text-sm">{r.code}</TableCell>
                      <TableCell className="text-sm">{r.label}</TableCell>
                      <TableCell className="text-center">
                        <div className="inline-flex justify-center">
                          <Switch
                            checked={r.is_active}
                            onCheckedChange={(v) => onToggleActive(r.code, Boolean(v))}
                            disabled={busy}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
