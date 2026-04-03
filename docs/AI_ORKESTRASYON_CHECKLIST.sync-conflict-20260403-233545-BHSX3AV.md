# MOE Kompozit — AI Orkestrasyonu ve Uygulama Checklist’i

> **Amaç:** Premium, tam dinamik içerik ve mimari genişlemeyi; **Cursor (Context AI)**, **Antigravity**, ve workspace kurallarına uygun diğer araçlarla çakışmadan yürütmek.  
> **Referans plan:** `docs/PREMIUM_ICERIK_VE_MIMARI_GENISLEME_PLANI.md`  
> **UI referansı:** `antigravity_plan.md` (repo kökü)  
> **Kural:** Aynı dosyada aynı anda iki ajan çalıştırma; PR öncesi branch netliği.

---

## Araç rolleri (özet)

| Araç | Rol | Bu projede sorumluluk |
|------|-----|------------------------|
| **Claude Code** | Mimari ve strateji | Şema kararı, setting key sözleşmesi, API sınırı, plan güncellemesi, kod review yönü |
| **Codex** | Uygulama / PR | Toplu feature, migration, test, lint |
| **Cursor Agent (Context AI)** | Odaklı implementasyon | Tek repo içi görevler, bileşen + API bağlama, bu checklist’ten madde alıp bitirme |
| **Antigravity** | UI/UX doğrulama | Görsel regresyon, responsive, etkileşim, premium his; screenshot / senaryo |
| **Copilot** | Cilalama | Küçük refactor, isimlendirme, tekrar azaltma, boilerplate (Codex ile çakışmayı önle) |

---

## Faz 0 — Hazırlık ve sözleşme

- [x] **Claude Code:** `PREMIUM_ICERIK_VE_MIMARI_GENISLEME_PLANI.md` Faz 3.2’deki A/B seçimini (ana sayfa blokları için `site_settings` vs `custom_pages`) kesinleştir ve bu dosyaya tek cümle “karar kaydı” ekle.
- [x] **Claude Code:** `site_settings` anahtar listesi taslağı — `docs/SITE_SETTINGS_KEYS_CONTRACT.md` (locale + JSON şekilleri).
- [x] **Cursor:** Mevcut `API_BASE_URL` ve admin’de bu key’lerin oluşturulabilirliğini doğrula; eksikse admin tarafında minimum alan önerisi çıkar. *(Sonuç: public `GET /site_settings?prefix=…`; admin genel key/locale/value CRUD yeterli; sözleşme dosyasında “Admin doğrulama” notu.)*
- [x] **Codex veya Cursor:** `frontend/project.portfolio.json` içindeki `@ensotek/core` satırı gibi artık geçersiz metadata varsa güncelle (tek commit).

---

## Faz 1 — Ana sayfa dinamik blokları

- [x] **Backend (Codex / Cursor):** Seçilen modele göre hero / metrik / “neden biz” verisini dönen okuma yolu. *(Mevcut: `GET /site_settings/home.hero|home.metrics|home.value_props?prefix=kompozit__&locale=…`; seed: `301_kompozit_site_settings.seed.sql`.)*
- [x] **Admin (Codex / Cursor):** JSON validasyonu + önizleme. *(Raw mod: `kompozit__home.*` key’lerinde canlı önizleme ve geçersiz JSON’da kayıt engeli — `admin_panel/src/lib/kompozit-home-settings-admin.ts` + `site-settings-form.tsx`.)*
- [x] **Frontend (Cursor):** Ana sayfa içeriği `fetchHomePageContent` (`frontend/src/features/site-settings/home.ts`) + `next-intl` fallback; `src/app/[locale]/page.tsx`.*
- [ ] **Antigravity:** Ana sayfa TR/EN (ve varsa DE) için layout kırılması, okunabilirlik, CTA görünürlüğü kontrolü.
- [ ] **Claude Code:** PR review — veri yokken SSR davranışı ve hata sınırı.

---

## Faz 2 — Çözüm hatları ve B2B anlatısı

- [x] **İçerik (İnsan + Cursor yardımı):** Saksı, tabut, depo tankı, özel B2B imalat için şablonlu taslak metinler (TR + EN). *(Seed: `307_kompozit_solutions.seed.sql`.)*
- [x] **Admin:** `custom_pages` + `module_key` adımları — `docs/MOE_COZUM_SAYFALARI_ADMIN.md`.
- [x] **Frontend:** `/solutions`, `/solutions/[slug]`; liste `is_published=1`; detayda `module_key` doğrulaması; menü fallback’te `/solutions`.
- [x] **SEO (Cursor / Codex):** `generateMetadata` + `buildPageMetadata`; liste + detay sitemap; slug tr/en ortak → `includeLocaleAlternates: true` (detay).
- [x] **Cursor:** Çözüm detayında `prose` tipografi / paragraf aralığı (Antigravity görsel onayı ayrı).

---

## Faz 3 — Ürün genişlemesi ve katalog disiplini

- [ ] **Admin + DB:** Kategori ağacının ürün hatlarına göre düzenlenmesi (gereksiz kategori temizliği).
- [x] **Frontend:** Ürün listesi / detayda B2B ipuçları — `ProductB2bBanner` (liste), detayda teknik iletişim şeridi + mevcut teklif CTA; metinler `products.b2b.*` (`tr`/`en`). *(İsteğe bağlı: `site_settings` ile override sonraki tur.)*
- [x] **Codex:** Ürün servisinde filtre/etiket ihtiyacı çıktıysa minimal şema veya query genişletmesi.
- [ ] **Antigravity:** Ürün kartı hover, görseller, `antigravity_plan.md` “Product Showcase” maddeleri.

---

## Faz 4 — Güven ve referanslar

- [x] **Cursor:** Ana sayfada `ReferencesTrustStrip` — API’den `is_featured` referanslar veya fallback; `/references` CTA; menü/footer fallback’e `nav.references` eklendi. *(Tam sayfa zaten `/references`.)*
- [ ] **İçerik:** Gerçek müşteri izni olan referanslar; metin ve logo kullanım hakları.
- [x] **JSON-LD:** Ana sayfa `buildHomePageSchemaGraph` — `Organization` (`@id`, `knowsAbout`, `areaServed`, `image`) + `WebSite` (`publisher`) + adres/telefon varsa `LocalBusiness` (`parentOrganization`). İletişim sayfası aynı `@id` ile hizalı. `jsonld.org` / `website` / `localBusiness` genişletildi (`frontend/src/seo/`).

---

## Faz 5 — Premium UI (Antigravity ana lider)

- [ ] **Antigravity:** `antigravity_plan.md` checklist’ini sırayla işaretle (Hero → Features → Products → Gallery → Blog → CTA).
- [ ] **Cursor:** Stil ve bileşen değişikliklerini uygula; motion ve tema token’larına uy (`THEMA.md`, `globals.css`).
- [ ] **Copilot:** Küçük sınıf/tekrar düzenlemeleri (büyük refactor değil).
- [ ] **Claude Code:** Tasarım kararı ile performans (LCP, CLS) çatışması varsa trade-off notu.

---

## Faz 6 — SEO, GEO ve ihracat dil kalitesi

- [x] **Codex / Cursor:** `frontend/IMPLEMENTATION_PLAN.md` P0/P1 maddeleri (canonical, hreflang, sitemap, gerçek EN içerik). *(Bu turde ek olarak default-locale URL cleanup yapildi: `/` artik kanonik TR kok URL, `localizedPath/localizedUrl` helper'lari `as-needed` stratejisiyle hizalandi, `/->/tr` redirect kaldirildi, language switcher ve footer linkleri guncellendi, metadata helper `author/publisher` sinyali kazandi.)*
- [x] **Cursor:** Kök `GET /llms.txt` — çok dilli temel URL listesi + site özeti + AI notları (`frontend/src/app/llms.txt/route.ts`, `revalidate` 1 gün).
- [ ] **Claude Code veya GEO skill:** Snippet-dostu FAQ / yapılandırılmış özet blokları (isteğe bağlı `custom_pages`).
- [ ] **Antigravity:** Dil değiştirici ve URL stratejisi kullanıcı testi.

---

## Faz 7 — Kalite ve yayın

- [x] **Codex:** Birim / smoke test (mevcut `scripts/check-*.mjs` ile uyumlu yeni kontroller). *(Eklendi: `frontend/scripts/check-home-content-flow.mjs` + `npm run test:smoke:home-content`; bu turnde backend servis/bagimlilik eksigi nedeniyle calistirma dogrulamasi yapilamadi.)*
- [x] **Cursor:** `tsc --noEmit` temiz; `next build` doğrulandı. `normLocaleShort` güvenli (tanımsız locale); `content-fallbacks` TS2532 giderildi; locale mesajları `AbstractIntlMessages` cast.
- [ ] **Antigravity:** Son görsel onay checklist’i.
- [ ] **Claude Code:** Yayın öncesi mimari özet (tek paragraf release note).

---

## Paralel çalışma kuralları (çakışmayı önleme)

1. **Aynı fazda** Cursor ve Codex aynı dizini değiştirecekse önce dosya listesi paylaş veya alt branch ayır.
2. **Antigravity** sadece UI branch’inde veya PR’de review; aynı anda Codex ile aynı bileşen dosyasına dokunma.
3. **Copilot** sadece “cilalı” commit’ler; feature branch’te büyük davranış değişikliği yapma.

---

## Hızlı durum tablosu (ilerleme için kopyala-yapıştır)

| Faz | Durum | Sorumlu / not |
|-----|--------|----------------|
| F0 | Tamam | Karar A + `SITE_SETTINGS_KEYS_CONTRACT.md` + portfolio metadata |
| F1 | Tamam | Backend + admin + frontend ana sayfa bloklari `site_settings` uzerinden baglandi; Antigravity review ayri |
| F2 | Tamam | Kod+seed+doc; çözüm detay prose iyileştirmesi Cursor’da |
| F3 | Kısmen | B2B CTA şeritleri tamam; kategori/DB + Antigravity ürün kartı bekliyor |
| F4 | Kısmen | Referans bandı + nav + Organization/LocalBusiness JSON-LD; içerik izinleri ayrı |
| F5 | ⬜ | |
| F6 | Tamam | P0/P1 SEO maddeleri checklist kapsaminda kapatildi; GEO/Antigravity maddeleri ayri |
| F7 | Kısmen | Build + type-check OK; smoke script ortamda calistirma ayri |

---

*Bu checklist, `PREMIUM_ICERIK_VE_MIMARI_GENISLEME_PLANI.md` ile birlikte yaşayan dokümandır; karar değişince ilgili faz maddeleri güncellenmelidir.*
