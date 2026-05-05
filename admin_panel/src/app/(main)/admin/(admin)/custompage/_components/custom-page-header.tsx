// =============================================================
// FILE: src/app/(main)/admin/(admin)/custompage/_components/CustomPageHeader.tsx
// FINAL — Admin Custom Pages Header (Filters + Summary)
// - ✅ Locale options dynamic
// - ✅ Module dropdown dynamic (props)
// - ✅ NO inline styles
// =============================================================

import React from "react";

import Link from "next/link";

import { type AdminLocaleOption, AdminLocaleSelect } from "@/app/(main)/admin/_components/common/AdminLocaleSelect";
import { useAdminT } from "@/app/(main)/admin/_components/common/useAdminT";

export type LocaleOption = {
  value: string;
  label: string;
};

export type ModuleOption = {
  value: string;
  label: string;
};

export type CustomPageFilters = {
  search: string;
  moduleKey: string;
  publishedFilter: "all" | "published" | "draft";
  locale: string;
};

export type CustomPageHeaderProps = {
  filters: CustomPageFilters;
  total: number;
  onFiltersChange: (next: CustomPageFilters) => void;
  onRefresh?: () => void;

  locales: LocaleOption[];
  localesLoading?: boolean;

  allowAllOption?: boolean;
  moduleOptions?: ModuleOption[];
  newPageHref?: string;
  /** true ise modül açılır listesi yerine sabit etiket gösterilir */
  moduleLocked?: boolean;
  lockedModuleLabel?: string;
};

export const CustomPageHeader: React.FC<CustomPageHeaderProps> = ({
  filters,
  total,
  onFiltersChange,
  onRefresh,
  locales,
  localesLoading,
  allowAllOption = true,
  moduleOptions,
  newPageHref = "/admin/custompage/new",
  moduleLocked = false,
  lockedModuleLabel,
}) => {
  const t = useAdminT();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, search: e.target.value });
  };

  const handleModuleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({ ...filters, moduleKey: e.target.value });
  };

  const handlePublishedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as CustomPageFilters["publishedFilter"];
    onFiltersChange({ ...filters, publishedFilter: value });
  };

  const handleLocaleChange = (nextLocale: string) => {
    const normalized = nextLocale ? nextLocale.trim().toLowerCase() : "";
    onFiltersChange({ ...filters, locale: normalized });
  };

  const localeOptions: AdminLocaleOption[] = React.useMemo(() => {
    const base = (locales || [])
      .map((l) => ({
        value: String(l.value || "")
          .trim()
          .toLowerCase(),
        label: l.label,
      }))
      .filter((x) => x.value);

    if (!allowAllOption) return base;
    return [{ value: "", label: t("admin.customPage.allLanguages") }, ...base];
  }, [locales, allowAllOption, t]);

  const disabledLocaleSelect = !!localesLoading || localeOptions.length === 0;

  const moduleOpts = (moduleOptions ?? []).filter((x) => String(x?.value || "").trim().length > 0);
  const disabledModuleSelect = moduleOpts.length === 0;

  const ALL = "__all__" as const;

  return (
    <div className="w-full min-w-0 max-w-full overflow-hidden premium-card border-none">
      <div className="gold-gradient h-1.5 w-full" />
      <div className="p-2.5">
        {/* Title row + summary */}
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="font-semibold text-sm">{t("admin.customPage.title")}</div>
            <div className="text-[11px] text-muted-foreground">{t("admin.customPage.subtitle")}</div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-muted-foreground">{t("admin.common.total")}:</span>
            <span className="font-bold text-sm">{total}</span>
            {onRefresh ? (
              <button 
                type="button" 
                className="rounded-full border border-white/10 px-3 py-1 text-[11px] hover:bg-primary/10 hover:text-primary transition-all" 
                onClick={onRefresh}
              >
                {t("admin.common.refresh")}
              </button>
            ) : null}
            <Link
              href={newPageHref}
              className="gold-gradient rounded-full px-4 py-1.5 font-bold text-[11px] text-primary-foreground shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              {t("admin.customPage.newPage")}
            </Link>
          </div>
        </div>

        {/* Filters row — flex wrap, compact */}
        <div className="flex flex-wrap items-end gap-2">
          <div className="min-w-[140px] max-w-[220px] flex-1">
            <label htmlFor="custom-page-search" className="mb-0.5 block text-[11px] text-muted-foreground">
              {t("admin.customPage.searchPlaceholder")}
            </label>
            <input
              id="custom-page-search"
              type="search"
              className="w-full rounded border bg-background px-2 py-1.5 text-xs"
              placeholder={t("admin.customPage.searchPlaceholder")}
              value={filters.search}
              onChange={handleSearchChange}
            />
          </div>

          <div className="min-w-[120px] max-w-[180px]">
            <AdminLocaleSelect
              value={filters.locale}
              onChange={handleLocaleChange}
              options={localeOptions}
              loading={!!localesLoading}
              disabled={disabledLocaleSelect}
              label={t("admin.common.locale")}
            />
            {localesLoading ? (
              <div className="mt-0.5 text-[10px] text-muted-foreground">{t("admin.common.loading")}</div>
            ) : null}
            {!localesLoading && localeOptions.length === 0 ? (
              <div className="mt-0.5 text-[10px] text-destructive">{t("admin.common.localeOptionsMissing")}</div>
            ) : null}
          </div>

          <div className="min-w-[100px] max-w-[160px]">
            <label htmlFor="custom-page-module" className="mb-0.5 block text-[11px] text-muted-foreground">
              {t("admin.customPage.allModules")}
            </label>
            {moduleLocked ? (
              <div
                id="custom-page-module"
                className="rounded border bg-muted/40 px-1.5 py-1.5 text-xs leading-snug"
                title={lockedModuleLabel || filters.moduleKey}
              >
                {lockedModuleLabel || filters.moduleKey || "—"}
              </div>
            ) : (
              <select
                id="custom-page-module"
                className="w-full rounded border bg-background px-1.5 py-1.5 text-xs"
                value={filters.moduleKey}
                onChange={handleModuleChange}
                disabled={disabledModuleSelect}
              >
                <option value={ALL}>{t("admin.customPage.allModules")}</option>
                {moduleOpts.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="min-w-[80px] max-w-[130px]">
            <label htmlFor="custom-page-status" className="mb-0.5 block text-[11px] text-muted-foreground">
              {t("admin.customPage.status.all")}
            </label>
            <select
              id="custom-page-status"
              className="w-full rounded border bg-background px-1.5 py-1.5 text-xs"
              value={filters.publishedFilter}
              onChange={handlePublishedChange}
            >
              <option value="all">{t("admin.customPage.status.all")}</option>
              <option value="published">{t("admin.customPage.status.published")}</option>
              <option value="draft">{t("admin.customPage.status.draft")}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
