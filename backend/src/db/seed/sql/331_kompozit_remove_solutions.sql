-- =============================================================
-- FILE: 331_kompozit_remove_solutions.sql
-- MOE Kompozit — Cozumler bolumu kaldirildi (2026-09-25)
-- Neden: 4 cozum sayfasi urun kategorilerinin (Peyzaj, Ozel Uretim, Belediyeler)
-- zayif tekrariydi. /solutions URL'leri frontend'de 301 ile urun/kategoriye gider.
-- Silme yok: menu ogeleri pasif, sayfalar yayindan kalkar. Geri almak icin
-- is_active / is_published 1 yapilir. Idempotent; canliya dogrudan uygulanabilir.
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

START TRANSACTION;

UPDATE `menu_items`
SET `is_active` = 0
WHERE `site_id` = 'kompozit'
  AND `id` IN (
    'dd010008-4008-4008-8008-dd0000000008',
    'dd080001-7001-4001-8001-dd0000000001',
    'dd080002-7002-4002-8002-dd0000000002',
    'dd080003-7003-4003-8003-dd0000000003',
    'dd080004-7004-4004-8004-dd0000000004'
  );

UPDATE `custom_pages`
SET `is_published` = 0
WHERE `module_key` = 'kompozit_solutions';

COMMIT;
