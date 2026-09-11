import type { FastifyInstance } from "fastify";
import type { RowDataPacket } from "mysql2";

import { requireAuth } from "@/common/middleware/auth";
import { requireAdmin } from "@/common/middleware/roles";
import { pool } from "@/db/client";
import { cachedGoogleUrl, inspectGoogleUrl } from "./search-console";
import { getGa4Report, getGoogleConnectionStatus, getGscReport, getGtmSummary } from "./google-reports";

type SettingRow = RowDataPacket & { key: string; value: string };
type CountRow = RowDataPacket & { value: number };
type PathRow = RowDataPacket & { path: string; views: number; visitors: number };
type DailyRow = RowDataPacket & { date: string; views: number; visitors: number };

const SETTING_KEYS = [
  "analytics_integrations",
  "ga4_property_id",
  "ga4_stream_id",
  "ga4_measurement_id",
  "gtm_container_id",
  "gsc_site_url",
  "google_ads_enabled",
  "social_channels",
] as const;

function decodeSetting(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

async function settings() {
  const [rows] = await pool.query<SettingRow[]>(
    "SELECT `key`,`value` FROM site_settings WHERE locale='*' AND `key` IN (?)",
    [SETTING_KEYS],
  );
  return Object.fromEntries(rows.map((row) => [row.key, decodeSetting(row.value)]));
}

export async function registerMarketingAdmin(app: FastifyInstance) {
  const guard = { preHandler: [requireAuth, requireAdmin] };

  app.get<{ Querystring: { days?: string } }>("/marketing/overview", guard, async (req) => {
    const requested = Number.parseInt(req.query.days || "30", 10);
    const days = Number.isFinite(requested) ? Math.min(365, Math.max(1, requested)) : 30;
    const interval = `${days} DAY`;
    const publicTraffic = "is_admin=0 AND path NOT LIKE '/api/%' AND path NOT LIKE '/admin/%'";

    const [[views], [visitors], [errors], [topPages], [daily], integrations] = await Promise.all([
      pool.query<CountRow[]>(
        `SELECT COUNT(*) value FROM audit_request_logs WHERE ${publicTraffic} AND created_at >= DATE_SUB(NOW(), INTERVAL ${interval})`,
      ),
      pool.query<CountRow[]>(
        `SELECT COUNT(DISTINCT ip) value FROM audit_request_logs WHERE ${publicTraffic} AND created_at >= DATE_SUB(NOW(), INTERVAL ${interval})`,
      ),
      pool.query<CountRow[]>(
        `SELECT COUNT(*) value FROM audit_request_logs WHERE is_admin=0 AND status_code >= 400 AND created_at >= DATE_SUB(NOW(), INTERVAL ${interval})`,
      ),
      pool.query<PathRow[]>(
        `SELECT path,COUNT(*) views,COUNT(DISTINCT ip) visitors
         FROM audit_request_logs WHERE ${publicTraffic} AND created_at >= DATE_SUB(NOW(), INTERVAL ${interval})
         GROUP BY path ORDER BY views DESC LIMIT 10`,
      ),
      pool.query<DailyRow[]>(
        `SELECT DATE_FORMAT(created_at,'%Y-%m-%d') date,COUNT(*) views,COUNT(DISTINCT ip) visitors
         FROM audit_request_logs WHERE ${publicTraffic} AND created_at >= DATE_SUB(NOW(), INTERVAL ${interval})
         GROUP BY DATE(created_at) ORDER BY DATE(created_at)`,
      ),
      settings(),
    ]);

    return {
      range_days: days,
      totals: {
        views: Number(views[0]?.value || 0),
        visitors: Number(visitors[0]?.value || 0),
        errors: Number(errors[0]?.value || 0),
      },
      top_pages: topPages,
      daily,
      integrations,
    };
  });

  app.get("/marketing/settings", guard, async () => settings());

  app.put<{ Body: Record<string, unknown> }>(
    "/marketing/settings",
    guard,
    async (req) => {
      const entries = Object.entries(req.body || {}).filter(([key]) =>
        (SETTING_KEYS as readonly string[]).includes(key),
      );
      for (const [key, value] of entries) {
        await pool.execute(
          `INSERT INTO site_settings (id,\`key\`,locale,\`value\`,created_at,updated_at)
           VALUES (UUID(),?,'*',?,NOW(3),NOW(3))
           ON DUPLICATE KEY UPDATE \`value\`=VALUES(\`value\`),updated_at=NOW(3)`,
          [key, JSON.stringify(value)],
        );
      }
      return settings();
    },
  );

  app.get<{ Querystring: { url: string } }>(
    "/marketing/url-inspection",
    guard,
    async (req) => ({
      item: await cachedGoogleUrl(req.query.url),
    }),
  );

  app.post<{ Body: { url: string } }>(
    "/marketing/url-inspection",
    guard,
    async (req) => inspectGoogleUrl(req.body.url),
  );

  app.get<{ Querystring: { days?: string } }>("/marketing/google/ga4", guard, async (req) =>
    getGa4Report(Math.min(90, Math.max(7, Number(req.query.days || 28)))),
  );
  app.get<{ Querystring: { days?: string } }>("/marketing/google/gsc", guard, async (req) =>
    getGscReport(Math.min(90, Math.max(7, Number(req.query.days || 28)))),
  );
  app.get("/marketing/google/gtm", guard, async () => getGtmSummary());
  app.get("/marketing/google/status", guard, async () => getGoogleConnectionStatus());
}
