import { test } from 'node:test';
import assert from 'node:assert/strict';
import Fastify from 'fastify';
import { registerTanitioOffers } from './tanitio-offers';

test('MOE offer feed is private and returns only non-personal reconciliation fields', async () => {
  const app = Fastify();
  const queries: string[] = [];
  await registerTanitioOffers(app, {
    apiKey: () => 'secret',
    query: async sql => {
      queries.push(sql);
      if (sql.includes('COUNT')) return [{ total: 1 }];
      return [{ id: '0d42f3ab-3275-406a-81ce-14db8e70b161', status: 'new', locale: 'tr',
        created_at: '2026-09-09 14:16:53.635', updated_at: '2026-09-09 14:16:53.635',
        customer_name: 'must never leave the site', email: 'private@example.com' }];
    },
  });
  const path = '/api/integrations/tanitio/offers';
  assert.equal((await app.inject(path)).statusCode, 401);
  assert.equal((await app.inject({ url: path, headers: { authorization: 'Bearer wrong' } })).statusCode, 401);
  assert.equal(queries.length, 0);
  const headers = { authorization: 'Bearer secret' };
  assert.equal((await app.inject({ url: `${path}?limit=61`, headers })).statusCode, 400);
  const response = await app.inject({ url: path, headers });
  assert.equal(response.statusCode, 200, response.body);
  assert.equal(response.headers['cache-control'], 'private, no-store');
  assert.deepEqual(Object.keys(response.json().items[0]).sort(), ['createdAt', 'id', 'locale', 'status', 'updatedAt']);
  assert.equal(response.json().items[0].createdAt, '2026-09-09T14:16:53.635Z');
  assert.ok(queries.every(sql => sql.includes("source='kompozit'")));
  await app.close();
});
