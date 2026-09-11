SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS social_channel_posts (
  id CHAR(36) NOT NULL,
  platform ENUM('facebook','instagram','linkedin','x') NOT NULL,
  title VARCHAR(255) NULL,
  caption TEXT NOT NULL,
  media_url VARCHAR(1000) NULL,
  link_url VARCHAR(1000) NULL,
  status ENUM('draft','scheduled','published','failed','cancelled') NOT NULL DEFAULT 'draft',
  scheduled_at DATETIME(3) NULL,
  published_at DATETIME(3) NULL,
  external_post_id VARCHAR(255) NULL,
  error_message VARCHAR(1000) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  KEY social_channel_posts_platform_idx (platform),
  KEY social_channel_posts_status_idx (status),
  KEY social_channel_posts_scheduled_idx (scheduled_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS social_integration_settings (
  setting_key VARCHAR(100) NOT NULL,
  setting_value TEXT NOT NULL,
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
