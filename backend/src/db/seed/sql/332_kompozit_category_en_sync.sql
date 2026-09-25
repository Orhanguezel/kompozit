-- =============================================================
-- FILE: 332_kompozit_category_en_sync.sql
-- MOE Kompozit — EN kategori adlarini TR ile esitler (2026-09-25)
-- Neden: TR adlari admin panelden guncellenmis (Belediyeler / Lunapark / Peyzaj),
-- EN satirlari eski katalogdan kalmisti (FRP / Fiberglass / Industrial Profiles);
-- ornegin saksi urunu EN'de "Industrial Profiles" altinda gorunuyordu.
-- Eski EN slug'lari frontend'de 301 ile yenilerine gider. Idempotent.
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

START TRANSACTION;

UPDATE `category_i18n` SET
  `name` = 'Municipal Products',
  `slug` = 'municipal-products',
  `description` = 'Coffins, planters, manhole covers, waste containers and litter bins made from FRP (glass-fibre reinforced polyester) composite, manufactured to your project and mould.'
WHERE `category_id` = 'cccc0002-4002-4002-8002-cccccccc0002' AND `locale` = 'en';

UPDATE `category_i18n` SET
  `name` = 'Amusement Park Products',
  `slug` = 'amusement-park-products',
  `description` = 'Cabins and all types of seats for rides such as trains, bumper cars, roller coasters, ballerina rides, chair swings, Ferris wheels and carousels.'
WHERE `category_id` = 'cccc0003-4003-4003-8003-cccccccc0003' AND `locale` = 'en';

UPDATE `category_i18n` SET
  `name` = 'Landscape Products',
  `slug` = 'landscape-products',
  `description` = 'Decorative planters, benches, park furniture, slides, litter bins, swings and seesaws made from polyester (FRP) composite.'
WHERE `category_id` = 'cccc0004-4004-4004-8004-cccccccc0004' AND `locale` = 'en';

-- Header "Urunler" alt menusu (frontend canli kategorilerle ezer; kayitlar da tutarli kalsin)
UPDATE `menu_items_i18n` SET `title` = 'Belediyeler İçin Ürünler', `url` = '/products?category=belediyeler-icin-kompozit-ctp-polyester-urunler' WHERE `menu_item_id` = 'dd020003-4003-4003-8003-dd0000000003' AND `locale` = 'tr';
UPDATE `menu_items_i18n` SET `title` = 'Lunapark Ürünleri', `url` = '/products?category=lunapark-urunleri' WHERE `menu_item_id` = 'dd020004-4004-4004-8004-dd0000000004' AND `locale` = 'tr';
UPDATE `menu_items_i18n` SET `title` = 'Peyzaj Ürünleri', `url` = '/products?category=peyzaj-urunleri-ctp' WHERE `menu_item_id` = 'dd020005-4005-4005-8005-dd0000000005' AND `locale` = 'tr';
UPDATE `menu_items_i18n` SET `title` = 'Municipal Products', `url` = '/products?category=municipal-products' WHERE `menu_item_id` = 'dd020003-4003-4003-8003-dd0000000003' AND `locale` = 'en';
UPDATE `menu_items_i18n` SET `title` = 'Amusement Park Products', `url` = '/products?category=amusement-park-products' WHERE `menu_item_id` = 'dd020004-4004-4004-8004-dd0000000004' AND `locale` = 'en';
UPDATE `menu_items_i18n` SET `title` = 'Landscape Products', `url` = '/products?category=landscape-products' WHERE `menu_item_id` = 'dd020005-4005-4005-8005-dd0000000005' AND `locale` = 'en';

COMMIT;
