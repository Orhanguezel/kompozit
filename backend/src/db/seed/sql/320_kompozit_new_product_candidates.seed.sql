-- =============================================================
-- FILE: 320_kompozit_new_product_candidates.seed.sql
-- MOE Kompozit — Üretilebilir yeni ürün adayları + SEO içerik
-- Amaç: Henüz üretilmemiş ama teklif/katalog içeriği hazırlanacak
--       CTP/FRP ürünleri çoklu görselle ürün kataloğuna eklemek.
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- -------------------------------------------------------------
-- 1) Yeni ürün adayları için storage asset kayıtları
-- -------------------------------------------------------------
INSERT INTO `storage_assets`
  (`id`, `user_id`, `name`, `bucket`, `path`, `folder`, `mime`, `size`, `width`, `height`, `url`, `provider`, `created_at`, `updated_at`)
VALUES
  ('c3000050-0050-4050-8050-000000000050', NULL, 'cop-konteyneri.jpg', 'kompozit', 'uploads/kompozit/cop-konteyneri.jpg', 'uploads/kompozit', 'image/jpeg', 252387, 1448, 1086, '/uploads/kompozit/cop-konteyneri.jpg', 'local', NOW(3), NOW(3)),
  ('c3000051-0051-4051-8051-000000000051', NULL, 'tabut.jpg', 'kompozit', 'uploads/kompozit/tabut.jpg', 'uploads/kompozit', 'image/jpeg', 241213, 1448, 1086, '/uploads/kompozit/tabut.jpg', 'local', NOW(3), NOW(3)),
  ('c3000052-0052-4052-8052-000000000052', NULL, 'cop-kutusu.jpg', 'kompozit', 'uploads/kompozit/cop-kutusu.jpg', 'uploads/kompozit', 'image/jpeg', 235983, 1086, 1448, '/uploads/kompozit/cop-kutusu.jpg', 'local', NOW(3), NOW(3)),
  ('c3000053-0053-4053-8053-000000000053', NULL, 'belediye-cop-konteyneri.jpg', 'kompozit', 'uploads/kompozit/belediye-cop-konteyneri.jpg', 'uploads/kompozit', 'image/jpeg', 284092, 1448, 1086, '/uploads/kompozit/belediye-cop-konteyneri.jpg', 'local', NOW(3), NOW(3)),
  ('c3000054-0054-4054-8054-000000000054', NULL, 'su-deposu.jpg', 'kompozit', 'uploads/kompozit/su-deposu.jpg', 'uploads/kompozit', 'image/jpeg', 265836, 1448, 1086, '/uploads/kompozit/su-deposu.jpg', 'local', NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `size` = VALUES(`size`),
  `width` = VALUES(`width`),
  `height` = VALUES(`height`),
  `url` = VALUES(`url`),
  `updated_at` = VALUES(`updated_at`);

-- -------------------------------------------------------------
-- 2) Ürün kayıtları
-- Kategori eşleştirmesi:
-- - Çöp konteyneri / belediye konteyneri / çöp kutusu / su deposu: CTP Ürünler
-- - Tabut: Özel Üretim
-- Çoklu görseller, ürün ailesi ve teknik güven için ilişkili CTP/proses
-- görsellerini de içerir.
-- -------------------------------------------------------------
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
    'kd040001-9201-4201-9201-bbbbbbbb0001',
    'kompozit',
    'cccc0002-4002-4002-8002-cccccccc0002',
    NULL,
    0.00,
    '/uploads/kompozit/cop-konteyneri.jpg',
    'c3000050-0050-4050-8050-000000000050',
    JSON_ARRAY(
      '/uploads/kompozit/cop-konteyneri.jpg',
      '/uploads/kompozit/belediye-cop-konteyneri.jpg',
      '/uploads/kompozit/cop-kutusu.jpg',
      '/uploads/kompozit/ctp-koruyucu-govde-paneli.jpg',
      '/uploads/kompozit/kompozit-uretim-proses-01.jpg'
    ),
    JSON_ARRAY(
      'c3000050-0050-4050-8050-000000000050',
      'c3000053-0053-4053-8053-000000000053',
      'c3000052-0052-4052-8052-000000000052',
      'c3000041-0041-4041-8041-000000000041',
      'c3000042-0042-4042-8042-000000000042'
    ),
    1,
    1,
    240,
    'MOE-CTP-WASTE-CONTAINER',
    0,
    5.00,
    0
  ),
  (
    'kd040002-9202-4202-9202-bbbbbbbb0002',
    'kompozit',
    'cccc0006-4006-4006-8006-cccccccc0006',
    NULL,
    0.00,
    '/uploads/kompozit/tabut.jpg',
    'c3000051-0051-4051-8051-000000000051',
    JSON_ARRAY(
      '/uploads/kompozit/tabut.jpg',
      '/uploads/kompozit/ctp-koruyucu-govde-paneli.jpg',
      '/uploads/kompozit/ctp-cam-elyaf-01.jpg',
      '/uploads/kompozit/kompozit-uretim-proses-01.jpg'
    ),
    JSON_ARRAY(
      'c3000051-0051-4051-8051-000000000051',
      'c3000041-0041-4041-8041-000000000041',
      'c3000003-0003-4003-8003-000000000003',
      'c3000042-0042-4042-8042-000000000042'
    ),
    1,
    1,
    241,
    'MOE-CTP-COFFIN',
    0,
    5.00,
    0
  ),
  (
    'kd040003-9203-4203-9203-bbbbbbbb0003',
    'kompozit',
    'cccc0002-4002-4002-8002-cccccccc0002',
    NULL,
    0.00,
    '/uploads/kompozit/cop-kutusu.jpg',
    'c3000052-0052-4052-8052-000000000052',
    JSON_ARRAY(
      '/uploads/kompozit/cop-kutusu.jpg',
      '/uploads/kompozit/cop-konteyneri.jpg',
      '/uploads/kompozit/belediye-cop-konteyneri.jpg',
      '/uploads/kompozit/ctp-koruyucu-govde-paneli.jpg',
      '/uploads/kompozit/kompozit-uretim-proses-01.jpg'
    ),
    JSON_ARRAY(
      'c3000052-0052-4052-8052-000000000052',
      'c3000050-0050-4050-8050-000000000050',
      'c3000053-0053-4053-8053-000000000053',
      'c3000041-0041-4041-8041-000000000041',
      'c3000042-0042-4042-8042-000000000042'
    ),
    1,
    0,
    242,
    'MOE-CTP-LITTER-BIN',
    0,
    5.00,
    0
  ),
  (
    'kd040004-9204-4204-9204-bbbbbbbb0004',
    'kompozit',
    'cccc0002-4002-4002-8002-cccccccc0002',
    NULL,
    0.00,
    '/uploads/kompozit/belediye-cop-konteyneri.jpg',
    'c3000053-0053-4053-8053-000000000053',
    JSON_ARRAY(
      '/uploads/kompozit/belediye-cop-konteyneri.jpg',
      '/uploads/kompozit/cop-konteyneri.jpg',
      '/uploads/kompozit/cop-kutusu.jpg',
      '/uploads/kompozit/ctp-koruyucu-govde-paneli.jpg',
      '/uploads/kompozit/kompozit-uretim-proses-01.jpg'
    ),
    JSON_ARRAY(
      'c3000053-0053-4053-8053-000000000053',
      'c3000050-0050-4050-8050-000000000050',
      'c3000052-0052-4052-8052-000000000052',
      'c3000041-0041-4041-8041-000000000041',
      'c3000042-0042-4042-8042-000000000042'
    ),
    1,
    1,
    243,
    'MOE-CTP-MUNICIPAL-CONTAINER',
    0,
    5.00,
    0
  ),
  (
    'kd040005-9205-4205-9205-bbbbbbbb0005',
    'kompozit',
    'cccc0002-4002-4002-8002-cccccccc0002',
    NULL,
    0.00,
    '/uploads/kompozit/su-deposu.jpg',
    'c3000054-0054-4054-8054-000000000054',
    JSON_ARRAY(
      '/uploads/kompozit/su-deposu.jpg',
      '/uploads/kompozit/ctp-cam-elyaf-01.jpg',
      '/uploads/kompozit/ctp-dokuma-hibrit-01.jpg',
      '/uploads/kompozit/kompozit-uretim-proses-01.jpg',
      '/uploads/kompozit/kompozit-fabrika-otoklav-01.jpg'
    ),
    JSON_ARRAY(
      'c3000054-0054-4054-8054-000000000054',
      'c3000003-0003-4003-8003-000000000003',
      'c3000004-0004-4004-8004-000000000004',
      'c3000042-0042-4042-8042-000000000042',
      'c3000007-0007-4007-8007-000000000007'
    ),
    1,
    1,
    244,
    'MOE-CTP-WATER-TANK',
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
  `review_count` = VALUES(`review_count`),
  `updated_at` = NOW(3);

-- -------------------------------------------------------------
-- 3) SEO uyumlu TR/EN ürün içerikleri
-- -------------------------------------------------------------
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
    'kd040001-9201-4201-9201-bbbbbbbb0001',
    'tr',
    'CTP Çöp Konteyneri',
    'ctp-cop-konteyneri',
    '<h2>CTP Çöp Konteyneri</h2><p>CTP çöp konteyneri; belediyeler, sanayi tesisleri, toplu yaşam alanları ve peyzaj projeleri için hafif, korozyona dayanıklı ve kolay temizlenebilir atık toplama gövdesi olarak tasarlanır. Cam elyaf takviyeli polyester yapı, metal konteynerlerde görülen paslanma ve yüzey deformasyonu riskini azaltır.</p><h3>Üretim ve Tasarım Kapsamı</h3><ul><li>Proje ihtiyacına göre farklı hacim, kapak ve gövde formları</li><li>UV dayanımlı jel-kot yüzey ve istenen RAL renkte final boya</li><li>Forklift cebi, takviyeli yan ribler, menteşeli kapak ve kalın cidarlı kompozit gövde</li><li>Seri üretime uygun kalıp disiplini ve tekrarlanabilir yüzey kalitesi</li></ul><h3>Kullanım Alanları</h3><p>Belediye atık toplama noktaları, fabrika sahaları, otel ve sosyal tesisler, kampüsler, parklar ve dış ortam ekipmanı gerektiren projeler için değerlendirilebilir.</p>',
    'Yeşil renkli CTP çöp konteyneri ürün görseli',
    JSON_ARRAY('CTP çöp konteyneri', 'kompozit çöp konteyneri', 'fiberglass konteyner', 'belediye ekipmanları', 'atık toplama'),
    JSON_OBJECT(
      'malzeme', 'Cam elyaf takviyeli polyester (CTP / FRP)',
      'yuzey', 'UV dayanımlı jel-kot veya proje rengine uygun boya',
      'kullanim', JSON_ARRAY('Belediye alanları', 'Sanayi tesisleri', 'Peyzaj ve kampüs projeleri', 'Toplu yaşam alanları'),
      'uretim', JSON_ARRAY('Özel hacim', 'Takviyeli gövde', 'Menteşeli kapak', 'Seri üretim kalıbı')
    ),
    'CTP Çöp Konteyneri | Kompozit Atık Konteyneri | MOE Kompozit',
    'CTP çöp konteyneri; belediye, sanayi ve peyzaj projeleri için hafif, korozyona dayanıklı, kolay temizlenen kompozit atık konteyneri çözümü.'
  ),
  (
    'kd040001-9201-4201-9201-bbbbbbbb0001',
    'en',
    'FRP Waste Container',
    'frp-waste-container',
    '<h2>FRP Waste Container</h2><p>The FRP waste container is designed as a lightweight, corrosion-resistant and easy-clean composite body for municipalities, industrial sites, campuses and outdoor landscape projects. Its fiberglass reinforced polyester structure helps reduce rust, surface deformation and maintenance issues commonly associated with metal containers.</p><h3>Manufacturing Scope</h3><ul><li>Project-specific volume, lid and body forms</li><li>UV-resistant gelcoat surface or custom RAL finish</li><li>Forklift pockets, reinforced side ribs, hinged lid and thick-wall composite body</li><li>Repeatable mold discipline for serial production</li></ul><h3>Use Cases</h3><p>Suitable for municipal waste points, factory yards, hotels, social facilities, campuses, parks and outdoor equipment programs.</p>',
    'Green FRP waste container product image',
    JSON_ARRAY('FRP waste container', 'composite waste container', 'fiberglass container', 'municipal equipment', 'waste collection'),
    JSON_OBJECT(
      'material', 'Fiberglass reinforced polyester (FRP / GRP)',
      'finish', 'UV-resistant gelcoat or project-specific paint',
      'usage', JSON_ARRAY('Municipal areas', 'Industrial sites', 'Landscape and campus projects', 'Public facilities'),
      'manufacturing', JSON_ARRAY('Custom volume', 'Reinforced body', 'Hinged lid', 'Serial production tooling')
    ),
    'FRP Waste Container | Composite Waste Bin | MOE Kompozit',
    'FRP waste container for municipal, industrial and landscape projects; lightweight, corrosion-resistant and easy-clean composite waste collection body.'
  ),
  (
    'kd040002-9202-4202-9202-bbbbbbbb0002',
    'tr',
    'Kompozit Tabut',
    'kompozit-tabut',
    '<h2>Kompozit Tabut</h2><p>Kompozit tabut; defin hizmetleri, belediye hizmet birimleri, cenaze ekipmanı tedarikçileri ve ihracat odaklı B2B programlar için hafif, hijyenik ve yüzey kalitesi kontrollü bir ürün ailesi olarak projelendirilebilir. Gözeneksiz CTP yüzey, kolay temizlenebilir yapı ve seri üretimde ölçü tekrarlanabilirliği sağlar.</p><h3>Teknik Yaklaşım</h3><ul><li>Hafif taşıma ergonomisi ve yüksek gövde rijitliği</li><li>Kolay dezenfekte edilebilir, pürüzsüz jel-kot yüzey</li><li>Standart veya müşteri markasına özel ölçü ve renk seçenekleri</li><li>Lojistik ve istifleme ihtiyacına göre taban ve kenar takviyesi</li></ul><h3>Proje Kullanımı</h3><p>Numune onayı, teknik şartname, adet ve teslimat planı netleştirildikten sonra iç pazar veya ihracat dağıtımına uygun üretim senaryosu hazırlanabilir.</p>',
    'Açık renkli kompozit tabut ürün görseli',
    JSON_ARRAY('kompozit tabut', 'CTP tabut', 'fiberglass tabut', 'defin grubu ürünleri', 'belediye cenaze ekipmanı'),
    JSON_OBJECT(
      'malzeme', 'Cam elyaf takviyeli kompozit',
      'yuzey', 'Hijyenik, kolay temizlenebilir jel-kot yüzey',
      'kullanim', JSON_ARRAY('Belediye hizmetleri', 'Defin ve nakil ekipmanları', 'B2B tedarik', 'İhracat programları'),
      'uretim', JSON_ARRAY('Özel ölçü', 'Seri üretim', 'Numune onayı', 'Markaya özel varyant')
    ),
    'Kompozit Tabut | CTP Defin Grubu Ürünü | MOE Kompozit',
    'Kompozit tabut üretimi; belediye ve defin hizmetleri için hafif, hijyenik, kolay temizlenebilir CTP tabut ve B2B seri üretim çözümü.'
  ),
  (
    'kd040002-9202-4202-9202-bbbbbbbb0002',
    'en',
    'Composite Coffin',
    'composite-coffin',
    '<h2>Composite Coffin</h2><p>The composite coffin can be engineered as a lightweight, hygienic and controlled-surface product family for funeral services, municipal service units, funeral-sector suppliers and export-oriented B2B programs. Its non-porous FRP surface supports easy cleaning and dimensional repeatability in serial production.</p><h3>Technical Approach</h3><ul><li>Lightweight handling ergonomics and rigid body structure</li><li>Smooth gelcoat surface suitable for cleaning and disinfection</li><li>Standard or customer-specific dimensions and colors</li><li>Base and side reinforcement aligned to logistics and stacking needs</li></ul><h3>Project Use</h3><p>After sample approval, technical specification, quantity and delivery plan are clarified, a production scenario can be prepared for domestic supply or export distribution.</p>',
    'Light-colored composite coffin product image',
    JSON_ARRAY('composite coffin', 'FRP coffin', 'fiberglass coffin', 'funeral-sector product', 'municipal funeral equipment'),
    JSON_OBJECT(
      'material', 'Fiberglass reinforced composite',
      'finish', 'Hygienic easy-clean gelcoat surface',
      'usage', JSON_ARRAY('Municipal services', 'Funeral and transport equipment', 'B2B supply', 'Export programs'),
      'manufacturing', JSON_ARRAY('Custom dimensions', 'Serial production', 'Sample approval', 'Customer-branded variant')
    ),
    'Composite Coffin | FRP Funeral Product | MOE Kompozit',
    'Composite coffin manufacturing for municipal and funeral-sector needs; lightweight, hygienic and easy-clean FRP coffin for B2B serial production.'
  ),
  (
    'kd040003-9203-4203-9203-bbbbbbbb0003',
    'tr',
    'Kompozit Çöp Kutusu',
    'kompozit-cop-kutusu',
    '<h2>Kompozit Çöp Kutusu</h2><p>Kompozit çöp kutusu; park, bahçe, yürüyüş yolu, kampüs, otel ve belediye peyzaj alanlarında kullanılmak üzere UV dayanımlı, darbe toleranslı ve bakım ihtiyacı düşük bir kent ekipmanı olarak üretilebilir. CTP gövde, dış ortamda paslanmaz ve farklı renk/kapak varyantlarına uyarlanabilir.</p><h3>Ürün Özellikleri</h3><ul><li>Yağmur korumalı kapak ve kolay erişimli atık açıklığı</li><li>Zemine sabitlenebilir kaide veya proje bazlı ayak sistemi</li><li>Kolay temizlenen iç yüzey ve opsiyonel iç kova kurgusu</li><li>Belediye kimliği veya peyzaj konseptine uygun renk seçenekleri</li></ul><h3>Kullanım Alanları</h3><p>Parklar, sahil yürüyüş yolları, sosyal tesisler, okul ve kampüs alanları, otel bahçeleri ve dış mekan şehir mobilyası projeleri için uygundur.</p>',
    'Kompozit dış mekan çöp kutusu ürün görseli',
    JSON_ARRAY('kompozit çöp kutusu', 'CTP çöp kutusu', 'park çöp kutusu', 'belediye çöp kutusu', 'kent mobilyası'),
    JSON_OBJECT(
      'malzeme', 'CTP / cam elyaf takviyeli kompozit',
      'yuzey', 'UV dayanımlı dış mekan yüzeyi',
      'kullanim', JSON_ARRAY('Park ve bahçeler', 'Belediye alanları', 'Kampüsler', 'Otel ve sosyal tesisler'),
      'opsiyonlar', JSON_ARRAY('Renk seçeneği', 'Zemine sabitleme', 'İç kova', 'Özel kapak formu')
    ),
    'Kompozit Çöp Kutusu | CTP Park ve Belediye Çöp Kutusu | MOE Kompozit',
    'Kompozit çöp kutusu; park, bahçe, kampüs ve belediye alanları için UV dayanımlı, hafif, kolay temizlenebilir CTP kent ekipmanı.'
  ),
  (
    'kd040003-9203-4203-9203-bbbbbbbb0003',
    'en',
    'Composite Litter Bin',
    'composite-litter-bin',
    '<h2>Composite Litter Bin</h2><p>The composite litter bin can be manufactured as a UV-resistant, impact-tolerant and low-maintenance urban equipment product for parks, gardens, walkways, campuses, hotels and municipal landscape areas. Its FRP body does not rust outdoors and can be adapted to different colors and hood designs.</p><h3>Product Features</h3><ul><li>Rain-protected hood and easy-access waste opening</li><li>Floor-fixable pedestal or project-specific base system</li><li>Easy-clean inner surface and optional inner liner concept</li><li>Color options aligned to municipal identity or landscape design</li></ul><h3>Use Cases</h3><p>Suitable for parks, seaside walkways, social facilities, schools, campus areas, hotel gardens and outdoor urban furniture programs.</p>',
    'Composite outdoor litter bin product image',
    JSON_ARRAY('composite litter bin', 'FRP litter bin', 'park trash bin', 'municipal litter bin', 'urban furniture'),
    JSON_OBJECT(
      'material', 'FRP / fiberglass reinforced composite',
      'finish', 'UV-resistant outdoor surface',
      'usage', JSON_ARRAY('Parks and gardens', 'Municipal areas', 'Campuses', 'Hotels and social facilities'),
      'options', JSON_ARRAY('Color option', 'Floor fixing', 'Inner liner', 'Custom hood form')
    ),
    'Composite Litter Bin | FRP Park and Municipal Trash Bin | MOE Kompozit',
    'Composite litter bin for parks, campuses and municipal spaces; UV-resistant, lightweight and easy-clean FRP urban furniture product.'
  ),
  (
    'kd040004-9204-4204-9204-bbbbbbbb0004',
    'tr',
    'Belediye Çöp Konteyneri',
    'belediye-cop-konteyneri',
    '<h2>Belediye Çöp Konteyneri</h2><p>Belediye çöp konteyneri; dış ortam atık toplama noktaları için tekerlekli, takviyeli ve uzun ömürlü CTP gövdeyle üretilebilecek bir belediye ekipmanı ürünüdür. Kompozit yapı, tuzlu hava, nem, temizlik kimyasalları ve yoğun kullanım koşullarında korozyon riskini düşürür.</p><h3>Belediye Kullanımı İçin Avantajlar</h3><ul><li>Tekerlekli gövde ve boşaltma ekipmanına uyarlanabilir bağlantı detayları</li><li>Darbe toleransı yüksek kalın cidarlı kompozit yapı</li><li>Kolay yıkanabilir, hijyenik ve kokuyu tutmayan pürüzsüz yüzey</li><li>İlçe, tesis veya proje rengine göre üretilebilen dış yüzey</li></ul><h3>Teklif İçin Gereken Bilgiler</h3><p>Hacim, tekerlek tipi, kapak formu, boşaltma sistemi uyumu, adet ve renk beklentisi paylaşıldığında numune ve seri üretim planı hazırlanabilir.</p>',
    'Tekerlekli belediye çöp konteyneri ürün görseli',
    JSON_ARRAY('belediye çöp konteyneri', 'CTP belediye konteyneri', 'tekerlekli çöp konteyneri', 'kompozit atık konteyneri', 'belediye ekipmanı'),
    JSON_OBJECT(
      'malzeme', 'CTP / FRP kompozit',
      'yuzey', 'Kolay yıkanabilir UV dayanımlı jel-kot',
      'kullanim', JSON_ARRAY('Belediye atık toplama', 'Park ve tesis alanları', 'Kampüs ve site yönetimleri', 'Endüstriyel saha'),
      'opsiyonlar', JSON_ARRAY('Tekerlek tipi', 'Kapak formu', 'Boşaltma bağlantısı', 'Özel renk')
    ),
    'Belediye Çöp Konteyneri | CTP Tekerlekli Konteyner | MOE Kompozit',
    'Belediye çöp konteyneri; tekerlekli, hafif, korozyona dayanıklı ve kolay temizlenen CTP atık konteyneri üretim çözümü.'
  ),
  (
    'kd040004-9204-4204-9204-bbbbbbbb0004',
    'en',
    'Municipal Garbage Container',
    'municipal-garbage-container',
    '<h2>Municipal Garbage Container</h2><p>The municipal garbage container is a wheeled, reinforced and long-life FRP equipment concept for outdoor waste collection points. Its composite body helps reduce corrosion risk under salty air, moisture, cleaning chemicals and intensive daily use.</p><h3>Advantages for Municipal Use</h3><ul><li>Wheeled body and connection details adaptable to emptying equipment</li><li>Thick-wall composite construction with high impact tolerance</li><li>Easy-wash, hygienic and smooth surface that does not retain odor easily</li><li>Exterior color options aligned to district, facility or project identity</li></ul><h3>Information Needed for Quotation</h3><p>Volume, wheel type, lid form, emptying-system compatibility, quantity and color expectations allow sample and serial production planning.</p>',
    'Wheeled municipal garbage container product image',
    JSON_ARRAY('municipal garbage container', 'FRP municipal container', 'wheeled waste container', 'composite waste container', 'municipal equipment'),
    JSON_OBJECT(
      'material', 'FRP / GRP composite',
      'finish', 'Easy-wash UV-resistant gelcoat',
      'usage', JSON_ARRAY('Municipal waste collection', 'Park and facility areas', 'Campus and site management', 'Industrial yards'),
      'options', JSON_ARRAY('Wheel type', 'Lid form', 'Emptying connection', 'Custom color')
    ),
    'Municipal Garbage Container | FRP Wheeled Waste Container | MOE Kompozit',
    'Municipal garbage container with wheeled, lightweight, corrosion-resistant and easy-clean FRP body for outdoor waste collection programs.'
  ),
  (
    'kd040005-9205-4205-9205-bbbbbbbb0005',
    'tr',
    'CTP Su Deposu',
    'ctp-su-deposu',
    '<h2>CTP Su Deposu</h2><p>CTP su deposu; içme suyu dışı kullanım suyu, proses suyu, atık su, yangın suyu ve endüstriyel depolama projeleri için korozyona dayanıklı, hafif ve uzun ömürlü tank gövdesi olarak üretilebilir. Cam elyaf takviyeli yapı; hacim, bağlantı, menhol ve kaide detaylarına göre proje bazında mühendislikle netleştirilir.</p><h3>Teknik Kapsam</h3><ul><li>Yatay veya dikey tank formu, özel hacim ve cidar kalınlığı</li><li>Menhol, flanş, giriş-çıkış ağzı ve tahliye detayları</li><li>İçeriğe göre reçine sistemi ve laminat yapısı seçimi</li><li>Yerinde montaj, modüler sevkiyat veya tek parça üretim seçenekleri</li></ul><h3>Uygulama Alanları</h3><p>Belediye tesisleri, arıtma sahaları, endüstriyel işletmeler, tarımsal sulama altyapıları ve özel proje depolama ihtiyaçları için değerlendirilebilir.</p>',
    'Yatay CTP su deposu ürün görseli',
    JSON_ARRAY('CTP su deposu', 'kompozit su tankı', 'FRP tank', 'fiberglass su deposu', 'endüstriyel depo'),
    JSON_OBJECT(
      'malzeme', 'Cam elyaf takviyeli polyester / FRP',
      'form', JSON_ARRAY('Yatay tank', 'Dikey tank', 'Özel hacim'),
      'kullanim', JSON_ARRAY('Kullanım suyu', 'Proses suyu', 'Atık su', 'Yangın suyu', 'Endüstriyel depolama'),
      'detaylar', JSON_ARRAY('Menhol', 'Flanş', 'Tahliye', 'Kaide', 'Reçine sistemi seçimi')
    ),
    'CTP Su Deposu | FRP Kompozit Su Tankı | MOE Kompozit',
    'CTP su deposu; belediye, arıtma, endüstri ve tarımsal projeler için hafif, korozyona dayanıklı, proje bazlı FRP kompozit su tankı.'
  ),
  (
    'kd040005-9205-4205-9205-bbbbbbbb0005',
    'en',
    'FRP Water Storage Tank',
    'frp-water-storage-tank',
    '<h2>FRP Water Storage Tank</h2><p>The FRP water storage tank can be manufactured as a corrosion-resistant, lightweight and long-life vessel for utility water, process water, wastewater, fire-water and industrial storage projects. Its fiberglass reinforced body is engineered project by project according to volume, connection, manhole and support details.</p><h3>Technical Scope</h3><ul><li>Horizontal or vertical tank form, custom volume and wall thickness</li><li>Manhole, flange, inlet-outlet and drain details</li><li>Resin system and laminate structure selected by stored media</li><li>Field assembly, modular shipping or one-piece production options</li></ul><h3>Application Areas</h3><p>Suitable for municipal facilities, treatment plants, industrial operations, agricultural irrigation infrastructure and project-specific storage needs.</p>',
    'Horizontal FRP water storage tank product image',
    JSON_ARRAY('FRP water tank', 'composite water storage tank', 'fiberglass tank', 'GRP tank', 'industrial storage vessel'),
    JSON_OBJECT(
      'material', 'Fiberglass reinforced polyester / FRP',
      'form', JSON_ARRAY('Horizontal tank', 'Vertical tank', 'Custom volume'),
      'usage', JSON_ARRAY('Utility water', 'Process water', 'Wastewater', 'Fire water', 'Industrial storage'),
      'details', JSON_ARRAY('Manhole', 'Flange', 'Drain', 'Support saddles', 'Resin system selection')
    ),
    'FRP Water Storage Tank | Composite GRP Tank | MOE Kompozit',
    'FRP water storage tank for municipal, treatment, industrial and agricultural projects; lightweight, corrosion-resistant and project-engineered composite tank.'
  )
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `slug` = VALUES(`slug`),
  `description` = VALUES(`description`),
  `alt` = VALUES(`alt`),
  `tags` = VALUES(`tags`),
  `specifications` = VALUES(`specifications`),
  `meta_title` = VALUES(`meta_title`),
  `meta_description` = VALUES(`meta_description`),
  `updated_at` = NOW(3);

-- -------------------------------------------------------------
-- 4) Raylı sistem ve savunma sanayi aday ürünleri
-- -------------------------------------------------------------
INSERT INTO `storage_assets`
  (`id`, `user_id`, `name`, `bucket`, `path`, `folder`, `mime`, `size`, `width`, `height`, `url`, `provider`, `created_at`, `updated_at`)
VALUES
  ('c3000055-0055-4055-8055-000000000055', NULL, 'tren-parcalari.jpg', 'kompozit', 'uploads/kompozit/tren-parcalari.jpg', 'uploads/kompozit', 'image/jpeg', 208335, 1672, 941, '/uploads/kompozit/tren-parcalari.jpg', 'local', NOW(3), NOW(3)),
  ('c3000056-0056-4056-8056-000000000056', NULL, 'savunma-sanayi-kompozit-parcalari.jpg', 'kompozit', 'uploads/kompozit/savunma-sanayi-kompozit-parcalari.jpg', 'uploads/kompozit', 'image/jpeg', 317473, 1672, 941, '/uploads/kompozit/savunma-sanayi-kompozit-parcalari.jpg', 'local', NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `size` = VALUES(`size`),
  `width` = VALUES(`width`),
  `height` = VALUES(`height`),
  `url` = VALUES(`url`),
  `updated_at` = VALUES(`updated_at`);

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
    'kd040006-9206-4206-9206-bbbbbbbb0006',
    'kompozit',
    'cccc0006-4006-4006-8006-cccccccc0006',
    NULL,
    0.00,
    '/uploads/kompozit/tren-parcalari.jpg',
    'c3000055-0055-4055-8055-000000000055',
    JSON_ARRAY(
      '/uploads/kompozit/tren-parcalari.jpg',
      '/uploads/kompozit/ctp-koruyucu-govde-paneli.jpg',
      '/uploads/kompozit/ctp-cam-elyaf-01.jpg',
      '/uploads/kompozit/ctp-dokuma-hibrit-01.jpg',
      '/uploads/kompozit/kompozit-uretim-proses-01.jpg'
    ),
    JSON_ARRAY(
      'c3000055-0055-4055-8055-000000000055',
      'c3000041-0041-4041-8041-000000000041',
      'c3000003-0003-4003-8003-000000000003',
      'c3000004-0004-4004-8004-000000000004',
      'c3000042-0042-4042-8042-000000000042'
    ),
    1,
    1,
    245,
    'MOE-CUSTOM-RAIL-PARTS',
    0,
    5.00,
    0
  ),
  (
    'kd040007-9207-4207-9207-bbbbbbbb0007',
    'kompozit',
    'cccc0006-4006-4006-8006-cccccccc0006',
    NULL,
    0.00,
    '/uploads/kompozit/savunma-sanayi-kompozit-parcalari.jpg',
    'c3000056-0056-4056-8056-000000000056',
    JSON_ARRAY(
      '/uploads/kompozit/savunma-sanayi-kompozit-parcalari.jpg',
      '/uploads/kompozit/ctp-koruyucu-govde-paneli.jpg',
      '/uploads/kompozit/ctp-cam-elyaf-01.jpg',
      '/uploads/kompozit/ctp-dokuma-hibrit-01.jpg',
      '/uploads/kompozit/kompozit-uretim-proses-01.jpg'
    ),
    JSON_ARRAY(
      'c3000056-0056-4056-8056-000000000056',
      'c3000041-0041-4041-8041-000000000041',
      'c3000003-0003-4003-8003-000000000003',
      'c3000004-0004-4004-8004-000000000004',
      'c3000042-0042-4042-8042-000000000042'
    ),
    1,
    1,
    246,
    'MOE-CUSTOM-DEFENSE-COMPOSITES',
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
  `review_count` = VALUES(`review_count`),
  `updated_at` = NOW(3);

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
    'kd040006-9206-4206-9206-bbbbbbbb0006',
    'tr',
    'Kompozit Tren Parçaları',
    'kompozit-tren-parcalari',
    '<h2>Kompozit Tren Parçaları</h2><p>Kompozit tren parçaları; raylı sistem araçlarında iç trim, tavan paneli, yan duvar kaplaması, kapı çevresi, dış kapak, burun/etek paneli ve ekipman muhafazası gibi hafif parça ihtiyaçları için proje bazlı üretilebilir. CTP ve karbon fiber takviyeli kompozit yapı; ağırlık azaltma, korozyon direnci, tekrarlanabilir yüzey kalitesi ve seri üretim kalıp disiplini sağlar.</p><h3>Raylı Sistem Uygulamaları</h3><ul><li>Tren, tramvay, metro ve hafif raylı sistem iç/dış gövde parçaları</li><li>Yangın, duman ve mekanik dayanım beklentilerine göre reçine ve laminat seçimi</li><li>OEM ölçülerine uygun kalıp, numune onayı ve seri üretim planı</li><li>Renk, yüzey dokusu, bağlantı noktası ve montaj detayı uyarlaması</li></ul><h3>Teklif ve Üretim Süreci</h3><p>Teknik çizim, numune parça, hedef adet, yüzey beklentisi ve varsa standart gereksinimleri paylaşıldığında prototipten seri üretime kadar uygulanabilir üretim senaryosu hazırlanabilir.</p>',
    'Kompozit tren ve raylı sistem parçaları ürün görseli',
    JSON_ARRAY('kompozit tren parçaları', 'raylı sistem kompozit', 'CTP tren paneli', 'tren iç trim', 'OEM kompozit üretim'),
    JSON_OBJECT(
      'malzeme', JSON_ARRAY('CTP / FRP', 'Karbon fiber takviyeli kompozit', 'Proje bazlı reçine sistemi'),
      'uygulama', JSON_ARRAY('İç trim paneli', 'Tavan ve yan panel', 'Kapı çevresi trim', 'Dış kapak ve muhafaza', 'Burun ve etek paneli'),
      'uretim', JSON_ARRAY('Teknik çizime göre kalıp', 'Numune onayı', 'Seri üretim', 'Montaj detayı uyarlaması'),
      'avantajlar', JSON_ARRAY('Hafiflik', 'Korozyon direnci', 'Yüzey kalitesi', 'Ölçü tekrarlanabilirliği')
    ),
    'Kompozit Tren Parçaları | Raylı Sistem CTP Panel Üretimi | MOE Kompozit',
    'Kompozit tren parçaları; raylı sistem iç trim, tavan, yan panel, kapak ve muhafaza ihtiyaçları için hafif, dayanıklı CTP/karbon fiber üretim çözümü.'
  ),
  (
    'kd040006-9206-4206-9206-bbbbbbbb0006',
    'en',
    'Composite Train Parts',
    'composite-train-parts',
    '<h2>Composite Train Parts</h2><p>Composite train parts can be manufactured for rail vehicles as lightweight interior trims, ceiling panels, side wall covers, door surrounds, exterior access covers, nose/skirt panels and equipment housings. FRP and carbon fiber reinforced composite structures support weight reduction, corrosion resistance, repeatable surface quality and serial-production tooling discipline.</p><h3>Rail System Applications</h3><ul><li>Interior and exterior body components for train, tram, metro and light rail vehicles</li><li>Resin and laminate selection aligned to fire, smoke and mechanical requirements</li><li>Tooling, sample approval and serial production planning for OEM dimensions</li><li>Custom color, surface texture, fixing points and assembly details</li></ul><h3>Quotation and Production Process</h3><p>Technical drawings, sample parts, target quantity, surface expectations and applicable standards allow a production scenario from prototype to serial manufacturing.</p>',
    'Composite train and rail-system parts product image',
    JSON_ARRAY('composite train parts', 'rail system composite', 'FRP train panel', 'train interior trim', 'OEM composite manufacturing'),
    JSON_OBJECT(
      'material', JSON_ARRAY('FRP / GRP', 'Carbon fiber reinforced composite', 'Project-specific resin system'),
      'application', JSON_ARRAY('Interior trim panel', 'Ceiling and side panel', 'Door surround trim', 'Exterior cover and housing', 'Nose and skirt panel'),
      'manufacturing', JSON_ARRAY('Tooling from technical drawings', 'Sample approval', 'Serial production', 'Assembly-detail adaptation'),
      'advantages', JSON_ARRAY('Lightweight structure', 'Corrosion resistance', 'Surface quality', 'Dimensional repeatability')
    ),
    'Composite Train Parts | Rail System FRP Panel Manufacturing | MOE Kompozit',
    'Composite train parts for rail-system interior trims, ceiling panels, side panels, covers and housings; lightweight FRP/carbon fiber manufacturing solution.'
  ),
  (
    'kd040007-9207-4207-9207-bbbbbbbb0007',
    'tr',
    'Savunma Sanayi Kompozit Parçaları',
    'savunma-sanayi-kompozit-parcalari',
    '<h2>Savunma Sanayi Kompozit Parçaları</h2><p>Savunma sanayi kompozit parçaları; hafif yapısal panel, ekipman muhafazası, elektronik kutu gövdesi, radom benzeri kapak, koruyucu dış kabuk ve teknik kompozit gövde ihtiyaçları için proje gizliliğine uygun şekilde üretilebilir. Karbon fiber ve cam elyaf takviyeli kompozitler, metal alternatiflere göre ağırlık avantajı, korozyon direnci ve tasarım esnekliği sunar.</p><h3>Teknik Üretim Kapsamı</h3><ul><li>Teknik şartname ve çizime göre kalıp, prototip ve seri üretim</li><li>Reçine, elyaf, cidar kalınlığı, insert ve bağlantı detayı seçimi</li><li>Elektronik muhafaza, koruyucu kapak, yapısal panel ve özel gövde uygulamaları</li><li>NDA, numune onayı ve kalite dokümantasyonu ile kontrollü proje yönetimi</li></ul><h3>Kullanım Alanları</h3><p>Bu ürün grubu silah veya mühimmat üretimi değil; savunma, havacılık ve teknik ekipman projelerinde kullanılan kompozit muhafaza, panel ve koruyucu gövde bileşenleri için konumlandırılmıştır.</p>',
    'Savunma sanayi için teknik kompozit muhafaza ve panel parçaları ürün görseli',
    JSON_ARRAY('savunma sanayi kompozit', 'karbon fiber muhafaza', 'CTP ekipman gövdesi', 'hafif kompozit parça', 'teknik kompozit panel'),
    JSON_OBJECT(
      'malzeme', JSON_ARRAY('Karbon fiber kompozit', 'Cam elyaf takviyeli CTP', 'Proje bazlı reçine sistemi'),
      'uygulama', JSON_ARRAY('Ekipman muhafazası', 'Elektronik kutu gövdesi', 'Radom benzeri kapak', 'Koruyucu dış kabuk', 'Yapısal panel'),
      'uretim', JSON_ARRAY('NDA ile proje yönetimi', 'Teknik çizime göre kalıp', 'Prototip', 'Seri üretim', 'Kalite dokümantasyonu'),
      'avantajlar', JSON_ARRAY('Ağırlık azaltma', 'Korozyon direnci', 'Tasarım esnekliği', 'Yüksek yüzey kalitesi')
    ),
    'Savunma Sanayi Kompozit Parçaları | Karbon Fiber CTP Muhafaza | MOE Kompozit',
    'Savunma sanayi kompozit parçaları; teknik ekipman muhafazası, karbon fiber panel, CTP gövde ve koruyucu kapak üretimi için proje bazlı çözüm.'
  ),
  (
    'kd040007-9207-4207-9207-bbbbbbbb0007',
    'en',
    'Defense Industry Composite Parts',
    'defense-industry-composite-parts',
    '<h2>Defense Industry Composite Parts</h2><p>Defense industry composite parts can be manufactured for lightweight structural panels, equipment enclosures, electronics housings, radome-like covers, protective outer shells and technical composite bodies under project confidentiality. Carbon fiber and fiberglass reinforced composites offer weight reduction, corrosion resistance and design flexibility compared with many metal alternatives.</p><h3>Technical Manufacturing Scope</h3><ul><li>Tooling, prototype and serial production according to technical drawings and specifications</li><li>Resin, fiber, wall thickness, insert and fastening-detail selection</li><li>Electronics enclosures, protective covers, structural panels and custom body applications</li><li>Controlled project management with NDA, sample approval and quality documentation</li></ul><h3>Application Focus</h3><p>This product group is positioned for composite enclosures, panels and protective body components used in defense, aerospace and technical equipment projects; it is not a weapon or ammunition product.</p>',
    'Technical composite enclosures and panel parts for defense industry product image',
    JSON_ARRAY('defense industry composite', 'carbon fiber enclosure', 'FRP equipment housing', 'lightweight composite part', 'technical composite panel'),
    JSON_OBJECT(
      'material', JSON_ARRAY('Carbon fiber composite', 'Fiberglass reinforced FRP', 'Project-specific resin system'),
      'application', JSON_ARRAY('Equipment enclosure', 'Electronics housing', 'Radome-like cover', 'Protective outer shell', 'Structural panel'),
      'manufacturing', JSON_ARRAY('NDA project management', 'Tooling from technical drawings', 'Prototype', 'Serial production', 'Quality documentation'),
      'advantages', JSON_ARRAY('Weight reduction', 'Corrosion resistance', 'Design flexibility', 'High surface quality')
    ),
    'Defense Industry Composite Parts | Carbon Fiber FRP Enclosures | MOE Kompozit',
    'Defense industry composite parts for technical equipment enclosures, carbon fiber panels, FRP bodies and protective covers; project-based manufacturing solution.'
  )
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `slug` = VALUES(`slug`),
  `description` = VALUES(`description`),
  `alt` = VALUES(`alt`),
  `tags` = VALUES(`tags`),
  `specifications` = VALUES(`specifications`),
  `meta_title` = VALUES(`meta_title`),
  `meta_description` = VALUES(`meta_description`),
  `updated_at` = NOW(3);

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;
