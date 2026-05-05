import type { FastifyInstance } from 'fastify';
import { createDbAdminRoutes, type ModuleMap } from '@ensotek/shared-backend/modules/db_admin';

// Kimlik doğrulama & kullanıcı yönetimi
import { registerAuth, registerUserAdmin } from '@ensotek/shared-backend/modules/auth';

// Dosya depolama
import { registerStorage, registerStorageAdmin } from '@ensotek/shared-backend/modules/storage';

// Kullanıcı profilleri
import { registerProfiles } from '@ensotek/shared-backend/modules/profiles';

// Site ayarları
import { registerSiteSettings, registerSiteSettingsAdmin } from '@ensotek/shared-backend/modules/siteSettings';

// Rol yönetimi
import { registerUserRoles } from '@ensotek/shared-backend/modules/userRoles';

// Bildirimler
import { registerNotifications } from '@ensotek/shared-backend/modules/notifications';

// Audit log
import { registerAudit, registerAuditAdmin, registerAuditStream } from '@ensotek/shared-backend/modules/audit';

// İletişim formu
import { registerContacts, registerContactsAdmin } from '@ensotek/shared-backend/modules/contact';

// CMS sayfaları
import { registerCustomPages, registerCustomPagesAdmin } from '@ensotek/shared-backend/modules/customPages';

// Kategoriler & alt kategoriler
import { registerCategories } from '@ensotek/shared-backend/modules/categories/router';
import { registerCategoriesAdmin } from '@ensotek/shared-backend/modules/categories/admin.routes';
import { registerSubCategories } from '@ensotek/shared-backend/modules/subcategories/router';
import { registerSubCategoriesAdmin } from '@ensotek/shared-backend/modules/subcategories/admin.routes';

// Tema
import { registerTheme, registerThemeAdmin } from '@ensotek/shared-backend/modules/theme';

// Telegram entegrasyonu
import { registerTelegram, registerTelegramAdmin } from '@ensotek/shared-backend/modules/telegram';

// Email şablonları (sadece admin)
import { registerEmailTemplatesAdmin } from '@ensotek/shared-backend/modules/emailTemplates/admin.routes';

// Ürünler (item_type: 'kompozit' filtresi route'larda uygulanır)
import { registerProducts } from '@ensotek/shared-backend/modules/products/router';
import { registerProductsAdmin } from '@ensotek/shared-backend/modules/products/admin.routes';

// Galeri
import { registerGallery } from '@ensotek/shared-backend/modules/gallery/router';
import { registerGalleryAdmin } from '@ensotek/shared-backend/modules/gallery/admin.routes';

// Referanslar
import { registerReferences } from '@ensotek/shared-backend/modules/references/router';
import { registerReferencesAdmin } from '@ensotek/shared-backend/modules/references/admin.routes';

// Kütüphane (dokümanlar)
import { registerLibrary } from '@ensotek/shared-backend/modules/library/router';
import { registerLibraryAdmin } from '@ensotek/shared-backend/modules/library/admin.routes';

const dbAdminModules = {
  site_settings: {
    tablesInOrder: ['site_settings'],
  },
  users: {
    tablesInOrder: ['users', 'profiles', 'user_roles'],
    truncateInOrder: ['profiles', 'user_roles', 'users'],
  },
  categories: {
    tablesInOrder: ['categories', 'category_i18n'],
    truncateInOrder: ['category_i18n', 'categories'],
  },
  subcategories: {
    tablesInOrder: ['sub_categories', 'sub_category_i18n'],
    truncateInOrder: ['sub_category_i18n', 'sub_categories'],
  },
  products: {
    tablesInOrder: ['products', 'product_i18n'],
    truncateInOrder: ['product_i18n', 'products'],
  },
  custom_pages: {
    tablesInOrder: ['custom_pages', 'custom_pages_i18n'],
    truncateInOrder: ['custom_pages_i18n', 'custom_pages'],
  },
  menu_items: {
    tablesInOrder: ['menu_items', 'menu_items_i18n'],
    truncateInOrder: ['menu_items_i18n', 'menu_items'],
  },
  footer_sections: {
    tablesInOrder: ['footer_sections', 'footer_sections_i18n'],
    truncateInOrder: ['footer_sections_i18n', 'footer_sections'],
  },
  gallery: {
    tablesInOrder: ['galleries', 'gallery_i18n', 'gallery_images', 'gallery_image_i18n'],
    truncateInOrder: ['gallery_image_i18n', 'gallery_images', 'gallery_i18n', 'galleries'],
  },
  offers: {
    tablesInOrder: ['offer_number_counters', 'offers'],
    truncateInOrder: ['offers', 'offer_number_counters'],
  },
  reviews: {
    tablesInOrder: ['reviews', 'review_i18n'],
    truncateInOrder: ['review_i18n', 'reviews'],
  },
  storage: {
    tablesInOrder: ['storage_assets'],
  },
  notifications: {
    tablesInOrder: ['notifications'],
  },
  audit: {
    tablesInOrder: ['audit_request_logs', 'audit_auth_events', 'audit_events'],
  },
  content_reactions: {
    tablesInOrder: ['content_reaction_totals'],
  },
} satisfies ModuleMap;

export async function registerSharedPublic(api: FastifyInstance) {
  await registerAuth(api);
  api.get('/health', async () => {
    const db = (api as any).db;
    const [rows] = await db.query('SELECT 1 AS ok');
    const dbOk = Array.isArray(rows) && rows[0]?.ok === 1;

    return {
      status: dbOk ? 'ok' : 'error',
      db: dbOk ? 'ok' : 'error',
      redis: 'disabled',
      uptime: process.uptime(),
    };
  });
  await registerStorage(api);
  await registerProfiles(api);
  await registerSiteSettings(api);
  await registerUserRoles(api);
  await registerNotifications(api);
  await registerAudit(api);
  await registerContacts(api);
  await registerCustomPages(api);
  await registerCategories(api);
  await registerSubCategories(api);
  await registerTheme(api);
  await registerTelegram(api);
  await registerProducts(api);
  await registerGallery(api);
  await registerReferences(api);
  await registerLibrary(api);
}

export async function registerSharedAdmin(adminApi: FastifyInstance) {
  for (const reg of [
    registerSiteSettingsAdmin,
    registerUserAdmin,
    registerStorageAdmin,
    registerContactsAdmin,
    registerCustomPagesAdmin,
    registerCategoriesAdmin,
    registerSubCategoriesAdmin,
    registerThemeAdmin,
    registerEmailTemplatesAdmin,
    registerAuditAdmin,
    registerAuditStream,
    registerTelegramAdmin,
    registerProductsAdmin,
    registerGalleryAdmin,
    registerReferencesAdmin,
    registerLibraryAdmin,
    createDbAdminRoutes(dbAdminModules),
  ]) {
    await adminApi.register(reg);
  }

  const { aiContentAssist } = await import('@ensotek/shared-backend/modules/ai/content');
  adminApi.post('/ai/content', aiContentAssist);
}
