INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
('kompozit-ga4-stream', 'ga4_stream_id', '*', '"15340347924"'),
('kompozit-ga4-measurement', 'ga4_measurement_id', '*', '"G-S8V8GTJHZV"'),
('kompozit-gtm-container', 'gtm_container_id', '*', '"GTM-NCVJZX6H"')
ON DUPLICATE KEY UPDATE `value`=VALUES(`value`),`updated_at`=NOW(3);

UPDATE `site_settings`
SET `value`='{"ga4":{"enabled":true},"search_console":{"enabled":false},"google_ads":{"enabled":false}}',
    `updated_at`=NOW(3)
WHERE `key`='analytics_integrations' AND `locale`='*';
