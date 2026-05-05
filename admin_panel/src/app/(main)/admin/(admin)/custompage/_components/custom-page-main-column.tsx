// =============================================================
// FILE: src/app/(main)/admin/(admin)/custompage/_components/CustomPageMainColumn.tsx
// FINAL — Main column: publish, title, slug, summary, rich content
// - ✅ Uses RichContentEditor (new common path)
// - ✅ No locale select here (single source in CustomPageForm)
// =============================================================

"use client";

import type React from "react";

import RichContentEditor from "@/app/(main)/admin/_components/common/RichContentEditor";
import { useAdminT } from "@/app/(main)/admin/_components/common/useAdminT";
import { Input } from "@ensotek/shared-ui/admin/ui/input";
import { Label } from "@ensotek/shared-ui/admin/ui/label";
import { Switch } from "@ensotek/shared-ui/admin/ui/switch";
import { Textarea } from "@ensotek/shared-ui/admin/ui/textarea";

import type { CustomPageFormValues } from "./custom-page-form";

/* slugify */
const slugify = (value: string): string => {
  if (!value) return "";

  let s = value.trim();

  const trMap: Record<string, string> = {
    ç: "c",
    Ç: "c",
    ğ: "g",
    Ğ: "g",
    ı: "i",
    I: "i",
    İ: "i",
    ö: "o",
    Ö: "o",
    ş: "s",
    Ş: "s",
    ü: "u",
    Ü: "u",
  };

  s = s
    .split("")
    .map((ch) => trMap[ch] ?? ch)
    .join("");

  s = s.replace(/ß/g, "ss").replace(/ẞ/g, "ss");

  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

type Props = {
  values: CustomPageFormValues;
  disabled: boolean;
  slugTouched: boolean;
  setSlugTouched: (v: boolean) => void;
  setValues: React.Dispatch<React.SetStateAction<CustomPageFormValues>>;
  handleChange: (
    field: keyof CustomPageFormValues,
  ) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCheckboxChange: (field: keyof CustomPageFormValues) => (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const CustomPageMainColumn: React.FC<Props> = ({
  values,
  disabled,
  slugTouched,
  setSlugTouched,
  setValues,
  handleChange,
  handleCheckboxChange,
}) => {
  const t = useAdminT();
  const moduleKeyInputId = "custom-page-module-key";
  const titleInputId = "custom-page-title";
  const slugInputId = "custom-page-slug";
  const summaryInputId = "custom-page-summary";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-8 mb-6">
        <div className="flex items-center gap-3">
          <Switch
            id="is_published"
            checked={values.is_published}
            onCheckedChange={(checked) => {
              // CustomPageForm uses handleCheckboxChange which expects an event
              // but we can just update values directly or use a helper
              setValues(p => ({ ...p, is_published: checked }));
            }}
            disabled={disabled}
          />
          <Label htmlFor="is_published" className="cursor-pointer font-bold uppercase tracking-widest text-[10px] text-primary/80">
            {t("admin.customPage.form.isPublished")}
          </Label>
        </div>

        <div className="flex items-center gap-3">
          <Switch
            id="featured"
            checked={values.featured}
            onCheckedChange={(checked) => {
              setValues(p => ({ ...p, featured: checked }));
            }}
            disabled={disabled}
          />
          <Label htmlFor="featured" className="cursor-pointer font-bold uppercase tracking-widest text-[10px] text-primary/80">
            {t("admin.customPage.form.featured")}
          </Label>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor={moduleKeyInputId}>{t("admin.customPage.form.moduleKey")}</Label>
          <Input
            id={moduleKeyInputId}
            value={values.module_key}
            onChange={handleChange("module_key")}
            placeholder={t("admin.customPage.form.moduleKeyPlaceholder")}
            disabled={disabled}
            className="bg-background/50"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={slugInputId}>Slug</Label>
          <Input
            id={slugInputId}
            value={values.slug}
            onFocus={() => setSlugTouched(true)}
            onChange={(e) => {
              setSlugTouched(true);
              setValues((prev) => ({ ...prev, slug: e.target.value }));
            }}
            disabled={disabled}
            className="bg-background/50 font-mono text-xs"
            required
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={titleInputId}>{t("admin.customPage.form.title")}</Label>
        <Input
          id={titleInputId}
          value={values.title}
          onChange={(e) => {
            const titleValue = e.target.value;
            setValues((prev) => {
              const next: CustomPageFormValues = { ...prev, title: titleValue };
              if (!slugTouched) next.slug = slugify(titleValue);
              return next;
            });
          }}
          disabled={disabled}
          className="bg-background/50 font-bold"
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={summaryInputId}>{t("admin.customPage.form.summary")}</Label>
        <Textarea
          id={summaryInputId}
          rows={3}
          value={values.summary}
          onChange={handleChange("summary")}
          disabled={disabled}
          className="bg-background/50"
        />
      </div>

      <div className="space-y-1.5">
        <Label>{t("admin.customPage.form.content")}</Label>
        <RichContentEditor
          value={values.content}
          disabled={disabled}
          onChange={(html: string) => setValues((prev) => ({ ...prev, content: html }))}
        />
      </div>
    </div>
  );
};
