-- =============================================================
-- FILE: 319_kompozit_seo_pages.seed.sql
-- MOE Kompozit — sayfa-bazli SEO ayarlari (kompozit__seo_pages)
-- Admin paneldeki "SEO Ayarlari" tabi ile birebir.
-- Yapi: { [pageKey]: { title, description, og_image, no_index } }
-- pageKey'ler frontend rotalariyla eslesir.
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- =============================================================
-- SEO PAGES — TR
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES (
  UUID(),
  'kompozit__seo_pages',
  'tr',
  JSON_OBJECT(
    'home', JSON_OBJECT(
      'title',       'Karbon Fiber, CTP ve Cam Elyaf Kompozit Üretimi',
      'description', 'MOE Kompozit; karbon fiber, CTP ve cam elyaf üretiminde numune, mühendislik ve seri üretim desteği sunan B2B kompozit markasıdır.',
      'og_image',    '',
      'no_index',    FALSE
    ),
    'about', JSON_OBJECT(
      'title',       'Hakkımızda',
      'description', 'MOE Kompozit''in Ensotek mühendislik birikimiyle karbon fiber, CTP ve cam elyaf projelerinde nasıl çalıştığını keşfedin.',
      'og_image',    '',
      'no_index',    FALSE
    ),
    'contact', JSON_OBJECT(
      'title',       'İletişim — Numune ve Teklif İçin Teknik İletişim',
      'description', 'Karbon fiber, CTP ve cam elyaf projeniz için teknik uygunluk, numune, termin ve teklif görüşmesi yapmak üzere bize ulaşın.',
      'og_image',    '',
      'no_index',    FALSE
    ),
    'products', JSON_OBJECT(
      'title',       'Ürünlerimiz — Karbon Fiber, CTP ve Cam Elyaf Parçalar',
      'description', 'Karbon fiber, CTP ve cam elyaf kompozit ürünleri; hafiflik, dayanım, yüzey kalitesi ve tekrarlanabilir B2B üretim için inceleyin.',
      'og_image',    '',
      'no_index',    FALSE
    ),
    'product-detail', JSON_OBJECT(
      'title',       '',
      'description', '',
      'og_image',    '',
      'no_index',    FALSE
    ),
    'solutions', JSON_OBJECT(
      'title',       'Çözümler',
      'description', 'Saksı, tank, defin grubu ve özel B2B kompozit imalat çözümlerinde malzeme seçimi, üretim disiplini ve teklif adımlarını görün.',
      'og_image',    '',
      'no_index',    FALSE
    ),
    'solution-detail', JSON_OBJECT(
      'title',       '',
      'description', '',
      'og_image',    '',
      'no_index',    FALSE
    ),
    'gallery', JSON_OBJECT(
      'title',       'Galeri — Kompozit Üretim ve Proje Görselleri',
      'description', 'Kompozit üretim tesisi, kalıplama, montaj, ürün detayları ve tamamlanan proje görsellerini MOE Kompozit galerisinde inceleyin.',
      'og_image',    '',
      'no_index',    FALSE
    ),
    'gallery-detail', JSON_OBJECT(
      'title',       '',
      'description', '',
      'og_image',    '',
      'no_index',    FALSE
    ),
    'references', JSON_OBJECT(
      'title',       'Referanslar — Kurumsal İş Birliği ve Teslim Disiplini',
      'description', 'MOE Kompozit referansları; kurumsal iş birlikleri, uygulama tipleri ve tekrarlanabilir kompozit üretim disiplinini özetler.',
      'og_image',    '',
      'no_index',    FALSE
    ),
    'blog', JSON_OBJECT(
      'title',       'Blog — Kompozit Mühendislik ve Üretim Notları',
      'description', 'Karbon fiber, CTP, cam elyaf, kalıplama, yüzey kalitesi ve kompozit sektör uygulamaları hakkında teknik blog içerikleri.',
      'og_image',    '',
      'no_index',    FALSE
    ),
    'blog-post', JSON_OBJECT(
      'title',       '',
      'description', '',
      'og_image',    '',
      'no_index',    FALSE
    ),
    'offer', JSON_OBJECT(
      'title',       'Teklif Talebi — Kompozit Teklif, Uygunluk ve Termin',
      'description', 'Kompozit projeniz için ürün kategorisi, sektör, miktar, termin ve teknik dosyalarla hızlı B2B teklif talebi oluşturun.',
      'og_image',    '',
      'no_index',    FALSE
    ),
    'legal', JSON_OBJECT(
      'title',       '',
      'description', '',
      'og_image',    '',
      'no_index',    FALSE
    )
  ),
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- SEO PAGES — EN
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES (
  UUID(),
  'kompozit__seo_pages',
  'en',
  JSON_OBJECT(
    'home', JSON_OBJECT(
      'title',       'Carbon Fiber, FRP and Fiberglass Composite Manufacturing',
      'description', 'MOE Kompozit is a B2B composite brand for carbon fiber, FRP and fiberglass projects, supporting sampling, engineering and repeatable production.',
      'og_image',    '',
      'no_index',    FALSE
    ),
    'about', JSON_OBJECT(
      'title',       'About Us',
      'description', 'Discover how MOE Kompozit applies Ensotek engineering experience to carbon fiber, FRP and fiberglass composite projects.',
      'og_image',    '',
      'no_index',    FALSE
    ),
    'contact', JSON_OBJECT(
      'title',       'Contact — Technical Contact for Sampling and Quotes',
      'description', 'Contact MOE Kompozit for technical fit, sampling, lead time and quote discussions for carbon fiber, FRP and fiberglass projects.',
      'og_image',    '',
      'no_index',    FALSE
    ),
    'products', JSON_OBJECT(
      'title',       'Our Products — Carbon Fiber, FRP and Fiberglass Parts',
      'description', 'Browse carbon fiber, FRP and fiberglass composite products built for lightweighting, durability, surface quality and repeatable B2B production.',
      'og_image',    '',
      'no_index',    FALSE
    ),
    'product-detail', JSON_OBJECT(
      'title',       '',
      'description', '',
      'og_image',    '',
      'no_index',    FALSE
    ),
    'solutions', JSON_OBJECT(
      'title',       'Solutions',
      'description', 'Explore planter, tank, funeral-sector and custom B2B composite solutions with material selection, production discipline and quote steps.',
      'og_image',    '',
      'no_index',    FALSE
    ),
    'solution-detail', JSON_OBJECT(
      'title',       '',
      'description', '',
      'og_image',    '',
      'no_index',    FALSE
    ),
    'gallery', JSON_OBJECT(
      'title',       'Gallery — Composite Production and Project Visuals',
      'description', 'View composite production facility, molding, assembly, product detail and completed project visuals in the MOE Kompozit gallery.',
      'og_image',    '',
      'no_index',    FALSE
    ),
    'gallery-detail', JSON_OBJECT(
      'title',       '',
      'description', '',
      'og_image',    '',
      'no_index',    FALSE
    ),
    'references', JSON_OBJECT(
      'title',       'References — Enterprise Collaboration and Delivery Discipline',
      'description', 'MOE Kompozit references summarize enterprise collaboration, application types and repeatable composite production delivery discipline.',
      'og_image',    '',
      'no_index',    FALSE
    ),
    'blog', JSON_OBJECT(
      'title',       'Blog — Composite Engineering and Production Insights',
      'description', 'Technical blog content on carbon fiber, FRP, fiberglass, molding, surface quality and industrial composite applications.',
      'og_image',    '',
      'no_index',    FALSE
    ),
    'blog-post', JSON_OBJECT(
      'title',       '',
      'description', '',
      'og_image',    '',
      'no_index',    FALSE
    ),
    'offer', JSON_OBJECT(
      'title',       'Quote Request — Composite Quote, Feasibility and Lead Time',
      'description', 'Create a fast B2B quote request for your composite project with category, sector, quantity, lead time and technical files.',
      'og_image',    '',
      'no_index',    FALSE
    ),
    'legal', JSON_OBJECT(
      'title',       '',
      'description', '',
      'og_image',    '',
      'no_index',    FALSE
    )
  ),
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- SEO PAGES — DE
-- (de admin paneline acik; aktif locale degil ama yer tutucu olarak yer alir)
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES (
  UUID(),
  'kompozit__seo_pages',
  'de',
  JSON_OBJECT(
    'home', JSON_OBJECT(
      'title',       'Carbonfaser, GFK und Glasfaser Verbundfertigung',
      'description', 'MOE Kompozit ist eine B2B-Verbundmarke für Carbonfaser-, GFK- und Glasfaserprojekte mit Mustern, Engineering und wiederholbarer Serienfertigung.',
      'og_image',    '',
      'no_index',    FALSE
    ),
    'about', JSON_OBJECT(
      'title',       'Über uns',
      'description', 'Erfahren Sie, wie MOE Kompozit das Ensotek-Engineering-Know-how auf Carbonfaser-, GFK- und Glasfaserprojekte anwendet.',
      'og_image',    '',
      'no_index',    FALSE
    ),
    'contact', JSON_OBJECT(
      'title',       'Kontakt — Technische Ansprechpartner für Muster und Angebote',
      'description', 'Kontaktieren Sie MOE Kompozit für technische Eignung, Muster, Lieferzeit und Angebotsgespräche zu Carbonfaser-, GFK- und Glasfaserprojekten.',
      'og_image',    '',
      'no_index',    FALSE
    ),
    'products', JSON_OBJECT(
      'title',       'Produkte — Carbonfaser, GFK und Glasfaser Bauteile',
      'description', 'Carbonfaser-, GFK- und Glasfaser-Verbundprodukte für Leichtbau, Haltbarkeit, Oberflächenqualität und wiederholbare B2B-Produktion.',
      'og_image',    '',
      'no_index',    FALSE
    ),
    'product-detail', JSON_OBJECT(
      'title',       '',
      'description', '',
      'og_image',    '',
      'no_index',    FALSE
    ),
    'solutions', JSON_OBJECT(
      'title',       'Lösungen',
      'description', 'Pflanzkübel, Tanks, Bestattungsgruppe und individuelle B2B-Verbundlösungen mit Materialauswahl, Fertigungsdisziplin und Angebotsschritten.',
      'og_image',    '',
      'no_index',    FALSE
    ),
    'solution-detail', JSON_OBJECT(
      'title',       '',
      'description', '',
      'og_image',    '',
      'no_index',    FALSE
    ),
    'gallery', JSON_OBJECT(
      'title',       'Galerie — Verbundfertigung und Projektbilder',
      'description', 'Verbundfertigung, Formenbau, Montage, Produktdetails und abgeschlossene Projektbilder in der MOE Kompozit-Galerie.',
      'og_image',    '',
      'no_index',    FALSE
    ),
    'gallery-detail', JSON_OBJECT(
      'title',       '',
      'description', '',
      'og_image',    '',
      'no_index',    FALSE
    ),
    'references', JSON_OBJECT(
      'title',       'Referenzen — Unternehmenskooperation und Lieferdisziplin',
      'description', 'MOE Kompozit-Referenzen fassen Unternehmenskooperation, Anwendungstypen und wiederholbare Verbundfertigungs-Lieferdisziplin zusammen.',
      'og_image',    '',
      'no_index',    FALSE
    ),
    'blog', JSON_OBJECT(
      'title',       'Blog — Verbund-Engineering und Fertigungsnotizen',
      'description', 'Technische Blog-Inhalte zu Carbonfaser, GFK, Glasfaser, Formenbau, Oberflächenqualität und industriellen Verbundanwendungen.',
      'og_image',    '',
      'no_index',    FALSE
    ),
    'blog-post', JSON_OBJECT(
      'title',       '',
      'description', '',
      'og_image',    '',
      'no_index',    FALSE
    ),
    'offer', JSON_OBJECT(
      'title',       'Angebotsanfrage — Verbund-Angebot, Eignung und Lieferzeit',
      'description', 'Erstellen Sie eine schnelle B2B-Angebotsanfrage mit Kategorie, Branche, Menge, Lieferzeit und technischen Dateien.',
      'og_image',    '',
      'no_index',    FALSE
    ),
    'legal', JSON_OBJECT(
      'title',       '',
      'description', '',
      'og_image',    '',
      'no_index',    FALSE
    )
  ),
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`);

COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
