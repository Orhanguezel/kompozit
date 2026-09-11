INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
('kompozit-marketing-integrations', 'analytics_integrations', '*', '{"ga4":{"enabled":false},"search_console":{"enabled":false},"google_ads":{"enabled":false}}'),
('kompozit-ga4-property', 'ga4_property_id', '*', '""'),
('kompozit-gsc-site', 'gsc_site_url', '*', '""'),
('kompozit-google-ads-enabled', 'google_ads_enabled', '*', 'false'),
('kompozit-social-channels', 'social_channels', '*', '{"facebook":{"enabled":false,"url":""},"instagram":{"enabled":false,"url":""},"linkedin":{"enabled":false,"url":""},"youtube":{"enabled":false,"url":""},"x":{"enabled":false,"url":""}}')
ON DUPLICATE KEY UPDATE `key`=VALUES(`key`);

CREATE TABLE IF NOT EXISTS `google_url_inspections` (
  `url` VARCHAR(768) NOT NULL,
  `result_json` JSON NOT NULL,
  `inspected_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`url`),
  KEY `idx_google_url_inspections_date` (`inspected_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
