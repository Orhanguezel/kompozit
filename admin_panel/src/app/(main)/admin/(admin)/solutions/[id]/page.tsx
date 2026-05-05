// =============================================================
// FILE: src/app/(main)/admin/(admin)/solutions/[id]/page.tsx
// Route: /admin/solutions/:id  (id: "new" | UUID)
// =============================================================

import AdminCustomPageDetailClient from "../../custompage/admin-custom-pages-detail-client";
import { redirect } from "next/navigation";

type Params = { id: string };
type SearchParams =
  | Promise<{ module?: string | string[]; locale?: string | string[] }>
  | { module?: string | string[]; locale?: string | string[] };

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<Params> | Params;
  searchParams?: SearchParams;
}) {
  const p = (await params) as Params;
  const s = (await searchParams) ?? {};
  const rawModule = Array.isArray(s.module) ? s.module[0] : s.module;
  const rawLocale = Array.isArray(s.locale) ? s.locale[0] : s.locale;
  const mod =
    typeof rawModule === "string" && rawModule.trim() ? rawModule.trim() : "kompozit_solutions";
  const legacyIds: Record<string, string> = {
    "bs010001-7001-4001-9001-ssssssss0001": "b5010001-7001-4001-9001-555555550001",
    "bs010002-7002-4002-9002-ssssssss0002": "b5010002-7002-4002-9002-555555550002",
    "bs010003-7003-4003-9003-ssssssss0003": "b5010003-7003-4003-9003-555555550003",
    "bs010004-7004-4004-9004-ssssssss0004": "b5010004-7004-4004-9004-555555550004",
  };
  const nextId = legacyIds[p.id];
  if (nextId) {
    const localeQs =
      typeof rawLocale === "string" && rawLocale.trim()
        ? `?locale=${encodeURIComponent(rawLocale.trim())}`
        : "";
    const moduleQs = mod ? `${localeQs ? "&" : "?"}module=${encodeURIComponent(mod)}` : "";
    redirect(`/admin/solutions/${nextId}${localeQs}${moduleQs}`);
  }

  return (
    <AdminCustomPageDetailClient
      id={p.id}
      initialModuleKey={mod}
      initialLocaleHint={typeof rawLocale === "string" ? rawLocale.trim() : ""}
      routeBasePath="/admin/solutions"
    />
  );
}
