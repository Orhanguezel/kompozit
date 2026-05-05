// =============================================================
// FILE: src/app/(main)/admin/(admin)/custompage/_components/CustomPageSidebarColumn.tsx
// FINAL — Sidebar: tags, content-image insertion, SEO
// - ✅ Uses AdminImageUploadField (new path)
// - ✅ No category/subcategory
// =============================================================

"use client";

import type React from "react";

import { AdminImageUploadField } from "@/app/(main)/admin/_components/common/AdminImageUploadField";
import { useAdminT } from "@/app/(main)/admin/_components/common/useAdminT";
import { Button } from "@ensotek/shared-ui/admin/ui/button";
import { Input } from "@ensotek/shared-ui/admin/ui/input";
import { Label } from "@ensotek/shared-ui/admin/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ensotek/shared-ui/admin/ui/select";
import { Textarea } from "@ensotek/shared-ui/admin/ui/textarea";

import type { ContentImageSize, CustomPageFormValues } from "./custom-page-form";

type Props = {
  values: CustomPageFormValues;
  disabled: boolean;

  /** Varsayılan: hepsi görünür (tek sütun düzeni). Sekmeli formda bölümler ayrılır. */
  showTags?: boolean;
  showContentImages?: boolean;
  showSeo?: boolean;

  imageMetadata: Record<string, string | number | boolean>;

  contentImageSize: ContentImageSize;
  setContentImageSize: (s: ContentImageSize) => void;
  contentImagePreview: string;
  handleAddContentImage: (url: string, alt?: string) => void;

  manualImageUrl: string;
  manualImageAlt: string;
  setManualImageUrl: (v: string) => void;
  setManualImageAlt: (v: string) => void;
  handleAddManualImage: () => void;

  setValues: React.Dispatch<React.SetStateAction<CustomPageFormValues>>;
};

export const CustomPageSidebarColumn: React.FC<Props> = ({
  values,
  disabled,
  showTags = true,
  showContentImages = true,
  showSeo = true,
  imageMetadata,
  contentImageSize,
  setContentImageSize,
  contentImagePreview,
  handleAddContentImage,
  manualImageUrl,
  manualImageAlt,
  setManualImageUrl,
  setManualImageAlt,
  handleAddManualImage,
  setValues,
}) => {
  const t = useAdminT();
  const tagsInputId = "custom-page-tags";
  const imageSizeInputId = "custom-page-image-size";
  const manualUrlInputId = "custom-page-manual-url";
  const metaTitleInputId = "custom-page-meta-title";
  const metaDescriptionInputId = "custom-page-meta-description";

  return (
    <div className="space-y-6 premium-card bg-card/20 border-white/5 p-6">
      {showTags ? (
        <div className="space-y-1.5">
          <Label htmlFor={tagsInputId}>{t("admin.customPage.form.tags")}</Label>
          <Input
            id={tagsInputId}
            placeholder={t("admin.customPage.form.tagsPlaceholder")}
            value={values.tags}
            onChange={(e) => setValues((prev) => ({ ...prev, tags: e.target.value }))}
            disabled={disabled}
            className="bg-background/50"
          />
        </div>
      ) : null}

      {showContentImages ? (
        <>
          <div className="space-y-1.5">
            <Label htmlFor={imageSizeInputId}>{t("admin.customPage.form.imageSize")}</Label>
            <Select 
              value={contentImageSize} 
              onValueChange={(v) => setContentImageSize(v as ContentImageSize)}
              disabled={disabled}
            >
              <SelectTrigger id={imageSizeInputId} className="bg-background/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sm">{t("admin.customPage.form.imageSizeSm")}</SelectItem>
                <SelectItem value="md">{t("admin.customPage.form.imageSizeMd")}</SelectItem>
                <SelectItem value="lg">{t("admin.customPage.form.imageSizeLg")}</SelectItem>
                <SelectItem value="full">{t("admin.customPage.form.imageSizeFull")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <AdminImageUploadField
            label={`${t("admin.customPage.form.content")} ${t("admin.common.upload")}`}
            helperText={t("admin.customPage.form.uploadHelperText")}
            bucket="public"
            folder="custom_pages/content"
            metadata={{ ...(imageMetadata || {}), section: "content" }}
            multiple
            value={contentImagePreview}
            onChange={(url) => handleAddContentImage(url)}
            disabled={disabled}
            openLibraryHref="/admin/storage"
          />

          <div className="space-y-3 rounded-lg border border-dashed border-white/10 p-4 bg-white/5">
            <div className="space-y-1.5">
              <Label htmlFor={manualUrlInputId}>{t("admin.customPage.form.manualUrl")}</Label>
              <Input
                id={manualUrlInputId}
                type="url"
                placeholder="https://..."
                value={manualImageUrl}
                onChange={(e) => setManualImageUrl(e.target.value)}
                disabled={disabled}
                className="bg-background/50"
              />
            </div>
            <Input
              type="text"
              placeholder={t("admin.customPage.form.altTextPlaceholder")}
              value={manualImageAlt}
              onChange={(e) => setManualImageAlt(e.target.value)}
              disabled={disabled}
              className="bg-background/50"
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={handleAddManualImage}
              disabled={disabled}
            >
              {t("admin.customPage.form.addManualUrl")}
            </Button>
          </div>
        </>
      ) : null}

      {showSeo ? (
        <>
          <div className="space-y-1.5">
            <Label htmlFor={metaTitleInputId}>{t("admin.customPage.form.metaTitle")}</Label>
            <Input
              id={metaTitleInputId}
              value={values.meta_title}
              onChange={(e) => setValues((prev) => ({ ...prev, meta_title: e.target.value }))}
              disabled={disabled}
              className="bg-background/50"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={metaDescriptionInputId}>{t("admin.customPage.form.metaDescription")}</Label>
            <Textarea
              id={metaDescriptionInputId}
              rows={4}
              value={values.meta_description}
              onChange={(e) => setValues((prev) => ({ ...prev, meta_description: e.target.value }))}
              disabled={disabled}
              className="bg-background/50"
            />
          </div>
        </>
      ) : null}
    </div>
  );
};
