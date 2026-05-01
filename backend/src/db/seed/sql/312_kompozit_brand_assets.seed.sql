-- =============================================================
-- FILE: 312_kompozit_brand_assets.seed.sql
-- MOE Kompozit — site_settings (marka URL’leri)
-- storage_assets kayıtları: 130_storage_assets.sql (uploads/kompozit/*)
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

UPDATE `site_settings`
SET
  `value` = JSON_SET(
    COALESCE(NULLIF(`value`, ''), JSON_OBJECT()),
    '$.logo_dark_url', '/uploads/kompozit/brand/logo-dark.png',
    '$.logo_light_url', '/uploads/kompozit/brand/logo-light.png',
    '$.favicon_url', '/uploads/kompozit/brand/favicon-32.png',
    '$.apple_touch_icon_url', '/uploads/kompozit/brand/apple-touch-icon.png'
  ),
  `updated_at` = NOW(3)
WHERE `key` = 'kompozit__site_logo' AND `locale` = '*';

UPDATE `site_settings`
SET
  `value` = JSON_SET(
    COALESCE(NULLIF(`value`, ''), JSON_OBJECT()),
    '$.logo_dark_url', '/uploads/kompozit/brand/logo-dark.png',
    '$.logo_light_url', '/uploads/kompozit/brand/logo-light.png',
    '$.favicon_url', '/uploads/kompozit/brand/favicon-32.png',
    '$.logo_url', '/uploads/kompozit/brand/logo-light.png'
  ),
  `updated_at` = NOW(3)
WHERE `key` = 'kompozit__logo' AND `locale` = '*';

INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES
(UUID(), 'kompozit__site_logo_light', '*', JSON_OBJECT('url', '/uploads/kompozit/brand/logo-light.png', 'alt', 'MOE Kompozit'), NOW(3), NOW(3)),
(UUID(), 'kompozit__site_logo_dark', '*', JSON_OBJECT('url', '/uploads/kompozit/brand/logo-dark.png', 'alt', 'MOE Kompozit'), NOW(3), NOW(3)),
(UUID(), 'kompozit__site_favicon', '*', JSON_OBJECT('url', '/uploads/kompozit/brand/favicon-32.png', 'alt', 'MOE Kompozit'), NOW(3), NOW(3)),
(UUID(), 'kompozit__site_apple_touch_icon', '*', JSON_OBJECT('url', '/uploads/kompozit/brand/apple-touch-icon.png', 'alt', 'MOE Kompozit'), NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`);

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;
