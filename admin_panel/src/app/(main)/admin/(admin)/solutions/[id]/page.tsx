// =============================================================
// FILE: src/app/(main)/admin/(admin)/solutions/[id]/page.tsx
// Route: /admin/solutions/:id  (id: "new" | UUID)
// =============================================================

import AdminCustomPageDetailClient from "../../custompage/admin-custom-pages-detail-client";

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

  return (
    <AdminCustomPageDetailClient
      id={p.id}
      initialModuleKey={mod}
      initialLocaleHint={typeof rawLocale === "string" ? rawLocale.trim() : ""}
      routeBasePath="/admin/solutions"
    />
  );
}
