-- =============================================================
-- FILE: 300_kompozit_categories.seed.sql
-- MOE Kompozit — 7 ürün kategorisi + i18n (TR/EN)
-- module_key = 'kompozit'
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- =========================
-- 1) CATEGORIES (BASE)
-- =========================
INSERT INTO `categories`
(
  `id`,
  `module_key`,
  `image_url`,
  `storage_asset_id`,
  `alt`,
  `icon`,
  `is_active`,
  `is_featured`,
  `display_order`
)
VALUES
  ('cccc0001-4001-4001-8001-cccccccc0001', 'kompozit', NULL, NULL, NULL, NULL, 1, 1, 10),
  ('cccc0002-4002-4002-8002-cccccccc0002', 'kompozit', NULL, NULL, NULL, NULL, 1, 1, 20),
  ('cccc0003-4003-4003-8003-cccccccc0003', 'kompozit', NULL, NULL, NULL, NULL, 1, 1, 30),
  ('cccc0004-4004-4004-8004-cccccccc0004', 'kompozit', NULL, NULL, NULL, NULL, 1, 0, 40),
  ('cccc0005-4005-4005-8005-cccccccc0005', 'kompozit', NULL, NULL, NULL, NULL, 1, 0, 50),
  ('cccc0006-4006-4006-8006-cccccccc0006', 'kompozit', NULL, NULL, NULL, NULL, 1, 0, 60),
  ('cccc0007-4007-4007-8007-cccccccc0007', 'kompozit', NULL, NULL, NULL, NULL, 1, 0, 70)
ON DUPLICATE KEY UPDATE
  `module_key` = VALUES(`module_key`),
  `is_active` = VALUES(`is_active`),
  `display_order` = VALUES(`display_order`);

-- =========================
-- 2) CATEGORY I18N — TR
-- 2026-09-25: TR adlari canli (admin) ile esitlendi; EN karsiliklari bunlarin cevirisi (332 yamasi).
-- =========================
INSERT INTO `category_i18n`
(
  `category_id`,
  `locale`,
  `name`,
  `slug`,
  `description`
)
VALUES
  ('cccc0001-4001-4001-8001-cccccccc0001', 'tr', 'Karbon Fiber Ürünler', 'karbon-fiber-urunler', 'Yüksek mukavemetli karbon fiber kompozit ürünler'),
  ('cccc0002-4002-4002-8002-cccccccc0002', 'tr', 'Belediyeler İçin Ürünler', 'belediyeler-icin-kompozit-ctp-polyester-urunler', 'CTP ( camelyaf takviyeli polyester, kompozit, fiberglas) malzemeden tabut, saksı, rögar kapağı, logar, çöp konteyneri, çöp kutusu imalatı ve satışı. Projenize ve kalıbınıza uygun üretim yapmaktayız.'),
  ('cccc0003-4003-4003-8003-cccccccc0003', 'tr', 'Lunapark Ürünleri', 'lunapark-urunleri', 'Tren, çarpışan araba, roller coaster, balerin, zincir, dönme dolap, atlı karınca gibi oyuncakların kabinleri ve her çeşit koltuklarının imalatı'),
  ('cccc0004-4004-4004-8004-cccccccc0004', 'tr', 'Peyzaj Ürünleri', 'peyzaj-urunleri-ctp', 'Polyester (CTP, kompozit) malzemeden dekoratif saksı, oturak, park malzemesi, kaydırak, çöp kovası, salıncak, tahteravalli imalatı.'),
  ('cccc0005-4005-4005-8005-cccccccc0005', 'tr', 'Kompozit Paneller', 'kompozit-paneller', 'Sandwich panel ve düz plaka kompozit ürünler'),
  ('cccc0006-4006-4006-8006-cccccccc0006', 'tr', 'Özel Üretim', 'ozel-uretim', 'Projeye özel tasarım ve üretim çözümleri'),
  ('cccc0007-4007-4007-8007-cccccccc0007', 'tr', 'Kalıp ve Parçalar', 'kalip-ve-parcalar', 'Kompozit kalıp ve yedek parça üretimi')
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `slug` = VALUES(`slug`),
  `description` = VALUES(`description`);

-- =========================
-- 3) CATEGORY I18N — EN
-- =========================
INSERT INTO `category_i18n`
(
  `category_id`,
  `locale`,
  `name`,
  `slug`,
  `description`
)
VALUES
  ('cccc0001-4001-4001-8001-cccccccc0001', 'en', 'Carbon Fiber Products', 'carbon-fiber-products', 'High-strength carbon fiber composite products'),
  ('cccc0002-4002-4002-8002-cccccccc0002', 'en', 'Municipal Products', 'municipal-products', 'Coffins, planters, manhole covers, waste containers and litter bins made from FRP (glass-fibre reinforced polyester) composite, manufactured to your project and mould.'),
  ('cccc0003-4003-4003-8003-cccccccc0003', 'en', 'Amusement Park Products', 'amusement-park-products', 'Cabins and all types of seats for rides such as trains, bumper cars, roller coasters, ballerina rides, chair swings, Ferris wheels and carousels.'),
  ('cccc0004-4004-4004-8004-cccccccc0004', 'en', 'Landscape Products', 'landscape-products', 'Decorative planters, benches, park furniture, slides, litter bins, swings and seesaws made from polyester (FRP) composite.'),
  ('cccc0005-4005-4005-8005-cccccccc0005', 'en', 'Composite Panels', 'composite-panels', 'Sandwich panel and flat plate composite products'),
  ('cccc0006-4006-4006-8006-cccccccc0006', 'en', 'Custom Manufacturing', 'custom-manufacturing', 'Project-specific design and manufacturing solutions'),
  ('cccc0007-4007-4007-8007-cccccccc0007', 'en', 'Molds & Parts', 'molds-and-parts', 'Composite mold and spare parts manufacturing')
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `slug` = VALUES(`slug`),
  `description` = VALUES(`description`);

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;
