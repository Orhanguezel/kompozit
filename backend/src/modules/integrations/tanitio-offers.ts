import { createHash, timingSafeEqual } from 'node:crypto';
import type { FastifyInstance } from 'fastify';
import { pool } from '../../db/client';

type Query = (sql: string, values?: unknown[]) => Promise<Record<string, unknown>[]>;

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
      "SELECT id,status,locale,created_at,updated_at FROM offers WHERE source='kompozit' ORDER BY created_at,id LIMIT ? OFFSET ?",
      [limit, offset],
    );
    const timestamp = (value: Date | string) => value instanceof Date ? value.toISOString() : new Date(`${String(value).replace(' ', 'T')}Z`).toISOString();
    const items = rows.map(row => ({
      id: String(row.id), status: String(row.status), locale: String(row.locale || 'tr'),
      createdAt: timestamp(row.created_at as Date | string), updatedAt: timestamp(row.updated_at as Date | string),
    }));
    const total = Number(count[0]?.total ?? 0);
    return { contract: 'moe-offers@1', items, total, limit, offset, hasMore: offset + items.length < total };
  });
}
