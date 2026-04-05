-- =============================================================
-- FILE: 302_kompozit_menu_items.seed.sql
-- MOE Kompozit — Header Reorganization (Consolidated Dropdowns)
-- site_id = 'kompozit'
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- Clear header items to avoid messy overrides
DELETE FROM `menu_items_i18n` WHERE `menu_item_id` IN (SELECT `id` FROM `menu_items` WHERE `site_id` = 'kompozit' AND `location` = 'header');
DELETE FROM `menu_items` WHERE `site_id` = 'kompozit' AND `location` = 'header';

-- =============================================================
-- 1) PARENT (menu_items) — HEADER
-- =============================================================
INSERT INTO `menu_items`
(`id`, `parent_id`, `location`, `section_id`, `site_id`, `type`, `page_id`, `icon`, `order_num`, `is_active`)
VALUES
-- ROOT ITEMS
('dd010001-4001-4001-8001-dd0000000001', NULL, 'header', NULL, 'kompozit', 'custom', NULL, NULL, 0, 1), -- Ana Sayfa
('dd010002-4002-4002-8002-dd0000000002', NULL, 'header', NULL, 'kompozit', 'custom', NULL, NULL, 1, 1), -- Ürünler (Dropdown)
('dd010008-4008-4008-8008-dd0000000008', NULL, 'header', NULL, 'kompozit', 'custom', NULL, NULL, 2, 1), -- Çözümler (Dropdown)
('dd010009-4009-4009-8009-dd0000000009', NULL, 'header', NULL, 'kompozit', 'custom', NULL, NULL, 3, 1), -- Kurumsal (Dropdown)
('dd010006-4006-4006-8006-dd0000000006', NULL, 'header', NULL, 'kompozit', 'custom', NULL, NULL, 4, 1), -- İletişim

-- ÜRÜNLER SUBMENUS
('dd020001-4001-4001-8001-dd0000000001', 'dd010002-4002-4002-8002-dd0000000002', 'header', NULL, 'kompozit', 'custom', NULL, NULL, 0, 1), -- Tüm Ürünler
('dd020002-4002-4002-8002-dd0000000002', 'dd010002-4002-4002-8002-dd0000000002', 'header', NULL, 'kompozit', 'custom', NULL, NULL, 1, 1), -- Karbon Fiber
('dd020003-4003-4003-8003-dd0000000003', 'dd010002-4002-4002-8002-dd0000000002', 'header', NULL, 'kompozit', 'custom', NULL, NULL, 2, 1), -- CTP
('dd020004-4004-4004-8004-dd0000000004', 'dd010002-4002-4002-8002-dd0000000002', 'header', NULL, 'kompozit', 'custom', NULL, NULL, 3, 1), -- Cam Elyaf
('dd020005-4005-4005-8005-dd0000000005', 'dd010002-4002-4002-8002-dd0000000002', 'header', NULL, 'kompozit', 'custom', NULL, NULL, 4, 1), -- Endüstriyel Profiller

-- ÇÖZÜMLER SUBMENUS
('dd080001-7001-4001-8001-dd0000000001', 'dd010008-4008-4008-8008-dd0000000008', 'header', NULL, 'kompozit', 'custom', NULL, NULL, 0, 1), -- Saksı ve Peyzaj
('dd080002-7002-4002-8002-dd0000000002', 'dd010008-4008-4008-8008-dd0000000008', 'header', NULL, 'kompozit', 'custom', NULL, NULL, 1, 1), -- Tabut ve Defin
('dd080003-7003-4003-8003-dd0000000003', 'dd010008-4008-4008-8008-dd0000000008', 'header', NULL, 'kompozit', 'custom', NULL, NULL, 2, 1), -- Depo ve Tank
('dd080004-7004-4004-8004-dd0000000004', 'dd010008-4008-4008-8008-dd0000000008', 'header', NULL, 'kompozit', 'custom', NULL, NULL, 3, 1), -- Özel B2B İmalat

-- KURUMSAL SUBMENUS
('dd090001-8001-4001-8001-dd0000000001', 'dd010009-4009-4009-8009-dd0000000009', 'header', NULL, 'kompozit', 'custom', NULL, NULL, 0, 1), -- Hakkımızda
('dd090002-8002-4002-8002-dd0000000002', 'dd010009-4009-4009-8009-dd0000000009', 'header', NULL, 'kompozit', 'custom', NULL, NULL, 1, 1), -- Galeri
('dd090003-8003-4003-8003-dd0000000003', 'dd010009-4009-4009-8009-dd0000000009', 'header', NULL, 'kompozit', 'custom', NULL, NULL, 2, 1), -- Blog
('dd090004-8004-4004-8004-dd0000000004', 'dd010009-4009-4009-8009-dd0000000009', 'header', NULL, 'kompozit', 'custom', NULL, NULL, 3, 1) -- Referanslar
ON DUPLICATE KEY UPDATE
  `parent_id`  = VALUES(`parent_id`),
  `location`   = VALUES(`location`),
  `site_id`    = VALUES(`site_id`),
  `type`       = VALUES(`type`),
  `order_num`  = VALUES(`order_num`),
  `is_active`  = VALUES(`is_active`);

-- =============================================================
-- 3) I18N — TR
-- =============================================================
INSERT INTO `menu_items_i18n`
(`id`, `menu_item_id`, `locale`, `title`, `url`, `created_at`, `updated_at`)
VALUES
-- ROOT
(UUID(), 'dd010001-4001-4001-8001-dd0000000001', 'tr', 'Ana Sayfa', '/', NOW(3), NOW(3)),
(UUID(), 'dd010002-4002-4002-8002-dd0000000002', 'tr', 'Ürünler', '/products', NOW(3), NOW(3)),
(UUID(), 'dd010008-4008-4008-8008-dd0000000008', 'tr', 'Çözümler', '/solutions', NOW(3), NOW(3)),
(UUID(), 'dd010009-4009-4009-8009-dd0000000009', 'tr', 'Kurumsal', '#', NOW(3), NOW(3)),
(UUID(), 'dd010006-4006-4006-8006-dd0000000006', 'tr', 'İletişim', '/contact', NOW(3), NOW(3)),

-- ÜRÜNLER SUB
(UUID(), 'dd020001-4001-4001-8001-dd0000000001', 'tr', 'Tüm Ürünler', '/products', NOW(3), NOW(3)),
(UUID(), 'dd020002-4002-4002-8002-dd0000000002', 'tr', 'Karbon Fiber Ürünler', '/products?category=karbon-fiber-urunler', NOW(3), NOW(3)),
(UUID(), 'dd020003-4003-4003-8003-dd0000000003', 'tr', 'CTP Ürünler', '/products?category=ctp-urunler', NOW(3), NOW(3)),
(UUID(), 'dd020004-4004-4004-8004-dd0000000004', 'tr', 'Cam Elyaf Ürünler', '/products?category=cam-elyaf-urunler', NOW(3), NOW(3)),
(UUID(), 'dd020005-4005-4005-8005-dd0000000005', 'tr', 'Endüstriyel Profiller', '/products?category=endustriyel-profiller', NOW(3), NOW(3)),

-- ÇÖZÜMLER SUB
(UUID(), 'dd080001-7001-4001-8001-dd0000000001', 'tr', 'Kompozit Saksı ve Peyzaj', '/solutions/solution-planters', NOW(3), NOW(3)),
(UUID(), 'dd080002-7002-4002-8002-dd0000000002', 'tr', 'Kompozit Tabut ve Defin', '/solutions/solution-coffins', NOW(3), NOW(3)),
(UUID(), 'dd080003-7003-4003-8003-dd0000000003', 'tr', 'Depo ve Tank Çözümleri', '/solutions/solution-storage-tanks', NOW(3), NOW(3)),
(UUID(), 'dd080004-7004-4004-8004-dd0000000004', 'tr', 'Özel B2B İmalat', '/solutions/solution-custom-b2b', NOW(3), NOW(3)),

-- KURUMSAL SUB
(UUID(), 'dd090001-8001-4001-8001-dd0000000001', 'tr', 'Hakkımızda', '/about', NOW(3), NOW(3)),
(UUID(), 'dd090002-8002-4002-8002-dd0000000002', 'tr', 'Galeri', '/gallery', NOW(3), NOW(3)),
(UUID(), 'dd090003-8003-4003-8003-dd0000000003', 'tr', 'Blog', '/blog', NOW(3), NOW(3)),
(UUID(), 'dd090004-8004-4004-8004-dd0000000004', 'tr', 'Referanslar', '/references', NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `url` = VALUES(`url`),
  `updated_at` = NOW(3);

-- =============================================================
-- 4) I18N — EN
-- =============================================================
INSERT INTO `menu_items_i18n`
(`id`, `menu_item_id`, `locale`, `title`, `url`, `created_at`, `updated_at`)
VALUES
-- ROOT
(UUID(), 'dd010001-4001-4001-8001-dd0000000001', 'en', 'Home', '/', NOW(3), NOW(3)),
(UUID(), 'dd010002-4002-4002-8002-dd0000000002', 'en', 'Products', '/products', NOW(3), NOW(3)),
(UUID(), 'dd010008-4008-4008-8008-dd0000000008', 'en', 'Solutions', '/solutions', NOW(3), NOW(3)),
(UUID(), 'dd010009-4009-4009-8009-dd0000000009', 'en', 'Corporate', '#', NOW(3), NOW(3)),
(UUID(), 'dd010006-4006-4006-8006-dd0000000006', 'en', 'Contact', '/contact', NOW(3), NOW(3)),

-- ÜRÜNLER SUB
(UUID(), 'dd020001-4001-4001-8001-dd0000000001', 'en', 'All Products', '/products', NOW(3), NOW(3)),
(UUID(), 'dd020002-4002-4002-8002-dd0000000002', 'en', 'Carbon Fiber Products', '/products?category=carbon-fiber-products', NOW(3), NOW(3)),
(UUID(), 'dd020003-4003-4003-8003-dd0000000003', 'en', 'FRP Products', '/products?category=frp-products', NOW(3), NOW(3)),
(UUID(), 'dd020004-4004-4004-8004-dd0000000004', 'en', 'Fiberglass Products', '/products?category=fiberglass-products', NOW(3), NOW(3)),
(UUID(), 'dd020005-4005-4005-8005-dd0000000005', 'en', 'Industrial Profiles', '/products?category=industrial-profiles', NOW(3), NOW(3)),

-- ÇÖZÜMLER SUB
(UUID(), 'dd080001-7001-4001-8001-dd0000000001', 'en', 'Composite Planters', '/solutions/solution-planters', NOW(3), NOW(3)),
(UUID(), 'dd080002-7002-4002-8002-dd0000000002', 'en', 'Composite Coffins', '/solutions/solution-coffins', NOW(3), NOW(3)),
(UUID(), 'dd080003-7003-4003-8003-dd0000000003', 'en', 'Storage & Tank Solutions', '/solutions/solution-storage-tanks', NOW(3), NOW(3)),
(UUID(), 'dd080004-7004-4004-8004-dd0000000004', 'en', 'Custom B2B Manufacturing', '/solutions/solution-custom-b2b', NOW(3), NOW(3)),

-- KURUMSAL SUB
(UUID(), 'dd090001-8001-4001-8001-dd0000000001', 'en', 'About Us', '/about', NOW(3), NOW(3)),
(UUID(), 'dd090002-8002-4002-8002-dd0000000002', 'en', 'Gallery', '/gallery', NOW(3), NOW(3)),
(UUID(), 'dd090003-8003-4003-8003-dd0000000003', 'en', 'Blog', '/blog', NOW(3), NOW(3)),
(UUID(), 'dd090004-8004-4004-8004-dd0000000004', 'en', 'References', '/references', NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `url` = VALUES(`url`),
  `updated_at` = NOW(3);

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;
