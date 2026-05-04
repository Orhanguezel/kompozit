// =============================================================
// FILE: src/app/(main)/admin/(admin)/products/_components/product-detail-client.tsx
// Product Detail/Edit Form — CLAUDE.md Standartı
// - Form Tab: tüm alanlar + kategori + görsel sidebar
// - Specs Tab: teknik özellikler (ürün kaydedildikten sonra aktif)
// - FAQs Tab: sıkça sorulan sorular
// - Reviews Tab: değerlendirmeler
// - JSON Tab: tüm formData + görsel sidebar
// Ensotek Admin Panel
// =============================================================

"use client";

import * as React from "react";

import { useRouter } from "next/navigation";

import { ArrowLeft, FileJson, HelpCircle, ListChecks, Save, Star } from "lucide-react";
import { toast } from "sonner";

import { AdminImageUploadField } from "@/app/(main)/admin/_components/common/AdminImageUploadField";
import { AdminJsonEditor } from "@/app/(main)/admin/_components/common/AdminJsonEditor";
import { type AdminLocaleOption, AdminLocaleSelect } from "@/app/(main)/admin/_components/common/AdminLocaleSelect";
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
  useCreateProductAdminMutation,
  useGetProductAdminQuery,
  useListProductCategoriesAdminQuery,
  useListProductSubcategoriesAdminQuery,
  useUpdateProductAdminMutation,
} from "@/integrations/endpoints/admin/products_admin.endpoints";
import type { ProductItemType } from "@/integrations/shared/product_admin.types";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

import { ProductFaqsTab } from "./product-faqs-tab";
import { ProductReviewsTab } from "./product-reviews-tab";
import { ProductSpecsTab } from "./product-specs-tab";

type ProductFormData = {
  locale: string;
  title: string;
  slug: string;
  price: string | number;
  stock_quantity: string | number;
  product_code: string;
  description: string;
  image_alt: string;
  tags: string;
  category_id: string;
  sub_category_id: string;
  image_url: string;
  image_asset_id: string;
  is_active: boolean;
  is_featured: boolean;
  meta_title: string;
  meta_description: string;
};

function getObj(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null ? (value as Record<string, unknown>) : null;
}

function getErrMessage(error: unknown, fallback: string): string {
  const errObj = getObj(error);
  const data = getObj(errObj?.data);
  const nestedError = getObj(data?.error);
  const message = nestedError?.message ?? data?.message ?? errObj?.message;
  return typeof message === "string" && message.trim() ? message : fallback;
}

interface Props {
  id: string;
  itemType: ProductItemType;
}

// ─── Bileşen ─────────────────────────────────────────────────

export default function ProductDetailClient({ id, itemType }: Props) {
  const t = useAdminT("admin.products");
  const router = useRouter();
  const adminLocale = usePreferencesStore((s) => s.adminLocale);
  const isNew = id === "new";
  const backUrl = `/admin/products?type=${encodeURIComponent(itemType)}`;

  const { localeOptions } = useAdminLocales();
  const [activeLocale, setActiveLocale] = React.useState<string>(adminLocale || "tr");
  const [activeTab, setActiveTab] = React.useState<"form" | "specs" | "faqs" | "reviews" | "json">("form");

  // ── RTK Query ──
  const {
    data: item,
    isFetching,
    refetch,
  } = useGetProductAdminQuery(
    { id, locale: activeLocale, item_type: itemType },
    { skip: isNew },
  );

  const { data: categories = [] } = useListProductCategoriesAdminQuery(
    { locale: activeLocale },
    { skip: !activeLocale },
  );

  const [createProduct, { isLoading: isCreating }] = useCreateProductAdminMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductAdminMutation();

  // ── Form state ──
  const [formData, setFormData] = React.useState<ProductFormData>({
    locale: activeLocale,
    title: "",
    slug: "",
    price: "" as string | number,
    stock_quantity: "" as string | number,
    product_code: "",
    description: "",
    image_alt: "",
    tags: "",
    category_id: "",
    sub_category_id: "",
    image_url: "",
    image_asset_id: "",
    is_active: true,
    is_featured: false,
    meta_title: "",
    meta_description: "",
  });

  // ── Subcat listesi (category'ye göre) ──
  const { data: subcategories = [] } = useListProductSubcategoriesAdminQuery(
    { category_id: formData.category_id, locale: activeLocale },
    { skip: !formData.category_id },
  );

  // ── Veri yüklenince formData'yı doldur ──
  React.useEffect(() => {
    if (item && !isNew) {
      setFormData({
        locale: item.locale || activeLocale,
        title: item.title || "",
        slug: item.slug || "",
        price: item.price ?? "",
        stock_quantity: item.stock_quantity ?? "",
        product_code: item.product_code || "",
        description: item.description || "",
        image_alt: item.alt || "",
        tags: Array.isArray(item.tags) ? item.tags.join(", ") : item.tags || "",
        category_id: item.category_id ? String(item.category_id) : "",
        sub_category_id: item.sub_category_id ? String(item.sub_category_id) : "",
        image_url: item.image_url || "",
        image_asset_id: item.storage_asset_id || "",
        is_active: item.is_active === 1 || item.is_active === true,
        is_featured: item.is_featured === 1 || item.is_featured === true,
        meta_title: item.meta_title || "",
        meta_description: item.meta_description || "",
      });
    }
  }, [item, isNew, activeLocale]);

  // ── Locale değişince yeniden çek ──
  React.useEffect(() => {
    if (!isNew && id) refetch();
  }, [id, isNew, refetch]);

  // ── Handler'lar ──
  const handleBack = () => router.push(backUrl);

  const handleLocaleChange = (next: string) => {
    setActiveLocale(next);
    setFormData((prev) => ({ ...prev, locale: next }));
  };

  const handleChange = (field: string, value: unknown) => setFormData((prev) => ({ ...prev, [field]: value }));

  const handleJsonChange = (json: Partial<ProductFormData>) => setFormData((prev) => ({ ...prev, ...json }));

  const handleImageChange = (url: string) => setFormData((prev) => ({ ...prev, image_url: url }));

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!formData.title.trim()) {
      toast.error(t("detail.titleRequired"));
      return;
    }

    const tagsArray = formData.tags
      ? formData.tags
          .toString()
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    const payload = {
      locale: activeLocale,
      title: formData.title.trim(),
      slug: formData.slug.trim() || formData.title.trim().toLowerCase().replace(/\s+/g, "-"),
      price: formData.price !== "" ? Number(formData.price) : 0,
      stock_quantity: formData.stock_quantity !== "" ? Number(formData.stock_quantity) : undefined,
      product_code: formData.product_code || undefined,
      description: formData.description || undefined,
      alt: formData.image_alt || undefined,
      tags: tagsArray,
      category_id: formData.category_id || "",
      sub_category_id: formData.sub_category_id || null,
      image_url: formData.image_url || null,
      storage_asset_id: formData.image_asset_id || null,
      is_active: formData.is_active,
      is_featured: formData.is_featured,
      meta_title: formData.meta_title || undefined,
      meta_description: formData.meta_description || undefined,
      item_type: isNew ? itemType : undefined,
    };

    try {
      if (isNew) {
        const result = await createProduct(payload).unwrap();
        toast.success(t("detail.createSuccess"));
        if (result?.id) {
          const typeParam = `?type=${encodeURIComponent(itemType)}`;
          router.push(`/admin/products/${result.id}${typeParam}`);
        }
      } else {
        await updateProduct({ id, patch: payload }).unwrap();
        toast.success(t("detail.updateSuccess"));
      }
    } catch (error: unknown) {
      toast.error(t("detail.errorPrefix", { message: getErrMessage(error, t("detail.defaultError")) }));
    }
  };

  const isLoading = isFetching || isCreating || isUpdating;
  const productId = isNew ? undefined : id;

  const localesForSelect = React.useMemo(() => {
    return (localeOptions || []).map(
      (locale): AdminLocaleOption => ({
        value: String(locale.value || ""),
        label: String(locale.label || locale.value || ""),
      }),
    );
  }, [localeOptions]);

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
                  {isNew ? t("detail.createDescription") : t("detail.editDescription", { title: item?.title || "" })}
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
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
        <TabsList>
          <TabsTrigger value="form">{t("detail.tabs.form")}</TabsTrigger>
          <TabsTrigger value="specs" disabled={isNew}>
            <ListChecks className="mr-2 h-4 w-4" />
            {t("detail.tabs.specs")}
          </TabsTrigger>
          <TabsTrigger value="faqs" disabled={isNew}>
            <HelpCircle className="mr-2 h-4 w-4" />
            {t("detail.tabs.faqs")}
          </TabsTrigger>
          <TabsTrigger value="reviews" disabled={isNew}>
            <Star className="mr-2 h-4 w-4" />
            {t("detail.tabs.reviews")}
          </TabsTrigger>
          <TabsTrigger value="json">
            <FileJson className="mr-2 h-4 w-4" />
            {t("detail.tabs.json")}
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
                    {/* Başlık */}
                    <div className="space-y-2">
                      <Label htmlFor="title">{t("detail.fields.title")}</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleChange("title", e.target.value)}
                        disabled={isLoading}
                        placeholder={t("detail.placeholders.title")}
                      />
                    </div>

                    {/* Slug */}
                    <div className="space-y-2">
                      <Label htmlFor="slug">{t("detail.fields.slug")}</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => handleChange("slug", e.target.value)}
                        disabled={isLoading}
                        placeholder={t("detail.placeholders.slug")}
                      />
                    </div>

                    {/* Fiyat + Stok + Kod */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">{t("detail.fields.price")}</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          value={formData.price}
                          onChange={(e) => handleChange("price", e.target.value)}
                          disabled={isLoading}
                          placeholder="0.00"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="stock_quantity">{t("detail.fields.stock")}</Label>
                        <Input
                          id="stock_quantity"
                          type="number"
                          value={formData.stock_quantity}
                          onChange={(e) => handleChange("stock_quantity", e.target.value)}
                          disabled={isLoading}
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="product_code">{t("detail.fields.productCode")}</Label>
                        <Input
                          id="product_code"
                          value={formData.product_code}
                          onChange={(e) => handleChange("product_code", e.target.value)}
                          disabled={isLoading}
                          placeholder="SKU-001"
                        />
                      </div>
                    </div>

                    {/* Açıklama */}
                    <div className="space-y-2">
                      <Label>{t("detail.fields.description")}</Label>
                      <RichContentEditor
                        value={formData.description}
                        onChange={(v) => handleChange("description", v)}
                        disabled={isLoading}
                      />
                    </div>

                    {/* Alt + Etiketler */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="image_alt">{t("detail.fields.imageAlt")}</Label>
                        <Input
                          id="image_alt"
                          value={formData.image_alt}
                          onChange={(e) => handleChange("image_alt", e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tags">{t("detail.fields.tags")}</Label>
                        <Input
                          id="tags"
                          value={formData.tags}
                          onChange={(e) => handleChange("tags", e.target.value)}
                          disabled={isLoading}
                          placeholder={t("detail.placeholders.tags")}
                        />
                      </div>
                    </div>

                    {/* SEO */}
                    <div className="space-y-4 rounded-md border p-4">
                      <p className="font-medium text-muted-foreground text-sm">{t("detail.fields.seo")}</p>
                      <div className="space-y-2">
                        <Label htmlFor="meta_title">{t("detail.fields.metaTitle")}</Label>
                        <Input
                          id="meta_title"
                          value={formData.meta_title}
                          onChange={(e) => handleChange("meta_title", e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="meta_description">{t("detail.fields.metaDescription")}</Label>
                        <Textarea
                          id="meta_description"
                          value={formData.meta_description}
                          onChange={(e) => handleChange("meta_description", e.target.value)}
                          disabled={isLoading}
                          rows={2}
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
                          {t("detail.fields.active")}
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          id="is_featured"
                          checked={formData.is_featured}
                          onCheckedChange={(v) => handleChange("is_featured", v)}
                          disabled={isLoading}
                        />
                        <Label htmlFor="is_featured" className="cursor-pointer">
                          {t("detail.fields.featured")}
                        </Label>
                      </div>
                    </div>
                  </div>

                  {/* Sağ: kategori + görsel sidebar */}
                  <div className="space-y-6">
                    {/* Kategori */}
                    <div className="space-y-2">
                      <Label>{t("detail.fields.category")}</Label>
                      <Select
                        value={formData.category_id || "none"}
                        onValueChange={(v) => {
                          handleChange("category_id", v === "none" ? "" : v);
                          handleChange("sub_category_id", "");
                        }}
                        disabled={isLoading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t("detail.placeholders.category")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">{t("detail.placeholders.category")}</SelectItem>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={String(cat.id)}>
                              {cat.name || cat.slug}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Alt Kategori */}
                    {formData.category_id && (
                      <div className="space-y-2">
                        <Label>{t("detail.fields.subcategory")}</Label>
                        <Select
                          value={formData.sub_category_id || "none"}
                          onValueChange={(v) => handleChange("sub_category_id", v === "none" ? "" : v)}
                          disabled={isLoading || subcategories.length === 0}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={t("detail.placeholders.subcategory")} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">{t("detail.placeholders.subcategory")}</SelectItem>
                            {subcategories.map((sub) => (
                              <SelectItem key={sub.id} value={String(sub.id)}>
                                {sub.name || sub.slug}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* Görsel */}
                    <AdminImageUploadField
                      label={t("detail.fields.coverImage")}
                      value={formData.image_url}
                      onChange={handleImageChange}
                      disabled={isLoading}
                    />
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

        {/* ── Specs Tab ────────────────────────────────────────── */}
        <TabsContent value="specs">
          {productId ? (
            <ProductSpecsTab productId={productId} locale={activeLocale} disabled={isLoading} />
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground text-sm">
                {t("detail.emptyStates.specs")}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ── FAQs Tab ─────────────────────────────────────────── */}
        <TabsContent value="faqs">
          {productId ? (
            <ProductFaqsTab productId={productId} locale={activeLocale} disabled={isLoading} />
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground text-sm">
                {t("detail.emptyStates.faqs")}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ── Reviews Tab ──────────────────────────────────────── */}
        <TabsContent value="reviews">
          {productId ? (
            <ProductReviewsTab productId={productId} disabled={isLoading} />
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground text-sm">
                {t("detail.emptyStates.reviews")}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ── JSON Tab ─────────────────────────────────────────── */}
        <TabsContent value="json">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("detail.json.title")}</CardTitle>
              <CardDescription>{t("detail.json.description")}</CardDescription>
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
                    label={t("detail.fields.coverImage")}
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
