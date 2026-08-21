-- Shared theme module contract. The module is already registered by the site,
-- so the table must exist before /api/admin/theme can be used.
CREATE TABLE IF NOT EXISTS `theme_config` (
  `id`         CHAR(36)      NOT NULL,
  `is_active`  TINYINT(1)    NOT NULL DEFAULT 1,
  `config`     MEDIUMTEXT    NOT NULL,
  `created_at` DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
