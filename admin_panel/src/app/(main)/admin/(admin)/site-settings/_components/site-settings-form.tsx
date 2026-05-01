"use client";

// =============================================================
// FILE: src/components/admin/site-settings/SiteSettingsForm.tsx
// guezelwebdesign – Site Settings Unified Form (shadcn/ui)
// - NO bootstrap classes
// - Mode: Tabs (Structured / Raw)
// - Raw: single textarea, JSON parse fallback
// - Structured: separate state
// - Image upload supports open library (no full reload)
// - App Router safe (next/navigation)
// =============================================================

import * as React from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { AdminImageUploadField } from "@/app/(main)/admin/_components/common/AdminImageUploadField";
import { Alert, AlertDescription, AlertTitle } from "@ensotek/shared-ui/admin/ui/alert";
import { Badge } from "@ensotek/shared-ui/admin/ui/badge";
import { Button } from "@ensotek/shared-ui/admin/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ensotek/shared-ui/admin/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@ensotek/shared-ui/admin/ui/tabs";
import { Textarea } from "@ensotek/shared-ui/admin/ui/textarea";
import { useAdminTranslations } from "@/i18n";
import type { SettingValue, SiteSetting } from "@/integrations/shared";
import { isKompozitHomeSettingKey, parseKompozitHomeSettingRawText } from "@/lib/kompozit-home-settings-admin";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

/* ----------------------------- types ----------------------------- */

export type SiteSettingsFormMode = "structured" | "raw";

export type SiteSettingsFormProps = {
  settingKey: string;
  locale: string;
  row?: SiteSetting | null;
  disabled?: boolean;
  initialMode?: SiteSettingsFormMode;

  onSave: (args: { key: string; locale: string; value: SettingValue }) => Promise<void>;
  onDelete?: (args: { key: string; locale?: string }) => Promise<void>;

  renderStructured?: (ctx: {
    key: string;
    locale: string;
    value: SettingValue;
    setValue: (next: SettingValue) => void;
    disabled?: boolean;
  }) => React.ReactNode;

  showImageUpload?: boolean;

  imageUpload?: {
    label?: string;
    helperText?: React.ReactNode;
    bucket?: string;
    folder?: string;
    metadata?: Record<string, string | number | boolean>;
    value?: string;
    onChange?: (url: string) => void;

    /** optional: open storage library */
    openLibraryHref?: string;
    onOpenLibraryClick?: () => void;
  };
};

type ErrorWithMessage = {
  data?: {
    error?: {
      message?: string;
    };
    message?: string;
  };
  message?: string;
};

/* ----------------------------- helpers ----------------------------- */

export function coerceSettingValue(input: unknown): SettingValue {
  if (input === null || input === undefined) return null;
  if (typeof input === "object") return input as SettingValue;

  if (typeof input === "string") {
    const s = input.trim();
    if (!s) return input;

    const looksJson = (s.startsWith("{") && s.endsWith("}")) || (s.startsWith("[") && s.endsWith("]"));

    if (!looksJson) return input;

    try {
      return JSON.parse(s) as SettingValue;
    } catch {
      return input;
    }
  }

  return input as SettingValue;
}

function prettyStringify(v: SettingValue) {
  try {
    return JSON.stringify(v ?? {}, null, 2);
  } catch {
    return "";
  }
}

function parseRawOrString(text: string): SettingValue {
  const trimmed = (text ?? "").trim();
  if (!trimmed) return null;

  try {
    return JSON.parse(trimmed) as SettingValue;
  } catch {
    return trimmed;
  }
}

function errMsg(err: unknown, fallback: string): string {
  const safeErr = typeof err === "object" && err !== null ? (err as ErrorWithMessage) : undefined;
  return safeErr?.data?.error?.message || safeErr?.data?.message || safeErr?.message || fallback;
}

/* ----------------------------- component ----------------------------- */

export const SiteSettingsForm: React.FC<SiteSettingsFormProps> = ({
  settingKey,
  locale,
  row,
  disabled,
  initialMode = "structured",
  onSave,
  onDelete,
  renderStructured,
  showImageUpload,
  imageUpload,
}) => {
  const router = useRouter();
  const adminLocale = usePreferencesStore((s) => s.adminLocale);
  const t = useAdminTranslations(adminLocale || undefined);

  const canStructured = typeof renderStructured === "function";

  // Mode
  const [mode, setMode] = React.useState<SiteSettingsFormMode>(
    initialMode === "structured" && !canStructured ? "raw" : initialMode,
  );

  // structured
  const [structuredValue, setStructuredValue] = React.useState<SettingValue>({});

  // raw
  const [rawText, setRawText] = React.useState<string>("");

  const coercedInitial = React.useMemo(() => coerceSettingValue(row?.value), [row?.value]);

  // sync on key/locale/row change
  React.useEffect(() => {
    setStructuredValue(coercedInitial ?? {});
    if (typeof row?.value === "string") setRawText(row.value ?? "");
    else setRawText(prettyStringify(coercedInitial));
  }, [coercedInitial, row?.value]);

  // guard: if structured renderer missing, force raw
  React.useEffect(() => {
    if (mode === "structured" && !canStructured) setMode("raw");
  }, [mode, canStructured]);

  const kompozitHomeParse = React.useMemo(() => {
    if (!isKompozitHomeSettingKey(settingKey) || mode !== "raw") return null;
    return parseKompozitHomeSettingRawText(rawText);
  }, [settingKey, mode, rawText]);

  const openLibraryHref = imageUpload?.openLibraryHref ?? "/admin/storage";
  const onOpenLibraryClick = imageUpload?.onOpenLibraryClick ?? (() => router.push(openLibraryHref));

  const handleSave = async () => {
    if (disabled) return;

    try {
      if (mode === "raw" && isKompozitHomeSettingKey(settingKey)) {
        const parsed = parseKompozitHomeSettingRawText(rawText);
        if (parsed.status === "invalid") {
          const detail =
            parsed.message === "root_must_be_object"
              ? t("admin.siteSettings.form.kompozitHome.mustBeObject")
              : parsed.message;
          toast.error(t("admin.siteSettings.form.kompozitHome.parseError", { message: detail }));
          return;
        }
      }

      const valueToSave: SettingValue = mode === "raw" ? parseRawOrString(rawText) : structuredValue;

      await onSave({ key: settingKey, locale, value: valueToSave });
      toast.success(t("admin.siteSettings.form.saved", { key: settingKey, locale }));
    } catch (err) {
      toast.error(errMsg(err, t("admin.siteSettings.form.saveError")));
    }
  };

  const handleDelete = async () => {
    if (!onDelete || disabled) return;

    const ok = window.confirm(t("admin.siteSettings.form.deleteConfirm", { key: settingKey, locale }));
    if (!ok) return;

    try {
      await onDelete({ key: settingKey, locale });
      toast.success(t("admin.siteSettings.form.deleted", { key: settingKey, locale }));
    } catch (err) {
      toast.error(errMsg(err, t("admin.siteSettings.form.deleteError")));
    }
  };

  return (
    <Card>
      <CardHeader className="gap-3">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base">
              {t("admin.siteSettings.form.title")}: <code>{settingKey}</code>
              <Badge variant="secondary" className="ml-2 align-middle">
                {locale}
              </Badge>
              {isKompozitHomeSettingKey(settingKey) ? (
                <Badge variant="outline" className="ml-2 align-middle">
                  {t("admin.siteSettings.form.kompozitHome.badge")}
                </Badge>
              ) : null}
            </CardTitle>
            <CardDescription>
              {isKompozitHomeSettingKey(settingKey)
                ? t("admin.siteSettings.form.kompozitHome.docHint")
                : t("admin.siteSettings.form.description")}
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onDelete ? (
              <Button type="button" variant="outline" onClick={handleDelete} disabled={disabled}>
                {t("admin.siteSettings.actions.delete")}
              </Button>
            ) : null}

            <Button type="button" onClick={handleSave} disabled={disabled}>
              {t("admin.siteSettings.actions.save")}
            </Button>
          </div>
        </div>

        {/* Mode tabs */}
        <Tabs value={mode} onValueChange={(v) => setMode(v === "raw" ? "raw" : "structured")}>
          <TabsList className="w-fit">
            <TabsTrigger value="structured" disabled={!canStructured || !!disabled}>
              {t("admin.siteSettings.form.modes.structured")}
            </TabsTrigger>
            <TabsTrigger value="raw" disabled={!!disabled}>
              {t("admin.siteSettings.form.modes.raw")}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>

      <CardContent className="space-y-4">
        {showImageUpload ? (
          <div>
            <AdminImageUploadField
              label={imageUpload?.label ?? t("admin.siteSettings.form.imageLabel")}
              helperText={imageUpload?.helperText}
              bucket={imageUpload?.bucket ?? "public"}
              folder={imageUpload?.folder ?? "uploads"}
              metadata={imageUpload?.metadata}
              value={imageUpload?.value ?? ""}
              onChange={(url) => imageUpload?.onChange?.(url)}
              disabled={disabled}
              openLibraryHref={openLibraryHref}
              onOpenLibraryClick={onOpenLibraryClick}
            />
          </div>
        ) : null}

        {mode === "structured" ? (
          canStructured ? (
            <div className="space-y-4">
              <div>
                {renderStructured?.({
                  key: settingKey,
                  locale,
                  value: structuredValue,
                  setValue: setStructuredValue,
                  disabled,
                })}
              </div>
            </div>
          ) : (
            <Alert>
              <AlertTitle>{t("admin.siteSettings.form.structuredMissingTitle")}</AlertTitle>
              <AlertDescription>{t("admin.siteSettings.form.structuredMissingDesc")}</AlertDescription>
            </Alert>
          )
        ) : (
          <div className="space-y-3">
            <div className="text-muted-foreground text-sm">
              {isKompozitHomeSettingKey(settingKey)
                ? t("admin.siteSettings.form.kompozitHome.rawHelp")
                : t("admin.siteSettings.form.rawHelp")}
            </div>

            <Textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              rows={14}
              disabled={disabled}
              spellCheck={false}
              className="font-mono"
              placeholder={t("admin.siteSettings.form.rawPlaceholder")}
            />

            {kompozitHomeParse?.status === "invalid" ? (
              <Alert variant="destructive">
                <AlertTitle>{t("admin.siteSettings.form.kompozitHome.parseErrorTitle")}</AlertTitle>
                <AlertDescription>
                  {kompozitHomeParse.message === "root_must_be_object"
                    ? t("admin.siteSettings.form.kompozitHome.mustBeObject")
                    : kompozitHomeParse.message}
                </AlertDescription>
              </Alert>
            ) : null}

            {kompozitHomeParse?.status === "valid" ? (
              <div className="space-y-2 rounded-md border bg-muted/30 p-3">
                <p className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                  {t("admin.siteSettings.form.kompozitHome.previewTitle")}
                </p>
                <ScrollArea className="max-h-56 w-full rounded-md border bg-background">
                  <pre className="p-3 text-xs leading-relaxed">{JSON.stringify(kompozitHomeParse.value, null, 2)}</pre>
                </ScrollArea>
              </div>
            ) : null}

            {kompozitHomeParse?.status === "empty" && isKompozitHomeSettingKey(settingKey) ? (
              <p className="text-muted-foreground text-xs">{t("admin.siteSettings.form.kompozitHome.emptyHint")}</p>
            ) : null}

            <div className="text-muted-foreground text-xs">{t("admin.siteSettings.form.rawTip")}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

SiteSettingsForm.displayName = "SiteSettingsForm";
