// ===================================================================
// FILE: src/modules/dashboard/admin.controller.ts
// Ensotek – Admin Dashboard Summary Controller
// ===================================================================

import type { RouteHandler } from "fastify";
import { db } from "@/db/client";
import { sql } from "drizzle-orm";

// Aşağıdaki import'larda tablo isimlerini proje şemanla eşleştir:
// İsimler %99 bunlara çok yakın; farklıysa sadece import satırlarını düzeltmen yeterli.
// Lokal şemalar (routes/project.ts üzerinden sunulan veya farklı şema)
import { products } from "@/modules/products/schema";
import { storageAssets } from '@/modules/storage/schema';
import { referencesTable } from '@/modules/references/schema';
import { galleries } from '@/modules/gallery/schema';
import { menuItems } from "@/modules/menuItems/schema";
import { reviews } from "@/modules/review/schema";
import { offersTable } from '@/modules/offer/schema';

// Shared-backend şemaları
import { categories } from "@ensotek/shared-backend/modules/categories/schema";
import { subCategories } from "@ensotek/shared-backend/modules/subcategories/schema";
import { contact_messages } from "@ensotek/shared-backend/modules/contact/schema";
import { siteSettings } from "@ensotek/shared-backend/modules/siteSettings/schema";
import { customPages } from "@ensotek/shared-backend/modules/customPages/schema";
import { library } from "@ensotek/shared-backend/modules/library/schema";
import { users } from "@ensotek/shared-backend/modules/auth/schema";

type DashboardCountItem = {
  key: string;
  label: string;
  count: number;
};

// Generic COUNT(*) helper — uses .then/.catch to avoid Bun+Drizzle thenable await issue
function getCountSafe(table: any, log?: { warn: (o: unknown, m: string) => void }): Promise<number> {
  return new Promise((resolve) => {
    db.select({ c: sql<number>`COUNT(*)` })
      .from(table)
      .limit(1)
      .then((rows: any[]) => resolve(Number(rows[0]?.c ?? 0)))
      .catch((err: unknown) => {
        log?.warn?.({ err }, "dashboard_count_skip");
        resolve(0);
      });
  });
}

/**
 * GET /admin/dashboard/summary
 * Global içerik özetini döndürür.
 */
export const getDashboardSummaryAdmin: RouteHandler = async (req, reply) => {
  try {
    // Tanımlar: ICON_MAP ile uyumlu key'ler
    const defs: { key: string; label: string; table: any }[] = [
      { key: "products", label: "Ürünler", table: products },
      { key: "categories", label: "Kategoriler", table: categories },
      { key: "subcategories", label: "Alt Kategoriler", table: subCategories },
      { key: "contacts", label: "İletişim Mesajları", table: contact_messages },
      { key: "site_settings", label: "Site Ayarları", table: siteSettings },
      { key: "custom_pages", label: "Özel Sayfalar", table: customPages },
      { key: "menu_items", label: "Menü Öğeleri", table: menuItems },
      { key: "library", label: "Kütüphane / Library", table: library },
      { key: "reviews", label: "Yorumlar", table: reviews },
      { key: "users", label: "Kullanıcılar", table: users },
      { key: "offers", label: "Teklifler", table: offersTable },
      { key: "storage", label: "Depolama Öğeleri", table: storageAssets },
      { key: "references", label: "Referanslar", table: referencesTable },
      { key: "gallery", label: "Galeri", table: galleries },
    ];

    const settled = await Promise.allSettled(
      defs.map((d) => getCountSafe(d.table, req.log)),
    );
    const counts = settled.map((r) => (r.status === "fulfilled" ? r.value : 0));

    const items: DashboardCountItem[] = defs.map((d, idx) => ({
      key: d.key,
      label: d.label,
      count: counts[idx] ?? 0,
    }));

    return reply.send({ items });
  } catch (err) {
    req.log.error({ err }, "dashboard_summary_failed");
    return reply
      .code(500)
      .send({ error: { message: "dashboard_summary_failed" } });
  }
};
