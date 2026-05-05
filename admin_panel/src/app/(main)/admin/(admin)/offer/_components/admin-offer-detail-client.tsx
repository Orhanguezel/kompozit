"use client";

// =============================================================
// FILE: src/app/(main)/admin/(admin)/offer/_components/admin-offer-detail-client.tsx
// Admin Offer — Create / Edit with calculations, PDF, email
// =============================================================

import * as React from "react";

import { useRouter } from "next/navigation";

import { ArrowLeft, Code, ExternalLink, FileText, FormInput, Mail, Save } from "lucide-react";
import { toast } from "sonner";

import { AdminJsonEditor } from "@/app/(main)/admin/_components/common/AdminJsonEditor";
import { useAdminT } from "@/app/(main)/admin/_components/common/useAdminT";
import { Badge } from "@ensotek/shared-ui/admin/ui/badge";
import { Button } from "@ensotek/shared-ui/admin/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ensotek/shared-ui/admin/ui/card";
import { Input } from "@ensotek/shared-ui/admin/ui/input";
import { Label } from "@ensotek/shared-ui/admin/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ensotek/shared-ui/admin/ui/select";
import { Switch } from "@ensotek/shared-ui/admin/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ensotek/shared-ui/admin/ui/tabs";
import { Textarea } from "@ensotek/shared-ui/admin/ui/textarea";
import {
  useCreateOfferAdminMutation,
  useGenerateOfferPdfAdminMutation,
  useGetOfferAdminQuery,
  useSendOfferEmailAdminMutation,
  useUpdateOfferAdminMutation,
} from "@/integrations/hooks";
import type { OfferStatus, OfferView } from "@/integrations/shared";
import { isUuidLike } from "@/integrations/shared";

import { OfferPdfPreview } from "./offer-pdf-preview";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

type FormState = {
  id?: string;
  customer_name: string;
  company_name: string;
  email: string;
  phone: string;
  locale: string;
  country_code: string;
  subject: string;
  message: string;
  product_id: string;
  service_id: string;
  status: OfferStatus;
  currency: string;
  net_total: string;
  vat_rate: string;
  shipping_total: string;
  vat_total: string;
  gross_total: string;
  offer_no: string;
  valid_until: string;
  admin_notes: string;
  pdf_url: string;
  pdf_asset_id: string;
  email_sent_at: string;
  consent_marketing: boolean;
  consent_terms: boolean;
  form_data: Record<string, unknown>;
};

const EMPTY_FORM: FormState = {
  customer_name: "",
  company_name: "",
  email: "",
  phone: "",
  locale: "",
  country_code: "",
  subject: "",
  message: "",
  product_id: "",
  service_id: "",
  status: "new",
  currency: "EUR",
  net_total: "",
  vat_rate: "",
  shipping_total: "",
  vat_total: "",
  gross_total: "",
  offer_no: "",
  valid_until: "",
  admin_notes: "",
  pdf_url: "",
  pdf_asset_id: "",
  email_sent_at: "",
  consent_marketing: false,
  consent_terms: true,
  form_data: {},
};

function safeStr(v: unknown): string {
  if (v === null || v === undefined) return "";
  return String(v);
}

function safeBool(v: unknown): boolean {
  if (v === true || v === 1 || v === "1" || v === "true") return true;
  return false;
}

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

function safeJson(v: unknown): Record<string, unknown> {
  if (!v) return {};
  if (typeof v === "object") return v as Record<string, unknown>;
  if (typeof v === "string") {
    try {
      const p = JSON.parse(v);
      return p && typeof p === "object" ? (p as Record<string, unknown>) : {};
    } catch {
      return {};
    }
  }
  return {};
}

function parseDecimal(s: string): number | null {
  if (!s) return null;
  const n = Number(s.replace(",", ".").trim());
  return Number.isNaN(n) ? null : n;
}

function fmt2(n: number | null): string {
  return n == null ? "" : n.toFixed(2);
}

function mapDtoToForm(v: OfferView): FormState {
  const dtoExt = v as OfferView & {
    form_data_parsed?: Record<string, unknown> | null;
  };
  const fd1 = safeJson(dtoExt.form_data_parsed);
  const fd2 = safeJson(v.form_data);
  return {
    id: v.id,
    customer_name: v.customer_name ?? "",
    company_name: safeStr(v.company_name),
    email: v.email ?? "",
    phone: safeStr(v.phone),
    locale: safeStr(v.locale),
    country_code: safeStr(v.country_code),
    subject: safeStr(v.subject),
    message: safeStr(v.message),
    product_id: safeStr(v.product_id),
    service_id: safeStr(v.service_id),
    status: v.status ?? "new",
    currency: safeStr(v.currency) || "EUR",
    net_total: safeStr(v.net_total),
    vat_rate: safeStr(v.vat_rate),
    shipping_total: safeStr(v.shipping_total),
    vat_total: safeStr(v.vat_total),
    gross_total: safeStr(v.gross_total),
    offer_no: safeStr(v.offer_no),
    valid_until: v.valid_until ? String(v.valid_until).substring(0, 10) : "",
    admin_notes: safeStr(v.admin_notes),
    pdf_url: safeStr(v.pdf_url),
    pdf_asset_id: safeStr(v.pdf_asset_id),
    email_sent_at: safeStr(v.email_sent_at),
    consent_marketing: safeBool(v.consent_marketing),
    consent_terms: safeBool(v.consent_terms),
    form_data: Object.keys(fd1).length ? fd1 : fd2,
  };
}

function resolvePdfUrl(pdfUrl: string | null): string | null {
  if (!pdfUrl) return null;
  if (/^https?:\/\//i.test(pdfUrl)) return pdfUrl;
  const s = pdfUrl.trim();
  if (s.startsWith("/uploads/") || s === "/uploads") return s;
  const idx = s.indexOf("/uploads/");
  if (idx >= 0) return s.substring(idx);
  return `/uploads/${s}`.replace(/^\/uploads\/uploads(\/|$)/, "/uploads$1");
}

/* ------------------------------------------------------------------ */
/* form_data display defs                                              */
/* ------------------------------------------------------------------ */

type FieldDef = { key: string; labelKey: string };

const FIELD_DEFS: FieldDef[] = [
  { key: "related_type", labelKey: "formData.relatedType" },
  { key: "contact_role", labelKey: "formData.contactRole" },
  { key: "related_product_id", labelKey: "formData.productId" },
  { key: "related_product_name", labelKey: "formData.productName" },
  { key: "related_service_id", labelKey: "formData.serviceId" },
  { key: "related_service_name", labelKey: "formData.serviceName" },
  { key: "product_category", labelKey: "formData.productCategory" },
  { key: "product_name", labelKey: "formData.productNameLegacy" },
  { key: "sector", labelKey: "formData.sector" },
  { key: "quantity", labelKey: "formData.quantity" },
  { key: "deadline", labelKey: "formData.deadline" },
  { key: "material", labelKey: "formData.material" },
  { key: "dimensions", labelKey: "formData.dimensions" },
  { key: "usage_environment", labelKey: "formData.usageEnvironment" },
  { key: "surface_finish", labelKey: "formData.surfaceFinish" },
  { key: "tower_process", labelKey: "formData.process" },
  { key: "tower_city", labelKey: "formData.city" },
  { key: "tower_district", labelKey: "formData.district" },
  { key: "water_flow_m3h", labelKey: "formData.waterFlow" },
  { key: "inlet_temperature_c", labelKey: "formData.inletTemp" },
  { key: "outlet_temperature_c", labelKey: "formData.outletTemp" },
  { key: "wet_bulb_temperature_c", labelKey: "formData.wetBulb" },
  { key: "capacity_kcal_kw", labelKey: "formData.capacity" },
  { key: "water_quality", labelKey: "formData.waterQuality" },
  { key: "pool_type", labelKey: "formData.poolType" },
  { key: "tower_location", labelKey: "formData.location" },
  { key: "existing_tower_info", labelKey: "formData.existingTower" },
  { key: "referral_source", labelKey: "formData.referralSource" },
  { key: "notes", labelKey: "formData.notes" },
];

function formatValue(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (typeof v === "string") return v.trim();
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (Array.isArray(v)) return v.length ? v.map(String).join(", ") : "";
  try {
    return JSON.stringify(v);
  } catch {
    return "[object]";
  }
}

/* ================================================================== */
/* Component                                                           */
/* ================================================================== */

export default function AdminOfferDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const t = useAdminT("admin.offer");

  const isCreate = id === "new";
  const canLoad = !isCreate && isUuidLike(id);

  const offerQ = useGetOfferAdminQuery({ id }, { skip: !canLoad, refetchOnMountOrArgChange: true });

  const [createOffer, createState] = useCreateOfferAdminMutation();
  const [updateOffer, updateState] = useUpdateOfferAdminMutation();
  const [generatePdf, pdfState] = useGenerateOfferPdfAdminMutation();
  const [sendEmail, emailState] = useSendOfferEmailAdminMutation();

  const [form, setForm] = React.useState<FormState>(EMPTY_FORM);
  const [editTab, setEditTab] = React.useState<string>("form");

  const saving = createState.isLoading || updateState.isLoading;
  const loading = offerQ.isFetching || saving;
  const busy = loading || pdfState.isLoading || emailState.isLoading;

  // Populate form
  React.useEffect(() => {
    if (offerQ.data) {
      setForm(mapDtoToForm(offerQ.data as OfferView));
    } else if (isCreate) {
      setForm({ ...EMPTY_FORM });
    }
  }, [offerQ.data, isCreate]);

  // Computed totals (VAT + Gross)
  const computed = React.useMemo(() => {
    const net = parseDecimal(form.net_total);
    const vatRate = parseDecimal(form.vat_rate);
    const shipping = parseDecimal(form.shipping_total);

    let vatTotal: number | null = null;
    let grossTotal: number | null = null;

    if (net != null) {
      if (vatRate != null) vatTotal = Number((net * (vatRate / 100)).toFixed(2));
      grossTotal = Number((net + (vatTotal ?? 0) + (shipping ?? 0)).toFixed(2));
    }

    return { vatTotal, grossTotal };
  }, [form.net_total, form.vat_rate, form.shipping_total]);

  // Sync computed totals
  React.useEffect(() => {
    setForm((prev) => {
      const nextVat = fmt2(computed.vatTotal);
      const nextGross = fmt2(computed.grossTotal);
      if (prev.vat_total === nextVat && prev.gross_total === nextGross) return prev;
      return { ...prev, vat_total: nextVat, gross_total: nextGross };
    });
  }, [computed.vatTotal, computed.grossTotal]);

  // form_data display
  const { pairs, extras } = React.useMemo(() => {
    const fd = form.form_data ?? {};
    const ps = FIELD_DEFS.map((f) => ({
      key: f.key,
      label: t(f.labelKey),
      value: formatValue(fd[f.key]),
    })).filter((p) => p.value);

    const known = new Set(FIELD_DEFS.map((x) => x.key));
    const ex = Object.keys(fd)
      .filter((k) => !known.has(k))
      .map((k) => ({ key: k, label: k, value: formatValue(fd[k]) }))
      .filter((p) => p.value);

    return { pairs: ps, extras: ex };
  }, [form.form_data, t]);

  const pdfHref = React.useMemo(() => resolvePdfUrl(form.pdf_url || null), [form.pdf_url]);

  /* ---- Handlers ---- */

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSave() {
    if (!form.customer_name.trim() || !form.email.trim()) {
      toast.error(t("messages.requiredError"));
      return;
    }

    const net = parseDecimal(form.net_total);
    const vatRate = parseDecimal(form.vat_rate);
    const shipping = parseDecimal(form.shipping_total);

    const payload = {
      locale: form.locale || undefined,
      country_code: form.country_code || undefined,
      customer_name: form.customer_name.trim(),
      company_name: form.company_name.trim() || null,
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      subject: form.subject.trim() || null,
      message: form.message.trim() || null,
      product_id: form.product_id.trim() || null,
      service_id: form.service_id.trim() || null,
      form_data: form.form_data ?? {},
      consent_marketing: form.consent_marketing,
      consent_terms: form.consent_terms,
      status: form.status,
      currency: form.currency.trim() || undefined,
      net_total: net ?? undefined,
      vat_rate: vatRate ?? undefined,
      shipping_total: shipping ?? undefined,
      vat_total: computed.vatTotal ?? undefined,
      gross_total: computed.grossTotal ?? undefined,
      valid_until: form.valid_until || null,
      offer_no: form.offer_no.trim() || null,
      admin_notes: form.admin_notes.trim() || null,
      pdf_url: form.pdf_url.trim() || null,
      pdf_asset_id: form.pdf_asset_id.trim() || null,
      email_sent_at: null,
    };

    try {
      if (isCreate) {
        const res = await createOffer(payload).unwrap();
        toast.success(t("messages.created"));
        if (res?.id) router.replace(`/admin/offer/${encodeURIComponent(res.id)}`);
      } else if (form.id) {
        const res = await updateOffer({ id: form.id, body: payload }).unwrap();
        setForm(mapDtoToForm(res as OfferView));
        toast.success(t("messages.saved"));
      }
    } catch (err: unknown) {
      toast.error(getErrMsg(err, t("messages.saveError")));
    }
  }

  async function onGeneratePdf() {
    if (!form.id) return;
    try {
      const res = await generatePdf({ id: form.id }).unwrap();
      setForm(mapDtoToForm(res as OfferView));
      toast.success(form.pdf_url ? t("messages.pdfRegenerated") : t("messages.pdfGenerated"));
    } catch (err: unknown) {
      toast.error(getErrMsg(err, t("messages.pdfError")));
    }
  }

  async function onSendEmail() {
    if (!form.id) return;
    if (!form.pdf_url) {
      toast.error(t("messages.pdfRequired"));
      return;
    }
    try {
      const res = await sendEmail({ id: form.id }).unwrap();
      setForm(mapDtoToForm(res as OfferView));
      toast.success(t("messages.emailSent"));
    } catch (err: unknown) {
      toast.error(getErrMsg(err, t("messages.emailError")));
    }
  }

  /* ---- Not found ---- */
  if (!isCreate && !offerQ.isFetching && offerQ.error && !offerQ.data) {
    return (
      <div className="space-y-4">
        <h1 className="font-semibold text-lg">{t("detail.notFoundTitle")}</h1>
        <p className="text-muted-foreground text-sm">
          {t("detail.notFoundDescription")} <code className="ml-1">{id}</code>
        </p>
        <Button variant="outline" onClick={() => router.push("/admin/offer")}>
          <ArrowLeft className="mr-2 size-4" />
          {t("actions.backToList")}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 carbon-mesh min-h-screen pb-12">
      {/* HEADER */}
      <Card className="premium-card overflow-hidden border-none">
        <div className="gold-gradient h-1.5 w-full" />
        <CardHeader className="py-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="text-xl font-bold tracking-tight">
                {isCreate ? t("detail.createTitle") : t("detail.editTitle")}
              </CardTitle>
              <CardDescription className="text-muted-foreground/80">{t("detail.subtitle")}</CardDescription>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => router.push("/admin/offer")}
                className="rounded-full px-4 border-white/10"
              >
                <ArrowLeft className="mr-2 size-4" />
                {t("actions.backToList")}
              </Button>
              <Button 
                size="sm" 
                onClick={onSave} 
                disabled={busy}
                className="gold-gradient rounded-full px-8 font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Save className="mr-2 size-4" />
                {saving ? t("actions.saving") : t("actions.save")}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* FORM DATA (edit only) */}
      {!isCreate && (pairs.length > 0 || extras.length > 0) && (
        <Card className="premium-card bg-card/20 border-white/5">
          <CardHeader className="gap-2">
            <CardTitle className="text-base font-bold uppercase tracking-widest text-primary/80">
              {t("detail.formDataTitle")}{" "}
              <Badge variant="outline" className="ml-2">
                {Object.keys(form.form_data ?? {}).length} {t("detail.formDataFields")}
              </Badge>
            </CardTitle>
            <CardDescription className="text-muted-foreground/70">{t("detail.formDataDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              {pairs.map((p) => (
                <div key={p.key}>
                  <div className="text-muted-foreground text-xs">{p.label}</div>
                  <div className="font-medium text-sm">{p.value}</div>
                </div>
              ))}
            </div>
            {extras.length > 0 && (
              <>
                <hr className="my-3" />
                <div className="mb-2 text-muted-foreground text-xs">{t("detail.extraFields")}</div>
                <div className="grid gap-3 md:grid-cols-2">
                  {extras.map((p) => (
                    <div key={p.key}>
                      <div className="text-muted-foreground text-xs">{p.label}</div>
                      <div className="font-mono text-xs">{p.value}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* PDF SECTION (edit only) */}
      {!isCreate && form.id && (
        <Card className="premium-card">
          <CardHeader className="gap-2">
            <CardTitle className="text-base font-bold">{t("detail.pdfTitle")}</CardTitle>
            <CardDescription className="text-muted-foreground/80">{t("detail.pdfDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <OfferPdfPreview
              pdfUrl={pdfHref}
              emptyMessage={t("detail.pdfEmpty")}
              fallbackLabel={t("detail.pdfFallback")}
            />

            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onGeneratePdf} 
                disabled={pdfState.isLoading || saving}
                className="rounded-full px-4 border-white/10"
              >
                <FileText className="mr-2 size-4" />
                {pdfState.isLoading
                  ? t("actions.generatingPdf")
                  : form.pdf_url
                    ? t("actions.regeneratePdf")
                    : t("actions.generatePdf")}
              </Button>

              <Button
                size="sm"
                onClick={onSendEmail}
                disabled={emailState.isLoading || saving || !form.pdf_url}
                title={!form.pdf_url ? t("messages.pdfRequired") : undefined}
                className="gold-gradient rounded-full px-6 font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Mail className="mr-2 size-4" />
                {emailState.isLoading ? t("actions.sendingEmail") : t("actions.sendEmail")}
              </Button>

              {pdfHref && (
                <Button variant="secondary" size="sm" asChild>
                  <a href={pdfHref} target="_blank" rel="noreferrer">
                    <ExternalLink className="mr-2 size-4" />
                    {t("actions.openPdf")}
                  </a>
                </Button>
              )}
            </div>

            {form.email_sent_at && (
              <p className="text-muted-foreground text-xs">
                {t("detail.lastSent")}: <code>{form.email_sent_at}</code>
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* FORM / JSON TABS */}
      <Tabs value={editTab} onValueChange={setEditTab} className="w-full">
        <TabsList className="premium-card p-1 bg-card/40 border-white/5">
          <TabsTrigger value="form" className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
            <FormInput className="mr-2 size-4" />
            {t("detail.tabForm")}
          </TabsTrigger>
          <TabsTrigger value="json" className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
            <Code className="mr-2 size-4" />
            {t("detail.tabJson")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="form" className="mt-4">
          <div className="grid gap-6 xl:grid-cols-3">
            {/* LEFT — Main fields */}
            <Card className="xl:col-span-2 premium-card">
              <CardHeader className="gap-2">
                <CardTitle className="text-base font-bold">{t("detail.formTitle")}</CardTitle>
                <CardDescription className="text-muted-foreground/80">{t("detail.formDesc")}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Label>{t("fields.status")}</Label>
                  <Select value={form.status} onValueChange={(v) => setField("status", v as OfferStatus)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
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
                  <Label>{t("fields.customerName")} *</Label>
                  <Input
                    value={form.customer_name}
                    onChange={(e) => setField("customer_name", e.target.value)}
                    disabled={busy}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("fields.companyName")}</Label>
                  <Input
                    value={form.company_name}
                    onChange={(e) => setField("company_name", e.target.value)}
                    disabled={busy}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("fields.email")} *</Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setField("email", e.target.value)}
                    disabled={busy}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("fields.phone")}</Label>
                  <Input value={form.phone} onChange={(e) => setField("phone", e.target.value)} disabled={busy} />
                </div>
                <div className="space-y-2">
                  <Label>{t("fields.locale")}</Label>
                  <Input
                    value={form.locale}
                    onChange={(e) => setField("locale", e.target.value)}
                    placeholder="tr / en / de"
                    disabled={busy}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("fields.countryCode")}</Label>
                  <Input
                    value={form.country_code}
                    onChange={(e) => setField("country_code", e.target.value.toUpperCase())}
                    placeholder="TR / DE"
                    disabled={busy}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>{t("fields.subject")}</Label>
                  <Input value={form.subject} onChange={(e) => setField("subject", e.target.value)} disabled={busy} />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>{t("fields.message")}</Label>
                  <Textarea
                    value={form.message}
                    onChange={(e) => setField("message", e.target.value)}
                    rows={4}
                    disabled={busy}
                  />
                </div>
              </CardContent>
            </Card>

            {/* RIGHT — Pricing & Meta */}
            <Card className="premium-card">
              <CardHeader className="gap-2">
                <CardTitle className="text-base font-bold">{t("detail.pricingTitle")}</CardTitle>
                <CardDescription className="text-muted-foreground/80">{t("detail.pricingDesc")}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="space-y-2">
                  <Label>{t("fields.currency")}</Label>
                  <Input
                    value={form.currency}
                    onChange={(e) => setField("currency", e.target.value || "EUR")}
                    disabled={busy}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>{t("fields.netTotal")}</Label>
                    <Input
                      inputMode="decimal"
                      value={form.net_total}
                      onChange={(e) => setField("net_total", e.target.value)}
                      disabled={busy}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("fields.vatRate")}</Label>
                    <Input
                      inputMode="decimal"
                      value={form.vat_rate}
                      onChange={(e) => setField("vat_rate", e.target.value)}
                      disabled={busy}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("fields.shippingTotal")}</Label>
                    <Input
                      inputMode="decimal"
                      value={form.shipping_total}
                      onChange={(e) => setField("shipping_total", e.target.value)}
                      disabled={busy}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("fields.vatTotal")}</Label>
                    <Input value={form.vat_total} readOnly />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label>{t("fields.grossTotal")}</Label>
                    <Input value={form.gross_total} readOnly className="font-semibold" />
                  </div>
                </div>

                <hr />

                <div className="space-y-2">
                  <Label>{t("fields.offerNo")}</Label>
                  <Input
                    value={form.offer_no}
                    onChange={(e) => setField("offer_no", e.target.value)}
                    placeholder="ENS-2025-0001"
                    disabled={busy}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("fields.validUntil")}</Label>
                  <Input
                    type="date"
                    value={form.valid_until}
                    onChange={(e) => setField("valid_until", e.target.value)}
                    disabled={busy}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("fields.productId")}</Label>
                  <Input
                    value={form.product_id}
                    onChange={(e) => setField("product_id", e.target.value)}
                    className="font-mono text-xs"
                    disabled={busy}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("fields.serviceId")}</Label>
                  <Input
                    value={form.service_id}
                    onChange={(e) => setField("service_id", e.target.value)}
                    className="font-mono text-xs"
                    disabled={busy}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("fields.adminNotes")}</Label>
                  <Textarea
                    value={form.admin_notes}
                    onChange={(e) => setField("admin_notes", e.target.value)}
                    rows={3}
                    disabled={busy}
                    placeholder={t("fields.adminNotesPlaceholder")}
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t("fields.pdfUrl")}</Label>
                  <Input value={form.pdf_url} onChange={(e) => setField("pdf_url", e.target.value)} disabled={busy} />
                </div>
                <div className="space-y-2">
                  <Label>{t("fields.pdfAssetId")}</Label>
                  <Input
                    value={form.pdf_asset_id}
                    onChange={(e) => setField("pdf_asset_id", e.target.value)}
                    disabled={busy}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Switch checked={form.consent_marketing} onCheckedChange={(v) => setField("consent_marketing", v)} />
                  <Label>{t("fields.consentMarketing")}</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={form.consent_terms} onCheckedChange={(v) => setField("consent_terms", v)} />
                  <Label>{t("fields.consentTerms")}</Label>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="json" className="mt-4">
          <Card>
            <CardHeader className="gap-2">
              <CardTitle className="text-base">{t("detail.jsonTitle")}</CardTitle>
              <CardDescription>{t("detail.jsonDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminJsonEditor
                label={t("detail.jsonLabel")}
                value={form.form_data ?? {}}
                onChange={(next) => setField("form_data", next)}
                onErrorChange={() => toast.error(t("messages.invalidJson"))}
                disabled={busy}
                height={420}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
