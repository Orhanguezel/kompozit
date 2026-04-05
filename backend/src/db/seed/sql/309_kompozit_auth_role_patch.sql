-- 309_kompozit_auth_role_patch.sql
-- users.role kolonu artık 298_kompozit_base_schema.sql içinde CREATE TABLE sırasında
-- tanımlanır. Bu dosya geriye dönük uyumluluk için kullanıcıları user_roles'dan senkronize eder.

UPDATE `users` u
LEFT JOIN (
  SELECT
    ur.user_id,
    CASE
      WHEN MAX(CASE WHEN ur.role = 'admin' THEN 1 ELSE 0 END) = 1 THEN 'admin'
      WHEN MAX(CASE WHEN ur.role = 'moderator' THEN 1 ELSE 0 END) = 1 THEN 'moderator'
      ELSE 'user'
    END AS primary_role
  FROM user_roles ur
  GROUP BY ur.user_id
) r ON r.user_id = u.id
SET u.role = COALESCE(r.primary_role, 'user');
