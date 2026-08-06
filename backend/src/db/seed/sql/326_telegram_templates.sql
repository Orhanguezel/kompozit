-- =============================================================
-- FILE: 326_telegram_templates.sql
-- Telegram notification settings + templates (MOE Kompozit)
-- NOTE:
--   1) Set telegram_notifications_enabled=true to activate
--   2) Fill telegram_bot_token and telegram_default_chat_id (Admin Panel'den — seed'e gerçek
--      token/chat_id YAZILMAZ)
-- =============================================================

-- Base switches
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES
  (UUID(), 'telegram_notifications_enabled', '*', 'false', NOW(), NOW()),
  (UUID(), 'telegram_webhook_enabled', '*', 'true', NOW(), NOW()),
  (UUID(), 'telegram_bot_token', '*', '', NOW(), NOW()),
  (UUID(), 'telegram_default_chat_id', '*', '', NOW(), NOW())
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`),
  `updated_at` = NOW();

-- Event flags
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES
  (UUID(), 'telegram_event_new_catalog_request_enabled', '*', 'true', NOW(), NOW()),
  (UUID(), 'telegram_event_new_offer_request_enabled', '*', 'true', NOW(), NOW()),
  (UUID(), 'telegram_event_new_contact_enabled', '*', 'true', NOW(), NOW())
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`),
  `updated_at` = NOW();

-- Event templates
-- Supported placeholders are provided by each module's telegramNotify call.
-- {{site_name}} otomatik enjekte edilir (env.SITE_NAME) — şablonda ayrıca eklenmesi gerekir.
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES
  (
    UUID(),
    'telegram_template_new_catalog_request',
    '*',
    '🌐 {{site_name}}
📚 *Yeni Katalog Talebi*

👤 Ad Soyad: {{customer_name}}
📧 E-posta: {{customer_email}}
📱 Telefon: {{customer_phone}}
🏢 Firma: {{company_name}}
💬 Mesaj: {{message}}
📅 Tarih: {{created_at}}',
    NOW(),
    NOW()
  ),
  (
    UUID(),
    'telegram_template_new_offer_request',
    '*',
    '🌐 {{site_name}}
💰 *Yeni Teklif Talebi*

👤 Ad Soyad: {{customer_name}}
📧 E-posta: {{customer_email}}
📱 Telefon: {{customer_phone}}
🏢 Firma: {{company_name}}
🔧 Ürün/Hizmet: {{product_service}}
💬 Detay: {{message}}
📅 Tarih: {{created_at}}',
    NOW(),
    NOW()
  ),
  (
    UUID(),
    'telegram_template_new_contact',
    '*',
    '🌐 {{site_name}}
📞 *Yeni İletişim Talebi*

👤 Ad Soyad: {{customer_name}}
📧 E-posta: {{customer_email}}
📱 Telefon: {{customer_phone}}
🏢 Firma: {{company_name}}
📝 Konu: {{subject}}
💬 Mesaj: {{message}}
📅 Tarih: {{created_at}}',
    NOW(),
    NOW()
  )
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`),
  `updated_at` = NOW();
