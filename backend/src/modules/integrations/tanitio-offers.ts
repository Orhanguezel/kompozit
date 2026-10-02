import { createHash, timingSafeEqual } from 'node:crypto';
import type { FastifyInstance } from 'fastify';
import { pool } from '../../db/client';

type Query = (sql: string, values?: unknown[]) => Promise<Record<string, unknown>[]>;
const UTM = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;
const CLICK = ['gclid', 'gbraid', 'wbraid'] as const;

function attribution(formData: unknown) {
  let form: Record<string, any> = {};
  try { form = typeof formData === 'string' ? JSON.parse(formData) : formData as Record<string, any>; } catch { /* Invalid legacy JSON: no attribution. */ }
  const analytics = form?.attribution?.analytics_consent === true ? form.attribution : null;
  const utm: Record<string, string> = {};
  for (const key of UTM) {
    const value = typeof analytics?.[key] === 'string' ? analytics[key].trim() : '';
    if (value && value.length <= 160 && !/@|\b\d{7,}\b/.test(value)) utm[key] = value;
  }
  const ads = form?.ad_attribution?.consent === true && form?.ad_attribution?.consentVersion === 'ensotek.analytics-consent.v1' && form?.ad_attribution?.formConsentVersion === 'moe-offer-ads-v1' ? form.ad_attribution : null;
  const adClick: Record<string, string | boolean> | null = ads ? { consent: true } : null;
  for (const key of CLICK) {
    const value = typeof ads?.[key] === 'string' ? ads[key].trim() : '';
    if (adClick && /^[A-Za-z0-9._~-]{6,500}$/.test(value)) adClick[key] = value;
  }
  return { utm: Object.keys(utm).length ? utm : null, adClick: adClick && Object.keys(adClick).length > 1 ? adClick : null };
}

/** Private, read-only MOE quote ledger for Tanitio. Never expose contact details or quote value. */
export async function registerTanitioOffers(app: FastifyInstance, options: {
  apiKey?: () => string | undefined;
  query?: Query;
} = {}) {
  const apiKey = options.apiKey ?? (() => process.env.TANITIO_CONTENT_API_KEY);
  const query: Query = options.query ?? (async (sql, values = []) => {
    const [rows] = await pool.query<any[]>(sql, values);
    return rows;
  });
  app.get('/api/integrations/tanitio/offers', { config: { public: true } }, async (req, reply) => {
    reply.header('Cache-Control', 'private, no-store');
    const expected = apiKey();
    const token = req.headers.authorization?.match(/^Bearer (\S+)$/)?.[1] ?? '';
    if (!expected) return reply.code(503).send({ error: { code: 'NOT_CONFIGURED' } });
    const digest = (value: string) => createHash('sha256').update(value).digest();
    if (!token || !timingSafeEqual(digest(token), digest(expected))) {
      return reply.code(401).send({ error: { code: 'UNAUTHORIZED' } });
    }

    const params = req.query as { limit?: string; offset?: string };
    const limit = Number(params.limit ?? 60);
    const offset = Number(params.offset ?? 0);
    if (!Number.isInteger(limit) || limit < 1 || limit > 60 || !Number.isInteger(offset) || offset < 0 || offset > 100000) {
      return reply.code(400).send({ error: { code: 'INVALID_QUERY' } });
    }
    const count = await query("SELECT COUNT(*) total FROM offers WHERE source='kompozit'");
    const rows = await query(
      "SELECT id,status,locale,created_at,updated_at,form_data FROM offers WHERE source='kompozit' ORDER BY created_at,id LIMIT ? OFFSET ?",
      [limit, offset],
    );
    const timestamp = (value: Date | string) => value instanceof Date ? value.toISOString() : new Date(`${String(value).replace(' ', 'T')}Z`).toISOString();
    const items = rows.map(row => ({
      id: String(row.id), status: String(row.status), locale: String(row.locale || 'tr'),
      createdAt: timestamp(row.created_at as Date | string), updatedAt: timestamp(row.updated_at as Date | string),
      ...attribution(row.form_data),
    }));
    const total = Number(count[0]?.total ?? 0);
    return { contract: 'moe-offers@1', items, total, limit, offset, hasMore: offset + items.length < total };
  });
}
