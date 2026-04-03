# MOE Kompozit — Premium İçerik ve Mimari Genişleme Planı

> **Amaç:** Tüm vitrin içeriğinin backend ve veritabanından dinamik yönetimi; karbon fiber, cam elyaf ve CTP kompozit imalatında (saksı, tabut, depo tankı, müşteriye özel B2B projeler) Türkiye’de öncü ve ihracata açık bir marka dilini premium seviyede yansıtmak.  
> **Tarih:** 2026-04-03  
> **İlgili dosyalar:** `antigravity_plan.md` (UI premium), `frontend/IMPLEMENTATION_PLAN.md` (teknik SEO), `frontend/project.portfolio.json`

---

## 1. Mevcut durum (repo özeti)

| Katman | Durum |
|--------|--------|
| **Backend** | Fastify + Drizzle; `products` (`item_type` ile `kompozit`), `categories` / `subcategories`, `custom_pages` (modül anahtarı ile blog ve serbest sayfalar), `galleries`, `references`, `site_settings` (key/locale/value), menü, footer, teklif/iletişim. |
| **Frontend** | Next.js 16; ana sayfa ürün/galeri/blog verisini `API_BASE_URL` üzerinden çeker; `content-fallbacks` yedekleri var; kısmen statik çeviri (`next-intl`). |
| **Admin** | İçerik ve katalog yönetimi için mevcut panel. |
| **UI hedefi** | Kök dizindeki `antigravity_plan.md` premium endüstriyel / glassmorphism yönünü tanımlar. |

**Boşluk:** “Premium kurumsal anlatı” (vizyon, üretim gücü, B2B süreç, sektör çözümleri, ihracat, kalite) büyük ölçüde sabit metin veya genel çeviride; tamamı DB’den yönetilen, genişleyebilir bir **içerik mimarisi** ve **sayfa şablonları** henüz tek dokümanda netleştirilmemiş.

---

## 2. Marka ve içerik stratejisi (özet)

### 2.1 Konumlandırma

- **Ne yapıyoruz:** Karbon fiber, cam elyaf, CTP / FRP kompozit imalatı; proje bazlı ve seri üretim.
- **Örnek ürün hatları:** Saksı ve peyzaj ürünleri, tabut, depo / tank çözümleri — liste müşteri ve proje portföyüyle büyür.
- **B2B odak:** Firmaya özel ölçü, kalınlık, reçine sistemi, kalıp ve sertifikasyon gereksinimleri; teklif ve mühendislik diyaloğu.
- **Coğrafya:** Türkiye’de sektöre yön veren oyuncu iddiası; içerik ve SEO/GEO ile yurtdışı (EN ve gerektiğinde DE) görünürlük.

### 2.2 İçerik sütunları (E-E-A-T + B2B güven)

1. **Üretim ve mühendislik otoritesi** — Malzeme bilgisi, kalıp, post-kür, test, kalite kontrol (genel ticari sırlar dışında).
2. **Uygulama alanları** — Peyzaj, defin hizmetleri, kimyasal/su depolama, endüstriyel özel parça vb. (kategori ve özel sayfalarla).
3. **Güven ve uyum** — Standartlar, süreç sertifikasyonu (varsa), referanslar (`references` modülü).
4. **Projeler ve galeri** — Gerçek işler; alt metin ve başlıklar SEO uyumlu.
5. **Düşünce liderliği** — Blog (`custom_pages` + `kompozit_blog`): kompozit trendleri, sürdürülebilirlik, ihracat lojistiği gibi konular.

---

## 3. Bilgi mimarisi (tam dinamik hedef)

### 3.1 Zaten DB ile uyumlu olanlar

- **Ürün kataloğu:** Kategori / alt kategori + ürün detay; `item_type=kompozit` ile marka ayrımı.
- **Galeri:** Modül anahtarı (`kompozit`) ile koleksiyonlar.
- **Blog / düz metin sayfalar:** `custom_pages` + `module_key` (ör. `kompozit_blog`, yasal sayfalar).
- **Global metinler ve ayarlar:** `site_settings` (locale bazlı).
- **Referanslar:** Logo / proje referansları.

### 3.2 Önerilen genişleme (mimari kararlar — uygulama öncesi onay)

| İhtiyaç | Tercih edilen yaklaşım | Not |
|---------|------------------------|-----|
| Ana sayfa hero, metrikler, “neden biz” maddeleri | **A)** `site_settings` içinde JSON blokları (locale bazlı) veya **B)** tek `custom_pages` kaydı + slug `home-blocks` | Admin’de tek yerden düzen; frontend parçalayıcı bileşenler. |
| “Uygulama alanları” / çözüm sayfaları | `custom_pages` + sabit slug sözleşmesi veya yeni `module_key` (ör. `kompozit_solutions`) | URL ve menü admin’den. |
| B2B / ihracat odaklı açılış sayfası | `custom_pages` + şablon alanı (varsa `template` veya içerikte convention) | Tek sayfa veya locale kopyaları. |
| Ürün etiketleri (ör. “kimyasal dayanım”, “dış mekan”) | Ürün JSON alanı, alt kategori veya ileride `tags` tablosu | Önce mevcut şema ile yetin; trafik büyüyünce normalizasyon. |
| Çok dil (ihracat) | `tr`, `en`; gereksinim halinde `de` | `site_settings` ve tüm locale kolonları senkron. |

**Karar kaydı (2026-04-03):** Ana sayfa vitrin blokları için **A — `site_settings`** seçildi: `GET /site_settings?prefix=kompozit_home_&locale=…` ile toplu veya anahtar başına okuma; admin tarafında mevcut site ayarı formları yeterli. Anahtar ve JSON şekilleri: `docs/SITE_SETTINGS_KEYS_CONTRACT.md`.

**İlke:** Yeni tablo açmadan önce `custom_pages` + `site_settings` ile kaçınılmaz kompleksiteyi ölçün; tekrarlayan yapılar için backend’de ince genişletme (ör. sayfa tipi enum’u) değerlendirilir.

---

## 4. Teknik mimari genişleme (katmanlar)

### 4.1 Backend

- Mevcut REST sözleşmelerini koruyarak yeni **okuma endpoint’leri** veya **filtreler** (ör. çözüm sayfaları listesi) ihtiyaç halinde.
- `site_settings` için tip güvenli anahtar listesi (dokümanda “Setting Keys Contract”) — bozulmayı önler.
- Önbellek: liste endpoint’leri için mevcut `revalidate` stratejisi ile uyumlu TTL.

### 4.2 Admin panel

- Yeni içerik tipleri için formlar: hero blokları, çözüm sayfaları, referans-galeri ilişkisi (isteğe bağlı).
- Medya: `storage` ile kapak ve galeri tutarlılığı; alt metin zorunluluğu (SEO).

### 4.3 Frontend (Next.js)

- **Sunucu bileşenleri:** Veriyi `fetch` + `revalidate` ile çek; blok bazlı layout (hero, metrics, logo strip, çözüm kartları).
- **Şablonlar:** `custom_pages` gövdesini rich content olarak render (mevcut `rich-content` yardımcıları ile uyum).
- **SEO/JSON-LD:** Organization, WebSite, ürün ve makale şemaları; B2B sayfalarında `ProfessionalService` / `Manufacturer` uygunluğu değerlendirmesi (`frontend/IMPLEMENTATION_PLAN.md` ile hizala).
- **GEO / AI arama:** Özet paragraflar, net başlıklar, `llms.txt` ve yapılandırılmış veri (ileriki faz).

### 4.4 Premium UI (Antigravity iş paketi)

- `antigravity_plan.md` içindeki hero, feature, ürün kartı, galeri ve CTA maddeleri uygulanır; **içerik metinleri** mümkün olduğunca API/DB’den beslenir (sabit lorem yok).

---

## 5. İçerik üretim rehberi (insan + AI)

- Her ürün: benzersiz başlık, H1, meta, 1 özet paragraf (AI snippet dostu), teknik özet tablosu (opsiyonel JSON).
- Her çözüm sayfası: hedef müşteri, acı nokta, MOE yaklaşımı, CTA (teklif).
- Galeri: her görsel için açıklayıcı alt metin (Türkçe/İngilizce).
- Blog: uzun kuyruk teknik anahtar kelimeler + marka hikayesi (fabrika, AR-GE, ihracat).

---

## 6. Fazlar (yüksek seviye)

| Faz | İçerik | Çıktı |
|-----|--------|--------|
| **F0** | İçerik sözleşmesi ve setting key’leri | Bu plan + checklist onayı |
| **F1** | Ana sayfa bloklarını DB’den okuma | Backend + admin + frontend entegrasyonu |
| **F2** | Çözüm / B2B sayfaları + menü | `custom_pages` + navigasyon |
| **F3** | SEO/GEO + çok dil kalitesi | `IMPLEMENTATION_PLAN` kapanışı + yeni sayfalar |
| **F4** | Premium UI (Antigravity) | Görsel ve etkileşim seviyesi |

---

## 7. Riskler ve önlemler

- **Aşırı özelleştirilmiş şema:** Önce `site_settings` + `custom_pages` ile gidin; gerçek ihtiyaç netleşince tablo ekleyin.
- **Dil drift:** EN sayfalarında boş veya Türkçe kalan alanlar — checklist’te “locale parity” maddesi.
- **Performans:** Ana sayfada çoklu API çağrısı — paralel `Promise.all` veya backend’de birleşik “home payload” endpoint’i (ileride).

---

## 8. Sonraki adım

`docs/AI_ORKESTRASYON_CHECKLIST.md` dosyasındaki maddeler sırayla işlenir; mimari çatışmalar bu plana göre **Claude Code / planlama** kanalında çözülür, uygulama **Codex / Cursor** kanalında yapılır, UI doğrulama **Antigravity** ile yapılır.
