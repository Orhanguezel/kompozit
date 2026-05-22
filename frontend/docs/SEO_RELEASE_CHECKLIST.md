# SEO Release Checklist

## Build and Smoke

1. `npm run build`
2. `npm run test:seo`
3. `npm run test:media`
4. `npm run test:theme`
5. `npm run audit:media`
6. `npm run audit:crawl`
7. `npm run audit:lighthouse`

## Post-Deploy Manual Checks

### Canonical

- Ana locale URL'leri kendi canonical'ina doner.
- Query parametreli riskli URL'ler temiz path canonical kullanir.
- `/` URL'i locale stratejisine uygun sekilde yonlenir.
- `https://karbonkompozit.com.tr/*` tek adimda `https://www.karbonkompozit.com.tr/*` adresine 301 doner.
- HTTP varyantlari tek adimda `https://www.karbonkompozit.com.tr/*` adresine 301 doner.

### Hreflang

- `tr`, `en` ve `x-default` ciktilari vardir.
- Locale farkli ama icerik ayni page contract'i korur.

### Robots

- `robots.txt` yayin ortaminda aciktir.
- `Disallow` sadece teknik alanlari kapsar.
- `sitemap` satiri dogru domaine isaret eder.
- `Server` header'i version bilgisi acik etmeyecek sekilde minimize edilir.

### Icons

- `/icon`, `/apple-icon`, `/opengraph-image` ve `/twitter-image` 200 doner.
- Manifest icon kayitlari `/icon` ve `/apple-icon` route'larini isaret eder.

### Sitemap

- `sitemap.xml` 200 doner.
- Product, gallery, blog ve legal route coverage vardir.
- Image sitemap alanlari detail URL'lerde gorunur.
- `lastmod` alanlari veri tabanindaki tarih ile uyumludur.

### Structured Data

- Home: Organization + WebSite
- Product detail: Product + BreadcrumbList
- Blog detail: Article + BreadcrumbList
- Gallery detail: BreadcrumbList
- Rich Results Test ile kritik hata yoktur.

### 404 and Soft-404

- Bilinmeyen URL'ler custom 404 UI ile doner.
- 404 page noindex davranisi dogrudan veya status code ile korunur.
- Empty listing state olusan indexlenebilir sayfalarda monitoring webhook tetiklenir.

### Internal Linking

- Header ve footer linkleri canlidir.
- Breadcrumb linkleri tiklanabilirdir.
- Related cluster linkleri en az product, blog, gallery arasinda calisir.
- `audit:crawl` raporunda kritik kirik link yoktur.

## Release Evidence

- Lighthouse SEO skoru ekran goruntusu
- Crawl raporu JSON cikti dosyasi
- Sitemap sample URL kontrol notu
- Search Console submit tarih/notu
- Analytics/Pixels karar notu: Google Analytics veya alternatif analytics aktif mi; Facebook Pixel kullaniliyor mu, kullanilmiyorsa bilincli karar notu.
- Kurumsal sosyal profil URL'leri: Facebook, Twitter/X, Instagram, YouTube, LinkedIn site settings/footer/schema alanlarinda tanimli mi.
