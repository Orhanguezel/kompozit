"use client";

import { RefreshCw, SearchCheck } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@ensotek/shared-ui/admin/ui/badge";
import { Button } from "@ensotek/shared-ui/admin/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@ensotek/shared-ui/admin/ui/card";
import { useGetUrlInspectionQuery, useInspectUrlMutation } from "@/integrations/endpoints/admin/marketing_admin.endpoints";

export function ProductIndexStatus({ locale, slug, disabled }: { locale: string; slug: string; disabled?: boolean }) {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.karbonkompozit.com.tr").replace(/\/+$/, "");
  const url = slug ? `${base}/${locale}/products/${slug}` : "";
  const cached = useGetUrlInspectionQuery(url, { skip: !url || disabled });
  const [inspect, state] = useInspectUrlMutation();
  const status = cached.data?.item?.result.inspectionResult?.indexStatusResult;
  const passed = status?.verdict === "PASS";

  const run = async () => {
    try {
      await inspect(url).unwrap();
      toast.success("Google URL incelemesi güncellendi.");
    } catch {
      toast.error("URL incelenemedi. Search Console site adresi ve servis hesabı yetkisini kontrol edin.");
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex-row items-center justify-between gap-3">
        <CardTitle className="flex items-center gap-2 text-base"><SearchCheck className="size-4" />Google indeks durumu</CardTitle>
        <Button type="button" variant="outline" size="sm" onClick={run} disabled={!url || disabled || state.isLoading}>
          <RefreshCw className={`mr-2 size-4 ${state.isLoading ? "animate-spin" : ""}`} />Google’dan kontrol et
        </Button>
      </CardHeader>
      <CardContent>
        {!url || disabled ? <p className="text-sm text-muted-foreground">İndeks durumunu görmek için ürünü önce kaydedin.</p> : status ? (
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <Badge variant={passed ? "default" : "destructive"}>{passed ? "İndekste" : status.verdict || "Sorun var"}</Badge>
            <span>{status.coverageState || status.indexingState || "Durum bilinmiyor"}</span>
            {status.lastCrawlTime ? <span className="text-muted-foreground">Son tarama: {new Date(status.lastCrawlTime).toLocaleString("tr-TR")}</span> : null}
          </div>
        ) : <p className="text-sm text-muted-foreground">Bu URL için henüz Google incelemesi yapılmadı.</p>}
      </CardContent>
    </Card>
  );
}
