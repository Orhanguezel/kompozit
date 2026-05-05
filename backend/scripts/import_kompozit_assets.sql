-- Auto-generated from backend/uploads. Do not hand-edit individual rows.
-- Refreshes storage library assets from every image under backend/uploads.

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

DELETE FROM storage_assets WHERE provider = 'local';

INSERT INTO storage_assets
  (id, user_id, name, bucket, path, folder, mime, size, width, height, url, provider, created_at, updated_at)
VALUES
  ('83ebb71b-e393-4a25-8c48-3dd3a5dd24d8', NULL, 'apple-touch-icon.png', 'kompozit', 'kompozit/brand/apple-touch-icon.png', 'kompozit/brand', 'image/png', 11888, 180, 180, '/uploads/kompozit/brand/apple-touch-icon.png', 'local', NOW(3), NOW(3)),
  ('9900958f-406e-4910-877f-810a42d9c67c', NULL, 'favicon-32.png', 'kompozit', 'kompozit/brand/favicon-32.png', 'kompozit/brand', 'image/png', 1209, 32, 32, '/uploads/kompozit/brand/favicon-32.png', 'local', NOW(3), NOW(3)),
  ('86196ecd-fcae-4393-b086-29fb4f1c0a3f', NULL, 'kompozit_cam_elyaf_logo_1775592624958.png', 'kompozit', 'kompozit/brand/kompozit_cam_elyaf_logo_1775592624958.png', 'kompozit/brand', 'image/png', 512263, 811, 371, '/uploads/kompozit/brand/kompozit_cam_elyaf_logo_1775592624958.png', 'local', NOW(3), NOW(3)),
  ('74588f8a-4589-4ed6-8f0a-699ca13ee621', NULL, 'kompozit_login_bg.png', 'kompozit', 'kompozit/brand/kompozit_login_bg.png', 'kompozit/brand', 'image/png', 770521, 1024, 1024, '/uploads/kompozit/brand/kompozit_login_bg.png', 'local', NOW(3), NOW(3)),
  ('17d9181b-72ce-4b2b-94c6-32ced4f1a490', NULL, 'kompozit_logo.jpeg', 'kompozit', 'kompozit/brand/kompozit_logo.jpeg', 'kompozit/brand', 'image/jpeg', 319904, 815, 283, '/uploads/kompozit/brand/kompozit_logo.jpeg', 'local', NOW(3), NOW(3)),
  ('e08c0a3d-65ec-4824-bc51-1537ce1440b9', NULL, 'kompozit_logo.png', 'kompozit', 'kompozit/brand/kompozit_logo.png', 'kompozit/brand', 'image/png', 319904, 815, 283, '/uploads/kompozit/brand/kompozit_logo.png', 'local', NOW(3), NOW(3)),
  ('ccb91318-60c9-42f1-903b-605a82480b3b', NULL, 'logo_cam_elyaf_seffaf.png', 'kompozit', 'kompozit/brand/logo_cam_elyaf_seffaf.png', 'kompozit/brand', 'image/png', 521773, 1024, 1024, '/uploads/kompozit/brand/logo_cam_elyaf_seffaf.png', 'local', NOW(3), NOW(3)),
  ('5df0390b-06da-4eb6-89ac-c0dfa7bd6b43', NULL, 'logo-dark.png', 'kompozit', 'kompozit/brand/logo-dark.png', 'kompozit/brand', 'image/png', 122403, 560, 149, '/uploads/kompozit/brand/logo-dark.png', 'local', NOW(3), NOW(3)),
  ('721d43b2-dc75-4a1e-aae5-9e34f98b849d', NULL, 'logo-light.png', 'kompozit', 'kompozit/brand/logo-light.png', 'kompozit/brand', 'image/png', 319904, 815, 283, '/uploads/kompozit/brand/logo-light.png', 'local', NOW(3), NOW(3)),
  ('fd8dc35e-8b68-428c-aa08-61e1fd4eee9e', NULL, 'logo.png', 'kompozit', 'kompozit/brand/logo.png', 'kompozit/brand', 'image/png', 319904, 815, 283, '/uploads/kompozit/brand/logo.png', 'local', NOW(3), NOW(3)),
  ('76326e0c-da29-46e6-a844-c1b871b76355', NULL, 'moe_logo_premium.png', 'kompozit', 'kompozit/brand/moe_logo_premium.png', 'kompozit/brand', 'image/png', 693085, 1024, 1024, '/uploads/kompozit/brand/moe_logo_premium.png', 'local', NOW(3), NOW(3)),
  ('9e900d13-b132-419f-8412-d3b0bdc3f7e8', NULL, 'moe_logo_refined_v2.png', 'kompozit', 'kompozit/brand/moe_logo_refined_v2.png', 'kompozit/brand', 'image/png', 308282, 829, 299, '/uploads/kompozit/brand/moe_logo_refined_v2.png', 'local', NOW(3), NOW(3)),
  ('1a26e0ee-e17b-40d6-93e9-595282807432', NULL, 'ctp-cam-elyaf-01.jpg', 'kompozit', 'kompozit/ctp-cam-elyaf-01.jpg', 'kompozit', 'image/jpeg', 273930, 1376, 768, '/uploads/kompozit/ctp-cam-elyaf-01.jpg', 'local', NOW(3), NOW(3)),
  ('09c7660b-96d8-466b-ab29-be43c808b8e2', NULL, 'ctp-dokuma-hibrit-01.jpg', 'kompozit', 'kompozit/ctp-dokuma-hibrit-01.jpg', 'kompozit', 'image/jpeg', 222446, 1376, 768, '/uploads/kompozit/ctp-dokuma-hibrit-01.jpg', 'local', NOW(3), NOW(3)),
  ('ac15a96a-2b0a-49cc-80a3-64073dca9cc6', NULL, 'karbon-fiber-detay-01.jpg', 'kompozit', 'kompozit/karbon-fiber-detay-01.jpg', 'kompozit', 'image/jpeg', 219018, 1376, 768, '/uploads/kompozit/karbon-fiber-detay-01.jpg', 'local', NOW(3), NOW(3)),
  ('fe104bae-9472-441a-956a-d9e0982bd82a', NULL, 'karbon-fiber-doku-01.jpg', 'kompozit', 'kompozit/karbon-fiber-doku-01.jpg', 'kompozit', 'image/jpeg', 434437, 1376, 768, '/uploads/kompozit/karbon-fiber-doku-01.jpg', 'local', NOW(3), NOW(3)),
  ('89d6ae28-c8ae-4bd2-890c-3e83d9194fa4', NULL, 'karbon-fiber-hammadde-01.jpg', 'kompozit', 'kompozit/karbon-fiber-hammadde-01.jpg', 'kompozit', 'image/jpeg', 369901, 1376, 768, '/uploads/kompozit/karbon-fiber-hammadde-01.jpg', 'local', NOW(3), NOW(3)),
  ('9b4b68fc-2f95-4755-8808-b97e6a743362', NULL, 'karbon-fiber-panel-01.jpg', 'kompozit', 'kompozit/karbon-fiber-panel-01.jpg', 'kompozit', 'image/jpeg', 203463, 1376, 768, '/uploads/kompozit/karbon-fiber-panel-01.jpg', 'local', NOW(3), NOW(3)),
  ('ca68d649-b205-48fa-a31b-eaca76d63548', NULL, 'kompozit-fabrika-otoklav-01.jpg', 'kompozit', 'kompozit/kompozit-fabrika-otoklav-01.jpg', 'kompozit', 'image/jpeg', 438285, 1376, 768, '/uploads/kompozit/kompozit-fabrika-otoklav-01.jpg', 'local', NOW(3), NOW(3)),
  ('5f84896d-3988-4892-8302-1da63b4cc95d', NULL, 'kompozit-uretim-proses-01.jpg', 'kompozit', 'kompozit/kompozit-uretim-proses-01.jpg', 'kompozit', 'image/jpeg', 290834, 1376, 768, '/uploads/kompozit/kompozit-uretim-proses-01.jpg', 'local', NOW(3), NOW(3)),
  ('72c845ef-bebb-4df9-83d5-51202087a251', NULL, 'urunler-1.jpeg', 'kompozit', 'kompozit/urunler-1.jpeg', 'kompozit', 'image/jpeg', 396299, 1200, 1600, '/uploads/kompozit/urunler-1.jpeg', 'local', NOW(3), NOW(3)),
  ('bbe30835-c03d-47a1-b7af-b745c705d071', NULL, 'urunler-10.jpeg', 'kompozit', 'kompozit/urunler-10.jpeg', 'kompozit', 'image/jpeg', 355748, 1200, 1600, '/uploads/kompozit/urunler-10.jpeg', 'local', NOW(3), NOW(3)),
  ('fe1f3265-0c8f-4a91-897d-21857906c060', NULL, 'urunler-11.jpeg', 'kompozit', 'kompozit/urunler-11.jpeg', 'kompozit', 'image/jpeg', 556034, 1200, 1600, '/uploads/kompozit/urunler-11.jpeg', 'local', NOW(3), NOW(3)),
  ('e5bc3c68-fc1d-4786-a247-d122bb960c23', NULL, 'urunler-12.jpeg', 'kompozit', 'kompozit/urunler-12.jpeg', 'kompozit', 'image/jpeg', 610616, 1200, 1600, '/uploads/kompozit/urunler-12.jpeg', 'local', NOW(3), NOW(3)),
  ('09b2fc00-fa6b-4027-8eb6-365576578f3b', NULL, 'urunler-13.jpeg', 'kompozit', 'kompozit/urunler-13.jpeg', 'kompozit', 'image/jpeg', 316141, 1200, 1600, '/uploads/kompozit/urunler-13.jpeg', 'local', NOW(3), NOW(3)),
  ('7000cfc5-222f-474a-b870-0f4a20f7bf27', NULL, 'urunler-14.jpeg', 'kompozit', 'kompozit/urunler-14.jpeg', 'kompozit', 'image/jpeg', 485378, 1200, 1600, '/uploads/kompozit/urunler-14.jpeg', 'local', NOW(3), NOW(3)),
  ('24acc826-c974-4bc7-9984-c881c5372c1e', NULL, 'urunler-2.jpeg', 'kompozit', 'kompozit/urunler-2.jpeg', 'kompozit', 'image/jpeg', 369729, 1200, 1600, '/uploads/kompozit/urunler-2.jpeg', 'local', NOW(3), NOW(3)),
  ('404c4778-c749-42ef-bd0c-3dfe699d76bf', NULL, 'urunler-3.jpeg', 'kompozit', 'kompozit/urunler-3.jpeg', 'kompozit', 'image/jpeg', 318299, 1200, 1600, '/uploads/kompozit/urunler-3.jpeg', 'local', NOW(3), NOW(3)),
  ('7ab2aac2-d68f-4fbc-ad87-68bea40f1a14', NULL, 'urunler-4.jpeg', 'kompozit', 'kompozit/urunler-4.jpeg', 'kompozit', 'image/jpeg', 402940, 1200, 1600, '/uploads/kompozit/urunler-4.jpeg', 'local', NOW(3), NOW(3)),
  ('309f3457-759f-407c-816c-68852d2aa27f', NULL, 'urunler-5.jpeg', 'kompozit', 'kompozit/urunler-5.jpeg', 'kompozit', 'image/jpeg', 355882, 1200, 1600, '/uploads/kompozit/urunler-5.jpeg', 'local', NOW(3), NOW(3)),
  ('31a15116-8ad4-4fe4-9c44-274eb1efddc0', NULL, 'urunler-6.jpeg', 'kompozit', 'kompozit/urunler-6.jpeg', 'kompozit', 'image/jpeg', 350137, 1200, 1600, '/uploads/kompozit/urunler-6.jpeg', 'local', NOW(3), NOW(3)),
  ('37ba6c77-9426-4afb-8c94-23e0cd789e3c', NULL, 'urunler-7.jpeg', 'kompozit', 'kompozit/urunler-7.jpeg', 'kompozit', 'image/jpeg', 391028, 1200, 1600, '/uploads/kompozit/urunler-7.jpeg', 'local', NOW(3), NOW(3)),
  ('2a20ee21-5cb0-4ea7-9d87-55dcf1e3edbd', NULL, 'urunler-8.jpeg', 'kompozit', 'kompozit/urunler-8.jpeg', 'kompozit', 'image/jpeg', 380299, 1200, 1600, '/uploads/kompozit/urunler-8.jpeg', 'local', NOW(3), NOW(3)),
  ('3811f10f-b79a-4243-9e93-de1e35a9c42e', NULL, 'urunler-9.jpeg', 'kompozit', 'kompozit/urunler-9.jpeg', 'kompozit', 'image/jpeg', 358594, 1200, 1600, '/uploads/kompozit/urunler-9.jpeg', 'local', NOW(3), NOW(3)),
  ('298dea7d-b49b-464b-b6d2-67f978ef008e', NULL, 'ctp-cam-elyaf-01.jpg', 'media', 'media/kompozit/ctp-cam-elyaf-01.jpg', 'media/kompozit', 'image/jpeg', 273930, 1376, 768, '/uploads/media/kompozit/ctp-cam-elyaf-01.jpg', 'local', NOW(3), NOW(3)),
  ('0b08415a-1ce7-4176-b496-1d7d554e8c2a', NULL, 'ctp-dokuma-hibrit-01.jpg', 'media', 'media/kompozit/ctp-dokuma-hibrit-01.jpg', 'media/kompozit', 'image/jpeg', 222446, 1376, 768, '/uploads/media/kompozit/ctp-dokuma-hibrit-01.jpg', 'local', NOW(3), NOW(3)),
  ('dde93f3e-5654-43ae-abdf-8af77f9930bf', NULL, 'karbon-fiber-detay-01.jpg', 'media', 'media/kompozit/karbon-fiber-detay-01.jpg', 'media/kompozit', 'image/jpeg', 219018, 1376, 768, '/uploads/media/kompozit/karbon-fiber-detay-01.jpg', 'local', NOW(3), NOW(3)),
  ('e325d3b2-9f8d-4552-92a3-ef3882c3329c', NULL, 'karbon-fiber-doku-01.jpg', 'media', 'media/kompozit/karbon-fiber-doku-01.jpg', 'media/kompozit', 'image/jpeg', 434437, 1376, 768, '/uploads/media/kompozit/karbon-fiber-doku-01.jpg', 'local', NOW(3), NOW(3)),
  ('7e0c2fcd-9503-4bfd-b004-9912fea0126c', NULL, 'karbon-fiber-hammadde-01.jpg', 'media', 'media/kompozit/karbon-fiber-hammadde-01.jpg', 'media/kompozit', 'image/jpeg', 369901, 1376, 768, '/uploads/media/kompozit/karbon-fiber-hammadde-01.jpg', 'local', NOW(3), NOW(3)),
  ('3f100384-8d7b-4979-aac2-0f03cb22d6e3', NULL, 'karbon-fiber-panel-01.jpg', 'media', 'media/kompozit/karbon-fiber-panel-01.jpg', 'media/kompozit', 'image/jpeg', 203463, 1376, 768, '/uploads/media/kompozit/karbon-fiber-panel-01.jpg', 'local', NOW(3), NOW(3)),
  ('40e4b489-6692-49ab-b300-fe3a18bec333', NULL, 'kompozit-fabrika-otoklav-01.jpg', 'media', 'media/kompozit/kompozit-fabrika-otoklav-01.jpg', 'media/kompozit', 'image/jpeg', 438285, 1376, 768, '/uploads/media/kompozit/kompozit-fabrika-otoklav-01.jpg', 'local', NOW(3), NOW(3)),
  ('d4b61a94-f5dd-4bbd-ba62-4f118dbe19c8', NULL, 'kompozit-uretim-proses-01.jpg', 'media', 'media/kompozit/kompozit-uretim-proses-01.jpg', 'media/kompozit', 'image/jpeg', 290834, 1376, 768, '/uploads/media/kompozit/kompozit-uretim-proses-01.jpg', 'local', NOW(3), NOW(3)),
  ('01564265-3c34-45a2-a791-6fc36189b9bb', NULL, '14001_1.jpg', 'zertifika', 'zertifika/14001_1.jpg', 'zertifika', 'image/jpeg', 242983, 783, 1080, '/uploads/zertifika/14001_1.jpg', 'local', NOW(3), NOW(3)),
  ('de062f1b-3114-4c99-a25d-14114f623551', NULL, '45001_1.jpg', 'zertifika', 'zertifika/45001_1.jpg', 'zertifika', 'image/jpeg', 241477, 783, 1080, '/uploads/zertifika/45001_1.jpg', 'local', NOW(3), NOW(3)),
  ('41366065-5c47-4588-bdaf-27a3821eeeaa', NULL, 'ce-belgesi-ce-declaration.jpg', 'zertifika', 'zertifika/ce-belgesi-ce-declaration.jpg', 'zertifika', 'image/jpeg', 178223, 764, 1080, '/uploads/zertifika/ce-belgesi-ce-declaration.jpg', 'local', NOW(3), NOW(3)),
  ('07510920-5d18-45b6-b906-ed31544ec953', NULL, 'eac-ensotek.jpg', 'zertifika', 'zertifika/eac-ensotek.jpg', 'zertifika', 'image/jpeg', 379165, 764, 1080, '/uploads/zertifika/eac-ensotek.jpg', 'local', NOW(3), NOW(3)),
  ('1f974f3e-3c9d-48df-abf7-a3fa665e9e93', NULL, 'iso-10002.jpg', 'zertifika', 'zertifika/iso-10002.jpg', 'zertifika', 'image/jpeg', 240352, 783, 1080, '/uploads/zertifika/iso-10002.jpg', 'local', NOW(3), NOW(3)),
  ('8254c9dd-3f62-406f-912d-b98aa4e8b74f', NULL, 'iso-9001.jpg', 'zertifika', 'zertifika/iso-9001.jpg', 'zertifika', 'image/jpeg', 242918, 783, 1080, '/uploads/zertifika/iso-9001.jpg', 'local', NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  folder = VALUES(folder),
  mime = VALUES(mime),
  size = VALUES(size),
  width = VALUES(width),
  height = VALUES(height),
  url = VALUES(url),
  provider = VALUES(provider),
  updated_at = NOW(3);

SET FOREIGN_KEY_CHECKS = 1;
