-- =============================================================
-- FILE: 311_kompozit_category_tree_cleanup.sql
-- MOE Kompozit — kategori agacini aktif urun hatlarina indirger
-- Not:
-- - Ornek kompozit urun seti yalnizca ilk 3 kategoriyi kullaniyor.
-- - Kalan dallar silinmez; FK riskini onlemek icin pasife cekilir.
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- Aktif urun hatlari: seed urunleri kullanan ilk 3 kategori
UPDATE `categories`
SET
  `is_active` = CASE
    WHEN `id` IN (
      'cccc0001-4001-4001-8001-cccccccc0001',
      'cccc0002-4002-4002-8002-cccccccc0002',
      'cccc0003-4003-4003-8003-cccccccc0003'
    ) THEN 1
    ELSE 0
  END,
  `is_featured` = CASE
    WHEN `id` IN (
      'cccc0001-4001-4001-8001-cccccccc0001',
      'cccc0002-4002-4002-8002-cccccccc0002',
      'cccc0003-4003-4003-8003-cccccccc0003'
    ) THEN 1
    ELSE 0
  END,
  `display_order` = CASE `id`
    WHEN 'cccc0001-4001-4001-8001-cccccccc0001' THEN 10
    WHEN 'cccc0002-4002-4002-8002-cccccccc0002' THEN 20
    WHEN 'cccc0003-4003-4003-8003-cccccccc0003' THEN 30
    WHEN 'cccc0004-4004-4004-8004-cccccccc0004' THEN 90
    WHEN 'cccc0005-4005-4005-8005-cccccccc0005' THEN 100
    WHEN 'cccc0006-4006-4006-8006-cccccccc0006' THEN 110
    WHEN 'cccc0007-4007-4007-8007-cccccccc0007' THEN 120
    ELSE `display_order`
  END
WHERE `module_key` = 'kompozit';

-- Kullanilmayan dallarin altinda varsa subcategory'leri de pasife cek
UPDATE `sub_categories` sc
INNER JOIN `categories` c ON c.`id` = sc.`category_id`
SET
  sc.`is_active` = CASE
    WHEN c.`id` IN (
      'cccc0001-4001-4001-8001-cccccccc0001',
      'cccc0002-4002-4002-8002-cccccccc0002',
      'cccc0003-4003-4003-8003-cccccccc0003'
    ) THEN sc.`is_active`
    ELSE 0
  END,
  sc.`is_featured` = CASE
    WHEN c.`id` IN (
      'cccc0001-4001-4001-8001-cccccccc0001',
      'cccc0002-4002-4002-8002-cccccccc0002',
      'cccc0003-4003-4003-8003-cccccccc0003'
    ) THEN sc.`is_featured`
    ELSE 0
  END
WHERE c.`module_key` = 'kompozit';

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;
