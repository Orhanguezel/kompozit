// =============================================================
// FILE: src/app/(main)/admin/(admin)/products/_components/product-faqs-tab.tsx
// Ürün SSS (FAQ) Tab — Shadcn/UI + RTK Query
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
import { Switch } from "@ensotek/shared-ui/admin/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@ensotek/shared-ui/admin/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ensotek/shared-ui/admin/ui/tabs";
import { Textarea } from "@ensotek/shared-ui/admin/ui/textarea";
import {
  useListProductFaqsAdminQuery,
  useReplaceProductFaqsAdminMutation,
} from "@/integrations/endpoints/admin/products_admin.faqs.endpoints";
import type { AdminProductFaqCreatePayload, AdminProductFaqDto } from "@/integrations/shared/product_faqs_admin.types";

export type ProductFaqsTabProps = {
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

export function ProductFaqsTab({ productId, locale, disabled }: ProductFaqsTabProps) {
  const adminLocale = useLocaleShort();
  const t = useAdminTranslations(adminLocale);
  const [items, setItems] = React.useState<AdminProductFaqCreatePayload[]>([]);
  const [viewMode, setViewMode] = React.useState<"form" | "json">("form");

  const { data, isLoading, isFetching, refetch } = useListProductFaqsAdminQuery(
    { productId, locale },
    { skip: !productId || !locale },
  );

  const [replaceFaqs, { isLoading: isSaving }] = useReplaceProductFaqsAdminMutation();

  React.useEffect(() => {
    if (!data) return;
    setItems(
      data.map((f: AdminProductFaqDto) => ({
        id: f.id,
        question: f.question,
        answer: f.answer,
        display_order: f.display_order,
        is_active: Boolean(f.is_active),
      })),
    );
  }, [data]);

  const busy = isLoading || isFetching || isSaving || !!disabled;

  const handleSave = async () => {
    if (!locale) {
      toast.error(t("admin.products.faqTab.selectLocaleError"));
      return;
    }
    try {
      const normalized = (items ?? []).map((raw) => ({
        id: raw.id,
        question: String(raw.question ?? "").trim(),
        answer: String(raw.answer ?? ""),
        display_order:
          typeof raw.display_order === "number"
            ? raw.display_order
            : parseInt(String(raw.display_order ?? "0"), 10) || 0,
        is_active: raw.is_active !== false,
      }));
      await replaceFaqs({ productId, locale, payload: { items: normalized } }).unwrap();
      toast.success(t("admin.products.faqTab.saveSuccess"));
      void refetch();
    } catch (err: unknown) {
      toast.error(getErrMessage(err, t("admin.products.faqTab.defaultError")));
    }
  };

  const handleChange = (index: number, field: keyof AdminProductFaqCreatePayload, value: unknown) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const handleAddRow = () => {
    setItems((prev) => [...prev, { question: "", answer: "", display_order: prev.length, is_active: true }]);
  };

  const handleRemoveRow = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleJsonChange = (next: unknown) => {
    if (!Array.isArray(next)) {
      toast.error(t("admin.products.faqTab.invalidArray"));
      return;
    }
    setItems(next as AdminProductFaqCreatePayload[]);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">{t("admin.products.faqTab.title")}</CardTitle>
            <CardDescription>
              {t("admin.products.faqTab.activeLocale")} <code className="text-xs">{locale}</code>
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => refetch()} disabled={busy}>
              <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            </Button>
            <Button onClick={handleSave} disabled={busy} size="sm">
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
                {t("admin.products.faqTab.addQuestion")}
              </Button>
            )}
          </div>

          <TabsContent value="form" className="mt-4">
            {items.length === 0 ? (
              <p className="py-4 text-center text-muted-foreground text-sm">
                {t("admin.products.faqTab.empty")}
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[30%]">{t("admin.products.faqTab.columns.question")}</TableHead>
                    <TableHead>{t("admin.products.faqTab.columns.answer")}</TableHead>
                    <TableHead className="w-17.5 text-center">{t("admin.products.faqTab.columns.order")}</TableHead>
                    <TableHead className="w-17.5 text-center">{t("admin.products.faqTab.columns.active")}</TableHead>
                    <TableHead className="w-15" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((faq, index) => (
                    <TableRow key={faq.id ?? index}>
                      <TableCell className="align-top">
                        <Input
                          value={faq.question ?? ""}
                          onChange={(e) => handleChange(index, "question", e.target.value)}
                          disabled={busy}
                          placeholder={t("admin.products.faqTab.placeholders.question")}
                          className="h-8 text-sm"
                        />
                      </TableCell>
                      <TableCell className="align-top">
                        <Textarea
                          value={faq.answer ?? ""}
                          onChange={(e) => handleChange(index, "answer", e.target.value)}
                          disabled={busy}
                          placeholder={t("admin.products.faqTab.placeholders.answer")}
                          rows={2}
                          className="text-sm"
                        />
                      </TableCell>
                      <TableCell className="text-center align-top">
                        <Input
                          type="number"
                          value={faq.display_order ?? 0}
                          onChange={(e) => handleChange(index, "display_order", parseInt(e.target.value, 10) || 0)}
                          disabled={busy}
                          className="h-8 w-16 text-center text-sm"
                        />
                      </TableCell>
                      <TableCell className="text-center align-middle">
                        <Switch
                          checked={!!faq.is_active}
                          onCheckedChange={(v) => handleChange(index, "is_active", v)}
                          disabled={busy}
                        />
                      </TableCell>
                      <TableCell className="align-top">
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
