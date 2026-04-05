import type { FastifyInstance } from 'fastify';

// Kimlik doğrulama & kullanıcı yönetimi
import { registerAuth, registerUserAdmin } from '@agro/shared-backend/modules/auth';

// Dosya depolama
import { registerStorage, registerStorageAdmin } from '@agro/shared-backend/modules/storage';

// Kullanıcı profilleri
import { registerProfiles } from '@agro/shared-backend/modules/profiles';

// Site ayarları
import { registerSiteSettings, registerSiteSettingsAdmin } from '@agro/shared-backend/modules/siteSettings';

// Rol yönetimi
import { registerUserRoles } from '@agro/shared-backend/modules/userRoles';

// Health check
import { registerHealth } from '@agro/shared-backend/modules/health';

// Bildirimler
import { registerNotifications } from '@agro/shared-backend/modules/notifications';

// Audit log
import { registerAudit, registerAuditAdmin, registerAuditStream } from '@agro/shared-backend/modules/audit';

// İletişim formu
import { registerContacts, registerContactsAdmin } from '@agro/shared-backend/modules/contact';

// CMS sayfaları
import { registerCustomPages, registerCustomPagesAdmin } from '@agro/shared-backend/modules/customPages';

// Kategoriler & alt kategoriler
import { registerCategories } from '@agro/shared-backend/modules/categories/router';
import { registerCategoriesAdmin } from '@agro/shared-backend/modules/categories/admin.routes';
import { registerSubCategories } from '@agro/shared-backend/modules/subcategories/router';
import { registerSubCategoriesAdmin } from '@agro/shared-backend/modules/subcategories/admin.routes';

// Tema
import { registerTheme, registerThemeAdmin } from '@agro/shared-backend/modules/theme';

// Telegram entegrasyonu
import { registerTelegram, registerTelegramAdmin } from '@agro/shared-backend/modules/telegram';

// Email şablonları (sadece admin)
import { registerEmailTemplatesAdmin } from '@agro/shared-backend/modules/emailTemplates/admin.routes';

// Ürünler (item_type: 'kompozit' filtresi route'larda uygulanır)
import { registerProducts } from '@agro/shared-backend/modules/products/router';
import { registerProductsAdmin } from '@agro/shared-backend/modules/products/admin.routes';

// Galeri
import { registerGallery } from '@agro/shared-backend/modules/gallery/router';
import { registerGalleryAdmin } from '@agro/shared-backend/modules/gallery/admin.routes';

// Referanslar
import { registerReferences } from '@agro/shared-backend/modules/references/router';
import { registerReferencesAdmin } from '@agro/shared-backend/modules/references/admin.routes';

// Kütüphane (dokümanlar)
import { registerLibrary } from '@agro/shared-backend/modules/library/router';
import { registerLibraryAdmin } from '@agro/shared-backend/modules/library/admin.routes';

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

  const { aiContentAssist } = await import('@agro/shared-backend/modules/ai/content');
  adminApi.post('/ai/content', aiContentAssist);
}
