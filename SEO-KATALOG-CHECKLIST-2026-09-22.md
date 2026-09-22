# MOE Kompozit — Tanitio SEO kataloğu bulgu analizi ve düzeltme checklist'i

**Kaynak:** `moe-kompozit-4de92704-seo-katalog.pdf` · Tanitio Site Sağlığı denetimi
`ffe70ecd-50a8-419b-acea-a9acb6a0e112` · 22.09.2026 10:16 UTC · 10 sayfa örneklem ·
1162 kontrol satırı · scoringVersion 3

**Puanlar:** Teknik SEO **60.8/100** · GEO hazırlığı **33.9/100**
**Kontrol dağılımı:** 652 uygun · 148 iyileştirme · 9 sorun · 353 bilgi
**Kapsam güveni:** seoCoverage 0.94 / seoConfidence 0.702 · geoCoverage 1.0 / geoConfidence 0.648

---

## 0. Önce zamanlama: rapor neyin fotoğrafını çekti?

Denetim **10:16 UTC**'de koştu. `SEO-DUZELTMELER-2026-09-22.md` kapsamındaki düzeltmeler bu
ölçümden sonra yayına alındı. Bu yüzden katalogdaki 15 bulgunun **9'u bugün canlıda artık yok.**
Aşağıda canlı site üzerinden yeniden doğrulandı — checklist'e **yalnızca hâlâ açık olanlar** alındı.

### Raporda var, canlıda kapanmış (aksiyon gerekmez, yalnız kayıt)

- [x] **BULGU 3–10 · Başlık uzunluğu (8 sayfa, 62–64 kr)** — canlı ölçüm: TR/EN 9 sayfa **45–57 kr**,
      tamamı 30–60 aralığında. `/tr` 51 · `/tr/products` 52 · `/tr/solutions` 45 · `/tr/references` 56 ·
      `/tr/gallery` 48 · `/tr/blog` 52 · `/tr/about` 57 · `/tr/contact` 50 · `/tr/offer` 49 · `/en` 49.
- [x] **BULGU 15 · 8 sayfada aynı `og:image`** — canlı ölçüm: her sayfa kendi
      `/share-image?title=…&locale=…&page=…` adresini veriyor. Sayfa başına ayrışıyor.
- [x] **K033 · llms.txt bağlantı girişi 0** — canlı ölçüm: **22 mutlak bağlantı** var.
- [x] **FAQPage şeması yok** — `/tr/contact` ve `/tr/offer` canlıda `FAQPage` + `Question`/`Answer`
      yayınlıyor. (Ana sayfa, ürünler ve çözümlerde hâlâ yok → B5.3)

> **Not:** Yeni puan almak için denetimin **tekrar koşturulması** gerekir; PDF kayıtlı sonuçtan
> üretiliyor ve yeniden analiz başlatmıyor. Aşağıdaki A/B işleri bitmeden yeniden ölçüm yapılırsa
> yalnız bu 4 maddelik kazanç görünür (tahmini +2–3 teknik SEO puanı).

---

## A. Yüksek etki — puanın çoğu burada

Ağırlıklı kayıpların dağılımı (SEO skoru, 100 üzerinden):

| Kategori | Puan | Ağırlık | Kayıp | Kanıt |
|---|---|---|---|---|
| contentQuality | 18 | 0.26 | **−21.32** | 10 sayfa |
| authorityTrust | 51.2 | 0.20 | **−9.76** | 10 sayfa |
| internalLinks | 72.2 | 0.06 | −1.67 | 10 sayfa |
| topicalAuthority | 79.2 | 0.08 | −1.66 | 8 sayfa |
| keywordConsistency | 64.9 | 0.04 | −1.40 | 10 sayfa |
| images | 66.7 | 0.03 | −1.00 | 49 görsel |
| coreWebVitals | ölçülmedi | 0.06 | — | CrUX NOT_FOUND |

**Toplam ölçülen kayıp ≈ 36.8 puan; bunun %84'ü ilk iki satırda.** Teknik kategoriler
(technical 100, onPage 100, heading 100, crawlDepth 100) zaten tam puan — teknik tarafta
iyileştirilecek yapısal iş kalmadı, kalan her şey **içerik ve otorite** işidir.

### A1 · İçerik hacmi: 10 sayfanın 7'si "ince içerik" (−21.32 puanın gövdesi)

Denetimin saydığı gövde kelime sayıları (nav/footer hariç):

| Sayfa | Kelime | Durum | Güven sinyali |
|---|---|---|---|
| `/tr` | 1691 | yeterli | 7/11 |
| `/tr/products` | 1692 | yeterli | 6/11 |
| `/tr/solutions` | **115** | ince | 5/11 |
| `/tr/references` | **107** | ince | 6/11 |
| `/tr/gallery` | **67** | ince | 5/11 |
| `/tr/blog` | **47** | ince | 4/11 |
| `/tr/about` | **200** | ince | 5/11 |
| `/tr/contact` | **233** | ince | 6/11 |
| `/tr/offer` | **234** | ince | 6/11 |
| `/en` | 1744 | yeterli | 4/11 |

Hepsi liste/kart sayfası; kartların dışında kendi metni yok. Bu sayfalar hem düşük kelime hem
düşük alıntılanabilirlik üretiyor.

- [ ] **A1.1 `/tr/solutions` + `/en/solutions`** — kart ızgarasının üstüne 250–400 kelimelik
      bölüm: kompozit çözüm seçiminde karar kriterleri (malzeme, yük, ortam, adet, termin).
      Kaynak: `backend/src/db/seed/sql/307_kompozit_solutions.seed.sql` i18n alanları veya
      `kompozit__seo_pages` intro alanı. **Kabul:** gövde ≥ 300 kelime, en az 3 H2.
- [ ] **A1.2 `/tr/references`** — "referans" sayfası şu an 107 kelime ve **hiç görseli yok**
      (images: Adet 0). Sektör bazlı 4–6 iş birliği özeti (sektör, parça, adet, teslim süresi),
      her biri 2–3 cümle + bir görsel. **Kabul:** ≥ 300 kelime, ≥ 4 görsel, her görselde alt metin.
- [ ] **A1.3 `/tr/gallery`** — 67 kelime / 3 galeri girişi. Her galeri girişine 2–3 cümlelik
      üretim açıklaması (proses adı, malzeme, kalıp tipi) ekle. **Kabul:** ≥ 250 kelime.
- [ ] **A1.4 `/tr/blog`** — 47 kelime / 4 yazı. Liste sayfasına konu kümesi tanımı + her yazıya
      1–2 cümle özet (excerpt) bas. `304_kompozit_blog.seed.sql` `excerpt` alanı.
      **Kabul:** ≥ 250 kelime.
- [ ] **A1.5 `/tr/about`** — 200 kelime. Süreç anlatımı: hangi prosesler (el yatırması, RTM,
      pultrüzyon), hangi kapasite, hangi kalite kontrol adımları. **Kabul:** ≥ 500 kelime.
- [ ] **A1.6 `/tr/contact` + `/tr/offer`** — form sayfaları; FAQ bölümü canlıda var ama gövde
      hâlâ 233/234 kelime. Teklif için gereken bilgi listesi ve tipik termin aralıkları görünür
      metin olarak. **Kabul:** ≥ 350 kelime.

> **Sınır:** Bu sayfalar için **uydurma veri yazılmaz.** Kapasite, termin, tolerans gibi rakamlar
> müşteriden alınmadan yazılırsa `SEO-DUZELTMELER-2026-09-22.md`'deki "sahte uzmanlık üretilmedi"
> ilkesi bozulur. Rakam gelene kadar süreç/kriter anlatımı yazılır, sayı boş bırakılır.

### A2 · Birinci-el veri yokluğu (contentQuality'nin tepe faktörü)

Rapor: *"Sayfalarda kendi ölçümüne, verisine veya deneyimine dair kanıt az"* ve
*"Metinde birimli tek bir sayı yok (cm, kg, TL, %, gün…)"* — ana sayfa dahil **10 sayfanın
hepsinde** `specifics: Hayır`.

- [ ] **A2.1 Müşteriden teknik veri seti iste** — ürün başına: ölçü aralığı (mm), ağırlık (kg/m²),
      çalışma sıcaklığı (°C), UV/kimyasal dayanım sınıfı, minimum sipariş adedi, tipik termin (gün).
      Bu, checklist'teki **tek en yüksek getirili** madde: contentQuality 18 → ~60 bandına
      taşınırsa site skoruna **≈ +11 puan**.
- [ ] **A2.2 Ürün detay şablonuna teknik tablo** — veri geldiğinde `products` i18n'e teknik
      özellik tablosu; `Product` + `PropertyValue` şeması ile işaretle.
- [ ] **A2.3 Bir karşılaştırma içeriği** — "CTP vs. karbon fiber: hangi yük/ortamda hangisi"
      tablolu bir blog yazısı. Kendi üretim gözleminizden çıkan bir bulgu içermeli.

### A3 · E-E-A-T güven sinyalleri (−9.76)

Denetim 11 sinyal arıyor. 10 sayfada **hiçbirinde bulunamayan** üç sinyal:

| Sinyal | Ağırlık | Durum | Aksiyon |
|---|---|---|---|
| `reviews` — müşteri yorumu / sosyal kanıt | 12 | **10/10 sayfada yok** | A3.1 |
| `specifics` — birimli somut rakam | 8 | **10/10 sayfada yok** | A2.1 |
| `faq` — SSS bölümü | 8 | ana sayfa/ürün/çözümde yok | B5.3 |
| `date` — tarih / güncellik | 6 | ana sayfada yok | A3.2 |
| `author` — yazar / uzman adı | 8 | 8 sayfada yok | A3.3 |

- [ ] **A3.1 İzinli müşteri referansı** — yazılı izinli 3–5 kurumsal referans (firma adı veya
      "X sektöründe kamu kurumu" gibi anonim form + iş tanımı). **Kendi işletmeniz hakkındaki
      yorumlara `Review`/`AggregateRating` şeması eklemeyin** — raporun kendi uyarısı; Google
      uygunluk kuralına takılır.
- [ ] **A3.2 Güncelleme tarihi** — kurumsal sayfaların altına "Son güncelleme: …" + `<time datetime>`.
      Zaten mevcut `updated_at` alanından türetilebilir; uydurma tarih basılmaz.
- [ ] **A3.3 Yayıncı adı** — blog dışındaki kurumsal sayfalarda da "MOE Kompozit teknik ekibi" +
      Hakkımızda bağlantısı. Blog detayında bu bugün düzeltildi; şablonu diğer sayfalara taşı.
- [ ] **A3.4 Belge/sertifika görünürlüğü** — varsa ISO/TSE/malzeme sertifikası kapsamını
      metin olarak yaz (belge numarası değil, kapsam). Yoksa bu madde **kapatılır, uydurulmaz**.

---

## B. Orta etki — GEO hazırlığı ve teknik borç

GEO bileşenleri (33.9/100):

| Bileşen | Puan | Ağırlık | Güven |
|---|---|---|---|
| citability | **11.3** | 0.25 | Orta |
| brand | **0** | 0.20 | Düşük |
| eeat | 50 | 0.20 | Orta |
| technical | 60.8 | 0.15 | Yüksek |
| schema | 100 | 0.10 | Yüksek |
| platform | **20** | 0.10 | Düşük |

### B1 · Alıntılanabilirlik (citability 11.3/100 — GEO'nun en ağır kalemi)

Sayfa başına `optimalBlocks: 0`. Yani hiçbir sayfada AI'nın tek parça hâlinde alıntılayabileceği
bağımsız blok yok. Sayfa bazlı citability: `/en` 20 · `/tr` 15 · `/tr/products` 14 ·
`/tr/contact` 13 · diğer 6 sayfa **8**.

- [ ] **B1.1 Soru-cevap bloğu kalıbı** — her ana sayfada 3–5 adet: **H2/H3 soru başlığı →
      hemen altında 40–80 kelimelik, bağlamdan bağımsız okunabilen tek paragraf cevap.**
      "Yukarıda belirtildiği gibi" tarzı geri referans kullanılmaz.
- [ ] **B1.2 Tanım cümleleri** — "CTP nedir?", "Pultrüzyon nedir?" gibi kavramların **ilk
      cümlesi tam tanım** olsun. AI alıntısının aldığı birim budur.
- [ ] **B1.3 Liste ve tablo** — süreç adımları ve malzeme karşılaştırmaları düz paragraf değil
      `<ol>`/`<table>` olarak. Yapılı blok, alıntılanabilirliğin doğrudan ölçütü.
- [ ] **B1.4 `speakable` kapsamını genişlet** — `SpeakableSpecification` şemada var; B1.1'de
      eklenen cevap bloklarını kapsayacak şekilde CSS seçicilerini güncelle.
      Dosya: `frontend/src/seo/jsonld.ts`.

### B2 · Marka varlığı (brand 0/100, platform 20/100, sameAs 1 platform)

Canlı doğrulama: `"sameAs":["https://www.instagram.com/moe_kompozit…"]` — tek profil.
Rapor 5+ platform öneriyor; `verifiedProfiles: Kayıt yok`.

- [ ] **B2.1 LinkedIn şirket sayfası** — B2B kompozit üreticisi için en yüksek getirili kanal.
      Kurulup `sameAs`'a eklenmeli.
- [ ] **B2.2 Google Business Profile** — `LocalBusiness` şeması zaten yayında (Ankara/Türkiye),
      ama doğrulanmış GBP kaydı yok. NAP tutarlılığı ile birlikte aç.
- [ ] **B2.3 YouTube / sektörel dizin** — üretim videosu varsa YouTube; yoksa en az 2 sektörel
      B2B dizin kaydı (ör. sanayi rehberleri).
- [ ] **B2.4 `sameAs`'ı veriden besle** — profiller kodda değil panelde tutulmalı.
      Kaynak hazır: `backend/src/db/seed/sql/320_kompozit_social_channels.sql` +
      `321_kompozit_marketing_integrations.seed.sql` (facebook/instagram/linkedin/youtube/x
      alanları mevcut, hepsi boş). **Marka kuralı gereği kod tarafında sabit URL yazılmaz.**
      **Kabul:** `sameAs` ≥ 4 platform, hepsi panelden geliyor.

### B3 · İç link dağılımı (−1.67) ve konusal otorite (−1.66)

Gövde iç link sayıları: `/tr` 21 · `/tr/products` 20 · `/tr/references` 6 · `/tr/solutions` 5 ·
`/tr/blog` 4 · `/tr/gallery` 3 · `/tr/about` 1 · **`/tr/contact` 0 · `/tr/offer` 0**.
Ayrıca `/tr/references` sayfasının 6 bağlantısının tamamı **kendisine** gidiyor.

- [ ] **B3.1 `/tr/contact` ve `/tr/offer`'a gövde içi bağlantı** — teklif akışından ürün/çözüm
      sayfalarına ("hangi ürün grubundan teklif istiyorsunuz" bloğu). Şu an bu iki sayfa
      iç link grafiğinde **çıkışsız düğüm**.
- [ ] **B3.2 `/tr/references` bağlantılarını düzelt** — referans kartları ilgili ürün/çözüm
      sayfalarına link vermeli, kendine değil.
- [ ] **B3.3 `/tr/about`'a çapraz bağlantı** — tek bağlantısı var (`/contact`). Çözümler,
      galeri ve blog'a açıklamalı bağlantı ekle.
- [ ] **B3.4 Konu kümesi derinliği** — rapor "bir konuda en az üç sayfa kapsam derinliği sayılır"
      diyor; sitemap'teki 50 URL'nin bir kısmı dağınık tek sayfa. `solutions/` altında 4 sayfa var,
      `blog/` altında 4 var — **kompozit malzeme seçimi** ve **üretim prosesleri** temalarında
      üçer sayfalık kümeler tamamlanmalı. *Sırf puan için içi boş sayfa açılmaz.*

### B4 · Başlık terimi tutarlılığı (−1.4)

Sayfa bazlı tutarlılık skoru: `/tr/products` 93.8 · `/tr` 87.5 · `/en` 91.7 · `/tr/gallery` 75 ·
`/tr/solutions` 66.7 · `/tr/about` 66.7 · `/tr/contact` 58.3 · **`/tr/offer` 42.9 ·
`/tr/references` 33.3 · `/tr/blog` 33.3**. Ham sayfa skorları 28–55/100 bandında.

Başlıkta geçip gövdede karşılığı olmayan kavramlar raporda adıyla listeli — ana sayfa için:
*üretiminde, sunan, markasıdır, iletişim, kurumsal, çözümleri, teknolojilerinde*.

- [ ] **B4.1 `/tr/references`** — başlıktaki "iş birliği" ve "teslim disiplini" kavramları
      gövdede geçmiyor. A1.2 ile birlikte çözülür.
- [ ] **B4.2 `/tr/blog`** — başlıktaki "mühendislik", "üretim", "notları" gövdede yok. A1.4 ile çözülür.
- [ ] **B4.3 `/tr/offer`** — "uygunluk" kavramı gövdede yok. A1.6 ile çözülür.
- [ ] **B4.4 Yeni başlık yazarken kontrol** — başlığa giren her kavram için gövdede en az bir
      cümle veya alt başlık olmalı. `check-seo-inventory.mjs`'ye bu kontrol eklenebilir.

### B5 · Teknik hızlı kazanımlar (düşük efor, bugün kapanabilir)

- [x] **B5.1 HSTS başlığı yok** — UYGULANDI (bkz. Bölüm F). — canlı doğrulandı: `strict-transport-security` yanıtta **yok**.
      Mevcut başlıklar: `x-content-type-options`, `x-frame-options`, `referrer-policy`,
      `content-security-policy: frame-ancestors`.
      Dosya: [frontend/next.config.ts:59-70](frontend/next.config.ts#L59-L70) — üretimde
      `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` ekle.
      **Uyarı:** `includeSubDomains` tüm alt alan adlarını HTTPS'e kilitler; HTTP üzerinden
      çalışan alt alan adı var mı önce doğrula.
- [ ] **B5.2 DMARC kaydı yok** — canlı doğrulandı: `_dmarc.karbonkompozit.com.tr` **boş**.
      SPF var (`v=spf1 a mx ip4:77.245.159.230 ~all`), DKIM ayrı doğrulanmalı.
      E-posta güvenlik skoru **35/100** ve katalogdaki 9 "Sorun" satırından biri.
      Başlangıç: `v=DMARC1; p=none; rua=mailto:dmarc@karbonkompozit.com.tr` → izleme sonrası
      `p=quarantine`. **DNS değişikliği; e-posta teslimatını etkiler, kademeli uygulanır.**
- [ ] **B5.3 FAQPage'i ana sayfa / ürün / çözüm sayfalarına yay** — altyapı hazır
      (`frontend/src/seo/jsonld.ts`, `327_kompozit_support_faqs.sql`), `/tr/contact` ve
      `/tr/offer` canlıda yayınlıyor. Aynı bileşeni ana sayfa ve ürün detaylarına bağla.
      Hem `faq` güven sinyalini hem B1 alıntılanabilirliğini çözer.
      **Kural:** görünür cevap ile şemadaki cevap **aynı metin** olmalı.
- [ ] **B5.4 Açık e-posta adresi (3 sayfada, toplam 9 örnek)** — canlı doğrulandı:
      `mailto:info@karbonkompozit.com.tr` düz metin. Spam botları topluyor.
      İletişim formunu birincil yap; mailto'yu JS ile birleştir veya `info [at]` yazımı kullan.
      *Erişilebilirlik ve dönüşüm açısından tamamen kaldırmak önerilmez.*
- [x] **B5.5 Kullanılmayan preconnect/hint origin** — UYGULANDI (bkz. Bölüm F). — `https://res.cloudinary.com` için hint var
      ama o origin'den kaynak yüklenmiyor. Ya kaldır ya gerçekten kullan.
- [x] **B5.6 Boş `#` bağlantısı (1 adet)** — UYGULANDI (bkz. Bölüm F). — hedefi sayfada bulunmayan anchor. Bul ve gerçek
      hedefe bağla veya `<button>`'a çevir.
- [x] **B5.7 Heading seviye atlaması (5 sayfada)** — UYGULANDI (bkz. Bölüm F). — H2'den H4'e atlayan yapılar.
      Denetimdeki `heading` kategorisi 100 puan alsa da tekil sayfalarda atlama raporlanmış.
- [x] **B5.8 Dekoratif işareti olmayan boş ALT (5 görsel)** — UYGULANDI (bkz. Bölüm F). — boş `alt` doğru olabilir ama
      dekoratifse `aria-hidden="true"` de eklenmeli.

### B6 · Görsel boyutları ve JS yükü (CLS riski, coreWebVitals ölçülemedi)

Canlı doğrulama: ana sayfada **30 `<img>`, `width`/`height` verilen 0**. Rapor sayfa başına
17–30 arası "ölçü bilgisi eksik" sayıyor; toplam 49 görsel kanıtı var.

- [x] **B6.1 Next `<Image>` kullanımını gözden geçir** — Codex tarafından çözüldü; canlıda 30/30 görselde `width`/`height` var. — `SEO-DUZELTMELER-2026-09-22.md`
      haklı olarak "`fill` ve CSS ile boyutlandırılmış alanlar" diyor ve **rastgele boyut
      yazılmadığını** not ediyor. Doğru çözüm rastgele sayı değil:
      `fill` kullanılan kapsayıcılara `aspect-ratio` CSS'i verilmesi. Bu CLS'i gerçekten
      düşürür ve denetimin aradığı sinyali de üretir.
      **Kabul:** her `fill` görselinin kapsayıcısında `aspect-ratio` tanımlı.
- [ ] **B6.2 JS dosya sayısı 16–17** — rapor eşiği 15. `optimizePackageImports` zaten var;
      `lucide-react`, `sonner`, `@tanstack/react-query` dışındaki ağır importları da kapsama al.
      **Kabul:** ana sayfada `<script src>` ≤ 15.
- [ ] **B6.3 Inline style attribute yoğunluğu** — sayfa başına 24–84 inline `style` attribute
      (`<style>` bloğu 0, bu iyi). Tailwind v4 sınıflarına taşınabilenler taşınsın.
- [ ] **B6.4 Tekrar eden bağlantı 43–58/sayfa** — nav + footer + gövde tekrarı. Footer'daki
      ürün listesi kısaltılabilir; iç link ağırlığı dağılımı düzelir.

### B7 · llms.txt kalitesi (yapı geçti, içerik zayıf)

Canlı: 22 mutlak bağlantı var (rapordaki 0 düzeldi) **ama**:

- [x] **B7.1 Açıklamalı giriş 0/22** — UYGULANDI (bkz. Bölüm F). — her bağlantı `- [Ad](url)` formatında, açıklama yok.
      Doğrusu: `- [Ürünler](url): Karbon fiber, CTP ve cam elyaf ürün grupları.`
      Dosya: `frontend/src/app/llms.txt/route.ts`.
- [x] **B7.2 Bağlantı adları ham rota adı** — UYGULANDI (bkz. Bölüm F). — `products (tr)`, `solutions (tr)`, `gallery (tr)`
      gibi İngilizce rota adları TR bölümünde görünüyor. Sayfanın gerçek başlığı kullanılmalı.
- [x] **B7.3 Mükerrer başlık bloğu** — UYGULANDI (bkz. Bölüm F). — dosyada `Site:` ve `Sitemap:` satırları **iki kez**
      geçiyor (panel metni + otomatik ek). Statik metin ile üretilen bölüm birleştirilirken
      tekrar eden alanlar ayıklanmalı.
- [x] **B7.4 "Key facts / hakkında" bölümü yok** — UYGULANDI (bkz. Bölüm F). — denetimin aradığı bölüm. Kuruluş, kapasite,
      proses listesi, hizmet bölgesi. A2.1 verisi geldiğinde doldurulur.

---

## C. Ölçülemeyen / bu turda kapatılamayacak olanlar

Bunlar **eksik değil, ölçüm sınırı.** Checklist'e iş olarak yazılmaz, kayda geçer:

- **CrUX gerçek kullanıcı hızı: `NOT_FOUND`** (ağırlık 0.06). Sitenin trafiği CrUX eşiğinin
  altında. Kod ile üretilemez; trafik artınca gelir. B6 maddeleri bu skor geldiğinde işe yarar.
- **İzleme kodu tespit edilmedi** — bu bir hata **değil**: GA yalnız consent sonrası yükleniyor,
  denetim botu onay vermediği için görmüyor. Doğru davranış. `322_kompozit_google_tracking.seed.sql`
  yapılandırması ayrı doğrulanmalı (bkz. `SEO-DUZELTMELER-2026-09-22.md` GA4 açık maddesi).
- **RDAP kaydı ölçülemedi** — `.tr` uzantısı RDAP sunmuyor. Aksiyon yok.
- **Backlink profili** — bu denetimin kapsamında değil; ücretli sağlayıcı çağrısı yapılmadı.
- **Google indeks durumu ve gerçek AI yanıtlarında görünürlük** — raporun kendi ifadesiyle
  *"bu puanlarla kanıtlanamaz"*. GEO 33.9 puanı **teknik hazırlığı** gösterir, AI'da görünme
  oranını değil.
- **10 sayfalık örneklem** — sitemap'te 50 URL var. Ürün detay sayfalarının (`/tr/products/*`)
  hiçbiri örnekleme girmedi; onların içerik durumu bu raporla bilinmiyor.

---

## D. Öncelik sırası (getiri / efor)

| # | İş | Getiri | Efor | Bağımlılık |
|---|---|---|---|---|
| 1 | B5.1 HSTS + B5.2 DMARC | Teknik skor + 9 "Sorun"dan 1'i | Saatler | DNS erişimi |
| 2 | B5.3 FAQ yayılımı + B1.1 cevap blokları | GEO citability 11→~40 | 1–2 gün | Soru listesi |
| 3 | A1.1–A1.6 ince içerik | SEO ≈ +8–11 puan | 3–5 gün | Metin üretimi |
| 4 | B2.1–B2.4 marka profilleri | GEO brand 0→~50 (+10 GEO) | 1 gün + onay | Müşteri kararı |
| 5 | A2.1 teknik veri seti | contentQuality'nin tepesi | Müşteriye bağlı | **Blokaj** |
| 6 | B3.1–B3.3 iç link | −1.67 kapanır | Yarım gün | — |
| 7 | B6.1 aspect-ratio + B6.2 JS | CLS + 1 puan | 1 gün | — |
| 8 | B7.1–B7.4 llms.txt | GEO teknik | 2 saat | — |
| 9 | A3.1 müşteri referansı | E-E-A-T 12 puanlık sinyal | Müşteriye bağlı | **İzin gerekli** |

**Tek blokaj noktası:** A2.1 ve A3.1 müşteriden gerçek veri/izin gerektiriyor. Bunlar olmadan
contentQuality 18 → ~45 bandının üstüne çıkmaz. 1, 2, 6, 7, 8 numaralı işler bugün bağımsız
ilerletilebilir.

---

## E. Doğrulama

Düzeltmeler sonrası:

```bash
# Kod tarafı (frontend/ içinden)
bun run build && bunx tsc --noEmit
node scripts/check-seo-inventory.mjs     # 32 detay URL · API/sitemap/HTML locale regresyonu
node scripts/check-media-seo.mjs
python3 scripts/verify-seo-audit.py      # başlık · og görseli · boyut/alt · gövde bağlantıları

# Canlı doğrulama
curl -sI https://www.karbonkompozit.com.tr/tr | grep -i strict-transport   # B5.1
dig +short TXT _dmarc.karbonkompozit.com.tr                                 # B5.2
curl -s https://www.karbonkompozit.com.tr/llms.txt | grep -c '^- \['        # B7
curl -s https://www.karbonkompozit.com.tr/tr | grep -oP '"sameAs":\[[^]]*\]' # B2
```

**Puanın yeniden ölçülmesi:** Tanitio'da yeni detaylı denetim açılmalı (20 puan). PDF indirme
kayıtlı sonuçtan üretiliyor ve yeniden analiz başlatmıyor — mevcut PDF'i tekrar indirmek
yeni puan getirmez.


---

## F. 22.09.2026 — uygulanan düzeltmeler (bu tur)

Hepsi üretim derlemesi çıktısında ve yerel standalone sunucuda doğrulandı. **Henüz deploy edilmedi**
— gerekçe aşağıda.

### F.1 · HSTS (B5.1)

[frontend/next.config.ts:59-75](frontend/next.config.ts#L59-L75) — üretimde
`Strict-Transport-Security: max-age=31536000`.

`includeSubDomains` ve `preload` **bilerek eklenmedi:** `mail.karbonkompozit.com.tr` yalnız HTTP
sunuyor (HTTPS bağlantı kurulmuyor, HTTP 200 dönüyor). Kapsama alınsaydı ana siteyi ziyaret etmiş
her tarayıcı webmail'i açmayı reddederdi. Denetimin aradığı sinyal bu hâliyle de karşılanıyor.
Webmail HTTPS'e taşınırsa iki bayrak da eklenebilir.

### F.2 · llms.txt kalitesi (B7.1–B7.4)

[frontend/src/app/llms.txt/route.ts](frontend/src/app/llms.txt/route.ts) baştan yazıldı,
[frontend/src/seo/page-settings.ts](frontend/src/seo/page-settings.ts) içine `fetchAllPageSeo()`
eklendi.

- 22 bağlantının **tamamı artık açıklamalı**: `- [Gerçek sayfa başlığı](url): açıklama`.
- Etiketler ham rota adı (`products (tr)`) değil, `seo_pages` ayarındaki **gerçek başlık**.
  Panelden yönetiliyor — marka kuralına uygun, kodda sabit metin yok.
- Mükerrer `Site:` / `Sitemap:` satırları ayıklanıyor; panel metni apex, route www yazıyordu.
  Kanonik www sürümü tek kez basılıyor.
- `## Key facts` bölümü eklendi — içeriği `seo_pages.home` açıklamasından okunuyor, uydurma veri yok.
- Ek istek maliyeti yok: locale başına tek ayar çağrısı, `Promise.all` ile paralel.

### F.3 · Heading hiyerarşisi (B5.7)

İki ayrı kök neden vardı:

1. **Mega menü başlıkları H1'in üstündeydi.** `DesktopMegaMenu` menü etiketlerini `<h2>`/`<h3>`
   olarak basıyordu; her sayfada **H1'den önce 7 başlık** vardı. Bunlar gezinme etiketi, belge
   bölümü değil — `<p className={styles.title}>` oldu, CSS seçicileri buna göre güncellendi.
2. **Liste sayfalarında H1 → H3 atlaması.** `ListingCard` ve `MediaOverlayCard` kart başlığını
   sabit `h3` basıyordu. `headingLevel` prop'u eklendi (varsayılan `h3`); kartların sayfanın
   birinci seviye içeriği olduğu products / solutions / blog / gallery sayfaları `h2` geçiyor.
   Ana sayfa ve references değişmedi — onlarda kartların üstünde zaten bir `h2` var.

Derleme çıktısı: `/tr` → `h1 h2 h3 h4 …` · `/tr/solutions` → `h1 h2 h2 … h3` ·
`/tr/products` → `h1 h2 … h3` · `/tr/contact` → `h1 h2 h3 …`. Hiçbirinde atlama yok.

### F.4 · Ölü preconnect (B5.5)

[frontend/src/app/\[locale\]/layout.tsx](frontend/src/app/[locale]/layout.tsx) — `res.cloudinary.com`
preconnect'i kaldırıldı. Canlı HTML'de tek bir cloudinary kaynağı yok; bütün görseller
`/uploads`, `/media` ve `/_next/image` üzerinden aynı origin'den geliyor. `next.config.ts`
içindeki `remotePatterns` kaydı korundu (panelden cloudinary URL'si girilebilir).

### F.5 · Hedefsiz bağlantı (B5.6)

[frontend/src/components/layout/Header.tsx](frontend/src/components/layout/Header.tsx) — mobil
menüde kendi sayfası olmayan grup başlığı (`url === '#'`) `<Link href="#">` olarak basılıyordu.
Artık `<p>` olarak basılıyor. Masaüstü mega menü bu durumu zaten `<button>` ile çözüyordu.

### F.6 · Dekoratif görsel işareti (B5.8)

`DesktopMegaMenu` kategori kartlarındaki 5 küçük görsel `alt=""` ile basılıyordu.
`aria-hidden="true"` eklendi. Alt metin **yazılmadı**, çünkü kartın erişilebilir adı zaten bağlantı
metninden geliyor; alt eklenseydi ekran okuyucu aynı etiketi iki kez okurdu.

### F.7 · Uygulanmayanlar ve gerekçeleri

- **B5.2 DMARC** — DNS değişikliği, e-posta teslimatını etkiler. `p=none` ile başlatılıp rapor
  toplandıktan sonra sıkılaştırılmalı. Kod değişikliği değil; ayrı ele alınacak.
- **B5.4 Açık e-posta adresi** — **bilerek yapılmadı.** B2B üretici sitesinde doğrudan e-posta
  adresi dönüşüm aracıdır; JS ile gizlemek JS'siz kullanıcıyı ve ekran okuyucuyu cezalandırır,
  modern toplayıcıları ise durdurmaz. Adres zaten `LocalBusiness` şemasında ve MX kaydında açık.
  Doğru karşılık spam filtresi, gizleme değil. Kullanıcı aksini isterse uygulanır.
- **B6.2 JS dosya sayısı (17)** — ölçüm gerektiriyor; hangi chunk'ın bölünebileceği bundle
  analizi olmadan tahminle değiştirilmemeli. Ayrı tur.
- **A1–A3 içerik ve E-E-A-T** — Codex'in `PageGuide` bileşeni bunların önemli kısmını kapatmış
  (bkz. F.8). Kalanı müşteri verisine bağlı, kod işi değil.

### F.8 · Bu tur dışında kapanan (Codex, 12:46 deploy'u)

Analiz sırasında canlı çıktı değişti; sebebi eşzamanlı bir deploy'du. Kapsamı:

- `PageGuide` bileşeni 9 sayfaya eklendi → **A1 ince içerik**, **B1.1 soru-cevap blokları**,
  **B5.3 FAQPage yayılımı**, **A3.2 `<time>` güncelleme tarihi**, **A3.3 yayıncı adı** ve
  **B3.1–B3.3 gövde içi iç bağlantılar** büyük ölçüde karşılanıyor.
  Canlı kelime sayıları: solutions 115 → 551 · references 107 → 455 · gallery 67 → 498 ·
  blog 47 → 565 · about 200 → 666 · contact 233 → 668 · offer 234 → 707.
- `MeasuredImage` + `media-dimensions.json` → **B6.1** çözüldü, 30/30 görselde `width`/`height`.
- **Ana sayfa istisna:** `/tr` canlıda hâlâ `PageGuide` içermiyor (`x-nextjs-cache: HIT`,
  `stale-while-revalidate` ~1 yıl). Kodda var, bu turun derlemesinde de var — bir sonraki
  deploy ile düzelecek.

### F.9 · Doğrulama kaydı

```
bun run build                       ✓ geçti
bunx tsc --noEmit                   ✓ temiz
node scripts/check-seo-inventory.mjs ✓ 32 yayımlanmış detay URL'si
node scripts/check-media-seo.mjs     ✓ geçti
python3 scripts/verify-seo-audit.py https://www.karbonkompozit.com.tr  ✓ passed: true, llms_links: 22
```

Yerel standalone sunucu (`:3199`) üzerinde ayrıca doğrulandı: HSTS başlığı yanıtta var,
llms.txt TR/EN 22 açıklamalı giriş + Key facts bölümü, derlenmiş HTML'de 0 boş anchor,
0 preconnect, 0 işaretsiz boş alt.

**Deploy yapılmadı.** 12:46'da başka bir deploy canlıyı yeniden başlattı; aynı çalışma saatinde
ikinci bir prod restart üst üste binmesin diye bekletiliyor. Onay verilirse deploy edilir.

---

*Bu belge katalogdaki ölçülmüş verilerden türetildi; canlı doğrulama sütunları 22.09.2026
öğleden sonra `curl`/`dig` ile yerinde ölçüldü. Raporda olmayan hiçbir bulgu eklenmedi;
raporda olup canlıda kapanmış olanlar bölüm 0'da işaretlendi.*

## 22 Eylül — içerik ve gerçek görsel boyutu devam turu

Bu bölüm, üstteki ilk katalog ölçümünü silmeden devam turunun kapsamını kaydeder. Kullanıcının yeni çıktısında iç bağlantı puanı **100**, bulgu sayısı **5**, SEO **62.6**, GEO **34.2**. Bu tur için yeniden puan ölçülmedi.

- [x] **B3.1 / B3.3:** iletişim, teklif ve hakkımızda dâhil rehberlerden ürün/çözüm/galeri/teklif sayfalarına gövde bağlantıları.
- [x] **B3.2'nin görülen nedeni:** API boşken referans gibi gösterilen ve yanlış alan adı nedeniyle kendine bağlanan temsili kartlar kaldırıldı. Gerçek müşteriler eklenmiş sayılmaz.
- [x] **B1.1:** dokuz sayfa türünde TR/EN bağımsız soru-cevap blokları; cevaplar en az 40 kelime ve şemayla aynı kaynakta.
- [x] **B5.3 ana sayfa ve listeler:** FAQPage eklenip görünür metinle birebir denetlendi. İletişim/teklifte mevcut FAQ grafiği korunuyor. Detay sayfalarındaki eski FAQ kapsamı bu işaretle genişletilmiş sayılmaz.
- [x] **B6.1 ölçülen görseller:** örneklemdeki 24 dosyanın gerçek piksel boyutları okundu; 18 sayfada eksik HTML width/height kalmadı. Rastgele boyut yerine ölçülmüş veri kullanıldı; mevcut crop alanları korundu.
- [x] **Ek mobil düzeltme:** kontrol edilen sekiz rotada 320 px'de yatay taşma yok.
- [ ] **A1 / B4:** bağlama uygun rehberler ve blogdaki gerçek özetler eklendi; kelime sayısı eşikleri bütünüyle tamamlandı sayılmaz.
- [ ] **A2 / A3:** müşteri onaylı birinci el ölçüm, teknik belge ve vaka ihtiyacı devam ediyor. Yayıncı adı ve yalnız yeni rehberlerin gerçek güncelleme tarihi eklendi; uzman/yazar, kapasite ve referans uydurulmadı.

Detay: [İkinci tur raporu](SEO-IYILESTIRME-DEVAM-2026-09-22.md). Aynı çalışma klasöründeki başka düzenlemelerin (ör. HSTS, menü başlıkları, reklam ölçümü) sahipliği bu içerik turuna yazılmadı.
