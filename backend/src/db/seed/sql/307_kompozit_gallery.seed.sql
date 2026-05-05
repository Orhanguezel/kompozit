-- =============================================================
-- FILE: 307_kompozit_gallery.seed.sql
-- MOE Kompozit — Ornek galeri verileri (TR/EN)
-- module_key = 'kompozit'
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

DELETE FROM `gallery_image_i18n`
WHERE `image_id` LIKE 'kg02000%' OR `image_id` LIKE 'kg03000%';

DELETE FROM `gallery_images`
WHERE `id` LIKE 'kg02000%' OR `id` LIKE 'kg03000%';

DELETE FROM `gallery_i18n`
WHERE `gallery_id` LIKE 'kg01000%' OR `gallery_id` LIKE 'kg010100%';

DELETE FROM `galleries`
WHERE `module_key` = 'kompozit'
  AND (`id` LIKE 'kg01000%' OR `id` LIKE 'kg010100%');

INSERT INTO `galleries`
(
  `id`,
  `module_key`,
  `source_id`,
  `source_type`,
  `is_active`,
  `is_featured`,
  `display_order`
)
VALUES
  (
    '97010001-8001-4001-9001-eeeeeeee0001',
    'kompozit',
    'kd010001-7001-4001-9001-dddddddd0001',
    'product',
    1,
    1,
    10
  ),
  (
    '97010002-8002-4002-9002-eeeeeeee0002',
    'kompozit',
    'kd010002-7002-4002-9002-dddddddd0002',
    'product',
    1,
    1,
    20
  )
ON DUPLICATE KEY UPDATE
  `module_key` = VALUES(`module_key`),
  `source_id` = VALUES(`source_id`),
  `source_type` = VALUES(`source_type`),
  `is_active` = VALUES(`is_active`),
  `is_featured` = VALUES(`is_featured`),
  `display_order` = VALUES(`display_order`);

INSERT INTO `gallery_i18n`
(
  `gallery_id`,
  `locale`,
  `title`,
  `slug`,
  `description`,
  `meta_title`,
  `meta_description`
)
VALUES
  (
    '97010001-8001-4001-9001-eeeeeeee0001',
    'tr',
    'Karbon Fiber Panel Uygulama Galerisi',
    'karbon-fiber-panel-uygulama-galerisi',
    'Karbon fiber panel prototipinden nihai yuzey kontrolune uzanan ornek uygulama galerisi.',
    'Karbon Fiber Panel Uygulama Galerisi | MOE Kompozit',
    'Karbon fiber panel uygulama galerisi. Prototip, kenar isleme ve montaj oncesi kontrol adimlarini gosterir.'
  ),
  (
    '97010001-8001-4001-9001-eeeeeeee0001',
    'en',
    'Carbon Fiber Panel Application Gallery',
    'carbon-fiber-panel-application-gallery',
    'Sample application gallery showing a carbon fiber panel from prototype to final surface inspection.',
    'Carbon Fiber Panel Application Gallery | MOE Kompozit',
    'Carbon fiber panel application gallery covering prototype, trimming, and pre-assembly inspection steps.'
  ),
  (
    '97010002-8002-4002-9002-eeeeeeee0002',
    'tr',
    'CTP Govde Paneli Uretim Galerisi',
    'ctp-govde-paneli-uretim-galerisi',
    'CTP govde panelinde kalip, laminasyon ve son trim surecini gosteren ornek galeri.',
    'CTP Govde Paneli Uretim Galerisi | MOE Kompozit',
    'CTP govde paneli uretim galerisi. Kalip hazirlama, laminasyon ve trim asamalarini one cikarir.'
  ),
  (
    '97010002-8002-4002-9002-eeeeeeee0002',
    'en',
    'FRP Enclosure Panel Production Gallery',
    'frp-enclosure-panel-production-gallery',
    'Sample gallery showing mold prep, lamination, and trimming for an FRP enclosure panel.',
    'FRP Enclosure Panel Production Gallery | MOE Kompozit',
    'FRP enclosure panel production gallery focused on mold preparation, lamination, and trimming.'
  )
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `slug` = VALUES(`slug`),
  `description` = VALUES(`description`),
  `meta_title` = VALUES(`meta_title`),
  `meta_description` = VALUES(`meta_description`);

INSERT INTO `gallery_images`
(
  `id`,
  `gallery_id`,
  `storage_asset_id`,
  `image_url`,
  `display_order`,
  `is_cover`
)
VALUES
  (
    '97020001-8101-4001-9001-eeeeeeee0101',
    '97010001-8001-4001-9001-eeeeeeee0001',
    NULL,
    '/media/gallery-placeholder.svg',
    10,
    1
  ),
  (
    '97020002-8102-4002-9002-eeeeeeee0102',
    '97010001-8001-4001-9001-eeeeeeee0001',
    NULL,
    '/media/gallery-placeholder.svg',
    20,
    0
  ),
  (
    '97020003-8103-4003-9003-eeeeeeee0103',
    '97010002-8002-4002-9002-eeeeeeee0002',
    NULL,
    '/media/gallery-placeholder.svg',
    10,
    1
  ),
  (
    '97020004-8104-4004-9004-eeeeeeee0104',
    '97010002-8002-4002-9002-eeeeeeee0002',
    NULL,
    '/media/gallery-placeholder.svg',
    20,
    0
  )
ON DUPLICATE KEY UPDATE
  `storage_asset_id` = VALUES(`storage_asset_id`),
  `image_url` = VALUES(`image_url`),
  `display_order` = VALUES(`display_order`),
  `is_cover` = VALUES(`is_cover`);

INSERT INTO `gallery_image_i18n`
(
  `image_id`,
  `locale`,
  `alt`,
  `caption`,
  `description`
)
VALUES
  (
    '97020001-8101-4001-9001-eeeeeeee0101',
    'tr',
    'Karbon fiber panel prototip yuzeyi',
    'Prototip yuzey kontrolu',
    'Karbon fiber panelin ilk yuzey ve kenar dogrulama asamasi.'
  ),
  (
    '97020001-8101-4001-9001-eeeeeeee0101',
    'en',
    'Carbon fiber panel prototype surface',
    'Prototype surface inspection',
    'Initial surface and edge validation stage of the carbon fiber panel.'
  ),
  (
    '97020002-8102-4002-9002-eeeeeeee0102',
    'tr',
    'Karbon fiber panel son trim hazirligi',
    'Trim ve montaj oncesi kontrol',
    'Karbon fiber panelde trim ve montaj oncesi olculendirme kontrolu.'
  ),
  (
    '97020002-8102-4002-9002-eeeeeeee0102',
    'en',
    'Carbon fiber panel pre-trim setup',
    'Pre-trim and assembly check',
    'Dimensional check before trimming and assembly of the carbon fiber panel.'
  ),
  (
    '97020003-8103-4003-9003-eeeeeeee0103',
    'tr',
    'CTP govde paneli laminasyon asamasi',
    'Laminasyon adimi',
    'CTP govde panelinde katmanlama ve recine dagilim kontrolu.'
  ),
  (
    '97020003-8103-4003-9003-eeeeeeee0103',
    'en',
    'FRP enclosure panel lamination stage',
    'Lamination step',
    'Lamination and resin distribution control in the FRP enclosure panel process.'
  ),
  (
    '97020004-8104-4004-9004-eeeeeeee0104',
    'tr',
    'CTP govde paneli son trim',
    'Son trim ve teslim hazirligi',
    'CTP govde panelinin son trim ve teslimat oncesi gorsel kontrol kaydi.'
  ),
  (
    '97020004-8104-4004-9004-eeeeeeee0104',
    'en',
    'FRP enclosure final trimming',
    'Final trim and dispatch prep',
    'Final trim and visual inspection record before dispatch of the FRP enclosure panel.'
  )
ON DUPLICATE KEY UPDATE
  `alt` = VALUES(`alt`),
  `caption` = VALUES(`caption`),
  `description` = VALUES(`description`);

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;
