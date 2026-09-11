"use client";

import * as React from "react";

import { BarChart3, ExternalLink, Globe2, Save, Search, Share2, TriangleAlert, Users } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@ensotek/shared-ui/admin/ui/badge";
import { Button } from "@ensotek/shared-ui/admin/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@ensotek/shared-ui/admin/ui/card";
import { Input } from "@ensotek/shared-ui/admin/ui/input";
import { Label } from "@ensotek/shared-ui/admin/ui/label";
import { Switch } from "@ensotek/shared-ui/admin/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ensotek/shared-ui/admin/ui/tabs";
import {
  type MarketingChannel,
  type MarketingSettings,
  useGetMarketingOverviewQuery,
  useGetGoogleConnectionStatusQuery,
  useGetGa4ReportQuery,
  useGetGscReportQuery,
  useGetGtmSummaryQuery,
  useUpdateMarketingSettingsMutation,
} from "@/integrations/endpoints/admin/marketing_admin.endpoints";

const CHANNELS = ["facebook", "instagram", "linkedin", "youtube", "x"] as const;
const CHANNEL_LABELS: Record<(typeof CHANNELS)[number], string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  youtube: "YouTube",
  x: "X",
};

function Metric({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-1 text-3xl font-semibold">{value.toLocaleString("tr-TR")}</p>
        </div>
        <div className="rounded-xl bg-primary/10 p-3 text-primary">{icon}</div>
      </CardContent>
    </Card>
  );
}

export default function MarketingDashboard() {
  const { data, isLoading } = useGetMarketingOverviewQuery(30);
  const googleStatus = useGetGoogleConnectionStatusQuery();
  const ga4 = useGetGa4ReportQuery(28);
  const gsc = useGetGscReportQuery(28);
  const gtm = useGetGtmSummaryQuery();
  const [save, saveState] = useUpdateMarketingSettingsMutation();
  const [form, setForm] = React.useState<MarketingSettings>({});

  React.useEffect(() => {
    if (data?.integrations) setForm(data.integrations);
  }, [data]);

  const setChannel = (name: string, patch: Partial<MarketingChannel>) => {
    setForm((current) => ({
      ...current,
      social_channels: {
        ...current.social_channels,
        [name]: { enabled: false, url: "", ...current.social_channels?.[name], ...patch },
      },
    }));
  };

  const saveSettings = async () => {
    try {
      await save(form).unwrap();
      toast.success("Pazarlama ayarları kaydedildi.");
    } catch {
      toast.error("Ayarlar kaydedilemedi.");
    }
  };

  return (
    <div className="admin-module-page space-y-6">
      <div className="flex flex-col gap-4 rounded-xl border bg-card p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Pazarlama & SEO</p>
          <h1 className="mt-2 text-2xl font-semibold">Pazarlama Merkezi</h1>
          <p className="mt-1 text-sm text-muted-foreground">Site trafiği, Google görünürlüğü ve sosyal medya kanallarını tek yerden izleyin.</p>
        </div>
        <div>
          <Button onClick={saveSettings} disabled={saveState.isLoading}>
            <Save className="mr-2 size-4" /> Ayarları kaydet
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Metric title="30 günlük sayfa görüntüleme" value={data?.totals.views || 0} icon={<BarChart3 />} />
        <Metric title="Tekil ziyaretçi" value={data?.totals.visitors || 0} icon={<Users />} />
        <Metric title="Hatalı istek" value={data?.totals.errors || 0} icon={<TriangleAlert />} />
      </div>

      <Tabs defaultValue="analytics" className="space-y-5">
        <TabsList className="h-auto">
          <TabsTrigger value="analytics"><BarChart3 className="mr-2 size-4" />Analitik</TabsTrigger>
          <TabsTrigger value="google"><Search className="mr-2 size-4" />Google & indeks</TabsTrigger>
          <TabsTrigger value="social"><Share2 className="mr-2 size-4" />Sosyal medya</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics">
          <Card>
            <CardHeader><CardTitle>En çok görüntülenen sayfalar</CardTitle></CardHeader>
            <CardContent>
              {isLoading ? <p className="text-sm text-muted-foreground">Veriler yükleniyor…</p> : (
                <div className="divide-y">
                  {(data?.top_pages || []).map((page) => (
                    <div key={page.path} className="flex items-center justify-between gap-4 py-3">
                      <span className="truncate font-mono text-sm">{page.path}</span>
                      <div className="flex gap-4 text-sm">
                        <span>{page.views} görüntüleme</span>
                        <span className="text-muted-foreground">{page.visitors} ziyaretçi</span>
                      </div>
                    </div>
                  ))}
                  {!isLoading && !data?.top_pages.length ? <p className="py-6 text-sm text-muted-foreground">Henüz trafik kaydı yok.</p> : null}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="google" className="grid gap-5 lg:grid-cols-2">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Google ekosistemi
                <Badge variant={googleStatus.data?.connected ? "default" : "destructive"}>
                  {googleStatus.data?.connected ? "OAuth bağlı" : "Bağlantı yok"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-4">
              {(["ga4", "gsc", "gtm", "ads"] as const).map((service) => (
                <div key={service} className="rounded-lg border p-3">
                  <p className="font-semibold uppercase">{service}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{googleStatus.data?.[service] ? "Yetki aktif" : "Yetki bulunamadı"}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>GA4 · Son 28 gün</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">Kullanıcı</p><p className="text-2xl font-semibold">{ga4.data?.totals.users.toLocaleString("tr-TR") || "0"}</p></div>
                <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">Oturum</p><p className="text-2xl font-semibold">{ga4.data?.totals.sessions.toLocaleString("tr-TR") || "0"}</p></div>
                <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">Görüntüleme</p><p className="text-2xl font-semibold">{ga4.data?.totals.views.toLocaleString("tr-TR") || "0"}</p></div>
                <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">Dönüşüm</p><p className="text-2xl font-semibold">{ga4.data?.totals.conversions.toLocaleString("tr-TR") || "0"}</p></div>
              </div>
              {ga4.isError ? <p className="text-sm text-destructive">GA4 raporu alınamadı.</p> : null}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Search Console · Son 28 gün</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">Tıklama</p><p className="text-2xl font-semibold">{gsc.data?.totals.clicks.toLocaleString("tr-TR") || "0"}</p></div>
                <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">Gösterim</p><p className="text-2xl font-semibold">{gsc.data?.totals.impressions.toLocaleString("tr-TR") || "0"}</p></div>
              </div>
              <div className="divide-y">
                {(gsc.data?.queries || []).slice(0, 5).map((query) => (
                  <div key={query.key} className="flex justify-between gap-3 py-2 text-sm"><span className="truncate">{query.key}</span><span>{query.clicks} tıklama</span></div>
                ))}
              </div>
              {gsc.isError ? <p className="text-sm text-destructive">Search Console raporu alınamadı.</p> : null}
            </CardContent>
          </Card>
          <Card className="lg:col-span-2">
            <CardHeader><CardTitle>Google Tag Manager</CardTitle></CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-4">
              <div><p className="text-xs text-muted-foreground">Konteyner</p><p className="font-semibold">{gtm.data?.public_id || "—"}</p></div>
              <div><p className="text-xs text-muted-foreground">Etiket</p><p className="font-semibold">{gtm.data?.tags ?? "—"}</p></div>
              <div><p className="text-xs text-muted-foreground">Tetikleyici</p><p className="font-semibold">{gtm.data?.triggers ?? "—"}</p></div>
              <div><p className="text-xs text-muted-foreground">Değişken</p><p className="font-semibold">{gtm.data?.variables ?? "—"}</p></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Google Analytics 4</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>GA4 bağlantısını etkinleştir</Label>
                <Switch
                  checked={Boolean(form.analytics_integrations?.ga4?.enabled)}
                  onCheckedChange={(enabled) => setForm((v) => ({
                    ...v,
                    analytics_integrations: { ...v.analytics_integrations, ga4: { enabled } },
                  }))}
                />
              </div>
              <div className="space-y-2"><Label>Property ID</Label><Input value={form.ga4_property_id || ""} onChange={(e) => setForm((v) => ({ ...v, ga4_property_id: e.target.value }))} placeholder="properties/123456789" /></div>
              <div className="space-y-2"><Label>Akış Kimliği</Label><Input value={form.ga4_stream_id || ""} onChange={(e) => setForm((v) => ({ ...v, ga4_stream_id: e.target.value }))} placeholder="15340347924" /></div>
              <div className="space-y-2"><Label>Ölçüm Kimliği</Label><Input value={form.ga4_measurement_id || ""} onChange={(e) => setForm((v) => ({ ...v, ga4_measurement_id: e.target.value }))} placeholder="G-XXXXXXXXXX" /></div>
              <div className="space-y-2"><Label>GTM Konteyneri</Label><Input value={form.gtm_container_id || ""} onChange={(e) => setForm((v) => ({ ...v, gtm_container_id: e.target.value }))} placeholder="GTM-XXXXXXX" /></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Google Search Console</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Search Console bağlantısını etkinleştir</Label>
                <Switch
                  checked={Boolean(form.analytics_integrations?.search_console?.enabled)}
                  onCheckedChange={(enabled) => setForm((v) => ({
                    ...v,
                    analytics_integrations: { ...v.analytics_integrations, search_console: { enabled } },
                  }))}
                />
              </div>
              <div className="space-y-2"><Label>Site adresi</Label><Input value={form.gsc_site_url || ""} onChange={(e) => setForm((v) => ({ ...v, gsc_site_url: e.target.value }))} placeholder="sc-domain:karbonkompozit.com.tr" /></div>
              <p className="text-xs text-muted-foreground">URL inceleme için sunucuda Google servis hesabı yetkisi de gerekir.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <div className="grid gap-4 lg:grid-cols-2">
            {CHANNELS.map((channel) => {
              const value = form.social_channels?.[channel] || { enabled: false, url: "" };
              return (
                <Card key={channel}>
                  <CardContent className="space-y-4 p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2"><Globe2 className="size-4" /><Label>{CHANNEL_LABELS[channel]}</Label></div>
                      <Switch checked={value.enabled} onCheckedChange={(enabled) => setChannel(channel, { enabled })} />
                    </div>
                    <div className="flex gap-2">
                      <Input value={value.url} onChange={(e) => setChannel(channel, { url: e.target.value })} placeholder="Profil veya kanal adresi" />
                      {value.url ? <Button asChild variant="outline" size="icon"><a href={value.url} target="_blank" rel="noreferrer"><ExternalLink className="size-4" /></a></Button> : null}
                    </div>
                    <Badge variant={value.enabled ? "default" : "outline"}>{value.enabled ? "Yayında" : "Kapalı"}</Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
