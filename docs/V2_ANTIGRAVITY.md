# V2 — Antigravity / Manuel QA

> **Amaç:** `docs/CURSOR.md` V2-C1…C17 maddelerinin tarayıcıda hızlı doğrulanması.
> **Referans görsel:** Repo kökü `compositecraft-website.html` (yan yana karşılaştırma).

## Ortam

- Frontend: `http://localhost:3020` (`bun run dev`)
- Backend (isteğe bağlı, canlı veri): `NEXT_PUBLIC_API_URL` ile uyumlu API

## Otomatik kontroller (Cursor / CI)

`main`’e açılan **pull request**’lerde `.github/workflows/ci.yml` **paralel** üç job çalıştırır (backend build, frontend + offline smoke, admin panel); deploy etmez. Süre kabaca en yavaş job kadardır (çoğunlukla admin build).

`main` **push**’ta `.github/workflows/deploy.yml` içinde frontend build sonrası şu komutlar da çalışır (API gerekmez):

- `bun run test:smoke:home-content:offline`
- `bun run test:smoke:home-api:offline`

**Canlı API (staging / üretim kökü):** GitHub → **Actions** → **Smoke API (canlı)** → `api_base_url` (örn. `https://sunucu/api`) ile `test:smoke:home-api` + `test:smoke:home-content` koşturulur (`.github/workflows/smoke-api.yml`).

Yerelde tam doğrulama:

```bash
cd frontend && bun run type-check && bun run build
cd frontend && bun run test:smoke:home-content        # API açıkken site_settings + işaretleyiciler
cd frontend && bun run test:smoke:home-content --offline
cd frontend && bun run test:smoke:home-api            # Ana sayfa + header/footer API uçları 200
cd frontend && bun run test:smoke:home-api --offline  # Atla (0 çıkış)
```

## Otomatik vs manuel

| Konu | Durum |
|------|--------|
| Build, type-check, offline smoke, PR CI | Repo’da otomatik (`docs/CURSOR.md` Teslim → Otomatik) |
| Uçtan uca HTTP 200 (ürünler, galeri, site_settings, …) | `test:smoke:home-api` + `test:smoke:home-content` veya GH **Smoke API (canlı)** |
| Piksel / referans HTML yan yana | Aşağıdaki **manuel** C1–C17 |

## Manuel checklist (section bazlı)

Her madde için: **TR** ve mümkünse **EN** locale’de kontrol et.

- [ ] **C1 — Globals:** Koyu arka plan, cream metin, DM Sans gövde; yatay taşma yok
- [ ] **C2 — Header:** Diamond logo, nav underline, scroll’da blur + alt border, mobil menü
- [ ] **C3 — Hero:** Radial + grid, H1 animasyonsuz (LCP), `em` italik gold, scroll göstergesi
- [ ] **C4 — Stats bar:** 4 kolon / responsive kırılım, altın çizgiler
- [ ] **C5 — Materials:** İki kart, spec satırları, tipografi referansa yakın
- [ ] **C6 — Process:** Timeline / adımlar, başlık hiyerarşisi
- [ ] **C7 — Industries:** Şerit veya grid, hover/okunabilirlik
- [ ] **C8 — Testimonial:** Alıntı + attribution
- [ ] **C9 — About / advantages:** İçerik hizası, CTA
- [ ] **C10 — Gallery / products / blog önizlemeleri:** Kartlar, görseller, fallback placeholder
- [ ] **C11 — References strip:** Logo / metin taşması yok
- [ ] **C12 — Newsletter:** Form ve durum metinleri
- [ ] **C13 — Dark CTA panel:** Gradyan, iki buton, animasyon
- [ ] **C14 — Contact (home):** Sol ileti bilgisi, sağda CTA → `/contact` çalışıyor. Tam form: `/contact` sayfasında `ContactFormSection` (Seçenek B).
- [ ] **C15 — Footer:** 4 kolon, sosyal linkler, alt çizgi
- [ ] **C16 — Solutions / Products list + detay:** Karanlık shell, `prose-invert`
- [ ] **C17 — Reveal:** Scroll’da görünür; `prefers-reduced-motion: reduce` ile sadeleşme

## Tümü ✅ olduğunda

Bu dosyadaki ilgili kutuları işaretle; `docs/CURSOR.md` → **Teslim Kriterleri** içindeki Antigravity satırını güncelle.
