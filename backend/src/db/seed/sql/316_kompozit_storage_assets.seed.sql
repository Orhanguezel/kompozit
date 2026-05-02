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
-- Auto-generated storage_assets entries for urunler images
INSERT INTO `storage_assets` (`id`, `user_id`, `name`, `bucket`, `path`, `folder`, `mime`, `size`, `width`, `height`, `url`, `provider`, `created_at`, `updated_at`) VALUES ('c3000015-0015-4015-8015-000000000015', NULL, 'urunler-10.jpeg', 'kompozit', 'uploads/kompozit/urunler-10.jpeg', 'uploads/kompozit', 'image/jpeg', 355748, NULL, NULL, '/uploads/kompozit/urunler-10.jpeg', 'local', NOW(3), NOW(3)) ON DUPLICATE KEY UPDATE `updated_at` = VALUES(`updated_at`);
INSERT INTO `storage_assets` (`id`, `user_id`, `name`, `bucket`, `path`, `folder`, `mime`, `size`, `width`, `height`, `url`, `provider`, `created_at`, `updated_at`) VALUES ('c3000016-0016-4016-8016-000000000016', NULL, 'urunler-11.jpeg', 'kompozit', 'uploads/kompozit/urunler-11.jpeg', 'uploads/kompozit', 'image/jpeg', 556034, NULL, NULL, '/uploads/kompozit/urunler-11.jpeg', 'local', NOW(3), NOW(3)) ON DUPLICATE KEY UPDATE `updated_at` = VALUES(`updated_at`);
INSERT INTO `storage_assets` (`id`, `user_id`, `name`, `bucket`, `path`, `folder`, `mime`, `size`, `width`, `height`, `url`, `provider`, `created_at`, `updated_at`) VALUES ('c3000017-0017-4017-8017-000000000017', NULL, 'urunler-12.jpeg', 'kompozit', 'uploads/kompozit/urunler-12.jpeg', 'uploads/kompozit', 'image/jpeg', 610616, NULL, NULL, '/uploads/kompozit/urunler-12.jpeg', 'local', NOW(3), NOW(3)) ON DUPLICATE KEY UPDATE `updated_at` = VALUES(`updated_at`);
INSERT INTO `storage_assets` (`id`, `user_id`, `name`, `bucket`, `path`, `folder`, `mime`, `size`, `width`, `height`, `url`, `provider`, `created_at`, `updated_at`) VALUES ('c3000018-0018-4018-8018-000000000018', NULL, 'urunler-13.jpeg', 'kompozit', 'uploads/kompozit/urunler-13.jpeg', 'uploads/kompozit', 'image/jpeg', 316141, NULL, NULL, '/uploads/kompozit/urunler-13.jpeg', 'local', NOW(3), NOW(3)) ON DUPLICATE KEY UPDATE `updated_at` = VALUES(`updated_at`);
INSERT INTO `storage_assets` (`id`, `user_id`, `name`, `bucket`, `path`, `folder`, `mime`, `size`, `width`, `height`, `url`, `provider`, `created_at`, `updated_at`) VALUES ('c3000019-0019-4019-8019-000000000019', NULL, 'urunler-14.jpeg', 'kompozit', 'uploads/kompozit/urunler-14.jpeg', 'uploads/kompozit', 'image/jpeg', 485378, NULL, NULL, '/uploads/kompozit/urunler-14.jpeg', 'local', NOW(3), NOW(3)) ON DUPLICATE KEY UPDATE `updated_at` = VALUES(`updated_at`);
INSERT INTO `storage_assets` (`id`, `user_id`, `name`, `bucket`, `path`, `folder`, `mime`, `size`, `width`, `height`, `url`, `provider`, `created_at`, `updated_at`) VALUES ('c3000020-0020-4020-8020-000000000020', NULL, 'urunler-1.jpeg', 'kompozit', 'uploads/kompozit/urunler-1.jpeg', 'uploads/kompozit', 'image/jpeg', 396299, NULL, NULL, '/uploads/kompozit/urunler-1.jpeg', 'local', NOW(3), NOW(3)) ON DUPLICATE KEY UPDATE `updated_at` = VALUES(`updated_at`);
INSERT INTO `storage_assets` (`id`, `user_id`, `name`, `bucket`, `path`, `folder`, `mime`, `size`, `width`, `height`, `url`, `provider`, `created_at`, `updated_at`) VALUES ('c3000021-0021-4021-8021-000000000021', NULL, 'urunler-2.jpeg', 'kompozit', 'uploads/kompozit/urunler-2.jpeg', 'uploads/kompozit', 'image/jpeg', 369729, NULL, NULL, '/uploads/kompozit/urunler-2.jpeg', 'local', NOW(3), NOW(3)) ON DUPLICATE KEY UPDATE `updated_at` = VALUES(`updated_at`);
INSERT INTO `storage_assets` (`id`, `user_id`, `name`, `bucket`, `path`, `folder`, `mime`, `size`, `width`, `height`, `url`, `provider`, `created_at`, `updated_at`) VALUES ('c3000022-0022-4022-8022-000000000022', NULL, 'urunler-3.jpeg', 'kompozit', 'uploads/kompozit/urunler-3.jpeg', 'uploads/kompozit', 'image/jpeg', 318299, NULL, NULL, '/uploads/kompozit/urunler-3.jpeg', 'local', NOW(3), NOW(3)) ON DUPLICATE KEY UPDATE `updated_at` = VALUES(`updated_at`);
INSERT INTO `storage_assets` (`id`, `user_id`, `name`, `bucket`, `path`, `folder`, `mime`, `size`, `width`, `height`, `url`, `provider`, `created_at`, `updated_at`) VALUES ('c3000023-0023-4023-8023-000000000023', NULL, 'urunler-4.jpeg', 'kompozit', 'uploads/kompozit/urunler-4.jpeg', 'uploads/kompozit', 'image/jpeg', 402940, NULL, NULL, '/uploads/kompozit/urunler-4.jpeg', 'local', NOW(3), NOW(3)) ON DUPLICATE KEY UPDATE `updated_at` = VALUES(`updated_at`);
INSERT INTO `storage_assets` (`id`, `user_id`, `name`, `bucket`, `path`, `folder`, `mime`, `size`, `width`, `height`, `url`, `provider`, `created_at`, `updated_at`) VALUES ('c3000024-0024-4024-8024-000000000024', NULL, 'urunler-5.jpeg', 'kompozit', 'uploads/kompozit/urunler-5.jpeg', 'uploads/kompozit', 'image/jpeg', 355882, NULL, NULL, '/uploads/kompozit/urunler-5.jpeg', 'local', NOW(3), NOW(3)) ON DUPLICATE KEY UPDATE `updated_at` = VALUES(`updated_at`);
INSERT INTO `storage_assets` (`id`, `user_id`, `name`, `bucket`, `path`, `folder`, `mime`, `size`, `width`, `height`, `url`, `provider`, `created_at`, `updated_at`) VALUES ('c3000025-0025-4025-8025-000000000025', NULL, 'urunler-6.jpeg', 'kompozit', 'uploads/kompozit/urunler-6.jpeg', 'uploads/kompozit', 'image/jpeg', 350137, NULL, NULL, '/uploads/kompozit/urunler-6.jpeg', 'local', NOW(3), NOW(3)) ON DUPLICATE KEY UPDATE `updated_at` = VALUES(`updated_at`);
INSERT INTO `storage_assets` (`id`, `user_id`, `name`, `bucket`, `path`, `folder`, `mime`, `size`, `width`, `height`, `url`, `provider`, `created_at`, `updated_at`) VALUES ('c3000026-0026-4026-8026-000000000026', NULL, 'urunler-7.jpeg', 'kompozit', 'uploads/kompozit/urunler-7.jpeg', 'uploads/kompozit', 'image/jpeg', 391028, NULL, NULL, '/uploads/kompozit/urunler-7.jpeg', 'local', NOW(3), NOW(3)) ON DUPLICATE KEY UPDATE `updated_at` = VALUES(`updated_at`);
INSERT INTO `storage_assets` (`id`, `user_id`, `name`, `bucket`, `path`, `folder`, `mime`, `size`, `width`, `height`, `url`, `provider`, `created_at`, `updated_at`) VALUES ('c3000027-0027-4027-8027-000000000027', NULL, 'urunler-8.jpeg', 'kompozit', 'uploads/kompozit/urunler-8.jpeg', 'uploads/kompozit', 'image/jpeg', 380299, NULL, NULL, '/uploads/kompozit/urunler-8.jpeg', 'local', NOW(3), NOW(3)) ON DUPLICATE KEY UPDATE `updated_at` = VALUES(`updated_at`);
INSERT INTO `storage_assets` (`id`, `user_id`, `name`, `bucket`, `path`, `folder`, `mime`, `size`, `width`, `height`, `url`, `provider`, `created_at`, `updated_at`) VALUES ('c3000028-0028-4028-8028-000000000028', NULL, 'urunler-9.jpeg', 'kompozit', 'uploads/kompozit/urunler-9.jpeg', 'uploads/kompozit', 'image/jpeg', 358594, NULL, NULL, '/uploads/kompozit/urunler-9.jpeg', 'local', NOW(3), NOW(3)) ON DUPLICATE KEY UPDATE `updated_at` = VALUES(`updated_at`);
INSERT INTO `storage_assets` (`id`, `user_id`, `name`, `bucket`, `path`, `folder`, `mime`, `size`, `width`, `height`, `url`, `provider`, `created_at`, `updated_at`) VALUES ('c3000029-0029-4029-8029-000000000029', NULL, 'kompozit_logo.jpeg', 'kompozit', 'uploads/kompozit/brand/kompozit_logo.jpeg', 'uploads/kompozit/brand', 'image/jpeg', 68164, NULL, NULL, '/uploads/kompozit/brand/kompozit_logo.jpeg', 'local', NOW(3), NOW(3)) ON DUPLICATE KEY UPDATE `updated_at` = VALUES(`updated_at`);
