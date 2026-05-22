import type { FastifyInstance } from 'fastify';

import { registerContentReactions } from '@/modules/contentReactions/router';
import { registerDashboardAdmin } from '@/modules/dashboard/admin.routes';

export async function registerProjectPublic(api: FastifyInstance) {
  await registerContentReactions(api);
}

export async function registerProjectAdmin(adminApi: FastifyInstance) {
  for (const reg of [
    registerDashboardAdmin,
  ]) {
    await adminApi.register(reg);
  }
}
