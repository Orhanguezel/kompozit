-- =============================================================
-- FILE: 325_smtp_settings.sql
-- MOE Kompozit (karbonkompozit.com.tr) — SMTP + Admin Bildirim Ayarları
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

-- =============================================================
-- GLOBAL: SMTP (locale='*')
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES
(UUID(), 'smtp_host',       '*', 'smtp.gmail.com',                    NOW(3), NOW(3)),
(UUID(), 'smtp_port',       '*', '465',                               NOW(3), NOW(3)),
(UUID(), 'smtp_username',   '*', 'ensotek.it@gmail.com',              NOW(3), NOW(3)),
(UUID(), 'smtp_password',   '*', 'change-me-in-admin',                NOW(3), NOW(3)),
(UUID(), 'smtp_from_email', '*', 'ensotek.it@gmail.com',              NOW(3), NOW(3)),
(UUID(), 'smtp_from_name',  '*', 'MOE Kompozit',                      NOW(3), NOW(3)),
(UUID(), 'smtp_ssl',        '*', 'true',                              NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- GLOBAL: Admin bildirim alıcısı — yeni sipariş/teklif/iletişim (locale='*')
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES
(UUID(), 'admin_notification_email', '*', 'orhanguzell@gmail.com', NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);

SET FOREIGN_KEY_CHECKS = 1;
