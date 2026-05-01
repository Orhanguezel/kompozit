-- =============================================================
-- FILE: 298_kompozit_base_schema.sql
-- MOE Kompozit — Tam Bağımsız Şema (ALTER kullanılmaz)
-- Üretim ortamı için: sadece CREATE TABLE IF NOT EXISTS + admin user
-- Gerekli tablolar: users, categories, products (kompozit ENUM dahil),
--   site_settings, custom_pages, footer_sections, menu_items
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

-- =============================================================
-- AUTH: users, refresh_tokens, profiles
-- =============================================================

CREATE TABLE IF NOT EXISTS `users` (
  `id`                   CHAR(36)      NOT NULL,
  `email`                VARCHAR(255)  NOT NULL,
  `password_hash`        VARCHAR(255)  NOT NULL,
  `full_name`            VARCHAR(255)  DEFAULT NULL,
  `phone`                VARCHAR(50)   DEFAULT NULL,
  `ecosystem_id`         CHAR(36)      DEFAULT NULL,
  `is_active`            TINYINT(1)    NOT NULL DEFAULT 1,
  `email_verified`       TINYINT(1)    NOT NULL DEFAULT 0,
  `reset_token`          VARCHAR(255)  DEFAULT NULL,
  `reset_token_expires`  DATETIME(3)   DEFAULT NULL,
  `created_at`           DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`           DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  `rules_accepted_at`    DATETIME(3)   DEFAULT NULL,
  `last_sign_in_at`      DATETIME(3)   DEFAULT NULL,
  `role`                 ENUM('admin','moderator','user') NOT NULL DEFAULT 'user',
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `users_ecosystem_id_idx` (`ecosystem_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `refresh_tokens` (
  `id`          CHAR(36)      NOT NULL,
  `user_id`     CHAR(36)      NOT NULL,
  `token_hash`  VARCHAR(255)  NOT NULL,
  `created_at`  DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `expires_at`  DATETIME(3)   NOT NULL,
  `revoked_at`  DATETIME(3)   DEFAULT NULL,
  `replaced_by` CHAR(36)      DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `refresh_tokens_user_id_idx` (`user_id`),
  KEY `refresh_tokens_expires_at_idx` (`expires_at`),
  CONSTRAINT `fk_refresh_tokens_user`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `profiles` (
  `id`            CHAR(36)      NOT NULL,
  `full_name`     TEXT          DEFAULT NULL,
  `phone`         VARCHAR(64)   DEFAULT NULL,
  `avatar_url`    TEXT          DEFAULT NULL,
  `address_line1` VARCHAR(255)  DEFAULT NULL,
  `address_line2` VARCHAR(255)  DEFAULT NULL,
  `city`          VARCHAR(128)  DEFAULT NULL,
  `country`       VARCHAR(128)  DEFAULT NULL,
  `postal_code`   VARCHAR(32)   DEFAULT NULL,
  `created_at`    DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`    DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_profiles_id_users_id`
    FOREIGN KEY (`id`) REFERENCES `users` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================
-- AUTH: user_roles
-- =============================================================

CREATE TABLE IF NOT EXISTS `user_roles` (
  `id`         CHAR(36)      NOT NULL,
  `user_id`    CHAR(36)      NOT NULL,
  `role`       ENUM('admin','moderator','user') NOT NULL DEFAULT 'user',
  `created_at` DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_roles_user_id_role_unique` (`user_id`, `role`),
  KEY `user_roles_user_id_idx` (`user_id`),
  KEY `user_roles_role_idx` (`role`),
  CONSTRAINT `fk_user_roles_user_id_users_id`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================
-- ADMIN USER (SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD)
-- =============================================================

INSERT INTO `users` (
  `id`, `email`, `password_hash`, `full_name`, `phone`,
  `is_active`, `email_verified`, `reset_token`, `reset_token_expires`,
  `created_at`, `updated_at`, `last_sign_in_at`
) VALUES (
  '{{ADMIN_ID}}', '{{ADMIN_EMAIL}}', '{{ADMIN_PASSWORD_HASH}}',
  'Orhan Güzel', '+905551112233', 1, 1, NULL, NULL,
  CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3), NULL
)
ON DUPLICATE KEY UPDATE
  `password_hash`  = VALUES(`password_hash`),
  `is_active`      = 1,
  `email_verified` = 1,
  `updated_at`     = CURRENT_TIMESTAMP(3);

INSERT INTO `profiles` (`id`, `full_name`, `phone`, `created_at`, `updated_at`)
VALUES ('{{ADMIN_ID}}', 'Orhan Güzel', '+905551112233', CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE `updated_at` = CURRENT_TIMESTAMP(3);

INSERT INTO `user_roles` (`id`, `user_id`, `role`, `created_at`)
VALUES (UUID(), '{{ADMIN_ID}}', 'admin', CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE `role` = VALUES(`role`);

-- =============================================================
-- CATALOG: categories, category_i18n
-- =============================================================

CREATE TABLE IF NOT EXISTS `categories` (
  `id`               CHAR(36)      NOT NULL,
  `module_key`       VARCHAR(64)   NOT NULL DEFAULT 'general',
  `image_url`        LONGTEXT      DEFAULT NULL,
  `storage_asset_id` CHAR(36)      DEFAULT NULL,
  `alt`              VARCHAR(255)  DEFAULT NULL,
  `icon`             VARCHAR(255)  DEFAULT NULL,
  `is_active`        TINYINT(1)    NOT NULL DEFAULT 1,
  `is_featured`      TINYINT(1)    NOT NULL DEFAULT 0,
  `display_order`    INT           NOT NULL DEFAULT 0,
  `created_at`       DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`       DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `categories_module_idx` (`module_key`),
  KEY `categories_active_idx` (`is_active`),
  KEY `categories_featured_idx` (`is_featured`),
  KEY `categories_order_idx` (`display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `category_i18n` (
  `category_id` CHAR(36)      NOT NULL,
  `locale`      VARCHAR(8)    NOT NULL DEFAULT 'tr',
  `name`        VARCHAR(255)  NOT NULL,
  `slug`        VARCHAR(255)  NOT NULL,
  `description` TEXT          DEFAULT NULL,
  `alt`         VARCHAR(255)  DEFAULT NULL,
  `meta_title`  VARCHAR(255)  DEFAULT NULL,
  `meta_description` VARCHAR(500) DEFAULT NULL,
  `created_at`  DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`  DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`category_id`, `locale`),
  UNIQUE KEY `category_i18n_locale_slug_uq` (`locale`, `slug`),
  KEY `category_i18n_locale_idx` (`locale`),
  CONSTRAINT `fk_category_i18n_category`
    FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================
-- CATALOG: sub_categories, sub_category_i18n
-- =============================================================

CREATE TABLE IF NOT EXISTS `sub_categories` (
  `id`               CHAR(36)       NOT NULL,
  `category_id`      CHAR(36)       NOT NULL,
  `image_url`        VARCHAR(1024)  DEFAULT NULL,
  `storage_asset_id` CHAR(36)       DEFAULT NULL,
  `alt`              VARCHAR(255)   DEFAULT NULL,
  `icon`             VARCHAR(255)   DEFAULT NULL,
  `is_active`        TINYINT(1)     NOT NULL DEFAULT 1,
  `is_featured`      TINYINT(1)     NOT NULL DEFAULT 0,
  `display_order`    INT            NOT NULL DEFAULT 0,
  `created_at`       DATETIME(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`       DATETIME(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `idx_sub_categories_category_id` (`category_id`),
  CONSTRAINT `fk_sub_categories_category`
    FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `sub_category_i18n` (
  `sub_category_id` CHAR(36)       NOT NULL,
  `locale`          VARCHAR(10)    NOT NULL,
  `name`            VARCHAR(255)   NOT NULL,
  `slug`            VARCHAR(255)   NOT NULL,
  `description`     TEXT           DEFAULT NULL,
  `alt`             VARCHAR(255)   DEFAULT NULL,
  `created_at`      DATETIME(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`      DATETIME(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`sub_category_id`, `locale`),
  UNIQUE KEY `ux_sub_category_i18n_locale_slug` (`locale`, `slug`),
  CONSTRAINT `fk_sub_category_i18n_sub_category`
    FOREIGN KEY (`sub_category_id`) REFERENCES `sub_categories`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================
-- PRODUCTS (item_type ENUM kompozit dahil)
-- =============================================================

CREATE TABLE IF NOT EXISTS `products` (
  `id`               CHAR(36)      NOT NULL,
  `item_type`        ENUM('product','sparepart','kompozit') NOT NULL DEFAULT 'product',
  `category_id`      CHAR(36)      NOT NULL,
  `sub_category_id`  CHAR(36)      DEFAULT NULL,
  `price`            DECIMAL(10,2) NOT NULL,
  `image_url`        LONGTEXT      DEFAULT NULL,
  `storage_asset_id` VARCHAR(64)   DEFAULT NULL,
  `images`           JSON          DEFAULT (JSON_ARRAY()),
  `storage_image_ids` JSON         DEFAULT (JSON_ARRAY()),
  `is_active`        TINYINT(1)    NOT NULL DEFAULT 1,
  `is_featured`      TINYINT(1)    NOT NULL DEFAULT 0,
  `order_num`        INT(11)       NOT NULL DEFAULT 0,
  `product_code`     VARCHAR(64)   DEFAULT NULL,
  `stock_quantity`   INT(11)       NOT NULL DEFAULT 0,
  `rating`           DECIMAL(3,2)  NOT NULL DEFAULT 5.00,
  `review_count`     INT(11)       NOT NULL DEFAULT 0,
  `botanical_name`    VARCHAR(255)  DEFAULT NULL,
  `planting_seasons` JSON          DEFAULT (JSON_ARRAY()),
  `harvest_days`     INT           DEFAULT NULL,
  `climate_zones`    JSON          DEFAULT (JSON_ARRAY()),
  `soil_types`       JSON          DEFAULT (JSON_ARRAY()),
  `water_need`       VARCHAR(16)   DEFAULT NULL,
  `sun_exposure`     VARCHAR(16)   DEFAULT NULL,
  `min_temp`         DECIMAL(5,2)  DEFAULT NULL,
  `max_temp`         DECIMAL(5,2)  DEFAULT NULL,
  `germination_days` INT           DEFAULT NULL,
  `seed_depth_cm`    DECIMAL(5,2)  DEFAULT NULL,
  `row_spacing_cm`   INT           DEFAULT NULL,
  `plant_spacing_cm` INT           DEFAULT NULL,
  `yield_per_sqm`    VARCHAR(50)   DEFAULT NULL,
  `created_at`       DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`       DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `products_code_uq` (`product_code`),
  KEY `products_item_type_idx` (`item_type`),
  KEY `products_category_id_idx` (`category_id`),
  KEY `products_active_idx` (`is_active`),
  KEY `products_order_idx` (`order_num`),
  CONSTRAINT `fk_products_category`
    FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_products_subcategory`
    FOREIGN KEY (`sub_category_id`) REFERENCES `sub_categories`(`id`)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `product_i18n` (
  `product_id`       CHAR(36)      NOT NULL,
  `locale`           VARCHAR(8)    NOT NULL DEFAULT 'tr',
  `title`            VARCHAR(255)  NOT NULL,
  `slug`             VARCHAR(255)  NOT NULL,
  `description`      TEXT          DEFAULT NULL,
  `alt`              VARCHAR(255)  DEFAULT NULL,
  `tags`             JSON          DEFAULT (JSON_ARRAY()),
  `specifications`   JSON          DEFAULT NULL,
  `meta_title`       VARCHAR(255)  DEFAULT NULL,
  `meta_description` VARCHAR(500)  DEFAULT NULL,
  `created_at`       DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`       DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`product_id`, `locale`),
  UNIQUE KEY `product_i18n_locale_slug_uq` (`locale`, `slug`),
  KEY `product_i18n_locale_idx` (`locale`),
  CONSTRAINT `fk_product_i18n_product`
    FOREIGN KEY (`product_id`) REFERENCES `products`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================
-- SITE SETTINGS
-- =============================================================

CREATE TABLE IF NOT EXISTS `site_settings` (
  `id`         CHAR(36)      NOT NULL,
  `key`        VARCHAR(100)  NOT NULL,
  `locale`     VARCHAR(8)    NOT NULL,
  `value`      TEXT          NOT NULL,
  `created_at` DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `site_settings_key_locale_uq` (`key`, `locale`),
  KEY `site_settings_key_idx` (`key`),
  KEY `site_settings_locale_idx` (`locale`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================
-- CUSTOM PAGES (blog, solutions, about vb.)
-- =============================================================

CREATE TABLE IF NOT EXISTS `custom_pages` (
  `id`                      CHAR(36)      NOT NULL,
  `module_key`              VARCHAR(100)  NOT NULL DEFAULT '',
  `is_published`            TINYINT(1)    NOT NULL DEFAULT 0,
  `featured`                TINYINT(1)    NOT NULL DEFAULT 0,
  `display_order`           INT           NOT NULL DEFAULT 0,
  `order_num`               INT           NOT NULL DEFAULT 0,
  `featured_image`          VARCHAR(500)  DEFAULT NULL,
  `featured_image_asset_id` CHAR(36)      DEFAULT NULL,
  `image_url`               LONGTEXT      DEFAULT NULL,
  `storage_asset_id`        CHAR(36)      DEFAULT NULL,
  `images`                  LONGTEXT      NOT NULL,
  `storage_image_ids`       LONGTEXT      NOT NULL,
  `category_id`             CHAR(36)      DEFAULT NULL,
  `sub_category_id`         CHAR(36)      DEFAULT NULL,
  `created_at`              DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`              DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `custom_pages_module_key_idx` (`module_key`),
  KEY `custom_pages_is_published_idx` (`is_published`),
  CONSTRAINT `chk_custom_pages_images_json` CHECK (JSON_VALID(`images`)),
  CONSTRAINT `chk_custom_pages_storage_image_ids_json` CHECK (JSON_VALID(`storage_image_ids`)),
  CONSTRAINT `fk_custom_pages_category`
    FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_custom_pages_sub_category`
    FOREIGN KEY (`sub_category_id`) REFERENCES `sub_categories` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `custom_pages_i18n` (
  `id`                 CHAR(36)       NOT NULL,
  `page_id`            CHAR(36)       NOT NULL,
  `locale`             VARCHAR(10)    NOT NULL,
  `title`              VARCHAR(255)   NOT NULL,
  `slug`               VARCHAR(255)   NOT NULL,
  `content`            LONGTEXT       NOT NULL,
  `summary`            VARCHAR(1000)  DEFAULT NULL,
  `featured_image_alt` VARCHAR(255)   DEFAULT NULL,
  `meta_title`         VARCHAR(255)   DEFAULT NULL,
  `meta_description`   VARCHAR(500)   DEFAULT NULL,
  `tags`               VARCHAR(1000)  DEFAULT NULL,
  `created_at`         DATETIME(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`         DATETIME(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_custom_pages_i18n_parent_locale` (`page_id`, `locale`),
  UNIQUE KEY `ux_custom_pages_i18n_locale_slug` (`locale`, `slug`),
  KEY `custom_pages_i18n_locale_idx` (`locale`),
  CONSTRAINT `chk_custom_pages_i18n_content_json` CHECK (JSON_VALID(`content`)),
  CONSTRAINT `fk_custom_pages_i18n_page`
    FOREIGN KEY (`page_id`) REFERENCES `custom_pages` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================
-- FOOTER SECTIONS
-- =============================================================

CREATE TABLE IF NOT EXISTS `footer_sections` (
  `id`            CHAR(36)     NOT NULL,
  `site_id`       CHAR(36)     DEFAULT NULL,
  `is_active`     TINYINT(1)   NOT NULL DEFAULT 1,
  `display_order` INT(11)      NOT NULL DEFAULT 0,
  `created_at`    DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`    DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `footer_sections_site_idx` (`site_id`),
  KEY `footer_sections_active_idx` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `footer_sections_i18n` (
  `id`          CHAR(36)      NOT NULL,
  `section_id`  CHAR(36)      NOT NULL,
  `locale`      VARCHAR(10)   NOT NULL,
  `title`       VARCHAR(150)  NOT NULL,
  `slug`        VARCHAR(255)  NOT NULL,
  `description` LONGTEXT      DEFAULT NULL,
  `created_at`  DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`  DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_footer_sections_i18n_section_locale` (`section_id`, `locale`),
  UNIQUE KEY `ux_footer_sections_i18n_locale_slug` (`locale`, `slug`),
  KEY `footer_sections_i18n_locale_idx` (`locale`),
  CONSTRAINT `fk_footer_sections_i18n_section`
    FOREIGN KEY (`section_id`) REFERENCES `footer_sections` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================
-- MENU ITEMS
-- =============================================================

CREATE TABLE IF NOT EXISTS `menu_items` (
  `id`         CHAR(36)      NOT NULL,
  `parent_id`  CHAR(36)      DEFAULT NULL,
  `type`       ENUM('page','custom')   NOT NULL DEFAULT 'custom',
  `page_id`    CHAR(36)      DEFAULT NULL,
  `location`   ENUM('header','footer') NOT NULL DEFAULT 'header',
  `section_id` CHAR(36)      DEFAULT NULL,
  `icon`       VARCHAR(64)   DEFAULT NULL,
  `order_num`  INT(11)       NOT NULL DEFAULT 0,
  `is_active`  TINYINT(1)    NOT NULL DEFAULT 1,
  `site_id`    CHAR(36)      DEFAULT NULL,
  `created_at` DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `menu_items_parent_idx` (`parent_id`),
  KEY `menu_items_active_idx` (`is_active`),
  KEY `menu_items_location_idx` (`location`),
  CONSTRAINT `menu_items_parent_fk`
    FOREIGN KEY (`parent_id`) REFERENCES `menu_items` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `menu_items_i18n` (
  `id`           CHAR(36)      NOT NULL,
  `menu_item_id` CHAR(36)      NOT NULL,
  `locale`       VARCHAR(10)   NOT NULL,
  `title`        VARCHAR(100)  NOT NULL,
  `url`          VARCHAR(500)  NOT NULL,
  `created_at`   DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`   DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_menu_items_i18n_item_locale` (`menu_item_id`, `locale`),
  KEY `menu_items_i18n_locale_idx` (`locale`),
  CONSTRAINT `fk_menu_items_i18n_item`
    FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
