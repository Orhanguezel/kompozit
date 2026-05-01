import type { FastifyInstance } from 'fastify';

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

// Health check
import { registerHealth } from '@ensotek/shared-backend/modules/health';

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

export async function registerSharedPublic(api: FastifyInstance) {
  await registerAuth(api);
  await registerHealth(api);
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
  ]) {
    await adminApi.register(reg);
  }

  const { aiContentAssist } = await import('@ensotek/shared-backend/modules/ai/content');
  adminApi.post('/ai/content', aiContentAssist);
}
