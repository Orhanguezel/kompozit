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
  `image_url` = '/uploads/kompozit/ctp-koruyucu-govde-paneli.jpg',
  `images` = JSON_ARRAY(
    '/uploads/kompozit/ctp-koruyucu-govde-paneli.jpg',
    '/uploads/kompozit/ctp-cam-elyaf-01.jpg',
    '/uploads/kompozit/ctp-dokuma-hibrit-01.jpg',
    '/uploads/kompozit/kompozit-uretim-proses-01.jpg',
    '/uploads/kompozit/kompozit-fabrika-otoklav-01.jpg'
  ),
  `storage_asset_id` = 'c3000041-0041-4041-8041-000000000041',
  `storage_image_ids` = JSON_ARRAY(
    'c3000041-0041-4041-8041-000000000041',
    'c3000003-0003-4003-8003-000000000003',
    'c3000004-0004-4004-8004-000000000004',
    'c3000042-0042-4042-8042-000000000042',
    'c3000007-0007-4007-8007-000000000007'
  ),
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
WHERE `id` = '97020001-8101-4001-9001-eeeeeeee0101';

UPDATE `gallery_images`
SET
  `image_url` = '/uploads/kompozit/karbon-fiber-detay-01.jpg',
  `storage_asset_id` = 'c3000008-0008-4008-8008-000000000008'
WHERE `id` = '97020002-8102-4002-9002-eeeeeeee0102';

UPDATE `gallery_images`
SET
  `image_url` = '/uploads/kompozit/ctp-cam-elyaf-01.jpg',
  `storage_asset_id` = 'c3000003-0003-4003-8003-000000000003'
WHERE `id` = '97020003-8103-4003-9003-eeeeeeee0103';

UPDATE `gallery_images`
SET
  `image_url` = '/uploads/kompozit/kompozit-fabrika-otoklav-01.jpg',
  `storage_asset_id` = 'c3000007-0007-4007-8007-000000000007'
WHERE `id` = '97020004-8104-4004-9004-eeeeeeee0104';

-- Çözümler (kompozit_solutions)
UPDATE `custom_pages`
SET
  `featured_image` = '/uploads/kompozit/ctp-cam-elyaf-01.jpg',
  `image_url` = '/uploads/kompozit/ctp-cam-elyaf-01.jpg',
  `storage_asset_id` = 'c3000003-0003-4003-8003-000000000003',
  `updated_at` = NOW(3)
WHERE `id` = 'b5010001-7001-4001-9001-555555550001';

UPDATE `custom_pages`
SET
  `featured_image` = '/uploads/kompozit/karbon-fiber-doku-01.jpg',
  `image_url` = '/uploads/kompozit/karbon-fiber-doku-01.jpg',
  `storage_asset_id` = 'c3000002-0002-4002-8002-000000000002',
  `updated_at` = NOW(3)
WHERE `id` = 'b5010002-7002-4002-9002-555555550002';

UPDATE `custom_pages`
SET
  `featured_image` = '/uploads/kompozit/kompozit-fabrika-otoklav-01.jpg',
  `image_url` = '/uploads/kompozit/kompozit-fabrika-otoklav-01.jpg',
  `storage_asset_id` = 'c3000007-0007-4007-8007-000000000007',
  `updated_at` = NOW(3)
WHERE `id` = 'b5010003-7003-4003-9003-555555550003';

UPDATE `custom_pages`
SET
  `featured_image` = '/uploads/kompozit/ctp-dokuma-hibrit-01.jpg',
  `image_url` = '/uploads/kompozit/ctp-dokuma-hibrit-01.jpg',
  `storage_asset_id` = 'c3000004-0004-4004-8004-000000000004',
  `updated_at` = NOW(3)
WHERE `id` = 'b5010004-7004-4004-9004-555555550004';

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

-- =============================================================
-- Add kompozit brand logo to site_settings (override)
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES (
  UUID(),
  'kompozit__site_logo',
  '*',
  JSON_OBJECT(
    'logo_url', '/uploads/kompozit/brand/kompozit_logo.jpeg',
    'logo_alt', 'MOE Kompozit',
    'logo_dark_url', '/uploads/kompozit/brand/kompozit_logo.jpeg',
    'logo_light_url', '/uploads/kompozit/brand/kompozit_logo.jpeg',
    'favicon_url', '/uploads/kompozit/brand/favicon-32.png'
  ),
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`);

-- Lunapark / tema park kompozit urun gorselleri
UPDATE `products`
SET
  `image_url` = '/uploads/kompozit/lunapark-01-renkli.jpg',
  `images` = JSON_ARRAY('/uploads/kompozit/lunapark-01-renkli.jpg'),
  `storage_asset_id` = 'c3000030-0030-4030-8030-000000000030',
  `storage_image_ids` = JSON_ARRAY('c3000030-0030-4030-8030-000000000030'),
  `updated_at` = NOW(3)
WHERE `id` = 'lk040001-9101-4101-9101-aaaaaaaa0001';

UPDATE `products`
SET
  `image_url` = '/uploads/kompozit/lunapark-02-renkli.jpg',
  `images` = JSON_ARRAY('/uploads/kompozit/lunapark-02-renkli.jpg'),
  `storage_asset_id` = 'c3000031-0031-4031-8031-000000000031',
  `storage_image_ids` = JSON_ARRAY('c3000031-0031-4031-8031-000000000031'),
  `updated_at` = NOW(3)
WHERE `id` = 'lk040002-9102-4102-9102-aaaaaaaa0002';

UPDATE `products`
SET
  `image_url` = '/uploads/kompozit/lunapark-03-renkli.jpg',
  `images` = JSON_ARRAY('/uploads/kompozit/lunapark-03-renkli.jpg'),
  `storage_asset_id` = 'c3000032-0032-4032-8032-000000000032',
  `storage_image_ids` = JSON_ARRAY('c3000032-0032-4032-8032-000000000032'),
  `updated_at` = NOW(3)
WHERE `id` = 'lk040003-9103-4103-9103-aaaaaaaa0003';

UPDATE `products`
SET
  `image_url` = '/uploads/kompozit/lunapark-04-renkli.jpg',
  `images` = JSON_ARRAY('/uploads/kompozit/lunapark-04-renkli.jpg'),
  `storage_asset_id` = 'c3000033-0033-4033-8033-000000000033',
  `storage_image_ids` = JSON_ARRAY('c3000033-0033-4033-8033-000000000033'),
  `updated_at` = NOW(3)
WHERE `id` = 'lk040004-9104-4104-9104-aaaaaaaa0004';

UPDATE `products`
SET
  `image_url` = '/uploads/kompozit/lunapark-05-renkli.jpg',
  `images` = JSON_ARRAY('/uploads/kompozit/lunapark-05-renkli.jpg'),
  `storage_asset_id` = 'c3000034-0034-4034-8034-000000000034',
  `storage_image_ids` = JSON_ARRAY('c3000034-0034-4034-8034-000000000034'),
  `updated_at` = NOW(3)
WHERE `id` = 'lk040005-9105-4105-9105-aaaaaaaa0005';

UPDATE `products`
SET
  `image_url` = '/uploads/kompozit/lunapark-06-renkli.jpg',
  `images` = JSON_ARRAY('/uploads/kompozit/lunapark-06-renkli.jpg'),
  `storage_asset_id` = 'c3000035-0035-4035-8035-000000000035',
  `storage_image_ids` = JSON_ARRAY('c3000035-0035-4035-8035-000000000035'),
  `updated_at` = NOW(3)
WHERE `id` = 'lk040006-9106-4106-9106-aaaaaaaa0006';

UPDATE `products`
SET
  `image_url` = '/uploads/kompozit/lunapark-07-renkli.jpg',
  `images` = JSON_ARRAY('/uploads/kompozit/lunapark-07-renkli.jpg'),
  `storage_asset_id` = 'c3000036-0036-4036-8036-000000000036',
  `storage_image_ids` = JSON_ARRAY('c3000036-0036-4036-8036-000000000036'),
  `updated_at` = NOW(3)
WHERE `id` = 'lk040007-9107-4107-9107-aaaaaaaa0007';

UPDATE `products`
SET
  `image_url` = '/uploads/kompozit/lunapark-08-renkli.jpg',
  `images` = JSON_ARRAY('/uploads/kompozit/lunapark-08-renkli.jpg'),
  `storage_asset_id` = 'c3000037-0037-4037-8037-000000000037',
  `storage_image_ids` = JSON_ARRAY('c3000037-0037-4037-8037-000000000037'),
  `updated_at` = NOW(3)
WHERE `id` = 'lk040008-9108-4108-9108-aaaaaaaa0008';

UPDATE `products`
SET
  `image_url` = '/uploads/kompozit/lunapark-09-renkli.jpg',
  `images` = JSON_ARRAY('/uploads/kompozit/lunapark-09-renkli.jpg'),
  `storage_asset_id` = 'c3000038-0038-4038-8038-000000000038',
  `storage_image_ids` = JSON_ARRAY('c3000038-0038-4038-8038-000000000038'),
  `updated_at` = NOW(3)
WHERE `id` = 'lk040009-9109-4109-9109-aaaaaaaa0009';

UPDATE `products`
SET
  `image_url` = '/uploads/kompozit/lunapark-10-ham.jpg',
  `images` = JSON_ARRAY('/uploads/kompozit/lunapark-10-ham.jpg'),
  `storage_asset_id` = 'c3000039-0039-4039-8039-000000000039',
  `storage_image_ids` = JSON_ARRAY('c3000039-0039-4039-8039-000000000039'),
  `updated_at` = NOW(3)
WHERE `id` = 'lk040010-9110-4110-9110-aaaaaaaa0010';

UPDATE `products`
SET
  `image_url` = '/uploads/kompozit/lunapark-11-ham.jpg',
  `images` = JSON_ARRAY('/uploads/kompozit/lunapark-11-ham.jpg'),
  `storage_asset_id` = 'c3000040-0040-4040-8040-000000000040',
  `storage_image_ids` = JSON_ARRAY('c3000040-0040-4040-8040-000000000040'),
  `updated_at` = NOW(3)
WHERE `id` = 'lk040011-9111-4111-9111-aaaaaaaa0011';

-- Tum lunapark gorselleri mevcut tek urun detayinda galeri olarak gosterilir.
UPDATE `products` p
JOIN `product_i18n` pi ON pi.`product_id` = p.`id` AND pi.`locale` = 'tr'
SET
  p.`category_id` = 'cccc0003-4003-4003-8003-cccccccc0003',
  p.`image_url` = '/uploads/kompozit/lunapark-01-renkli.jpg',
  p.`images` = JSON_ARRAY(
    '/uploads/kompozit/lunapark-01-renkli.jpg',
    '/uploads/kompozit/lunapark-02-renkli.jpg',
    '/uploads/kompozit/lunapark-03-renkli.jpg',
    '/uploads/kompozit/lunapark-04-renkli.jpg',
    '/uploads/kompozit/lunapark-05-renkli.jpg',
    '/uploads/kompozit/lunapark-06-renkli.jpg',
    '/uploads/kompozit/lunapark-07-renkli.jpg',
    '/uploads/kompozit/lunapark-08-renkli.jpg',
    '/uploads/kompozit/lunapark-09-renkli.jpg',
    '/uploads/kompozit/lunapark-10-ham.jpg',
    '/uploads/kompozit/lunapark-11-ham.jpg'
  ),
  p.`storage_asset_id` = 'c3000030-0030-4030-8030-000000000030',
  p.`storage_image_ids` = JSON_ARRAY(
    'c3000030-0030-4030-8030-000000000030',
    'c3000031-0031-4031-8031-000000000031',
    'c3000032-0032-4032-8032-000000000032',
    'c3000033-0033-4033-8033-000000000033',
    'c3000034-0034-4034-8034-000000000034',
    'c3000035-0035-4035-8035-000000000035',
    'c3000036-0036-4036-8036-000000000036',
    'c3000037-0037-4037-8037-000000000037',
    'c3000038-0038-4038-8038-000000000038',
    'c3000039-0039-4039-8039-000000000039',
    'c3000040-0040-4040-8040-000000000040'
  ),
  p.`is_active` = 1,
  p.`is_featured` = 1,
  p.`order_num` = 320,
  p.`updated_at` = NOW(3)
WHERE p.`item_type` = 'kompozit'
  AND pi.`slug` = 'lunapark-oyuncaklari-kabini';

UPDATE `product_i18n` pi
JOIN `product_i18n` tr ON tr.`product_id` = pi.`product_id`
SET
  pi.`title` = 'Lunapark Oyuncakları Kabini',
  pi.`description` = '<h2>Lunapark Oyuncakları Kabini</h2><p>Lunapark ve tema park projelerinde kullanılan tren, çarpışan oto, dönen oyuncak, kızak, kabin, oturak, gövde ve dekoratif figür parçaları için kompozit üretim yapılır. Renkli ürün görselleri ve boyama öncesi ham yüzey örnekleri aynı ürün ailesi altında gösterilir.</p><h3>Üretim Kapsamı</h3><ul><li>Kabin, koltuk, oturak, gövde, kapak ve dekoratif parça üretimi</li><li>Parlak boya, özel renk, çizgi, süsleme ve yüzey efektleri</li><li>Ham kompozit yüzeyden final boyalı ürüne kadar proje bazlı hazırlık</li></ul><h3>Proje Kullanımı</h3><p>Her görsel ayrı ürün değil, aynı lunapark oyuncakları kabini ürün ailesinin farklı açı, renk ve üretim aşaması örnekleridir. Ölçü, bağlantı detayı, adet ve renk bilgisine göre üretim planlanır.</p>',
  pi.`alt` = 'Renkli ve ham kompozit lunapark oyuncakları kabini ürün galerisi',
  pi.`tags` = JSON_ARRAY('lunapark', 'tema park', 'kompozit kabin', 'oyuncak kabini', 'fiberglass', 'renkli ürün', 'ham kompozit'),
  pi.`specifications` = JSON_OBJECT(
    'urun_grubu', 'Lunapark oyuncak kabini ve kompozit parça',
    'gorsel_kapsami', JSON_ARRAY('Boyalı final ürün', 'Ham kompozit yüzey', 'Kabin ve kızak gövdesi', 'Dekoratif figür detayı'),
    'uretim', JSON_ARRAY('Kalıp', 'Laminasyon', 'Trim', 'Boya', 'Montaj hazırlığı'),
    'uygulamalar', JSON_ARRAY('Lunapark treni', 'Tema park aracı', 'Çocuk oyuncağı kabini', 'Dönen oyuncak parçası')
  ),
  pi.`meta_title` = 'Lunapark Oyuncakları Kabini | MOE Kompozit',
  pi.`meta_description` = 'Lunapark ve tema park projeleri için renkli ve ham kompozit kabin, gövde, oturak ve dekoratif parça üretimi.',
  pi.`updated_at` = NOW(3)
WHERE pi.`locale` = 'tr'
  AND tr.`locale` = 'tr'
  AND tr.`slug` = 'lunapark-oyuncaklari-kabini';

UPDATE `product_i18n` pi
JOIN `product_i18n` tr ON tr.`product_id` = pi.`product_id`
SET
  pi.`title` = 'Amusement Ride Cabins and Composite Parts',
  pi.`description` = '<h2>Amusement Ride Cabins and Composite Parts</h2><p>Composite production for amusement and theme park train cabins, ride bodies, seats, covers, decorative figures and related parts. Colorful finished visuals and raw pre-paint examples are presented under the same product family.</p><h3>Production Scope</h3><ul><li>Cabins, seats, ride bodies, covers and decorative composite parts</li><li>Gloss paint, custom colors, stripes, ornament details and surface effects</li><li>Project-based preparation from raw composite surface to finished painted product</li></ul><h3>Project Use</h3><p>Each visual is not a separate product; it is a different angle, color or production-stage example of the same amusement ride cabin product family. Production is planned by dimensions, connection details, quantity and color requirements.</p>',
  pi.`alt` = 'Colorful and raw composite amusement ride cabin gallery',
  pi.`tags` = JSON_ARRAY('amusement park', 'theme park', 'composite cabin', 'ride cabin', 'fiberglass', 'painted product', 'raw composite'),
  pi.`specifications` = JSON_OBJECT(
    'product_group', 'Amusement ride cabin and composite part',
    'visual_scope', JSON_ARRAY('Painted final product', 'Raw composite surface', 'Cabin and sleigh body', 'Decorative figure detail'),
    'production', JSON_ARRAY('Mold', 'Lamination', 'Trim', 'Paint', 'Assembly preparation'),
    'applications', JSON_ARRAY('Amusement train', 'Theme park vehicle', 'Children ride cabin', 'Rotating ride part')
  ),
  pi.`meta_title` = 'Amusement Ride Cabins and Composite Parts | MOE Kompozit',
  pi.`meta_description` = 'Composite cabin, body, seat and decorative part production for amusement and theme park projects.',
  pi.`updated_at` = NOW(3)
WHERE pi.`locale` = 'en'
  AND tr.`locale` = 'tr'
  AND tr.`slug` = 'lunapark-oyuncaklari-kabini';

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;
