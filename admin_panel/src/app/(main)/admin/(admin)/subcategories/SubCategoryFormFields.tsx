// =============================================================
// FILE: src/components/admin/subcategories/SubCategoryFormFields.tsx
// Ensotek – Alt Kategori Form Alanları
// =============================================================

import type React from "react";

import { useAdminT } from "@/app/(main)/admin/_components/common/useAdminT";

import type { CategoryOption, LocaleOption } from "./SubCategoriesHeader";

export type SubCategoryFormStateLike = {
  category_id: string;
  locale: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  is_active: boolean;
  is_featured: boolean;
  display_order: number;
};

export type SubCategoryFormFieldsProps = {
  formState: SubCategoryFormStateLike;
  localeOptions: LocaleOption[];
  categoryOptions: CategoryOption[];

  disabled: boolean;
  isLocaleLoading: boolean;

  onLocaleChange: (locale: string) => void;
  onFieldChange: (field: keyof SubCategoryFormStateLike, value: string | boolean | number) => void;
  onNameChange: (name: string) => void;
  onSlugChange: (slug: string) => void;
};

export const SubCategoryFormFields: React.FC<SubCategoryFormFieldsProps> = ({
  formState,
  localeOptions,
  categoryOptions,
  disabled,
  isLocaleLoading,
  onLocaleChange,
  onFieldChange,
  onNameChange,
  onSlugChange,
}) => {
  const t = useAdminT("admin.subcategories");

  return (
    <div className="row g-2">
      {/* Dil */}
      <div className="col-md-4">
        <label className="form-label small" htmlFor="subcat-field-locale">
          {t("legacyForm.localeLabel")}
        </label>
        <select
          id="subcat-field-locale"
          className="form-select form-select-sm"
          value={formState.locale}
          onChange={(e) => onLocaleChange(e.target.value)}
          disabled={disabled || isLocaleLoading}
        >
          {localeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Üst kategori */}
      <div className="col-md-8">
        <label className="form-label small" htmlFor="subcat-field-category">
          {t("legacyForm.parentCategoryField")}
        </label>
        <select
          id="subcat-field-category"
          className="form-select form-select-sm"
          value={formState.category_id}
          onChange={(e) => onFieldChange("category_id", e.target.value)}
          disabled={disabled}
        >
          {categoryOptions.map((opt) => (
            <option key={opt.value || "all"} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Sıralama */}
      <div className="col-md-4">
        <label className="form-label small" htmlFor="subcat-field-display-order">
          {t("legacyForm.displayOrderField")}
        </label>
        <input
          id="subcat-field-display-order"
          type="number"
          className="form-control form-control-sm"
          value={formState.display_order}
          onChange={(e) => onFieldChange("display_order", Number(e.target.value) || 0)}
          disabled={disabled}
        />
      </div>

      {/* Ad */}
      <div className="col-md-4">
        <label className="form-label small" htmlFor="subcat-field-name">
          {t("form.name")}
        </label>
        <input
          id="subcat-field-name"
          type="text"
          className="form-control form-control-sm"
          value={formState.name}
          onChange={(e) => onNameChange(e.target.value)}
          disabled={disabled}
        />
      </div>

      {/* Slug */}
      <div className="col-md-4">
        <label className="form-label small" htmlFor="subcat-field-slug">
          Slug
        </label>
        <input
          id="subcat-field-slug"
          type="text"
          className="form-control form-control-sm"
          value={formState.slug}
          onChange={(e) => onSlugChange(e.target.value)}
          disabled={disabled}
        />
        <div className="form-text small">{t("legacyForm.slugHelp")}</div>
      </div>

      {/* Icon */}
      <div className="col-md-6">
        <label className="form-label small" htmlFor="subcat-field-icon">
          {t("legacyForm.iconOptional")}
        </label>
        <input
          id="subcat-field-icon"
          type="text"
          className="form-control form-control-sm"
          value={formState.icon}
          onChange={(e) => onFieldChange("icon", e.target.value)}
          disabled={disabled}
        />
      </div>

      {/* Switchler */}
      <div className="d-flex col-md-6 align-items-end">
        <div className="d-flex small flex-wrap gap-3">
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="subcat-active"
              checked={formState.is_active}
              onChange={(e) => onFieldChange("is_active", e.target.checked)}
              disabled={disabled}
            />
            <label className="form-check-label" htmlFor="subcat-active">
              {t("form.isActive")}
            </label>
          </div>
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="subcat-featured"
              checked={formState.is_featured}
              onChange={(e) => onFieldChange("is_featured", e.target.checked)}
              disabled={disabled}
            />
            <label className="form-check-label" htmlFor="subcat-featured">
              {t("form.isFeatured")}
            </label>
          </div>
        </div>
      </div>

      {/* Açıklama */}
      <div className="col-12">
        <label className="form-label small" htmlFor="subcat-field-description">
          {t("legacyForm.descriptionOptional")}
        </label>
        <textarea
          id="subcat-field-description"
          className="form-control form-control-sm"
          rows={4}
          value={formState.description}
          onChange={(e) => onFieldChange("description", e.target.value)}
          disabled={disabled}
        />
      </div>
    </div>
  );
};
