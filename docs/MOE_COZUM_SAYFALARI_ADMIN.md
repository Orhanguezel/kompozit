# MOE Kompozit — Çözüm sayfaları (Admin)

## Modül anahtarı

- **`module_key`:** `kompozit_solutions`
- Ön yüz rotaları: `/[locale]/solutions` (liste), `/[locale]/solutions/[slug]` (detay).

## Yeni sayfa ekleme (özet)

1. Admin → **Custom pages** → yeni kayıt.
2. Üst (parent) alanlarda **`module_key` = `kompozit_solutions`**, **yayında** (`is_published`).
3. TR ve EN için **i18n** satırları: `title`, `slug` (mümkünse tüm dillerde **aynı slug** — hreflang tutarlılığı), `summary`, `meta_title`, `meta_description`.
4. **İçerik:** JSON `{"html":"..."}` veya admin rich alanı bu yapıya uygun kaydediyorsa aynı şekilde.
5. **Slug çakışması:** `by-slug` API tüm custom_pages içinde tek sonuç döner; blog/yasal sayfalarla **aynı slug kullanmayın**.

## Seed

Örnek dört çözüm (saksı, tabut, depo/tank, B2B özel imalat):  
`backend/src/db/seed/sql/307_kompozit_solutions.seed.sql`

## Menü

Site menüsü API’den geliyorsa **Çözümler** linkini admin menüde `/solutions` (veya locale önekli tam yol) olarak ekleyin. API boşsa ön yüz **fallback menü** `navigation-fallback.ts` içinde `/solutions` satırını zaten ekler.
