-- =============================================================
-- FILE: 333_kompozit_product_catalog_gallery.sql
-- MOE Kompozit — ana galeri urun katalogundan beslenir (2026-09-25)
-- Neden: galeride 8 genel stok gorsel (doku, hammadde, otoklav) vardi, urun yoktu.
-- source_type='product_catalog' ile frontend aktif urun fotograflarini kategori
-- gruplu gosterir. gallery_images satirlari silinmez. Idempotent.
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

START TRANSACTION;

UPDATE `galleries` SET `source_type` = 'product_catalog'
WHERE `id` = '97010100-8100-4100-9100-eeeeeeee0100';

UPDATE `gallery_i18n` SET `description` = 'Ürettiğimiz kompozit ürünlerin fotoğrafları: lunapark kabinleri ve yılbaşı figürleri, belediye ürünleri, peyzaj saksıları ve projeye özel parçalar. Her fotoğraf ilgili ürün sayfasına bağlanır.', `meta_title` = 'Ürün Fotoğrafları | MOE Kompozit Ürün Galerisi', `meta_description` = 'Lunapark kabini, yılbaşı figürü, CTP su deposu, çöp konteyneri, tabut ve dekoratif saksı gibi ürettiğimiz kompozit ürünlerin gerçek fotoğrafları.'
WHERE `gallery_id` = '97010100-8100-4100-9100-eeeeeeee0100' AND `locale` = 'tr';

UPDATE `gallery_i18n` SET `description` = 'Photos of the composite products we manufacture: amusement ride cabins and Christmas figures, municipal products, landscape planters and custom parts. Each photo links to its product page.', `meta_title` = 'Product Photos | MOE Kompozit Product Gallery', `meta_description` = 'Real photos of our composite products: amusement ride cabins, Christmas figures, FRP water tanks, waste containers, coffins and decorative planters.'
WHERE `gallery_id` = '97010100-8100-4100-9100-eeeeeeee0100' AND `locale` = 'en';

UPDATE `gallery_i18n` SET `description` = 'Fotos der von uns gefertigten Verbundwerkstoffprodukte: Fahrgeschäftskabinen, Weihnachtsfiguren, kommunale Produkte, Pflanzgefäße und Sonderteile.', `meta_title` = 'Produktfotos | MOE Kompozit Produktgalerie', `meta_description` = 'Echte Fotos unserer GFK-Produkte: Fahrgeschäftskabinen, Weihnachtsfiguren, Wassertanks, Abfallbehälter, Särge und Pflanzgefäße.'
WHERE `gallery_id` = '97010100-8100-4100-9100-eeeeeeee0100' AND `locale` = 'de';

COMMIT;
