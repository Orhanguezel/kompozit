# MOE Kompozit — kapsamlı site denetimi

**Tarih:** 9 Eylül 2026. **Hedef:** https://www.karbonkompozit.com.tr — TR + EN.
**Sonuç:** 16 doğrulanmış sorun grubu. Öncelik: sitemap/dil eşleme, form rızası ve mobil performans.

Bu çalışma denetim ve raporlama kapsamındadır. Uygulama kodu, veri, Google ayarları ve canlı servisler değiştirilmedi; form, e-posta veya katalog talebi gönderilmedi. Mevcut çalışma ağaçlarında önceden bulunan değişiklikler korunmuştur.

Önceki `ensotek_de/docs/ensotek-de-master-aksiyon-plani.md`, `seo-gsc-duzeltme-plani.md`, `ensotek_com_tr/docs/FRONTEND_CHECKLIST.md` ve mevcut 9 Eylül SEO/GA4 kayıtları referans alındı. Aynı ana başlıklar kullanıldı: HTTP, sitemap, canonical/hreflang, SSR içerik, dil/marka, yapılandırılmış veri, dönüşüm, mobil kullanım, erişilebilirlik, performans ve işletim.

**Kanıt standardı:** “Doğrulandı” canlı yanıt/tarayıcı veya belirtilen kaynak kodla kanıtlanan bulgudur. “Açık doğrulama” tamamlanmamış bir kontroldür; hata sayısına dahil değildir. Sayfa sayıları aynı temel sorundan etkilenen URL sayılarıdır; ayrı hata sayısı değildir. Dört kontrollü olmayan-slug isteği taramaya dahildir.

## Ölçülen durum

| Kontrol | Sonuç |
|---|---|
| Sitemap URL | **60**, tamamı HTTP 200 |
| Sitemap + iç bağlantı taraması | **72 istek:** 68 HTTP 200, 4 kasıtlı olmayan-slug HTTP 404; kalan kuyruk 0 |
| Sitemap alternatifi + eski slug ek kontrolü | **89 URL**, 6 galeri dil alternatifi HTTP 404 |
| Sitemap dışında kalan makale | **8**: dört TR + dört EN |
| Detay HTML’inde hreflang bulunmayan | **38**: 24 ürün, 6 galeri, 8 makale |
| Kendine canonical | Taranan 68 başarılı adresin tamamında var |
| Yinelenen marka içeren title | **50 URL** |
| Mobil Lighthouse | Performans **49**, erişilebilirlik **97**, iyi uygulamalar **100**, SEO **100** |
| LCP / FCP / TBT / CLS | **8,8 sn / 4,5 sn / 510 ms / 0** |
| TypeScript | Frontend + backend + admin panel: geçti |
| Canlı servisler | Üç PM2 süreci online; API health HTTP 200; DB `kompozit` |

Lighthouse 12.8.2, mobil simülasyon, tek koşu; iki site ölçümü aynı yerel makinede eşzamanlı çalıştı. Bunlar laboratuvar sinyalleridir, CrUX/gerçek kullanıcı Core Web Vitals sonucu veya kesin kıyas değildir. Ana sayfanın SEO 100 alması sitemap ve çok sayfalı dil hatalarının bulunmadığı anlamına gelmez. Browser örneklerinde 390 px ekran ve belge genişliği eşit; bozuk yüklenmiş görsel görülmedi.

## Doğrulanmış bulgular ve kabul kriterleri

### K01 — P1 — Makaleler sitemap’te yok

Canlı `/tr/blog` ve `/en/blog` dörder makale içeriyor; sekiz detay sitemap’te bulunmuyor. `GET /api/custom-pages?module_key=kompozit_blog&locale=tr&is_active=1&limit=500` **400**, aynı modül `limit=200&is_published=1` ile **200 / 4 kayıt**.

**Kök neden:** `frontend/src/app/sitemap.ts` içindeki `withDefaultParams` 500 ekliyor; `packages/shared-backend/modules/customPages/validation.ts` üst sınırı 250. `fetchItems` hatayı boş listeye dönüştürüyor. Ayrıca custom-pages yayın filtresi `is_published`; `is_active` ile eşdeğer varsayılmamalı.

- [ ] API sözleşmesine uygun limit/sayfalama ve yayın filtresi; sekiz makale sitemap’e girsin, API hatası sessiz boş liste olmasın.
- [ ] Ürün, galeri, çözüm ve yasal sayfa kapsamı korunarak API yayımlanmış URL kümesiyle birebir karşılaştırılsın.

### K02 — P1 — Sitemap yanlış dil slug’ları üretiyor

Sitemap, mevcut path’i diğer dile aynen kopyalıyor. **6 alternatif 404:** `/en/gallery/ctp-govde-paneli-uretim-galerisi`, `/en/gallery/karbon-fiber-panel-uygulama-galerisi`, `/en/gallery/moe-kompozit-urun-galerisi` ve bunların üç İngilizce slug ile `/tr/gallery/...` karşılığı.

**Kök neden:** `sitemapEntry → localeAlternates(path, locales)` içerik kimliği/çeviri slug’ı yerine tek path kullanıyor (`src/app/sitemap.ts`, `src/seo/helpers.ts`). Bazı ürün alternatifleri 404 yerine fallback içerik döndürüyor; HTTP 200 tek başına dil eşdeğerliği kanıtı değil.

- [ ] Alternatifler içerik kimliği üzerinden gerçek çevrilmiş slug’a bağlansın; 6 hedef 200, doğru dil, kendine canonical ve karşılıklı dönüş bağlantısı sağlasın.

### K03 — P1 — Detay sayfalarında HTML hreflang eksik

24 ürün, 6 galeri ve 8 makale detayının HTML’inde `link[hreflang]` yok. Liste sayfalarının alternatifleri bu detayların yerine geçmez. Örnek: `/tr/products/savunma-sanayi-kompozit-parcalari` ve `/en/products/defense-industry-composite-parts`.

- [ ] Gerçek çeviri eşlemesinden sayfa bazında karşılıklı hreflang üret; olmayan çeviriyi ilan etme. HTML ve sitemap aynı eşlemeyi kullansın.

### K04 — P1 — Farklı dil slug’ı yanlış dilde içerik açıyor

`/en/blog/karbon-fiber-nedir` **200 + kendine canonical** ile Türkçe gövde ve Türkçe başlık sunuyor. Gerçek İngilizce `/en/blog/what-is-carbon-fiber` de 200. `/tr/products/defense-industry-composite-parts` ile Türkçe asıl ürün yolu da ayrı 200 adresleri olarak yaşıyor; eski/yanlış slug geçişi tek hedefte toplanmıyor.

Bu kontrol **yalnız slug Türkçe olduğu için** hata yazmaz; `/en` altındaki gerçek gövde dili doğrulandı. Eski URL’nin GSC’de dizinde olması mevcut dil karışıklığını ortadan kaldırmaz.

- [ ] Eski URL → doğru dilde gerçek içerik kararını çıkar; mevcut indeksli adresleri incelemeden silme. Canonical, yönlendirme, dil düğmesi ve sitemap tek eşlemeye bağlansın.

### K05 — P2 — Eski dil öneksiz makale geçişi geçici yönlendirme

`/blog/ctp-fiberglass-farklari` → `/tr/blog/ctp-fiberglass-farklari` **307 → 200**. Sabit eski URL taşıma kararı kalıcıysa 301/308 kullanılmalı. Dil seçen ana sayfa `/ → /tr` yönlendirmesi bununla aynı değerlendirilmez.

- [ ] Eski içerik adreslerini envanterle; gerçekten kalıcı taşınanları uygun tek hedefe kalıcı yönlendir ve zinciri test et.

### K06 — P2 — 50 title içinde marka iki defa

Örnek `/en/about`: `About Us - MOE Kompozit | MOE Kompozit`. `src/seo/helpers.ts:buildSeoTitle` marka ekliyor; locale layout `title.template` yeniden ekliyor. Uzun başlıklarda içerik alanı daralıyor; taramada 29 başlık 70 karakterin üzerinde, bu sayı tek başına hata eşiği sayılmadı.

- [ ] Markayı tek katman eklesin; örnek ve 50 URL tekrar tarandığında yinelenme kalmasın.

### K07 — P2 — Blog/referans liste sayfalarında H1 yok

`/tr/blog`, `/en/blog`, `/tr/references`, `/en/references` sunucu HTML’inde H1 bulunmuyor. Görünen sayfa başlığı semantik ana başlık değil.

- [ ] Her listeye konuya uygun tek ana başlık ekle; alt başlık hiyerarşisini koru.

### K08 — P1 — Ana sayfa formu kullanıcı seçmeden pazarlama rızası gönderiyor

Aktif `HomeContact.tsx:63-64` payload’ında `consent_marketing: true` ve `consent_terms: true` sabit. Formda bunlara ait bir seçim alanı yok. Bu, kullanıcı tercihinin yanlış kaydıdır; bu rapor hukuki uygunluk kararı vermez.

- [ ] Pazarlama tercihi açık kullanıcı seçimine bağlı olsun; seçimsiz durumda true gönderilmesin. Aydınlatma/koşul akışı ayrı tanımlansın. Kontrollü testte kayıt alanları seçimi doğru yansıtsın.

### K09 — P2 — Form etiketlerinin alanlarla programatik bağı eksik

Tarayıcıda ana sayfanın üç alanında, `/en/offer` içindeki 15 alanda ilişkili `label` ve `aria-label` yok. Görünür metin/placeholder bulunması kalıcı erişilebilir etiketin yerini tutmuyor. `HomeContact.tsx` etiketlerinde `htmlFor`, girdilerde eşleşen `id` yok; OfferForm da aynı yönden denetlenmeli.

- [ ] Alanların kalıcı adı programatik olarak bağlansın; etiket tıklaması alanı odaklasın, ekran okuyucu kontrolü geçsin.

### K10 — P2 — İngilizce ana sayfa formunun sonuç mesajları Türkçe

Aktif `HomeContact.tsx` başarı/hata mesajlarını doğrudan Türkçe `alert(...)` ile gösteriyor; component `/en` ana sayfasında da kullanılıyor. Canlı talep gönderilmedi; bulgu aktif kaynak yoluna dayanır.

- [ ] Başarı/hata/pending durumları seçili locale mesajlarından gelsin; iki dilde izole yanıt testinde doğrulansın.

### K11 — P1 — Statik CSS/JS sıkıştırması eksik

Lighthouse yaklaşık **644 KiB** metin sıkıştırma tasarrufu gösteriyor. Bağımsız GET’te `Accept-Encoding: gzip, br` gönderilmesine rağmen 124.200 bayt CSS ve ikinci CSS dosyasında `Content-Encoding` yok. Aynı kontrolde Kühlturm gzip döndürüyor.

- [ ] Statik dosyaları sunan gerçek katmanda sıkıştırma etkinleşsin; CSS/JS yanıtı uygun encoding/Vary ile gelsin. Ölçüm dosyası: `compression.json`.

### K12 — P1 — Mobil ana içerik geç görünüyor

Tek mobil ölçüm **LCP 8,8 sn**, **TBT 510 ms**, main-thread çalışma **5,8 sn**. LCP hero görseli; ölçümde sürenin yaklaşık %71’i render gecikmesi. Kullanılmayan JS tahmini 430 KiB; üçüncü taraf main-thread etkisi yaklaşık 280 ms. Hero isteğinde `fetchpriority=high` yok.

- [ ] Önce sıkıştırma ve ana thread yükünü azalt; hero render/fetch önceliğini ölç. Aynı koşulda tekrar laboratuvar ölçümü yap, sonra gerçek kullanıcı verisiyle izle. Tek optimizasyona kesin hız kazancı atfetme.

### K13 — P2 — Kapalı mobil menü odaklanabilir kontroller bırakıyor

Lighthouse `aria-hidden-focus` başarısız: `header > nav[aria-hidden=true]` içinde kapatma, tema ve dil düğmeleri hâlâ odaklanabilir. Bu menü görünmediğinde de klavye akışını bozabilir.

- [ ] Kapalı menü içerikleri inert/unmounted veya uygun odak yönetimiyle erişim dışı olsun; açıldığında klavye ve odak dönüşü çalışsın.

### K14 — P2 — Görünür marka fallback’leri repo doktrinine uymuyor

`src/seo/helpers.ts` içindeki site adı, title suffix, author, publisher ve Organization adı `MOE Kompozit` sabitleriyle üretiliyor. Workspace’in marka doktrini bu değerleri settings/branding/env’den, son çare nötr kaynaktan ister.

- [ ] Görünür marka tek veri zincirinden gelsin; başka seed/marka kurulumunda eski marka kalmasın. Bu bulgu mevcut MOE adının yanlış olduğunu söylemez, yeniden kullanım kuralındaki eksikliği belirtir.

### K15 — P2 — Denetim kapıları canlı sorunları kapsamıyor; bazıları çalışmıyor

`test:seo` ve `test:media` geçtiği halde K01–K04 canlıda mevcut. `test:theme` altı dosyada raw hex + eksik `surface-dark-link` nedeniyle başarısız. `lint: next lint` gerçek çalıştırmada `Invalid project directory .../frontend/lint` ile bitiyor. `crawl-seo-report.mjs` eski `.next/standalone/karbonkompozit/server.js`, Lighthouse config başka eski standalone yolu kullanıyor; paket copy/start komutunun poly-repo yolu ile tutarsız. Bu son yol uyumsuzluğu statik bulgudur, fresh build/audit:crawl çalıştırılmadı.

- [ ] Lint komutunu mevcut araç zinciriyle çalışır yap; tema kapısını düzelt. Canlı API + sitemap + dil eşleme regresyonları ekle; standalone audit yolu gerçek paket çıktısıyla eşleşsin.

### K16 — P1 — Analitik çerezleri kullanıcı tercihinden önce oluşuyor

Tarayıcıda herhangi bir kabul seçilmeden GTM `GTM-NCVJZX6H`, GA4 `G-S8V8GTJHZV` yükleniyor; `_ga` ve `_ga_S8V8GTJHZV` yazılıyor. İncelenen akışta tercih paneli/consent-state uygulanması görülmedi. GTM’nin gtag yüklemesi **çift sayım kanıtı değildir**.

- [ ] Hedef pazara göre onay/ölçüm tasarımı belirlensin; gerekli tercih davranışı tag ve çerez düzeyinde test edilsin. Hukuki gereklilik değerlendirmesi ayrıca yapılmalıdır.

## Sağlam bulunanlar

- HTTP → HTTPS ve non-www → www **301**; canonical host ile uyumlu.
- 60 sitemap ana URL’si çalışıyor; 68 ana tarama başarısında kendine canonical ve description var.
- Kasıtlı olmayan slug’lar 404; bunlar bozuk gerçek iç link olarak sayılmadı.
- JSON-LD mevcut, llms.txt HTTP 200. Etiketlerin varlığı tüm schema alanlarının semantik doğruluğu anlamına gelmez.
- Mobil örneklerde yatay belge taşması veya yüklenmiş kırık görsel yok.
- Üç uygulamada TypeScript geçti; canlı health başarılı.

## Açık doğrulamalar — hata sayısına dahil değil

1. **Dönüşüm:** İncelenen frontend kaynaklarında başarılı teklif kaydına bağlı `generate_lead`/sendGAEvent yok. GTM iç yapılandırması, sunucu Measurement Protocol ve GA4 raporları bu turda denetlenmedi; “dönüşüm kesin yok” sonucu çıkarılamaz. Gerçek kayıt → tekil event → rapor zinciri kontrol edilmeli.
2. **E-posta/ek dosya/katalog teslimi:** Üretimde kayıt veya mesaj oluşturulmadı. Upload, teklif, SMTP ve alıcıya teslim uçtan uca doğrulanmış sayılmaz.
3. **İddia kanıtları:** Ana sayfadaki 15+ yıl, 500+ parça, AS9100/ISO 9001 ve sayısal malzeme özellikleri için belge/kapsam doğrulaması gerekir; bu tur iddiaların yanlış olduğunu kanıtlamaz.
4. **GSC:** Aynı gün önceki `docs/seo/2026-09-09-gsc/` sonuçları tarihli bağlamdır. URL Inspection/performance API bu tur yeniden çağrılmadı; Google’ın canonical seçimi son HTTP sonucu ile karıştırılmamalı. Önceki nottaki 62 sitemap URL’si bu tur **60** ölçüldü.
5. **Kapsam:** Oturumlu admin iş akışları, penetrasyon testi, tüm görsel/PDF dosyalarının durumu ve gerçek kullanıcı CWV bu raporun tamamlanmış kontrolleri değildir.

## Uygulama sırası

1. K01–K04: sitemap, içerik kimliği/dil eşlemesi ve eski slug kararı.
2. K08, K16 ve dönüşüm doğrulaması: kullanıcı tercihleri ve başarılı talep ölçümü.
3. K11–K13: sıkıştırma, mobil performans, menü odağı.
4. K05–K07, K09–K10, K14–K15: kalan içerik ve kalite kapıları.

**Kapanış koşulu:** Her madde ilgili gerçek URL/akış ile tekrar doğrulansın; bu rapordaki kutucuklar kanıt olmadan tamamlandı sayılmasın.

## Kanıt dosyaları

- [Özet ve URL kümeleri](docs/audit/2026-09-09/summary.json)
- [72 URL ham crawl](docs/audit/2026-09-09/crawl.json), [sitemap](docs/audit/2026-09-09/sitemap.xml), [alternatif kontrolleri](docs/audit/2026-09-09/alternate-checks.json)
- [API/HTTP zincirleri](docs/audit/2026-09-09/endpoint-checks.json), [sıkıştırma](docs/audit/2026-09-09/compression.json)
- [Tarayıcı alanları, ağ ve ölçüm scriptleri](docs/audit/2026-09-09/browser.json), [Lighthouse](docs/audit/2026-09-09/lighthouse-mobile.json)
- [Mobil ana sayfa](docs/audit/2026-09-09/home-mobile.png), [mobil teklif](docs/audit/2026-09-09/offer-mobile.png), [masaüstü](docs/audit/2026-09-09/desktop.png)
- [Runtime](docs/audit/2026-09-09/runtime-summary.json), [TypeScript](docs/audit/2026-09-09/typecheck-summary.json), [lint](docs/audit/2026-09-09/lint.txt), [tema](docs/audit/2026-09-09/theme.txt)

Denetim kanıtlarının raporla birlikte sürümlenebilmesi için `.gitignore` içindeki genel docs kuralına yalnız `docs/audit/2026-09-09/` istisnası eklendi. Commit/push yapılmadı.
