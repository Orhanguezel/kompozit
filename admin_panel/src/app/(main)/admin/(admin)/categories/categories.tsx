// =============================================================
// FILE: src/app/(main)/admin/(admin)/categories/Categories.tsx
// Admin Categories — List + Create/Edit
// Ensotek
// =============================================================

"use client";

import { useAdminT } from "@/app/(main)/admin/_components/common/useAdminT";
import { Card, CardDescription, CardHeader, CardTitle } from "@ensotek/shared-ui/admin/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ensotek/shared-ui/admin/ui/tabs";

import CategoriesListPanel from "./_components/categories-list-panel";

export default function CategoriesPage({ moduleKey }: { moduleKey?: string }) {
  const t = useAdminT("admin.categories");

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("header.title")}</CardTitle>
          <CardDescription>{t("header.description")}</CardDescription>
        </CardHeader>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="list" className="w-full">
        <TabsList>
          <TabsTrigger value="list">{t("tabs.list")}</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <CategoriesListPanel initialModuleKey={moduleKey} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
