# MOE Kompozit — OG ve Google Ads kontrolü, 22 Eylül 2026

Kapsam: karbonkompozit.com.tr sitemap'inin 72 sayfası; Google Ads müşteri 6966050193, kampanya 24282233701. Google Ads okumaları 10:57–11:01 UTC anlık durumudur.

## Yapılan düzeltmeler

- 54 sayfada eksik OG genişlik/yükseklik bilgileri tamamlandı. Fotoğraflara gerçek dosyalardan ölçülen değerler yazılıyor.
- 72 sayfada X/Twitter görsel açıklaması eklendi.
- Özel görseli olmayan sayfalarda genel İngilizce kart yerine sayfa başlığına ve diline uygun 1200×630 paylaşım kartı üretiliyor. Mevcut ürün fotoğrafları korunuyor.
- Aynı eksikleri tekrar tarayan `frontend/scripts/verify-og-images.py` eklendi: sitemap sayfaları, canonical, görsel erişimi, gerçek dosya boyutları, OG/Twitter eşleşmesi ve açıklamalar.

## Doğrulama ve yayın

- Canlı yayından sonra sitemap yeniden tarandı: 72/72 sayfa, 51/51 görsel başarılı; eksik etiket, boyut uyuşmazlığı veya kırık görsel yok (`live.json`).
- Üretim derlemesi ve TypeScript kontrolü geçti.
- İzole yayın paketinde 72 sayfa ve 51 farklı paylaşım görseli hatasız; 18 sayfalık içerik/FAQ/görsel kontrolü de geçti.
- Paket SHA256: `18dc6d5e8891880a1bbb226b8c4d3691344c0508599de7682b98e821a642fce5`.
- Yayın yedeği: `/var/www/Ensotek/kompozit/frontend/.next/standalone.before-checklist-20260922T110339Z`.
- Kanıtlar: `../output/kompozit-og-ads-2026-09-22/` içindeki `before.json`, `candidate.json`, `live.json`, `deploy.log`.

## Google Ads ve açılış sayfaları

- Üç reklam ENABLED, REVIEWED ve APPROVED. Kampanya toplu durumu henüz PENDING / MOST_ADS_UNDER_REVIEW.
- Dokuz görsel ilişkisinin dördü ELIGIBLE, beşi PENDING. Saksı grubunun dört görseli ve özel B2B grubunun yeni koruyucu gövde görseli incelemede.
- Dokuz gerçek reklam dosyası indirildi: JPEG, izin verilen dosya boyutunun altında, kare veya yaklaşık 1.91:1; minimum çözünürlük kontrolleri geçti. Görsel incelemede yazı/logo bindirmesi görülmedi. Saksı, kompozit gövde ve lunapark görselleri ilgili reklam grubu konularıyla eşleşiyor.
- Üç açılış URL'si HTTP 200, kendi canonical adresine sahip; başlık/içerik reklam konusuyla uyumlu ve teklif bağlantısı ürün/çözüm bağlamını forma taşıyor.
- Gerçek tarayıcıda üç açılış sayfası 320 px genişlikte kontrol edildi: yatay taşma ve yüklenmiş ana içerik görsellerinde kırık dosya yok.
- Hesapta otomatik etiketleme açık. Kampanyada WEBSITE / SUBMIT_LEAD_FORM teklif optimizasyonuna dahil, CONTACT dahil değil.
- Kanıtlar: `ads-live.json`, `ads-assets.json`, `ads-image-check.json`, `ads-landings.json`, `mobile-landings.txt` ve indirilen dokuz JPG.

Google Ads Arama görsel uzantıları için paylaşım kartlarındaki yazılı tasarımlar kullanılmadı. Dosya kontrolü [Google görsel öğesi gereksinimlerine](https://support.google.com/adspolicy/answer/10347108?hl=en) göre yapıldı; açılış sayfaları ayrıca [hedef gereksinimleri](https://support.google.com/adspolicy/answer/6368661?hl=en) açısından erişim ve konu tutarlılığı için kontrol edildi.

## Açık kalan dış doğrulamalar

Beş görselin Google incelemesi tamamlanmadan bütün öğeler onaylı denemez. Gerçek bir reklam tıklamasından gelen gerçek talebin Ads raporuna işlenmesi bu kontrolün parçası olarak doğrulanmadı. Teknik kontroller, Google politika onayı veya reklam performansı garantisi değildir. Kampanya bütçesi, reklamlar ve yayın durumu bu çalışmada değiştirilmedi.
