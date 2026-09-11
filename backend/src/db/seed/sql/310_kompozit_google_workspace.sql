SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_google_accounts (
  id CHAR(36) NOT NULL,
  owner_user_id CHAR(36) NOT NULL,
  email VARCHAR(255) NOT NULL,
  display_name VARCHAR(255) DEFAULT NULL,
  enc_access_token TEXT DEFAULT NULL,
  enc_refresh_token TEXT NOT NULL,
  token_expiry DATETIME(3) DEFAULT NULL,
  scopes TEXT DEFAULT NULL,
  status ENUM('connected','expired','error','disconnected') NOT NULL DEFAULT 'connected',
  last_error VARCHAR(500) DEFAULT NULL,
  last_synced_at DATETIME(3) DEFAULT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uq_user_google_account_email (owner_user_id, email),
  KEY idx_user_google_accounts_owner (owner_user_id),
  CONSTRAINT fk_user_google_accounts_owner FOREIGN KEY (owner_user_id)
    REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
