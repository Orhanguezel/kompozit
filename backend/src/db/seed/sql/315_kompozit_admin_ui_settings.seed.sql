-- =============================================================
-- 315_kompozit_admin_ui_settings.seed.sql
-- Admin panel: kompozit__ui_admin_config + kompozit__ui_admin_pages (tr/en/de)
-- 041_admin_settings.sql kompozit profiline dahil değil; bu kayıtlar olmadan panel 404 verir.
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES (
  UUID(),
  'kompozit__ui_admin_config',
  '*',
  '{"default_locale":"tr","theme":{"mode":"light","preset":"zinc","font":"inter"},"layout":{"sidebar_variant":"inset","sidebar_collapsible":"icon","navbar_style":"sticky","content_layout":"centered"},"branding":{"app_name":"MOE Kompozit Admin","app_copyright":"MOE Kompozit","html_lang":"tr","theme_color":"#C9A227","favicon_16":"/uploads/kompozit/brand/favicon-32.png","favicon_32":"/uploads/kompozit/brand/favicon-32.png","apple_touch_icon":"/uploads/kompozit/brand/apple-touch-icon.png","meta":{"title":"MOE Kompozit Admin","description":"İçerik ve site yönetimi","og_url":"https://karbonkompozit.com.tr/admin","og_image":"/uploads/kompozit/brand/logo-light.png"}}}',
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`);

INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES (
  UUID(),
  'kompozit__ui_admin_pages',
  'tr',
  '{"dashboard":{"title":"Özet Paneli","description":"Sistem özeti","metrics":["products","categories","offers","contacts","custom_pages","reviews","users","site_settings","menu_items","storage","gallery"]},"products":{"title":"Ürünler","description":"Ürün kataloğu"},"categories":{"title":"Kategoriler","description":"Kategori yönetimi"},"offers":{"title":"Teklifler","description":"Teklif talepleri"},"site_settings":{"title":"Site Ayarları","description":"Genel ayarlar"},"users":{"title":"Kullanıcılar","description":"Kullanıcı yönetimi"},"reviews":{"title":"Yorumlar","description":"Yorum moderasyonu"},"gallery":{"title":"Galeri","description":"Galeri yönetimi"}}',
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`);

INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES (
  UUID(),
  'kompozit__ui_admin_pages',
  'en',
  '{"dashboard":{"title":"Dashboard","description":"System overview","metrics":["products","categories","offers","contacts","custom_pages","reviews","users","site_settings","menu_items","storage","gallery"]},"products":{"title":"Products","description":"Product catalog"},"categories":{"title":"Categories","description":"Category management"},"offers":{"title":"Offers","description":"Offer requests"},"site_settings":{"title":"Site Settings","description":"General settings"},"users":{"title":"Users","description":"User management"},"reviews":{"title":"Reviews","description":"Review moderation"},"gallery":{"title":"Gallery","description":"Gallery management"}}',
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`);

INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES (
  UUID(),
  'kompozit__ui_admin_pages',
  'de',
  '{"dashboard":{"title":"Übersicht","description":"Systemübersicht","metrics":["products","categories","offers","contacts","custom_pages","reviews","users","site_settings","menu_items","storage","gallery"]},"products":{"title":"Produkte","description":"Produktkatalog"},"categories":{"title":"Kategorien","description":"Kategorieverwaltung"},"offers":{"title":"Angebote","description":"Angebotsanfragen"},"site_settings":{"title":"Einstellungen","description":"Allgemeine Einstellungen"},"users":{"title":"Benutzer","description":"Benutzerverwaltung"},"reviews":{"title":"Bewertungen","description":"Moderation"},"gallery":{"title":"Galerie","description":"Galerieverwaltung"}}',
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`);
