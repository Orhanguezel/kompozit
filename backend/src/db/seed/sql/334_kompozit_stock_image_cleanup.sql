-- =============================================================
-- FILE: 334_kompozit_stock_image_cleanup.sql
-- MOE Kompozit — urun sayfalarindaki stok gorseller temizlendi (2026-09-25)
-- Neden: malzeme/proses stok gorselleri (cam elyaf keçe, hibrit dokuma, uretim
-- prosesi, otoklav) ve CTP koruyucu govde paneli fotografi 4-8 urune dolgu olarak
-- eklenmisti; ornegin tabut sayfasinda otoklav gorunuyordu. Urunun kendi
-- fotograflari ve cop urunlerinin birbirine ait gercek fotograflari korunur.
-- storage_image_ids: yalniz cikarilan gorsellerin kimlikleri dusurulur.
-- Ayrica yalniz stok gorsel iceren iki galeri pasife alinir (silme yok). Idempotent.
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

START TRANSACTION;

UPDATE `products` SET `images` = '["/uploads/kompozit/ctp-koruyucu-govde-paneli.jpg"]', `storage_image_ids` = '["c3000041-0041-4041-8041-000000000041", "c3000003-0003-4003-8003-000000000003", "c3000004-0004-4004-8004-000000000004", "c3000007-0007-4007-8007-000000000007"]' WHERE `id` = 'kd010002-7002-4002-9002-dddddddd0002';
UPDATE `products` SET `images` = '["/uploads/kompozit/cop-konteyneri.jpg", "/uploads/kompozit/belediye-cop-konteyneri.jpg", "/uploads/kompozit/cop-kutusu.jpg"]', `storage_image_ids` = '["c3000050-0050-4050-8050-000000000050", "c3000053-0053-4053-8053-000000000053", "c3000052-0052-4052-8052-000000000052"]' WHERE `id` = 'kd040001-9201-4201-9201-bbbbbbbb0001';
UPDATE `products` SET `images` = '["/uploads/kompozit/tabut.jpg"]', `storage_image_ids` = '["c3000051-0051-4051-8051-000000000051", "c3000003-0003-4003-8003-000000000003"]' WHERE `id` = 'kd040002-9202-4202-9202-bbbbbbbb0002';
UPDATE `products` SET `images` = '["/uploads/kompozit/cop-kutusu.jpg", "/uploads/kompozit/cop-konteyneri.jpg", "/uploads/kompozit/belediye-cop-konteyneri.jpg"]', `storage_image_ids` = '["c3000052-0052-4052-8052-000000000052", "c3000050-0050-4050-8050-000000000050", "c3000053-0053-4053-8053-000000000053"]' WHERE `id` = 'kd040003-9203-4203-9203-bbbbbbbb0003';
UPDATE `products` SET `images` = '["/uploads/kompozit/belediye-cop-konteyneri.jpg", "/uploads/kompozit/cop-konteyneri.jpg", "/uploads/kompozit/cop-kutusu.jpg"]', `storage_image_ids` = '["c3000053-0053-4053-8053-000000000053", "c3000050-0050-4050-8050-000000000050", "c3000052-0052-4052-8052-000000000052"]' WHERE `id` = 'kd040004-9204-4204-9204-bbbbbbbb0004';
UPDATE `products` SET `images` = '["/uploads/kompozit/su-deposu.jpg"]', `storage_image_ids` = '["c3000054-0054-4054-8054-000000000054", "c3000003-0003-4003-8003-000000000003", "c3000004-0004-4004-8004-000000000004", "c3000007-0007-4007-8007-000000000007"]' WHERE `id` = 'kd040005-9205-4205-9205-bbbbbbbb0005';
UPDATE `products` SET `images` = '["/uploads/kompozit/tren-parcalari.jpg"]', `storage_image_ids` = '["c3000055-0055-4055-8055-000000000055", "c3000003-0003-4003-8003-000000000003", "c3000004-0004-4004-8004-000000000004"]' WHERE `id` = 'kd040006-9206-4206-9206-bbbbbbbb0006';
UPDATE `products` SET `images` = '["/uploads/kompozit/savunma-sanayi-kompozit-parcalari.jpg"]', `storage_image_ids` = '["c3000056-0056-4056-8056-000000000056", "c3000003-0003-4003-8003-000000000003", "c3000004-0004-4004-8004-000000000004"]' WHERE `id` = 'kd040007-9207-4207-9207-bbbbbbbb0007';

UPDATE `galleries` SET `is_active` = 0
WHERE `id` IN ('97010001-8001-4001-9001-eeeeeeee0001', '97010002-8002-4002-9002-eeeeeeee0002');

COMMIT;
