import 'server-only';

import { fetchSetting } from '@/i18n/server';

export type HomeHeroContent = {
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

export type HomeMetricsContent = {
  items: Array<{ title: string; description: string }>;
  workflowSteps: Array<{ step: string; title: string; description: string }>;
  stats: Array<{ value: string; label: string }>;
};

export type HomeValuePropsContent = {
  sectionLabel: string;
  title: string;
  subtitle: string;
  items: Array<{ key: string; title: string; description: string }>;
};

/** Bar metrics under hero (`home.stats` site_setting JSON). */
export type HomeStatsBarContent = {
  items: Array<{ value: string; label: string }>;
};

export type HomeAboutContent = {
  label: string;
  title: string;
  tagline: string;
  intro: string;
  ctaLabel: string;
  imageUrl?: string;
};

export type HomeTestimonialContent = {
  quote: string;
  attribution: string;
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function asObject(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function asStringArray(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value) ? value.filter((item) => item && typeof item === 'object') as Record<string, unknown>[] : [];
}

function normalizeHero(value: unknown): HomeHeroContent | null {
  const source = asObject(value);
  if (!source) return null;

  const hero: HomeHeroContent = {
    badge: String(source.badge ?? '').trim(),
    title: String(source.title ?? '').trim(),
    subtitle: String(source.subtitle ?? '').trim(),
    primaryCtaLabel: String(source.primaryCtaLabel ?? source.ctaLabel ?? '').trim(),
    primaryCtaHref: String(source.primaryCtaHref ?? source.ctaHref ?? '').trim(),
    secondaryCtaLabel: String(source.secondaryCtaLabel ?? source.secondaryLabel ?? '').trim(),
    secondaryCtaHref: String(source.secondaryCtaHref ?? source.secondaryHref ?? '').trim(),
    workflowLabel: String(source.workflowLabel ?? '').trim(),
    workflowTitle: String(source.workflowTitle ?? '').trim(),
    workflowBadgeTitle: String(source.workflowBadgeTitle ?? '').trim(),
    workflowBadgeSubtitle: String(source.workflowBadgeSubtitle ?? '').trim(),
  };

  return [hero.title, hero.subtitle, hero.primaryCtaLabel, hero.primaryCtaHref, hero.secondaryCtaLabel, hero.secondaryCtaHref].every(isNonEmptyString)
    ? hero
    : null;
}

function normalizeMetrics(value: unknown): HomeMetricsContent | null {
  const source = asObject(value);
  if (!source) return null;

  const items = asStringArray(source.items)
    .map((item) => ({
      title: String(item.title ?? '').trim(),
      description: String(item.description ?? '').trim(),
    }))
    .filter((item) => isNonEmptyString(item.title) && isNonEmptyString(item.description));

  const workflowSteps = asStringArray(source.workflowSteps)
    .map((item) => ({
      step: String(item.step ?? '').trim(),
      title: String(item.title ?? '').trim(),
      description: String(item.description ?? '').trim(),
    }))
    .filter(
      (item) =>
        isNonEmptyString(item.step) &&
        isNonEmptyString(item.title) &&
        isNonEmptyString(item.description),
    );

  const stats = asStringArray(source.stats)
    .map((item) => ({
      value: String(item.value ?? '').trim(),
      label: String(item.label ?? '').trim(),
    }))
    .filter((item) => isNonEmptyString(item.value) && isNonEmptyString(item.label));

  if (items.length !== 3 || workflowSteps.length !== 3 || stats.length !== 2) return null;

  return { items, workflowSteps, stats };
}

function normalizeValueProps(value: unknown): HomeValuePropsContent | null {
  const source = asObject(value);
  if (!source) return null;

  const sectionLabel = String(source.sectionLabel ?? '').trim();
  const title = String(source.title ?? '').trim();
  const subtitle = String(source.subtitle ?? '').trim();
  const items = asStringArray(source.items)
    .map((item) => ({
      key: String(item.key ?? '').trim(),
      title: String(item.title ?? '').trim(),
      description: String(item.description ?? '').trim(),
    }))
    .filter(
      (item) =>
        isNonEmptyString(item.key) &&
        isNonEmptyString(item.title) &&
        isNonEmptyString(item.description),
    );

  if (!isNonEmptyString(sectionLabel) || !isNonEmptyString(title) || !isNonEmptyString(subtitle) || items.length < 4) {
    return null;
  }

  return { sectionLabel, title, subtitle, items };
}

function normalizeAbout(value: unknown): HomeAboutContent | null {
  const source = asObject(value);
  if (!source) return null;
  const about: HomeAboutContent = {
    label: String(source.label ?? '').trim(),
    title: String(source.title ?? '').trim(),
    tagline: String(source.tagline ?? '').trim(),
    intro: String(source.intro ?? '').trim(),
    ctaLabel: String(source.ctaLabel ?? '').trim(),
  };
  const imageUrl = String(source.imageUrl ?? '').trim();
  if (imageUrl) about.imageUrl = imageUrl;
  return [about.label, about.title, about.tagline, about.intro, about.ctaLabel].every(isNonEmptyString)
    ? about
    : null;
}

function normalizeTestimonial(value: unknown): HomeTestimonialContent | null {
  const source = asObject(value);
  if (!source) return null;
  const quote = String(source.quote ?? '').trim();
  const attribution = String(source.attribution ?? '').trim();
  return isNonEmptyString(quote) && isNonEmptyString(attribution) ? { quote, attribution } : null;
}

function normalizeStatsBar(value: unknown): HomeStatsBarContent | null {
  const source = asObject(value);
  if (!source) return null;

  const items = asStringArray(source.items)
    .map((item) => ({
      value: String(item.value ?? `${item.number ?? ''}${item.suffix ?? ''}`).trim(),
      label: String(item.label ?? '').trim(),
    }))
    .filter((item) => isNonEmptyString(item.value) && isNonEmptyString(item.label));

  return items.length === 4 ? { items } : null;
}

export async function fetchHomePageContent(locale: string): Promise<{
  hero: HomeHeroContent | null;
  metrics: HomeMetricsContent | null;
  valueProps: HomeValuePropsContent | null;
  statsBar: HomeStatsBarContent | null;
  testimonial: HomeTestimonialContent | null;
  about: HomeAboutContent | null;
}> {
  const [heroRow, metricsRow, valuePropsRow, statsBarRow, testimonialRow, aboutRow] = await Promise.all([
    fetchSetting('home.hero', locale, { revalidate: 300 }),
    fetchSetting('home.metrics', locale, { revalidate: 300 }),
    fetchSetting('home.value_props', locale, { revalidate: 300 }),
    fetchSetting('home.stats', locale, { revalidate: 300 }),
    fetchSetting('home.testimonial', locale, { revalidate: 300 }),
    fetchSetting('home.about', locale, { revalidate: 300 }),
  ]);

  return {
    hero: normalizeHero(heroRow?.value),
    metrics: normalizeMetrics(metricsRow?.value),
    valueProps: normalizeValueProps(valuePropsRow?.value),
    statsBar: normalizeStatsBar(statsBarRow?.value),
    testimonial: normalizeTestimonial(testimonialRow?.value),
    about: normalizeAbout(aboutRow?.value),
  };
}
