# İkinci SEO iyileştirme turu — 22 Eylül 2026

## Başlangıç ölçümü

Kullanıcının yeni analiz çıktısı: SEO 62.6, GEO 34.2, 5 bulgu (2 yüksek, 3 düşük). Önceki çıktıda 15 bulgu vardı. İç bağlantı puanı 100; örneklemde bağlantı almayan sayfa kalmamış. Bu tur sonrasında yeni Tanitio puanı henüz ölçülmedi.

## Uygulanan işler

- Ana sayfa, ürünler, çözümler, galeri, blog, hakkımızda, referanslar, iletişim ve teklif için TR/EN rehberleri: toplam 18 sayfa. Sayfanın kendi konusuna uygun soru-cevaplar, karar kriterleri, ilgili içerik ve teklif bağlantıları.
- Görünür cevaplardan üretilen FAQPage şeması. İletişim/teklifte mevcut şema korunuyor; ikinci FAQPage eklenmiyor. Kontrol, görünür soruları ve cevapları JSON-LD ile birebir karşılaştırıyor.
- Yayıncı adı + Hakkımızda bağlantısı. 22 Eylül tarihi **yeni rehber metinlerinin düzenleme tarihidir**; tüm sayfa veya ürünün güncelliği iddiası değildir.
- Blog liste kartları `summary` içeriğini de gösteriyor. API'de özeti bulunmasına rağmen yalnız boş `description` alanı kullanılması düzeltildi.
- Referans API'si boşken gösterilen temsili müşteri/proje kartları kaldırıldı. Gerçek izinli referans gelene kadar boş durum ve referans değerlendirme rehberi gösteriliyor. Kurgusal kartlar artık ItemList'e müşteri kanıtı olarak aktarılmıyor.
- 18 canlı sayfadaki 24 farklı görsel dosyasının gerçek piksel boyutu okundu ve boyut envanteri oluşturuldu. Ölçülen görseller gerçek width/height ile, mevcut crop/yerleşim korunarak sunuluyor. Bilinmeyen yeni görsellerde eski `fill` davranışı korunuyor. Ölçü yakalama script'i tekrar çalıştırılabilir.
- Mobilde uzun başlıklar ve intrinsic grid genişliğinin neden olduğu taşma düzeltildi. Malzeme özellikleri çok dar ekranda tek kolona iniyor; gizleme veya yatay kaydırmayla içerik kaybettirilmiyor.

## Doğrulama

- TypeScript/üretim derlemesi geçti.
- İçerik kontrolü: 18 sayfa, her birinde rehber, 40+ kelimelik bağımsız cevaplar, tam bir FAQPage, görünür metin/şema eşitliği ve hiçbir görselde eksik HTML boyutu olmaması.
- Önceki başlık/OG/llms kontrolleri tekrar çalıştırılıyor.
- Media SEO kontrolü geçti.
- 32 detay URL'sinin API/sitemap/HTML envanter testi geçti. İlk çalışmada `/tr/products/kompozit-cop-kutusu` geçici 502 verdi; sonraki tekil istek 200, tam tekrar başarılı. Frontend logunda yeniden başlatma görüldü; 502'nin kesin nedeni tespit edilmiş sayılmıyor.
- 320 px Playwright kontrolü: TR/EN ana sayfa, TR ürünler, çözümler, blog, iletişim, teklif ve referanslar; tamamında belge genişliği 320 px. Önceki TR ana sayfa değeri 396 px idi.
- Masaüstü ana sayfa ve mobil rehber görüntüleri incelendi; resim yerleşimi korunuyor.
- Çalışma klasöründeki eşzamanlı değişiklikler korunuyor. Son derleme sırasında kaynak dosyaların SHA-256 özetleri değişmedi; yayın arşivi ayrıca özetlenip sabitlendi. Reklam/izin ayarları bu turun içerik değişikliği olarak raporlanmıyor.

## Açık kalanlar

1. Birinci el test verisi, ürün özelinde performans tablosu, kapasite/termin rakamları ve izinli müşteri vakaları hâlâ kaynak gerektiriyor. Eklenen rehberler bunların yerine geçmez.
2. Katalogdaki salt kelime/adet eşiklerine ulaşmak için gereksiz paragraf veya sayfa üretilmedi. Özellikle referans sayfasında gerçek veri olmadan referans sayısı artırılmadı.
3. Search Console'un düşük örneklemli niyet/CTR/marka trendi alanları ve backlink ölçümü bu turda değişmedi. Geçmiş trafik yaratılmadı; ücretli sağlayıcı çağrısı yapılmadı.
4. Yeni görsel dosyaları veya aynı URL'deki dosya değişiklikleri boyut envanterinin yenilenmesini gerektirir. `python3 frontend/scripts/capture-media-dimensions.py` gerçek dosyaları tekrar ölçer (Pillow gerekir).
5. FAQ şeması görünür içeriği tanımlar; Google'da zengin sonuç veya sıralama artışı garantisi verilmez.

Kanıtlar: `../output/kompozit-seo-2026-09-22-pass2/`. Kontrol script'leri: `frontend/scripts/verify-content-audit.py`, `frontend/scripts/verify-seo-audit.py`.

## Canlı kapanış

22 Eylül 2026 10:52 UTC'de doğrulanan arşiv yayımlandı. Arşiv SHA-256: `8077bf69c6038b45def53c6b6937249b38bbce65729ff64318fc714bd53b204d`. Önceki sürüm: `.next/standalone.before-checklist-20260922T105245Z`.

Canlı içerik kontrolü **18/18**, başlık/OG/llms kontrolü **18/18** geçti. Görsellerde eksik HTML boyutu yok; her sayfada tam bir FAQPage grafiği var. Canlı Playwright ana sayfa kontrolü **320 px viewport / 320 px scrollWidth**, yeni rehber görünür. Sonuçlar `content-live.json`, `metadata-live.json` ve `live-mobile.png` olarak kaydedildi.
