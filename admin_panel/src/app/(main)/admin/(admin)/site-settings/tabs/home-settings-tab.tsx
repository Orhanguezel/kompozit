"use client";

// =============================================================
// FILE: site-settings/tabs/home-settings-tab.tsx
// Kompozit Ana Sayfa İçerik Ayarları
// - home.about, home.testimonial, home.stats, home.hero
// - Locale seçimine göre güncellenir
// =============================================================

import * as React from "react";

import { Eye, EyeOff, GripVertical, MoveDown, MoveUp, RefreshCcw, Save } from "lucide-react";
import { toast } from "sonner";

import { useAdminT } from "@/app/(main)/admin/_components/common/useAdminT";
import { cn } from "@/lib/utils";
import { Badge } from "@ensotek/shared-ui/admin/ui/badge";
import { Button } from "@ensotek/shared-ui/admin/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ensotek/shared-ui/admin/ui/card";
import { Input } from "@ensotek/shared-ui/admin/ui/input";
import { Label } from "@ensotek/shared-ui/admin/ui/label";
import { Switch } from "@ensotek/shared-ui/admin/ui/switch";
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

const EMPTY_ABOUT: AboutForm = {
  label: "Kurumsal",
  title: "Geleceğin <span>Kompozit</span> Teknolojileri",
  tagline: "Güçlü, hafif ve dayanıklı mühendislik çözümleri.",
  intro: "MOE Kompozit olarak, ileri teknoloji üretim yöntemleri ile sektörün ihtiyaçlarına yönelik yüksek performanslı çözümler sunuyoruz.",
  ctaLabel: "Daha Fazla Bilgi",
};

function toAboutForm(v: unknown): AboutForm {
  if (!v || typeof v !== "object") return EMPTY_ABOUT;
  const o = v as Record<string, unknown>;
  return {
    label: String(o.label || EMPTY_ABOUT.label),
    title: String(o.title || EMPTY_ABOUT.title),
    tagline: String(o.tagline || EMPTY_ABOUT.tagline),
    intro: String(o.intro || EMPTY_ABOUT.intro),
    ctaLabel: String(o.ctaLabel || EMPTY_ABOUT.ctaLabel),
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

const STATS_DEFAULTS: StatItem[] = [
  { number: "20", label: "Yıllık Tecrübe", suffix: "+", description: "Sektörel deneyim" },
  { number: "1000", label: "Proje", suffix: "+", description: "Başarıyla tamamlanan" },
  { number: "50", label: "Mühendis", suffix: "+", description: "Uzman kadro" },
  { number: "15", label: "Ülke", suffix: "", description: "İhracat ağı" },
];

function splitStatValue(value: unknown): { number: string; suffix: string } {
  const text = String(value ?? "").trim();
  if (!text) return { number: "", suffix: "" };
  const match = text.match(/^(\d+(?:[.,]\d+)?)(.*)$/);
  if (!match) return { number: text, suffix: "" };
  return { number: match[1] || "", suffix: (match[2] || "").trim() };
}

function toStatsForm(v: unknown): StatsForm {
  if (!v || typeof v !== "object") return { items: STATS_DEFAULTS };
  const o = v as Record<string, unknown>;
  const raw = Array.isArray(o.items) ? o.items : [];
  const items: StatItem[] = Array.from({ length: 4 }, (_, i) => {
    const item = raw[i] as Record<string, unknown> | undefined;
    const fromValue = splitStatValue(item?.value);
    const def = STATS_DEFAULTS[i];
    return {
      number: String(item?.number || fromValue.number || def.number),
      label: String(item?.label || def.label),
      suffix: String(item?.suffix || fromValue.suffix || def.suffix),
      description: String(item?.description || def.description),
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

// ---- Metrics ----

type MetricItem = { title: string; description: string };
type WorkflowStep = { step: string; title: string; description: string };
type MetricStat = { value: string; label: string };

type MetricsForm = {
  items: MetricItem[];
  workflowSteps: WorkflowStep[];
  stats: MetricStat[];
};

const EMPTY_METRICS: MetricsForm = {
  items: [
    { title: "Mühendislik Odaklı", description: "Her parça için detaylı sonlu elemanlar analizi yapıyoruz." },
    { title: "Hızlı Prototipleme", description: "Tasarım aşamasından üretime en kısa sürede geçiş." },
    { title: "Sürdürülebilirlik", description: "Çevre dostu üretim süreçleri ve geri dönüşüm." },
  ],
  workflowSteps: [
    { step: "01", title: "Analiz & Tasarım", description: "Gereksinimlerin belirlenmesi ve 3D modelleme." },
    { step: "02", title: "Kalıp & Üretim", description: "Hassas kalıp hazırlığı ve kompozit serme." },
    { step: "03", title: "Kalite Kontrol", description: "Boyut kontrolü ve mukavemet testleri." },
  ],
  stats: [
    { value: "500+", label: "Tamamlanan Proje" },
    { value: "25+", label: "Ülkeye İhracat" },
  ],
};

function toMetricsForm(v: unknown): MetricsForm {
  if (!v || typeof v !== "object") return EMPTY_METRICS;
  const o = v as Record<string, any>;
  return {
    items: Array.isArray(o.items) && o.items.length > 0 ? o.items.slice(0, 3) : EMPTY_METRICS.items,
    workflowSteps: Array.isArray(o.workflowSteps) && o.workflowSteps.length > 0 ? o.workflowSteps.slice(0, 3) : EMPTY_METRICS.workflowSteps,
    stats: Array.isArray(o.stats) && o.stats.length > 0 ? o.stats.slice(0, 2) : EMPTY_METRICS.stats,
  };
}

// ---- Value Props ----

type ValuePropItem = { key: string; title: string; description: string };
type ValuePropsForm = {
  sectionLabel: string;
  title: string;
  subtitle: string;
  items: ValuePropItem[];
};

const EMPTY_VALUE_PROPS: ValuePropsForm = {
  sectionLabel: "Neden Biz?",
  title: "Neden MOE Kompozit?",
  subtitle: "Sektördeki 20 yılı aşkın tecrübemiz ve yenilikçi mühendislik yaklaşımlarımızla projelerinize değer katıyoruz.",
  items: [
    { key: "quality", title: "Üstün Kalite", description: "En yüksek standartlarda malzeme ve üretim." },
    { key: "experience", title: "Uzman Kadro", description: "Alanında uzman mühendis ve teknisyenler." },
    { key: "custom", title: "Özel Çözümler", description: "İhtiyacınıza yönelik terzi usulü tasarımlar." },
    { key: "delivery", title: "Hızlı Teslimat", description: "Zamanında ve güvenilir proje yönetimi." },
    { key: "innovation", title: "Ar-Ge Odaklı", description: "Sürekli gelişen teknoloji ve yöntemler." },
    { key: "certification", title: "Sertifikasyon", description: "Uluslararası standartlara uygun belgeler." },
  ],
};

function toValuePropsForm(v: unknown): ValuePropsForm {
  if (!v || typeof v !== "object") return EMPTY_VALUE_PROPS;
  const o = v as Record<string, any>;
  return {
    sectionLabel: String(o.sectionLabel || EMPTY_VALUE_PROPS.sectionLabel),
    title: String(o.title || EMPTY_VALUE_PROPS.title),
    subtitle: String(o.subtitle || EMPTY_VALUE_PROPS.subtitle),
    items: Array.isArray(o.items) && o.items.length > 0 ? o.items : EMPTY_VALUE_PROPS.items,
  };
}

// ---- Materials ----

type MaterialSpec = { label: string; value: string };
type MaterialItem = { id: string; name: string; description: string; specs: Record<string, MaterialSpec> };
type MaterialsForm = { sectionLabel: string; title: string; subtitle: string; items: MaterialItem[] };

const EMPTY_MATERIALS: MaterialsForm = {
  sectionLabel: "Malzeme Mühendisliği",
  title: "İleri Seviye Kompozit Yapılar",
  subtitle: "Projeniz için en uygun malzeme seçimini uzman kadromuzla birlikte yapıyoruz.",
  items: [
    {
      id: "carbon",
      name: "Karbon Fiber",
      description: "Yüksek mukavemet ve düşük ağırlık avantajı.",
      specs: {
        tensile: { label: "Çekme Dayanımı", value: "3500-5000 MPa" },
        density: { label: "Yoğunluk", value: "1.75-1.80 g/cm³" },
        modulus: { label: "Elastisite Modülü", value: "230-240 GPa" },
        thermal: { label: "Termal Genleşme", value: "-0.1 to 0.1" },
      },
    },
    {
      id: "frp",
      name: "CTP / Cam Elyaf",
      description: "Korozyon direnci ve dielektrik özellikler.",
      specs: {
        tensile: { label: "Çekme Dayanımı", value: "1500-2500 MPa" },
        density: { label: "Yoğunluk", value: "1.80-2.00 g/cm³" },
        modulus: { label: "Elastisite Modülü", value: "70-80 GPa" },
        thermal: { label: "Termal Genleşme", value: "5.0 to 10.0" },
      },
    },
  ],
};

function toMaterialsForm(v: unknown): MaterialsForm {
  if (!v || typeof v !== "object") return EMPTY_MATERIALS;
  const o = v as Record<string, any>;
  return {
    sectionLabel: String(o.sectionLabel || EMPTY_MATERIALS.sectionLabel),
    title: String(o.title || EMPTY_MATERIALS.title),
    subtitle: String(o.subtitle || EMPTY_MATERIALS.subtitle),
    items: Array.isArray(o.items) && o.items.length > 0 ? o.items : EMPTY_MATERIALS.items,
  };
}

// ---- Industries ----

type IndustryItem = { id: string; title: string; description: string };
type IndustriesForm = { sectionLabel: string; title: string; subtitle: string; items: IndustryItem[] };

const EMPTY_INDUSTRIES: IndustriesForm = {
  sectionLabel: "Endüstriyel Uygulamalar",
  title: "Farklı Sektörler İçin Çözümler",
  subtitle: "Geniş uygulama yelpazesi ile tüm sektörlere özel kompozit çözümleri üretiyoruz.",
  items: [
    { id: "defense", title: "Savunma ve Havacılık", description: "Hafif ve dayanıklı zırh çözümleri." },
    { id: "energy", title: "Enerji ve Altyapı", description: "Korozyona dayanıklı direk ve kanal sistemleri." },
    { id: "landscaping", title: "Peyzaj ve Kent", description: "Modern ve estetik kompozit mobilyalar." },
    { id: "storage", title: "Depolama ve Tank", description: "Asit ve kimyasal dayanımlı tanklar." },
    { id: "custom", title: "Özel Tasarımlar", description: "İhtiyaca özel mühendislik çözümleri." },
  ],
};

function toIndustriesForm(v: unknown): IndustriesForm {
  if (!v || typeof v !== "object") return EMPTY_INDUSTRIES;
  const o = v as Record<string, any>;
  return {
    sectionLabel: String(o.sectionLabel || EMPTY_INDUSTRIES.sectionLabel),
    title: String(o.title || EMPTY_INDUSTRIES.title),
    subtitle: String(o.subtitle || EMPTY_INDUSTRIES.subtitle),
    items: Array.isArray(o.items) && o.items.length > 0 ? o.items : EMPTY_INDUSTRIES.items,
  };
}

// ---- Sections ----

type HomeSection = { id: string; name: string; isActive: boolean };

function toSectionsForm(v: unknown): HomeSection[] {
  if (!v || !Array.isArray(v)) return [];
  return v.map((x: any) => ({
    id: String(x.id || ""),
    name: String(x.name || ""),
    isActive: x.isActive !== false,
  }));
}

type HeroForm = {
  badge: string;
  title: string;
  subtitle: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  workflowLabel: string;
  workflowTitle: string;
  workflowBadgeTitle: string;
  workflowBadgeSubtitle: string;
};

const EMPTY_HERO: HeroForm = {
  badge: "B2B Kompozit Çözümleri",
  title: "Yüksek Performanslı <span>Kompozit Mühendisliği</span>",
  subtitle: "Havacılık, savunma ve enerji sektörleri için ileri teknoloji karbon fiber ve CTP çözümleri.",
  primaryCtaLabel: "Ürünlerimizi İnceleyin",
  primaryCtaHref: "/products",
  secondaryCtaLabel: "Teklif Alın",
  secondaryCtaHref: "/offer",
  workflowLabel: "Üretim Sürecimiz",
  workflowTitle: "Fikirden Nihai Ürüne",
  workflowBadgeTitle: "Hızlı Teslimat",
  workflowBadgeSubtitle: "Endüstriyel Standartlar",
};

function toHeroForm(v: unknown): HeroForm {
  if (!v || typeof v !== "object") return EMPTY_HERO;
  const o = v as Record<string, unknown>;
  return {
    badge: String(o.badge || EMPTY_HERO.badge),
    title: String(o.title || EMPTY_HERO.title),
    subtitle: String(o.subtitle || EMPTY_HERO.subtitle),
    primaryCtaLabel: String(o.primaryCtaLabel || o.ctaLabel || EMPTY_HERO.primaryCtaLabel),
    primaryCtaHref: String(o.primaryCtaHref || o.ctaHref || EMPTY_HERO.primaryCtaHref),
    secondaryCtaLabel: String(o.secondaryCtaLabel || o.secondaryLabel || EMPTY_HERO.secondaryCtaLabel),
    secondaryCtaHref: String(o.secondaryCtaHref || o.secondaryHref || EMPTY_HERO.secondaryCtaHref),
    workflowLabel: String(o.workflowLabel || EMPTY_HERO.workflowLabel),
    workflowTitle: String(o.workflowTitle || EMPTY_HERO.workflowTitle),
    workflowBadgeTitle: String(o.workflowBadgeTitle || EMPTY_HERO.workflowBadgeTitle),
    workflowBadgeSubtitle: String(o.workflowBadgeSubtitle || EMPTY_HERO.workflowBadgeSubtitle),
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

  // -- Sections --
  const sectionsQ = useGetSiteSettingAdminByKeyQuery(
    { key: `${prefix}homepage_sections`, locale },
    { refetchOnMountOrArgChange: true },
  );
  const [sections, setSections] = React.useState<HomeSection[]>([]);
  React.useEffect(() => {
    if (!sectionsQ.isLoading && !sectionsQ.isFetching) {
      setSections(toSectionsForm(parseSettingValue(sectionsQ.data)));
    }
  }, [sectionsQ.data, sectionsQ.isLoading, sectionsQ.isFetching]);

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
  const [stats, setStats] = React.useState<StatsForm>({ items: STATS_DEFAULTS });
  React.useEffect(() => {
    if (!statsQ.isLoading && !statsQ.isFetching) {
      setStats(toStatsForm(parseSettingValue(statsQ.data)));
    }
  }, [statsQ.data, statsQ.isLoading, statsQ.isFetching]);

  // -- Metrics --
  const metricsQ = useGetSiteSettingAdminByKeyQuery(
    { key: `${prefix}home.metrics`, locale },
    { refetchOnMountOrArgChange: true },
  );
  const [metrics, setMetrics] = React.useState<MetricsForm>(EMPTY_METRICS);
  React.useEffect(() => {
    if (!metricsQ.isLoading && !metricsQ.isFetching) {
      setMetrics(toMetricsForm(parseSettingValue(metricsQ.data)));
    }
  }, [metricsQ.data, metricsQ.isLoading, metricsQ.isFetching]);

  // -- Value Props --
  const valuePropsQ = useGetSiteSettingAdminByKeyQuery(
    { key: `${prefix}home.value_props`, locale },
    { refetchOnMountOrArgChange: true },
  );
  const [valueProps, setValueProps] = React.useState<ValuePropsForm>(EMPTY_VALUE_PROPS);
  React.useEffect(() => {
    if (!valuePropsQ.isLoading && !valuePropsQ.isFetching) {
      setValueProps(toValuePropsForm(parseSettingValue(valuePropsQ.data)));
    }
  }, [valuePropsQ.data, valuePropsQ.isLoading, valuePropsQ.isFetching]);

  // -- Materials --
  const materialsQ = useGetSiteSettingAdminByKeyQuery(
    { key: `${prefix}home.materials`, locale },
    { refetchOnMountOrArgChange: true },
  );
  const [materials, setMaterials] = React.useState<MaterialsForm>(EMPTY_MATERIALS);
  React.useEffect(() => {
    if (!materialsQ.isLoading && !materialsQ.isFetching) {
      setMaterials(toMaterialsForm(parseSettingValue(materialsQ.data)));
    }
  }, [materialsQ.data, materialsQ.isLoading, materialsQ.isFetching]);

  // -- Industries --
  const industriesQ = useGetSiteSettingAdminByKeyQuery(
    { key: `${prefix}home.industries`, locale },
    { refetchOnMountOrArgChange: true },
  );
  const [industries, setIndustries] = React.useState<IndustriesForm>(EMPTY_INDUSTRIES);
  React.useEffect(() => {
    if (!industriesQ.isLoading && !industriesQ.isFetching) {
      setIndustries(toIndustriesForm(parseSettingValue(industriesQ.data)));
    }
  }, [industriesQ.data, industriesQ.isLoading, industriesQ.isFetching]);

  const [updateSetting, { isLoading: isSaving }] = useUpdateSiteSettingAdminMutation();

  const loading =
    aboutQ.isLoading ||
    testimonialQ.isLoading ||
    statsQ.isLoading ||
    heroQ.isLoading ||
    sectionsQ.isLoading ||
    metricsQ.isLoading ||
    valuePropsQ.isLoading ||
    materialsQ.isLoading ||
    industriesQ.isLoading;
  const fetching =
    aboutQ.isFetching ||
    testimonialQ.isFetching ||
    statsQ.isFetching ||
    heroQ.isFetching ||
    sectionsQ.isFetching ||
    metricsQ.isFetching ||
    valuePropsQ.isFetching ||
    materialsQ.isFetching ||
    industriesQ.isFetching;
  const busy = loading || fetching || isSaving;

  const handleRefresh = () => {
    void aboutQ.refetch();
    void testimonialQ.refetch();
    void statsQ.refetch();
    void heroQ.refetch();
    void sectionsQ.refetch();
    void metricsQ.refetch();
    void valuePropsQ.refetch();
    void materialsQ.refetch();
    void industriesQ.refetch();
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

  const handleSaveMetrics = async () => {
    try {
      await updateSetting({ key: `${prefix}home.metrics`, value: metrics, locale }).unwrap();
      toast.success("Metrikler ve iş akışı kaydedildi");
    } catch {
      toast.error(t("messages.saveError"));
    }
  };

  const handleSaveValueProps = async () => {
    try {
      await updateSetting({ key: `${prefix}home.value_props`, value: valueProps, locale }).unwrap();
      toast.success("Avantajlar bölümü kaydedildi");
    } catch {
      toast.error(t("messages.saveError"));
    }
  };

  const handleSaveMaterials = async () => {
    try {
      await updateSetting({ key: `${prefix}home.materials`, value: materials, locale }).unwrap();
      toast.success("Malzeme kartları kaydedildi");
    } catch {
      toast.error(t("messages.saveError"));
    }
  };

  const handleSaveIndustries = async () => {
    try {
      await updateSetting({ key: `${prefix}home.industries`, value: industries, locale }).unwrap();
      toast.success("Sektörel çözümler kaydedildi");
    } catch {
      toast.error(t("messages.saveError"));
    }
  };

  const handleSaveSections = async (updatedSections: HomeSection[]) => {
    try {
      await updateSetting({ key: `${prefix}homepage_sections`, value: updatedSections, locale }).unwrap();
      toast.success("Sıralama ve görünürlük kaydedildi");
    } catch {
      toast.error(t("messages.saveError"));
    }
  };

  const toggleSection = (id: string) => {
    const next = sections.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s));
    setSections(next);
    void handleSaveSections(next);
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    const next = [...sections];
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= next.length) return;
    const [removed] = next.splice(index, 1);
    next.splice(target, 0, removed);
    setSections(next);
    void handleSaveSections(next);
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

      {/* Sections Management */}
      <Section title="Ana Sayfa Bölüm Yönetimi" description="Bölümlerin sırasını ve görünürlüğünü yönetin">
        <div className="space-y-2">
          {sections.length === 0 && !loading && (
            <div className="text-sm text-muted-foreground py-4 text-center border border-dashed rounded-lg">
              Henüz bölüm tanımlanmamış. Seed verilerini kontrol edin.
            </div>
          )}
          {sections.map((s, idx) => (
            <div
              key={s.id}
              className={cn(
                "flex items-center justify-between gap-4 p-3 rounded-xl border transition-all",
                s.isActive ? "bg-card border-border" : "bg-muted/50 border-transparent opacity-60"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    disabled={idx === 0 || busy}
                    onClick={() => moveSection(idx, "up")}
                  >
                    <MoveUp className="h-3 w-3" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    disabled={idx === sections.length - 1 || busy}
                    onClick={() => moveSection(idx, "down")}
                  >
                    <MoveDown className="h-3 w-3" />
                  </Button>
                </div>
                <div>
                  <div className="text-sm font-bold flex items-center gap-2">
                    {s.name}
                    <Badge variant="outline" className="text-[10px] py-0 h-4 uppercase tracking-tighter opacity-70">
                      {s.id}
                    </Badge>
                  </div>
                  <div className="text-[11px] text-muted-foreground uppercase tracking-widest mt-0.5">
                    {s.isActive ? "Aktif" : "Pasif"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={s.isActive}
                  onCheckedChange={() => toggleSection(s.id)}
                  disabled={busy}
                />
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Hero */}
      <Section title={t("sections.hero.title")} description={t("sections.hero.description")}>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label>Rozet Metni</Label>
            <Input
              value={hero.badge}
              onChange={(e) => setHero((p) => ({ ...p, badge: e.target.value }))}
              placeholder="B2B Kompozit Üretim"
              disabled={busy}
            />
          </div>
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
                value={hero.primaryCtaLabel}
                onChange={(e) => setHero((p) => ({ ...p, primaryCtaLabel: e.target.value }))}
                placeholder={t("placeholders.heroCtaLabel")}
                disabled={busy}
              />
            </div>
            <div className="space-y-1">
              <Label>{t("fields.primaryCtaUrl")}</Label>
              <Input
                value={hero.primaryCtaHref}
                onChange={(e) => setHero((p) => ({ ...p, primaryCtaHref: e.target.value }))}
                placeholder={t("placeholders.heroCtaHref")}
                disabled={busy}
              />
            </div>
            <div className="space-y-1">
              <Label>{t("fields.secondaryCtaLabel")}</Label>
              <Input
                value={hero.secondaryCtaLabel}
                onChange={(e) => setHero((p) => ({ ...p, secondaryCtaLabel: e.target.value }))}
                placeholder={t("placeholders.heroSecondaryLabel")}
                disabled={busy}
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label>İkinci CTA URL</Label>
            <Input
              value={hero.secondaryCtaHref}
              onChange={(e) => setHero((p) => ({ ...p, secondaryCtaHref: e.target.value }))}
              placeholder="/offer"
              disabled={busy}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label>İş Akışı Etiketi</Label>
              <Input
                value={hero.workflowLabel}
                onChange={(e) => setHero((p) => ({ ...p, workflowLabel: e.target.value }))}
                disabled={busy}
              />
            </div>
            <div className="space-y-1">
              <Label>İş Akışı Başlığı</Label>
              <Input
                value={hero.workflowTitle}
                onChange={(e) => setHero((p) => ({ ...p, workflowTitle: e.target.value }))}
                disabled={busy}
              />
            </div>
            <div className="space-y-1">
              <Label>İş Akışı Rozet Başlığı</Label>
              <Input
                value={hero.workflowBadgeTitle}
                onChange={(e) => setHero((p) => ({ ...p, workflowBadgeTitle: e.target.value }))}
                disabled={busy}
              />
            </div>
            <div className="space-y-1">
              <Label>İş Akışı Rozet Alt Başlığı</Label>
              <Input
                value={hero.workflowBadgeSubtitle}
                onChange={(e) => setHero((p) => ({ ...p, workflowBadgeSubtitle: e.target.value }))}
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
      {/* Metrics & Workflow */}
      <Section title="Metrikler ve İş Akışı" description="Metrik kartları ve üretim süreci adımları">
        <div className="space-y-6">
          {/* Metrics Items */}
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Metrik Kartları</p>
            <div className="grid gap-4 sm:grid-cols-3">
              {metrics.items.map((item, idx) => (
                <div key={idx} className="space-y-2 p-3 rounded-lg border bg-muted/30">
                  <Label className="text-[10px] uppercase">Kart {idx + 1}</Label>
                  <Input
                    value={item.title}
                    onChange={(e) => {
                      const next = [...metrics.items];
                      next[idx].title = e.target.value;
                      setMetrics({ ...metrics, items: next });
                    }}
                    placeholder="Başlık"
                    className="h-8 text-xs"
                  />
                  <Textarea
                    value={item.description}
                    onChange={(e) => {
                      const next = [...metrics.items];
                      next[idx].description = e.target.value;
                      setMetrics({ ...metrics, items: next });
                    }}
                    placeholder="Açıklama"
                    className="text-xs"
                    rows={2}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Workflow Steps */}
          <div className="space-y-4 pt-4 border-t">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">İş Akışı Adımları</p>
            <div className="grid gap-4 sm:grid-cols-3">
              {metrics.workflowSteps.map((step, idx) => (
                <div key={idx} className="space-y-2 p-3 rounded-lg border bg-muted/30">
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] uppercase">Adım {idx + 1}</Label>
                    <Badge variant="outline" className="text-[9px] h-4">
                      {step.step}
                    </Badge>
                  </div>
                  <Input
                    value={step.title}
                    onChange={(e) => {
                      const next = [...metrics.workflowSteps];
                      next[idx].title = e.target.value;
                      setMetrics({ ...metrics, workflowSteps: next });
                    }}
                    placeholder="Adım Başlığı"
                    className="h-8 text-xs"
                  />
                  <Textarea
                    value={step.description}
                    onChange={(e) => {
                      const next = [...metrics.workflowSteps];
                      next[idx].description = e.target.value;
                      setMetrics({ ...metrics, workflowSteps: next });
                    }}
                    placeholder="Açıklama"
                    className="text-xs"
                    rows={3}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="button" size="sm" onClick={handleSaveMetrics} disabled={busy}>
              <Save className="mr-2 size-3.5" /> Metrikleri Kaydet
            </Button>
          </div>
        </div>
      </Section>

      {/* Value Props / Why Us */}
      <Section title="Neden Biz? / Avantajlar" description="Bizi tercih etme nedenleri ve değer önerileri">
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label>Bölüm Etiketi</Label>
              <Input
                value={valueProps.sectionLabel}
                onChange={(e) => setValueProps((p) => ({ ...p, sectionLabel: e.target.value }))}
                placeholder="Güvenilirlik"
                disabled={busy}
              />
            </div>
            <div className="space-y-1">
              <Label>Ana Başlık</Label>
              <Input
                value={valueProps.title}
                onChange={(e) => setValueProps((p) => ({ ...p, title: e.target.value }))}
                placeholder="Neden MOE Kompozit?"
                disabled={busy}
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label>Alt Başlık / Giriş</Label>
            <Textarea
              value={valueProps.subtitle}
              onChange={(e) => setValueProps((p) => ({ ...p, subtitle: e.target.value }))}
              placeholder="Açıklama metni"
              disabled={busy}
              rows={2}
            />
          </div>

          <div className="space-y-4 pt-4 border-t">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Avantaj Maddeleri</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {valueProps.items.map((item, idx) => (
                <div key={idx} className="space-y-2 p-3 rounded-lg border bg-muted/30">
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] uppercase">Madde {idx + 1}</Label>
                    <Badge variant="outline" className="text-[9px] h-4">
                      {item.key}
                    </Badge>
                  </div>
                  <Input
                    value={item.title}
                    onChange={(e) => {
                      const next = [...valueProps.items];
                      next[idx].title = e.target.value;
                      setValueProps({ ...valueProps, items: next });
                    }}
                    placeholder="Başlık"
                    className="h-8 text-xs"
                  />
                  <Textarea
                    value={item.description}
                    onChange={(e) => {
                      const next = [...valueProps.items];
                      next[idx].description = e.target.value;
                      setValueProps({ ...valueProps, items: next });
                    }}
                    placeholder="Açıklama"
                    className="text-xs"
                    rows={2}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="button" size="sm" onClick={handleSaveValueProps} disabled={busy}>
              <Save className="mr-2 size-3.5" /> Avantajları Kaydet
            </Button>
          </div>
        </div>
      </Section>
      {/* Materials */}
      <Section title="Malzeme Teknolojileri" description="Karbon fiber ve CTP malzeme özellikleri">
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label>Bölüm Etiketi</Label>
              <Input
                value={materials.sectionLabel}
                onChange={(e) => setMaterials((p) => ({ ...p, sectionLabel: e.target.value }))}
                placeholder="Malzeme Mühendisliği"
              />
            </div>
            <div className="space-y-1">
              <Label>Ana Başlık</Label>
              <Input
                value={materials.title}
                onChange={(e) => setMaterials((p) => ({ ...p, title: e.target.value }))}
                placeholder="İleri Seviye Kompozit Yapılar"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label>Alt Başlık</Label>
            <Textarea
              value={materials.subtitle}
              onChange={(e) => setMaterials((p) => ({ ...p, subtitle: e.target.value }))}
              rows={2}
            />
          </div>

          <div className="grid gap-6 pt-4 border-t lg:grid-cols-2">
            {materials.items.map((item, idx) => (
              <div key={idx} className="space-y-4 p-4 rounded-xl border bg-muted/20">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold">{item.name || "Yeni Malzeme"}</p>
                  <Badge variant="outline">{item.id}</Badge>
                </div>
                <div className="space-y-2">
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase">Görünen İsim</Label>
                    <Input
                      value={item.name}
                      onChange={(e) => {
                        const next = [...materials.items];
                        next[idx].name = e.target.value;
                        setMaterials({ ...materials, items: next });
                      }}
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase">Açıklama</Label>
                    <Textarea
                      value={item.description}
                      onChange={(e) => {
                        const next = [...materials.items];
                        next[idx].description = e.target.value;
                        setMaterials({ ...materials, items: next });
                      }}
                      className="text-xs"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  {Object.entries(item.specs).map(([sKey, sVal]) => (
                    <div key={sKey} className="space-y-1 p-2 rounded border bg-background">
                      <Label className="text-[9px] uppercase text-muted-foreground">{sVal.label || sKey}</Label>
                      <Input
                        value={sVal.value}
                        onChange={(e) => {
                          const next = [...materials.items];
                          next[idx].specs[sKey].value = e.target.value;
                          setMaterials({ ...materials, items: next });
                        }}
                        className="h-7 text-[11px] px-2"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <Button type="button" size="sm" onClick={handleSaveMaterials} disabled={busy}>
              <Save className="mr-2 size-3.5" /> Malzemeleri Kaydet
            </Button>
          </div>
        </div>
      </Section>

      {/* Industries */}
      <Section title="Sektörel Çözümler" description="Kompozit uygulamalarının kullanıldığı alanlar">
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label>Bölüm Etiketi</Label>
              <Input
                value={industries.sectionLabel}
                onChange={(e) => setIndustries((p) => ({ ...p, sectionLabel: e.target.value }))}
                placeholder="Endüstriyel Uygulamalar"
              />
            </div>
            <div className="space-y-1">
              <Label>Ana Başlık</Label>
              <Input
                value={industries.title}
                onChange={(e) => setIndustries((p) => ({ ...p, title: e.target.value }))}
                placeholder="Farklı Sektörler İçin Çözümler"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label>Alt Başlık</Label>
            <Textarea
              value={industries.subtitle}
              onChange={(e) => setIndustries((p) => ({ ...p, subtitle: e.target.value }))}
              rows={2}
            />
          </div>

          <div className="space-y-4 pt-4 border-t">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {industries.items.map((item, idx) => (
                <div key={idx} className="space-y-2 p-3 rounded-lg border bg-muted/30">
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] uppercase">Sektör {idx + 1}</Label>
                    <Badge variant="outline" className="text-[9px] h-4">
                      {item.id}
                    </Badge>
                  </div>
                  <Input
                    value={item.title}
                    onChange={(e) => {
                      const next = [...industries.items];
                      next[idx].title = e.target.value;
                      setIndustries({ ...industries, items: next });
                    }}
                    placeholder="Sektör Başlığı"
                    className="h-8 text-xs"
                  />
                  <Textarea
                    value={item.description}
                    onChange={(e) => {
                      const next = [...industries.items];
                      next[idx].description = e.target.value;
                      setIndustries({ ...industries, items: next });
                    }}
                    placeholder="Açıklama"
                    className="text-xs"
                    rows={2}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="button" size="sm" onClick={handleSaveIndustries} disabled={busy}>
              <Save className="mr-2 size-3.5" /> Sektörleri Kaydet
            </Button>
          </div>
        </div>
      </Section>
    </div>
  );
};
