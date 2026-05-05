"use client";

// =============================================================
// FILE: src/app/(main)/admin/(admin)/site-settings/tabs/api-settings-tab.tsx
// API & Entegrasyon Ayarları (GLOBAL)
// - Shadcn/ui components
// - Responsive design
// - TypeScript safe
// =============================================================

import * as React from "react";

import { RefreshCcw } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@ensotek/shared-ui/admin/ui/badge";
import { Button } from "@ensotek/shared-ui/admin/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ensotek/shared-ui/admin/ui/card";
import { Input } from "@ensotek/shared-ui/admin/ui/input";
import { Label } from "@ensotek/shared-ui/admin/ui/label";
import { Textarea } from "@ensotek/shared-ui/admin/ui/textarea";
import { useAdminTranslations } from "@/i18n";
import { useListSiteSettingsAdminQuery, useUpdateSiteSettingAdminMutation } from "@/integrations/hooks";
import type { SettingValue } from "@/integrations/shared";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

export type ApiSettingsTabProps = {
  locale: string;
};

const API_KEYS = [
  "ai_provider",
  "ai_provider_order",
  "openai_api_key",
  "openai_model",
  "groq_api_key",
  "groq_model",
  "anthropic_api_key",
  "anthropic_model",
  "google_analytics_id",
  "google_tag_manager_id",
  "google_client_id",
  "google_client_secret",
  "recaptcha_site_key",
  "recaptcha_secret_key",
  "gtm_container_id",
  "ga4_measurement_id",
  "cookie_consent",
] as const;

type ApiKey = (typeof API_KEYS)[number];
type ApiForm = Record<ApiKey, string>;

const EMPTY_FORM: ApiForm = {
  ai_provider: "",
  ai_provider_order: "",
  openai_api_key: "",
  openai_model: "",
  groq_api_key: "",
  groq_model: "",
  anthropic_api_key: "",
  anthropic_model: "",
  google_analytics_id: "",
  google_tag_manager_id: "",
  google_client_id: "",
  google_client_secret: "",
  recaptcha_site_key: "",
  recaptcha_secret_key: "",
  gtm_container_id: "",
  ga4_measurement_id: "",
  cookie_consent: "",
};

function valueToString(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") return String(v);
  try {
    return JSON.stringify(v, null, 2);
  } catch {
    return String(v);
  }
}

function toMap(settings?: any) {
  const map = new Map<string, any>();
  if (settings) for (const s of settings) map.set(s.key, s);
  return map;
}

function tryParseJsonOrString(input: string): SettingValue {
  const s = String(input ?? "").trim();
  if (!s) return "" as any;
  try {
    return JSON.parse(s) as any;
  } catch {
    return s as any;
  }
}

export const ApiSettingsTab: React.FC<ApiSettingsTabProps> = ({ locale }) => {
  const {
    data: settings,
    isLoading,
    isFetching,
    refetch,
  } = useListSiteSettingsAdminQuery({
    keys: API_KEYS as unknown as string[],
    locale: "*", // ✅ Global settings
  } as any);

  const [updateSetting, { isLoading: isSaving }] = useUpdateSiteSettingAdminMutation();

  const [form, setForm] = React.useState<ApiForm>(EMPTY_FORM);

  const adminLocale = usePreferencesStore((s) => s.adminLocale);
  const t = useAdminTranslations(adminLocale || undefined);

  React.useEffect(() => {
    const map = toMap(settings);
    const next: ApiForm = { ...EMPTY_FORM };
    API_KEYS.forEach((k) => {
      next[k] = valueToString(map.get(k)?.value);
    });
    setForm(next);
  }, [settings]);

  const loading = isLoading || isFetching;
  const busy = loading || isSaving;

  const handleChange = (field: ApiKey, value: string) => setForm((p) => ({ ...p, [field]: value }));

  const handleSave = async () => {
    try {
      const updates: { key: ApiKey; value: SettingValue }[] = API_KEYS.map((key) => ({
        key,
        value: key === "cookie_consent" ? tryParseJsonOrString(form[key]) : form[key].trim(),
      }));

      for (const u of updates) {
        await updateSetting({ key: u.key, value: u.value, locale: "*" }).unwrap();
      }

      toast.success(t("admin.siteSettings.api.saved"));
      await refetch();
    } catch (err: any) {
      const msg = err?.data?.error?.message || err?.message || t("admin.siteSettings.api.saveError");
      toast.error(msg);
    }
  };

  return (
    <Card>
      <CardHeader className="gap-2">
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base">{t("admin.siteSettings.api.title")}</CardTitle>
            <CardDescription>{t("admin.siteSettings.api.description")}</CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{t("admin.siteSettings.api.badge")}</Badge>
            {locale && <Badge variant="outline">{t("admin.siteSettings.api.uiBadge", { locale })}</Badge>}
            {busy && <Badge variant="outline">{t("admin.siteSettings.messages.loading")}</Badge>}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
              disabled={busy}
              title={t("admin.siteSettings.actions.refresh")}
            >
              <RefreshCcw className="size-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="text-muted-foreground text-sm">{t("admin.siteSettings.api.note")}</div>

        <div className="space-y-3 rounded-md border p-4">
          <div>
            <h3 className="font-medium text-sm">AI Entegrasyonu</h3>
            <p className="text-muted-foreground text-xs">OpenAI, Groq ve Anthropic servis ayarları.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ai_provider">Varsayılan Provider</Label>
              <Input
                id="ai_provider"
                value={form.ai_provider}
                onChange={(e) => handleChange("ai_provider", e.target.value)}
                placeholder="auto"
                disabled={busy}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ai_provider_order">Provider Sırası</Label>
              <Input
                id="ai_provider_order"
                value={form.ai_provider_order}
                onChange={(e) => handleChange("ai_provider_order", e.target.value)}
                placeholder="openai,anthropic,grok"
                disabled={busy}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="openai_api_key">OpenAI API Key</Label>
              <Input
                id="openai_api_key"
                type="password"
                value={form.openai_api_key}
                onChange={(e) => handleChange("openai_api_key", e.target.value)}
                disabled={busy}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="openai_model">OpenAI Model</Label>
              <Input
                id="openai_model"
                value={form.openai_model}
                onChange={(e) => handleChange("openai_model", e.target.value)}
                placeholder="gpt-4o-mini"
                disabled={busy}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="groq_api_key">Groq API Key</Label>
              <Input
                id="groq_api_key"
                type="password"
                value={form.groq_api_key}
                onChange={(e) => handleChange("groq_api_key", e.target.value)}
                disabled={busy}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="groq_model">Groq Model</Label>
              <Input
                id="groq_model"
                value={form.groq_model}
                onChange={(e) => handleChange("groq_model", e.target.value)}
                placeholder="llama-3.3-70b-versatile"
                disabled={busy}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="anthropic_api_key">Anthropic API Key</Label>
              <Input
                id="anthropic_api_key"
                type="password"
                value={form.anthropic_api_key}
                onChange={(e) => handleChange("anthropic_api_key", e.target.value)}
                disabled={busy}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="anthropic_model">Anthropic Model</Label>
              <Input
                id="anthropic_model"
                value={form.anthropic_model}
                onChange={(e) => handleChange("anthropic_model", e.target.value)}
                placeholder="claude-3-5-haiku-latest"
                disabled={busy}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Google Client ID */}
          <div className="space-y-2">
            <Label htmlFor="google_client_id">
              {t("admin.siteSettings.api.googleClientId")}
              <code className="ml-2 text-muted-foreground text-xs">(google_client_id)</code>
            </Label>
            <Input
              id="google_client_id"
              value={form.google_client_id}
              onChange={(e) => handleChange("google_client_id", e.target.value)}
              placeholder="Google OAuth Client ID"
              disabled={busy}
            />
            <p className="text-muted-foreground text-xs">{t("admin.siteSettings.api.googleClientIdHelp")}</p>
          </div>

          {/* Google Client Secret */}
          <div className="space-y-2">
            <Label htmlFor="google_client_secret">
              {t("admin.siteSettings.api.googleClientSecret")}
              <code className="ml-2 text-muted-foreground text-xs">(google_client_secret)</code>
            </Label>
            <Input
              id="google_client_secret"
              type="password"
              value={form.google_client_secret}
              onChange={(e) => handleChange("google_client_secret", e.target.value)}
              placeholder="Google OAuth Client Secret"
              disabled={busy}
            />
            <p className="text-muted-foreground text-xs">{t("admin.siteSettings.api.googleClientSecretHelp")}</p>
          </div>

          {/* GTM Container ID */}
          <div className="space-y-2">
            <Label htmlFor="gtm_container_id">
              {t("admin.siteSettings.api.gtmContainerId")}
              <code className="ml-2 text-muted-foreground text-xs">(gtm_container_id)</code>
            </Label>
            <Input
              id="gtm_container_id"
              value={form.gtm_container_id}
              onChange={(e) => handleChange("gtm_container_id", e.target.value)}
              placeholder={t("admin.siteSettings.api.gtmContainerIdPlaceholder")}
              disabled={busy}
            />
            <p className="text-muted-foreground text-xs">{t("admin.siteSettings.api.gtmContainerIdHelp")}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="google_tag_manager_id">
              Google Tag Manager
              <code className="ml-2 text-muted-foreground text-xs">(google_tag_manager_id)</code>
            </Label>
            <Input
              id="google_tag_manager_id"
              value={form.google_tag_manager_id}
              onChange={(e) => handleChange("google_tag_manager_id", e.target.value)}
              placeholder="GTM-XXXXXXX"
              disabled={busy}
            />
          </div>

          {/* GA4 Measurement ID */}
          <div className="space-y-2">
            <Label htmlFor="ga4_measurement_id">
              {t("admin.siteSettings.api.ga4MeasurementId")}
              <code className="ml-2 text-muted-foreground text-xs">(ga4_measurement_id)</code>
            </Label>
            <Input
              id="ga4_measurement_id"
              value={form.ga4_measurement_id}
              onChange={(e) => handleChange("ga4_measurement_id", e.target.value)}
              placeholder={t("admin.siteSettings.api.ga4MeasurementIdPlaceholder")}
              disabled={busy}
            />
            <p className="text-muted-foreground text-xs">{t("admin.siteSettings.api.ga4MeasurementIdHelp")}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="google_analytics_id">
              Google Analytics
              <code className="ml-2 text-muted-foreground text-xs">(google_analytics_id)</code>
            </Label>
            <Input
              id="google_analytics_id"
              value={form.google_analytics_id}
              onChange={(e) => handleChange("google_analytics_id", e.target.value)}
              placeholder="G-XXXXXXXXXX"
              disabled={busy}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recaptcha_site_key">
              reCAPTCHA Site Key
              <code className="ml-2 text-muted-foreground text-xs">(recaptcha_site_key)</code>
            </Label>
            <Input
              id="recaptcha_site_key"
              type="password"
              value={form.recaptcha_site_key}
              onChange={(e) => handleChange("recaptcha_site_key", e.target.value)}
              disabled={busy}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recaptcha_secret_key">
              reCAPTCHA Secret Key
              <code className="ml-2 text-muted-foreground text-xs">(recaptcha_secret_key)</code>
            </Label>
            <Input
              id="recaptcha_secret_key"
              type="password"
              value={form.recaptcha_secret_key}
              onChange={(e) => handleChange("recaptcha_secret_key", e.target.value)}
              disabled={busy}
            />
          </div>
        </div>

        {/* Cookie Consent - Full Width */}
        <div className="space-y-2">
          <Label htmlFor="cookie_consent">
            {t("admin.siteSettings.api.cookieConsent")}
            <code className="ml-2 text-muted-foreground text-xs">(cookie_consent)</code>
          </Label>
          <Textarea
            id="cookie_consent"
            rows={10}
            value={form.cookie_consent}
            onChange={(e) => handleChange("cookie_consent", e.target.value)}
            placeholder={t("admin.siteSettings.api.cookieConsentPlaceholder")}
            disabled={busy}
            className="font-mono text-xs"
          />
          <p className="text-muted-foreground text-xs">{t("admin.siteSettings.api.cookieConsentHelp")}</p>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button type="button" onClick={handleSave} disabled={busy}>
            {isSaving ? t("admin.siteSettings.actions.saving") : t("admin.siteSettings.actions.save")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
