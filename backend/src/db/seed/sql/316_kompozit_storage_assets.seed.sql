-- =============================================================
-- 316_kompozit_storage_assets.seed.sql
-- uploads/media/kompozit altındaki dosyaları storage_assets'e ekler.
-- URL: http://localhost:8186/media/kompozit/<path>
-- Idempotent: ON DUPLICATE KEY UPDATE
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- ----------------------------------------------------------------
-- 1. storage_assets: uploads/media/kompozit/ files
-- ----------------------------------------------------------------

INSERT INTO `storage_assets` (`id`, `user_id`, `name`, `bucket`, `path`, `folder`, `mime`, `size`, `width`, `height`, `url`, `provider`, `created_at`, `updated_at`)
VALUES
  (UUID(), NULL, 'karbon-fiber-panel-01.jpg',       'kompozit', 'media/kompozit/karbon-fiber-panel-01.jpg',       'media/kompozit', 'image/jpeg', 203463, NULL, NULL, '/media/kompozit/karbon-fiber-panel-01.jpg',       'local', NOW(3), NOW(3)),
  (UUID(), NULL, 'karbon-fiber-doku-01.jpg',        'kompozit', 'media/kompozit/karbon-fiber-doku-01.jpg',        'media/kompozit', 'image/jpeg', 434437, NULL, NULL, '/media/kompozit/karbon-fiber-doku-01.jpg',        'local', NOW(3), NOW(3)),
  (UUID(), NULL, 'karbon-fiber-detay-01.jpg',       'kompozit', 'media/kompozit/karbon-fiber-detay-01.jpg',       'media/kompozit', 'image/jpeg', 219018, NULL, NULL, '/media/kompozit/karbon-fiber-detay-01.jpg',       'local', NOW(3), NOW(3)),
  (UUID(), NULL, 'karbon-fiber-hammadde-01.jpg',    'kompozit', 'media/kompozit/karbon-fiber-hammadde-01.jpg',    'media/kompozit', 'image/jpeg', 369901, NULL, NULL, '/media/kompozit/karbon-fiber-hammadde-01.jpg',    'local', NOW(3), NOW(3)),
  (UUID(), NULL, 'ctp-cam-elyaf-01.jpg',            'kompozit', 'media/kompozit/ctp-cam-elyaf-01.jpg',            'media/kompozit', 'image/jpeg', 273930, NULL, NULL, '/media/kompozit/ctp-cam-elyaf-01.jpg',            'local', NOW(3), NOW(3)),
  (UUID(), NULL, 'ctp-dokuma-hibrit-01.jpg',        'kompozit', 'media/kompozit/ctp-dokuma-hibrit-01.jpg',        'media/kompozit', 'image/jpeg', 222446, NULL, NULL, '/media/kompozit/ctp-dokuma-hibrit-01.jpg',        'local', NOW(3), NOW(3)),
  (UUID(), NULL, 'kompozit-fabrika-otoklav-01.jpg', 'kompozit', 'media/kompozit/kompozit-fabrika-otoklav-01.jpg', 'media/kompozit', 'image/jpeg', 438285, NULL, NULL, '/media/kompozit/kompozit-fabrika-otoklav-01.jpg', 'local', NOW(3), NOW(3)),
  (UUID(), NULL, 'kompozit-uretim-proses-01.jpg',   'kompozit', 'media/kompozit/kompozit-uretim-proses-01.jpg',   'media/kompozit', 'image/jpeg', 290834, NULL, NULL, '/media/kompozit/kompozit-uretim-proses-01.jpg',   'local', NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE `updated_at` = VALUES(`updated_at`);

-- ----------------------------------------------------------------
-- 2. products: assign real images
-- ----------------------------------------------------------------

UPDATE `products` SET
  `image_url` = '/media/kompozit/karbon-fiber-panel-01.jpg'
WHERE `id` = 'kd010001-7001-4001-9001-dddddddd0001';

UPDATE `products` SET
  `image_url` = '/media/kompozit/ctp-cam-elyaf-01.jpg'
WHERE `id` = 'kd010002-7002-4002-9002-dddddddd0002';

UPDATE `products` SET
  `image_url` = '/media/kompozit/karbon-fiber-doku-01.jpg'
WHERE `id` = 'kd010003-7003-4003-9003-dddddddd0003';

-- ----------------------------------------------------------------
-- 3. gallery_images: assign real images
-- ----------------------------------------------------------------

UPDATE `gallery_images` SET
  `image_url` = '/media/kompozit/karbon-fiber-panel-01.jpg'
WHERE `id` = 'kg020001-8101-4001-9001-eeeeeeee0101';

UPDATE `gallery_images` SET
  `image_url` = '/media/kompozit/ctp-cam-elyaf-01.jpg'
WHERE `id` = 'kg020002-8102-4002-9002-eeeeeeee0102';

UPDATE `gallery_images` SET
  `image_url` = '/media/kompozit/kompozit-fabrika-otoklav-01.jpg'
WHERE `id` = 'kg020003-8103-4003-9003-eeeeeeee0103';

UPDATE `gallery_images` SET
  `image_url` = '/media/kompozit/ctp-dokuma-hibrit-01.jpg'
WHERE `id` = 'kg020004-8104-4004-9004-eeeeeeee0104';
