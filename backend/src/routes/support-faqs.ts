import type { FastifyInstance } from 'fastify';
import {
  adminCreateFaq,
  adminDeleteFaq,
  adminGetFaq,
  adminListFaqs,
  adminUpdateFaq,
} from '@ensotek/shared-backend/modules/support/admin.controller';

/**
 * Kompozit sitesinde eski /admin/faqs modülü hiç yoktu. ERP köprüsü için yalnız
 * SSS CRUD yüzeyini açar; ticket veya /db uçlarını genişletmez.
 */
export async function registerSupportFaqsAdmin(app: FastifyInstance) {
  const base = '/support/faqs';
  app.get(base, adminListFaqs);
  app.get(`${base}/:id`, adminGetFaq);
  app.post(base, adminCreateFaq);
  app.patch(`${base}/:id`, adminUpdateFaq);
  app.delete(`${base}/:id`, adminDeleteFaq);
}
