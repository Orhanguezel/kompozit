# Favicon / Google görsel kontrolü — 2026-09-22

Canlı HTML'de normal favicon resmi MOE ikonuna giderken apple-touch-icon /neutral-icon.svg adresine gidiyordu. Bu SVG, kullanıcının ekran görüntüsündeki koyu zeminli beyaz kutu simgesiyle eşleşiyor. Google'ın son taradığı dosyayı bağımsız olarak doğrulamadık; mevcut çelişkili sinyal somut olarak doğrulandı.

Organization ve LocalBusiness verisinde /icon (32px) kullanılıyordu. İngilizce Organization kaydının diğer kopyasında eski moe_logo_refined_v2.png kullanılıyordu. Varsayılan ve bilinen eski kaynaklar resmi MOE dosyalarına yönlendirildi; özel yönetici dosyaları korunur. Boş Apple ikon ayarı artık nötr SVG'ye düşmez. /icon uyumluluk adresi 180px resmi ikona yönlenir.

Lunapark ürününün OG/Twitter görseli /uploads/kompozit/lunapark-01-renkli.jpg: HTTP 200, 1448×1086 JPEG. Görsel sayfa HTML'sinde img olarak mevcut; robots.txt engeli veya X-Robots-Tag kısıtı görülmedi. OG eksikliği saptanmadı. max-image-preview:large eklendi. Google'ın organik sonuçta küçük resim seçimi garanti edilemez.

Production build ve diff kontrolü başarılı. verify.py, TR/EN ana sayfa ve lunapark sayfasında ikon dosyalarını açar, kare ölçüleri ve logo referanslarını, robots iznini, OG dosyasını doğrular. Kanıtlar local.json ve live.json.

Kaynaklar:
- https://developers.google.com/search/docs/appearance/favicon-in-search
- https://developers.google.com/search/docs/appearance/visual-elements-gallery
- https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag

Canlı doğrulama: dört sayfa başarılı; ikonlar resmi dosya, eski /icon şirket logosu referansı yok, büyük önizleme açık, OG görselleri erişilebilir. Yayın yedeği: standalone.before-checklist-20260922T140617Z. Paket SHA256: a50aea34aa4ac99010aa1307c7ce49e3f786cdea47bdcc486462183020e61bff.
