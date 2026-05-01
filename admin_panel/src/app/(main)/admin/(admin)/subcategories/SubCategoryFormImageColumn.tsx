// =============================================================
// FILE: src/components/admin/subcategories/SubCategoryFormImageColumn.tsx
// Ensotek – Alt Kategori Görsel/Icon Kolonu
// - FIX: Upload sonrası anlık preview render (local state sync + key remount)
// =============================================================

"use client";

import type React from "react";
import { useEffect, useMemo, useState } from "react";

import { AdminImageUploadField } from "@/app/(main)/admin/_components/common/AdminImageUploadField";
import { useAdminT } from "@/app/(main)/admin/_components/common/useAdminT";

export type SubCategoryImageMetadata = {
  category_id?: string;
  locale?: string;
  sub_category_slug?: string;
};

export type SubCategoryFormImageColumnProps = {
  metadata?: SubCategoryImageMetadata;
  iconValue: string;
  disabled?: boolean;
  onIconChange: (url: string) => void;
};

const safeStr = (v: unknown) => (v === null || v === undefined ? "" : String(v).trim());

export const SubCategoryFormImageColumn: React.FC<SubCategoryFormImageColumnProps> = ({
  metadata,
  iconValue,
  disabled,
  onIconChange,
}) => {
  const t = useAdminT("admin.subcategories");
  // ✅ Controlled local state (AdminImageUploadField internal-state sync problemi için)
  const [localValue, setLocalValue] = useState<string>(safeStr(iconValue));

  // prop değişince (initialData load / locale switch) local’i sync et
  useEffect(() => {
    setLocalValue(safeStr(iconValue));
  }, [iconValue]);

  // ✅ Remount key: value veya metadata değişince alan kesin refresh
  const remountKey = useMemo(() => {
    const m = metadata
      ? `${safeStr(metadata.category_id)}|${safeStr(metadata.locale)}|${safeStr(metadata.sub_category_slug)}`
      : "no-meta";
    return `${m}|${safeStr(localValue) || "empty"}`;
  }, [metadata, localValue]);

  return (
    <AdminImageUploadField
      key={remountKey}
      label={t("legacyForm.imageLabel")}
      helperText={
        <>
          {t("legacyForm.imageHelperBefore")} <strong>{t("legacyForm.imageHelperStrong")}</strong>{" "}
          {t("legacyForm.imageHelperAfter")}
        </>
      }
      bucket="public"
      folder="subcategories"
      metadata={metadata}
      value={localValue}
      onChange={(url) => {
        const nextUrl = safeStr(url);
        // ✅ önce UI’ı güncelle (anlık preview)
        setLocalValue(nextUrl);
        // ✅ sonra üst state’i güncelle
        onIconChange(nextUrl);
      }}
      disabled={!!disabled}
    />
  );
};
