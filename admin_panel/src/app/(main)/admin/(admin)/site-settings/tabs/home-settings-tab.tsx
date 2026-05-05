"use client";

// =============================================================
// FILE: site-settings/tabs/home-settings-tab.tsx
// Kompozit Ana Sayfa İçerik Ayarları
// - home.about, home.testimonial, home.stats, home.hero
// - Locale seçimine göre güncellenir
// =============================================================

import * as React from "react";

import { RefreshCcw, Save } from "lucide-react";
import { toast } from "sonner";

import { useAdminT } from "@/app/(main)/admin/_components/common/useAdminT";
import { Button } from "@ensotek/shared-ui/admin/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ensotek/shared-ui/admin/ui/card";
import { Input } from "@ensotek/shared-ui/admin/ui/input";
import { Label } from "@ensotek/shared-ui/admin/ui/label";
import { Textarea } from "@ensotek/shared-ui/admin/ui/textarea";
import { useGetSiteSettingAdminByKeyQuery, useUpdateSiteSettingAdminMutation } from "@/integrations/hooks";

export type HomeSettingsTabProps = {
  locale: string;
  settingPrefix?: string;
};

// ---- About ----

type AboutForm = {
  label: string;
  title: string;
  tagline: string;
  intro: string;
  ctaLabel: string;
  imageUrl?: string;
};

const EMPTY_ABOUT: AboutForm = { label: "", title: "", tagline: "", intro: "", ctaLabel: "" };

function toAboutForm(v: unknown): AboutForm {
  if (!v || typeof v !== "object") return EMPTY_ABOUT;
  const o = v as Record<string, unknown>;
  return {
    label: String(o.label ?? ""),
    title: String(o.title ?? ""),
    tagline: String(o.tagline ?? ""),
    intro: String(o.intro ?? ""),
    ctaLabel: String(o.ctaLabel ?? ""),
    imageUrl: String(o.imageUrl ?? ""),
  };
}

// ---- Testimonial ----

type TestimonialForm = { quote: string; attribution: string };

const EMPTY_TESTIMONIAL: TestimonialForm = { quote: "", attribution: "" };

function toTestimonialForm(v: unknown): TestimonialForm {
  if (!v || typeof v !== "object") return EMPTY_TESTIMONIAL;
  const o = v as Record<string, unknown>;
  return { quote: String(o.quote ?? ""), attribution: String(o.attribution ?? "") };
}

// ---- Stats ----

type StatItem = { number: string; label: string; suffix: string; description: string };
type StatsForm = { items: StatItem[] };

const DEFAULT_STAT: StatItem = { number: "", label: "", suffix: "", description: "" };

function splitStatValue(value: unknown): { number: string; suffix: string } {
  const text = String(value ?? "").trim();
  if (!text) return { number: "", suffix: "" };
  const match = text.match(/^(\d+(?:[.,]\d+)?)(.*)$/);
  if (!match) return { number: text, suffix: "" };
  return { number: match[1] || "", suffix: (match[2] || "").trim() };
}

function toStatsForm(v: unknown): StatsForm {
  if (!v || typeof v !== "object") return { items: [DEFAULT_STAT, DEFAULT_STAT, DEFAULT_STAT, DEFAULT_STAT] };
  const o = v as Record<string, unknown>;
  const raw = Array.isArray(o.items) ? o.items : [];
  const items: StatItem[] = Array.from({ length: 4 }, (_, i) => {
    const item = raw[i] as Record<string, unknown> | undefined;
    const fromValue = splitStatValue(item?.value);
    return {
      number: String(item?.number ?? fromValue.number),
      label: String(item?.label ?? ""),
      suffix: String(item?.suffix ?? fromValue.suffix),
      description: String(item?.description ?? ""),
    };
  });
  return { items };
}

function statsFormToSetting(form: StatsForm): StatsForm & { items: Array<StatItem & { value: string }> } {
  return {
    items: form.items.map((item) => ({
      ...item,
      value: `${item.number || ""}${item.suffix || ""}`.trim(),
    })),
  };
}

// ---- Hero ----

type HeroForm = {
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryLabel: string;
};

const EMPTY_HERO: HeroForm = { title: "", subtitle: "", ctaLabel: "", ctaHref: "", secondaryLabel: "" };

function toHeroForm(v: unknown): HeroForm {
  if (!v || typeof v !== "object") return EMPTY_HERO;
  const o = v as Record<string, unknown>;
  return {
    title: String(o.title ?? ""),
    subtitle: String(o.subtitle ?? ""),
    ctaLabel: String(o.ctaLabel ?? ""),
    ctaHref: String(o.ctaHref ?? ""),
    secondaryLabel: String(o.secondaryLabel ?? ""),
  };
}

// ---- Helper: parse setting value ----

function parseSettingValue(row: unknown): unknown {
  if (!row || typeof row !== "object") return null;
  const r = row as { value?: unknown };
  if (!r.value) return null;
  if (typeof r.value === "string") {
    try {
      return JSON.parse(r.value);
    } catch {
      return r.value;
    }
  }
  return r.value;
}

// ---- Section wrapper ----

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="gap-1 pb-3">
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
        {description && <CardDescription className="text-xs">{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

// ---- Main component ----

export const HomeSettingsTab: React.FC<HomeSettingsTabProps> = ({ locale, settingPrefix = "" }) => {
  const t = useAdminT("admin.siteSettings.homeSettings");
  const prefix = settingPrefix;

  // -- About --
  const aboutQ = useGetSiteSettingAdminByKeyQuery(
    { key: `${prefix}home.about`, locale },
    { refetchOnMountOrArgChange: true },
  );
  const [about, setAbout] = React.useState<AboutForm>(EMPTY_ABOUT);
  React.useEffect(() => {
    if (!aboutQ.isLoading && !aboutQ.isFetching) {
      setAbout(toAboutForm(parseSettingValue(aboutQ.data)));
    }
  }, [aboutQ.data, aboutQ.isLoading, aboutQ.isFetching]);

  // -- Testimonial --
  const testimonialQ = useGetSiteSettingAdminByKeyQuery(
    { key: `${prefix}home.testimonial`, locale },
    { refetchOnMountOrArgChange: true },
  );
  const [testimonial, setTestimonial] = React.useState<TestimonialForm>(EMPTY_TESTIMONIAL);
  React.useEffect(() => {
    if (!testimonialQ.isLoading && !testimonialQ.isFetching) {
      setTestimonial(toTestimonialForm(parseSettingValue(testimonialQ.data)));
    }
  }, [testimonialQ.data, testimonialQ.isLoading, testimonialQ.isFetching]);

  // -- Stats --
  const statsQ = useGetSiteSettingAdminByKeyQuery(
    { key: `${prefix}home.stats`, locale },
    { refetchOnMountOrArgChange: true },
  );
  const [stats, setStats] = React.useState<StatsForm>({ items: [DEFAULT_STAT, DEFAULT_STAT, DEFAULT_STAT, DEFAULT_STAT] });
  React.useEffect(() => {
    if (!statsQ.isLoading && !statsQ.isFetching) {
      setStats(toStatsForm(parseSettingValue(statsQ.data)));
    }
  }, [statsQ.data, statsQ.isLoading, statsQ.isFetching]);

  // -- Hero --
  const heroQ = useGetSiteSettingAdminByKeyQuery(
    { key: `${prefix}home.hero`, locale },
    { refetchOnMountOrArgChange: true },
  );
  const [hero, setHero] = React.useState<HeroForm>(EMPTY_HERO);
  React.useEffect(() => {
    if (!heroQ.isLoading && !heroQ.isFetching) {
      setHero(toHeroForm(parseSettingValue(heroQ.data)));
    }
  }, [heroQ.data, heroQ.isLoading, heroQ.isFetching]);

  const [updateSetting, { isLoading: isSaving }] = useUpdateSiteSettingAdminMutation();

  const loading = aboutQ.isLoading || testimonialQ.isLoading || statsQ.isLoading || heroQ.isLoading;
  const fetching = aboutQ.isFetching || testimonialQ.isFetching || statsQ.isFetching || heroQ.isFetching;
  const busy = loading || fetching || isSaving;

  const handleRefresh = () => {
    void aboutQ.refetch();
    void testimonialQ.refetch();
    void statsQ.refetch();
    void heroQ.refetch();
  };

  const handleSaveAbout = async () => {
    try {
      await updateSetting({ key: `${prefix}home.about`, value: about, locale }).unwrap();
      toast.success(t("messages.aboutSaved"));
    } catch {
      toast.error(t("messages.saveError"));
    }
  };

  const handleSaveTestimonial = async () => {
    try {
      await updateSetting({ key: `${prefix}home.testimonial`, value: testimonial, locale }).unwrap();
      toast.success(t("messages.testimonialSaved"));
    } catch {
      toast.error(t("messages.saveError"));
    }
  };

  const handleSaveStats = async () => {
    try {
      await updateSetting({ key: `${prefix}home.stats`, value: statsFormToSetting(stats), locale }).unwrap();
      toast.success(t("messages.statsSaved"));
    } catch {
      toast.error(t("messages.saveError"));
    }
  };

  const handleSaveHero = async () => {
    try {
      await updateSetting({ key: `${prefix}home.hero`, value: hero, locale }).unwrap();
      toast.success(t("messages.heroSaved"));
    } catch {
      toast.error(t("messages.saveError"));
    }
  };

  const updateStat = (index: number, field: keyof StatItem, value: string) => {
    setStats((prev) => {
      const items = prev.items.map((item, i) => (i === index ? { ...item, [field]: value } : item));
      return { items };
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">{t("header.title")}</p>
          <p className="text-muted-foreground text-xs">{t("header.localePrefix", { locale, prefix: prefix || "(yok)" })}</p>
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={handleRefresh} disabled={busy}>
          <RefreshCcw className="size-4" />
        </Button>
      </div>

      {/* Hero */}
      <Section title={t("sections.hero.title")} description={t("sections.hero.description")}>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label>{t("fields.titleHtml")}</Label>
            <Input
              value={hero.title}
              onChange={(e) => setHero((p) => ({ ...p, title: e.target.value }))}
              placeholder={t("placeholders.heroTitle")}
              disabled={busy}
            />
          </div>
          <div className="space-y-1">
            <Label>{t("fields.subtitle")}</Label>
            <Textarea
              rows={2}
              value={hero.subtitle}
              onChange={(e) => setHero((p) => ({ ...p, subtitle: e.target.value }))}
              placeholder={t("placeholders.heroSubtitle")}
              disabled={busy}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1">
              <Label>{t("fields.primaryCtaLabel")}</Label>
              <Input
                value={hero.ctaLabel}
                onChange={(e) => setHero((p) => ({ ...p, ctaLabel: e.target.value }))}
                placeholder={t("placeholders.heroCtaLabel")}
                disabled={busy}
              />
            </div>
            <div className="space-y-1">
              <Label>{t("fields.primaryCtaUrl")}</Label>
              <Input
                value={hero.ctaHref}
                onChange={(e) => setHero((p) => ({ ...p, ctaHref: e.target.value }))}
                placeholder={t("placeholders.heroCtaHref")}
                disabled={busy}
              />
            </div>
            <div className="space-y-1">
              <Label>{t("fields.secondaryCtaLabel")}</Label>
              <Input
                value={hero.secondaryLabel}
                onChange={(e) => setHero((p) => ({ ...p, secondaryLabel: e.target.value }))}
                placeholder={t("placeholders.heroSecondaryLabel")}
                disabled={busy}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end pt-2">
          <Button type="button" size="sm" onClick={handleSaveHero} disabled={busy}>
            <Save className="mr-2 size-3.5" /> {t("admin.common.save")}
          </Button>
        </div>
      </Section>

      {/* About */}
      <Section title={t("sections.about.title")} description={t("sections.about.description")}>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <Label>{t("fields.label")}</Label>
            <Input
              value={about.label}
              onChange={(e) => setAbout((p) => ({ ...p, label: e.target.value }))}
              placeholder={t("placeholders.aboutLabel")}
              disabled={busy}
            />
          </div>
          <div className="space-y-1">
            <Label>{t("fields.ctaLabel")}</Label>
            <Input
              value={about.ctaLabel}
              onChange={(e) => setAbout((p) => ({ ...p, ctaLabel: e.target.value }))}
              placeholder={t("placeholders.aboutCtaLabel")}
              disabled={busy}
            />
          </div>
        </div>
        <div className="space-y-1">
          <Label>{t("fields.titleHtml")}</Label>
          <Input
            value={about.title}
            onChange={(e) => setAbout((p) => ({ ...p, title: e.target.value }))}
            placeholder={t("placeholders.aboutTitle")}
            disabled={busy}
          />
        </div>
        <div className="space-y-1">
          <Label>{t("fields.tagline")}</Label>
          <Input
            value={about.tagline}
            onChange={(e) => setAbout((p) => ({ ...p, tagline: e.target.value }))}
            placeholder={t("placeholders.aboutTagline")}
            disabled={busy}
          />
        </div>
        <div className="space-y-1">
          <Label>{t("fields.intro")}</Label>
          <Textarea
            rows={3}
            value={about.intro}
            onChange={(e) => setAbout((p) => ({ ...p, intro: e.target.value }))}
            placeholder={t("placeholders.aboutIntro")}
            disabled={busy}
          />
        </div>
        <div className="flex justify-end pt-2">
          <Button type="button" size="sm" onClick={handleSaveAbout} disabled={busy}>
            <Save className="mr-2 size-3.5" /> {t("admin.common.save")}
          </Button>
        </div>
      </Section>

      {/* Testimonial */}
      <Section title={t("sections.testimonial.title")} description={t("sections.testimonial.description")}>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label>{t("fields.quote")}</Label>
            <Textarea
              rows={3}
              value={testimonial.quote}
              onChange={(e) => setTestimonial((p) => ({ ...p, quote: e.target.value }))}
              placeholder={t("placeholders.testimonialQuote")}
              disabled={busy}
            />
          </div>
          <div className="space-y-1">
            <Label>{t("fields.attribution")}</Label>
            <Input
              value={testimonial.attribution}
              onChange={(e) => setTestimonial((p) => ({ ...p, attribution: e.target.value }))}
              placeholder={t("placeholders.testimonialAttribution")}
              disabled={busy}
            />
          </div>
        </div>
        <div className="flex justify-end pt-2">
          <Button type="button" size="sm" onClick={handleSaveTestimonial} disabled={busy}>
            <Save className="mr-2 size-3.5" /> {t("admin.common.save")}
          </Button>
        </div>
      </Section>

      {/* Stats */}
      <Section title={t("sections.stats.title")} description={t("sections.stats.description")}>
        <div className="space-y-4">
          {stats.items.map((item, i) => (
            <div key={i} className="rounded-lg border p-3">
              <p className="mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                {t("stats.itemTitle", { index: i + 1 })}
              </p>
              <div className="grid gap-2 sm:grid-cols-4">
                <div className="space-y-1">
                  <Label className="text-xs">{t("fields.number")}</Label>
                  <Input
                    value={item.number}
                    onChange={(e) => updateStat(i, "number", e.target.value)}
                    placeholder={t("placeholders.statNumber")}
                    disabled={busy}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">{t("fields.suffix")}</Label>
                  <Input
                    value={item.suffix}
                    onChange={(e) => updateStat(i, "suffix", e.target.value)}
                    placeholder={t("placeholders.statSuffix")}
                    disabled={busy}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">{t("fields.statLabel")}</Label>
                  <Input
                    value={item.label}
                    onChange={(e) => updateStat(i, "label", e.target.value)}
                    placeholder={t("placeholders.statLabel")}
                    disabled={busy}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">{t("fields.description")}</Label>
                  <Input
                    value={item.description}
                    onChange={(e) => updateStat(i, "description", e.target.value)}
                    placeholder={t("placeholders.statDescription")}
                    disabled={busy}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end pt-2">
          <Button type="button" size="sm" onClick={handleSaveStats} disabled={busy}>
            <Save className="mr-2 size-3.5" /> {t("admin.common.save")}
          </Button>
        </div>
      </Section>
    </div>
  );
};
