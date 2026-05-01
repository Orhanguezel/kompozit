// =============================================================
// FILE: src/app/(main)/admin/(admin)/library/_components/library-list-panel.tsx
// Library List Panel — Shadcn/UI + RTK Query
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
  useListLibraryAdminQuery,
  useRemoveLibraryAdminMutation,
  useUpdateLibraryAdminMutation,
} from "@/integrations/endpoints/admin/library_admin.endpoints";
import type { LibraryDto } from "@/integrations/shared";

const LIBRARY_TYPE_VALUES = ["brochure", "catalog", "manual", "technical", "other"] as const;

const isTruthy = (v: unknown) => v === 1 || v === true || v === "1" || v === "true";

export default function LibraryListPanel() {
  const t = useAdminT("admin.library");
  const router = useRouter();

  const { localeOptions, defaultLocaleFromDb } = useAdminLocales();

  // Filters
  const [search, setSearch] = React.useState("");
  const [locale, setLocale] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState("");
  const [showOnlyActive, setShowOnlyActive] = React.useState(false);
  const [showOnlyPublished, setShowOnlyPublished] = React.useState(false);
  const [showOnlyFeatured, setShowOnlyFeatured] = React.useState(false);

  // Set default locale once options load
  React.useEffect(() => {
    if (!localeOptions?.length) return;
    setLocale((prev) => {
      if (prev) return prev;
      const def = (defaultLocaleFromDb as string) || localeOptions[0]?.value || "tr";
      return String(def);
    });
  }, [localeOptions, defaultLocaleFromDb]);

  // RTK Query
  const {
    data: items = [],
    isFetching,
    refetch,
  } = useListLibraryAdminQuery(
    {
      locale: locale || undefined,
      q: search || undefined,
      type: typeFilter || undefined,
      is_active: showOnlyActive ? true : undefined,
      is_published: showOnlyPublished ? true : undefined,
      featured: showOnlyFeatured ? true : undefined,
      limit: 100,
    },
    { skip: !locale },
  );

  const [updateLibrary] = useUpdateLibraryAdminMutation();
  const [removeLibrary, { isLoading: isDeleting }] = useRemoveLibraryAdminMutation();

  const localesForSelect = React.useMemo<AdminLocaleOption[]>(() => {
    return (localeOptions || []).map((locale) => ({
      value: String(locale.value || ""),
      label: String(locale.label || locale.value || ""),
    }));
  }, [localeOptions]);

  const libraryTypes = React.useMemo(
    () =>
      LIBRARY_TYPE_VALUES.map((value) => ({
        value,
        label: t(`detail.types.${value}`),
      })),
    [t],
  );

  const handleToggleActive = async (item: LibraryDto, value: boolean) => {
    try {
      await updateLibrary({ id: item.id, patch: { is_active: value } }).unwrap();
    } catch {
      toast.error(t("messages.toggleActiveError"));
    }
  };

  const handleTogglePublished = async (item: LibraryDto, value: boolean) => {
    try {
      await updateLibrary({ id: item.id, patch: { is_published: value } }).unwrap();
    } catch {
      toast.error(t("messages.togglePublishedError"));
    }
  };

  const handleToggleFeatured = async (item: LibraryDto, value: boolean) => {
    try {
      await updateLibrary({ id: item.id, patch: { featured: value } }).unwrap();
    } catch {
      toast.error(t("messages.toggleFeaturedError"));
    }
  };

  const handleDelete = async (item: LibraryDto) => {
    if (!confirm(t("messages.confirmDelete", { title: item.name || item.slug || "" }))) return;
    try {
      await removeLibrary(item.id).unwrap();
      toast.success(t("messages.deleted"));
      refetch();
    } catch {
      toast.error(t("messages.deleteError"));
    }
  };

  const isLoading = isFetching || isDeleting;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-base">{t("header.title")}</h2>
              <p className="text-muted-foreground text-sm">{t("header.description")}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => refetch()} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
              </Button>
              <Button onClick={() => router.push("/admin/library/new")}>
                <Plus className="mr-2 h-4 w-4" />
                {t("actions.create")}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
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

            {/* Type */}
            <div className="w-[160px]">
              <Select
                value={typeFilter || "all"}
                onValueChange={(v) => setTypeFilter(v === "all" ? "" : v)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("filters.allTypes")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("filters.allTypes")}</SelectItem>
                  {libraryTypes.map((libraryType) => (
                    <SelectItem key={libraryType.value} value={libraryType.value}>
                      {libraryType.label}
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
                  {t("table.active")}
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="published-filter"
                  checked={showOnlyPublished}
                  onCheckedChange={setShowOnlyPublished}
                  disabled={isLoading}
                />
                <Label htmlFor="published-filter" className="cursor-pointer text-sm">
                  {t("table.published")}
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
                  {t("table.featured")}
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[48px]">#</TableHead>
                <TableHead>{t("table.name")}</TableHead>
                <TableHead className="w-[110px]">{t("table.type")}</TableHead>
                <TableHead className="w-[80px] text-center">{t("table.active")}</TableHead>
                <TableHead className="w-[80px] text-center">{t("table.published")}</TableHead>
                <TableHead className="w-[90px] text-center">{t("table.featured")}</TableHead>
                <TableHead className="w-[70px] text-center">{t("table.views")}</TableHead>
                <TableHead className="w-[70px] text-center">{t("table.downloads")}</TableHead>
                <TableHead className="w-[60px] text-center">{t("table.order")}</TableHead>
                <TableHead className="w-[110px] text-right">{t("table.actions")}</TableHead>
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
                items.map((item, idx) => {
                  const isActive = isTruthy(item.is_active);
                  const isPublished = isTruthy(item.is_published);
                  const isFeatured = isTruthy(item.featured);
                  const typeMeta = libraryTypes.find((libraryType) => libraryType.value === item.type);

                  return (
                    <TableRow key={item.id} className={!isActive ? "opacity-50" : ""}>
                      <TableCell className="text-muted-foreground text-sm">{idx + 1}</TableCell>

                      <TableCell>
                        <div className="max-w-[280px] truncate font-medium text-sm" title={item.name || ""}>
                          {item.name || <span className="text-muted-foreground italic">{t("list.unnamed")}</span>}
                        </div>
                        <div className="max-w-[280px] truncate text-muted-foreground text-xs">
                          <code>{item.slug || "—"}</code>
                        </div>
                      </TableCell>

                      <TableCell>
                        {typeMeta ? (
                          <Badge variant="secondary" className="text-xs">
                            {typeMeta.label}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-xs">{item.type || "—"}</span>
                        )}
                      </TableCell>

                      <TableCell className="text-center">
                        <Switch
                          checked={isActive}
                          disabled={isLoading}
                          onCheckedChange={(v) => handleToggleActive(item, v)}
                        />
                      </TableCell>

                      <TableCell className="text-center">
                        <Switch
                          checked={isPublished}
                          disabled={isLoading}
                          onCheckedChange={(v) => handleTogglePublished(item, v)}
                        />
                      </TableCell>

                      <TableCell className="text-center">
                        <Switch
                          checked={isFeatured}
                          disabled={isLoading}
                          onCheckedChange={(v) => handleToggleFeatured(item, v)}
                        />
                      </TableCell>

                      <TableCell className="text-center text-sm">{item.views ?? 0}</TableCell>
                      <TableCell className="text-center text-sm">{item.download_count ?? 0}</TableCell>
                      <TableCell className="text-center text-sm">{item.display_order ?? 0}</TableCell>

                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={isLoading}
                            onClick={() => router.push(`/admin/library/${item.id}`)}
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
