// =============================================================
// FILE: src/app/(main)/admin/(admin)/solutions/page.tsx
// Kompozit çözümleri — custom pages (module_key: kompozit_solutions)
// =============================================================

import AdminCustomPagesClient from "../custompage/admin-custom-pages-client";

export default function Page() {
  return (
    <AdminCustomPagesClient lockedModuleKey="kompozit_solutions" routeBasePath="/admin/solutions" />
  );
}
