// src/modules/siteSettings/validation.ts

import { z } from "zod";

/** JSON-like recursive schema (no-any) */
const jsonLiteral = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
]);
type JsonLiteral = z.infer<typeof jsonLiteral>;

export type JsonLike =
  | JsonLiteral
  | JsonLike[]
  | { [k: string]: JsonLike };

export const jsonLike: z.ZodType<JsonLike> = z.lazy(() =>
  z.union([jsonLiteral, z.array(jsonLike), z.record(jsonLike)]),
);

export const siteSettingUpsertSchema = z.object({
  key: z.string().min(1).max(100),
  value: jsonLike, // FE tarafı JSON.stringify edilmiş stringi parse edecek
});

export const siteSettingBulkUpsertSchema = z.object({
  items: z.array(siteSettingUpsertSchema).min(1),
});

const nonEmptyTrimmedString = z.string().trim().min(1);
const optionalHref = z.string().trim().min(1).optional().default('/');

const homeMetricItemSchema = z.object({
  title: nonEmptyTrimmedString,
  description: nonEmptyTrimmedString,
});

const homeWorkflowStepSchema = z.object({
  step: nonEmptyTrimmedString,
  title: nonEmptyTrimmedString,
  description: nonEmptyTrimmedString,
});

const homeStatSchema = z.object({
  value: nonEmptyTrimmedString,
  label: nonEmptyTrimmedString,
});

const homeValuePropItemSchema = z.object({
  key: nonEmptyTrimmedString,
  title: nonEmptyTrimmedString,
  description: nonEmptyTrimmedString,
});

const productB2bFeatureSchema = z.object({
  title: nonEmptyTrimmedString,
  desc: nonEmptyTrimmedString,
});

export const homeHeroSettingSchema = z.object({
  badge: nonEmptyTrimmedString,
  title: nonEmptyTrimmedString,
  subtitle: nonEmptyTrimmedString,
  primaryCtaLabel: nonEmptyTrimmedString,
  primaryCtaHref: optionalHref,
  secondaryCtaLabel: nonEmptyTrimmedString,
  secondaryCtaHref: optionalHref,
  workflowLabel: nonEmptyTrimmedString,
  workflowTitle: nonEmptyTrimmedString,
  workflowBadgeTitle: nonEmptyTrimmedString,
  workflowBadgeSubtitle: nonEmptyTrimmedString,
});

export const homeMetricsSettingSchema = z.object({
  items: z.array(homeMetricItemSchema).min(3).max(3),
  workflowSteps: z.array(homeWorkflowStepSchema).min(3).max(3),
  stats: z.array(homeStatSchema).min(2).max(2),
});

export const homeValuePropsSettingSchema = z.object({
  sectionLabel: nonEmptyTrimmedString,
  title: nonEmptyTrimmedString,
  subtitle: nonEmptyTrimmedString,
  items: z.array(homeValuePropItemSchema).min(4).max(8),
});

export const productsB2bSettingSchema = z.object({
  catalogEyebrow: nonEmptyTrimmedString,
  catalogTitle: nonEmptyTrimmedString,
  catalogBody: nonEmptyTrimmedString,
  requestQuote: nonEmptyTrimmedString,
  talkToEngineering: nonEmptyTrimmedString,
  detailEyebrow: nonEmptyTrimmedString,
  detailTitle: nonEmptyTrimmedString,
  detailBody: nonEmptyTrimmedString,
  reliability: productB2bFeatureSchema,
  engineering: productB2bFeatureSchema,
  speed: productB2bFeatureSchema,
  logistics: productB2bFeatureSchema,
});

export type SiteSettingUpsertInput = z.infer<typeof siteSettingUpsertSchema>;
export type SiteSettingBulkUpsertInput = z.infer<
  typeof siteSettingBulkUpsertSchema
>;
export type HomeHeroSetting = z.infer<typeof homeHeroSettingSchema>;
export type HomeMetricsSetting = z.infer<typeof homeMetricsSettingSchema>;
export type HomeValuePropsSetting = z.infer<typeof homeValuePropsSettingSchema>;
export type ProductsB2bSetting = z.infer<typeof productsB2bSettingSchema>;
