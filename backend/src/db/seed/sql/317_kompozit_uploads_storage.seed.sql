-- =============================================================
-- 317_kompozit_uploads_storage.seed.sql
-- uploads/kompozit altındaki dosyaları storage_assets'e ekler.
-- URL: http://localhost:8186/uploads/kompozit/<path>
-- Idempotent: ON DUPLICATE KEY UPDATE
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

INSERT INTO `storage_assets`
  (`id`, `user_id`, `name`, `bucket`, `path`, `folder`, `mime`, `size`, `width`, `height`, `url`, `provider`, `created_at`, `updated_at`)
VALUES
  -- Root images
  (UUID(), NULL, 'karbon-fiber-panel-01.jpg',       'kompozit', 'kompozit/karbon-fiber-panel-01.jpg',       'kompozit', 'image/jpeg', 203463, NULL, NULL, '/uploads/kompozit/karbon-fiber-panel-01.jpg',       'local', NOW(3), NOW(3)),
  (UUID(), NULL, 'karbon-fiber-doku-01.jpg',        'kompozit', 'kompozit/karbon-fiber-doku-01.jpg',        'kompozit', 'image/jpeg', 434437, NULL, NULL, '/uploads/kompozit/karbon-fiber-doku-01.jpg',        'local', NOW(3), NOW(3)),
  (UUID(), NULL, 'karbon-fiber-detay-01.jpg',       'kompozit', 'kompozit/karbon-fiber-detay-01.jpg',       'kompozit', 'image/jpeg', 219018, NULL, NULL, '/uploads/kompozit/karbon-fiber-detay-01.jpg',       'local', NOW(3), NOW(3)),
  (UUID(), NULL, 'karbon-fiber-hammadde-01.jpg',    'kompozit', 'kompozit/karbon-fiber-hammadde-01.jpg',    'kompozit', 'image/jpeg', 369901, NULL, NULL, '/uploads/kompozit/karbon-fiber-hammadde-01.jpg',    'local', NOW(3), NOW(3)),
  (UUID(), NULL, 'ctp-cam-elyaf-01.jpg',            'kompozit', 'kompozit/ctp-cam-elyaf-01.jpg',            'kompozit', 'image/jpeg', 273930, NULL, NULL, '/uploads/kompozit/ctp-cam-elyaf-01.jpg',            'local', NOW(3), NOW(3)),
  (UUID(), NULL, 'ctp-dokuma-hibrit-01.jpg',        'kompozit', 'kompozit/ctp-dokuma-hibrit-01.jpg',        'kompozit', 'image/jpeg', 222446, NULL, NULL, '/uploads/kompozit/ctp-dokuma-hibrit-01.jpg',        'local', NOW(3), NOW(3)),
  (UUID(), NULL, 'kompozit-fabrika-otoklav-01.jpg', 'kompozit', 'kompozit/kompozit-fabrika-otoklav-01.jpg', 'kompozit', 'image/jpeg', 438285, NULL, NULL, '/uploads/kompozit/kompozit-fabrika-otoklav-01.jpg', 'local', NOW(3), NOW(3)),
  (UUID(), NULL, 'kompozit-uretim-proses-01.jpg',   'kompozit', 'kompozit/kompozit-uretim-proses-01.jpg',   'kompozit', 'image/jpeg', 290834, NULL, NULL, '/uploads/kompozit/kompozit-uretim-proses-01.jpg',   'local', NOW(3), NOW(3)),
  -- Brand
  (UUID(), NULL, 'logo-dark.png',        'kompozit', 'kompozit/brand/logo-dark.png',        'kompozit/brand', 'image/png', 122403, 560, NULL, '/uploads/kompozit/brand/logo-dark.png',        'local', NOW(3), NOW(3)),
  (UUID(), NULL, 'logo-light.png',       'kompozit', 'kompozit/brand/logo-light.png',       'kompozit/brand', 'image/png',  99879, 560, NULL, '/uploads/kompozit/brand/logo-light.png',       'local', NOW(3), NOW(3)),
  (UUID(), NULL, 'logo.png',             'kompozit', 'kompozit/brand/logo.png',             'kompozit/brand', 'image/png', 2165020, 1536, 1024, '/uploads/kompozit/brand/logo.png',           'local', NOW(3), NOW(3)),
  (UUID(), NULL, 'favicon-32.png',       'kompozit', 'kompozit/brand/favicon-32.png',       'kompozit/brand', 'image/png',   1209, 32,  32,  '/uploads/kompozit/brand/favicon-32.png',       'local', NOW(3), NOW(3)),
  (UUID(), NULL, 'apple-touch-icon.png', 'kompozit', 'kompozit/brand/apple-touch-icon.png', 'kompozit/brand', 'image/png',  11888, 180, 180, '/uploads/kompozit/brand/apple-touch-icon.png', 'local', NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE `updated_at` = VALUES(`updated_at`);
