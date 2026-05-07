"use client";

import * as React from "react";

import { Badge } from "@ensotek/shared-ui/admin/ui/badge";
import { Button } from "@ensotek/shared-ui/admin/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ensotek/shared-ui/admin/ui/card";
import { Textarea } from "@ensotek/shared-ui/admin/ui/textarea";
import { Bot, RotateCcw, Save } from "lucide-react";
import { toast } from "sonner";

import { useAdminTranslations } from "@/i18n";
import { useGetSiteSettingAdminByKeyQuery, useUpdateSiteSettingAdminMutation } from "@/integrations/hooks";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

export type LlmsTxtTabProps = {
  settingPrefix?: string;
};

function extractText(raw: unknown): string {
  if (typeof raw === "string") return raw;
  if (raw && typeof raw === "object") {
    const val = (raw as any).value;
    if (typeof val === "string") return val;
  }
  return "";
}

export const LlmsTxtTab: React.FC<LlmsTxtTabProps> = ({ settingPrefix }) => {
  const adminLocale = usePreferencesStore((s) => s.adminLocale);
  const t = useAdminTranslations(adminLocale || undefined);
  const fullKey = `${settingPrefix || ""}llms_txt`;

  const { data, isLoading, isFetching, refetch } = useGetSiteSettingAdminByKeyQuery(
    { key: fullKey, locale: "*" },
    { refetchOnMountOrArgChange: true },
  );

  const [updateSetting, { isLoading: isSaving }] = useUpdateSiteSettingAdminMutation();
  const busy = isLoading || isFetching || isSaving;

  const serverText = React.useMemo(() => extractText(data), [data]);
  const [localText, setLocalText] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (data !== undefined) setLocalText(extractText(data));
  }, [data]);

  const text = localText ?? serverText;
  const isDirty = localText !== null && localText !== serverText;

  const handleSave = async () => {
    if (localText === null) return;
    try {
      await updateSetting({ key: fullKey, locale: "*", value: localText as any }).unwrap();
      toast.success("llms.txt kaydedildi");
      await refetch();
    } catch (err: any) {
      toast.error(err?.data?.error?.message || "Kayıt hatası");
    }
  };

  const handleReset = () => {
    setLocalText(serverText);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-base">
              <Bot className="size-4" />
              llms.txt
            </CardTitle>
            <CardDescription>
              AI sistemlerin siteyi anlaması için kullanılan <code className="text-xs">/llms.txt</code> içeriğini buradan düzenleyin.
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {isDirty && (
              <Badge variant="outline" className="animate-pulse border-amber-500/40 bg-amber-500/10 text-amber-600">
                Kaydedilmedi
              </Badge>
            )}
            <Button type="button" variant="outline" size="sm" onClick={handleReset} disabled={busy || !isDirty}>
              <RotateCcw className="mr-2 size-4" />
              Geri Al
            </Button>
            <Button type="button" size="sm" onClick={handleSave} disabled={busy || !isDirty}>
              <Save className="mr-2 size-4" />
              Kaydet
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {busy && localText === null && (
          <div className="flex justify-center py-6">
            <Badge variant="secondary" className="animate-pulse">Yükleniyor...</Badge>
          </div>
        )}

        <Textarea
          value={text}
          onChange={(e) => setLocalText(e.target.value)}
          disabled={busy}
          rows={28}
          className="font-mono text-xs"
          placeholder="# Site Adı&#10;&#10;&gt; Açıklama&#10;&#10;Site: https://..."
        />

        <p className="text-muted-foreground text-xs">
          Bu içerik <code>/llms.txt</code> adresinde yayınlanır. Değişiklikler 24 saat içinde önbellekten temizlenir.
        </p>

        {isDirty && (
          <div className="flex justify-end border-t pt-4">
            <Button type="button" onClick={handleSave} disabled={busy}>
              <Save className="mr-2 size-4" />
              Kaydet
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
