// =============================================================
// FILE: src/components/admin/subcategories/SubCategoriesHeader.tsx
// Ensotek – SubCategory Header + Filtreler
// =============================================================

import React from "react";

import { useAdminT } from "@/app/(main)/admin/_components/common/useAdminT";

export type LocaleOption = {
  value: string;
  label: string;
};

export type CategoryOption = {
  value: string;
  label: string;
};

export type SubCategoriesHeaderProps = {
  search: string;
  onSearchChange: (v: string) => void;

  locale: string;
  onLocaleChange: (v: string) => void;

  categoryId: string;
  onCategoryIdChange: (v: string) => void;

  showOnlyActive: boolean;
  onShowOnlyActiveChange: (v: boolean) => void;

  showOnlyFeatured: boolean;
  onShowOnlyFeaturedChange: (v: boolean) => void;

  loading: boolean;
  onRefresh: () => void;

  locales: LocaleOption[];
  localesLoading?: boolean;

  categories: CategoryOption[];
  categoriesLoading?: boolean;

  onCreateClick: () => void;
};

export const SubCategoriesHeader: React.FC<SubCategoriesHeaderProps> = ({
  search,
  onSearchChange,
  locale,
  onLocaleChange,
  categoryId,
  onCategoryIdChange,
  showOnlyActive,
  onShowOnlyActiveChange,
  showOnlyFeatured,
  onShowOnlyFeaturedChange,
  loading,
  onRefresh,
  locales,
  localesLoading = false,
  categories,
  categoriesLoading = false,
  onCreateClick,
}) => {
  const t = useAdminT();

  // “Tüm Diller” option’u her zaman tekil olsun
  const localeList = React.useMemo(() => {
    const list = Array.isArray(locales) ? locales : [];
    if (list.some((x) => x.value === "")) return list;
    return [{ value: "", label: t("legacyHeader.allLocales") }, ...list];
  }, [locales]);

  return (
    <div className="row mb-3">
      {/* Sol: başlık */}
      <div className="col-12 col-lg-6 mb-2 mb-lg-0">
        <h1 className="h4 mb-1">{t("header.title")}</h1>
        <p className="small mb-0 text-muted">
          {t("legacyHeader.description")}
        </p>
      </div>

      {/* Sağ: filtreler (arama + locale + kategori) */}
      <div className="d-flex justify-content-lg-end col-12 col-lg-6 align-items-end">
        <div className="d-flex w-100 w-sm-auto flex-column flex-sm-row gap-2">
          {/* Arama */}
          <div className="input-group input-group-sm">
            <span className="input-group-text">{t("common.search")}</span>
            <input
              type="text"
              className="form-control"
              placeholder={t("legacyHeader.searchPlaceholder")}
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Locale filtre */}
          <div className="input-group input-group-sm">
            <span className="input-group-text">
              {t("legacyHeader.locale")}
              {localesLoading && <span className="spinner-border spinner-border-sm ms-1" />}
            </span>
            <select
              className="form-select"
              value={locale}
              onChange={(e) => onLocaleChange(e.target.value)}
              disabled={loading || localesLoading}
            >
              {localeList.map((opt) => (
                <option key={opt.value || "all-locales"} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Kategori filtre */}
          <div className="input-group input-group-sm">
            <span className="input-group-text">
              {t("legacyHeader.category")}
              {categoriesLoading && <span className="spinner-border spinner-border-sm ms-1" />}
            </span>
            <select
              className="form-select"
              value={categoryId}
              onChange={(e) => onCategoryIdChange(e.target.value)}
              disabled={loading || categoriesLoading}
            >
              {categories.map((opt) => (
                <option key={opt.value || "all-categories"} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Alt satır: toggle filtreler + aksiyonlar */}
      <div className="d-flex justify-content-md-between col-12 mt-2 flex-column flex-md-row gap-2 align-items-md-center">
        <div className="d-flex small flex-wrap gap-3">
          <div className="form-check form-switch">
            <input
              id="sub-filter-active"
              className="form-check-input"
              type="checkbox"
              checked={showOnlyActive}
              onChange={(e) => onShowOnlyActiveChange(e.target.checked)}
              disabled={loading}
            />
            <label className="form-check-label" htmlFor="sub-filter-active">
              {t("filters.onlyActive")}
            </label>
          </div>

          <div className="form-check form-switch">
            <input
              id="sub-filter-featured"
              className="form-check-input"
              type="checkbox"
              checked={showOnlyFeatured}
              onChange={(e) => onShowOnlyFeaturedChange(e.target.checked)}
              disabled={loading}
            />
            <label className="form-check-label" htmlFor="sub-filter-featured">
              {t("filters.onlyFeatured")}
            </label>
          </div>
        </div>

        <div className="d-flex justify-content-end mt-2 mt-md-0 gap-2">
          <button type="button" className="btn btn-outline-secondary btn-sm" onClick={onRefresh} disabled={loading}>
            {t("legacyHeader.refresh")}
          </button>
          <button type="button" className="btn btn-primary btn-sm" onClick={onCreateClick} disabled={loading}>
            {t("legacyHeader.create")}
          </button>
        </div>
      </div>
    </div>
  );
};
