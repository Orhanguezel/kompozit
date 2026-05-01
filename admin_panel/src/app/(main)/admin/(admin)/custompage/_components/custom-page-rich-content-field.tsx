// =============================================================
// FILE: src/app/(main)/admin/(admin)/custompage/_components/CustomPageRichContentField.tsx
// FINAL — Rich content wrapper (optional)
// =============================================================

"use client";

import type React from "react";

import RichContentEditor from "@/app/(main)/admin/_components/common/RichContentEditor";
import { useAdminT } from "@/app/(main)/admin/_components/common/useAdminT";

type Props = {
  value: string;
  disabled: boolean;
  onChange: (html: string) => void;
};

export const CustomPageRichContentField: React.FC<Props> = ({ value, disabled, onChange }) => {
  const t = useAdminT();

  return (
    <div className="space-y-1">
      <div className="block text-muted-foreground text-xs">{t("admin.customPage.form.richContentLabel")}</div>
      <RichContentEditor value={value} onChange={onChange} disabled={disabled} />
      <div className="text-muted-foreground text-xs">
        {t("admin.customPage.form.richContentHelperPrefix")} <code>packContent</code>{" "}
        {t("admin.customPage.form.richContentHelperMiddle")} <code>{'{"html":"..."}'}</code>{" "}
        {t("admin.customPage.form.richContentHelperSuffix")}
      </div>
    </div>
  );
};
