# CODEX GÖREVLERİ — Kompozit (karbonkompozit.com.tr)

Bu dosya Claude Code (mimar) tarafından hazırlandı; uygulamayı Codex yapacak.
Her madde tamamlandığında kutusu işaretlenir. Sıra önemlidir.

> **Genel kural:** Türkçe içerik gerçek Türkçe karakterlerle yazılır (ü, ş, ğ, ı, İ, ö, ç).
> ASCII karşılığı ("Muhendislik destegi" gibi) kullanılmaz.

---

## GÖREV 1 — Ortak modülleri `shared-backend`'e taşı

**Amaç:** `footerSections`, `menuItems`, `offer`, `review` modülleri diğer projelerde de
ortak kullanılacak. Bu yüzden kompozit'e özgü olmaktan çıkıp paylaşılan pakete taşınır.

**Kaynak → Hedef:**
- `kompozit/backend/src/modules/menuItems/`     → `Ensotek/packages/shared-backend/modules/menuItems/`
- `kompozit/backend/src/modules/footerSections/` → `Ensotek/packages/shared-backend/modules/footerSections/`
- `kompozit/backend/src/modules/review/`         → `Ensotek/packages/shared-backend/modules/review/`
- `kompozit/backend/src/modules/offer/`          → `Ensotek/packages/shared-backend/modules/offer/`

**Taşıma sırası:** `menuItems` → `footerSections` → `review` → `offer`
(`footerSections`, `menuItems/schema`'ya bağımlı; `offer` en çok bağımlılığa sahip — en sona).

### İmport yeniden bağlama haritası
Taşınan dosyalarda `@/...` alias'ları shared-backend göreli yollarına çevrilir:

| Eski (kompozit-local) | Yeni (shared-backend içinde) |
|---|---|
| `@/db/client` | `../../db/client` |
| `@/core/i18n` | `../../core/i18n` |
| `@/core/kompozit-mail` | `../mail` (shared-backend mail modülü) |
| `@/common/middleware/auth` | `../../middleware/auth` |
| `@/common/middleware/roles` | `../../middleware/roles` |
| `@/common/utils/contentRange` | `../_shared/contentRange` |
| `@/modules/_shared` | `../_shared` |
| `@/modules/products/schema` | `../products/schema` |
| `@/modules/telegram/telegram.notifier` | `../telegram/telegram.notifier` |
| `@/modules/menuItems/schema` | `../menuItems/schema` |
| `@ensotek/shared-backend/modules/X` | `../X` |
| `@ensotek/shared-backend/middleware/auth` | `../../middleware/auth` |

### ⚠️ Kritik dikkat noktaları
- `offer/service.ts` (ve gerekiyorsa diğerleri) `@/core/kompozit-mail` kullanıyor — bu
  kompozit'e özgü. shared-backend'de yerine `modules/mail` kullanılmalı. Fonksiyon
  imzaları farklı olabilir; Codex eşleştirmeyi kontrol etsin. Mail çağrıları **try/catch**
  içinde kalmalı (mail hatası offer oluşturmayı 500 yapmamalı).
- `offer/pdfTemplate.ts` `puppeteer` kullanıyor — `packages/shared-backend/package.json`
  bağımlılıklarında `puppeteer` (ve `zod`) var mı kontrol et; yoksa ekle.
- `offer/schema.ts` `offers` + `offer_number_counters` tablolarını tanımlar. Tablo CREATE
  SQL'i kompozit seed dosyasında (`314_kompozit_admin_schema_extensions.sql`) kalır — taşıma yok.

### Her modül için adımlar
- [ ] Dosyaları hedef klasöre kopyala.
- [ ] İmport'ları yukarıdaki haritaya göre düzelt.
- [ ] `packages/shared-backend/package.json` `exports` map'ine modülü ekle
      (mevcut modül pattern'i gibi: `"./modules/<m>": "./modules/<m>/index.ts"` ve
      `"./modules/<m>/*": "./modules/<m>/*.ts"`).
- [ ] `kompozit/backend/src/routes/project.ts` — `registerOffer`, `registerOfferAdmin`,
      `registerReviews`, `registerReviewsAdmin`, `registerFooterSections`,
      `registerFooterSectionsAdmin`, `registerMenuItems`, `registerMenuItemsAdmin`
      import'larını `@/modules/<m>/...` yerine `@ensotek/shared-backend/modules/<m>/...` yap.
- [ ] Eski `kompozit/backend/src/modules/<modül>/` klasörünü sil.

### Görev 1 — kabul kriterleri
- [ ] `kompozit/backend` temiz derlenir (`bun run build`, TS hatası yok).
- [ ] `kompozit/admin_panel` temiz derlenir.
- [ ] `POST /api/offers` çalışır (boş gövde → 400, geçerli gövde → 201).
- [ ] `GET /api/menu_items`, `GET /api/footer_sections`, review public endpoint'leri → 200.
- [ ] Admin panelde offer / review listeleri açılır ve çalışır.
- [ ] 4 modül `packages/shared-backend/modules/` altında; `kompozit/backend/src/modules/` altında YOK.

---

## GÖREV 2 — `/tr/contact` Türkçe olmayan içerik

`https://karbonkompozit.com.tr/tr/contact` sayfasında Türkçe sayfada İngilizce / Türkçe
olmayan metinler görünüyor.

- [ ] Şu dosyalar incelenir: `frontend/src/components/containers/contact/ContactPage.tsx`,
      `frontend/src/app/[locale]/contact/page.tsx`,
      `frontend/public/locales/tr.json` (contact bölümü).
- [ ] İletişim verisi `site_settings`'ten de gelebilir (`contact_info` anahtarı) — kontrol et.
- [ ] Türkçe olmayan / eksik tüm metinler düzgün Türkçe'ye çevrilir
      (gerçek Türkçe karakterlerle).
- [ ] `en.json` contact bölümü de tutarlı kalmalı (İngilizce sayfada İngilizce doğru).

---

## GÖREV 3 — Mobil hamburger menü stili

Mobil menü kötü görünüyor: ana başlık metinleri (ANA SAYFA, ÜRÜNLER, ÇÖZÜMLER, KURUMSAL,
İLETİŞİM) aşırı büyük; alt menü öğeleri sıkışık; dikey ritim ve hiyerarşi bozuk.

- [ ] Dosya: `frontend/src/components/layout/Header.tsx` (mobil menü buradadır).
- [ ] Ana menü öğeleri makul font boyutuna indirilir.
- [ ] Alt menü öğeleri arasına yeterli boşluk; ana öğe ↔ alt öğe hiyerarşisi netleşir.
- [ ] Menü içi dikey boşluk/padding düzenlenir; öğeler ekrana sığar, taşma olmaz.
- [ ] Açılış/kapanış geçişi ve kapatma (X) butonu düzgün çalışır.
- [ ] Hem light hem dark modda kontrol edilir.

---

## Test / teslim

- [ ] `kompozit/backend` + `admin_panel` + `frontend` üçü de temiz derlenir.
- [ ] Değişiklikler commit + push edilir; canlıya manuel deploy (CI/CD kullanılmıyor).
- [ ] Canlı kontrol: `/api/offers`, `/tr/contact`, mobil menü.
