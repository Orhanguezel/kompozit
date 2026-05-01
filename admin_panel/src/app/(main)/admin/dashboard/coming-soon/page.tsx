"use client";

// src/app/(main)/dashboard/coming-soon/page.tsx

import { useAdminTranslations } from "@/i18n";
import { useLocaleShort } from "@/i18n/useLocaleShort";

export default function Page() {
  const locale = useLocaleShort();
  const t = useAdminTranslations(locale);

  return (
    <div className="flex h-full flex-col items-center justify-center space-y-2 text-center">
      <h1 className="font-semibold text-2xl">{t("admin.kompozit.comingSoon.title")}</h1>
      <p className="text-muted-foreground">
        {t("admin.kompozit.comingSoon.description")}
      </p>
    </div>
  );
}
