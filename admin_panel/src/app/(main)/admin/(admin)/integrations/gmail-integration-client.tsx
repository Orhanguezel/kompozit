"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import {
  Check,
  CheckCircle2,
  Clock3,
  Copy,
  ExternalLink,
  Mail,
  RefreshCw,
  ShieldCheck,
  Unplug,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@ensotek/shared-ui/admin/ui/badge";
import { Button } from "@ensotek/shared-ui/admin/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@ensotek/shared-ui/admin/ui/card";
import {
  useDisconnectGoogleWorkspaceMutation,
  useLazyGoogleWorkspaceConnectUrlQuery,
  useListGoogleWorkspaceAccountsQuery,
} from "@/integrations/hooks";

const CALLBACK_URL = "https://www.karbonkompozit.com.tr/api/google-workspace/callback";

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

export default function GmailIntegrationClient() {
  const searchParams = useSearchParams();
  const accounts = useListGoogleWorkspaceAccountsQuery(undefined, { refetchOnMountOrArgChange: true });
  const account = accounts.data?.[0];
  const isConnected = account?.status === "connected";
  const [connect, connectState] = useLazyGoogleWorkspaceConnectUrlQuery();
  const [disconnect, disconnectState] = useDisconnectGoogleWorkspaceMutation();
  const [copied, setCopied] = React.useState(false);
  const callbackHandled = React.useRef(false);

  React.useEffect(() => {
    if (callbackHandled.current) return;
    if (searchParams.get("google") === "connected") {
      callbackHandled.current = true;
      toast.success("Google hesabı başarıyla bağlandı.");
      void accounts.refetch();
    }
    if (searchParams.get("google") === "error") {
      callbackHandled.current = true;
      toast.error("Google bağlantısı tamamlanamadı. OAuth callback ayarını kontrol edin.");
    }
  }, [searchParams, accounts]);

  async function beginConnect() {
    try {
      const result = await connect().unwrap();
      window.location.assign(result.url);
    } catch {
      toast.error("Google yetkilendirme ekranı açılamadı. API ayarlarını kontrol edin.");
    }
  }

  async function removeConnection() {
    if (!account || !window.confirm(`${account.email} Gmail bağlantısı kesilsin mi?`)) return;
    try {
      await disconnect(account.id).unwrap();
      toast.success("Gmail bağlantısı kesildi.");
    } catch {
      toast.error("Bağlantı kesilemedi.");
    }
  }

  async function copyCallback() {
    await navigator.clipboard.writeText(CALLBACK_URL);
    setCopied(true);
    toast.success("Callback adresi kopyalandı.");
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="admin-module-page space-y-6 pb-12">
      <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="h-1.5 bg-gradient-to-r from-[#4285f4] via-[#34a853] via-50% to-[#fbbc05]" />
        <div className="flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="grid size-12 shrink-0 place-items-center rounded-2xl border bg-background shadow-sm">
              <Mail className="size-6 text-[#ea4335]" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">İletişim &amp; CRM</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight">Gmail Entegrasyonu</h1>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                MOE Kompozit e-posta işlemleri için yönetici Google hesabını güvenli OAuth 2.0 ile bağlayın.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => accounts.refetch()} disabled={accounts.isFetching}>
              <RefreshCw className={`mr-2 size-4 ${accounts.isFetching ? "animate-spin" : ""}`} />
              Yenile
            </Button>
            {account ? (
              <>
                <Button onClick={beginConnect} disabled={connectState.isFetching}>
                  <RefreshCw className="mr-2 size-4" />
                  Yeniden bağla
                </Button>
                <Button variant="outline" onClick={removeConnection} disabled={disconnectState.isLoading}>
                  <Unplug className="mr-2 size-4" />
                  Bağlantıyı kes
                </Button>
              </>
            ) : (
              <Button onClick={beginConnect} disabled={connectState.isFetching}>
                <ExternalLink className="mr-2 size-4" />
                Google hesabını bağla
              </Button>
            )}
          </div>
        </div>
      </div>

      <div
        className={`flex flex-col gap-4 rounded-2xl border p-6 md:flex-row md:items-center md:justify-between ${
          isConnected ? "border-emerald-500/30 bg-emerald-500/5" : "border-amber-500/30 bg-amber-500/5"
        }`}
      >
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-background p-3 shadow-sm">
            {isConnected ? (
              <CheckCircle2 className="size-7 text-emerald-600" />
            ) : (
              <Unplug className="size-7 text-amber-600" />
            )}
          </div>
          <div>
            <h2 className="font-semibold text-lg">
              {isConnected ? "Google hesabı bağlı" : "Google hesabı bağlantısı gerekli"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {account
                ? `${account.display_name || account.email} · ${account.email}`
                : "Gmail özelliklerini kullanmak için Google hesabınızda izin verin."}
            </p>
          </div>
        </div>
        <Badge variant={isConnected ? "default" : "secondary"}>{isConnected ? "Bağlı" : "Bağlı değil"}</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Mail className="size-5 text-[#ea4335]" />
              Gmail yetkileri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {[
              "Gmail üzerinden e-posta gönderme",
              "Gelen e-postaları salt okunur görüntüleme",
              "Google hesap adı ve e-posta bilgisi",
            ].map((label) => (
              <div key={label} className="flex items-center gap-3">
                <span className="grid size-5 place-items-center rounded-full bg-emerald-500/10 text-emerald-600">
                  <Check className="size-3" />
                </span>
                <span>{label}</span>
              </div>
            ))}
            <p className="pt-2 text-xs text-muted-foreground">
              Yalnızca Google onay ekranında kabul ettiğiniz izinler kullanılabilir.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Clock3 className="size-5 text-primary" />
              Bağlantı ayrıntıları
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between gap-4 border-b pb-2">
              <span className="text-muted-foreground">Hesap</span>
              <span className="truncate font-medium">{account?.email || "—"}</span>
            </div>
            <div className="flex justify-between gap-4 border-b pb-2">
              <span className="text-muted-foreground">Token geçerliliği</span>
              <span className="text-right font-medium">{formatDate(account?.token_expiry)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Son güncelleme</span>
              <span className="text-right font-medium">{formatDate(account?.last_synced_at)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <ShieldCheck className="size-5 text-emerald-600" />
            Google OAuth yapılandırması
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Bu adres Google Cloud Console içindeki yetkili yönlendirme URI’leri listesinde bulunmalıdır.
          </p>
          <div className="flex flex-col gap-2 rounded-xl border bg-muted/30 p-3 sm:flex-row sm:items-center">
            <code className="min-w-0 flex-1 overflow-x-auto text-xs">{CALLBACK_URL}</code>
            <Button type="button" variant="outline" size="sm" onClick={copyCallback}>
              {copied ? <Check className="mr-2 size-4" /> : <Copy className="mr-2 size-4" />}
              {copied ? "Kopyalandı" : "Kopyala"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Erişim ve yenileme tokenları AES-256-GCM ile şifrelenir ve yalnız bağlantıyı kuran yönetici hesabına
            bağlanır.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
