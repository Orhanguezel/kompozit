# MOE dönüşüm kurulumu — 22 Eylül 2026

Kullanıcı talimatı: “tamam dönüsüm sistemini de kuralim.” Tenant moe-kompozit-4de92704, Ads hesabı 6966050193, Search kampanyası 24282233701. GA4 547431151 / G-S8V8GTJHZV. Mevcut generate_lead anahtar olayı korunur; yeni GA4 olayı/ikinci içe aktarılan Ads dönüşümü açılmaz.

## Google Ads

| Eylem | ID | Rol | Etiket |
|---|---|---|---|
| MOE Teklif ve Iletisim Formu | 7786835279 | Birincil / SUBMIT_LEAD_FORM | AW-18436252138/gWJSCM_ahoEdEOrDi9dE |
| MOE Telefon Tiklamasi | 7786961257 | İkincil / CONTACT | AW-18436252138/vWuFCOmyjoEdEOrDi9dE |
| MOE WhatsApp Tiklamasi | 7786961260 | İkincil / CONTACT | AW-18436252138/4kAKCOyyjoEdEOrDi9dE |

Üç eylem WEBPAGE, ONE_PER_CLICK, 30 günlük tıklama penceresi, varsayılan değer 0 TRY; talep satış cirosu diye değerlendirilmez. Telefon/WhatsApp tıklamaları gerçek görüşme veya nitelikli müşteri değildir.

Yeni WEBSITE müşteri varsayılan hedefleri false; yalnız Search kampanyasında CAMPAIGN hedef kapsamı ve SUBMIT_LEAD_FORM / WEBSITE biddable=true. Google'ın eski UNKNOWN kökenli false hedefleri değiştirilemediği için olduğu gibi kaldı; ilk validateOnly bunu yakaladı, hiçbir write olmadı. Düzeltilmiş taslak validateOnly + apply HTTP200; final.json geri okuma yalnız form hedefinin biddable olduğunu doğrular. PMax, bütçe ve kampanyaların PAUSED durumu değiştirilmedi. GA4 googleAdsLinks boş; bu kurulum doğrudan Ads etiketidir, GA4 dönüşüm içe aktarmaya bağımlı değildir.

## Site davranışı

Mevcut ortak lead-tracking Axios/fetch akışı kullanılır. API 201 ve kayıt ID'si olmadan dönüşüm yok. Bilinen test kayıtları, hata/honeypot sonuçları dışlanır. Kayıt türü + ID, Ads transaction_id olarak gönderilir; aynı sayfada tekrar engellenir. GA4'e form_name gider; ad/e-posta/telefon/form metni gönderilmez.

Sadece MOE ClientShell reklam etiketlerini etkinleştirir. Diğer sitelerde yeni Ads mapping yok. ConsentGate üç seçenek sunar: reddet, yalnız analiz, analiz + reklam ölçümü. Eski analiz izni reklam izni sayılmaz; eski analize izin veren kullanıcıya yeni tercih gösterilir. ad_personalization daima denied. Reklam ölçümü izni yoksa Ads config/dönüşüm gönderilmez. İzin geri çekilince çerezler temizlenir ve üçüncü taraf scriptlerin çıkması için sayfa yenilenir.

## Doğrulama ve deploy

- lead-tracking: 5 test / 20 assertion; tsc temiz.
- Yerel production build başarılı. İlk uzak derleme sunucuda bellek baskısı nedeniyle durduruldu; tamamlanan build yerelde yapıldı.
- Uzak kaynak ağaçta önceki SEO sürümüne ait eksik/stale dosyalar vardı. Yerel güncel src/public ile mevcut SEO sürümü korundu; verify-seo-audit.py yerel ve canlı geçti (18 sayfa, 22 llms bağlantısı, TR/EN paylaşım görselleri).
- Yalnız kompozit-frontend restart. Standalone yedeği: /var/www/Ensotek/kompozit/frontend/.next/standalone-before-conversions-20260922. Kaynak yedeği: /var/www/Ensotek/.local/moe-conversions-20260922/source-before.tgz. Eski statik dosyalar korunarak yenileri eklendi.
- Canlı 72108d90a3a49f89.js HTTP200 ve SHA256 yerel build ile eşit. Deploy karşılaştırmasındaki farklar runtime fetch-cache ve ISR HTML/RSC yenilemeleridir; kod paketleri eşleşir.
- Canlı contact formu: izin öncesi olay yok; yalnız analizde Ads yok; reklam ölçümü izninde 400 yanıt sayılmadı, 201 kayıt bir kez sayıldı, aynı ID tekrar sayılmadı. Telefon ve WhatsApp doğru ayrı etiketlere gitti. İzin geri çekildiğinde gtag script sayısı 0.
- Canlı /tr/offer: tek API yanıtı, tek generate_lead + form Ads dönüşümü. Kanıt browser-offer.txt.

Testlerde form POST ve Google ölçüm istekleri tarayıcıda yakalandı; gerçek talep/mesaj/e-posta veya yapay Google Ads dönüşümü oluşturulmadı. Bu, canlı UI + etiket çalışmasının doğrulamasıdır; gerçek reklam tıklamasından doğmuş müşteri talebinin Google raporunda görünmesi henüz gözlenmedi. Google durum ekranı ilk gerçek izinli dönüşüm gelene kadar doğrulanmamış/etkin değil gösterebilir.

Kaynak teknik sözleşmeler: https://developers.google.com/google-ads/api/docs/conversions/goals/overview ve https://developers.google.com/google-ads/api/docs/conversions/getting-started .

Ana sayfa /tr kısa teklif formu da canlı tarayıcıda doğrulandı: bir POST, bir generate_lead, bir Ads conversion. Google kütüphanesinin hazırladığı gerçek ağ isteği /pagead/conversion/18436252138/ ve label=gWJSCM_ahoEdEOrDi9dE ile yakalandı; dışarı gönderilmedi (browser-home.txt). Önceki takılan CLI oturumu kapatılıp ayrı tarayıcı oturumunda kontrol tamamlandı.
