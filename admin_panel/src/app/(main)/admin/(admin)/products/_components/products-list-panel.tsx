// =============================================================
// FILE: src/app/(main)/admin/(admin)/products/_components/products-list-panel.tsx
// Products List Panel — Shadcn/UI + RTK Query
// Ensotek Admin Panel Standartı
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
import {
  useDeleteProductAdminMutation,
  useListProductCategoriesAdminQuery,
  useListProductsAdminQuery,
  useUpdateProductAdminMutation,
} from "@/integrations/endpoints/admin/products_admin.endpoints";
import type { AdminProductDto, ProductItemType } from "@/integrations/shared/product_admin.types";
import { normalizeAdminAssetUrl } from "@/lib/admin-asset-url";

const isTruthy = (v: unknown) => v === 1 || v === true || v === "1" || v === "true";

interface Props {
  itemType: ProductItemType;
}

export default function ProductsListPanel({ itemType }: Props) {
  const t = useAdminT("admin.products");
  const router = useRouter();

  const isSparepart = itemType === "sparepart";
  const newUrl = `/admin/products/new?type=${encodeURIComponent(itemType)}`;

  const { localeOptions, defaultLocaleFromDb } = useAdminLocales();

  // Filters
  const [search, setSearch] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("");
  const [showOnlyActive, setShowOnlyActive] = React.useState(false);
  const [showOnlyFeatured, setShowOnlyFeatured] = React.useState(false);

  // Locale: DB'den gelen default, yoksa "tr"
  const [locale, setLocale] = React.useState<string>(
    () => (defaultLocaleFromDb as string) || "tr",
  );

  React.useEffect(() => {
    if (defaultLocaleFromDb) setLocale((prev) => prev || String(defaultLocaleFromDb));
    else if (localeOptions?.length) setLocale((prev) => prev || (localeOptions[0]?.value ?? "tr"));
  }, [localeOptions, defaultLocaleFromDb]);

  // RTK Query — locale her zaman dolu, skip yok
  const {
    data: productData,
    isFetching,
    refetch,
  } = useListProductsAdminQuery({
    locale,
    q: search || undefined,
    item_type: itemType,
    category_id: categoryFilter || undefined,
    is_active: showOnlyActive ? true : undefined,
    is_featured: showOnlyFeatured ? true : undefined,
    limit: 100,
  });

  const { data: categories = [] } = useListProductCategoriesAdminQuery({
    locale,
    module_key: itemType === "kompozit" ? "kompozit" : undefined,
  });

  const items: AdminProductDto[] = productData?.items ?? [];

  const categoryById = React.useMemo(() => {
    const map = new Map<string, (typeof categories)[number]>();
    for (const category of categories) {
      if (category?.id) map.set(String(category.id), category);
    }
    return map;
  }, [categories]);

  const [updateProduct] = useUpdateProductAdminMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductAdminMutation();

  const localesForSelect = React.useMemo<AdminLocaleOption[]>(() => {
    return (localeOptions || []).map((locale) => ({
      value: String(locale.value || ""),
      label: String(locale.label || locale.value || ""),
    }));
  }, [localeOptions]);

  const handleToggleActive = async (item: AdminProductDto, value: boolean) => {
    try {
      await updateProduct({ id: item.id, patch: { is_active: value } }).unwrap();
    } catch {
      toast.error(t("messages.toggleActiveError"));
    }
  };

  const handleToggleFeatured = async (item: AdminProductDto, value: boolean) => {
    try {
      await updateProduct({ id: item.id, patch: { is_featured: value } }).unwrap();
    } catch {
      toast.error(t("messages.toggleFeaturedError"));
    }
  };

  const handleDelete = async (item: AdminProductDto) => {
    if (!confirm(t("messages.confirmDelete", { title: item.title || item.slug || "" }))) return;
    try {
      await deleteProduct({ id: item.id }).unwrap();
      toast.success(t("messages.deleted"));
      refetch();
    } catch {
      toast.error(t("messages.deleteError"));
    }
  };

  const isLoading = isFetching || isDeleting;

  return (
    <div className="space-y-6 carbon-mesh min-h-screen pb-12">
      {/* Header */}
      <Card className="premium-card overflow-hidden border-none">
        <div className="gold-gradient h-1.5 w-full" />
        <CardHeader className="py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                {isSparepart ? t("header.title_sparepart") : t("header.title")}
              </h2>
              <p className="text-muted-foreground/80 text-sm">
                {isSparepart ? t("header.description_sparepart") : t("header.description")}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => refetch()} 
                disabled={isLoading}
                className="rounded-full hover:bg-primary/10 transition-colors"
              >
                <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
              </Button>
              <Button 
                onClick={() => router.push(newUrl)}
                className="gold-gradient rounded-full px-6 font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Plus className="mr-2 h-4 w-4" />
                {t("actions.create")}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card className="premium-card bg-card/20 border-white/5">
        <CardContent className="pt-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
            {/* Search */}
            <div className="min-w-[180px] flex-1">
              <Input
                placeholder={t("filters.search")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {/* Locale */}
            <div className="w-[140px]">
              <AdminLocaleSelect options={localesForSelect} value={locale} onChange={setLocale} disabled={isLoading} />
            </div>

            {/* Category */}
            <div className="w-[180px]">
              <Select
                value={categoryFilter || "all"}
                onValueChange={(v) => setCategoryFilter(v === "all" ? "" : v)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("list.allCategories")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("list.allCategories")}</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      {cat.name || cat.slug}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  id="active-filter"
                  checked={showOnlyActive}
                  onCheckedChange={setShowOnlyActive}
                  disabled={isLoading}
                />
                <Label htmlFor="active-filter" className="cursor-pointer text-sm">
                  {t("list.columns.active")}
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="featured-filter"
                  checked={showOnlyFeatured}
                  onCheckedChange={setShowOnlyFeatured}
                  disabled={isLoading}
                />
                <Label htmlFor="featured-filter" className="cursor-pointer text-sm">
                  {t("list.columns.featured")}
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="premium-card overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[48px]">#</TableHead>
                <TableHead className="w-[52px]"></TableHead>
                <TableHead>{t("list.columns.title")}</TableHead>
                <TableHead className="w-[80px]">{t("list.columns.locale")}</TableHead>
                <TableHead className="w-[140px]">{t("list.columns.category")}</TableHead>
                <TableHead className="w-[90px] text-right">{t("list.columns.price")}</TableHead>
                <TableHead className="w-[70px] text-center">{t("list.columns.stock")}</TableHead>
                <TableHead className="w-[80px] text-center">{t("list.columns.active")}</TableHead>
                <TableHead className="w-[90px] text-center">{t("list.columns.featured")}</TableHead>
                <TableHead className="w-[110px] text-right">{t("list.columns.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isFetching && items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="py-8 text-center text-muted-foreground text-sm">
                    {t("list.loading")}
                  </TableCell>
                </TableRow>
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="py-8 text-center text-muted-foreground text-sm">
                    {t("list.empty")}
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item: AdminProductDto, idx: number) => {
                  const isActive = isTruthy(item.is_active);
                  const isFeatured = isTruthy(item.is_featured);
                  const imageUrl = normalizeAdminAssetUrl(item.image_url);

                  return (
                    <TableRow key={item.id} className={!isActive ? "opacity-50" : ""}>
                      <TableCell className="text-muted-foreground text-sm">{idx + 1}</TableCell>

                      <TableCell className="p-1">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={item.title || ""}
                            className="h-10 w-10 rounded object-cover border border-border bg-muted"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded border border-border bg-muted" />
                        )}
                      </TableCell>

                      <TableCell>
                        <div className="max-w-[260px] truncate font-medium text-sm" title={item.title || ""}>
                          {item.title || <span className="text-muted-foreground italic">{t("list.unnamed")}</span>}
                        </div>
                        <div className="max-w-[260px] truncate text-muted-foreground text-xs">
                          <code>{item.slug || "—"}</code>
                          {item.product_code && (
                            <span className="ml-2 text-muted-foreground">[{item.product_code}]</span>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {item.locale || "—"}
                        </Badge>
                      </TableCell>

                      <TableCell className="max-w-[140px] text-sm">
                        {(() => {
                          const category = item.category_id ? categoryById.get(String(item.category_id)) : undefined;
                          if (!item.category_id) return <span className="text-muted-foreground">—</span>;

                          return (
                            <div className="min-w-0 space-y-0.5">
                              <div className="truncate font-medium text-foreground" title={category?.name || item.category_id}>
                                {category?.name || item.category_id}
                              </div>
                              <div
                                className="truncate font-mono text-muted-foreground text-[11px]"
                                title={category?.slug || item.category_id}
                              >
                                {category?.slug || item.category_id}
                              </div>
                            </div>
                          );
                        })()}
                      </TableCell>

                      <TableCell className="text-right text-sm">
                        {item.price != null ? Number(item.price).toLocaleString("tr-TR") : "—"}
                      </TableCell>

                      <TableCell className="text-center text-sm">{item.stock_quantity ?? "—"}</TableCell>

                      <TableCell className="text-center">
                        <div className="flex flex-col items-center gap-1">
                          <Badge
                            className={
                              isActive
                                ? "border-green-300 bg-green-100 text-green-900"
                                : "border-red-300 bg-red-100 text-red-900"
                            }
                            variant="outline"
                          >
                            {isActive ? t("list.status.active") : t("list.status.inactive")}
                          </Badge>
                          <Switch
                            checked={isActive}
                            disabled={isLoading}
                            onCheckedChange={(v) => handleToggleActive(item, v)}
                          />
                        </div>
                      </TableCell>

                      <TableCell className="text-center">
                        <div className="flex flex-col items-center gap-1">
                          <Badge
                            className={
                              isFeatured
                                ? "border-amber-300 bg-amber-100 text-amber-900"
                                : "border-slate-300 bg-slate-100 text-slate-800"
                            }
                            variant="outline"
                          >
                            {isFeatured ? t("list.status.featured") : t("list.status.notFeatured")}
                          </Badge>
                          <Switch
                            checked={isFeatured}
                            disabled={isLoading}
                            onCheckedChange={(v) => handleToggleFeatured(item, v)}
                          />
                        </div>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={isLoading}
                            onClick={() =>
                              router.push(
                                `/admin/products/${item.id}?type=${encodeURIComponent(item.item_type || itemType)}`,
                              )
                            }
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" disabled={isLoading} onClick={() => handleDelete(item)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
