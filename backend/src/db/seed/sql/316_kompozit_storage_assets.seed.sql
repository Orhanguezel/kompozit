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
  ('kd030001-9001-4001-9001-ffffffff0001', 'tr', 'Eskitme Bronz Kompozit Saksı', 'eskitme-bronz-kompozit-saksi', 'Bronz efektli yatay saksı formunda dekoratif kompozit obje.', 'Eskitme bronz yatay kompozit saksı', JSON_ARRAY('kompozit', 'saksı', 'dekoratif obje', 'bronz efekt'), JSON_OBJECT('kaynak', 'urunler-1.jpeg', 'form', 'Yatay saksı'), 'Eskitme Bronz Kompozit Saksı | MOE Kompozit', 'Bronz efektli yatay kompozit saksı katalog kaydı.'),
  ('kd030002-9002-4002-9002-ffffffff0002', 'tr', 'Eskitme Dokulu Kompozit Küp', 'eskitme-dokulu-kompozit-kup', 'Dik formda, eskitme yüzey dokusuna sahip dekoratif kompozit küp.', 'Eskitme dokulu dik kompozit küp', JSON_ARRAY('kompozit', 'küp', 'dekoratif obje', 'eskitme yüzey'), JSON_OBJECT('kaynak', 'urunler-2.jpeg', 'form', 'Dik küp'), 'Eskitme Dokulu Kompozit Küp | MOE Kompozit', 'Eskitme yüzeyli dik kompozit küp katalog kaydı.'),
  ('kd030003-9003-4003-9003-ffffffff0003', 'tr', 'Terracotta Kompozit Bahçe Vazosu', 'terracotta-kompozit-bahce-vazosu', 'Terracotta tonunda, dış mekan kullanımı için dekoratif kompozit bahçe vazosu.', 'Terracotta kompozit bahçe vazosu', JSON_ARRAY('kompozit', 'terracotta', 'bahçe vazosu', 'dış mekan'), JSON_OBJECT('kaynak', 'urunler-3.jpeg', 'form', 'Dik vazo'), 'Terracotta Kompozit Bahçe Vazosu | MOE Kompozit', 'Terracotta renkli kompozit bahçe vazosu katalog kaydı.'),
  ('kd030004-9004-4004-9004-ffffffff0004', 'tr', 'Bronz Efektli Yatay Kompozit Küp', 'bronz-efektli-yatay-kompozit-kup', 'Bronz yüzey efektli, yatay sergilenen dekoratif kompozit küp formu.', 'Bronz efektli yatay kompozit küp', JSON_ARRAY('kompozit', 'küp', 'bronz efekt', 'dekoratif'), JSON_OBJECT('kaynak', 'urunler-4.jpeg', 'form', 'Yatay küp'), 'Bronz Efektli Yatay Kompozit Küp | MOE Kompozit', 'Bronz efektli yatay kompozit küp katalog kaydı.'),
  ('kd030005-9005-4005-9005-ffffffff0005', 'tr', 'Krem Renkli Kompozit Saksı', 'krem-renkli-kompozit-saksi', 'Krem tonlu yüzeyi ve yatay saksı formu ile dekoratif kompozit parça.', 'Krem renkli yatay kompozit saksı', JSON_ARRAY('kompozit', 'saksı', 'krem renk', 'dekoratif obje'), JSON_OBJECT('kaynak', 'urunler-5.jpeg', 'form', 'Yatay saksı'), 'Krem Renkli Kompozit Saksı | MOE Kompozit', 'Krem renkli yatay kompozit saksı katalog kaydı.'),
  ('kd030006-9006-4006-9006-ffffffff0006', 'tr', 'Kiremit Tonlu Kompozit Saksı', 'kiremit-tonlu-kompozit-saksi', 'Kiremit renginde, geniş ağızlı yatay kompozit saksı objesi.', 'Kiremit tonlu yatay kompozit saksı', JSON_ARRAY('kompozit', 'saksı', 'kiremit renk', 'dekoratif'), JSON_OBJECT('kaynak', 'urunler-6.jpeg', 'form', 'Yatay saksı'), 'Kiremit Tonlu Kompozit Saksı | MOE Kompozit', 'Kiremit tonlu yatay kompozit saksı katalog kaydı.'),
  ('kd030007-9007-4007-9007-ffffffff0007', 'tr', 'Figür Kabartmalı Kompozit Vazo', 'figur-kabartmali-kompozit-vazo', 'Yüz figürü ve kabartmalı desen detayları bulunan dekoratif kompozit vazo.', 'Figür kabartmalı kompozit vazo', JSON_ARRAY('kompozit', 'kabartma', 'figür', 'dekoratif vazo'), JSON_OBJECT('kaynak', 'urunler-7.jpeg', 'form', 'Kabartmalı vazo'), 'Figür Kabartmalı Kompozit Vazo | MOE Kompozit', 'Figür kabartmalı kompozit vazo katalog kaydı.'),
  ('kd030008-9008-4008-9008-ffffffff0008', 'tr', 'Altın Tonlu Kompozit Vazo', 'altin-tonlu-kompozit-vazo', 'Parlak altın tonunda, dik formda dekoratif kompozit vazo.', 'Altın tonlu kompozit vazo', JSON_ARRAY('kompozit', 'altın ton', 'vazo', 'dekoratif'), JSON_OBJECT('kaynak', 'urunler-8.jpeg', 'form', 'Dik vazo'), 'Altın Tonlu Kompozit Vazo | MOE Kompozit', 'Altın tonlu kompozit vazo katalog kaydı.'),
  ('kd030009-9009-4009-9009-ffffffff0009', 'tr', 'Üçlü Kompozit Saksı Seti', 'uclu-kompozit-saksi-seti', 'Farklı yüzey tonlarına sahip üç parçalı dekoratif kompozit saksı seti.', 'Üçlü kompozit saksı seti', JSON_ARRAY('kompozit', 'saksı seti', 'üçlü set', 'dekoratif'), JSON_OBJECT('kaynak', 'urunler-9.jpeg', 'form', 'Üçlü set'), 'Üçlü Kompozit Saksı Seti | MOE Kompozit', 'Üç parçalı kompozit saksı seti katalog kaydı.'),
  ('kd030010-9010-4010-9010-ffffffff0010', 'tr', 'Hardal Tonlu Yatay Kompozit Saksı', 'hardal-tonlu-yatay-kompozit-saksi', 'Hardal sarısı yüzey tonuyla yatay saksı formunda dekoratif kompozit obje.', 'Hardal tonlu yatay kompozit saksı', JSON_ARRAY('kompozit', 'saksı', 'hardal renk', 'dekoratif'), JSON_OBJECT('kaynak', 'urunler-10.jpeg', 'form', 'Yatay saksı'), 'Hardal Tonlu Yatay Kompozit Saksı | MOE Kompozit', 'Hardal tonlu yatay kompozit saksı katalog kaydı.'),
  ('kd030011-9011-4011-9011-ffffffff0011', 'tr', 'Bahçe Tipi Kompozit Saksı Seti', 'bahce-tipi-kompozit-saksi-seti', 'Çim alan üzerinde sergilenen, farklı boy ve renkte dekoratif kompozit saksı seti.', 'Bahçe tipi kompozit saksı seti', JSON_ARRAY('kompozit', 'saksı seti', 'bahçe objesi', 'dış mekan'), JSON_OBJECT('kaynak', 'urunler-11.jpeg', 'form', 'Bahçe seti'), 'Bahçe Tipi Kompozit Saksı Seti | MOE Kompozit', 'Bahçe tipi kompozit saksı seti katalog kaydı.'),
  ('kd030012-9012-4012-9012-ffffffff0012', 'tr', 'Karışık Renk Kompozit Küp Seti', 'karisik-renk-kompozit-kup-seti', 'Kiremit ve bronz tonlarını bir araya getiren karışık kompozit küp seti.', 'Karışık renk kompozit küp seti', JSON_ARRAY('kompozit', 'küp seti', 'karışık renk', 'dekoratif'), JSON_OBJECT('kaynak', 'urunler-12.jpeg', 'form', 'Karışık set'), 'Karışık Renk Kompozit Küp Seti | MOE Kompozit', 'Karışık renk kompozit küp seti katalog kaydı.'),
  ('kd030013-9013-4013-9013-ffffffff0013', 'tr', 'Ayaklı Eskitme Kompozit Küp', 'ayakli-eskitme-kompozit-kup', 'Ayaklı taban detayı ve eskitme yüzeyiyle dik kompozit küp objesi.', 'Ayaklı eskitme kompozit küp', JSON_ARRAY('kompozit', 'ayaklı küp', 'eskitme yüzey', 'dekoratif'), JSON_OBJECT('kaynak', 'urunler-13.jpeg', 'form', 'Ayaklı küp'), 'Ayaklı Eskitme Kompozit Küp | MOE Kompozit', 'Ayaklı eskitme kompozit küp katalog kaydı.'),
  ('kd030014-9014-4014-9014-ffffffff0014', 'tr', 'Bronz Patinalı Kompozit Saksı', 'bronz-patinali-kompozit-saksi', 'Bronz patina yüzeyi belirgin, yatay formda dekoratif kompozit saksı.', 'Bronz patinalı kompozit saksı', JSON_ARRAY('kompozit', 'saksı', 'bronz patina', 'dekoratif obje'), JSON_OBJECT('kaynak', 'urunler-14.jpeg', 'form', 'Yatay saksı'), 'Bronz Patinalı Kompozit Saksı | MOE Kompozit', 'Bronz patinalı kompozit saksı katalog kaydı.'),
  ('kd030001-9001-4001-9001-ffffffff0001', 'en', 'Aged Bronze Composite Amphora', 'aged-bronze-composite-amphora', 'Decorative composite object in a horizontal amphora form with an aged bronze effect.', 'Aged bronze horizontal composite amphora', JSON_ARRAY('composite', 'amphora', 'decorative object', 'bronze effect'), JSON_OBJECT('source', 'urunler-1.jpeg', 'form', 'Horizontal amphora'), 'Aged Bronze Composite Amphora | MOE Kompozit', 'Aged bronze horizontal composite amphora catalog record.'),
  ('kd030002-9002-4002-9002-ffffffff0002', 'en', 'Aged Texture Composite Urn', 'aged-texture-composite-urn', 'Upright decorative composite urn with an aged surface texture.', 'Aged texture upright composite urn', JSON_ARRAY('composite', 'urn', 'decorative object', 'aged finish'), JSON_OBJECT('source', 'urunler-2.jpeg', 'form', 'Upright urn'), 'Aged Texture Composite Urn | MOE Kompozit', 'Aged surface upright composite urn catalog record.'),
  ('kd030003-9003-4003-9003-ffffffff0003', 'en', 'Terracotta Composite Garden Vase', 'terracotta-composite-garden-vase', 'Terracotta-toned decorative composite garden vase for outdoor display.', 'Terracotta composite garden vase', JSON_ARRAY('composite', 'terracotta', 'garden vase', 'outdoor'), JSON_OBJECT('source', 'urunler-3.jpeg', 'form', 'Upright vase'), 'Terracotta Composite Garden Vase | MOE Kompozit', 'Terracotta composite garden vase catalog record.'),
  ('kd030004-9004-4004-9004-ffffffff0004', 'en', 'Bronze Effect Horizontal Composite Urn', 'bronze-effect-horizontal-composite-urn', 'Decorative horizontal composite urn form with a bronze surface effect.', 'Bronze effect horizontal composite urn', JSON_ARRAY('composite', 'urn', 'bronze effect', 'decorative'), JSON_OBJECT('source', 'urunler-4.jpeg', 'form', 'Horizontal urn'), 'Bronze Effect Horizontal Composite Urn | MOE Kompozit', 'Bronze effect horizontal composite urn catalog record.'),
  ('kd030005-9005-4005-9005-ffffffff0005', 'en', 'Cream Composite Amphora', 'cream-composite-amphora', 'Cream-toned decorative composite part in a horizontal amphora form.', 'Cream horizontal composite amphora', JSON_ARRAY('composite', 'amphora', 'cream color', 'decorative object'), JSON_OBJECT('source', 'urunler-5.jpeg', 'form', 'Horizontal amphora'), 'Cream Composite Amphora | MOE Kompozit', 'Cream horizontal composite amphora catalog record.'),
  ('kd030006-9006-4006-9006-ffffffff0006', 'en', 'Brick Tone Composite Amphora', 'brick-tone-composite-amphora', 'Brick-colored decorative composite amphora with a wide mouth and horizontal body.', 'Brick tone horizontal composite amphora', JSON_ARRAY('composite', 'amphora', 'brick color', 'decorative'), JSON_OBJECT('source', 'urunler-6.jpeg', 'form', 'Horizontal amphora'), 'Brick Tone Composite Amphora | MOE Kompozit', 'Brick tone horizontal composite amphora catalog record.'),
  ('kd030007-9007-4007-9007-ffffffff0007', 'en', 'Relief Figure Composite Vase', 'relief-figure-composite-vase', 'Decorative composite vase with face figure and relief pattern details.', 'Relief figure composite vase', JSON_ARRAY('composite', 'relief', 'figure', 'decorative vase'), JSON_OBJECT('source', 'urunler-7.jpeg', 'form', 'Relief vase'), 'Relief Figure Composite Vase | MOE Kompozit', 'Relief figure composite vase catalog record.'),
  ('kd030008-9008-4008-9008-ffffffff0008', 'en', 'Gold Tone Composite Vase', 'gold-tone-composite-vase', 'Upright decorative composite vase with a bright gold-toned finish.', 'Gold tone composite vase', JSON_ARRAY('composite', 'gold tone', 'vase', 'decorative'), JSON_OBJECT('source', 'urunler-8.jpeg', 'form', 'Upright vase'), 'Gold Tone Composite Vase | MOE Kompozit', 'Gold tone composite vase catalog record.'),
  ('kd030009-9009-4009-9009-ffffffff0009', 'en', 'Three-Piece Composite Amphora Set', 'three-piece-composite-amphora-set', 'Three-piece decorative composite amphora set with varied surface tones.', 'Three-piece composite amphora set', JSON_ARRAY('composite', 'amphora set', 'three piece set', 'decorative'), JSON_OBJECT('source', 'urunler-9.jpeg', 'form', 'Three-piece set'), 'Three-Piece Composite Amphora Set | MOE Kompozit', 'Three-piece composite amphora set catalog record.'),
  ('kd030010-9010-4010-9010-ffffffff0010', 'en', 'Mustard Tone Horizontal Composite Amphora', 'mustard-tone-horizontal-composite-amphora', 'Decorative horizontal composite amphora with a mustard yellow surface tone.', 'Mustard tone horizontal composite amphora', JSON_ARRAY('composite', 'amphora', 'mustard color', 'decorative'), JSON_OBJECT('source', 'urunler-10.jpeg', 'form', 'Horizontal amphora'), 'Mustard Tone Horizontal Composite Amphora | MOE Kompozit', 'Mustard tone horizontal composite amphora catalog record.'),
  ('kd030011-9011-4011-9011-ffffffff0011', 'en', 'Garden Composite Amphora Set', 'garden-composite-amphora-set', 'Decorative composite amphora set in varied sizes and colors for garden display.', 'Garden composite amphora set', JSON_ARRAY('composite', 'amphora set', 'garden object', 'outdoor'), JSON_OBJECT('source', 'urunler-11.jpeg', 'form', 'Garden set'), 'Garden Composite Amphora Set | MOE Kompozit', 'Garden composite amphora set catalog record.'),
  ('kd030012-9012-4012-9012-ffffffff0012', 'en', 'Mixed Color Composite Urn Set', 'mixed-color-composite-urn-set', 'Mixed composite urn set combining brick and bronze surface tones.', 'Mixed color composite urn set', JSON_ARRAY('composite', 'urn set', 'mixed color', 'decorative'), JSON_OBJECT('source', 'urunler-12.jpeg', 'form', 'Mixed set'), 'Mixed Color Composite Urn Set | MOE Kompozit', 'Mixed color composite urn set catalog record.'),
  ('kd030013-9013-4013-9013-ffffffff0013', 'en', 'Footed Aged Composite Urn', 'footed-aged-composite-urn', 'Upright composite urn with footed base detail and aged surface finish.', 'Footed aged composite urn', JSON_ARRAY('composite', 'footed urn', 'aged finish', 'decorative'), JSON_OBJECT('source', 'urunler-13.jpeg', 'form', 'Footed urn'), 'Footed Aged Composite Urn | MOE Kompozit', 'Footed aged composite urn catalog record.'),
  ('kd030014-9014-4014-9014-ffffffff0014', 'en', 'Bronze Patina Composite Amphora', 'bronze-patina-composite-amphora', 'Decorative horizontal composite amphora with a pronounced bronze patina finish.', 'Bronze patina composite amphora', JSON_ARRAY('composite', 'amphora', 'bronze patina', 'decorative object'), JSON_OBJECT('source', 'urunler-14.jpeg', 'form', 'Horizontal amphora'), 'Bronze Patina Composite Amphora | MOE Kompozit', 'Bronze patina composite amphora catalog record.')
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
