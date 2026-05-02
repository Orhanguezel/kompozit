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

-- Auto-generated product entries for urunler images
INSERT INTO `products` (`id`, `item_type`, `category_id`, `sub_category_id`, `price`, `image_url`, `storage_asset_id`, `images`, `storage_image_ids`, `is_active`, `is_featured`, `order_num`, `product_code`, `stock_quantity`, `rating`, `review_count`)
VALUES
  ('kd030001-9001-4001-9001-ffffffff0001', 'kompozit', 'cccc0001-4001-4001-8001-cccccccc0001', NULL, 0.00, '/uploads/kompozit/urunler-1.jpeg',  'c3000020-0020-4020-8020-000000000020', JSON_ARRAY('/uploads/kompozit/urunler-1.jpeg'),  JSON_ARRAY('c3000020-0020-4020-8020-000000000020'), 1, 1, 201, 'MOE-KMP-001', 0, 5.00, 0),
  ('kd030002-9002-4002-9002-ffffffff0002', 'kompozit', 'cccc0002-4002-4002-8002-cccccccc0002', NULL, 0.00, '/uploads/kompozit/urunler-2.jpeg',  'c3000021-0021-4021-8021-000000000021', JSON_ARRAY('/uploads/kompozit/urunler-2.jpeg'),  JSON_ARRAY('c3000021-0021-4021-8021-000000000021'), 1, 1, 202, 'MOE-KMP-002', 0, 5.00, 0),
  ('kd030003-9003-4003-9003-ffffffff0003', 'kompozit', 'cccc0003-4003-4003-8003-cccccccc0003', NULL, 0.00, '/uploads/kompozit/urunler-3.jpeg',  'c3000022-0022-4022-8022-000000000022', JSON_ARRAY('/uploads/kompozit/urunler-3.jpeg'),  JSON_ARRAY('c3000022-0022-4022-8022-000000000022'), 1, 1, 203, 'MOE-KMP-003', 0, 5.00, 0),
  ('kd030004-9004-4004-9004-ffffffff0004', 'kompozit', 'cccc0004-4004-4004-8004-cccccccc0004', NULL, 0.00, '/uploads/kompozit/urunler-4.jpeg',  'c3000023-0023-4023-8023-000000000023', JSON_ARRAY('/uploads/kompozit/urunler-4.jpeg'),  JSON_ARRAY('c3000023-0023-4023-8023-000000000023'), 1, 1, 204, 'MOE-KMP-004', 0, 5.00, 0),
  ('kd030005-9005-4005-9005-ffffffff0005', 'kompozit', 'cccc0005-4005-4005-8005-cccccccc0005', NULL, 0.00, '/uploads/kompozit/urunler-5.jpeg',  'c3000024-0024-4024-8024-000000000024', JSON_ARRAY('/uploads/kompozit/urunler-5.jpeg'),  JSON_ARRAY('c3000024-0024-4024-8024-000000000024'), 1, 0, 205, 'MOE-KMP-005', 0, 5.00, 0),
  ('kd030006-9006-4006-9006-ffffffff0006', 'kompozit', 'cccc0006-4006-4006-8006-cccccccc0006', NULL, 0.00, '/uploads/kompozit/urunler-6.jpeg',  'c3000025-0025-4025-8025-000000000025', JSON_ARRAY('/uploads/kompozit/urunler-6.jpeg'),  JSON_ARRAY('c3000025-0025-4025-8025-000000000025'), 1, 0, 206, 'MOE-KMP-006', 0, 5.00, 0),
  ('kd030007-9007-4007-9007-ffffffff0007', 'kompozit', 'cccc0007-4007-4007-8007-cccccccc0007', NULL, 0.00, '/uploads/kompozit/urunler-7.jpeg',  'c3000026-0026-4026-8026-000000000026', JSON_ARRAY('/uploads/kompozit/urunler-7.jpeg'),  JSON_ARRAY('c3000026-0026-4026-8026-000000000026'), 1, 0, 207, 'MOE-KMP-007', 0, 5.00, 0),
  ('kd030008-9008-4008-9008-ffffffff0008', 'kompozit', 'cccc0001-4001-4001-8001-cccccccc0001', NULL, 0.00, '/uploads/kompozit/urunler-8.jpeg',  'c3000027-0027-4027-8027-000000000027', JSON_ARRAY('/uploads/kompozit/urunler-8.jpeg'),  JSON_ARRAY('c3000027-0027-4027-8027-000000000027'), 1, 0, 208, 'MOE-KMP-008', 0, 5.00, 0),
  ('kd030009-9009-4009-9009-ffffffff0009', 'kompozit', 'cccc0002-4002-4002-8002-cccccccc0002', NULL, 0.00, '/uploads/kompozit/urunler-9.jpeg',  'c3000028-0028-4028-8028-000000000028', JSON_ARRAY('/uploads/kompozit/urunler-9.jpeg'),  JSON_ARRAY('c3000028-0028-4028-8028-000000000028'), 1, 0, 209, 'MOE-KMP-009', 0, 5.00, 0),
  ('kd030010-9010-4010-9010-ffffffff0010', 'kompozit', 'cccc0003-4003-4003-8003-cccccccc0003', NULL, 0.00, '/uploads/kompozit/urunler-10.jpeg', 'c3000015-0015-4015-8015-000000000015', JSON_ARRAY('/uploads/kompozit/urunler-10.jpeg'), JSON_ARRAY('c3000015-0015-4015-8015-000000000015'), 1, 0, 210, 'MOE-KMP-010', 0, 5.00, 0),
  ('kd030011-9011-4011-9011-ffffffff0011', 'kompozit', 'cccc0004-4004-4004-8004-cccccccc0004', NULL, 0.00, '/uploads/kompozit/urunler-11.jpeg', 'c3000016-0016-4016-8016-000000000016', JSON_ARRAY('/uploads/kompozit/urunler-11.jpeg'), JSON_ARRAY('c3000016-0016-4016-8016-000000000016'), 1, 0, 211, 'MOE-KMP-011', 0, 5.00, 0),
  ('kd030012-9012-4012-9012-ffffffff0012', 'kompozit', 'cccc0005-4005-4005-8005-cccccccc0005', NULL, 0.00, '/uploads/kompozit/urunler-12.jpeg', 'c3000017-0017-4017-8017-000000000017', JSON_ARRAY('/uploads/kompozit/urunler-12.jpeg'), JSON_ARRAY('c3000017-0017-4017-8017-000000000017'), 1, 0, 212, 'MOE-KMP-012', 0, 5.00, 0),
  ('kd030013-9013-4013-9013-ffffffff0013', 'kompozit', 'cccc0006-4006-4006-8006-cccccccc0006', NULL, 0.00, '/uploads/kompozit/urunler-13.jpeg', 'c3000018-0018-4018-8018-000000000018', JSON_ARRAY('/uploads/kompozit/urunler-13.jpeg'), JSON_ARRAY('c3000018-0018-4018-8018-000000000018'), 1, 0, 213, 'MOE-KMP-013', 0, 5.00, 0),
  ('kd030014-9014-4014-9014-ffffffff0014', 'kompozit', 'cccc0007-4007-4007-8007-cccccccc0007', NULL, 0.00, '/uploads/kompozit/urunler-14.jpeg', 'c3000019-0019-4019-8019-000000000019', JSON_ARRAY('/uploads/kompozit/urunler-14.jpeg'), JSON_ARRAY('c3000019-0019-4019-8019-000000000019'), 1, 0, 214, 'MOE-KMP-014', 0, 5.00, 0)
ON DUPLICATE KEY UPDATE
  `item_type` = VALUES(`item_type`),
  `category_id` = VALUES(`category_id`),
  `price` = VALUES(`price`),
  `image_url` = VALUES(`image_url`),
  `storage_asset_id` = VALUES(`storage_asset_id`),
  `images` = VALUES(`images`),
  `storage_image_ids` = VALUES(`storage_image_ids`),
  `is_active` = VALUES(`is_active`),
  `is_featured` = VALUES(`is_featured`),
  `order_num` = VALUES(`order_num`),
  `product_code` = VALUES(`product_code`),
  `stock_quantity` = VALUES(`stock_quantity`),
  `rating` = VALUES(`rating`),
  `review_count` = VALUES(`review_count`),
  `updated_at` = NOW(3);

INSERT INTO `product_i18n` (`product_id`, `locale`, `title`, `slug`, `description`, `alt`, `tags`, `specifications`, `meta_title`, `meta_description`)
VALUES
  ('kd030001-9001-4001-9001-ffffffff0001', 'tr', 'Kompozit Urun 1',  'kompozit-urun-1',  'Kompozit urun gorsellerinden olusturulan katalog kaydi.', 'Kompozit urun 1',  JSON_ARRAY('kompozit', 'urun'), JSON_OBJECT('kaynak', 'urunler-1.jpeg'),  'Kompozit Urun 1 | MOE Kompozit',  'Kompozit urun 1 katalog kaydi.'),
  ('kd030002-9002-4002-9002-ffffffff0002', 'tr', 'Kompozit Urun 2',  'kompozit-urun-2',  'Kompozit urun gorsellerinden olusturulan katalog kaydi.', 'Kompozit urun 2',  JSON_ARRAY('kompozit', 'urun'), JSON_OBJECT('kaynak', 'urunler-2.jpeg'),  'Kompozit Urun 2 | MOE Kompozit',  'Kompozit urun 2 katalog kaydi.'),
  ('kd030003-9003-4003-9003-ffffffff0003', 'tr', 'Kompozit Urun 3',  'kompozit-urun-3',  'Kompozit urun gorsellerinden olusturulan katalog kaydi.', 'Kompozit urun 3',  JSON_ARRAY('kompozit', 'urun'), JSON_OBJECT('kaynak', 'urunler-3.jpeg'),  'Kompozit Urun 3 | MOE Kompozit',  'Kompozit urun 3 katalog kaydi.'),
  ('kd030004-9004-4004-9004-ffffffff0004', 'tr', 'Kompozit Urun 4',  'kompozit-urun-4',  'Kompozit urun gorsellerinden olusturulan katalog kaydi.', 'Kompozit urun 4',  JSON_ARRAY('kompozit', 'urun'), JSON_OBJECT('kaynak', 'urunler-4.jpeg'),  'Kompozit Urun 4 | MOE Kompozit',  'Kompozit urun 4 katalog kaydi.'),
  ('kd030005-9005-4005-9005-ffffffff0005', 'tr', 'Kompozit Urun 5',  'kompozit-urun-5',  'Kompozit urun gorsellerinden olusturulan katalog kaydi.', 'Kompozit urun 5',  JSON_ARRAY('kompozit', 'urun'), JSON_OBJECT('kaynak', 'urunler-5.jpeg'),  'Kompozit Urun 5 | MOE Kompozit',  'Kompozit urun 5 katalog kaydi.'),
  ('kd030006-9006-4006-9006-ffffffff0006', 'tr', 'Kompozit Urun 6',  'kompozit-urun-6',  'Kompozit urun gorsellerinden olusturulan katalog kaydi.', 'Kompozit urun 6',  JSON_ARRAY('kompozit', 'urun'), JSON_OBJECT('kaynak', 'urunler-6.jpeg'),  'Kompozit Urun 6 | MOE Kompozit',  'Kompozit urun 6 katalog kaydi.'),
  ('kd030007-9007-4007-9007-ffffffff0007', 'tr', 'Kompozit Urun 7',  'kompozit-urun-7',  'Kompozit urun gorsellerinden olusturulan katalog kaydi.', 'Kompozit urun 7',  JSON_ARRAY('kompozit', 'urun'), JSON_OBJECT('kaynak', 'urunler-7.jpeg'),  'Kompozit Urun 7 | MOE Kompozit',  'Kompozit urun 7 katalog kaydi.'),
  ('kd030008-9008-4008-9008-ffffffff0008', 'tr', 'Kompozit Urun 8',  'kompozit-urun-8',  'Kompozit urun gorsellerinden olusturulan katalog kaydi.', 'Kompozit urun 8',  JSON_ARRAY('kompozit', 'urun'), JSON_OBJECT('kaynak', 'urunler-8.jpeg'),  'Kompozit Urun 8 | MOE Kompozit',  'Kompozit urun 8 katalog kaydi.'),
  ('kd030009-9009-4009-9009-ffffffff0009', 'tr', 'Kompozit Urun 9',  'kompozit-urun-9',  'Kompozit urun gorsellerinden olusturulan katalog kaydi.', 'Kompozit urun 9',  JSON_ARRAY('kompozit', 'urun'), JSON_OBJECT('kaynak', 'urunler-9.jpeg'),  'Kompozit Urun 9 | MOE Kompozit',  'Kompozit urun 9 katalog kaydi.'),
  ('kd030010-9010-4010-9010-ffffffff0010', 'tr', 'Kompozit Urun 10', 'kompozit-urun-10', 'Kompozit urun gorsellerinden olusturulan katalog kaydi.', 'Kompozit urun 10', JSON_ARRAY('kompozit', 'urun'), JSON_OBJECT('kaynak', 'urunler-10.jpeg'), 'Kompozit Urun 10 | MOE Kompozit', 'Kompozit urun 10 katalog kaydi.'),
  ('kd030011-9011-4011-9011-ffffffff0011', 'tr', 'Kompozit Urun 11', 'kompozit-urun-11', 'Kompozit urun gorsellerinden olusturulan katalog kaydi.', 'Kompozit urun 11', JSON_ARRAY('kompozit', 'urun'), JSON_OBJECT('kaynak', 'urunler-11.jpeg'), 'Kompozit Urun 11 | MOE Kompozit', 'Kompozit urun 11 katalog kaydi.'),
  ('kd030012-9012-4012-9012-ffffffff0012', 'tr', 'Kompozit Urun 12', 'kompozit-urun-12', 'Kompozit urun gorsellerinden olusturulan katalog kaydi.', 'Kompozit urun 12', JSON_ARRAY('kompozit', 'urun'), JSON_OBJECT('kaynak', 'urunler-12.jpeg'), 'Kompozit Urun 12 | MOE Kompozit', 'Kompozit urun 12 katalog kaydi.'),
  ('kd030013-9013-4013-9013-ffffffff0013', 'tr', 'Kompozit Urun 13', 'kompozit-urun-13', 'Kompozit urun gorsellerinden olusturulan katalog kaydi.', 'Kompozit urun 13', JSON_ARRAY('kompozit', 'urun'), JSON_OBJECT('kaynak', 'urunler-13.jpeg'), 'Kompozit Urun 13 | MOE Kompozit', 'Kompozit urun 13 katalog kaydi.'),
  ('kd030014-9014-4014-9014-ffffffff0014', 'tr', 'Kompozit Urun 14', 'kompozit-urun-14', 'Kompozit urun gorsellerinden olusturulan katalog kaydi.', 'Kompozit urun 14', JSON_ARRAY('kompozit', 'urun'), JSON_OBJECT('kaynak', 'urunler-14.jpeg'), 'Kompozit Urun 14 | MOE Kompozit', 'Kompozit urun 14 katalog kaydi.'),
  ('kd030001-9001-4001-9001-ffffffff0001', 'en', 'Composite Product 1',  'composite-product-1',  'Catalog record generated from composite product imagery.', 'Composite product 1',  JSON_ARRAY('composite', 'product'), JSON_OBJECT('source', 'urunler-1.jpeg'),  'Composite Product 1 | MOE Kompozit',  'Composite product 1 catalog record.'),
  ('kd030002-9002-4002-9002-ffffffff0002', 'en', 'Composite Product 2',  'composite-product-2',  'Catalog record generated from composite product imagery.', 'Composite product 2',  JSON_ARRAY('composite', 'product'), JSON_OBJECT('source', 'urunler-2.jpeg'),  'Composite Product 2 | MOE Kompozit',  'Composite product 2 catalog record.'),
  ('kd030003-9003-4003-9003-ffffffff0003', 'en', 'Composite Product 3',  'composite-product-3',  'Catalog record generated from composite product imagery.', 'Composite product 3',  JSON_ARRAY('composite', 'product'), JSON_OBJECT('source', 'urunler-3.jpeg'),  'Composite Product 3 | MOE Kompozit',  'Composite product 3 catalog record.'),
  ('kd030004-9004-4004-9004-ffffffff0004', 'en', 'Composite Product 4',  'composite-product-4',  'Catalog record generated from composite product imagery.', 'Composite product 4',  JSON_ARRAY('composite', 'product'), JSON_OBJECT('source', 'urunler-4.jpeg'),  'Composite Product 4 | MOE Kompozit',  'Composite product 4 catalog record.'),
  ('kd030005-9005-4005-9005-ffffffff0005', 'en', 'Composite Product 5',  'composite-product-5',  'Catalog record generated from composite product imagery.', 'Composite product 5',  JSON_ARRAY('composite', 'product'), JSON_OBJECT('source', 'urunler-5.jpeg'),  'Composite Product 5 | MOE Kompozit',  'Composite product 5 catalog record.'),
  ('kd030006-9006-4006-9006-ffffffff0006', 'en', 'Composite Product 6',  'composite-product-6',  'Catalog record generated from composite product imagery.', 'Composite product 6',  JSON_ARRAY('composite', 'product'), JSON_OBJECT('source', 'urunler-6.jpeg'),  'Composite Product 6 | MOE Kompozit',  'Composite product 6 catalog record.'),
  ('kd030007-9007-4007-9007-ffffffff0007', 'en', 'Composite Product 7',  'composite-product-7',  'Catalog record generated from composite product imagery.', 'Composite product 7',  JSON_ARRAY('composite', 'product'), JSON_OBJECT('source', 'urunler-7.jpeg'),  'Composite Product 7 | MOE Kompozit',  'Composite product 7 catalog record.'),
  ('kd030008-9008-4008-9008-ffffffff0008', 'en', 'Composite Product 8',  'composite-product-8',  'Catalog record generated from composite product imagery.', 'Composite product 8',  JSON_ARRAY('composite', 'product'), JSON_OBJECT('source', 'urunler-8.jpeg'),  'Composite Product 8 | MOE Kompozit',  'Composite product 8 catalog record.'),
  ('kd030009-9009-4009-9009-ffffffff0009', 'en', 'Composite Product 9',  'composite-product-9',  'Catalog record generated from composite product imagery.', 'Composite product 9',  JSON_ARRAY('composite', 'product'), JSON_OBJECT('source', 'urunler-9.jpeg'),  'Composite Product 9 | MOE Kompozit',  'Composite product 9 catalog record.'),
  ('kd030010-9010-4010-9010-ffffffff0010', 'en', 'Composite Product 10', 'composite-product-10', 'Catalog record generated from composite product imagery.', 'Composite product 10', JSON_ARRAY('composite', 'product'), JSON_OBJECT('source', 'urunler-10.jpeg'), 'Composite Product 10 | MOE Kompozit', 'Composite product 10 catalog record.'),
  ('kd030011-9011-4011-9011-ffffffff0011', 'en', 'Composite Product 11', 'composite-product-11', 'Catalog record generated from composite product imagery.', 'Composite product 11', JSON_ARRAY('composite', 'product'), JSON_OBJECT('source', 'urunler-11.jpeg'), 'Composite Product 11 | MOE Kompozit', 'Composite product 11 catalog record.'),
  ('kd030012-9012-4012-9012-ffffffff0012', 'en', 'Composite Product 12', 'composite-product-12', 'Catalog record generated from composite product imagery.', 'Composite product 12', JSON_ARRAY('composite', 'product'), JSON_OBJECT('source', 'urunler-12.jpeg'), 'Composite Product 12 | MOE Kompozit', 'Composite product 12 catalog record.'),
  ('kd030013-9013-4013-9013-ffffffff0013', 'en', 'Composite Product 13', 'composite-product-13', 'Catalog record generated from composite product imagery.', 'Composite product 13', JSON_ARRAY('composite', 'product'), JSON_OBJECT('source', 'urunler-13.jpeg'), 'Composite Product 13 | MOE Kompozit', 'Composite product 13 catalog record.'),
  ('kd030014-9014-4014-9014-ffffffff0014', 'en', 'Composite Product 14', 'composite-product-14', 'Catalog record generated from composite product imagery.', 'Composite product 14', JSON_ARRAY('composite', 'product'), JSON_OBJECT('source', 'urunler-14.jpeg'), 'Composite Product 14 | MOE Kompozit', 'Composite product 14 catalog record.')
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `slug` = VALUES(`slug`),
  `description` = VALUES(`description`),
  `alt` = VALUES(`alt`),
  `tags` = VALUES(`tags`),
  `specifications` = VALUES(`specifications`),
  `meta_title` = VALUES(`meta_title`),
  `meta_description` = VALUES(`meta_description`),
  `updated_at` = NOW(3);
