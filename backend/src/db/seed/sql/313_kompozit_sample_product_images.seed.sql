-- =============================================================
-- FILE: 313_kompozit_sample_product_images.seed.sql
-- Ürün / galeri / blog / çözüm kapakları → uploads/kompozit/*.jpg
-- storage_assets: 130_storage_assets.sql (c3000001–c3000008 + örnekler)
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

UPDATE `products`
SET
  `image_url` = '/uploads/kompozit/karbon-fiber-panel-01.jpg',
  `images` = JSON_ARRAY('/uploads/kompozit/karbon-fiber-panel-01.jpg'),
  `storage_asset_id` = 'c3000006-0006-4006-8006-000000000006',
  `updated_at` = NOW(3)
WHERE `id` = 'kd010001-7001-4001-9001-dddddddd0001';

UPDATE `products`
SET
  `image_url` = '/uploads/kompozit/ctp-cam-elyaf-01.jpg',
  `images` = JSON_ARRAY('/uploads/kompozit/ctp-cam-elyaf-01.jpg'),
  `storage_asset_id` = 'c3000003-0003-4003-8003-000000000003',
  `updated_at` = NOW(3)
WHERE `id` = 'kd010002-7002-4002-9002-dddddddd0002';

UPDATE `products`
SET
  `image_url` = '/uploads/kompozit/karbon-fiber-hammadde-01.jpg',
  `images` = JSON_ARRAY('/uploads/kompozit/karbon-fiber-hammadde-01.jpg'),
  `storage_asset_id` = 'c3000001-0001-4001-8001-000000000001',
  `updated_at` = NOW(3)
WHERE `id` = 'kd010003-7003-4003-9003-dddddddd0003';

UPDATE `gallery_images`
SET
  `image_url` = '/uploads/kompozit/karbon-fiber-panel-01.jpg',
  `storage_asset_id` = 'c3000006-0006-4006-8006-000000000006'
WHERE `id` = 'kg020001-8101-4001-9001-eeeeeeee0101';

UPDATE `gallery_images`
SET
  `image_url` = '/uploads/kompozit/karbon-fiber-detay-01.jpg',
  `storage_asset_id` = 'c3000008-0008-4008-8008-000000000008'
WHERE `id` = 'kg020002-8102-4002-9002-eeeeeeee0102';

UPDATE `gallery_images`
SET
  `image_url` = '/uploads/kompozit/ctp-cam-elyaf-01.jpg',
  `storage_asset_id` = 'c3000003-0003-4003-8003-000000000003'
WHERE `id` = 'kg020003-8103-4003-9003-eeeeeeee0103';

UPDATE `gallery_images`
SET
  `image_url` = '/uploads/kompozit/kompozit-fabrika-otoklav-01.jpg',
  `storage_asset_id` = 'c3000007-0007-4007-8007-000000000007'
WHERE `id` = 'kg020004-8104-4004-9004-eeeeeeee0104';

-- Çözümler (kompozit_solutions)
UPDATE `custom_pages`
SET
  `featured_image` = '/uploads/kompozit/ctp-cam-elyaf-01.jpg',
  `image_url` = '/uploads/kompozit/ctp-cam-elyaf-01.jpg',
  `storage_asset_id` = 'c3000003-0003-4003-8003-000000000003',
  `updated_at` = NOW(3)
WHERE `id` = 'bs010001-7001-4001-9001-ssssssss0001';

UPDATE `custom_pages`
SET
  `featured_image` = '/uploads/kompozit/karbon-fiber-doku-01.jpg',
  `image_url` = '/uploads/kompozit/karbon-fiber-doku-01.jpg',
  `storage_asset_id` = 'c3000002-0002-4002-8002-000000000002',
  `updated_at` = NOW(3)
WHERE `id` = 'bs010002-7002-4002-9002-ssssssss0002';

UPDATE `custom_pages`
SET
  `featured_image` = '/uploads/kompozit/kompozit-fabrika-otoklav-01.jpg',
  `image_url` = '/uploads/kompozit/kompozit-fabrika-otoklav-01.jpg',
  `storage_asset_id` = 'c3000007-0007-4007-8007-000000000007',
  `updated_at` = NOW(3)
WHERE `id` = 'bs010003-7003-4003-9003-ssssssss0003';

UPDATE `custom_pages`
SET
  `featured_image` = '/uploads/kompozit/ctp-dokuma-hibrit-01.jpg',
  `image_url` = '/uploads/kompozit/ctp-dokuma-hibrit-01.jpg',
  `storage_asset_id` = 'c3000004-0004-4004-8004-000000000004',
  `updated_at` = NOW(3)
WHERE `id` = 'bs010004-7004-4004-9004-ssssssss0004';

-- Blog (kompozit_blog)
UPDATE `custom_pages`
SET
  `featured_image` = '/uploads/kompozit/karbon-fiber-panel-01.jpg',
  `image_url` = '/uploads/kompozit/karbon-fiber-panel-01.jpg',
  `storage_asset_id` = 'c3000006-0006-4006-8006-000000000006',
  `updated_at` = NOW(3)
WHERE `id` = 'bb010001-5001-4001-9001-bbbbbbbb0001';

UPDATE `custom_pages`
SET
  `featured_image` = '/uploads/kompozit/karbon-fiber-detay-01.jpg',
  `image_url` = '/uploads/kompozit/karbon-fiber-detay-01.jpg',
  `storage_asset_id` = 'c3000008-0008-4008-8008-000000000008',
  `updated_at` = NOW(3)
WHERE `id` = 'bb010002-5002-4002-9002-bbbbbbbb0002';

UPDATE `custom_pages`
SET
  `featured_image` = '/uploads/kompozit/karbon-fiber-hammadde-01.jpg',
  `image_url` = '/uploads/kompozit/karbon-fiber-hammadde-01.jpg',
  `storage_asset_id` = 'c3000001-0001-4001-8001-000000000001',
  `updated_at` = NOW(3)
WHERE `id` = 'bb010003-5003-4003-9003-bbbbbbbb0003';

UPDATE `custom_pages`
SET
  `featured_image` = '/uploads/kompozit/ctp-dokuma-hibrit-01.jpg',
  `image_url` = '/uploads/kompozit/ctp-dokuma-hibrit-01.jpg',
  `storage_asset_id` = 'c3000004-0004-4004-8004-000000000004',
  `updated_at` = NOW(3)
WHERE `id` = 'bb010004-5004-4004-9004-bbbbbbbb0004';

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;
