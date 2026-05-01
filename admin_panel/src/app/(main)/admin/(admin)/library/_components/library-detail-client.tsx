// =============================================================
// FILE: src/app/(main)/admin/(admin)/library/_components/library-detail-client.tsx
// Library Detail/Edit Form — CLAUDE.md Standartı
// - Form Tab: tüm alanlar + görsel sidebar
// - JSON Tab: tüm formData + görsel sidebar
// - AdminLocaleSelect, AdminJsonEditor, AdminImageUploadField
// Ensotek Admin Panel
// =============================================================

"use client";

import * as React from "react";

import { useRouter } from "next/navigation";

import { ArrowLeft, FileJson, Save } from "lucide-react";
import { toast } from "sonner";

import { AdminImageUploadField } from "@/app/(main)/admin/_components/common/AdminImageUploadField";
import { AdminJsonEditor } from "@/app/(main)/admin/_components/common/AdminJsonEditor";
import { AdminLocaleSelect } from "@/app/(main)/admin/_components/common/AdminLocaleSelect";
import RichContentEditor from "@/app/(main)/admin/_components/common/RichContentEditor";
import { useAdminLocales } from "@/app/(main)/admin/_components/common/useAdminLocales";
import { useAdminT } from "@/app/(main)/admin/_components/common/useAdminT";
import { Button } from "@ensotek/shared-ui/admin/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ensotek/shared-ui/admin/ui/card";
import { Input } from "@ensotek/shared-ui/admin/ui/input";
import { Label } from "@ensotek/shared-ui/admin/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ensotek/shared-ui/admin/ui/select";
import { Switch } from "@ensotek/shared-ui/admin/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ensotek/shared-ui/admin/ui/tabs";
import { Textarea } from "@ensotek/shared-ui/admin/ui/textarea";
import {
  useCreateLibraryAdminMutation,
  useGetLibraryAdminQuery,
  useUpdateLibraryAdminMutation,
} from "@/integrations/endpoints/admin/library_admin.endpoints";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

import { LibraryFilesSection } from "./library-files-section";
import { LibraryImagesSection } from "./library-images-section";

// ─── Sabitler ────────────────────────────────────────────────

const LIBRARY_TYPE_VALUES = ["brochure", "catalog", "manual", "technical", "other"] as const;

// ─── Props ───────────────────────────────────────────────────

interface Props {
  id: string;
}

type LibraryFormData = {
  locale: string;
  type: string;
  name: string;
  slug: string;
  description: string;
  image_alt: string;
  tags: string;
  image_url: string;
  image_asset_id: string;
  featured_image: string;
  category_id: string;
  sub_category_id: string;
  display_order: number;
  is_active: boolean;
  is_published: boolean;
  featured: boolean;
  published_at: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
};

function getObj(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null ? (value as Record<string, unknown>) : null;
}

function getErrorMessage(error: unknown, fallback: string): string {
  const errorObj = getObj(error);
  const data = getObj(errorObj?.data);
  const nestedError = getObj(data?.error);

  return String(nestedError?.message || data?.message || errorObj?.message || fallback);
}

// ─── Bileşen ─────────────────────────────────────────────────

export default function LibraryDetailClient({ id }: Props) {
  const t = useAdminT("admin.library");
  const router = useRouter();
  const adminLocale = usePreferencesStore((s) => s.adminLocale);
  const isNew = id === "new";

  const { localeOptions } = useAdminLocales();
  const [activeLocale, setActiveLocale] = React.useState<string>(adminLocale || "tr");
  const [activeTab, setActiveTab] = React.useState<"form" | "json">("form");

  // ── RTK Query ──
  const { data: item, isFetching, refetch } = useGetLibraryAdminQuery({ id, locale: activeLocale }, { skip: isNew });
  const [createLibrary, { isLoading: isCreating }] = useCreateLibraryAdminMutation();
  const [updateLibrary, { isLoading: isUpdating }] = useUpdateLibraryAdminMutation();

  // ── Form state ──
  const [formData, setFormData] = React.useState<LibraryFormData>({
    locale: activeLocale,
    type: "other" as string,
    name: "",
    slug: "",
    description: "",
    image_alt: "",
    tags: "",
    image_url: "",
    image_asset_id: "",
    featured_image: "",
    category_id: "",
    sub_category_id: "",
    display_order: 0,
    is_active: true,
    is_published: true,
    featured: false,
    published_at: "",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
  });

  // ── Veri yüklenince formData'yı doldur ──
  React.useEffect(() => {
    if (item && !isNew) {
      setFormData({
        locale: item.locale || activeLocale,
        type: item.type || "other",
        name: item.name || "",
        slug: item.slug || "",
        description: item.description || "",
        image_alt: item.image_alt || "",
        tags: item.tags || "",
        image_url: item.image_url || "",
        image_asset_id: item.image_asset_id || "",
        featured_image: item.featured_image || "",
        category_id: item.category_id || "",
        sub_category_id: item.sub_category_id || "",
        display_order: item.display_order ?? 0,
        is_active: item.is_active === 1,
        is_published: item.is_published === 1,
        featured: item.featured === 1,
        published_at: item.published_at || "",
        meta_title: item.meta_title || "",
        meta_description: item.meta_description || "",
        meta_keywords: item.meta_keywords || "",
      });
    }
  }, [item, isNew, activeLocale]);

  // ── Locale değişince yeniden çek ──
  React.useEffect(() => {
    if (!isNew && id) refetch();
  }, [id, isNew, refetch]);

  // ── Handler'lar ──
  const handleBack = () => router.push("/admin/library");

  const handleLocaleChange = (next: string) => {
    setActiveLocale(next);
    setFormData((prev) => ({ ...prev, locale: next }));
  };

  const handleChange = (field: string, value: unknown) => setFormData((prev) => ({ ...prev, [field]: value }));

  // JSON tab: tüm formData'yı günceller (CLAUDE.md standartı)
  const handleJsonChange = (json: Partial<LibraryFormData>) => setFormData((prev) => ({ ...prev, ...json }));

  // Görsel upload (hem form hem JSON tab sidebar)
  const handleImageChange = (url: string) => setFormData((prev) => ({ ...prev, image_url: url }));

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!formData.name.trim()) {
      toast.error(t("detail.nameRequired"));
      return;
    }
    if (!formData.slug.trim() && !isNew) {
      toast.error(t("detail.slugRequired"));
      return;
    }

    const payload = {
      locale: activeLocale,
      type: formData.type || "other",
      name: formData.name.trim() || undefined,
      slug: formData.slug.trim() || undefined,
      description: formData.description || undefined,
      image_alt: formData.image_alt || undefined,
      tags: formData.tags || undefined,
      image_url: formData.image_url || null,
      image_asset_id: formData.image_asset_id || null,
      featured_image: formData.featured_image || null,
      category_id: formData.category_id || null,
      sub_category_id: formData.sub_category_id || null,
      display_order: formData.display_order ?? 0,
      is_active: formData.is_active,
      is_published: formData.is_published,
      featured: formData.featured,
      published_at: formData.published_at || null,
      meta_title: formData.meta_title || undefined,
      meta_description: formData.meta_description || undefined,
      meta_keywords: formData.meta_keywords || undefined,
    };

    try {
      if (isNew) {
        await createLibrary(payload).unwrap();
        toast.success(t("detail.createSuccess"));
      } else {
        await updateLibrary({ id, patch: payload }).unwrap();
        toast.success(t("detail.updateSuccess"));
      }
      router.push("/admin/library");
    } catch (error: unknown) {
      toast.error(t("detail.errorPrefix", { message: getErrorMessage(error, t("detail.defaultError")) }));
    }
  };

  const isLoading = isFetching || isCreating || isUpdating;

  const localesForSelect = React.useMemo(() => {
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

  // ─── Render ──────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <CardTitle className="text-base">{isNew ? t("actions.create") : t("actions.edit")}</CardTitle>
                <CardDescription>
                  {isNew ? t("detail.createDescription") : t("detail.editDescription", { title: item?.name || "" })}
                </CardDescription>
              </div>
            </div>
            <AdminLocaleSelect
              options={localesForSelect}
              value={activeLocale}
              onChange={handleLocaleChange}
              disabled={isLoading}
            />
          </div>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "form" | "json")}>
        <TabsList>
          <TabsTrigger value="form">{t("detail.formTab")}</TabsTrigger>
          <TabsTrigger value="json">
            <FileJson className="mr-2 h-4 w-4" />
            JSON
          </TabsTrigger>
        </TabsList>

        {/* ── Form Tab ─────────────────────────────────────────── */}
        <TabsContent value="form">
          <form onSubmit={handleSubmit}>
            <Card>
              <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                  {/* Sol: form alanları */}
                  <div className="space-y-6 lg:col-span-2">
                    {/* Ad */}
                    <div className="space-y-2">
                      <Label htmlFor="name">{t("detail.name")} *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        disabled={isLoading}
                        placeholder={t("detail.namePlaceholder")}
                      />
                    </div>

                    {/* Slug */}
                    <div className="space-y-2">
                      <Label htmlFor="slug">Slug {!isNew && "*"}</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => handleChange("slug", e.target.value)}
                        disabled={isLoading}
                        placeholder={t("detail.slugPlaceholder")}
                      />
                    </div>

                    {/* Tip + Sıralama */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="type">{t("detail.type")}</Label>
                        <Select
                          value={formData.type}
                          onValueChange={(v) => handleChange("type", v)}
                          disabled={isLoading}
                        >
                          <SelectTrigger id="type">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {libraryTypes.map((libraryType) => (
                              <SelectItem key={libraryType.value} value={libraryType.value}>
                                {libraryType.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="display_order">{t("detail.displayOrder")}</Label>
                        <Input
                          id="display_order"
                          type="number"
                          value={formData.display_order}
                          onChange={(e) => handleChange("display_order", Number(e.target.value))}
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    {/* Açıklama */}
                    <div className="space-y-2">
                      <Label htmlFor="description">{t("detail.description")}</Label>
                      <RichContentEditor
                        value={formData.description}
                        onChange={(v) => handleChange("description", v)}
                        disabled={isLoading}
                        height="300px"
                      />
                    </div>

                    {/* Alt + Etiketler */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="image_alt">{t("detail.imageAlt")}</Label>
                        <Input
                          id="image_alt"
                          value={formData.image_alt}
                          onChange={(e) => handleChange("image_alt", e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tags">{t("detail.tags")}</Label>
                        <Input
                          id="tags"
                          value={formData.tags}
                          onChange={(e) => handleChange("tags", e.target.value)}
                          disabled={isLoading}
                          placeholder={t("detail.tagsPlaceholder")}
                        />
                      </div>
                    </div>

                    {/* Yayın tarihi */}
                    <div className="space-y-2">
                      <Label htmlFor="published_at">{t("detail.publishedAt")}</Label>
                      <Input
                        id="published_at"
                        type="datetime-local"
                        value={formData.published_at}
                        onChange={(e) => handleChange("published_at", e.target.value)}
                        disabled={isLoading}
                      />
                    </div>

                    {/* SEO */}
                    <div className="space-y-4 rounded-md border p-4">
                      <p className="font-medium text-muted-foreground text-sm">{t("detail.seoTitle")}</p>
                      <div className="space-y-2">
                        <Label htmlFor="meta_title">{t("detail.metaTitle")}</Label>
                        <Input
                          id="meta_title"
                          value={formData.meta_title}
                          onChange={(e) => handleChange("meta_title", e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="meta_description">{t("detail.metaDescription")}</Label>
                        <Textarea
                          id="meta_description"
                          value={formData.meta_description}
                          onChange={(e) => handleChange("meta_description", e.target.value)}
                          disabled={isLoading}
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="meta_keywords">{t("detail.metaKeywords")}</Label>
                        <Input
                          id="meta_keywords"
                          value={formData.meta_keywords}
                          onChange={(e) => handleChange("meta_keywords", e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    {/* Toggles */}
                    <div className="flex flex-wrap gap-6">
                      <div className="flex items-center gap-2">
                        <Switch
                          id="is_active"
                          checked={formData.is_active}
                          onCheckedChange={(v) => handleChange("is_active", v)}
                          disabled={isLoading}
                        />
                        <Label htmlFor="is_active" className="cursor-pointer">
                          {t("detail.isActive")}
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          id="is_published"
                          checked={formData.is_published}
                          onCheckedChange={(v) => handleChange("is_published", v)}
                          disabled={isLoading}
                        />
                        <Label htmlFor="is_published" className="cursor-pointer">
                          {t("detail.isPublished")}
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          id="featured"
                          checked={formData.featured}
                          onCheckedChange={(v) => handleChange("featured", v)}
                          disabled={isLoading}
                        />
                        <Label htmlFor="featured" className="cursor-pointer">
                          {t("detail.isFeatured")}
                        </Label>
                      </div>
                    </div>
                  </div>

                  {/* Sağ: görsel sidebar */}
                  <div className="space-y-4">
                    <AdminImageUploadField
                      label={t("detail.coverImage")}
                      value={formData.image_url}
                      onChange={handleImageChange}
                      disabled={isLoading}
                    />

                    {!isNew && (
                      <>
                        <LibraryFilesSection libraryId={id} locale={activeLocale} />
                        <LibraryImagesSection
                          libraryId={id}
                          locale={activeLocale}
                          coverUrl={formData.image_url}
                          onSelectAsCover={handleImageChange}
                        />
                      </>
                    )}
                  </div>
                </div>

                {/* Kaydet */}
                <div className="flex justify-end gap-3 border-t pt-4">
                  <Button type="button" variant="outline" onClick={handleBack} disabled={isLoading}>
                    {t("actions.cancel")}
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    <Save className="mr-2 h-4 w-4" />
                    {t("actions.save")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </TabsContent>

        {/* ── JSON Tab ─────────────────────────────────────────── */}
        <TabsContent value="json">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("detail.jsonTitle")}</CardTitle>
              <CardDescription>{t("detail.jsonDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Sol: tüm formData JSON editörde */}
                <div className="lg:col-span-2">
                  <AdminJsonEditor value={formData} onChange={handleJsonChange} disabled={isLoading} height={500} />
                </div>

                {/* Sağ: görsel önizleme/yükleme */}
                <div className="space-y-4">
                  <AdminImageUploadField
                    label={t("detail.coverImage")}
                    value={formData.image_url}
                    onChange={handleImageChange}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t pt-4">
                <Button type="button" variant="outline" onClick={handleBack} disabled={isLoading}>
                  {t("actions.cancel")}
                </Button>
                <Button onClick={() => handleSubmit()} disabled={isLoading}>
                  <Save className="mr-2 h-4 w-4" />
                  {t("actions.save")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
