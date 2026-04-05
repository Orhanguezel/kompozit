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

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

function toStatsForm(v: unknown): StatsForm {
  if (!v || typeof v !== "object") return { items: [DEFAULT_STAT, DEFAULT_STAT, DEFAULT_STAT, DEFAULT_STAT] };
  const o = v as Record<string, unknown>;
  const raw = Array.isArray(o.items) ? o.items : [];
  const items: StatItem[] = Array.from({ length: 4 }, (_, i) => {
    const item = raw[i] as Record<string, unknown> | undefined;
    return {
      number: String(item?.number ?? ""),
      label: String(item?.label ?? ""),
      suffix: String(item?.suffix ?? ""),
      description: String(item?.description ?? ""),
    };
  });
  return { items };
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
      toast.success("Hakkımızda içeriği kaydedildi.");
    } catch {
      toast.error("Kayıt sırasında hata oluştu.");
    }
  };

  const handleSaveTestimonial = async () => {
    try {
      await updateSetting({ key: `${prefix}home.testimonial`, value: testimonial, locale }).unwrap();
      toast.success("Referans alıntısı kaydedildi.");
    } catch {
      toast.error("Kayıt sırasında hata oluştu.");
    }
  };

  const handleSaveStats = async () => {
    try {
      await updateSetting({ key: `${prefix}home.stats`, value: stats, locale }).unwrap();
      toast.success("İstatistik verileri kaydedildi.");
    } catch {
      toast.error("Kayıt sırasında hata oluştu.");
    }
  };

  const handleSaveHero = async () => {
    try {
      await updateSetting({ key: `${prefix}home.hero`, value: hero, locale }).unwrap();
      toast.success("Hero içeriği kaydedildi.");
    } catch {
      toast.error("Kayıt sırasında hata oluştu.");
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
          <p className="text-sm font-medium">Ana Sayfa İçerik Ayarları</p>
          <p className="text-muted-foreground text-xs">Dil: {locale} · Prefix: {prefix || "(yok)"}</p>
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={handleRefresh} disabled={busy}>
          <RefreshCcw className="size-4" />
        </Button>
      </div>

      {/* Hero */}
      <Section title="Hero Bölümü" description="Ana sayfa hero alanı başlık ve CTA metinleri.">
        <div className="space-y-3">
          <div className="space-y-1">
            <Label>Başlık (HTML desteklenir, &lt;em&gt; kullanılabilir)</Label>
            <Input
              value={hero.title}
              onChange={(e) => setHero((p) => ({ ...p, title: e.target.value }))}
              placeholder='Endüstriyel Dünya İçin <em>Mühendislik</em> Sanatı'
              disabled={busy}
            />
          </div>
          <div className="space-y-1">
            <Label>Alt Başlık</Label>
            <Textarea
              rows={2}
              value={hero.subtitle}
              onChange={(e) => setHero((p) => ({ ...p, subtitle: e.target.value }))}
              placeholder="Yüksek performanslı kompozit çözümler..."
              disabled={busy}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1">
              <Label>Ana CTA Metni</Label>
              <Input
                value={hero.ctaLabel}
                onChange={(e) => setHero((p) => ({ ...p, ctaLabel: e.target.value }))}
                placeholder="Teklif Al"
                disabled={busy}
              />
            </div>
            <div className="space-y-1">
              <Label>Ana CTA URL</Label>
              <Input
                value={hero.ctaHref}
                onChange={(e) => setHero((p) => ({ ...p, ctaHref: e.target.value }))}
                placeholder="/tr/offer"
                disabled={busy}
              />
            </div>
            <div className="space-y-1">
              <Label>İkincil CTA Metni</Label>
              <Input
                value={hero.secondaryLabel}
                onChange={(e) => setHero((p) => ({ ...p, secondaryLabel: e.target.value }))}
                placeholder="Ürünleri Keşfet"
                disabled={busy}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end pt-2">
          <Button type="button" size="sm" onClick={handleSaveHero} disabled={busy}>
            <Save className="mr-2 size-3.5" /> Kaydet
          </Button>
        </div>
      </Section>

      {/* About */}
      <Section title="Hakkımızda Bölümü" description="Ana sayfadaki hakkımızda kısa tanıtım alanı.">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <Label>Etiket (Küçük üst başlık)</Label>
            <Input
              value={about.label}
              onChange={(e) => setAbout((p) => ({ ...p, label: e.target.value }))}
              placeholder="Hakkımızda"
              disabled={busy}
            />
          </div>
          <div className="space-y-1">
            <Label>CTA Buton Metni</Label>
            <Input
              value={about.ctaLabel}
              onChange={(e) => setAbout((p) => ({ ...p, ctaLabel: e.target.value }))}
              placeholder="Daha Fazlası"
              disabled={busy}
            />
          </div>
        </div>
        <div className="space-y-1">
          <Label>Başlık (HTML desteklenir, &lt;em&gt; kullanılabilir)</Label>
          <Input
            value={about.title}
            onChange={(e) => setAbout((p) => ({ ...p, title: e.target.value }))}
            placeholder='Mühendislik <em>Disiplini</em>'
            disabled={busy}
          />
        </div>
        <div className="space-y-1">
          <Label>Slogan</Label>
          <Input
            value={about.tagline}
            onChange={(e) => setAbout((p) => ({ ...p, tagline: e.target.value }))}
            placeholder="Bilimin zanaatla buluştuğu nokta"
            disabled={busy}
          />
        </div>
        <div className="space-y-1">
          <Label>Giriş Metni</Label>
          <Textarea
            rows={3}
            value={about.intro}
            onChange={(e) => setAbout((p) => ({ ...p, intro: e.target.value }))}
            placeholder="MOE Kompozit olarak 15+ yıl..."
            disabled={busy}
          />
        </div>
        <div className="flex justify-end pt-2">
          <Button type="button" size="sm" onClick={handleSaveAbout} disabled={busy}>
            <Save className="mr-2 size-3.5" /> Kaydet
          </Button>
        </div>
      </Section>

      {/* Testimonial */}
      <Section title="Referans Alıntısı" description="Ana sayfadaki müşteri alıntı bölümü.">
        <div className="space-y-3">
          <div className="space-y-1">
            <Label>Alıntı</Label>
            <Textarea
              rows={3}
              value={testimonial.quote}
              onChange={(e) => setTestimonial((p) => ({ ...p, quote: e.target.value }))}
              placeholder="Kalite ve teslimat süresi konusunda..."
              disabled={busy}
            />
          </div>
          <div className="space-y-1">
            <Label>Kaynak (İsim / Unvan)</Label>
            <Input
              value={testimonial.attribution}
              onChange={(e) => setTestimonial((p) => ({ ...p, attribution: e.target.value }))}
              placeholder="Ahmet Yıldız · Proje Müdürü, Savunma A.Ş."
              disabled={busy}
            />
          </div>
        </div>
        <div className="flex justify-end pt-2">
          <Button type="button" size="sm" onClick={handleSaveTestimonial} disabled={busy}>
            <Save className="mr-2 size-3.5" /> Kaydet
          </Button>
        </div>
      </Section>

      {/* Stats */}
      <Section title="İstatistik Çubuğu" description="Ana sayfada gösterilen 4 adet sayısal istatistik.">
        <div className="space-y-4">
          {stats.items.map((item, i) => (
            <div key={i} className="rounded-lg border p-3">
              <p className="mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                İstatistik {i + 1}
              </p>
              <div className="grid gap-2 sm:grid-cols-4">
                <div className="space-y-1">
                  <Label className="text-xs">Sayı</Label>
                  <Input
                    value={item.number}
                    onChange={(e) => updateStat(i, "number", e.target.value)}
                    placeholder="15"
                    disabled={busy}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Sonek (+, yıl, vb.)</Label>
                  <Input
                    value={item.suffix}
                    onChange={(e) => updateStat(i, "suffix", e.target.value)}
                    placeholder="+"
                    disabled={busy}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Etiket</Label>
                  <Input
                    value={item.label}
                    onChange={(e) => updateStat(i, "label", e.target.value)}
                    placeholder="Yıl"
                    disabled={busy}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Açıklama</Label>
                  <Input
                    value={item.description}
                    onChange={(e) => updateStat(i, "description", e.target.value)}
                    placeholder="Sektörde deneyim"
                    disabled={busy}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end pt-2">
          <Button type="button" size="sm" onClick={handleSaveStats} disabled={busy}>
            <Save className="mr-2 size-3.5" /> Kaydet
          </Button>
        </div>
      </Section>
    </div>
  );
};
