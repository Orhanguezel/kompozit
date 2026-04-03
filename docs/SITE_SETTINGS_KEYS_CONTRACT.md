# MOE Kompozit — `site_settings` anahtar sözleşmesi

> **Karar:** Vitrin metinleri `site_settings` + locale.  
> **Prefix:** Public okumada `prefix=kompozit__`; kısa anahtar `home.hero` → tam key `kompozit__home.hero`.

---

## Public API

- `GET {API}/site_settings/home.hero?locale=tr&prefix=kompozit__` → kayıt `kompozit__home.hero`
- Aynı şekilde: `home.metrics`, `home.value_props`, `products.b2b`
- **Frontend:** `src/i18n/server.ts` → `fetchSetting()`; birleştirme: `src/features/site-settings/home.ts` → `fetchHomePageContent()`
- **Ana sayfa:** `src/app/[locale]/page.tsx` bu veriyi `next-intl` ile birleştirir.

---

## Locale

Satır bazında `tr`, `en` (ve gerektiğinde `de`). Global `*` bu bloklar için kullanılmaz.

---

## Anahtarlar ve gövdeler

### `kompozit__home.hero`

`badge`, `title`, `subtitle`, `primaryCtaLabel`, `primaryCtaHref`, `secondaryCtaLabel`, `secondaryCtaHref`, `workflowLabel`, `workflowTitle`, `workflowBadgeTitle`, `workflowBadgeSubtitle`

### `kompozit__home.metrics`

- `items`: tam 3 nesne `{ title, description }` (üst üç kart)
- `workflowSteps`: tam 3 nesne `{ step, title, description }`
- `stats`: tam 2 nesne `{ value, label }`

### `kompozit__home.value_props`

`sectionLabel`, `title`, `subtitle`, `items`: en az 4 nesne `{ key, title, description }` — `key`: `quality` | `experience` | `custom` | `delivery`

### `kompozit__products.b2b`

`catalogEyebrow`, `catalogTitle`, `catalogBody`, `requestQuote`, `talkToEngineering`, `detailEyebrow`, `detailTitle`, `detailBody`

İlaveten 4 blok zorunlu:
- `reliability`: `{ title, desc }`
- `engineering`: `{ title, desc }`
- `speed`: `{ title, desc }`
- `logistics`: `{ title, desc }`

---

## Admin

- Key tam adı: `kompozit__home.hero` vb. Site Ayarları detayında **Raw** mod.
- `kompozit__home.` ile başlayan anahtarlarda: canlı JSON önizleme, geçersiz JSON’da kayıt engeli (`admin_panel/src/lib/kompozit-home-settings-admin.ts`).

---

## Seed

- `backend/src/db/seed/sql/301_kompozit_site_settings.seed.sql`
- `backend/src/db/seed/sql/310_kompozit_products_b2b_site_settings.seed.sql`
