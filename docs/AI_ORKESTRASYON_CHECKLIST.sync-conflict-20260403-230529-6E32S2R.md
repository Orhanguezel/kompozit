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

- [x] **Backend (Codex / Cursor):** Seçilen modele göre hero / metrik / “neden biz” verisini dönen okuma yolu (mevcut settings GET veya yeni aggregator endpoint). *(Mevcut: `GET /site_settings/{home.hero|home.metrics|home.value_props}?prefix=kompozit__&locale=…`; backend Zod validasyonu + seed eklendi.)*
- [x] **Admin (Codex / Cursor):** İlgili ayarları güvenli şekilde düzenleme (JSON validasyonu, önizleme metni). *(Uygulandı: `site-settings` detay ekranında `home.hero`, `home.metrics`, `home.value_props` için preview + schema yönlendirmesi.)*
- [x] **Frontend (Cursor):** `src/app/[locale]/page.tsx` içinde sabit metinleri kademeli olarak API’den gelen bloklarla değiştir; fallback olarak mevcut `next-intl` veya `content-fallbacks` kalsın. *(Uygulandı: `frontend/src/features/site-settings/home.ts` + ana sayfa birleştirme.)*
- [ ] **Antigravity:** Ana sayfa TR/EN (ve varsa DE) için layout kırılması, okunabilirlik, CTA görünürlüğü kontrolü.
- [ ] **Claude Code:** PR review — veri yokken SSR davranışı ve hata sınırı.

---

## Faz 2 — Çözüm hatları ve B2B anlatısı

- [ ] **İçerik (İnsan + Cursor yardımı):** Saksı, tabut, depo tankı, özel B2B imalat için şablonlu taslak metinler (TR + EN).
- [ ] **Admin:** `custom_pages` veya yeni `module_key` ile çözüm sayfaları oluşturma adımları dokümante edilsin (`README` veya admin iç not — kısa).
- [ ] **Frontend:** Çözüm listesi / detay route’ları menü ve `site_settings` veya menü API’si ile uyumlu.
- [ ] **SEO (Cursor / Codex):** Her çözüm sayfası için `generateMetadata`, canonical, hreflang (`IMPLEMENTATION_PLAN.md` ile tutarlı).
- [ ] **Antigravity:** Uzun metin sayfalarında tipografi, paragraf aralığı, mobil okuma.

---

## Faz 3 — Ürün genişlemesi ve katalog disiplini

- [ ] **Admin + DB:** Kategori ağacının ürün hatlarına göre düzenlenmesi (gereksiz kategori temizliği).
- [ ] **Frontend:** Ürün listesi / detayda B2B ipuçları (teknik soru, teklif CTA) — metinler mümkünse `site_settings` veya ürün alanlarından.
- [ ] **Codex:** Ürün servisinde filtre/etiket ihtiyacı çıktıysa minimal şema veya query genişletmesi.
- [ ] **Antigravity:** Ürün kartı hover, görseller, `antigravity_plan.md` “Product Showcase” maddeleri.

---

## Faz 4 — Güven ve referanslar

- [x] **Cursor / Codex:** `references` modülünü ön yüzde kullan (logo bandı veya sayfa); locale desteği kontrolü. *(Uygulandı: ana sayfada referans bandı + `/[locale]/references` liste sayfası + locale bazlı fetch/fallback + sitemap route.)*
- [ ] **İçerik:** Gerçek müşteri izni olan referanslar; metin ve logo kullanım hakları.
- [ ] **JSON-LD:** Organization + mümkünse `LocalBusiness` / üretici uygun şema (`frontend` seo katmanı).

---

## Faz 5 — Premium UI (Antigravity ana lider)

- [ ] **Antigravity:** `antigravity_plan.md` checklist’ini sırayla işaretle (Hero → Features → Products → Gallery → Blog → CTA).
- [ ] **Cursor:** Stil ve bileşen değişikliklerini uygula; motion ve tema token’larına uy (`THEMA.md`, `globals.css`).
- [ ] **Copilot:** Küçük sınıf/tekrar düzenlemeleri (büyük refactor değil).
- [ ] **Claude Code:** Tasarım kararı ile performans (LCP, CLS) çatışması varsa trade-off notu.

---

## Faz 6 — SEO, GEO ve ihracat dil kalitesi

- [ ] **Codex / Cursor:** `frontend/IMPLEMENTATION_PLAN.md` P0/P1 maddeleri (canonical, hreflang, sitemap, gerçek EN içerik).
- [ ] **Claude Code veya GEO skill:** `llms.txt`, yapılandırılmış özet blokları, snippet-dostu FAQ (isteğe bağlı `custom_pages`).
- [ ] **Antigravity:** Dil değiştirici ve URL stratejisi kullanıcı testi.

---

## Faz 7 — Kalite ve yayın

- [x] **Codex:** Birim / smoke test (mevcut `scripts/check-*.mjs` ile uyumlu yeni kontroller). *(Eklendi: `frontend/scripts/check-home-content-flow.mjs` + `npm run test:smoke:home-content`; bu turnde backend servis/bagimlilik eksigi nedeniyle calistirma dogrulamasi yapilamadi.)*
- [ ] **Cursor:** Production build ve tip kontrolü.
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
| F2 | ⬜ | |
| F3 | ⬜ | |
| F4 | Kısmen | Frontend references entegrasyonu tamam; icerik/onay ve JSON-LD genisletmesi bekliyor |
| F5 | ⬜ | |
| F6 | ⬜ | |
| F7 | Kısmen | Smoke script eklendi; ortamda bagimliliklar/backend servis hazir olmadigi icin calistirma bekliyor |

---

*Bu checklist, `PREMIUM_ICERIK_VE_MIMARI_GENISLEME_PLANI.md` ile birlikte yaşayan dokümandır; karar değişince ilgili faz maddeleri güncellenmelidir.*
