import { AlertTriangle, CheckCircle2, Search } from "lucide-react";

import { Badge } from "@ensotek/shared-ui/admin/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@ensotek/shared-ui/admin/ui/card";
import { Progress } from "@ensotek/shared-ui/admin/ui/progress";
import { scoreSeoContent, type SeoQualityInput } from "@/integrations/shared/seo-content-quality";

export function ProductSeoQuality({ value }: { value: SeoQualityInput }) {
  const result = scoreSeoContent(value);
  const label = result.score >= 80 ? "İndekslemeye hazır" : result.score >= 60 ? "Geliştirilebilir" : "Zayıf";
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between gap-3 text-base">
          <span className="flex items-center gap-2"><Search className="size-4" />SEO & indekslenme puanı</span>
          <Badge variant={result.score < 60 ? "destructive" : result.score < 80 ? "secondary" : "default"}>
            {result.score}/100 · {label}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={result.score} />
        <p className="text-xs text-muted-foreground">{result.wordCount} kelime. Puan, kayıt öncesinde formdaki güncel içeriğe göre hesaplanır.</p>
        <div className="grid gap-2 md:grid-cols-2">
          {result.checks.map((check) => {
            const Icon = check.passed ? CheckCircle2 : AlertTriangle;
            return (
              <div key={check.label} className="flex items-start gap-2 rounded-md border p-3 text-sm">
                <Icon className={`mt-0.5 size-4 shrink-0 ${check.passed ? "text-emerald-600" : "text-amber-600"}`} />
                <div><div className="font-medium">{check.label} <span className="text-muted-foreground">+{check.points}</span></div>{!check.passed ? <div className="mt-1 text-xs text-muted-foreground">{check.hint}</div> : null}</div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
