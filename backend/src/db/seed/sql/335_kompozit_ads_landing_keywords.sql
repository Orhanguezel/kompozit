-- =============================================================
-- FILE: 335_kompozit_ads_landing_keywords.sql
-- MOE Kompozit — reklam açılış sayfası anahtar kelime uyumu (2026-10-02)
-- Neden: Google Ads "Kompozit Saksı ve Peyzaj" reklam grubu harcamanın ~%70'ini alıyor;
-- kelimeler (dekoratif saksı, fiber saksı, dış mekan saksı, büyük bahçe saksısı, toptan saksı)
-- kalite puanı 1-3/10 idi ve sayfa metninde "dekoratif saksı", "fiber saksı", "toptan" hiç
-- geçmiyordu. Açıklamanın başına doğal bir giriş paragrafı, meta başlık/açıklamaya kelime uyumu.
-- Ürün adı (H1) ve slug DEĞİŞMEZ. İdempotent: giriş paragrafı yalnız yoksa eklenir.
-- =============================================================

UPDATE `product_i18n`
SET `description` = CONCAT(
      '<p><strong>Toptan dekoratif saksı ve fiber saksı üretimi.</strong> Otel, belediye, AVM, site ve peyzaj projeleri için dış mekan saksısı ve büyük bahçe saksısı modellerini cam elyaf takviyeli polyester (CTP / fiberglass) gövdeyle, istediğiniz ölçü, renk ve adette üretiyoruz. Proje ve toptan siparişlerde ölçü ve adet bilgisini iletin, size özel teklif hazırlayalım.</p>',
      `description`)
WHERE `product_id` = 'kd030001-9001-4001-9001-ffffffff0001'
  AND `locale` = 'tr'
  AND `description` NOT LIKE '%Toptan dekoratif saksı ve fiber saksı üretimi%';

UPDATE `product_i18n`
SET `meta_title` = 'Dekoratif Saksı ve Fiber Dış Mekan Saksıları | MOE Kompozit',
    `meta_description` = 'Otel, belediye ve peyzaj projeleri için toptan dekoratif saksı, fiber saksı ve büyük bahçe saksısı üretimi. Ölçü, renk ve adede göre hızlı teklif alın.'
WHERE `product_id` = 'kd030001-9001-4001-9001-ffffffff0001'
  AND `locale` = 'tr';

UPDATE `product_i18n`
SET `description` = CONCAT(
      '<p><strong>Fiberglass planters made to order for commercial projects.</strong> We manufacture large outdoor planters, commercial planters and planters for landscape projects in glass-fibre reinforced polyester (GRP / fiberglass) for hotels, municipalities, shopping centres and residential developments, in the size, colour and quantity you need. Send your dimensions and quantity for a project quote.</p>',
      `description`)
WHERE `product_id` = 'kd030001-9001-4001-9001-ffffffff0001'
  AND `locale` = 'en'
  AND `description` NOT LIKE '%Fiberglass planters made to order for commercial projects%';

UPDATE `product_i18n`
SET `meta_title` = 'Fiberglass Planters for Commercial Projects | MOE Composite',
    `meta_description` = 'Large fiberglass planters and commercial planters for hotels, municipalities and landscape projects. Custom size, colour and quantity. Request a project quote.'
WHERE `product_id` = 'kd030001-9001-4001-9001-ffffffff0001'
  AND `locale` = 'en';
