-- =============================================================
-- 314_kompozit_admin_schema_extensions.sql
-- Kompozit minimal şemaya admin paneli için eksik kolon/tablolar
-- Idempotent: tekrar çalıştırılabilir
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

-- category_i18n.i18n_data (Drizzle ile uyum)
SET @db := DATABASE();
SET @col_exists := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'category_i18n' AND COLUMN_NAME = 'i18n_data'
);
SET @q := IF(@col_exists = 0,
  'ALTER TABLE `category_i18n` ADD COLUMN `i18n_data` LONGTEXT NULL AFTER `alt`',
  'SELECT 1');
PREPARE st FROM @q;
EXECUTE st;
DEALLOCATE PREPARE st;

-- offers (services tablosu olmadan; product_id FK var)
CREATE TABLE IF NOT EXISTS `offers` (
  `id`                CHAR(36)       NOT NULL,
  `offer_no`          VARCHAR(100)   NULL,
  `status`            VARCHAR(32)    NOT NULL DEFAULT 'new',
  `source`            VARCHAR(64)    NOT NULL DEFAULT 'kompozit',
  `locale`            VARCHAR(10)    NULL,
  `country_code`      VARCHAR(80)    NULL,
  `customer_name`     VARCHAR(255)   NOT NULL,
  `company_name`      VARCHAR(255)   NULL,
  `email`             VARCHAR(255)   NOT NULL,
  `phone`             VARCHAR(50)    NULL,
  `subject`           VARCHAR(255)   NULL,
  `message`           LONGTEXT       NULL,
  `product_id`        CHAR(36)       NULL,
  `service_id`        CHAR(36)       NULL,
  `form_data`         LONGTEXT       NULL,
  `consent_marketing` TINYINT        NOT NULL DEFAULT 0,
  `consent_terms`     TINYINT        NOT NULL DEFAULT 0,
  `currency`          VARCHAR(10)    NOT NULL DEFAULT 'EUR',
  `net_total`         DECIMAL(12,2)  NULL,
  `vat_rate`          DECIMAL(5,2)   NULL,
  `vat_total`         DECIMAL(12,2)  NULL,
  `shipping_total`    DECIMAL(12,2)  NULL,
  `gross_total`       DECIMAL(12,2)  NULL,
  `valid_until`       DATETIME(3)    NULL,
  `admin_notes`       LONGTEXT       NULL,
  `pdf_url`           VARCHAR(500)   NULL,
  `pdf_asset_id`      CHAR(36)       NULL,
  `email_sent_at`     DATETIME(3)    NULL,
  `created_at`        DATETIME(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`        DATETIME(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `offers_status_created_idx` (`status`, `created_at`),
  KEY `offers_email_idx`          (`email`),
  KEY `offers_product_idx`        (`product_id`),
  KEY `offers_service_idx`        (`service_id`),
  KEY `offers_offer_no_idx`       (`offer_no`),
  KEY `offers_locale_idx`         (`locale`),
  KEY `offers_country_idx`        (`country_code`),
  KEY `offers_source_idx`         (`source`),
  CONSTRAINT `fk_offers_product`
    FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `offer_number_counters` (
  `year`     INT          NOT NULL,
  `last_seq` INT          NOT NULL,
  `prefix`   VARCHAR(20)  NOT NULL DEFAULT 'ENS',
  PRIMARY KEY (`year`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `reviews` (
  `id`               CHAR(36)      NOT NULL,
  `target_type`      VARCHAR(50)   NOT NULL,
  `target_id`        CHAR(36)      NOT NULL,
  `name`             VARCHAR(255)  NOT NULL,
  `email`            VARCHAR(255)  NOT NULL,
  `rating`           TINYINT       NOT NULL,
  `is_active`        TINYINT(1)    NOT NULL DEFAULT 1,
  `is_approved`      TINYINT(1)    NOT NULL DEFAULT 0,
  `display_order`    INT           NOT NULL DEFAULT 0,
  `likes_count`      INT           NOT NULL DEFAULT 0,
  `dislikes_count`   INT           NOT NULL DEFAULT 0,
  `helpful_count`    INT           NOT NULL DEFAULT 0,
  `submitted_locale` VARCHAR(8)    NOT NULL,
  `created_at`       DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`       DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `reviews_target_idx`        (`target_type`, `target_id`),
  KEY `reviews_rating_idx`        (`rating`),
  KEY `reviews_active_idx`        (`is_active`),
  KEY `reviews_approved_idx`      (`is_approved`),
  KEY `reviews_display_order_idx` (`display_order`),
  KEY `reviews_created_idx`       (`created_at`),
  KEY `reviews_updated_idx`       (`updated_at`),
  KEY `reviews_helpful_idx`       (`helpful_count`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `review_i18n` (
  `id`          CHAR(36)      NOT NULL,
  `review_id`   CHAR(36)      NOT NULL,
  `locale`      VARCHAR(8)    NOT NULL,
  `title`       VARCHAR(255)  DEFAULT NULL,
  `comment`     TEXT          NOT NULL,
  `admin_reply` TEXT          DEFAULT NULL,
  `created_at`  DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`  DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_review_i18n_review_locale` (`review_id`, `locale`),
  KEY `review_i18n_review_idx` (`review_id`),
  KEY `review_i18n_locale_idx` (`locale`),
  CONSTRAINT `fk_review_i18n_review`
    FOREIGN KEY (`review_id`) REFERENCES `reviews` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `notifications` (
  `id`         CHAR(36)      NOT NULL,
  `user_id`    CHAR(36)      NOT NULL,
  `title`      VARCHAR(255)  NOT NULL,
  `message`    TEXT          NOT NULL,
  `type`       VARCHAR(50)   NOT NULL,
  `is_read`    TINYINT(1)    NOT NULL DEFAULT 0,
  `created_at` DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `idx_notifications_user_id` (`user_id`),
  KEY `idx_notifications_user_read` (`user_id`, `is_read`),
  KEY `idx_notifications_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `storage_assets` (
  `id`         CHAR(36)        NOT NULL,
  `user_id`    CHAR(36)        DEFAULT NULL,
  `name`       VARCHAR(255)    NOT NULL,
  `bucket`     VARCHAR(64)     NOT NULL,
  `path`       VARCHAR(512)    NOT NULL,
  `folder`     VARCHAR(255)    DEFAULT NULL,
  `mime`       VARCHAR(127)    NOT NULL,
  `size`       BIGINT UNSIGNED NOT NULL,
  `width`      INT UNSIGNED    DEFAULT NULL,
  `height`     INT UNSIGNED    DEFAULT NULL,
  `url`        TEXT            DEFAULT NULL,
  `hash`       VARCHAR(64)     DEFAULT NULL,
  `provider`               VARCHAR(16)  NOT NULL DEFAULT 'cloudinary',
  `provider_public_id`     VARCHAR(255) DEFAULT NULL,
  `provider_resource_type` VARCHAR(16)  DEFAULT NULL,
  `provider_format`        VARCHAR(32)  DEFAULT NULL,
  `provider_version`       INT UNSIGNED DEFAULT NULL,
  `etag`                   VARCHAR(64)  DEFAULT NULL,
  `metadata`   JSON            DEFAULT NULL,
  `created_at` DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_bucket_path` (`bucket`, `path`),
  KEY `idx_storage_bucket` (`bucket`),
  KEY `idx_storage_folder` (`folder`),
  KEY `idx_storage_created` (`created_at`),
  KEY `idx_provider_pubid` (`provider_public_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `audit_request_logs` (
  `id`               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `req_id`           VARCHAR(64)  NOT NULL,
  `method`           VARCHAR(16)  NOT NULL,
  `url`              LONGTEXT     NOT NULL,
  `path`             VARCHAR(255) NOT NULL,
  `status_code`      INT          NOT NULL,
  `response_time_ms` INT          NOT NULL DEFAULT 0,
  `ip`               VARCHAR(64)  NOT NULL,
  `user_agent`       LONGTEXT     DEFAULT NULL,
  `referer`          LONGTEXT     DEFAULT NULL,
  `user_id`          VARCHAR(64)  DEFAULT NULL,
  `is_admin`         INT          NOT NULL DEFAULT 0,
  `country`          VARCHAR(8)   DEFAULT NULL,
  `city`             VARCHAR(64)  DEFAULT NULL,
  `error_message`    VARCHAR(512) DEFAULT NULL,
  `error_code`       VARCHAR(64)  DEFAULT NULL,
  `request_body`     LONGTEXT     DEFAULT NULL,
  `created_at`       DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `audit_request_logs_created_idx` (`created_at`),
  KEY `audit_request_logs_user_idx` (`user_id`),
  KEY `audit_request_logs_path_idx` (`path`),
  KEY `audit_request_logs_ip_idx` (`ip`),
  KEY `audit_request_logs_status_idx` (`status_code`),
  KEY `audit_request_logs_method_idx` (`method`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `audit_auth_events` (
  `id`         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `event`      VARCHAR(32)  NOT NULL,
  `user_id`    VARCHAR(64)  DEFAULT NULL,
  `email`      VARCHAR(255) DEFAULT NULL,
  `ip`         VARCHAR(64)  NOT NULL,
  `user_agent` LONGTEXT     DEFAULT NULL,
  `country`    VARCHAR(8)   DEFAULT NULL,
  `city`       VARCHAR(64)  DEFAULT NULL,
  `created_at` DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `audit_auth_events_created_idx` (`created_at`),
  KEY `audit_auth_events_event_idx` (`event`),
  KEY `audit_auth_events_user_idx` (`user_id`),
  KEY `audit_auth_events_ip_idx` (`ip`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
