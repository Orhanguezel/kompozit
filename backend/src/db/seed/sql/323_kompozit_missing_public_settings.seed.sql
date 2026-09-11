INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
('kompozit-site-meta-default-tr','site_meta_default','tr','{"title":"MOE Kompozit | Karbon Fiber ve CTP Ürünleri","description":"Karbon fiber, CTP / FRP ve özel üretim kompozit ürünler; endüstriyel projeler için mühendislik ve üretim çözümleri."}'),
('kompozit-site-meta-default-en','site_meta_default','en','{"title":"MOE Composites | Carbon Fiber and FRP Products","description":"Carbon fiber, FRP and custom composite products with engineering and manufacturing solutions for industrial projects."}'),
('kompozit-footer-content-tr','footer_content','tr','{"description":"Karbon fiber, CTP / FRP ve özel üretim kompozit çözümler.","copyright":"© MOE Kompozit. Tüm hakları saklıdır."}'),
('kompozit-footer-content-en','footer_content','en','{"description":"Carbon fiber, FRP and custom-made composite solutions.","copyright":"© MOE Composites. All rights reserved."}')
ON DUPLICATE KEY UPDATE `value`=VALUES(`value`),`updated_at`=NOW(3);
