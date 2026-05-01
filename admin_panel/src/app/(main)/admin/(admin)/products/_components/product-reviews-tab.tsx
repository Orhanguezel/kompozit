// =============================================================
// FILE: src/app/(main)/admin/(admin)/products/_components/product-reviews-tab.tsx
// Ürün Değerlendirmeleri Tab — Shadcn/UI + RTK Query
// Ensotek Admin Panel Standartı
// =============================================================

"use client";

import * as React from "react";

import { Plus, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@ensotek/shared-ui/admin/ui/badge";
import { Button } from "@ensotek/shared-ui/admin/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@ensotek/shared-ui/admin/ui/card";
import { Input } from "@ensotek/shared-ui/admin/ui/input";
import { Label } from "@ensotek/shared-ui/admin/ui/label";
import { Switch } from "@ensotek/shared-ui/admin/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@ensotek/shared-ui/admin/ui/table";
import { Textarea } from "@ensotek/shared-ui/admin/ui/textarea";
import {
  useCreateProductReviewAdminMutation,
  useDeleteProductReviewAdminMutation,
  useListProductReviewsAdminQuery,
  useToggleProductReviewActiveAdminMutation,
} from "@/integrations/endpoints/admin/products_admin.reviews.endpoints";
import { useAdminTranslations } from "@/i18n";
import { useLocaleShort } from "@/i18n/useLocaleShort";
import type {
  AdminProductReviewCreatePayload,
  AdminProductReviewDto,
} from "@/integrations/shared/product_reviews_admin.types";

export type ProductReviewsTabProps = {
  productId: string;
  disabled?: boolean;
};

function getObj(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null ? (value as Record<string, unknown>) : null;
}

function getErrMessage(err: unknown, fallback: string): string {
  const errObj = getObj(err);
  const data = getObj(errObj?.data);
  const nestedError = getObj(data?.error);
  const message = nestedError?.message ?? data?.message ?? errObj?.message;
  return typeof message === "string" && message.trim() ? message : fallback;
}

const EMPTY_REVIEW: AdminProductReviewCreatePayload = {
  rating: 5,
  comment: "",
  customer_name: "",
  is_active: true,
  review_date: "",
};

export function ProductReviewsTab({ productId, disabled }: ProductReviewsTabProps) {
  const adminLocale = useLocaleShort();
  const t = useAdminTranslations(adminLocale);
  const [newReview, setNewReview] = React.useState<AdminProductReviewCreatePayload>({ ...EMPTY_REVIEW });
  const [showForm, setShowForm] = React.useState(false);

  const { data, isLoading, isFetching, refetch } = useListProductReviewsAdminQuery(
    { productId, order: "desc" },
    { skip: !productId },
  );

  const [createReview, { isLoading: isCreating }] = useCreateProductReviewAdminMutation();
  const [toggleActive, { isLoading: isToggling }] = useToggleProductReviewActiveAdminMutation();
  const [deleteReview, { isLoading: isDeleting }] = useDeleteProductReviewAdminMutation();

  const reviews = data ?? [];
  const busy = isLoading || isFetching || isToggling || isDeleting || !!disabled;

  const handleCreate = async () => {
    if (!newReview.rating || newReview.rating < 0 || newReview.rating > 5) {
      toast.error(t("admin.products.reviewsTab.ratingError"));
      return;
    }
    try {
      await createReview({
        productId,
        payload: { ...newReview, rating: Number(newReview.rating) },
      }).unwrap();
      toast.success(t("admin.products.reviewsTab.createSuccess"));
      setNewReview({ ...EMPTY_REVIEW });
      setShowForm(false);
      void refetch();
    } catch (err: unknown) {
      toast.error(getErrMessage(err, t("admin.products.reviewsTab.defaultError")));
    }
  };

  const handleToggle = async (review: AdminProductReviewDto) => {
    try {
      await toggleActive({ productId, reviewId: review.id, is_active: !review.is_active }).unwrap();
      toast.success(t("admin.products.reviewsTab.toggleSuccess"));
      void refetch();
    } catch (err: unknown) {
      toast.error(getErrMessage(err, t("admin.products.reviewsTab.defaultError")));
    }
  };

  const handleDelete = async (review: AdminProductReviewDto) => {
    if (!confirm(t("admin.products.reviewsTab.deleteConfirm"))) return;
    try {
      await deleteReview({ productId, reviewId: review.id }).unwrap();
      toast.success(t("admin.products.reviewsTab.deleteSuccess"));
      void refetch();
    } catch (err: unknown) {
      toast.error(getErrMessage(err, t("admin.products.reviewsTab.defaultError")));
    }
  };

  return (
    <div className="space-y-4">
      {/* Yeni yorum ekle */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">{t("admin.products.reviewsTab.title", { count: reviews.length })}</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => refetch()} disabled={busy}>
                <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
              </Button>
              <Button
                variant={showForm ? "secondary" : "outline"}
                size="sm"
                onClick={() => setShowForm((v) => !v)}
                disabled={busy}
              >
                <Plus className="mr-2 h-4 w-4" />
                {showForm ? t("admin.products.reviewsTab.cancel") : t("admin.products.reviewsTab.addReview")}
              </Button>
            </div>
          </div>
        </CardHeader>

        {showForm && (
          <CardContent className="border-t pt-4">
            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="review_rating">{t("admin.products.reviewsTab.fields.rating")}</Label>
                <Input
                  id="review_rating"
                  type="number"
                  min={0}
                  max={5}
                  step={0.5}
                  value={newReview.rating}
                  onChange={(e) => setNewReview((p) => ({ ...p, rating: Number(e.target.value) }))}
                  disabled={isCreating || !!disabled}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="review_customer">{t("admin.products.reviewsTab.fields.customer")}</Label>
                <Input
                  id="review_customer"
                  value={newReview.customer_name ?? ""}
                  onChange={(e) => setNewReview((p) => ({ ...p, customer_name: e.target.value }))}
                  disabled={isCreating || !!disabled}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="review_date">{t("admin.products.reviewsTab.fields.date")}</Label>
                <Input
                  id="review_date"
                  type="date"
                  value={newReview.review_date ?? ""}
                  onChange={(e) => setNewReview((p) => ({ ...p, review_date: e.target.value }))}
                  disabled={isCreating || !!disabled}
                />
              </div>
              <div className="flex items-end gap-3 pb-1">
                <div className="flex items-center gap-2">
                  <Switch
                    id="review_active"
                    checked={!!newReview.is_active}
                    onCheckedChange={(v) => setNewReview((p) => ({ ...p, is_active: v }))}
                    disabled={isCreating || !!disabled}
                  />
                  <Label htmlFor="review_active" className="cursor-pointer">
                    {t("admin.products.reviewsTab.fields.active")}
                  </Label>
                </div>
              </div>
            </div>
            <div className="mb-4 space-y-2">
              <Label htmlFor="review_comment">{t("admin.products.reviewsTab.fields.comment")}</Label>
              <Textarea
                id="review_comment"
                value={newReview.comment ?? ""}
                onChange={(e) => setNewReview((p) => ({ ...p, comment: e.target.value }))}
                disabled={isCreating || !!disabled}
                rows={2}
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleCreate} disabled={isCreating || !!disabled} size="sm">
                {isCreating ? t("admin.products.reviewsTab.creating") : t("admin.products.reviewsTab.addReview")}
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Mevcut yorumlar */}
      <Card>
        <CardContent className="p-0">
          {isFetching && reviews.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground text-sm">{t("admin.products.reviewsTab.loading")}</p>
          ) : reviews.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground text-sm">{t("admin.products.reviewsTab.empty")}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-17.5 text-center">{t("admin.products.reviewsTab.columns.rating")}</TableHead>
                  <TableHead className="w-40">{t("admin.products.reviewsTab.columns.customer")}</TableHead>
                  <TableHead>{t("admin.products.reviewsTab.columns.comment")}</TableHead>
                  <TableHead className="w-27.5">{t("admin.products.reviewsTab.columns.date")}</TableHead>
                  <TableHead className="w-20 text-center">{t("admin.products.reviewsTab.columns.status")}</TableHead>
                  <TableHead className="w-30 text-right">{t("admin.products.reviewsTab.columns.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="font-mono">
                        {typeof r.rating?.toFixed === "function" ? r.rating.toFixed(1) : r.rating}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-sm">{r.customer_name || "—"}</div>
                      {r.user_id && <div className="text-muted-foreground text-xs">{r.user_id}</div>}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-70 truncate text-sm" title={r.comment || ""}>
                        {r.comment || <span className="text-muted-foreground italic">—</span>}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {r.review_date ? r.review_date.substring(0, 10) : "—"}
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch checked={!!r.is_active} onCheckedChange={() => handleToggle(r)} disabled={busy} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(r)} disabled={busy}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
