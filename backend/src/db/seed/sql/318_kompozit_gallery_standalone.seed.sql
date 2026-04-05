-- =============================================================
-- 318_kompozit_gallery_standalone.seed.sql
-- MOE Kompozit — Bağımsız galeri + tüm storage_assets resimleri
-- Mevcut ürün galerilerine de (de) dil desteği eklenir.
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- ----------------------------------------------------------------
-- 1. Mevcut ürün galerilerine Almanca (de) i18n ekle
--    (gallery_client "de" locale varsayılanıyla çalışsın)
-- ----------------------------------------------------------------

INSERT INTO `gallery_i18n`
  (`gallery_id`, `locale`, `title`, `slug`, `description`, `meta_title`, `meta_description`)
VALUES
  (
    'kg010001-8001-4001-9001-eeeeeeee0001',
    'de',
    'Karbonfaserplatten-Galerie',
    'karbonfaserplatten-galerie',
    'Galerie einer Karbonfaserplatte vom Prototyp bis zur Endkontrolle.',
    'Karbonfaserplatten-Galerie | MOE Kompozit',
    'Karbonfaserplatten-Galerie mit Prototyp-, Schneid- und Vormontagekontrollschritten.'
  ),
  (
    'kg010002-8002-4002-9002-eeeeeeee0002',
    'de',
    'GFK-Gehäuseplatte Produktionsgalerie',
    'gfk-gehaeuseplatte-produktionsgalerie',
    'Galerie mit Formvorbereitung, Laminierung und Beschneidung einer GFK-Gehäuseplatte.',
    'GFK-Gehäuseplatte Produktionsgalerie | MOE Kompozit',
    'GFK-Gehäuseplatte Produktionsgalerie – Formvorbereitung, Laminierung und Beschneidung.'
  )
ON DUPLICATE KEY UPDATE
  `title`            = VALUES(`title`),
  `slug`             = VALUES(`slug`),
  `description`      = VALUES(`description`),
  `meta_title`       = VALUES(`meta_title`),
  `meta_description` = VALUES(`meta_description`);

-- ----------------------------------------------------------------
-- 2. Bağımsız (standalone) ana galeri
-- ----------------------------------------------------------------

INSERT INTO `galleries`
  (`id`, `module_key`, `source_id`, `source_type`, `is_active`, `is_featured`, `display_order`)
VALUES
  (
    'kg010100-8100-4100-9100-eeeeeeee0100',
    'kompozit',
    NULL,
    'standalone',
    1,
    1,
    1
  )
ON DUPLICATE KEY UPDATE
  `is_active`     = VALUES(`is_active`),
  `is_featured`   = VALUES(`is_featured`),
  `display_order` = VALUES(`display_order`);

INSERT INTO `gallery_i18n`
  (`gallery_id`, `locale`, `title`, `slug`, `description`, `meta_title`, `meta_description`)
VALUES
  (
    'kg010100-8100-4100-9100-eeeeeeee0100',
    'tr',
    'MOE Kompozit Ürün Galerisi',
    'moe-kompozit-urun-galerisi',
    'Karbon fiber, CTP ve kompozit üretim süreçlerine ait fotoğraf galerisi.',
    'MOE Kompozit Ürün Galerisi',
    'MOE Kompozit ürün ve üretim süreç fotoğrafları.'
  ),
  (
    'kg010100-8100-4100-9100-eeeeeeee0100',
    'en',
    'MOE Kompozit Product Gallery',
    'moe-kompozit-product-gallery',
    'Photo gallery of carbon fiber, FRP and composite manufacturing processes.',
    'MOE Kompozit Product Gallery',
    'MOE Kompozit product and manufacturing process photos.'
  ),
  (
    'kg010100-8100-4100-9100-eeeeeeee0100',
    'de',
    'MOE Kompozit Produktgalerie',
    'moe-kompozit-produktgalerie',
    'Fotogalerie von Karbonfaser-, GFK- und Verbundwerkstoffherstellungsprozessen.',
    'MOE Kompozit Produktgalerie',
    'MOE Kompozit Produkt- und Fertigungsprozessfotos.'
  )
ON DUPLICATE KEY UPDATE
  `title`            = VALUES(`title`),
  `slug`             = VALUES(`slug`),
  `description`      = VALUES(`description`),
  `meta_title`       = VALUES(`meta_title`),
  `meta_description` = VALUES(`meta_description`);

-- ----------------------------------------------------------------
-- 3. Standalone galeriye storage_assets'ten tüm resimler
-- ----------------------------------------------------------------

INSERT INTO `gallery_images`
  (`id`, `gallery_id`, `storage_asset_id`, `image_url`, `display_order`, `is_cover`)
VALUES
  ('kg030001-9001-4001-9001-ffffffffff01', 'kg010100-8100-4100-9100-eeeeeeee0100', NULL, '/media/kompozit/karbon-fiber-panel-01.jpg',       10, 1),
  ('kg030002-9002-4002-9002-ffffffffff02', 'kg010100-8100-4100-9100-eeeeeeee0100', NULL, '/media/kompozit/karbon-fiber-doku-01.jpg',        20, 0),
  ('kg030003-9003-4003-9003-ffffffffff03', 'kg010100-8100-4100-9100-eeeeeeee0100', NULL, '/media/kompozit/karbon-fiber-detay-01.jpg',       30, 0),
  ('kg030004-9004-4004-9004-ffffffffff04', 'kg010100-8100-4100-9100-eeeeeeee0100', NULL, '/media/kompozit/karbon-fiber-hammadde-01.jpg',    40, 0),
  ('kg030005-9005-4005-9005-ffffffffff05', 'kg010100-8100-4100-9100-eeeeeeee0100', NULL, '/media/kompozit/ctp-cam-elyaf-01.jpg',            50, 0),
  ('kg030006-9006-4006-9006-ffffffffff06', 'kg010100-8100-4100-9100-eeeeeeee0100', NULL, '/media/kompozit/ctp-dokuma-hibrit-01.jpg',        60, 0),
  ('kg030007-9007-4007-9007-ffffffffff07', 'kg010100-8100-4100-9100-eeeeeeee0100', NULL, '/media/kompozit/kompozit-fabrika-otoklav-01.jpg', 70, 0),
  ('kg030008-9008-4008-9008-ffffffffff08', 'kg010100-8100-4100-9100-eeeeeeee0100', NULL, '/media/kompozit/kompozit-uretim-proses-01.jpg',   80, 0)
ON DUPLICATE KEY UPDATE
  `image_url`     = VALUES(`image_url`),
  `display_order` = VALUES(`display_order`),
  `is_cover`      = VALUES(`is_cover`);

-- ----------------------------------------------------------------
-- 4. Standalone galeri resimleri için i18n (tr/en/de)
-- ----------------------------------------------------------------

INSERT INTO `gallery_image_i18n`
  (`image_id`, `locale`, `alt`, `caption`, `description`)
VALUES
  -- karbon-fiber-panel-01 TR
  ('kg030001-9001-4001-9001-ffffffffff01', 'tr', 'Karbon fiber panel', 'Karbon fiber panel yüzeyi', 'Karbon fiber panelin yüzey ve kenar görünümü.'),
  ('kg030001-9001-4001-9001-ffffffffff01', 'en', 'Carbon fiber panel', 'Carbon fiber panel surface', 'Surface and edge view of carbon fiber panel.'),
  ('kg030001-9001-4001-9001-ffffffffff01', 'de', 'Karbonfaserplatte', 'Karbonfaserplatten-Oberfläche', 'Oberflächen- und Kantenansicht der Karbonfaserplatte.'),
  -- karbon-fiber-doku-01
  ('kg030002-9002-4002-9002-ffffffffff02', 'tr', 'Karbon fiber doku', 'Dokuma desen detayı', 'Karbon fiber kumaşın dokuma desen yakın çekimi.'),
  ('kg030002-9002-4002-9002-ffffffffff02', 'en', 'Carbon fiber texture', 'Weave pattern detail', 'Close-up of the weave pattern on carbon fiber fabric.'),
  ('kg030002-9002-4002-9002-ffffffffff02', 'de', 'Karbonfaser-Textur', 'Webmusterdetail', 'Nahaufnahme des Webmusters auf Karbonfasergewebe.'),
  -- karbon-fiber-detay-01
  ('kg030003-9003-4003-9003-ffffffffff03', 'tr', 'Karbon fiber detay', 'Yüzey detay çekimi', 'Karbon fiber kompozit yüzey detay görüntüsü.'),
  ('kg030003-9003-4003-9003-ffffffffff03', 'en', 'Carbon fiber detail', 'Surface detail shot', 'Detail image of carbon fiber composite surface.'),
  ('kg030003-9003-4003-9003-ffffffffff03', 'de', 'Karbonfaserdetail', 'Oberflächendetailaufnahme', 'Detailbild der Karbonfaser-Verbundwerkstoffoberfläche.'),
  -- karbon-fiber-hammadde-01
  ('kg030004-9004-4004-9004-ffffffffff04', 'tr', 'Karbon fiber hammadde', 'Ham kumaş rulosu', 'İşlenmemiş karbon fiber kumaş rulosu.'),
  ('kg030004-9004-4004-9004-ffffffffff04', 'en', 'Carbon fiber raw material', 'Raw fabric roll', 'Unprocessed carbon fiber fabric roll.'),
  ('kg030004-9004-4004-9004-ffffffffff04', 'de', 'Karbonfaser-Rohmaterial', 'Rohgeweberolle', 'Unverarbeitete Karbonfasergeweberolle.'),
  -- ctp-cam-elyaf-01
  ('kg030005-9005-4005-9005-ffffffffff05', 'tr', 'CTP cam elyaf', 'Cam elyaf tabakası', 'Cam takviyeli plastik (CTP) için cam elyaf tabakası.'),
  ('kg030005-9005-4005-9005-ffffffffff05', 'en', 'FRP glass fiber', 'Glass fiber layer', 'Glass fiber layer for fiber-reinforced plastic (FRP).'),
  ('kg030005-9005-4005-9005-ffffffffff05', 'de', 'GFK-Glasfaser', 'Glasfaserschicht', 'Glasfaserschicht für glasfaserverstärkten Kunststoff (GFK).'),
  -- ctp-dokuma-hibrit-01
  ('kg030006-9006-4006-9006-ffffffffff06', 'tr', 'CTP dokuma hibrit', 'Hibrit dokuma kumaş', 'Cam elyaf ve karbon fiber hibrit dokuma kumaş.'),
  ('kg030006-9006-4006-9006-ffffffffff06', 'en', 'FRP hybrid weave', 'Hybrid weave fabric', 'Glass fiber and carbon fiber hybrid weave fabric.'),
  ('kg030006-9006-4006-9006-ffffffffff06', 'de', 'GFK-Hybridgewebe', 'Hybridgewebestoff', 'Glasfaser- und Karbonfaser-Hybridgewebe.'),
  -- kompozit-fabrika-otoklav-01
  ('kg030007-9007-4007-9007-ffffffffff07', 'tr', 'Kompozit fabrika otoklav', 'Otoklav kür fırını', 'Kompozit parçaların kür edildiği otoklav fırını.'),
  ('kg030007-9007-4007-9007-ffffffffff07', 'en', 'Composite factory autoclave', 'Autoclave curing oven', 'Autoclave oven used for curing composite parts.'),
  ('kg030007-9007-4007-9007-ffffffffff07', 'de', 'Verbundwerkstoff-Autoklav', 'Autoklav-Härteofen', 'Autoklav-Ofen zur Härtung von Verbundwerkstoffteilen.'),
  -- kompozit-uretim-proses-01
  ('kg030008-9008-4008-9008-ffffffffff08', 'tr', 'Kompozit üretim proses', 'Üretim hattı', 'Kompozit malzeme üretim prosesi genel görünümü.'),
  ('kg030008-9008-4008-9008-ffffffffff08', 'en', 'Composite production process', 'Production line', 'General view of composite material production process.'),
  ('kg030008-9008-4008-9008-ffffffffff08', 'de', 'Verbundwerkstoff-Produktionsprozess', 'Produktionslinie', 'Gesamtansicht des Verbundwerkstoff-Produktionsprozesses.')
ON DUPLICATE KEY UPDATE
  `alt`         = VALUES(`alt`),
  `caption`     = VALUES(`caption`),
  `description` = VALUES(`description`);

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;
