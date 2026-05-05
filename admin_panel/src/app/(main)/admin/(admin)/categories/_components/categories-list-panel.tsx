// =============================================================
// FILE: src/app/(main)/admin/(admin)/categories/components/CategoriesListPanel.tsx
// Categories List Panel — Header + Filters + Table/Cards
// Ensotek
// =============================================================

"use client";

import * as React from "react";

import { useRouter } from "next/navigation";

import { Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { type AdminLocaleOption, AdminLocaleSelect } from "@/app/(main)/admin/_components/common/AdminLocaleSelect";
import { useAdminLocales } from "@/app/(main)/admin/_components/common/useAdminLocales";
import { useAdminT } from "@/app/(main)/admin/_components/common/useAdminT";
import { Badge } from "@ensotek/shared-ui/admin/ui/badge";
import { Button } from "@ensotek/shared-ui/admin/ui/button";
import { Card, CardContent, CardHeader } from "@ensotek/shared-ui/admin/ui/card";
import { Input } from "@ensotek/shared-ui/admin/ui/input";
import { Label } from "@ensotek/shared-ui/admin/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ensotek/shared-ui/admin/ui/select";
import { Switch } from "@ensotek/shared-ui/admin/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@ensotek/shared-ui/admin/ui/table";
import { resolveAdminApiLocale } from "@/i18n/adminLocale";
import { localeShortClient, localeShortClientOr } from "@/i18n/localeShortClient";
import {
  useDeleteCategoryAdminMutation,
  useListCategoriesAdminQuery,
  useToggleCategoryActiveAdminMutation,
  useToggleCategoryFeaturedAdminMutation,
} from "@/integrations/endpoints/admin/categories_admin.endpoints";
import type { CategoryDto, CategoryListQueryParams } from "@/integrations/shared";

export default function CategoriesListPanel({ initialModuleKey }: { initialModuleKey?: string }) {
  const t = useAdminT("admin.categories");
  const router = useRouter();

  // Locale management (like CustomPage)
  const { localeOptions, defaultLocaleFromDb, loading: localesLoading, fetching: localesFetching } = useAdminLocales();

  const apiLocale = React.useMemo(() => {
    return resolveAdminApiLocale(localeOptions, defaultLocaleFromDb, "tr");
  }, [localeOptions, defaultLocaleFromDb]);

  // Filters
  const [search, setSearch] = React.useState("");
  const [locale, setLocale] = React.useState("");
  const [moduleKey, setModuleKey] = React.useState(initialModuleKey || "");
  const [showOnlyActive, setShowOnlyActive] = React.useState(false);
  const [showOnlyFeatured, setShowOnlyFeatured] = React.useState(false);

  // Initialize locale state with default from DB
  React.useEffect(() => {
    if (!localeOptions || localeOptions.length === 0) return;

    setLocale((prev) => {
      if (prev) return prev;
      return localeShortClientOr(apiLocale, "tr");
    });
  }, [localeOptions, apiLocale]);

  // Effective locale for query
  const effectiveLocale = React.useMemo(() => {
    const f = localeShortClient(locale);
    return f || apiLocale;
  }, [locale, apiLocale]);

  // AdminLocaleSelect options
  const adminLocaleOptions: AdminLocaleOption[] = React.useMemo(() => {
    return (localeOptions || []).map((opt) => ({
      value: localeShortClient(opt.value) || opt.value,
      label: opt.label || localeShortClient(opt.value)?.toUpperCase() || opt.value,
    }));
  }, [localeOptions]);

  // Build query params
  const queryParams = React.useMemo<CategoryListQueryParams>(() => {
    const params: CategoryListQueryParams = {};

    // Always include locale
    params.locale = effectiveLocale || "tr";

    if (search) params.q = search;
    if (moduleKey) params.module_key = moduleKey;
    if (showOnlyActive) params.is_active = true;
    if (showOnlyFeatured) params.is_featured = true;

    return params;
  }, [search, effectiveLocale, moduleKey, showOnlyActive, showOnlyFeatured]);

  // RTK Query - Fetch categories
  const {
    data: categories = [],
    isFetching,
    refetch,
  } = useListCategoriesAdminQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });

  const busy = isFetching || localesLoading || localesFetching;

  // RTK Mutations
  const [toggleActive] = useToggleCategoryActiveAdminMutation();
  const [toggleFeatured] = useToggleCategoryFeaturedAdminMutation();
  const [deleteCategory] = useDeleteCategoryAdminMutation();

  const handleRefresh = () => {
    toast.info(t("list.refreshing"));
    refetch();
  };

  const handleCreate = () => {
    router.push("/admin/categories/new");
  };

  const handleEdit = (item: CategoryDto) => {
    router.push(`/admin/categories/${item.id}`);
  };

  const handleDelete = async (item: CategoryDto) => {
    if (!confirm(t("messages.confirmDelete", { title: item.name || item.slug || "" }))) {
      return;
    }

    try {
      await deleteCategory(item.id).unwrap();
      toast.success(t("messages.deleted", { title: item.name || item.slug || "" }));
      refetch();
    } catch (error) {
      toast.error(t("messages.deleteError", { message: String(error) }));
    }
  };

  const handleToggleActive = async (item: CategoryDto, value: boolean) => {
    try {
      await toggleActive({ id: item.id, is_active: value }).unwrap();
      toast.success(`${item.name}: ${value ? t("list.activated") : t("list.deactivated")}`);
      refetch();
    } catch (error) {
      toast.error(t("messages.defaultError", { message: String(error) }));
    }
  };

  const handleToggleFeatured = async (item: CategoryDto, value: boolean) => {
    try {
      await toggleFeatured({ id: item.id, is_featured: value }).unwrap();
      toast.success(`${item.name}: ${value ? t("list.featured") : t("list.unfeatured")}`);
      refetch();
    } catch (error) {
      toast.error(t("messages.defaultError", { message: String(error) }));
    }
  };

  return (
    <div className="min-w-0 max-w-full space-y-6 overflow-hidden carbon-mesh min-h-screen pb-12">
      {/* Header + Filters */}
      <Card className="premium-card overflow-hidden border-none">
        <div className="gold-gradient h-1.5 w-full" />
        <CardHeader className="py-4">
          <div className="flex flex-col gap-4">
            {/* Top Row: Search + Filters */}
            <div className="flex flex-col gap-3 lg:flex-row">
              {/* Search */}
              <div className="flex-1">
                <Input
                  placeholder={t("filters.searchPlaceholder")}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  disabled={isFetching}
                />
              </div>

              {/* Locale Filter - Dynamic from DB using AdminLocaleSelect */}
              <div className="w-full lg:w-45">
                <AdminLocaleSelect
                  value={locale || effectiveLocale}
                  onChange={(v) => setLocale(v)}
                  options={adminLocaleOptions}
                  loading={localesLoading || localesFetching}
                  disabled={busy}
                  label={t("filters.locale")}
                />
              </div>

              {/* Module Filter */}
              <Select
                value={moduleKey || "all"}
                onValueChange={(v) => setModuleKey(v === "all" ? "" : v)}
                disabled={busy}
              >
                <SelectTrigger className="w-full lg:w-45">
                  <SelectValue placeholder={t("filters.allModules")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("filters.allModules")}</SelectItem>
                  <SelectItem value="product">{t("modules.product")}</SelectItem>
                  <SelectItem value="services">{t("modules.services")}</SelectItem>
                  <SelectItem value="news">{t("modules.news")}</SelectItem>
                  <SelectItem value="library">{t("modules.library")}</SelectItem>
                  <SelectItem value="about">{t("modules.about")}</SelectItem>
                  <SelectItem value="kompozit">Kompozit</SelectItem>
                  <SelectItem value="sparepart">{t("modules.sparepart")}</SelectItem>
                  <SelectItem value="references">{t("modules.references")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bottom Row: Toggles + Actions */}
            <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
              {/* Toggles */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    id="active-filter"
                    checked={showOnlyActive}
                    onCheckedChange={setShowOnlyActive}
                    disabled={busy}
                  />
                  <Label htmlFor="active-filter" className="cursor-pointer text-sm">
                    {t("filters.onlyActive")}
                  </Label>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    id="featured-filter"
                    checked={showOnlyFeatured}
                    onCheckedChange={setShowOnlyFeatured}
                    disabled={busy}
                  />
                  <Label htmlFor="featured-filter" className="cursor-pointer text-sm">
                    {t("filters.onlyFeatured")}
                  </Label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleRefresh} 
                  disabled={busy}
                  className="rounded-full hover:bg-primary/10 transition-colors"
                >
                  <RefreshCw className={`h-4 w-4 ${busy ? "animate-spin" : ""}`} />
                </Button>
                <Button 
                  onClick={handleCreate} 
                  disabled={busy}
                  className="gold-gradient rounded-full px-6 font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t("actions.create")}
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* List */}
      <Card className="premium-card overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <span className="font-medium text-sm">{t("list.title")}</span>
            <Badge variant="secondary">
              {t("list.total")}: {categories.length}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="min-w-0 p-0">
          {busy && categories.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground text-sm">{t("list.loading")}</div>
          ) : categories.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground text-sm">{t("list.noData")}</div>
          ) : (
            <div className="max-w-full overflow-x-auto">
              <Table className="w-full min-w-[760px] table-fixed">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead className="w-[34%]">{t("table.name")}</TableHead>
                    <TableHead className="w-[22%]">{t("table.slug")}</TableHead>
                    <TableHead className="w-20">{t("table.locale")}</TableHead>
                    <TableHead className="w-28">{t("table.module")}</TableHead>
                    <TableHead className="w-20 text-center">{t("table.active")}</TableHead>
                    <TableHead className="w-24 text-center">{t("table.featured")}</TableHead>
                    <TableHead className="w-24 text-right">{t("table.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((item, index) => (
                    <TableRow key={item.id} className="align-top">
                      <TableCell className="text-muted-foreground text-sm">{index + 1}</TableCell>

                      <TableCell className="whitespace-normal">
                        <div className="min-w-0 space-y-1">
                          <div className="break-words font-medium text-sm leading-snug">{item.name}</div>
                          {item.description && (
                            <div className="break-words text-muted-foreground text-xs leading-relaxed">
                              {item.description}
                            </div>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="whitespace-normal">
                        <code className="block break-all rounded bg-muted/40 px-1.5 py-1 text-xs leading-relaxed">
                          {item.slug}
                        </code>
                      </TableCell>

                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {item.locale}
                        </Badge>
                      </TableCell>

                      <TableCell className="whitespace-normal">
                        <Badge variant="secondary" className="max-w-full whitespace-normal break-words text-xs leading-snug">
                          {item.module_key}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-center">
                        <Switch
                          checked={item.is_active}
                          onCheckedChange={(value) => handleToggleActive(item, value)}
                          disabled={busy}
                        />
                      </TableCell>

                      <TableCell className="text-center">
                        <Switch
                          checked={item.is_featured}
                          onCheckedChange={(value) => handleToggleFeatured(item, value)}
                          disabled={busy}
                        />
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex flex-wrap justify-end gap-1">
                          <Button variant="ghost" size="icon-sm" onClick={() => handleEdit(item)} disabled={busy}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(item)} disabled={busy}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
