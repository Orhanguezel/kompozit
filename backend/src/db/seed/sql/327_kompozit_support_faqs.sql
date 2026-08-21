-- ERP web köprüsü için ortak SSS CRUD şeması. Yalnız CREATE; mevcut tablo/veri değişmez.
CREATE TABLE IF NOT EXISTS `support_faqs` (
  `id` CHAR(36) NOT NULL,
  `category` VARCHAR(100) NOT NULL DEFAULT 'genel',
  `display_order` INT NOT NULL DEFAULT 0,
  `is_published` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `support_faqs_category_idx` (`category`),
  KEY `support_faqs_order_idx` (`display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `support_faqs_i18n` (
  `faq_id` CHAR(36) NOT NULL,
  `locale` VARCHAR(10) NOT NULL DEFAULT 'tr',
  `question` VARCHAR(500) NOT NULL,
  `answer` LONGTEXT NOT NULL,
  PRIMARY KEY (`faq_id`, `locale`),
  CONSTRAINT `fk_support_faq_i18n`
    FOREIGN KEY (`faq_id`) REFERENCES `support_faqs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
