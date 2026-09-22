# Kompozit SEO denetimi düzeltmeleri — 22 Eylül 2026

Kapsam: Kullanıcının paylaştığı karbonkompozit.com.tr Site Sağlığı ve Arama Performansı çıktıları. Puan yeniden ölçülmedi; bu belge HTML ve uygulama kanıtlarını raporlar.

## Tamamlanan değişiklikler

- TR/EN dokuzar ana sayfanın `kompozit__seo_pages` başlıkları anlam korunarak düzenlendi. Marka ekiyle 45–57 karakter. Açıklamalar, indeksleme tercihleri ve özel OG görselleri korunuyor. Yönetim paneli kaynak olmaya devam ediyor; seed de güncellendi.
- Veri değişikliği eşzamanlı düzenlemeyi denetleyen, tekrar çalıştırılabilir script ile uygulandı. Önce iki kayıt yedeklendi: sunucuda `backend/seo-titles-backup-1790072582672.json`.
- Ana sayfa gövdesinde çözümler, galeri, referanslar, blog ve diğer dilin ana sayfasına açıklamalı bağlantılar eklendi. Teknik teklif hazırlığı; ölçü, adet/termin, çalışma koşulu ve kabul kriterleriyle anlatılıyor. Bunlar müşteri girdileridir, ölçülmüş ürün sonuçları değildir.
- `public/llms.txt` dinamik rotayı gölgeliyor ve eski Türkçe rota adlarını sunuyordu. Statik kopya kaldırıldı; paneldeki metne 22 gerçek Markdown bağlantısı ekleniyor. Hedeflerin tamamı HTTP 200 ile kontrol edildi.
- Mevcut paylaşım görseli üreticisi tekrar kullanıldı. Nginx `/api/*` isteklerini backend'e verdiği için `/share-image` üzerinden sunuluyor. WebP logonun ImageResponse tarafından desteklenmemesi marka adı kullanılarak çözüldü. Sayfaya/dile özel 1200×630 PNG, OG alt metni ve boyut bilgileri eklendi. Panelde özel sayfa görseli varsa önceliği korunuyor.
- Blog detayında kaynaksız “Expert Content” ifadesinin yerine gerçek yayıncı adı ve Hakkımızda bağlantısı gösteriliyor. Mevcut yayın tarihleri korunuyor; hayali uzman/yazar eklenmedi.
- TypeScript kontrolü için mevcut `bun-types` paketi açıkça tanımlandı; uygulama test dosyasındaki önceden var olan `bun:test` çözümleme hatası giderildi.

## Doğrulama

- Üretim derlemesi geçti.
- `tsc --noEmit` geçti.
- `check-seo-inventory.mjs`: 32 yayımlanmış detay URL'si için API/sitemap/HTML locale regresyonu geçti.
- `check-media-seo.mjs` geçti.
- Mevcut lead tracking testleri: 4 test / 15 assertion geçti. İzin yokken ölçüm yok, kaydedilmiş 201 yanıtı tek kez sayılıyor, hata/test kayıtları dışlanıyor.
- `scripts/verify-seo-audit.py`: 18 sayfanın başlığı, farklı paylaşım görseli adresi, OG boyutu/alt metni, ana sayfa gövde bağlantıları ve TR/EN PNG yanıtı kontrol ediliyor.
- Playwright: yeni teknik rehber 320 px viewport'ta 320 px genişliğinde; kendi içinde taşma yok. Paylaşım PNG'si görsel olarak incelendi.
- Eski `test:seo` kaynak metni testi iki uyarı veriyor: `/legal` artık başka modülden gelen envanterde; eski `images: resolveSitemapImages` kalıbı yok. Bu testin geçtiği iddia edilmiyor. Canlı envanter kontrolü ayrı yapıldı.

## Açık kalanlar ve ölçüm sınırları

- **Özgün içerik / E-E-A-T:** yayımlanabilir gerçek test raporu, ölçüm tablosu, ürün bazlı belge kapsamı ve izinli müşteri vakası gerekli. Mevcut veriden sahte sertifika, yorum, ölçüm veya uzmanlık üretilmedi. Teknik hazırlık bölümü bu eksikliğin tamamen kapandığı anlamına gelmez.
- **Arama performansı:** 32 organik oturum, 4 markasız tıklama ve düşük gösterimle niyet/CTR/marka trendi için yeterli örneklem yok. Kod değişikliğiyle geçmiş veri üretilemez.
- **GA4:** `generate_lead` zaten var; ikinci event eklenmedi. Gerçek consent → başarılı kayıt → GA4 raporu ve anahtar olay tanımı bu turda uçtan uca doğrulanmadı. Sıfır anahtar olay tek başına bozuk form/takip kanıtı değildir.
- **Tanitio ayarları:** Marka terimlerindeki teknik tenant slug'ı ve bölüm-niyet eşlemesi analiz uygulamasında ele alınmalı. B2B ürün listeleri otomatik satın alma sayfası olarak sınıflanmamalı. Harici hesap ayarları değiştirilmedi.
- **Dış bağlantılar:** ücretli sağlayıcı çağrısı yapılmadı; backlink niteliği ölçülmüş sayılmıyor.
- **Konusal derinlik:** sırf puan için her bölüme üç sayfa eklenmedi. Yeni çözüm/vaka sayfaları gerçek içerik geldikçe hazırlanmalı.
- **Görsel boyut uyarıları:** örneklemde anlamlı görsellerde alt metin vardı; birçok width/height uyarısı Next Image `fill` ve CSS ile boyutlandırılmış alanlardan kaynaklanıyor. Görsellerin gerçek ölçüsü yerine rastgele HTML boyutu yazılmadı.
- **Önceden mevcut mobil taşma:** ana sayfadaki malzeme/avantaj/proses gibi eski bölümlerde 320 px'de taşma görüldü (belge scrollWidth 396 px). Yeni bölümün dışındaki bu durum ayrı düzenleme gerektiriyor; tüm site mobil kabulü verilmedi.

Kanıtlar: Ensotek `output/kompozit-seo-2026-09-22/` altında önce/sonra sonuçları, build ve deploy logu, mobil bölüm görüntüsü ve paylaşım PNG'si. Yerel `docs/audit/2026-09-22/` altında sonuç kopyaları.

## Canlı sonuç

Sürüm 22 Eylül 2026'da yalnız `kompozit-frontend` yeniden başlatılarak yayımlandı. Önceki standalone sürüm sunucuda `.next/standalone.before-checklist-20260922T103104Z` olarak korundu. `verify-seo-audit.py https://www.karbonkompozit.com.tr` geçti: **18/18 sayfa, 18 farklı OG URL'si, 22 llms bağlantısı, TR/EN PNG yanıtı**. Canlı tarayıcı ana sayfa başlığı: “Karbon Fiber ve CTP Kompozit Üretimi - MOE Kompozit”. SEO/GEO puanları için analiz aracının yeniden taraması gerekir.

### Devam turu

Sonraki ekler üzerine içerik/FAQ, gerçek görsel boyutları, blog özetleri, temsili referans temizliği ve mobil taşma düzeltildi; ikinci sürüm de canlıda doğrulandı. Bu belgedeki eski “mobil taşma” ve “görsel boyutu uyarısı” durumu için güncel sonuç: [İkinci tur raporu](SEO-IYILESTIRME-DEVAM-2026-09-22.md).
