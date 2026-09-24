# MOE Kompozit blog yenileme — 2026-09-22

Dört mevcut yazı Türkçe ve İngilizce olarak yeniden yazıldı: 8 yerelleştirilmiş metin. Site yalnız tr/en destekliyor. Her yazı 341–472 kelime; toplam içerik MOE ürün ve teklif bağlamı için bu çalışmada kaleme alındı. İnternet çapında intihal taraması yapıldığı iddia edilmez.

## Editoryal kapsam

1. Karbon fiber: parça seçimi, çizim gereksinimleri ve numune kabulü.
2. CTP/fiberglass: terimlerin açıklanması, kabin/gövde teklif kapsamı ve karşılaştırma listesi.
3. Kalite: kritik ölçü, montaj, yüzey referansı ve revizyon içeren kabul planı.
4. Gelecek: modüler gövdeler, bakım erişimi, yedek parça ve yaşam boyu ihtiyaç planlaması.

Örnekler varsayımsal senaryo olarak işaretlendi. Doğrulanmamış müşteri projesi, sertifika, laboratuvar kapasitesi, performans rakamı veya kesin sürdürülebilirlik iddiası eklenmedi. İngilizce metinlerde ölçü birimi, sevkiyat ve kabul yeri gibi ihracat alıcısına yönelik açıklamalar bulunuyor.

Başlık, özet, meta başlık, meta açıklama ve içerik güncellendi. ID, slug, görsel ve ilk yayın tarihi korundu; gerçek düzenleme zamanı güncellendi. Eski metinler before-tr.json / before-en.json içinde, yayımlanan metinler patches.json ve ayrı HTML dosyalarında.

## Kopya etiketinin anlamı

Tanitio backend/src/modules/marketing/gsc.ts içindeki statusText eşlemesi, coverageState içinde duplicate gördüğünde Kopya etiketini üretir. Bu bir intihal tarama sonucu değildir. Sekiz canlı sayfanın canonical ve karşılıklı TR/EN hreflang bağlantıları doğru doğrulandı. Eski /blog ile /tr/blog ayrımı geçmiş kayıtlarda yer alıyordu; güncel Google-selected canonical bu çalışmada Search Console üzerinden yeniden alınmadı. Etiketin kalktığı iddia edilmez.

## Yayın ve kanıt

- İşlem öncesi kilitli dry-run: tam 4 blog, 8 çeviri; slug ve mevcut içerik eşitliği kontrol edildi.
- Sunucu yedeği: /var/www/Ensotek/kompozit/backend/blog-refresh-backup-1790093405516.json.
- Transaction ile 8 kayıt güncellendi; frontend önbelleği revalidate edildi.
- verify.py: 8 canlı HTML/API içeriği, başlık, açıklama, canonical, hreflang, OG varlığı ve ilk yayın tarihi doğrulandı. Sonuç: live-verification.json.
- Kimlik doğrulamalı Tanitio kaynak API'si: Türkçe 4 / İngilizce 4 kayıtta yeni başlık, özet ve tam içerik birebir doğrulandı.
- Tanitio panelinin oturum gerektiren ekranı doğrudan doğrulanmadı; kaynak API doğrulandı. Panelde yenileme gerekebilir.
- Yeniden seed edildiğinde eski yazılara dönmemesi için 329_kompozit_blog_editorial_refresh.sql eklendi.

## Teknik dayanaklar

- https://compositesuk.co.uk/composite-materials/materials/
- https://compositesuk.co.uk/composite-materials/introduction/
- https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
