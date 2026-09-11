"use client";

import * as React from "react";
import Link from "next/link";
import { Activity, BarChart3, CalendarDays, ExternalLink, Link2, Save, Send, Unplug, Users, type LucideIcon } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@ensotek/shared-ui/admin/ui/badge";
import { Button } from "@ensotek/shared-ui/admin/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@ensotek/shared-ui/admin/ui/card";
import { Input } from "@ensotek/shared-ui/admin/ui/input";
import { Label } from "@ensotek/shared-ui/admin/ui/label";
import { Switch } from "@ensotek/shared-ui/admin/ui/switch";
import { Textarea } from "@ensotek/shared-ui/admin/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ensotek/shared-ui/admin/ui/tabs";
import {
  type MarketingChannel,
  useGetGa4ReportQuery,
  useGetGoogleConnectionStatusQuery,
  useGetGscReportQuery,
  useGetMarketingOverviewQuery,
  useCreateSocialPostMutation,
  useDisconnectSocialConnectionMutation,
  useListSocialLivePostsQuery,
  useListSocialPostsQuery,
  useListSocialStatusesQuery,
  useStartSocialConnectionMutation,
  useUpdateMarketingSettingsMutation,
} from "@/integrations/endpoints/admin/marketing_admin.endpoints";

export type MarketingPage = "analytics" | "ga4" | "search-console" | "google-ads" | "social";
export type SocialPage = "facebook" | "instagram" | "linkedin" | "x";

const SOCIAL_LABELS: Record<SocialPage, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  x: "X (Twitter)",
};

function Shell({ eyebrow, title, description, children }: React.PropsWithChildren<{ eyebrow: string; title: string; description: string }>) {
  return (
    <div className="admin-module-page space-y-6 pb-12">
      <div className="rounded-xl border bg-card p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
        <h1 className="mt-2 text-2xl font-semibold">{title}</h1>
        <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  );
}

export function MarketingSection({ page }: { page: MarketingPage }) {
  const overview = useGetMarketingOverviewQuery(30);
  const status = useGetGoogleConnectionStatusQuery();
  const ga4 = useGetGa4ReportQuery(28, { skip: page !== "ga4" });
  const gsc = useGetGscReportQuery(28, { skip: page !== "search-console" });

  if (page === "analytics") {
    const totals = overview.data?.totals;
    return (
      <Shell eyebrow="Pazarlama" title="Analitik" description="Gerçek ziyaretçi trafiğini, sayfa görüntülemelerini ve en çok ziyaret edilen içerikleri izleyin.">
        <div className="grid gap-4 md:grid-cols-3">
          {([
            ["Sayfa görüntüleme", totals?.views ?? 0, BarChart3],
            ["Tekil ziyaretçi", totals?.visitors ?? 0, Users],
            ["Hatalı istek", totals?.errors ?? 0, Activity],
          ] satisfies Array<[string, number, LucideIcon]>).map(([label, value, Icon]) => (
            <Card key={String(label)}>
              <CardContent className="flex items-center justify-between p-6">
                <div><p className="text-sm text-muted-foreground">{String(label)}</p><p className="mt-1 text-3xl font-semibold">{Number(value).toLocaleString("tr-TR")}</p></div>
                <Icon className="size-6 text-primary" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader><CardTitle>En çok görüntülenen sayfalar</CardTitle></CardHeader>
          <CardContent className="divide-y">
            {(overview.data?.top_pages ?? []).map((item) => (
              <div key={item.path} className="flex justify-between gap-4 py-3 text-sm">
                <span className="truncate font-mono">{item.path}</span>
                <span>{item.views.toLocaleString("tr-TR")} görüntüleme</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </Shell>
    );
  }

  if (page === "ga4") {
    return (
      <Shell eyebrow="Google" title="Google Analytics (GA4)" description="MOE Kompozit GA4 mülkünün son 28 günlük gerçek performans raporu.">
        <ConnectionBadge connected={Boolean(status.data?.ga4)} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(ga4.data?.totals ?? { users: 0, sessions: 0, views: 0, conversions: 0 }).map(([key, value]) => (
            <Card key={key}><CardContent className="p-6"><p className="text-sm capitalize text-muted-foreground">{key}</p><p className="mt-2 text-3xl font-semibold">{value.toLocaleString("tr-TR")}</p></CardContent></Card>
          ))}
        </div>
      </Shell>
    );
  }

  if (page === "search-console") {
    return (
      <Shell eyebrow="Google" title="Search Console" description="Arama görünürlüğünü, sorguları ve Google indeks performansını izleyin.">
        <ConnectionBadge connected={Boolean(status.data?.gsc)} />
        <div className="grid gap-4 sm:grid-cols-4">
          {Object.entries(gsc.data?.totals ?? { clicks: 0, impressions: 0, ctr: 0, position: 0 }).map(([key, value]) => (
            <Card key={key}><CardContent className="p-5"><p className="text-xs uppercase text-muted-foreground">{key}</p><p className="mt-2 text-2xl font-semibold">{Number(value).toLocaleString("tr-TR")}</p></CardContent></Card>
          ))}
        </div>
        <Card><CardHeader><CardTitle>En güçlü sorgular</CardTitle></CardHeader><CardContent className="divide-y">
          {(gsc.data?.queries ?? []).slice(0, 20).map((item) => <div key={item.key} className="flex justify-between py-3 text-sm"><span>{item.key}</span><span>{item.clicks} tıklama</span></div>)}
        </CardContent></Card>
      </Shell>
    );
  }

  if (page === "google-ads") {
    return (
      <Shell eyebrow="Google" title="Google Ads" description="Reklam hesabı ve dönüşüm ölçümü bağlantı durumunu yönetin.">
        <ConnectionBadge connected={Boolean(status.data?.ads)} />
        <Card><CardContent className="space-y-4 p-6">
          <p className="text-sm text-muted-foreground">Google Ads geliştirici belirteci ve müşteri hesabı güvenli sistem ayarlarından yönetilir.</p>
          <Button asChild><Link href="/admin/site-settings?tab=api-settings">Entegrasyon ayarlarına git</Link></Button>
        </CardContent></Card>
      </Shell>
    );
  }

  return <SocialSettings />;
}

function ConnectionBadge({ connected }: { connected: boolean }) {
  return <Badge variant={connected ? "default" : "secondary"}>{connected ? "Bağlı ve etkin" : "Kurulum gerekli"}</Badge>;
}

export function SocialSettings({ platform }: { platform?: SocialPage }) {
  const overview = useGetMarketingOverviewQuery(30);
  const [save, saveState] = useUpdateMarketingSettingsMutation();
  const [channels, setChannels] = React.useState<Record<string, MarketingChannel>>({});
  React.useEffect(() => setChannels(overview.data?.integrations.social_channels ?? {}), [overview.data]);
  const platforms = platform ? [platform] : (Object.keys(SOCIAL_LABELS) as SocialPage[]);

  const update = (key: SocialPage, patch: Partial<MarketingChannel>) =>
    setChannels((current) => ({
      ...current,
      [key]: { ...(current[key] ?? { enabled: false, url: "" }), ...patch },
    }));

  const submit = async () => {
    try {
      await save({ ...overview.data?.integrations, social_channels: channels }).unwrap();
      toast.success("Sosyal medya ayarları kaydedildi.");
    } catch {
      toast.error("Sosyal medya ayarları kaydedilemedi.");
    }
  };

  return (
    <Shell eyebrow="Pazarlama" title={platform ? SOCIAL_LABELS[platform] : "Sosyal Medya"} description="Kurumsal sosyal medya kanallarının yayın durumunu ve profil bağlantılarını yönetin.">
      <div className="grid gap-4 lg:grid-cols-2">
        {platforms.map((key) => {
          const value = channels[key] ?? { enabled: false, url: "" };
          return <Card key={key}><CardHeader><CardTitle className="flex items-center justify-between">{SOCIAL_LABELS[key]}<Switch checked={value.enabled} onCheckedChange={(enabled) => update(key, { enabled })} /></CardTitle></CardHeader>
            <CardContent className="space-y-3"><Label>Profil adresi</Label><div className="flex gap-2"><Input value={value.url} onChange={(event) => update(key, { url: event.target.value })} placeholder="https://..." />{value.url && <Button asChild variant="outline" size="icon"><a href={value.url} target="_blank" rel="noreferrer"><ExternalLink className="size-4" /></a></Button>}</div></CardContent>
          </Card>;
        })}
      </div>
      <Button onClick={submit} disabled={saveState.isLoading}><Save className="mr-2 size-4" />Ayarları kaydet</Button>
    </Shell>
  );
}

export function SocialPlanner({ platform }: { platform: SocialPage }) {
  const statuses = useListSocialStatusesQuery();
  const connection = statuses.data?.items.find((item) => item.platform === platform);
  const connected = connection?.connection?.status === "connected";
  const posts = useListSocialPostsQuery(platform);
  const live = useListSocialLivePostsQuery(platform, { skip: !connected });
  const [start, startState] = useStartSocialConnectionMutation();
  const [disconnect, disconnectState] = useDisconnectSocialConnectionMutation();
  const [create, createState] = useCreateSocialPostMutation();
  const [title, setTitle] = React.useState("");
  const [caption, setCaption] = React.useState("");
  const [mediaUrl, setMediaUrl] = React.useState("");
  const [linkUrl, setLinkUrl] = React.useState("");
  const [scheduledAt, setScheduledAt] = React.useState("");

  const connect = async () => {
    try {
      const result = await start(platform).unwrap();
      window.location.assign(result.authorization_url);
    } catch {
      toast.error("Proxy bağlantısı başlatılamadı.");
    }
  };
  const remove = async () => {
    if (!window.confirm(`${SOCIAL_LABELS[platform]} bağlantısı kesilsin mi?`)) return;
    try {
      await disconnect(platform).unwrap();
      toast.success("Hesap bağlantısı kesildi.");
    } catch {
      toast.error("Bağlantı kesilemedi.");
    }
  };
  const submit = async () => {
    try {
      await create({
        platform,
        body: {
          title: title.trim() || null,
          caption: caption.trim(),
          media_url: mediaUrl.trim() || null,
          link_url: linkUrl.trim() || null,
          scheduled_at: scheduledAt ? new Date(scheduledAt).toISOString() : null,
        },
      }).unwrap();
      setTitle(""); setCaption(""); setMediaUrl(""); setLinkUrl(""); setScheduledAt("");
      toast.success(scheduledAt ? "İçerik planlandı." : "Taslak kaydedildi.");
    } catch {
      toast.error("İçerik kaydedilemedi.");
    }
  };

  return (
    <Shell eyebrow="Sosyal Medya" title={SOCIAL_LABELS[platform]} description="Hesabı proxy üzerinden bağlayın; içerik hazırlayın, tarih belirleyin ve yayın kuyruğunu yönetin.">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-5">
        <div><Badge variant={connected ? "default" : "secondary"}>{connected ? "Proxy bağlı" : connection?.configured ? "Hesap bağlı değil" : "Proxy token gerekli"}</Badge>
          <p className="mt-2 text-sm text-muted-foreground">{connection?.connection?.external_account_name || SOCIAL_LABELS[platform]}</p></div>
        {connected ? <Button variant="outline" onClick={remove} disabled={disconnectState.isLoading}><Unplug className="mr-2 size-4" />Bağlantıyı kes</Button>
          : <Button onClick={connect} disabled={startState.isLoading || !connection?.configured}><Link2 className="mr-2 size-4" />Hesabı bağla</Button>}
      </div>

      <Tabs defaultValue="compose" className="space-y-5">
        <TabsList><TabsTrigger value="compose">İçerik oluştur</TabsTrigger><TabsTrigger value="queue">Plan & taslaklar</TabsTrigger><TabsTrigger value="live">Yayın geçmişi</TabsTrigger></TabsList>
        <TabsContent value="compose">
          <Card><CardContent className="grid gap-4 p-6">
            <div className="space-y-2"><Label>Başlık</Label><Input value={title} onChange={(event) => setTitle(event.target.value)} /></div>
            <div className="space-y-2"><Label>İçerik</Label><Textarea rows={7} value={caption} onChange={(event) => setCaption(event.target.value)} placeholder="Gönderi metni..." /></div>
            <div className="grid gap-4 md:grid-cols-2"><div className="space-y-2"><Label>Görsel URL</Label><Input value={mediaUrl} onChange={(event) => setMediaUrl(event.target.value)} placeholder="https://..." /></div>
              <div className="space-y-2"><Label>Bağlantı URL</Label><Input value={linkUrl} onChange={(event) => setLinkUrl(event.target.value)} placeholder="https://..." /></div></div>
            <div className="space-y-2"><Label>Yayın tarihi (boşsa taslak)</Label><Input type="datetime-local" value={scheduledAt} onChange={(event) => setScheduledAt(event.target.value)} /></div>
            <Button onClick={submit} disabled={!caption.trim() || createState.isLoading}><Send className="mr-2 size-4" />{scheduledAt ? "İçeriği planla" : "Taslak kaydet"}</Button>
          </CardContent></Card>
        </TabsContent>
        <TabsContent value="queue"><Card><CardContent className="divide-y p-6">{(posts.data?.items ?? []).map((post) =>
          <div key={post.id} className="flex items-start justify-between gap-4 py-4"><div><p className="font-medium">{post.title || post.caption}</p><p className="mt-1 text-xs text-muted-foreground">{post.scheduled_at ? new Date(post.scheduled_at).toLocaleString("tr-TR") : "Taslak"}</p></div><Badge variant="outline">{post.status}</Badge></div>)}
          {!posts.data?.items.length && <p className="text-sm text-muted-foreground">Henüz planlanmış içerik yok.</p>}</CardContent></Card></TabsContent>
        <TabsContent value="live"><div className="grid gap-4 md:grid-cols-2">{(live.data?.items ?? []).map((post) =>
          <Card key={post.id}><CardContent className="p-5"><p className="line-clamp-4 text-sm">{post.caption}</p><div className="mt-4 flex justify-between"><Badge>{post.status}</Badge>{post.permalink && <Button asChild size="sm" variant="outline"><a href={post.permalink} target="_blank" rel="noreferrer">Görüntüle</a></Button>}</div></CardContent></Card>)}
          {!connected && <p className="text-sm text-muted-foreground">Yayın geçmişi için hesabı bağlayın.</p>}</div></TabsContent>
      </Tabs>
    </Shell>
  );
}
