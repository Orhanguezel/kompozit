-- =============================================================
-- FILE: 306_kompozit_products.seed.sql
-- MOE Kompozit — Ornek urun verileri (TR/EN)
-- item_type = 'kompozit'
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

INSERT INTO `products`
(
  `id`,
  `item_type`,
  `category_id`,
  `sub_category_id`,
  `price`,
  `image_url`,
  `storage_asset_id`,
  `images`,
  `storage_image_ids`,
  `is_active`,
  `is_featured`,
  `order_num`,
  `product_code`,
  `stock_quantity`,
  `rating`,
  `review_count`
)
VALUES
  (
    'kd010001-7001-4001-9001-dddddddd0001',
    'kompozit',
    'cccc0001-4001-4001-8001-cccccccc0001',
    NULL,
    0.00,
    '/media/gallery-placeholder.svg',
    NULL,
    JSON_ARRAY('/media/gallery-placeholder.svg'),
    JSON_ARRAY(),
    1,
    1,
    10,
    'MOE-CF-PLATE',
    0,
    5.00,
    0
  ),
  (
    'kd010002-7002-4002-9002-dddddddd0002',
    'kompozit',
    'cccc0002-4002-4002-8002-cccccccc0002',
    NULL,
    0.00,
    '/uploads/kompozit/ctp-koruyucu-govde-paneli.jpg',
    'c3000041-0041-4041-8041-000000000041',
    JSON_ARRAY(
      '/uploads/kompozit/ctp-koruyucu-govde-paneli.jpg',
      '/uploads/kompozit/ctp-cam-elyaf-01.jpg',
      '/uploads/kompozit/ctp-dokuma-hibrit-01.jpg',
      '/uploads/kompozit/kompozit-uretim-proses-01.jpg',
      '/uploads/kompozit/kompozit-fabrika-otoklav-01.jpg'
    ),
    JSON_ARRAY(
      'c3000041-0041-4041-8041-000000000041',
      'c3000003-0003-4003-8003-000000000003',
      'c3000004-0004-4004-8004-000000000004',
      'c3000042-0042-4042-8042-000000000042',
      'c3000007-0007-4007-8007-000000000007'
    ),
    1,
    1,
    20,
    'MOE-CTP-PANEL',
    0,
    5.00,
    0
  ),
  (
    'kd010003-7003-4003-9003-dddddddd0003',
    'kompozit',
    'cccc0002-4002-4002-8002-cccccccc0002',
    NULL,
    0.00,
    '/media/gallery-placeholder.svg',
    NULL,
    JSON_ARRAY('/media/gallery-placeholder.svg'),
    JSON_ARRAY(),
    1,
    0,
    30,
    'MOE-FG-COVER',
    0,
    5.00,
    0
  )
ON DUPLICATE KEY UPDATE
  `item_type` = VALUES(`item_type`),
  `category_id` = VALUES(`category_id`),
  `sub_category_id` = VALUES(`sub_category_id`),
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
  `review_count` = VALUES(`review_count`);

INSERT INTO `product_i18n`
(
  `product_id`,
  `locale`,
  `title`,
  `slug`,
  `description`,
  `alt`,
  `tags`,
  `specifications`,
  `meta_title`,
  `meta_description`
)
VALUES
  (
    'kd010001-7001-4001-9001-dddddddd0001',
    'tr',
    'Karbon Fiber Panel Prototipi',
    'karbon-fiber-panel-prototipi',
    'Karbon fiber takviyeli panel prototipi; hafiflik, rijitlik ve seri uretim oncesi dogrulama ihtiyaclari icin ornek bir kompozit urun kaydidir.',
    'Karbon fiber panel prototipi',
    JSON_ARRAY('karbon fiber', 'panel', 'kompozit prototip', 'hafif yapi'),
    JSON_OBJECT('malzeme', 'Karbon fiber takviyeli kompozit', 'proses', 'Prototype tooling', 'uygulama', 'Endustriyel panel ve kapak gruplari'),
    'Karbon Fiber Panel Prototipi | MOE Kompozit',
    'Karbon fiber panel prototipi, hafif ve rijit kompozit parca gelistirme surecleri icin ornek MOE Kompozit urun kaydi.'
  ),
  (
    'kd010001-7001-4001-9001-dddddddd0001',
    'en',
    'Carbon Fiber Panel Prototype',
    'carbon-fiber-panel-prototype',
    'A sample carbon fiber reinforced panel prototype entry for lightweight structural parts, design validation, and pre-series production planning.',
    'Carbon fiber panel prototype',
    JSON_ARRAY('carbon fiber', 'panel prototype', 'composite part', 'lightweight structure'),
    JSON_OBJECT('material', 'Carbon fiber reinforced composite', 'process', 'Prototype tooling', 'application', 'Industrial panels and enclosure parts'),
    'Carbon Fiber Panel Prototype | MOE Kompozit',
    'Sample carbon fiber panel prototype entry by MOE Kompozit for lightweight structural composite development.'
  ),
  (
    'kd010002-7002-4002-9002-dddddddd0002',
    'tr',
    'CTP Koruyucu Govde Paneli',
    'ctp-koruyucu-govde-paneli',
    '<h2>CTP Koruyucu Govde Paneli</h2><p>Cam takviyeli polyester tabanli koruyucu govde paneli; saha dayanimı, kimyasal direnç, darbe toleransi ve tekrarli uretim ihtiyaci olan endustriyel govde uygulamalari icin tasarlanir.</p><h3>Uretim Kapsami</h3><ul><li>Makine govdesi, muhafaza, kapak ve koruyucu panel imalati</li><li>Proje ihtiyacina gore kalip, laminasyon, trim ve montaj hazirligi</li><li>Dis ortam sartlarina uygun jelcoat, boya ve yuzey secenekleri</li></ul><h3>Kullanim Alanlari</h3><p>Belediye ekipmanlari, saha dolaplari, makine korumalari, servis kapaklari ve kimyasal/iklimsel dayanim beklenen teknik parcalar icin uygundur.</p>',
    'CTP koruyucu govde paneli',
    JSON_ARRAY('ctp', 'koruyucu panel', 'cam takviyeli polyester', 'endustriyel govde'),
    JSON_OBJECT('malzeme', 'Cam takviyeli polyester', 'proses', 'Closed mold laminate', 'uygulama', 'Makine govdeleri ve koruyucu muhafazalar'),
    'CTP Koruyucu Govde Paneli | MOE Kompozit',
    'CTP koruyucu govde paneli icin ornek kompozit urun kaydi. Endustriyel panel ve muhafaza uygulamalarina uygun yapi.'
  ),
  (
    'kd010002-7002-4002-9002-dddddddd0002',
    'en',
    'FRP Protective Enclosure Panel',
    'frp-protective-enclosure-panel',
    '<h2>FRP Protective Enclosure Panel</h2><p>Glass fiber reinforced polyester protective panel designed for industrial body, cover and enclosure applications where field durability, chemical resistance and repeatable production are required.</p><h3>Production Scope</h3><ul><li>Machine bodies, protective covers, service lids and enclosure panels</li><li>Project-based mold, lamination, trimming and assembly preparation</li><li>Gelcoat, paint and surface options for outdoor conditions</li></ul><h3>Use Cases</h3><p>Suitable for municipal equipment, field cabinets, machine guards, service covers and technical parts exposed to weather or chemical conditions.</p>',
    'FRP protective enclosure panel',
    JSON_ARRAY('frp', 'enclosure panel', 'industrial body', 'protective cover'),
    JSON_OBJECT('material', 'Glass fiber reinforced polyester', 'process', 'Closed mold laminate', 'application', 'Machine bodies and protective enclosures'),
    'FRP Protective Enclosure Panel | MOE Kompozit',
    'Sample FRP enclosure panel by MOE Kompozit for industrial covers and protective body components.'
  ),
  (
    'kd010003-7003-4003-9003-dddddddd0003',
    'tr',
    'Cam Elyaf Servis Kapagi',
    'cam-elyaf-servis-kapagi',
    'Cam elyaf esasli servis kapagi; dis ortam dayanimı ve kolay montaj gerektiren saha ekipmanlari icin ornek bir galeri ve urun destek kaydidir.',
    'Cam elyaf servis kapagi',
    JSON_ARRAY('cam elyaf', 'servis kapagi', 'fiberglass', 'dis ortam ekipmani'),
    JSON_OBJECT('malzeme', 'Cam elyaf kompozit', 'proses', 'Hand lay-up / trim', 'uygulama', 'Dis ortam servis kapaklari ve saha kutulari'),
    'Cam Elyaf Servis Kapagi | MOE Kompozit',
    'Cam elyaf servis kapagi icin ornek kompozit urun kaydi. Dis ortam ve saha ekipmanlari icin hafif cozum.'
  ),
  (
    'kd010003-7003-4003-9003-dddddddd0003',
    'en',
    'Fiberglass Service Cover',
    'fiberglass-service-cover',
    'Sample fiberglass service cover entry for outdoor equipment requiring light weight, corrosion resistance, and easy installation.',
    'Fiberglass service cover',
    JSON_ARRAY('fiberglass', 'service cover', 'outdoor equipment', 'composite cover'),
    JSON_OBJECT('material', 'Fiberglass composite', 'process', 'Hand lay-up / trim', 'application', 'Outdoor service covers and field boxes'),
    'Fiberglass Service Cover | MOE Kompozit',
    'Sample fiberglass service cover by MOE Kompozit for outdoor equipment and corrosion-resistant field applications.'
  )
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `slug` = VALUES(`slug`),
  `description` = VALUES(`description`),
  `alt` = VALUES(`alt`),
  `tags` = VALUES(`tags`),
  `specifications` = VALUES(`specifications`),
  `meta_title` = VALUES(`meta_title`),
  `meta_description` = VALUES(`meta_description`);

-- =============================================================
-- Lunapark / tema park kompozit urunleri
-- =============================================================

INSERT INTO `products`
(
  `id`,
  `item_type`,
  `category_id`,
  `sub_category_id`,
  `price`,
  `image_url`,
  `storage_asset_id`,
  `images`,
  `storage_image_ids`,
  `is_active`,
  `is_featured`,
  `order_num`,
  `product_code`,
  `stock_quantity`,
  `rating`,
  `review_count`
)
VALUES
  ('lk040001-9101-4101-9101-aaaaaaaa0001', 'kompozit', 'cccc0003-4003-4003-8003-cccccccc0003', NULL, 0.00, '/uploads/kompozit/lunapark-01-renkli.jpg', 'c3000030-0030-4030-8030-000000000030', JSON_ARRAY('/uploads/kompozit/lunapark-01-renkli.jpg'), JSON_ARRAY('c3000030-0030-4030-8030-000000000030'), 1, 1, 311, 'MOE-LP-001', 0, 5.00, 0),
  ('lk040002-9102-4102-9102-aaaaaaaa0002', 'kompozit', 'cccc0003-4003-4003-8003-cccccccc0003', NULL, 0.00, '/uploads/kompozit/lunapark-02-renkli.jpg', 'c3000031-0031-4031-8031-000000000031', JSON_ARRAY('/uploads/kompozit/lunapark-02-renkli.jpg'), JSON_ARRAY('c3000031-0031-4031-8031-000000000031'), 1, 1, 310, 'MOE-LP-002', 0, 5.00, 0),
  ('lk040003-9103-4103-9103-aaaaaaaa0003', 'kompozit', 'cccc0003-4003-4003-8003-cccccccc0003', NULL, 0.00, '/uploads/kompozit/lunapark-03-renkli.jpg', 'c3000032-0032-4032-8032-000000000032', JSON_ARRAY('/uploads/kompozit/lunapark-03-renkli.jpg'), JSON_ARRAY('c3000032-0032-4032-8032-000000000032'), 1, 0, 309, 'MOE-LP-003', 0, 5.00, 0),
  ('lk040004-9104-4104-9104-aaaaaaaa0004', 'kompozit', 'cccc0003-4003-4003-8003-cccccccc0003', NULL, 0.00, '/uploads/kompozit/lunapark-04-renkli.jpg', 'c3000033-0033-4033-8033-000000000033', JSON_ARRAY('/uploads/kompozit/lunapark-04-renkli.jpg'), JSON_ARRAY('c3000033-0033-4033-8033-000000000033'), 1, 0, 308, 'MOE-LP-004', 0, 5.00, 0),
  ('lk040005-9105-4105-9105-aaaaaaaa0005', 'kompozit', 'cccc0003-4003-4003-8003-cccccccc0003', NULL, 0.00, '/uploads/kompozit/lunapark-05-renkli.jpg', 'c3000034-0034-4034-8034-000000000034', JSON_ARRAY('/uploads/kompozit/lunapark-05-renkli.jpg'), JSON_ARRAY('c3000034-0034-4034-8034-000000000034'), 1, 0, 307, 'MOE-LP-005', 0, 5.00, 0),
  ('lk040006-9106-4106-9106-aaaaaaaa0006', 'kompozit', 'cccc0003-4003-4003-8003-cccccccc0003', NULL, 0.00, '/uploads/kompozit/lunapark-06-renkli.jpg', 'c3000035-0035-4035-8035-000000000035', JSON_ARRAY('/uploads/kompozit/lunapark-06-renkli.jpg'), JSON_ARRAY('c3000035-0035-4035-8035-000000000035'), 1, 0, 306, 'MOE-LP-006', 0, 5.00, 0),
  ('lk040007-9107-4107-9107-aaaaaaaa0007', 'kompozit', 'cccc0003-4003-4003-8003-cccccccc0003', NULL, 0.00, '/uploads/kompozit/lunapark-07-renkli.jpg', 'c3000036-0036-4036-8036-000000000036', JSON_ARRAY('/uploads/kompozit/lunapark-07-renkli.jpg'), JSON_ARRAY('c3000036-0036-4036-8036-000000000036'), 1, 0, 305, 'MOE-LP-007', 0, 5.00, 0),
  ('lk040008-9108-4108-9108-aaaaaaaa0008', 'kompozit', 'cccc0003-4003-4003-8003-cccccccc0003', NULL, 0.00, '/uploads/kompozit/lunapark-08-renkli.jpg', 'c3000037-0037-4037-8037-000000000037', JSON_ARRAY('/uploads/kompozit/lunapark-08-renkli.jpg'), JSON_ARRAY('c3000037-0037-4037-8037-000000000037'), 1, 0, 304, 'MOE-LP-008', 0, 5.00, 0),
  ('lk040009-9109-4109-9109-aaaaaaaa0009', 'kompozit', 'cccc0003-4003-4003-8003-cccccccc0003', NULL, 0.00, '/uploads/kompozit/lunapark-09-renkli.jpg', 'c3000038-0038-4038-8038-000000000038', JSON_ARRAY('/uploads/kompozit/lunapark-09-renkli.jpg'), JSON_ARRAY('c3000038-0038-4038-8038-000000000038'), 1, 0, 303, 'MOE-LP-009', 0, 5.00, 0),
  ('lk040010-9110-4110-9110-aaaaaaaa0010', 'kompozit', 'cccc0003-4003-4003-8003-cccccccc0003', NULL, 0.00, '/uploads/kompozit/lunapark-10-ham.jpg', 'c3000039-0039-4039-8039-000000000039', JSON_ARRAY('/uploads/kompozit/lunapark-10-ham.jpg'), JSON_ARRAY('c3000039-0039-4039-8039-000000000039'), 1, 0, 302, 'MOE-LP-010', 0, 5.00, 0),
  ('lk040011-9111-4111-9111-aaaaaaaa0011', 'kompozit', 'cccc0003-4003-4003-8003-cccccccc0003', NULL, 0.00, '/uploads/kompozit/lunapark-11-ham.jpg', 'c3000040-0040-4040-8040-000000000040', JSON_ARRAY('/uploads/kompozit/lunapark-11-ham.jpg'), JSON_ARRAY('c3000040-0040-4040-8040-000000000040'), 1, 0, 301, 'MOE-LP-011', 0, 5.00, 0),
  ('lk040012-9112-4112-9112-aaaaaaaa0012', 'kompozit', 'cccc0003-4003-4003-8003-cccccccc0003', NULL, 0.00, '/uploads/kompozit/lunapark-12-renkli.jpg', 'c3000043-0043-4043-8043-000000000043', JSON_ARRAY('/uploads/kompozit/lunapark-12-renkli.jpg'), JSON_ARRAY('c3000043-0043-4043-8043-000000000043'), 1, 0, 300, 'MOE-LP-012', 0, 5.00, 0),
  ('lk040013-9113-4113-9113-aaaaaaaa0013', 'kompozit', 'cccc0003-4003-4003-8003-cccccccc0003', NULL, 0.00, '/uploads/kompozit/lunapark-13-renkli.jpg', 'c3000044-0044-4044-8044-000000000044', JSON_ARRAY('/uploads/kompozit/lunapark-13-renkli.jpg'), JSON_ARRAY('c3000044-0044-4044-8044-000000000044'), 1, 0, 299, 'MOE-LP-013', 0, 5.00, 0),
  ('lk040014-9114-4114-9114-aaaaaaaa0014', 'kompozit', 'cccc0003-4003-4003-8003-cccccccc0003', NULL, 0.00, '/uploads/kompozit/lunapark-14-renkli.jpg', 'c3000045-0045-4045-8045-000000000045', JSON_ARRAY('/uploads/kompozit/lunapark-14-renkli.jpg'), JSON_ARRAY('c3000045-0045-4045-8045-000000000045'), 1, 0, 298, 'MOE-LP-014', 0, 5.00, 0),
  ('lk040015-9115-4115-9115-aaaaaaaa0015', 'kompozit', 'cccc0003-4003-4003-8003-cccccccc0003', NULL, 0.00, '/uploads/kompozit/lunapark-15-renkli.jpg', 'c3000046-0046-4046-8046-000000000046', JSON_ARRAY('/uploads/kompozit/lunapark-15-renkli.jpg'), JSON_ARRAY('c3000046-0046-4046-8046-000000000046'), 1, 0, 297, 'MOE-LP-015', 0, 5.00, 0),
  ('lk040016-9116-4116-9116-aaaaaaaa0016', 'kompozit', 'cccc0003-4003-4003-8003-cccccccc0003', NULL, 0.00, '/uploads/kompozit/lunapark-16-renkli.jpg', 'c3000047-0047-4047-8047-000000000047', JSON_ARRAY('/uploads/kompozit/lunapark-16-renkli.jpg'), JSON_ARRAY('c3000047-0047-4047-8047-000000000047'), 1, 0, 296, 'MOE-LP-016', 0, 5.00, 0),
  ('lk040017-9117-4117-9117-aaaaaaaa0017', 'kompozit', 'cccc0003-4003-4003-8003-cccccccc0003', NULL, 0.00, '/uploads/kompozit/lunapark-17-renkli.jpg', 'c3000048-0048-4048-8048-000000000048', JSON_ARRAY('/uploads/kompozit/lunapark-17-renkli.jpg'), JSON_ARRAY('c3000048-0048-4048-8048-000000000048'), 1, 0, 295, 'MOE-LP-017', 0, 5.00, 0),
  ('lk040018-9118-4118-9118-aaaaaaaa0018', 'kompozit', 'cccc0003-4003-4003-8003-cccccccc0003', NULL, 0.00, '/uploads/kompozit/lunapark-18-renkli.jpg', 'c3000049-0049-4049-8049-000000000049', JSON_ARRAY('/uploads/kompozit/lunapark-18-renkli.jpg'), JSON_ARRAY('c3000049-0049-4049-8049-000000000049'), 1, 0, 294, 'MOE-LP-018', 0, 5.00, 0)
ON DUPLICATE KEY UPDATE
  `item_type` = VALUES(`item_type`),
  `category_id` = VALUES(`category_id`),
  `sub_category_id` = VALUES(`sub_category_id`),
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
  `review_count` = VALUES(`review_count`);

INSERT INTO `product_i18n`
(
  `product_id`,
  `locale`,
  `title`,
  `slug`,
  `description`,
  `alt`,
  `tags`,
  `specifications`,
  `meta_title`,
  `meta_description`
)
VALUES
  ('lk040001-9101-4101-9101-aaaaaaaa0001', 'tr', 'Renkli Lunapark Oyuncak Kabini', 'renkli-lunapark-oyuncak-kabini', 'Lunapark ve tema park uygulamaları için parlak boyalı, yüksek dayanımlı kompozit oyuncak kabini ve araç gövdesi.', 'Renkli kompozit lunapark oyuncak kabini', JSON_ARRAY('lunapark', 'tema park', 'kompozit kabin', 'fiberglass', 'renkli ürün'), JSON_OBJECT('kaynak', 'lunapark-01-renkli.jpg', 'yuzey', 'Parlak boyalı final ürün', 'uygulama', 'Lunapark çocuk treni ve tema park dekoru'), 'Renkli Lunapark Oyuncak Kabini | MOE Kompozit', 'Lunapark ve tema park projeleri için renkli kompozit oyuncak kabini.'),
  ('lk040002-9102-4102-9102-aaaaaaaa0002', 'tr', 'Kırmızı Altın Kızak Araç Grubu', 'kirmizi-altin-kizak-arac-grubu', 'Parlak kırmızı gövde, beyaz çıta ve altın süs detaylarıyla tamamlanmış kompozit kızak araç grubu.', 'Kırmızı altın kompozit kızak araç grubu', JSON_ARRAY('lunapark', 'kızak araç', 'kompozit', 'parlak boya', 'özel üretim'), JSON_OBJECT('kaynak', 'lunapark-02-renkli.jpg', 'yuzey', 'Parlak boyalı final ürün', 'uygulama', 'Tema park ve eğlence alanı aracı'), 'Kırmızı Altın Kızak Araç Grubu | MOE Kompozit', 'Parlak kırmızı ve altın detaylı kompozit kızak araç grubu.'),
  ('lk040003-9103-4103-9103-aaaaaaaa0003', 'tr', 'Figürlü Lunapark Araç Seti', 'figurlu-lunapark-arac-seti', 'Renkli kabin gövdeleri ve dekoratif figürlerle tema park kullanımına uygun kompozit ürün seti.', 'Figürlü renkli kompozit lunapark araç seti', JSON_ARRAY('lunapark', 'tema park', 'kompozit figür', 'kızak seti', 'oyuncak kabini'), JSON_OBJECT('kaynak', 'lunapark-03-renkli.jpg', 'yuzey', 'Parlak boyalı final ürün', 'figür', 'Dekoratif figür'), 'Figürlü Lunapark Araç Seti | MOE Kompozit', 'Figürlü renkli kompozit lunapark araç seti.'),
  ('lk040004-9104-4104-9104-aaaaaaaa0004', 'tr', 'Renkli Kızak Yakın Plan Modülü', 'renkli-kizak-yakin-plan-modulu', 'Kapitone panel, süsleme ve oturma alanı detaylarını gösteren renkli kompozit kızak modülü.', 'Renkli kompozit kızak yakın plan modülü', JSON_ARRAY('kızak modülü', 'lunapark', 'kompozit', 'kapitone panel', 'boyalı ürün'), JSON_OBJECT('kaynak', 'lunapark-04-renkli.jpg', 'yuzey', 'Parlak boyalı final ürün', 'detay', 'Kapitone panel ve süsler'), 'Renkli Kızak Yakın Plan Modülü | MOE Kompozit', 'Renkli boyalı kompozit kızak modülü yakın plan katalog görseli.'),
  ('lk040005-9105-4105-9105-aaaaaaaa0005', 'tr', 'Geyik Figürlü Kızak Kompozit Set', 'geyik-figurlu-kizak-kompozit-set', 'Boyalı geyik figürü ve kırmızı kızak gövdesiyle lunapark konseptlerine uygun kompozit set.', 'Geyik figürlü renkli kompozit kızak seti', JSON_ARRAY('geyik figürü', 'lunapark', 'tema park', 'kompozit heykel', 'kızak'), JSON_OBJECT('kaynak', 'lunapark-05-renkli.jpg', 'yuzey', 'Parlak boyalı final ürün', 'figür', 'Geyik'), 'Geyik Figürlü Kızak Kompozit Set | MOE Kompozit', 'Geyik figürlü renkli kompozit lunapark kızak seti.'),
  ('lk040006-9106-4106-9106-aaaaaaaa0006', 'tr', 'Geyik Arka Görünüş Kızak Modülü', 'geyik-arka-gorunus-kizak-modulu', 'Geyik figürü ve kızak bağlantı detaylarını arka açıdan gösteren boyalı kompozit lunapark parçası.', 'Geyik arka görünüş renkli kompozit kızak modülü', JSON_ARRAY('geyik figürü', 'kızak modülü', 'kompozit', 'lunapark', 'arka görünüş'), JSON_OBJECT('kaynak', 'lunapark-06-renkli.jpg', 'yuzey', 'Parlak boyalı final ürün', 'aci', 'Arka görünüş'), 'Geyik Arka Görünüş Kızak Modülü | MOE Kompozit', 'Boyalı kompozit geyik ve kızak modülü arka görünüş katalog kaydı.'),
  ('lk040007-9107-4107-9107-aaaaaaaa0007', 'tr', 'Geyik Figürü Kızak Detay Parçası', 'geyik-figuru-kizak-detay-parcasi', 'Geyik figürünün arka silüeti ve kızak kıvrım detaylarını gösteren renkli kompozit parça.', 'Geyik figürü renkli kompozit detay parçası', JSON_ARRAY('geyik figürü', 'kompozit detay', 'lunapark', 'boyalı ürün'), JSON_OBJECT('kaynak', 'lunapark-07-renkli.jpg', 'yuzey', 'Parlak boyalı final ürün', 'detay', 'Geyik ve kızak kıvrımı'), 'Geyik Figürü Kızak Detay Parçası | MOE Kompozit', 'Renkli boyalı geyik figürü ve kızak detay parçası.'),
  ('lk040008-9108-4108-9108-aaaaaaaa0008', 'tr', 'Figürlü Lunapark Kızak Seti', 'figurlu-lunapark-kizak-seti', 'Dekoratif figürler ve çoklu kızak gövdelerini bir arada gösteren renkli kompozit lunapark seti.', 'Figürlü renkli kompozit lunapark kızak seti', JSON_ARRAY('figürlü set', 'geyik', 'kızak seti', 'lunapark', 'tema park'), JSON_OBJECT('kaynak', 'lunapark-08-renkli.jpg', 'yuzey', 'Parlak boyalı final ürün', 'figürler', 'Dekoratif figürler'), 'Figürlü Lunapark Kızak Seti | MOE Kompozit', 'Figürlü renkli kompozit tema park kızak seti.'),
  ('lk040009-9109-4109-9109-aaaaaaaa0009', 'tr', 'Ön Görünüş Lunapark Kızak Araçları', 'on-gorunus-lunapark-kizak-araclari', 'Ön görünüşte sergilenen kırmızı, beyaz ve altın detaylı kompozit lunapark kızak araçları.', 'Ön görünüş renkli kompozit lunapark kızak araçları', JSON_ARRAY('lunapark kızak', 'lunapark', 'kompozit araç', 'tema park', 'ön görünüş'), JSON_OBJECT('kaynak', 'lunapark-09-renkli.jpg', 'yuzey', 'Parlak boyalı final ürün', 'aci', 'Ön görünüş'), 'Ön Görünüş Lunapark Kızak Araçları | MOE Kompozit', 'Ön görünüş renkli kompozit lunapark kızak araçları katalog kaydı.'),
  ('lk040010-9110-4110-9110-aaaaaaaa0010', 'tr', 'Ham Geyik ve Kızak Kompozit Seti', 'ham-geyik-ve-kizak-kompozit-seti', 'Boyama öncesi beyaz ham yüzeyde geyik figürü ve kızak gövdelerini gösteren kompozit set.', 'Ham beyaz geyik ve kızak kompozit seti', JSON_ARRAY('ham kompozit', 'boyasız ürün', 'geyik', 'kızak', 'lunapark'), JSON_OBJECT('kaynak', 'lunapark-10-ham.jpg', 'yuzey', 'Boyasız ham yüzey', 'durum', 'Boya öncesi'), 'Ham Geyik ve Kızak Kompozit Seti | MOE Kompozit', 'Boyama öncesi ham beyaz geyik ve kızak kompozit seti.'),
  ('lk040011-9111-4111-9111-aaaaaaaa0011', 'tr', 'Ham Beyaz Kızak Araç Seti', 'ham-beyaz-kizak-arac-seti', 'Boyama öncesi beyaz ham yüzeyde çoklu kompozit kızak araç gövdeleri.', 'Ham beyaz kompozit kızak araç seti', JSON_ARRAY('ham kompozit', 'boyasız kızak', 'fiberglass', 'lunapark', 'özel üretim'), JSON_OBJECT('kaynak', 'lunapark-11-ham.jpg', 'yuzey', 'Boyasız ham yüzey', 'durum', 'Boya öncesi'), 'Ham Beyaz Kızak Araç Seti | MOE Kompozit', 'Boyama öncesi ham beyaz kompozit kızak araç seti.'),
  ('lk040012-9112-4112-9112-aaaaaaaa0012', 'tr', 'Renkli Lunapark Kompozit Ürün Görseli 12', 'renkli-lunapark-kompozit-urun-gorseli-12', 'Lunapark ve tema park kataloğu için parlak boyalı, temiz çekim renkli kompozit ürün görseli.', 'Renkli kompozit lunapark ürünü katalog görseli 12', JSON_ARRAY('lunapark', 'tema park', 'kompozit', 'renkli ürün', 'katalog'), JSON_OBJECT('kaynak', 'lunapark-12-renkli.jpg', 'yuzey', 'Parlak boyalı final ürün', 'tur', 'Temiz katalog görseli'), 'Renkli Lunapark Kompozit Ürün Görseli 12 | MOE Kompozit', 'Lunapark ve tema park projeleri için renkli kompozit ürün katalog görseli.'),
  ('lk040013-9113-4113-9113-aaaaaaaa0013', 'tr', 'Renkli Lunapark Kompozit Ürün Görseli 13', 'renkli-lunapark-kompozit-urun-gorseli-13', 'Lunapark ve tema park kataloğu için parlak boyalı, temiz çekim renkli kompozit ürün görseli.', 'Renkli kompozit lunapark ürünü katalog görseli 13', JSON_ARRAY('lunapark', 'tema park', 'kompozit', 'renkli ürün', 'katalog'), JSON_OBJECT('kaynak', 'lunapark-13-renkli.jpg', 'yuzey', 'Parlak boyalı final ürün', 'tur', 'Temiz katalog görseli'), 'Renkli Lunapark Kompozit Ürün Görseli 13 | MOE Kompozit', 'Lunapark ve tema park projeleri için renkli kompozit ürün katalog görseli.'),
  ('lk040014-9114-4114-9114-aaaaaaaa0014', 'tr', 'Renkli Lunapark Kompozit Ürün Görseli 14', 'renkli-lunapark-kompozit-urun-gorseli-14', 'Lunapark ve tema park kataloğu için parlak boyalı, temiz çekim renkli kompozit ürün görseli.', 'Renkli kompozit lunapark ürünü katalog görseli 14', JSON_ARRAY('lunapark', 'tema park', 'kompozit', 'renkli ürün', 'katalog'), JSON_OBJECT('kaynak', 'lunapark-14-renkli.jpg', 'yuzey', 'Parlak boyalı final ürün', 'tur', 'Temiz katalog görseli'), 'Renkli Lunapark Kompozit Ürün Görseli 14 | MOE Kompozit', 'Lunapark ve tema park projeleri için renkli kompozit ürün katalog görseli.'),
  ('lk040015-9115-4115-9115-aaaaaaaa0015', 'tr', 'Renkli Lunapark Kompozit Ürün Görseli 15', 'renkli-lunapark-kompozit-urun-gorseli-15', 'Lunapark ve tema park kataloğu için parlak boyalı, temiz çekim renkli kompozit ürün görseli.', 'Renkli kompozit lunapark ürünü katalog görseli 15', JSON_ARRAY('lunapark', 'tema park', 'kompozit', 'renkli ürün', 'katalog'), JSON_OBJECT('kaynak', 'lunapark-15-renkli.jpg', 'yuzey', 'Parlak boyalı final ürün', 'tur', 'Temiz katalog görseli'), 'Renkli Lunapark Kompozit Ürün Görseli 15 | MOE Kompozit', 'Lunapark ve tema park projeleri için renkli kompozit ürün katalog görseli.'),
  ('lk040016-9116-4116-9116-aaaaaaaa0016', 'tr', 'Renkli Lunapark Kompozit Ürün Görseli 16', 'renkli-lunapark-kompozit-urun-gorseli-16', 'Lunapark ve tema park kataloğu için parlak boyalı, temiz çekim renkli kompozit ürün görseli.', 'Renkli kompozit lunapark ürünü katalog görseli 16', JSON_ARRAY('lunapark', 'tema park', 'kompozit', 'renkli ürün', 'katalog'), JSON_OBJECT('kaynak', 'lunapark-16-renkli.jpg', 'yuzey', 'Parlak boyalı final ürün', 'tur', 'Temiz katalog görseli'), 'Renkli Lunapark Kompozit Ürün Görseli 16 | MOE Kompozit', 'Lunapark ve tema park projeleri için renkli kompozit ürün katalog görseli.'),
  ('lk040017-9117-4117-9117-aaaaaaaa0017', 'tr', 'Renkli Lunapark Kompozit Ürün Görseli 17', 'renkli-lunapark-kompozit-urun-gorseli-17', 'Lunapark ve tema park kataloğu için parlak boyalı, temiz çekim renkli kompozit ürün görseli.', 'Renkli kompozit lunapark ürünü katalog görseli 17', JSON_ARRAY('lunapark', 'tema park', 'kompozit', 'renkli ürün', 'katalog'), JSON_OBJECT('kaynak', 'lunapark-17-renkli.jpg', 'yuzey', 'Parlak boyalı final ürün', 'tur', 'Temiz katalog görseli'), 'Renkli Lunapark Kompozit Ürün Görseli 17 | MOE Kompozit', 'Lunapark ve tema park projeleri için renkli kompozit ürün katalog görseli.'),
  ('lk040018-9118-4118-9118-aaaaaaaa0018', 'tr', 'Renkli Lunapark Kompozit Ürün Görseli 18', 'renkli-lunapark-kompozit-urun-gorseli-18', 'Lunapark ve tema park kataloğu için parlak boyalı, temiz çekim renkli kompozit ürün görseli.', 'Renkli kompozit lunapark ürünü katalog görseli 18', JSON_ARRAY('lunapark', 'tema park', 'kompozit', 'renkli ürün', 'katalog'), JSON_OBJECT('kaynak', 'lunapark-18-renkli.jpg', 'yuzey', 'Parlak boyalı final ürün', 'tur', 'Temiz katalog görseli'), 'Renkli Lunapark Kompozit Ürün Görseli 18 | MOE Kompozit', 'Lunapark ve tema park projeleri için renkli kompozit ürün katalog görseli.'),
  ('lk040001-9101-4101-9101-aaaaaaaa0001', 'en', 'Amusement Ride Cabin', 'amusement-ride-cabin', 'Gloss-painted composite ride cabin and vehicle body for amusement and theme park applications.', 'Colorful composite amusement ride cabin', JSON_ARRAY('amusement park', 'theme park', 'composite cabin', 'fiberglass', 'painted product'), JSON_OBJECT('source', 'lunapark-01-renkli.jpg', 'finish', 'Gloss painted final product', 'application', 'Amusement ride and theme park decor'), 'Amusement Ride Cabin | MOE Kompozit', 'Colorful composite ride cabin for amusement and theme park projects.'),
  ('lk040002-9102-4102-9102-aaaaaaaa0002', 'en', 'Red Gold Sleigh Ride Vehicle Group', 'red-gold-sleigh-ride-vehicle-group', 'Composite sleigh ride vehicle group finished with glossy red bodies, white trim, and gold ornament details.', 'Red gold composite sleigh ride vehicle group', JSON_ARRAY('amusement park', 'sleigh vehicle', 'composite', 'gloss paint', 'custom manufacturing'), JSON_OBJECT('source', 'lunapark-02-renkli.jpg', 'finish', 'Gloss painted final product', 'application', 'Theme park and leisure area ride'), 'Red Gold Sleigh Ride Vehicle Group | MOE Kompozit', 'Composite sleigh vehicle group with red and gold glossy finish.'),
  ('lk040003-9103-4103-9103-aaaaaaaa0003', 'en', 'Figured Amusement Ride Set', 'figured-amusement-ride-set', 'Composite product set with colorful cabins and decorative figures for theme park use.', 'Colorful composite amusement ride set with figure details', JSON_ARRAY('amusement park', 'theme park', 'composite figure', 'sleigh set', 'ride cabin'), JSON_OBJECT('source', 'lunapark-03-renkli.jpg', 'finish', 'Gloss painted final product', 'figure', 'Decorative figure'), 'Figured Amusement Ride Set | MOE Kompozit', 'Colorful composite amusement ride set with decorative figure details.'),
  ('lk040004-9104-4104-9104-aaaaaaaa0004', 'en', 'Colorful Sleigh Close-Up Module', 'colorful-sleigh-close-up-module', 'Colorful composite sleigh module showing quilted panels, ornaments, and seat area details.', 'Colorful composite sleigh close-up module', JSON_ARRAY('sleigh module', 'amusement park', 'composite', 'quilted panel', 'painted product'), JSON_OBJECT('source', 'lunapark-04-renkli.jpg', 'finish', 'Gloss painted final product', 'detail', 'Quilted panel and ornaments'), 'Colorful Sleigh Close-Up Module | MOE Kompozit', 'Close-up catalog record for a color-painted composite sleigh module.'),
  ('lk040005-9105-4105-9105-aaaaaaaa0005', 'en', 'Reindeer Figure Composite Sleigh Set', 'reindeer-figure-composite-sleigh-set', 'Composite set with a painted reindeer figure and red sleigh body for amusement park concepts.', 'Colorful composite sleigh set with reindeer figure', JSON_ARRAY('reindeer figure', 'amusement park', 'theme park', 'composite sculpture', 'sleigh'), JSON_OBJECT('source', 'lunapark-05-renkli.jpg', 'finish', 'Gloss painted final product', 'figure', 'Reindeer'), 'Reindeer Figure Composite Sleigh Set | MOE Kompozit', 'Colorful composite amusement park sleigh set with reindeer figure.'),
  ('lk040006-9106-4106-9106-aaaaaaaa0006', 'en', 'Rear-View Reindeer Sleigh Module', 'rear-view-reindeer-sleigh-module', 'Painted composite amusement park part showing reindeer figure and sleigh connection details from the rear.', 'Rear-view colorful composite reindeer sleigh module', JSON_ARRAY('reindeer figure', 'sleigh module', 'composite', 'amusement park', 'rear view'), JSON_OBJECT('source', 'lunapark-06-renkli.jpg', 'finish', 'Gloss painted final product', 'angle', 'Rear view'), 'Rear-View Reindeer Sleigh Module | MOE Kompozit', 'Rear-view catalog record for a painted composite reindeer and sleigh module.'),
  ('lk040007-9107-4107-9107-aaaaaaaa0007', 'en', 'Reindeer Figure Sleigh Detail Part', 'reindeer-figure-sleigh-detail-part', 'Colorful composite part showing the rear silhouette of the reindeer figure and sleigh scroll details.', 'Colorful composite reindeer detail part', JSON_ARRAY('reindeer figure', 'composite detail', 'amusement park', 'painted product'), JSON_OBJECT('source', 'lunapark-07-renkli.jpg', 'finish', 'Gloss painted final product', 'detail', 'Reindeer and sleigh scroll'), 'Reindeer Figure Sleigh Detail Part | MOE Kompozit', 'Color-painted reindeer figure and sleigh detail part.'),
  ('lk040008-9108-4108-9108-aaaaaaaa0008', 'en', 'Figured Amusement Sleigh Set', 'figured-amusement-sleigh-set', 'Colorful composite amusement park set showing decorative figures and multiple sleigh bodies together.', 'Colorful composite sleigh set with decorative figures', JSON_ARRAY('figured set', 'reindeer', 'sleigh set', 'amusement park', 'theme park'), JSON_OBJECT('source', 'lunapark-08-renkli.jpg', 'finish', 'Gloss painted final product', 'figures', 'Decorative figures'), 'Figured Amusement Sleigh Set | MOE Kompozit', 'Colorful composite theme park sleigh set with decorative figures.'),
  ('lk040009-9109-4109-9109-aaaaaaaa0009', 'en', 'Front-View Amusement Sleigh Vehicles', 'front-view-amusement-sleigh-vehicles', 'Composite amusement sleigh vehicles displayed from the front with red, white, and gold finish details.', 'Front-view colorful composite amusement sleigh vehicles', JSON_ARRAY('amusement sleigh', 'amusement park', 'composite vehicle', 'theme park', 'front view'), JSON_OBJECT('source', 'lunapark-09-renkli.jpg', 'finish', 'Gloss painted final product', 'angle', 'Front view'), 'Front-View Amusement Sleigh Vehicles | MOE Kompozit', 'Front-view catalog record for colorful composite amusement sleigh vehicles.'),
  ('lk040010-9110-4110-9110-aaaaaaaa0010', 'en', 'Raw Reindeer and Sleigh Composite Set', 'raw-reindeer-and-sleigh-composite-set', 'Unpainted white composite set showing reindeer figure and sleigh bodies before finishing.', 'Raw white reindeer and sleigh composite set', JSON_ARRAY('raw composite', 'unpainted product', 'reindeer', 'sleigh', 'amusement park'), JSON_OBJECT('source', 'lunapark-10-ham.jpg', 'finish', 'Unpainted raw surface', 'status', 'Before paint'), 'Raw Reindeer and Sleigh Composite Set | MOE Kompozit', 'Raw white composite reindeer and sleigh set before painting.'),
  ('lk040011-9111-4111-9111-aaaaaaaa0011', 'en', 'Raw White Sleigh Ride Vehicle Set', 'raw-white-sleigh-ride-vehicle-set', 'Multiple unpainted white composite sleigh ride vehicle bodies before finishing.', 'Raw white composite sleigh ride vehicle set', JSON_ARRAY('raw composite', 'unpainted sleigh', 'fiberglass', 'amusement park', 'custom manufacturing'), JSON_OBJECT('source', 'lunapark-11-ham.jpg', 'finish', 'Unpainted raw surface', 'status', 'Before paint'), 'Raw White Sleigh Ride Vehicle Set | MOE Kompozit', 'Raw white composite sleigh ride vehicle set before painting.'),
  ('lk040012-9112-4112-9112-aaaaaaaa0012', 'en', 'Colorful Amusement Composite Product Shot 12', 'colorful-amusement-composite-product-shot-12', 'Gloss-painted, clean catalog product shot of a colorful composite item for amusement and theme park use.', 'Colorful composite amusement product catalog shot 12', JSON_ARRAY('amusement park', 'theme park', 'composite', 'painted product', 'catalog'), JSON_OBJECT('source', 'lunapark-12-renkli.jpg', 'finish', 'Gloss painted final product', 'type', 'Clean catalog shot'), 'Colorful Amusement Composite Product Shot 12 | MOE Kompozit', 'Colorful composite product catalog shot for amusement and theme park projects.'),
  ('lk040013-9113-4113-9113-aaaaaaaa0013', 'en', 'Colorful Amusement Composite Product Shot 13', 'colorful-amusement-composite-product-shot-13', 'Gloss-painted, clean catalog product shot of a colorful composite item for amusement and theme park use.', 'Colorful composite amusement product catalog shot 13', JSON_ARRAY('amusement park', 'theme park', 'composite', 'painted product', 'catalog'), JSON_OBJECT('source', 'lunapark-13-renkli.jpg', 'finish', 'Gloss painted final product', 'type', 'Clean catalog shot'), 'Colorful Amusement Composite Product Shot 13 | MOE Kompozit', 'Colorful composite product catalog shot for amusement and theme park projects.'),
  ('lk040014-9114-4114-9114-aaaaaaaa0014', 'en', 'Colorful Amusement Composite Product Shot 14', 'colorful-amusement-composite-product-shot-14', 'Gloss-painted, clean catalog product shot of a colorful composite item for amusement and theme park use.', 'Colorful composite amusement product catalog shot 14', JSON_ARRAY('amusement park', 'theme park', 'composite', 'painted product', 'catalog'), JSON_OBJECT('source', 'lunapark-14-renkli.jpg', 'finish', 'Gloss painted final product', 'type', 'Clean catalog shot'), 'Colorful Amusement Composite Product Shot 14 | MOE Kompozit', 'Colorful composite product catalog shot for amusement and theme park projects.'),
  ('lk040015-9115-4115-9115-aaaaaaaa0015', 'en', 'Colorful Amusement Composite Product Shot 15', 'colorful-amusement-composite-product-shot-15', 'Gloss-painted, clean catalog product shot of a colorful composite item for amusement and theme park use.', 'Colorful composite amusement product catalog shot 15', JSON_ARRAY('amusement park', 'theme park', 'composite', 'painted product', 'catalog'), JSON_OBJECT('source', 'lunapark-15-renkli.jpg', 'finish', 'Gloss painted final product', 'type', 'Clean catalog shot'), 'Colorful Amusement Composite Product Shot 15 | MOE Kompozit', 'Colorful composite product catalog shot for amusement and theme park projects.'),
  ('lk040016-9116-4116-9116-aaaaaaaa0016', 'en', 'Colorful Amusement Composite Product Shot 16', 'colorful-amusement-composite-product-shot-16', 'Gloss-painted, clean catalog product shot of a colorful composite item for amusement and theme park use.', 'Colorful composite amusement product catalog shot 16', JSON_ARRAY('amusement park', 'theme park', 'composite', 'painted product', 'catalog'), JSON_OBJECT('source', 'lunapark-16-renkli.jpg', 'finish', 'Gloss painted final product', 'type', 'Clean catalog shot'), 'Colorful Amusement Composite Product Shot 16 | MOE Kompozit', 'Colorful composite product catalog shot for amusement and theme park projects.'),
  ('lk040017-9117-4117-9117-aaaaaaaa0017', 'en', 'Colorful Amusement Composite Product Shot 17', 'colorful-amusement-composite-product-shot-17', 'Gloss-painted, clean catalog product shot of a colorful composite item for amusement and theme park use.', 'Colorful composite amusement product catalog shot 17', JSON_ARRAY('amusement park', 'theme park', 'composite', 'painted product', 'catalog'), JSON_OBJECT('source', 'lunapark-17-renkli.jpg', 'finish', 'Gloss painted final product', 'type', 'Clean catalog shot'), 'Colorful Amusement Composite Product Shot 17 | MOE Kompozit', 'Colorful composite product catalog shot for amusement and theme park projects.'),
  ('lk040018-9118-4118-9118-aaaaaaaa0018', 'en', 'Colorful Amusement Composite Product Shot 18', 'colorful-amusement-composite-product-shot-18', 'Gloss-painted, clean catalog product shot of a colorful composite item for amusement and theme park use.', 'Colorful composite amusement product catalog shot 18', JSON_ARRAY('amusement park', 'theme park', 'composite', 'painted product', 'catalog'), JSON_OBJECT('source', 'lunapark-18-renkli.jpg', 'finish', 'Gloss painted final product', 'type', 'Clean catalog shot'), 'Colorful Amusement Composite Product Shot 18 | MOE Kompozit', 'Colorful composite product catalog shot for amusement and theme park projects.')
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `slug` = VALUES(`slug`),
  `description` = VALUES(`description`),
  `alt` = VALUES(`alt`),
  `tags` = VALUES(`tags`),
  `specifications` = VALUES(`specifications`),
  `meta_title` = VALUES(`meta_title`),
  `meta_description` = VALUES(`meta_description`);

-- Lunapark gorselleri mevcut "Lunapark Oyuncaklari Kabini" urunune tasindi.
-- Kopya urun satirlari admin panelinde karisiklik yaratmasin diye kaldirilir; storage asset'ler korunur.
DELETE pi FROM `product_i18n` pi
JOIN `products` p ON p.`id` = pi.`product_id`
WHERE p.`product_code` LIKE 'MOE-LP-%';

DELETE FROM `products`
WHERE `product_code` LIKE 'MOE-LP-%';

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;
