-- =============================================================
-- FILE: 307_kompozit_solutions.seed.sql
-- MOE Kompozit — Uygulama / çözüm hatları (custom_pages)
-- module_key = 'kompozit_solutions'
-- Slug tr/en aynı; içerik locale satırında.
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

INSERT INTO `custom_pages`
(
  `id`,
  `module_key`,
  `is_published`,
  `featured`,
  `display_order`,
  `order_num`,
  `featured_image`,
  `featured_image_asset_id`,
  `image_url`,
  `storage_asset_id`,
  `images`,
  `storage_image_ids`,
  `category_id`,
  `sub_category_id`
)
VALUES
  ('bs010001-7001-4001-9001-ssssssss0001', 'kompozit_solutions', 1, 1, 10, 10, NULL, NULL, NULL, NULL, '[]', '[]', NULL, NULL),
  ('bs010002-7002-4002-9002-ssssssss0002', 'kompozit_solutions', 1, 1, 20, 20, NULL, NULL, NULL, NULL, '[]', '[]', NULL, NULL),
  ('bs010003-7003-4003-9003-ssssssss0003', 'kompozit_solutions', 1, 1, 30, 30, NULL, NULL, NULL, NULL, '[]', '[]', NULL, NULL),
  ('bs010004-7004-4004-9004-ssssssss0004', 'kompozit_solutions', 1, 1, 40, 40, NULL, NULL, NULL, NULL, '[]', '[]', NULL, NULL)
ON DUPLICATE KEY UPDATE
  `module_key` = VALUES(`module_key`),
  `is_published` = VALUES(`is_published`),
  `featured` = VALUES(`featured`),
  `display_order` = VALUES(`display_order`),
  `order_num` = VALUES(`order_num`);

INSERT INTO `custom_pages_i18n`
(
  `id`,
  `page_id`,
  `locale`,
  `title`,
  `slug`,
  `content`,
  `summary`,
  `meta_title`,
  `meta_description`,
  `tags`
)
VALUES
  (
    'bs020001-8001-4001-a001-ssssssss0001',
    'bs010001-7001-4001-9001-ssssssss0001',
    'tr',
    'Kompozit saksı ve peyzaj ürünleri',
    'solution-planters',
    JSON_OBJECT('html', '<p>UV, nem döngüsü ve dış mekan sıcaklığına dayanıklı kompozit saksı ve peyzaj elemanlarında; yüzey kalitesi, tekrarlanabilir üretim ve seri kapasiteyi aynı çatı altında planlıyoruz.</p><h2>Ne sunuyoruz?</h2><ul><li>Özel ölçü ve seri üretim</li><li>Hafiflik ile taşıma kolaylığı</li><li>Kimyasal ve çevresel dayanım için reçine / cam elyaf seçimi</li><li>Numune ile renk, doku ve mukavemet doğrulaması</li></ul><h2>B2B süreç</h2><p>Teknik çizim, kullanım ortamı ve termin beklentinizi netleştirip prototip sonrası seri üretim rampasını birlikte tanımlıyoruz. İhracat ambalajı ve dokümantasyon ihtiyaçlarını proje başında ele alıyoruz.</p>'),
    'Dış mekan ve peyzaj için CTP / cam elyaf kompozit saksı ve seri üretim çözümleri.',
    'Kompozit Saksı ve Peyzaj | MOE Kompozit',
    'MOE Kompozit: kompozit saksı, peyzaj kabı ve dış mekan ürünlerinde seri üretim, numune ve B2B proje desteği.',
    'kompozit saksı, peyzaj, CTP saksı, dış mekan kompozit'
  ),
  (
    'bs020002-8002-4002-a002-ssssssss0002',
    'bs010001-7001-4001-9001-ssssssss0001',
    'en',
    'Composite planters and landscape products',
    'solution-planters',
    JSON_OBJECT('html', '<p>For composite planters and landscape elements exposed to UV, moisture cycles and outdoor temperature swings, we align surface quality, repeatable manufacturing and scalable capacity.</p><h2>What we deliver</h2><ul><li>Custom dimensions and serial production</li><li>Lightweight designs for logistics efficiency</li><li>Resin / fiberglass selection for chemical and environmental resistance</li><li>Sample validation for color, texture and mechanical performance</li></ul><h2>B2B workflow</h2><p>We clarify drawings, operating environment and delivery expectations, then define prototype-to-production ramp-up together. Export packaging and documentation can be scoped early.</p>'),
    'FRP / fiberglass composite planters and outdoor product manufacturing for B2B programs.',
    'Composite Planters & Landscape | MOE Kompozit',
    'MOE Kompozit: composite planters, landscape containers and outdoor fiberglass manufacturing with sampling and serial production support.',
    'composite planters, fiberglass planter, landscape composite'
  ),
  (
    'bs020003-8003-4003-a003-ssssssss0003',
    'bs010002-7002-4002-9002-ssssssss0002',
    'tr',
    'Kompozit tabut ve defin hizmetleri ürünleri',
    'solution-coffins',
    JSON_OBJECT('html', '<p>Defin hizmetleri ve seremoni ihtiyaçları için hafif, taşınabilir ve yüzey işçiliği kontrollü kompozit tabut üretiminde; ölçü standardizasyonu, seri kapasite ve lojistik uyumluluğa odaklanıyoruz.</p><h2>Teknik yaklaşım</h2><ul><li>Ağırlık ve taşıma ergonomisi</li><li>Yüzey kaplama / boya uyumu</li><li>Seri üretimde tekrarlanabilir kalıp disiplini</li><li>Müşteri markasına özel varyantlar</li></ul><h2>İş birliği modeli</h2><p>Firmaya özel teknik şartname, numune onayı ve termin planı ile üretimi kilitleyip ihracat veya iç pazar dağıtımına uygun paketleme seçenekleri sunuyoruz.</p>'),
    'Hafif kompozit tabut imalatı; seri üretim, numune ve B2B ortaklık modeli.',
    'Kompozit Tabut İmalatı | MOE Kompozit',
    'MOE Kompozit: kompozit tabut üretimi, hafif yapı, seri kapasite ve defin sektörüne yönelik B2B çözümler.',
    'kompozit tabut, fiberglass tabut, hafif tabut üretimi'
  ),
  (
    'bs020004-8004-4004-a004-ssssssss0004',
    'bs010002-7002-4002-9002-ssssssss0002',
    'en',
    'Composite coffins and funeral-sector products',
    'solution-coffins',
    JSON_OBJECT('html', '<p>For funeral services and ceremonial needs, we focus on lightweight, transport-friendly composite coffin manufacturing with controlled surface finishing, dimensional standardization and logistics-friendly serial capacity.</p><h2>Engineering focus</h2><ul><li>Weight and handling ergonomics</li><li>Compatibility with coatings and paint systems</li><li>Repeatable molding discipline at scale</li><li>Customer-branded variants</li></ul><h2>Partnership model</h2><p>We align on technical specifications, sample approval and delivery planning, then support packaging options suited to export or domestic distribution.</p>'),
    'Lightweight composite coffin manufacturing for B2B funeral-sector programs.',
    'Composite Coffins | MOE Kompozit',
    'MOE Kompozit: composite coffin manufacturing, lightweight construction and B2B programs for the funeral sector.',
    'composite coffin, fiberglass coffin, lightweight coffin manufacturing'
  ),
  (
    'bs020005-8005-4005-a005-ssssssss0005',
    'bs010003-7003-4003-9003-ssssssss0003',
    'tr',
    'Kompozit depo ve tank çözümleri',
    'solution-storage-tanks',
    JSON_OBJECT('html', '<p>Kimyasal dayanım, sızdırmazlık ve uzun ömür beklentisi olan depolama uygulamalarında cam elyaf / CTP kompozit tank ve muhafaza gövdeleri için kalınlık, reçine sistemi ve bağlantı detaylarını proje bazında mühendislikle netleştiriyoruz.</p><h2>Uygulama alanları</h2><ul><li>Su ve atık su muhafazası</li><li>Kimyasal konsantrasyon ve sıcaklık sınırlarına göre laminat</li><li>Yerinde montaj veya modüler sevkiyat senaryoları</li></ul><h2>B2B teklif</h2><p>Hacim, çalışma basıncı, içerik sınıfı ve erişim detaylarına göre teknik teklif hazırlıyor; numune panel veya deney düzeneği ihtiyacını erken fazda planlıyoruz.</p>'),
    'CTP / FRP kompozit depo ve tank gövdeleri için proje bazlı mühendislik ve üretim.',
    'Kompozit Depo ve Tank | MOE Kompozit',
    'MOE Kompozit: kompozit tank, depo ve kimyasal dayanımlı FRP muhafaza çözümleri; B2B proje ve seri üretim.',
    'kompozit tank, CTP depo, FRP tank, kimyasal dayanım'
  ),
  (
    'bs020006-8006-4006-a006-ssssssss0006',
    'bs010003-7003-4003-9003-ssssssss0003',
    'en',
    'Composite storage tanks and containment',
    'solution-storage-tanks',
    JSON_OBJECT('html', '<p>For storage applications that demand chemical resistance, leak integrity and long service life, we engineer fiberglass / FRP tank and enclosure bodies with project-specific thickness, resin system and joint detailing.</p><h2>Application areas</h2><ul><li>Water and wastewater containment</li><li>Laminates aligned to chemical concentration and temperature limits</li><li>Field assembly or modular shipment scenarios</li></ul><h2>B2B quotation</h2><p>We prepare technical offers from volume, operating pressure, media class and access constraints, and plan sample panels or test rigs when needed.</p>'),
    'Project-based engineering and manufacturing for FRP composite tanks and storage vessels.',
    'Composite Storage Tanks | MOE Kompozit',
    'MOE Kompozit: FRP composite tanks, storage vessels and chemically resistant containment for industrial B2B projects.',
    'FRP tank, fiberglass storage tank, composite containment'
  ),
  (
    'bs020007-8007-4007-a007-ssssssss0007',
    'bs010004-7004-4004-9004-ssssssss0004',
    'tr',
    'Özel B2B kompozit imalat ve ihracat',
    'solution-custom-b2b',
    JSON_OBJECT('html', '<p>Karbon fiber, cam elyaf veya hibrit laminatlarla çalışan OEM ve endüstriyel firmalar için parça, panel, muhafaza ve taşıyıcı bileşenlerde proje bazlı özel imalat sunuyoruz.</p><h2>Güçlü yönlerimiz</h2><ul><li>Malzeme ve proses seçiminde mühendislik desteği</li><li>Numune — revizyon — seri üretim geçiş planı</li><li>Kalite kayıtları ve tekrarlanabilir proses disiplini</li><li>İhracat için paketleme ve dokümantasyon uyumu</li></ul><h2>Nasıl başlarız?</h2><p>Teknik çizim, miktar, termin ve hedef pazarınızı paylaşın; teknik değerlendirme sonrası yol haritası ve teklif sunalım.</p>'),
    'Karbon fiber ve cam elyaf kompozitte OEM / ihracat odaklı özel parça üretimi.',
    'Özel B2B Kompozit İmalat | MOE Kompozit',
    'MOE Kompozit: özel B2B kompozit imalat, OEM parça, ihracat programları ve mühendislik destekli üretim.',
    'b2b kompozit, özel imalat, oem kompozit, ihracat üretim'
  ),
  (
    'bs020008-8008-4008-a008-ssssssss0008',
    'bs010004-7004-4004-9004-ssssssss0004',
    'en',
    'Custom B2B composite manufacturing & export programs',
    'solution-custom-b2b',
    JSON_OBJECT('html', '<p>We deliver project-based custom manufacturing for OEM and industrial teams working with carbon fiber, fiberglass or hybrid laminates—parts, panels, enclosures and structural components included.</p><h2>Where we add value</h2><ul><li>Engineering support for material and process selection</li><li>Sample–revision–serial production transition planning</li><li>Quality records and repeatable process discipline</li><li>Export-ready packaging and documentation alignment</li></ul><h2>How to start</h2><p>Share drawings, volumes, timing and target markets; after technical review we propose a roadmap and quotation.</p>'),
    'OEM-focused custom composite parts with engineering support and export readiness.',
    'Custom B2B Composite Manufacturing | MOE Kompozit',
    'MOE Kompozit: custom B2B composite manufacturing, OEM parts, export programs and engineering-led production.',
    'custom composite manufacturing, OEM fiberglass, B2B composites'
  )
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `slug` = VALUES(`slug`),
  `content` = VALUES(`content`),
  `summary` = VALUES(`summary`),
  `meta_title` = VALUES(`meta_title`),
  `meta_description` = VALUES(`meta_description`),
  `tags` = VALUES(`tags`);

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;
