"use client";

// =============================================================
// FILE: src/app/(main)/admin/(admin)/offer/_components/admin-offer-client.tsx
// Admin Offers — List (responsive)
// =============================================================

import * as React from "react";

import Link from "next/link";

import { Download, Pencil, Plus, RefreshCcw, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useAdminT } from "@/app/(main)/admin/_components/common/useAdminT";
import { Badge } from "@ensotek/shared-ui/admin/ui/badge";
import { Button } from "@ensotek/shared-ui/admin/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ensotek/shared-ui/admin/ui/card";
import { Input } from "@ensotek/shared-ui/admin/ui/input";
import { Label } from "@ensotek/shared-ui/admin/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ensotek/shared-ui/admin/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@ensotek/shared-ui/admin/ui/table";
import { useDeleteOfferAdminMutation, useListOffersAdminQuery } from "@/integrations/hooks";
import type { OfferStatus, OfferView } from "@/integrations/shared";

/* ------------------------------------------------------------------ */

type Filters = {
  q: string;
  source: string;
  sector: string;
  status: "all" | OfferStatus;
  orderDir: "asc" | "desc";
  createdFrom: string;
  createdTo: string;
};

function getObj(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null ? (value as Record<string, unknown>) : null;
}

function getErrMsg(err: unknown, fallback: string): string {
  const errObj = getObj(err);
  const data = getObj(errObj?.data);
  const nestedError = getObj(data?.error);
  const message = nestedError?.message ?? data?.message ?? errObj?.message;
  return typeof message === "string" && message.trim() ? message : fallback;
}

function label(t: (key: string) => string, key: string, fallback: string): string {
  const translated = t(key);
  return translated && translated !== key ? translated : fallback;
}

function statusLabel(t: (key: string) => string, status: OfferStatus): string {
  const translated = t(`status.${status}`);
  return translated.trim() ? translated : status;
}

function statusVariant(s: string): "default" | "secondary" | "destructive" | "outline" {
  if (s === "sent" || s === "accepted") return "default";
  if (s === "rejected" || s === "cancelled") return "destructive";
  if (s === "quoted" || s === "in_review") return "outline";
  return "secondary";
}

function fmtDate(v: unknown): string {
  if (!v) return "-";
  const s = typeof v === "string" ? v : String(v);
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return s || "-";
  return d.toLocaleDateString("tr-TR");
}

function fmtMoney(amount: unknown, currency: unknown): string {
  const a = amount === null || amount === undefined ? "" : String(amount);
  if (!a) return "-";
  const c = currency ? String(currency) : "EUR";
  try {
    return new Intl.NumberFormat("de-DE", { style: "currency", currency: c }).format(Number(a));
  } catch {
    return `${a} ${c}`;
  }
}

function formValue(item: OfferView, keys: string[]): string {
  const data = item.form_data ?? {};
  for (const key of keys) {
    const value = data[key];
    if (value !== null && value !== undefined && String(value).trim()) return String(value).trim();
  }
  return "";
}

function sectorOf(item: OfferView): string {
  return formValue(item, ["sector", "industry", "sektor", "sektör", "product_category", "category"]);
}

function csvCell(value: unknown): string {
  const raw = value === null || value === undefined ? "" : String(value);
  return `"${raw.replace(/"/g, '""')}"`;
}

function downloadCsv(rows: OfferView[]) {
  const header = [
    "offer_no",
    "status",
    "source",
    "sector",
    "customer_name",
    "company_name",
    "email",
    "phone",
    "subject",
    "country_code",
    "gross_total",
    "currency",
    "created_at",
  ];
  const lines = rows.map((item) =>
    [
      item.offer_no,
      item.status,
      item.source,
      sectorOf(item),
      item.customer_name,
      item.company_name,
      item.email,
      item.phone,
      item.subject,
      item.country_code,
      item.gross_total,
      item.currency,
      item.created_at,
    ]
      .map(csvCell)
      .join(","),
  );
  const blob = new Blob([[header.join(","), ...lines].join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `offers-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ------------------------------------------------------------------ */

export default function AdminOfferClient({ initialSource }: { initialSource?: string }) {
  const t = useAdminT("admin.offer");

  const [filters, setFilters] = React.useState<Filters>({
    q: "",
    source: initialSource ?? "",
    sector: "",
    status: "all",
    orderDir: "desc",
    createdFrom: "",
    createdTo: "",
  });

  const params = React.useMemo(
    () => ({
      q: filters.q.trim() || undefined,
      source: filters.source.trim() || undefined,
      status: filters.status === "all" ? undefined : (filters.status as OfferStatus),
      orderDir: filters.orderDir,
      sort: "created_at" as const,
      limit: 200,
      offset: 0,
      created_from: filters.createdFrom || undefined,
      created_to: filters.createdTo || undefined,
    }),
    [filters],
  );

  const listQ = useListOffersAdminQuery(params, { refetchOnMountOrArgChange: true });
  const [deleteOffer, deleteState] = useDeleteOfferAdminMutation();

  const allRows = (listQ.data ?? []) as OfferView[];
  const rows = React.useMemo(() => {
    const sector = filters.sector.trim().toLowerCase();
    if (!sector) return allRows;
    return allRows.filter((item) => sectorOf(item).toLowerCase().includes(sector));
  }, [allRows, filters.sector]);
  const listBusy = listQ.isLoading || listQ.isFetching;
  const busy = listBusy || deleteState.isLoading;

  async function onDelete(item: OfferView) {
    const msg = t("confirmDelete", {
      name: item.customer_name,
      email: item.email,
      id: item.id,
    });
    if (!window.confirm(msg)) return;

    try {
      await deleteOffer({ id: item.id }).unwrap();
      toast.success(t("messages.deleted"));
      listQ.refetch();
    } catch (err: any) {
      toast.error(getErrMsg(err, t("messages.deleteError")));
    }
  }

  return (
    <div className="w-full min-w-0 max-w-full space-y-6 carbon-mesh min-h-screen pb-12">
      {/* HEADER */}
      <Card className="premium-card overflow-hidden border-none">
        <div className="gold-gradient h-1.5 w-full" />
        <CardHeader className="py-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 space-y-1">
              <CardTitle className="text-xl font-bold tracking-tight">{t("header.title")}</CardTitle>
              <CardDescription className="text-muted-foreground/80">{t("header.subtitle")}</CardDescription>
            </div>
    
            <div className="flex flex-shrink-0 gap-3">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => listQ.refetch()} 
                disabled={busy}
                className="rounded-full hover:bg-primary/10 transition-colors"
              >
                <RefreshCcw className={`h-4 w-4 ${busy ? "animate-spin" : ""}`} />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => downloadCsv(rows)} 
                disabled={busy || rows.length === 0}
                className="rounded-full px-4 border-white/10"
              >
                <Download className="mr-2 size-4" />
                <span>{label(t, "actions.exportCsv", "CSV")}</span>
              </Button>
              <Button 
                size="sm" 
                asChild
                className="gold-gradient rounded-full px-6 font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Link href="/admin/offer/new">
                  <Plus className="mr-2 size-4" />
                  {t("actions.create")}
                </Link>
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* ERROR */}
      {listQ.error ? (
        <div className="rounded-lg border bg-card p-3 text-destructive text-sm">{t("messages.loadError")}</div>
      ) : null}

      {/* FILTERS */}
      <Card className="premium-card bg-card/20 border-white/5">
        <CardHeader className="gap-2">
          <CardTitle className="text-base font-bold uppercase tracking-widest text-primary/80">{t("filters.title")}</CardTitle>
          <CardDescription className="text-muted-foreground/70">{t("filters.description")}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
          <div className="space-y-2">
            <Label>{t("filters.searchLabel")}</Label>
            <div className="relative">
              <Search className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-3 size-4 text-muted-foreground" />
              <Input
                value={filters.q}
                onChange={(e) => setFilters((p) => ({ ...p, q: e.target.value }))}
                placeholder={t("filters.searchPlaceholder")}
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>{label(t, "filters.sourceLabel", "Kaynak")}</Label>
            <Input
              value={filters.source}
              onChange={(e) => setFilters((p) => ({ ...p, source: e.target.value }))}
              placeholder={label(t, "filters.sourcePlaceholder", "ensotek, kompozit")}
            />
          </div>

          <div className="space-y-2">
            <Label>{label(t, "filters.sectorLabel", "Sektor")}</Label>
            <Input
              value={filters.sector}
              onChange={(e) => setFilters((p) => ({ ...p, sector: e.target.value }))}
              placeholder={label(t, "filters.sectorPlaceholder", "Sektor / kategori")}
            />
          </div>

          <div className="space-y-2">
            <Label>{t("filters.statusLabel")}</Label>
            <Select
              value={filters.status}
              onValueChange={(v) => setFilters((p) => ({ ...p, status: v as Filters["status"] }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("filters.statusAll")}</SelectItem>
                <SelectItem value="new">{t("status.new")}</SelectItem>
                <SelectItem value="in_review">{t("status.in_review")}</SelectItem>
                <SelectItem value="quoted">{t("status.quoted")}</SelectItem>
                <SelectItem value="sent">{t("status.sent")}</SelectItem>
                <SelectItem value="accepted">{t("status.accepted")}</SelectItem>
                <SelectItem value="rejected">{t("status.rejected")}</SelectItem>
                <SelectItem value="cancelled">{t("status.cancelled")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t("filters.orderLabel")}</Label>
            <Select
              value={filters.orderDir}
              onValueChange={(v) => setFilters((p) => ({ ...p, orderDir: v as Filters["orderDir"] }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">{t("filters.orderDesc")}</SelectItem>
                <SelectItem value="asc">{t("filters.orderAsc")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{label(t, "filters.createdFromLabel", "Baslangic")}</Label>
            <Input
              type="date"
              value={filters.createdFrom}
              onChange={(e) => setFilters((p) => ({ ...p, createdFrom: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label>{label(t, "filters.createdToLabel", "Bitis")}</Label>
            <Input
              type="date"
              value={filters.createdTo}
              onChange={(e) => setFilters((p) => ({ ...p, createdTo: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* LIST */}
      <Card className="premium-card overflow-hidden">
        <CardHeader className="gap-2">
          <CardTitle className="text-base font-bold">
            {t("list.title")} <span className="font-normal text-muted-foreground">({rows.length})</span>
          </CardTitle>
          <CardDescription className="text-muted-foreground/80">{t("list.description")}</CardDescription>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          {/* ── Mobile card view ── */}
          <div className="flex flex-col gap-3 px-4 pb-4 sm:hidden">
            {rows.length === 0 && listBusy && (
              <p className="py-8 text-center text-muted-foreground text-sm">{t("list.loading")}</p>
            )}
            {rows.length === 0 && !listBusy && (
              <p className="py-8 text-center text-muted-foreground text-sm">{t("list.empty")}</p>
            )}

            {rows.map((item) => (
              <div key={item.id} className="space-y-3 rounded-lg border bg-card p-4">
                {/* row 1: offer no + status */}
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-sm">{item.offer_no || "-"}</span>
                  <Badge variant={statusVariant(item.status)}>{statusLabel(t, item.status)}</Badge>
                </div>

                {/* row 2: customer */}
                <div className="space-y-0.5">
                  <div className="font-medium text-sm">{item.customer_name}</div>
                  {item.company_name && <div className="text-muted-foreground text-xs">{item.company_name}</div>}
                  <div className="text-muted-foreground text-xs">{item.email}</div>
                </div>

                {/* row 3: subject + money + date */}
                {item.subject && <p className="truncate text-muted-foreground text-xs">{item.subject}</p>}
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{fmtMoney(item.gross_total, item.currency)}</span>
                  <span className="text-muted-foreground text-xs">{fmtDate(item.created_at)}</span>
                </div>

                {/* row 4: actions */}
                <div className="flex gap-2 pt-1">
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link href={`/admin/offer/${encodeURIComponent(item.id)}`}>
                      <Pencil className="mr-2 size-4" />
                      {t("actions.edit")}
                    </Link>
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => onDelete(item)} disabled={busy}>
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* ── Desktop table view ── */}
          <div className="hidden overflow-x-auto sm:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">{t("columns.offerNo")}</TableHead>
                  <TableHead>{t("columns.status")}</TableHead>
                  <TableHead>{t("columns.customer")}</TableHead>
                  <TableHead className="hidden md:table-cell">{t("filters.sectorLabel")}</TableHead>
                  <TableHead className="hidden xl:table-cell">{t("columns.source")}</TableHead>
                  <TableHead className="hidden lg:table-cell">{t("columns.email")}</TableHead>
                  <TableHead className="hidden xl:table-cell">{t("columns.subject")}</TableHead>
                  <TableHead className="hidden md:table-cell">Tip</TableHead>
                  <TableHead className="whitespace-nowrap text-right">{t("columns.grossTotal")}</TableHead>
                  <TableHead className="hidden whitespace-nowrap md:table-cell">{t("columns.createdAt")}</TableHead>
                  <TableHead className="text-right">{t("columns.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 && listBusy && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground text-sm">
                      {t("list.loading")}
                    </TableCell>
                  </TableRow>
                )}

                {rows.length === 0 && !listBusy && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground text-sm">
                      {t("list.empty")}
                    </TableCell>
                  </TableRow>
                )}

                {rows.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="whitespace-nowrap font-medium">{item.offer_no || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(item.status)}>{statusLabel(t, item.status)}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{item.customer_name || "-"}</div>
                      {item.company_name ? (
                        <div className="text-muted-foreground text-xs">{item.company_name}</div>
                      ) : null}
                      {/* email visible here on smaller screens where column is hidden */}
                      <div className="text-muted-foreground text-xs lg:hidden">{item.email}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="text-xs">{sectorOf(item) || "-"}</div>
                    </TableCell>
                    <TableCell className="hidden xl:table-cell">
                      <Badge variant="outline" className="text-[10px] font-mono opacity-70">
                        {item.source || "web"}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">{item.email || "-"}</TableCell>
                    <TableCell className="hidden xl:table-cell">
                      <div className="max-w-[200px] truncate text-muted-foreground text-xs" title={item.subject || ""}>
                        {item.subject || "-"}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline" className="capitalize">
                        {String((item.form_data as any)?.related_type || "-")}
                      </Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-right font-medium">
                      {fmtMoney(item.gross_total, item.currency)}
                    </TableCell>
                    <TableCell className="hidden whitespace-nowrap text-sm md:table-cell">
                      {fmtDate(item.created_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="outline" size="icon" className="size-8" asChild>
                          <Link href={`/admin/offer/${encodeURIComponent(item.id)}`} title={t("actions.edit")}>
                            <Pencil className="size-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="size-8"
                          onClick={() => onDelete(item)}
                          disabled={busy}
                          title={t("actions.delete")}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
