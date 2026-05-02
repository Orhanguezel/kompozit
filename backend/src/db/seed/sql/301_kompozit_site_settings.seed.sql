-- =============================================================
-- FILE: 301_kompozit_site_settings.seed.sql
-- MOE Kompozit — site_settings (kompozit__ prefix)
-- Keys: app_locales, seo, logo, site_logo, site_favicon, site_apple_touch_icon, site_og_default_image, contact_info, branding
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- =============================================================
-- APP LOCALES — global (locale='*')
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES (
  UUID(),
  'kompozit__app_locales',
  '*',
  JSON_ARRAY(
    JSON_OBJECT('code', 'tr', 'label', 'Türkçe', 'is_default', true, 'is_active', true),
    JSON_OBJECT('code', 'en', 'label', 'English', 'is_default', false, 'is_active', true),
    JSON_OBJECT('code', 'de', 'label', 'Deutsch', 'is_default', false, 'is_active', false)
  ),
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- SEO — TR
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES (
  UUID(),
  'kompozit__seo',
  'tr',
  JSON_OBJECT(
    'site_title',       'MOE Kompozit | Karbon Fiber <em>&</em> CTP Kompozit Üretimi',
    'site_description', 'Karbon fiber, CTP ve cam elyaf kompozit üretiminde endüstriyel çözümler. Özel üretim, yüksek kalite, hızlı teslimat.',
    'keywords',         'karbon fiber, CTP, cam elyaf, kompozit, endüstriyel üretim, özel üretim, MOE Kompozit',
    'og_image',         '',
    'og_type',          'website'
  ),
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- SEO — EN
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES (
  UUID(),
  'kompozit__seo',
  'en',
  JSON_OBJECT(
    'site_title',       'MOE Kompozit | Carbon Fiber & FRP Composite Manufacturing',
    'site_description', 'Industrial solutions in carbon fiber, FRP and fiberglass composite manufacturing. Custom production, high quality, fast delivery.',
    'keywords',         'carbon fiber, FRP, fiberglass, composite, industrial manufacturing, custom production, MOE Kompozit',
    'og_image',         '',
    'og_type',          'website'
  ),
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- LOGO — global (locale='*')
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES (
  UUID(),
  'kompozit__logo',
  '*',
  JSON_OBJECT(
    'logo_url',       '/uploads/kompozit/brand/logo-light.png',
    'logo_alt',       'MOE Kompozit',
    'favicon_url',    '/uploads/kompozit/brand/favicon-32.png',
    'logo_dark_url',  '/uploads/kompozit/brand/logo-dark.png',
    'logo_light_url', '/uploads/kompozit/brand/logo-light.png'
  ),
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- SITE LOGO — global (locale='*')
-- Standard site_settings media keys under kompozit__ prefix
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES (
  UUID(),
  'kompozit__site_logo',
  '*',
  JSON_OBJECT(
    'logo_url',             '/uploads/kompozit/brand/logo-light.png',
    'logo_alt',             'MOE Kompozit',
    'logo_dark_url',        '/uploads/kompozit/brand/logo-dark.png',
    'logo_light_url',       '/uploads/kompozit/brand/logo-light.png',
    'favicon_url',          '/uploads/kompozit/brand/favicon-32.png',
    'apple_touch_icon_url', '/uploads/kompozit/brand/apple-touch-icon.png'
  ),
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- SITE LOGO LIGHT / DARK — global (locale='*')
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES (
  UUID(),
  'kompozit__site_logo_light',
  '*',
  JSON_OBJECT('url', '/uploads/kompozit/brand/logo-light.png', 'alt', 'MOE Kompozit'),
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`);

INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES (
  UUID(),
  'kompozit__site_logo_dark',
  '*',
  JSON_OBJECT('url', '/uploads/kompozit/brand/logo-dark.png', 'alt', 'MOE Kompozit'),
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- SITE FAVICON — global (locale='*')
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES (
  UUID(),
  'kompozit__site_favicon',
  '*',
  JSON_OBJECT(
    'url', '/uploads/kompozit/brand/favicon-32.png',
    'alt', 'MOE Kompozit Favicon'
  ),
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- SITE APPLE TOUCH ICON — global (locale='*')
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES (
  UUID(),
  'kompozit__site_apple_touch_icon',
  '*',
  JSON_OBJECT(
    'url', '/uploads/kompozit/brand/apple-touch-icon.png',
    'alt', 'MOE Kompozit Apple Touch Icon'
  ),
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- SITE OG DEFAULT IMAGE — global (locale='*')
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES (
  UUID(),
  'kompozit__site_og_default_image',
  '*',
  JSON_OBJECT(
    'url', '/media/kompozit/karbon-fiber-panel-01.jpg',
    'alt', 'MOE Kompozit OG Default Image'
  ),
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- CONTACT INFO — TR
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES (
  UUID(),
  'kompozit__contact_info',
  'tr',
  JSON_OBJECT(
    'company_name',     'MOE Kompozit',
    'address',          'Oruçreis Mah. Tekstilkent Sit. A17 Blok No:41 34235 Esenler / İstanbul, Türkiye',
    'city',             'İstanbul',
    'country',          'Türkiye',
    'phone',            '+90 530 961 94 17',
    'phone_2',          '',
    'email',            'info@karbonkompozit.com.tr',
    'email_2',          '',
    'working_hours',    'Pazartesi - Cuma: 08:00 - 17:00',
    'maps_embed_url',   '',
    'maps_lat',         '41.0225',
    'maps_lng',         '28.8825'
  ),
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- CONTACT INFO — EN
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES (
  UUID(),
  'kompozit__contact_info',
  'en',
  JSON_OBJECT(
    'company_name',     'MOE Kompozit',
    'address',          'Oruçreis District, Tekstilkent Site, A17 Block No:41, 34235 Esenler / Istanbul, Turkey',
    'city',             'Istanbul',
    'country',          'Turkey',
    'phone',            '+90 530 961 94 17',
    'phone_2',          '',
    'email',            'info@karbonkompozit.com.tr',
    'email_2',          '',
    'working_hours',    'Monday - Friday: 08:00 - 17:00',
    'maps_embed_url',   '',
    'maps_lat',         '41.0225',
    'maps_lng',         '28.8825'
  ),
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- BRANDING — global (locale='*')
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES (
  UUID(),
  'kompozit__branding',
  '*',
  JSON_OBJECT(
    'brand_name',       'MOE Kompozit',
    'brand_tagline_tr', 'Endüstriyel Kompozit Çözümler',
    'brand_tagline_en', 'Industrial Composite Solutions',
    'primary_color',    '#c9a96e',
    'accent_color',     '#dbb978',
    'dark_color',       '#0a0a0a',
    'graphite_color',   '#1a1a1a',
    'steel_color',      '#2a2a2a',
    'silver_color',     '#8a8a8a',
    'cream_color',      '#e8e4df',
    'font_family',      'DM Sans',
    'font_display',     'Bebas Neue'
  ),
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- HOME HERO — TR
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES (
  UUID(),
  'kompozit__home.hero',
  'tr',
  JSON_OBJECT(
    'badge', 'B2B Kompozit Üretim',
    'title', 'Karbon Fiber, <em>CTP ve Cam Elyaf</em> Kompozit Çözümleri',
    'subtitle', 'Karbon fiber, CTP ve cam elyaf tabanlı kompozit parçalarda mühendislik, numune doğrulama ve seri üretim planlamasını tek bir B2B proje akışı içinde yönetiyoruz.',
    'primaryCtaLabel', 'Ürünleri Keşfet',
    'primaryCtaHref', '/products',
    'secondaryCtaLabel', 'Teklif Al',
    'secondaryCtaHref', '/offer',
    'workflowLabel', 'Kompozit İş Akışı',
    'workflowTitle', 'Projenize uygun <em>malzeme ve üretim</em> akışı',
    'workflowBadgeTitle', 'Hızlı',
    'workflowBadgeSubtitle', 'Teklif ve planlama'
  ),
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- HOME HERO — EN
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES (
  UUID(),
  'kompozit__home.hero',
  'en',
  JSON_OBJECT(
    'badge', 'B2B Composite Manufacturing',
    'title', 'Carbon Fiber, <em>FRP and Fiberglass</em> Composite Solutions',
    'subtitle', 'We manage engineering alignment, sampling and serial production planning for carbon fiber, FRP and fiberglass-based composite parts within one B2B delivery flow.',
    'primaryCtaLabel', 'Explore Products',
    'primaryCtaHref', '/products',
    'secondaryCtaLabel', 'Request an Offer',
    'secondaryCtaHref', '/offer',
    'workflowLabel', 'Composite Workflow',
    'workflowTitle', 'Material and <em>production flow</em> aligned with your project',
    'workflowBadgeTitle', 'Fast',
    'workflowBadgeSubtitle', 'Quotation and planning'
  ),
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- HOME METRICS — TR
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES (
  UUID(),
  'kompozit__home.metrics',
  'tr',
  JSON_OBJECT(
    'items',
    JSON_ARRAY(
      JSON_OBJECT('title', 'Prototip', 'description', 'Numune, revizyon ve ilk doğrulama aşaması'),
      JSON_OBJECT('title', 'Seri Üretim', 'description', 'Tekrarlanabilir süreç, kalite ve termin takibi'),
      JSON_OBJECT('title', 'Mühendislik', 'description', 'Malzeme, katman yapısı ve süreç seçimi desteği')
    ),
    'workflowSteps',
    JSON_ARRAY(
      JSON_OBJECT('step', '01', 'title', 'Teknik gereksinim analizi', 'description', 'Kullanım ortamı, ölçü, mukavemet, ağırlık ve yüzey beklentisini netleştiriyoruz.'),
      JSON_OBJECT('step', '02', 'title', 'Malzeme ve süreç seçimi', 'description', 'Karbon fiber, CTP veya cam elyaf katmanı ile uygun üretim rotasını belirliyoruz.'),
      JSON_OBJECT('step', '03', 'title', 'Numune, teklif ve seri üretim geçişi', 'description', 'Numune doğrulama sonrasında miktar, termin ve kalite gereksinimlerine göre seri üretim planını netleştiriyoruz.')
    ),
    'stats',
    JSON_ARRAY(
      JSON_OBJECT('value', '3+', 'label', 'Temel süreç adımı'),
      JSON_OBJECT('value', 'B2B', 'label', 'Proje odaklı iş birliği')
    )
  ),
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- HOME METRICS — EN
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES (
  UUID(),
  'kompozit__home.metrics',
  'en',
  JSON_OBJECT(
    'items',
    JSON_ARRAY(
      JSON_OBJECT('title', 'Prototype', 'description', 'Sampling, revision rounds and first validation stage'),
      JSON_OBJECT('title', 'Serial Production', 'description', 'Repeatable process control, quality discipline and delivery tracking'),
      JSON_OBJECT('title', 'Engineering', 'description', 'Support for material, layup and process selection')
    ),
    'workflowSteps',
    JSON_ARRAY(
      JSON_OBJECT('step', '01', 'title', 'Technical requirement analysis', 'description', 'We define operating conditions, dimensions, strength, weight and surface expectations.'),
      JSON_OBJECT('step', '02', 'title', 'Material and process selection', 'description', 'We choose the right production route with carbon fiber, FRP or fiberglass layup.'),
      JSON_OBJECT('step', '03', 'title', 'Sampling, quotation and serial production handoff', 'description', 'After sample validation, we lock scope, delivery timing and quality expectations for serial production.')
    ),
    'stats',
    JSON_ARRAY(
      JSON_OBJECT('value', '3+', 'label', 'Core process stages'),
      JSON_OBJECT('value', 'B2B', 'label', 'Project-led collaboration')
    )
  ),
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- HOME VALUE PROPS — TR
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES (
  UUID(),
  'kompozit__home.value_props',
  'tr',
  JSON_OBJECT(
    'sectionLabel', 'Güvenilirlik',
    'title', 'Neden MOE Kompozit?',
    'subtitle', 'Malzeme seçimi, süreç disiplini ve proje iletişimini aynı çizgide yöneten uygulama odaklı üretim yaklaşımı',
    'items',
    JSON_ARRAY(
      JSON_OBJECT('key', 'quality', 'title', 'Yüksek Kalite', 'description', 'Yüzey kalitesi, tolerans ve süreç tekrarlanabilirliği odaklı üretim akışı'),
      JSON_OBJECT('key', 'experience', 'title', 'Deneyim', 'description', 'Kompozit uygulama ihtiyaçlarını teknik gereksinim seviyesinde okuyabilen ekip'),
      JSON_OBJECT('key', 'custom', 'title', 'Özel Üretim', 'description', 'Parça, panel, muhafaza ve taşıyıcı bileşenlerde proje bazlı özel çözüm'),
      JSON_OBJECT('key', 'delivery', 'title', 'Hızlı Teslimat', 'description', 'Numune, revizyon ve teslim planını başından netleştiren iş akışı'),
      JSON_OBJECT('key', 'innovation', 'title', 'Teknoloji', 'description', 'Vakum infüzyon, RTM ve elle yatırma dahil süreç seçimine mühendislik güdümlü yaklaşım'),
      JSON_OBJECT('key', 'certification', 'title', 'Kalite Güvencesi', 'description', 'Süreç takip, sapma yönetimi ve seri üretim öncesi numune doğrulama akışı')
    )
  ),
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- HOME VALUE PROPS — EN
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES (
  UUID(),
  'kompozit__home.value_props',
  'en',
  JSON_OBJECT(
    'sectionLabel', 'Reliability',
    'title', 'Why MOE Kompozit?',
    'subtitle', 'An application-focused manufacturing approach that keeps material selection, process discipline and project communication aligned.',
    'items',
    JSON_ARRAY(
      JSON_OBJECT('key', 'quality', 'title', 'High Quality', 'description', 'Production flow focused on surface quality, tolerance control and repeatable processes'),
      JSON_OBJECT('key', 'experience', 'title', 'Experience', 'description', 'A team that reads composite application needs at the technical requirement level'),
      JSON_OBJECT('key', 'custom', 'title', 'Custom Production', 'description', 'Project-specific solutions for parts, panels, enclosures and structural components'),
      JSON_OBJECT('key', 'delivery', 'title', 'Fast Delivery', 'description', 'A workflow that clarifies sampling, revisions and delivery planning from the start'),
      JSON_OBJECT('key', 'innovation', 'title', 'Technology', 'description', 'Engineering-led approach to process selection including vacuum infusion, RTM and hand lay-up'),
      JSON_OBJECT('key', 'certification', 'title', 'Quality Assurance', 'description', 'Process tracking, deviation management and pre-production sample validation workflow')
    )
  ),
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- HOME STATS BAR — TR
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES (
  UUID(),
  'kompozit__home.stats',
  'tr',
  JSON_OBJECT(
    'items', JSON_ARRAY(
      JSON_OBJECT('value', '15+',      'label', 'Yıl kompozit deneyimi'),
      JSON_OBJECT('value', '500+',     'label', 'Teslim edilen proje parçası'),
      JSON_OBJECT('value', 'AS9100',   'label', 'Hassas üretim standardı'),
      JSON_OBJECT('value', 'ISO 9001', 'label', 'Süreç ve kalite disiplini')
    )
  ),
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- HOME STATS BAR — EN
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES (
  UUID(),
  'kompozit__home.stats',
  'en',
  JSON_OBJECT(
    'items', JSON_ARRAY(
      JSON_OBJECT('value', '15+',      'label', 'Years in composites'),
      JSON_OBJECT('value', '500+',     'label', 'Project parts delivered'),
      JSON_OBJECT('value', 'AS9100',   'label', 'Precision manufacturing mindset'),
      JSON_OBJECT('value', 'ISO 9001', 'label', 'Process and quality discipline')
    )
  ),
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- HOME TESTIMONIAL — TR
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES (
  UUID(),
  'kompozit__home.testimonial',
  'tr',
  JSON_OBJECT(
    'quote',       'B2B projelerimizde kompozit parça üretiminde aradığımız mühendislik disiplini ve tekrarlanabilir kaliteyi MOE ile yakaladık. Numunedn seri üretime geçiş süreci son derece şeffaf yönetildi.',
    'attribution', 'Proje Müdürü, Savunma Grubu'
  ),
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- HOME TESTIMONIAL — EN
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES (
  UUID(),
  'kompozit__home.testimonial',
  'en',
  JSON_OBJECT(
    'quote',       'Having the same team own specification, sampling and production ramp is the decisive advantage in B2B composite programs.',
    'attribution', 'Engineering partner — defense industry'
  ),
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- HOME ABOUT — TR
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES (
  UUID(),
  'kompozit__home.about',
  'tr',
  JSON_OBJECT(
    'label',    'Hakkımızda',
    'title',    'Kompozit Teknolojilerinde <em>Mühendislik</em> Disiplini',
    'tagline',  'Bilimin zanaatla buluştuğu nokta',
    'intro',    'Karbon fiberden CTP\'ye kadar tüm kompozit uygulama ihtiyaçlarınızda, tasarımdan seri üretime kadar her aşamada mühendislik odaklı yaklaşımımızla yanınızdayız.',
    'ctaLabel', 'Daha Fazlası',
    'imageUrl',  '/uploads/kompozit/karbon-fiber-panel-01.jpg'
  ),
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- HOME ABOUT — EN
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES (
  UUID(),
  'kompozit__home.about',
  'en',
  JSON_OBJECT(
    'label',    'About Us',
    'title',    'Engineering <em>Discipline</em> in Composite Technologies',
    'tagline',  'Where science meets craftsmanship',
    'intro',    'From carbon fiber to GRP, we support all your composite application needs with an engineering-led approach from design to serial production.',
    'ctaLabel', 'Read More',
    'imageUrl',  '/uploads/kompozit/karbon-fiber-panel-01.jpg'
  ),
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`);

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;
