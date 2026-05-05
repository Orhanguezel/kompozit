// =============================================================
// FILE: src/app/(main)/admin/(admin)/products/_components/product-specs-tab.tsx
// Ürün Teknik Özellikler Tab — Shadcn/UI + RTK Query
// Ensotek Admin Panel Standartı
// =============================================================

"use client";

import * as React from "react";

import { FileJson, Plus, RefreshCw, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { AdminJsonEditor } from "@/app/(main)/admin/_components/common/AdminJsonEditor";
import { useAdminTranslations } from "@/i18n";
import { useLocaleShort } from "@/i18n/useLocaleShort";
import { Button } from "@ensotek/shared-ui/admin/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ensotek/shared-ui/admin/ui/card";
import { Input } from "@ensotek/shared-ui/admin/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@ensotek/shared-ui/admin/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ensotek/shared-ui/admin/ui/tabs";
import {
  useListProductSpecsAdminQuery,
  useReplaceProductSpecsAdminMutation,
} from "@/integrations/endpoints/admin/product_specs_admin.endpoints";
import type {
  AdminProductSpecCreatePayload,
  AdminProductSpecDto,
  ProductSpecCategory,
} from "@/integrations/shared/product_specs_admin.types";

export type ProductSpecsTabProps = {
  productId: string;
  locale: string;
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

export function ProductSpecsTab({ productId, locale, disabled }: ProductSpecsTabProps) {
  const adminLocale = useLocaleShort();
  const t = useAdminTranslations(adminLocale);
  const [items, setItems] = React.useState<AdminProductSpecCreatePayload[]>([]);
  const [viewMode, setViewMode] = React.useState<"form" | "json">("form");

  const { data, isLoading, isFetching, refetch } = useListProductSpecsAdminQuery(
    { productId, locale },
    { skip: !productId || !locale },
  );

  const [replaceSpecs, { isLoading: isSaving }] = useReplaceProductSpecsAdminMutation();

  React.useEffect(() => {
    if (!data) return;
    setItems(
      data.map((s: AdminProductSpecDto) => ({
        id: s.id,
        name: s.name,
        value: s.value,
        category: s.category,
        order_num: s.order_num,
      })),
    );
  }, [data]);

  const busy = isLoading || isFetching || isSaving || !!disabled;

  const handleSave = async () => {
    if (!locale) {
      toast.error(t("admin.products.specsTab.selectLocaleError"));
      return;
    }
    try {
      const normalized = (items ?? []).map((raw) => ({
        id: raw.id,
        name: String(raw.name ?? "").trim(),
        value: String(raw.value ?? "").trim(),
        category: (raw.category ?? "custom") as ProductSpecCategory,
        order_num: typeof raw.order_num === "number" ? raw.order_num : parseInt(String(raw.order_num ?? "0"), 10) || 0,
      }));
      await replaceSpecs({ productId, locale, payload: { items: normalized } }).unwrap();
      toast.success(t("admin.products.specsTab.saveSuccess"));
      void refetch();
    } catch (err: unknown) {
      toast.error(getErrMessage(err, t("admin.products.specsTab.defaultError")));
    }
  };

  const handleItemChange = (index: number, field: keyof AdminProductSpecCreatePayload, value: string) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: field === "order_num" ? parseInt(value, 10) || 0 : value } : item,
      ),
    );
  };

  const handleAddRow = () => {
    setItems((prev) => [...prev, { name: "", value: "", category: "custom", order_num: prev.length }]);
  };

  const handleRemoveRow = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleJsonChange = (next: unknown) => {
    if (!Array.isArray(next)) {
      toast.error(t("admin.products.specsTab.invalidArray"));
      return;
    }
    setItems(next as AdminProductSpecCreatePayload[]);
  };

  return (
    <Card className="premium-card">
      <CardHeader className="py-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold tracking-tight">{t("admin.products.specsTab.title")}</CardTitle>
            <CardDescription className="text-muted-foreground/80">
              {t("admin.products.specsTab.activeLocale")} <code className="text-xs">{locale}</code>
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => refetch()} 
              disabled={busy}
              className="rounded-full hover:bg-primary/10 transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={busy}
              className="gold-gradient rounded-full px-6 font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? t("admin.common.saving") : t("admin.common.save")}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "form" | "json")}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="form">Form</TabsTrigger>
              <TabsTrigger value="json">
                <FileJson className="mr-1 h-4 w-4" />
                JSON
              </TabsTrigger>
            </TabsList>
            {viewMode === "form" && (
              <Button variant="outline" size="sm" onClick={handleAddRow} disabled={busy}>
                <Plus className="mr-2 h-4 w-4" />
                {t("admin.products.specsTab.addRow")}
              </Button>
            )}
          </div>

          <TabsContent value="form" className="mt-4">
            {items.length === 0 ? (
              <p className="py-4 text-center text-muted-foreground text-sm">
                {t("admin.products.specsTab.empty")}
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("admin.products.specsTab.columns.name")}</TableHead>
                    <TableHead>{t("admin.products.specsTab.columns.value")}</TableHead>
                    <TableHead className="w-35">{t("admin.products.specsTab.columns.category")}</TableHead>
                    <TableHead className="w-20 text-center">{t("admin.products.specsTab.columns.order")}</TableHead>
                    <TableHead className="w-15" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((spec, index) => (
                    <TableRow key={spec.id ?? index}>
                      <TableCell>
                        <Input
                          value={spec.name ?? ""}
                          onChange={(e) => handleItemChange(index, "name", e.target.value)}
                          disabled={busy}
                          placeholder={t("admin.products.specsTab.placeholders.name")}
                          className="h-8 text-sm"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={spec.value ?? ""}
                          onChange={(e) => handleItemChange(index, "value", e.target.value)}
                          disabled={busy}
                          placeholder={t("admin.products.specsTab.placeholders.value")}
                          className="h-8 text-sm"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={spec.category ?? "custom"}
                          onChange={(e) => handleItemChange(index, "category", e.target.value)}
                          disabled={busy}
                          placeholder={t("admin.products.specsTab.placeholders.category")}
                          className="h-8 text-sm"
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Input
                          type="number"
                          value={spec.order_num ?? 0}
                          onChange={(e) => handleItemChange(index, "order_num", e.target.value)}
                          disabled={busy}
                          className="h-8 w-16 text-center text-sm"
                        />
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveRow(index)} disabled={busy}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>

          <TabsContent value="json" className="mt-4">
            <AdminJsonEditor value={items} onChange={handleJsonChange} disabled={busy} height={300} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
