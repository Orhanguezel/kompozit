-- =============================================================
-- FILE: 330_kompozit_christmas_figures.seed.sql
-- MOE Kompozit — Yılbaşı figürleri ürün sayfası (TR + EN)
-- Neden: Google Ads "Noel Baba, Geyik ve Kızak" (TR) ve "Christmas Santa,
--        Reindeer and Sleigh" (EN) reklam grupları bu ürün için ayrı sayfa
--        olmadığından lunapark sayfasına gidiyordu; kalite puanı 1/10'du.
-- Görseller: MOE atölye fotoğrafları (WhatsApp, 2026-09-22); yalnız arka plan
--        temizlendi, ürün geometrisi/rengi korunmuş. Kaynak eşleşmesi:
--        ekosistem-sosyal-medya/reports/moe-google-ads-2026-09-22/additional-images/manifest.json
-- İçerik: yalnız görsellerde olan ürünler anlatılır; Noel Baba figürü "projeye
--        özel" olarak geçer (görseli yok). Süre, fiyat, sertifika iddiası yok.
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- 1) Görsel kayıtları
INSERT INTO `storage_assets`
  (`id`, `user_id`, `name`, `bucket`, `path`, `folder`, `mime`, `size`, `width`, `height`, `url`, `provider`, `created_at`, `updated_at`)
VALUES
  ('c3000057-0057-4057-8057-000000000057', NULL, 'yilbasi-geyik-kizak-01.jpg', 'kompozit', 'uploads/kompozit/yilbasi-geyik-kizak-01.jpg', 'uploads/kompozit', 'image/jpeg', 103351, 1448, 1086, '/uploads/kompozit/yilbasi-geyik-kizak-01.jpg', 'local', NOW(3), NOW(3)),
  ('c3000058-0058-4058-8058-000000000058', NULL, 'yilbasi-geyik-kizak-02.jpg', 'kompozit', 'uploads/kompozit/yilbasi-geyik-kizak-02.jpg', 'uploads/kompozit', 'image/jpeg', 116016, 1448, 1086, '/uploads/kompozit/yilbasi-geyik-kizak-02.jpg', 'local', NOW(3), NOW(3)),
  ('c3000059-0059-4059-8059-000000000059', NULL, 'yilbasi-boyali-geyik-03.jpg', 'kompozit', 'uploads/kompozit/yilbasi-boyali-geyik-03.jpg', 'uploads/kompozit', 'image/jpeg', 109836, 1448, 1086, '/uploads/kompozit/yilbasi-boyali-geyik-03.jpg', 'local', NOW(3), NOW(3)),
  ('c3000060-0060-4060-8060-000000000060', NULL, 'yilbasi-ham-geyik-04.jpg', 'kompozit', 'uploads/kompozit/yilbasi-ham-geyik-04.jpg', 'uploads/kompozit', 'image/jpeg', 71164, 1448, 1086, '/uploads/kompozit/yilbasi-ham-geyik-04.jpg', 'local', NOW(3), NOW(3)),
  ('c3000061-0061-4061-8061-000000000061', NULL, 'yilbasi-dekor-panelleri-05.jpg', 'kompozit', 'uploads/kompozit/yilbasi-dekor-panelleri-05.jpg', 'uploads/kompozit', 'image/jpeg', 219767, 1448, 1086, '/uploads/kompozit/yilbasi-dekor-panelleri-05.jpg', 'local', NOW(3), NOW(3)),
  ('c3000062-0062-4062-8062-000000000062', NULL, 'yilbasi-seker-bastonu-06.jpg', 'kompozit', 'uploads/kompozit/yilbasi-seker-bastonu-06.jpg', 'uploads/kompozit', 'image/jpeg', 117803, 1448, 1086, '/uploads/kompozit/yilbasi-seker-bastonu-06.jpg', 'local', NOW(3), NOW(3)),
  ('c3000063-0063-4063-8063-000000000063', NULL, 'yilbasi-seker-bastonu-07.jpg', 'kompozit', 'uploads/kompozit/yilbasi-seker-bastonu-07.jpg', 'uploads/kompozit', 'image/jpeg', 109504, 1448, 1086, '/uploads/kompozit/yilbasi-seker-bastonu-07.jpg', 'local', NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`), `size` = VALUES(`size`), `width` = VALUES(`width`), `height` = VALUES(`height`),
  `url` = VALUES(`url`), `updated_at` = VALUES(`updated_at`);

-- 2) Ürün kaydı (Lunapark Ürünleri kategorisi; lunapark kabininin hemen ardından sıralanır)
INSERT INTO `products`
  (`id`, `item_type`, `category_id`, `sub_category_id`, `price`, `image_url`, `storage_asset_id`, `images`, `storage_image_ids`,
   `is_active`, `is_featured`, `order_num`, `product_code`, `stock_quantity`, `rating`, `review_count`)
VALUES
  (
    'kd040008-9208-4208-9208-bbbbbbbb0008',
    'kompozit',
    'cccc0003-4003-4003-8003-cccccccc0003',
    NULL,
    0.00,
    '/uploads/kompozit/yilbasi-geyik-kizak-01.jpg',
    'c3000057-0057-4057-8057-000000000057',
    JSON_ARRAY(
      '/uploads/kompozit/yilbasi-geyik-kizak-01.jpg',
      '/uploads/kompozit/yilbasi-geyik-kizak-02.jpg',
      '/uploads/kompozit/yilbasi-boyali-geyik-03.jpg',
      '/uploads/kompozit/yilbasi-ham-geyik-04.jpg',
      '/uploads/kompozit/yilbasi-dekor-panelleri-05.jpg',
      '/uploads/kompozit/yilbasi-seker-bastonu-06.jpg',
      '/uploads/kompozit/yilbasi-seker-bastonu-07.jpg'
    ),
    JSON_ARRAY(
      'c3000057-0057-4057-8057-000000000057',
      'c3000058-0058-4058-8058-000000000058',
      'c3000059-0059-4059-8059-000000000059',
      'c3000060-0060-4060-8060-000000000060',
      'c3000061-0061-4061-8061-000000000061',
      'c3000062-0062-4062-8062-000000000062',
      'c3000063-0063-4063-8063-000000000063'
    ),
    1, 1, 321, 'MOE-XMAS-FIGURES', 0, 5.00, 0
  )
ON DUPLICATE KEY UPDATE
  `item_type` = VALUES(`item_type`), `category_id` = VALUES(`category_id`), `sub_category_id` = VALUES(`sub_category_id`),
  `price` = VALUES(`price`), `image_url` = VALUES(`image_url`), `storage_asset_id` = VALUES(`storage_asset_id`),
  `images` = VALUES(`images`), `storage_image_ids` = VALUES(`storage_image_ids`), `is_active` = VALUES(`is_active`),
  `is_featured` = VALUES(`is_featured`), `order_num` = VALUES(`order_num`), `product_code` = VALUES(`product_code`),
  `stock_quantity` = VALUES(`stock_quantity`), `rating` = VALUES(`rating`), `review_count` = VALUES(`review_count`),
  `updated_at` = NOW(3);

-- 3) TR / EN içerik
INSERT INTO `product_i18n`
  (`product_id`, `locale`, `title`, `slug`, `description`, `alt`, `tags`, `specifications`, `meta_title`, `meta_description`)
VALUES
  (
    'kd040008-9208-4208-9208-bbbbbbbb0008',
    'tr',
    'Yılbaşı Figürleri: Geyik, Kızak ve Dekor Panelleri',
    'yilbasi-figurleri-geyik-kizak',
    '<h2>Kompozit Yılbaşı Figürleri</h2><p>AVM, belediye meydanları, otel girişleri, etkinlik alanları ve tema parklar için cam elyaf takviyeli polyester (CTP / fiberglass) yılbaşı figürleri üretilir. Geyik figürleri, kızak kabinleri, yılbaşı dekor panelleri ve şeker bastonu grupları projenin ölçü, adet ve renk ihtiyacına göre hazırlanır.</p><h3>Üretim Kapsamı</h3><ul><li>Geyik figürleri: ham kompozit yüzey ya da boyalı final ürün</li><li>Kızak kabinleri ve geyikli kızak grupları</li><li>Noel Baba ve yıldız motifli yılbaşı dekor panelleri, ayaklı taşıyıcıyla</li><li>Şeker bastonu ve süs küresi formlu dekor grupları</li><li>Projeye özel Noel Baba ve diğer yılbaşı figürleri</li></ul><h3>Yüzey ve Montaj</h3><p>Figürler kalıptan laminasyonla üretilir; ham kompozit yüzeyle ya da istenen renkte boyalı teslim edilebilir. Zemine sabitleme için ayak ve bağlantı flanşları proje detayına göre hazırlanır. Dış mekân kullanımı için UV dayanımlı yüzey seçeneği değerlendirilir.</p><h3>Teklif İçin</h3><p>Figür türü, ölçü, adet, renk ve kullanım yeri (iç ya da dış mekân) bilgisini iletin; üretim ve teklif buna göre planlanır. Yılbaşı sezonu için siparişin erken planlanması önerilir.</p>',
    'Kompozit yılbaşı figürleri: beyaz geyikler ve kırmızı kızak kabinleri',
    JSON_ARRAY('yılbaşı figürleri', 'kompozit geyik', 'yılbaşı kızağı', 'noel baba figürü', 'avm yılbaşı dekorasyonu', 'fiberglass yılbaşı figürü'),
    JSON_OBJECT(
      'urun_grubu', 'Yılbaşı ve Noel figürleri',
      'malzeme', 'Cam elyaf takviyeli polyester (CTP / FRP)',
      'yuzey', JSON_ARRAY('Ham kompozit yüzey', 'Boyalı final ürün'),
      'urunler', JSON_ARRAY('Geyik figürü', 'Kızak kabini', 'Yılbaşı dekor paneli', 'Şeker bastonu dekoru', 'Projeye özel Noel Baba'),
      'kullanim', JSON_ARRAY('AVM', 'Belediye meydanları', 'Otel ve etkinlik alanları', 'Tema park')
    ),
    'Kompozit Yılbaşı Figürleri | Geyik ve Kızak | MOE Kompozit',
    'AVM, belediye meydanı ve etkinlik alanları için CTP geyik, kızak kabini, yılbaşı dekor paneli ve şeker bastonu üretimi. Ölçü ve renk projeye özel.'
  ),
  (
    'kd040008-9208-4208-9208-bbbbbbbb0008',
    'en',
    'Christmas Figures: Reindeer, Sleighs and Decor Panels',
    'christmas-figures-reindeer-sleigh',
    '<h2>Fiberglass Christmas Figures</h2><p>Glass-fibre reinforced polyester (GRP / fiberglass) Christmas figures are produced for shopping malls, city squares, hotel entrances, event venues and theme parks. Reindeer figures, sleigh cabins, Christmas decor panels and candy cane groups are prepared to the size, quantity and colour your project needs.</p><h3>Production Scope</h3><ul><li>Reindeer figures: raw composite surface or painted finished product</li><li>Sleigh cabins and reindeer-and-sleigh groups</li><li>Christmas decor panels with Santa Claus and star motifs, on standing frames</li><li>Candy cane and ornament-ball decor groups</li><li>Custom Santa Claus and other Christmas figures for your project</li></ul><h3>Surface and Mounting</h3><p>Figures are moulded and laminated; they can be delivered with a raw composite surface or painted in the colour you choose. Feet and mounting flanges for fixing to the ground are prepared to your project details. A UV-resistant surface option is considered for outdoor use.</p><h3>For a Quote</h3><p>Send the figure type, dimensions, quantity, colour and where it will be used (indoor or outdoor); production and the quote are planned from this. Planning orders early is recommended for the Christmas season.</p>',
    'Fiberglass Christmas figures: white reindeer and red sleigh cabins',
    JSON_ARRAY('christmas figures', 'fiberglass reindeer', 'christmas sleigh', 'santa claus figure', 'christmas mall decorations', 'fiberglass christmas decorations'),
    JSON_OBJECT(
      'product_group', 'Christmas figures',
      'material', 'Glass-fibre reinforced polyester (GRP / FRP)',
      'surface', JSON_ARRAY('Raw composite surface', 'Painted finished product'),
      'products', JSON_ARRAY('Reindeer figure', 'Sleigh cabin', 'Christmas decor panel', 'Candy cane decor', 'Custom Santa Claus'),
      'applications', JSON_ARRAY('Shopping malls', 'City squares', 'Hotels and event venues', 'Theme parks')
    ),
    'Fiberglass Christmas Figures | Reindeer & Sleigh | MOE Kompozit',
    'Fiberglass reindeer, sleigh cabins, Christmas decor panels and candy cane decorations for malls, city squares and events. Custom size and colour.'
  )
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`), `slug` = VALUES(`slug`), `description` = VALUES(`description`), `alt` = VALUES(`alt`),
  `tags` = VALUES(`tags`), `specifications` = VALUES(`specifications`), `meta_title` = VALUES(`meta_title`),
  `meta_description` = VALUES(`meta_description`), `updated_at` = NOW(3);

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;
