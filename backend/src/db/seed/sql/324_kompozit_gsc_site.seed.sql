INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
('kompozit-gsc-site','gsc_site_url','*','"https://www.karbonkompozit.com.tr/"')
ON DUPLICATE KEY UPDATE `value`=VALUES(`value`),`updated_at`=NOW(3);
