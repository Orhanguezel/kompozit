// =============================================================
// FILE: custom-page-quality-panel.tsx
// İçerik & SEO kalite kontrol paneli (custom page editör)
// Backend: customPages/quality.ts → GET /admin/custom-pages/:id/quality
// Amaç: yayın öncesi ince içerik / eksik meta gibi indekslenme
//       riskini görünür kılmak ve somut iyileştirme önerisi vermek.
// =============================================================

"use client";

import * as React from "react";

import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  RefreshCw,
  Search,
  XCircle,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@ensotek/shared-ui/admin/ui/card";
import { Badge } from "@ensotek/shared-ui/admin/ui/badge";
import { Button } from "@ensotek/shared-ui/admin/ui/button";
import { Progress } from "@ensotek/shared-ui/admin/ui/progress";

import {
  useGetCustomPageQualityAdminQuery,
  type CustomPageQualityBreakItem,
  type CustomPageQualityScoreBlock,
} from "@/integrations/endpoints/admin/custom_pages_admin.endpoints";

function scoreVariant(score: number): "default" | "secondary" | "destructive" {
  if (score >= 75) return "default";
  if (score >= 45) return "secondary";
  return "destructive";
}

function scoreLabel(score: number): string {
  if (score >= 75) return "İyi";
  if (score >= 45) return "Orta";
  return "Zayıf";
}

function ScoreCard({
  title,
  icon,
  score,
  caption,
}: {
  title: string;
  icon: React.ReactNode;
  score: number;
  caption?: string;
}) {
  return (
    <div className="rounded-md border p-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          {icon}
          {title}
        </div>
        <Badge variant={scoreVariant(score)}>
          {score}/100 · {scoreLabel(score)}
        </Badge>
      </div>
      <Progress value={score} />
      {caption ? (
        <p className="mt-2 text-xs text-muted-foreground">{caption}</p>
      ) : null}
    </div>
  );
}

function BreakdownRow({ item }: { item: CustomPageQualityBreakItem }) {
  const Icon = item.pass ? CheckCircle2 : AlertTriangle;
  return (
    <li className="flex flex-col gap-1 border-b py-2 last:border-b-0">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm">
          <Icon
            className={`h-4 w-4 shrink-0 ${
              item.pass ? "text-emerald-600" : "text-amber-600"
            }`}
          />
          <span>{item.label}</span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {item.detail ? (
            <span className="text-xs text-muted-foreground">{item.detail}</span>
          ) : null}
          <Badge variant={item.pass ? "outline" : "secondary"}>
            {item.points}/{item.max}
          </Badge>
        </div>
      </div>
      {!item.pass && item.hint ? (
        <p className="pl-6 text-xs text-muted-foreground">{item.hint}</p>
      ) : null}
    </li>
  );
}

function Breakdown({ block }: { block: CustomPageQualityScoreBlock }) {
  return (
    <ul className="mt-1">
      {block.breakdown.map((item) => (
        <BreakdownRow key={item.key} item={item} />
      ))}
    </ul>
  );
}

export function CustomPageQualityPanel({
  pageId,
  locale,
}: {
  pageId: string;
  locale?: string;
}) {
  const { data, isLoading, isFetching, isError, refetch } =
    useGetCustomPageQualityAdminQuery(
      { id: pageId, locale },
      { skip: !pageId },
    );

  const busy = isLoading || isFetching;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
        <CardTitle className="flex items-center gap-2 text-base">
          <Search className="h-4 w-4" />
          İçerik &amp; SEO Kalitesi
        </CardTitle>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => void refetch()}
          disabled={busy}
        >
          <RefreshCw className={`h-4 w-4 ${busy ? "animate-spin" : ""}`} />
          Yenile
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {isError ? (
          <div className="flex items-center gap-2 rounded-md border border-destructive/40 p-3 text-sm text-destructive">
            <XCircle className="h-4 w-4" />
            Kalite skoru alınamadı. Sayfayı kaydedip tekrar deneyin.
          </div>
        ) : busy && !data ? (
          <p className="text-sm text-muted-foreground">Kalite skoru hesaplanıyor…</p>
        ) : !data ? (
          <p className="text-sm text-muted-foreground">
            Skoru görmek için sayfayı kaydedin.
          </p>
        ) : (
          <>
            <ScoreCard
              title="Yayına hazırlık"
              icon={<CheckCircle2 className="h-4 w-4" />}
              score={data.readiness}
              caption={
                data.status === "published"
                  ? "Sayfa yayında."
                  : "Sayfa taslak — yayınlandığında +10 puan."
              }
            />

            <div className="grid gap-4 md:grid-cols-2">
              <ScoreCard
                title="İçerik"
                icon={<FileText className="h-4 w-4" />}
                score={data.content.score}
                caption={`${data.content.wordCount} kelime · ${data.content.headings} başlık`}
              />
              <ScoreCard
                title="SEO"
                icon={<Search className="h-4 w-4" />}
                score={data.seo.score}
              />
            </div>

            <div>
              <p className="mb-1 text-sm font-medium">İçerik kontrolleri</p>
              <Breakdown block={data.content} />
            </div>

            <div>
              <p className="mb-1 text-sm font-medium">SEO kontrolleri</p>
              <Breakdown block={data.seo} />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default CustomPageQualityPanel;
