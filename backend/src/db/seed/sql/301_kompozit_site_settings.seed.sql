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
    'site_title',       'MOE Kompozit | Karbon Fiber & CTP Kompozit Üretimi',
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
    'logo_url',         '',
    'logo_alt',         'MOE Kompozit',
    'favicon_url',      '',
    'logo_dark_url',    ''
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
    'logo_url',              '',
    'logo_alt',              'MOE Kompozit',
    'logo_dark_url',         '',
    'favicon_url',           '',
    'apple_touch_icon_url',  ''
  ),
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
    'url', '',
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
    'url', '',
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
    'url', '',
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
    'address',          '',
    'city',             '',
    'country',          'Türkiye',
    'phone',            '',
    'phone_2',          '',
    'email',            'info@karbonkompozit.com.tr',
    'email_2',          '',
    'working_hours',    'Pazartesi - Cuma: 08:00 - 17:00',
    'maps_embed_url',   '',
    'maps_lat',         '',
    'maps_lng',         ''
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
    'address',          '',
    'city',             '',
    'country',          'Turkey',
    'phone',            '',
    'phone_2',          '',
    'email',            'info@karbonkompozit.com.tr',
    'email_2',          '',
    'working_hours',    'Monday - Friday: 08:00 - 17:00',
    'maps_embed_url',   '',
    'maps_lat',         '',
    'maps_lng',         ''
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
    'primary_color',    '#ea580c',
    'accent_color',     '#fb923c',
    'dark_color',       '#111827',
    'font_family',      'Inter',
    'font_display',     'Syne'
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
    'badge', 'B2B Kompozit Uretim',
    'title', 'Karbon Fiber, CTP ve Cam Elyaf Kompozit Cozumleri',
    'subtitle', 'Karbon fiber, CTP ve cam elyaf tabanli kompozit parcalarda muhendislik, numune dogrulama ve seri uretim planlamasini tek bir B2B proje akisi icinde yonetiyoruz.',
    'primaryCtaLabel', 'Urunleri Kesfet',
    'primaryCtaHref', '/products',
    'secondaryCtaLabel', 'Teklif Al',
    'secondaryCtaHref', '/offer',
    'workflowLabel', 'Composite Workflow',
    'workflowTitle', 'Projenize uygun malzeme ve uretim akisi',
    'workflowBadgeTitle', 'Hizli',
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
    'title', 'Carbon Fiber, FRP and Fiberglass Composite Solutions',
    'subtitle', 'We manage engineering alignment, sampling and serial production planning for carbon fiber, FRP and fiberglass-based composite parts within one B2B delivery flow.',
    'primaryCtaLabel', 'Explore Products',
    'primaryCtaHref', '/products',
    'secondaryCtaLabel', 'Request an Offer',
    'secondaryCtaHref', '/offer',
    'workflowLabel', 'Composite Workflow',
    'workflowTitle', 'Material and production flow aligned with your project',
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
      JSON_OBJECT('title', 'Prototip', 'description', 'Numune, revizyon ve ilk dogrulama asamasi'),
      JSON_OBJECT('title', 'Seri Uretim', 'description', 'Tekrarlanabilir proses, kalite ve termin takibi'),
      JSON_OBJECT('title', 'Muhendislik', 'description', 'Malzeme, katman yapisi ve proses secimi destegi')
    ),
    'workflowSteps',
    JSON_ARRAY(
      JSON_OBJECT('step', '01', 'title', 'Teknik gereksinim analizi', 'description', 'Kullanim ortami, olcu, mukavemet, agirlik ve yuzey beklentisini netlestiriyoruz.'),
      JSON_OBJECT('step', '02', 'title', 'Malzeme ve proses secimi', 'description', 'Karbon fiber, CTP veya cam elyaf katmani ile uygun uretim rotasini belirliyoruz.'),
      JSON_OBJECT('step', '03', 'title', 'Numune, teklif ve seri uretim gecisi', 'description', 'Numune dogrulama sonrasinda miktar, termin ve kalite gereksinimlerine gore seri uretim planini netlestiriyoruz.')
    ),
    'stats',
    JSON_ARRAY(
      JSON_OBJECT('value', '3+', 'label', 'Temel proses adimi'),
      JSON_OBJECT('value', 'B2B', 'label', 'Proje odakli is birligi')
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
    'sectionLabel', 'Guvenilirlik',
    'title', 'Neden MOE Kompozit?',
    'subtitle', 'Malzeme secimi, proses disiplini ve proje iletisimini ayni cizgide yoneten uygulama odakli uretim yaklasimi',
    'items',
    JSON_ARRAY(
      JSON_OBJECT('key', 'quality', 'title', 'Yuksek Kalite', 'description', 'Yuzey kalitesi, tolerans ve proses tekrar edilebilirligi odakli uretim akisi'),
      JSON_OBJECT('key', 'experience', 'title', 'Deneyim', 'description', 'Kompozit uygulama ihtiyaclarini teknik gereksinim seviyesinde okuyabilen ekip'),
      JSON_OBJECT('key', 'custom', 'title', 'Ozel Uretim', 'description', 'Parca, panel, muhafaza ve tasiyici bilesenlerde proje bazli ozel cozum'),
      JSON_OBJECT('key', 'delivery', 'title', 'Hizli Teslimat', 'description', 'Numune, revizyon ve teslim planini basindan netlestiren is akisi')
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
      JSON_OBJECT('key', 'delivery', 'title', 'Fast Delivery', 'description', 'A workflow that clarifies sampling, revisions and delivery planning from the start')
    )
  ),
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`);

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;
