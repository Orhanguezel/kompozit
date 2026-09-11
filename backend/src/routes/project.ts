import type { FastifyInstance } from 'fastify';

import { registerContentReactions } from '@/modules/contentReactions/router';
import { registerDashboardAdmin } from '@/modules/dashboard/admin.routes';
import { registerMarketingAdmin } from '@/modules/marketing/admin.routes';
import {
  registerGoogleWorkspaceAdmin,
  registerGoogleWorkspacePublic,
} from '@/modules/google-workspace/routes';
import { registerSocialChannelsAdmin } from '@/modules/social-channels/admin.routes';

export async function registerProjectPublic(api: FastifyInstance) {
  await registerContentReactions(api);
  await registerGoogleWorkspacePublic(api);
}

export async function registerProjectAdmin(adminApi: FastifyInstance) {
  for (const reg of [
    registerDashboardAdmin,
    registerMarketingAdmin,
    registerGoogleWorkspaceAdmin,
    registerSocialChannelsAdmin,
  ]) {
    await adminApi.register(reg);
  }
}
