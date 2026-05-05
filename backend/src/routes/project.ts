import type { FastifyInstance } from 'fastify';

// Kompozit'e özgü modüller — shared-backend'de karşılığı olmayan

import { registerContentReactions } from '@/modules/contentReactions/router';
import { registerFooterSections } from '@/modules/footerSections/router';
import { registerFooterSectionsAdmin } from '@/modules/footerSections/admin.routes';
import { registerMenuItems } from '@/modules/menuItems/router';
import { registerMenuItemsAdmin } from '@/modules/menuItems/admin.routes';
import { registerOffer } from '@/modules/offer/router';
import { registerOfferAdmin } from '@/modules/offer/admin.routes';
import { registerReviews } from '@/modules/review/router';
import { registerReviewsAdmin } from '@/modules/review/admin.routes';
import { registerDashboardAdmin } from '@/modules/dashboard/admin.routes';

export async function registerProjectPublic(api: FastifyInstance) {
  await registerContentReactions(api);
  await registerFooterSections(api);
  await registerMenuItems(api);
  await registerOffer(api);
  await registerReviews(api);
}

export async function registerProjectAdmin(adminApi: FastifyInstance) {
  for (const reg of [
    registerDashboardAdmin,
    registerFooterSectionsAdmin,
    registerMenuItemsAdmin,
    registerOfferAdmin,
    registerReviewsAdmin,
  ]) {
    await adminApi.register(reg);
  }
}
