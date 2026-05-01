"use client";

// =============================================================
// FILE: src/components/admin/subcategories/SubCategoryFormHeader.tsx
// Ensotek – Alt Kategori Form Header (Category pattern)
// =============================================================

import type React from "react";

import { useAdminT } from "@/app/(main)/admin/_components/common/useAdminT";

export type SubCategoryFormMode = "create" | "edit";
export type SubCategoryEditMode = "form" | "json";

export type SubCategoryFormHeaderProps = {
  mode: SubCategoryFormMode;
  locale: string;

  editMode: SubCategoryEditMode;
  onChangeEditMode: (mode: SubCategoryEditMode) => void;

  saving: boolean;
  isLocaleLoading: boolean;
};

export const SubCategoryFormHeader: React.FC<SubCategoryFormHeaderProps> = ({
  mode,
  locale,
  editMode,
  onChangeEditMode,
  saving,
  isLocaleLoading,
}) => {
  const t = useAdminT("admin.subcategories");
  const title = mode === "create" ? t("legacyForm.createTitle") : t("legacyForm.editTitle");

  return (
    <div className="card-header d-flex justify-content-between py-2 align-items-center">
      <div>
        <h1 className="h5 mb-0">{title}</h1>
        <div className="small text-muted">
          {locale ? (
            <>
              {t("legacyForm.localeLabel")}: <strong>{locale.toUpperCase()}</strong>
            </>
          ) : (
            <>
              {t("legacyForm.localeLabel")}: <strong>-</strong>
            </>
          )}
        </div>
      </div>

      <div className="d-flex gap-2 align-items-center">
        <fieldset className="btn-group btn-group-sm border-0 m-0 p-0">
          <button
            type="button"
            className={`btn btn-outline-secondary ${editMode === "form" ? "active" : ""}`}
            onClick={() => onChangeEditMode("form")}
            disabled={saving}
          >
            {t("legacyForm.formTab")}
          </button>
          <button
            type="button"
            className={`btn btn-outline-secondary ${editMode === "json" ? "active" : ""}`}
            onClick={() => onChangeEditMode("json")}
            disabled={saving}
          >
            JSON
          </button>
        </fieldset>

        {(saving || isLocaleLoading) && (
          <span className="badge small bg-secondary">
            {isLocaleLoading ? t("legacyForm.switchingLocale") : t("legacyForm.saving")}
          </span>
        )}
      </div>
    </div>
  );
};
