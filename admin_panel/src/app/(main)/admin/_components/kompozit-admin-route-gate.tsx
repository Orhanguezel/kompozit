"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@ensotek/shared-ui/admin/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ensotek/shared-ui/admin/ui/card";
import { useAdminTranslations } from "@/i18n";
import { useLocaleShort } from "@/i18n/useLocaleShort";

const ALLOWED_PREFIXES = [
  "/admin",
  "/admin/dashboard",
  "/admin/products",
  "/admin/categories",
  "/admin/subcategories",
  "/admin/gallery",
  "/admin/offer",
  "/admin/quote-requests",
  "/admin/custompage",
  "/admin/reviews",
  "/admin/site-settings",
  "/admin/contacts",
  "/admin/menuitem",
  "/admin/library",
  "/admin/references",
  "/admin/users",
  "/admin/notifications",
  "/admin/storage",
  "/admin/audit",
  "/admin/profile",
] as const;

function isAllowed(pathname: string | null): boolean {
  if (!pathname) return true;
  return ALLOWED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function KompozitAdminRouteGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const locale = useLocaleShort();
  const t = useAdminTranslations(locale);

  if (isAllowed(pathname)) {
    return <>{children}</>;
  }

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-3xl items-center justify-center">
      <Card className="w-full border-orange-200 bg-orange-50/60">
        <CardHeader>
          <CardTitle>{t("admin.kompozit.routeGate.title")}</CardTitle>
          <CardDescription>
            {t("admin.kompozit.routeGate.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/admin/dashboard">{t("admin.kompozit.routeGate.dashboard")}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/site-settings">{t("admin.kompozit.routeGate.siteSettings")}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
