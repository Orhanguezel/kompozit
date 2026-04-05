# Antigravity — V2 Görsel Doğrulama Checklist

> **Hedef:** Her section için `compositecraft-website.html` ile yan yana karşılaştırma.  
> **Referans:** `http://127.0.0.1:5500/compositecraft-website.html`  
> **Site:** `http://localhost:3020` (veya `/en` locale için)  
> **Kural:** Her bölümü ayrı screenshot ile doğrula. Sorun varsa CURSOR.md ilgili bölümüne yaz.

---

## A0 — Genel Kontrol (Her Şeyden Önce)

- [ ] Site açılıyor: `http://localhost:3020/tr` 200 dönüyor
- [ ] Backend çalışıyor: `http://localhost:8186/health` → `{"ok":true}`
- [ ] Console'da kırmızı hata yok (network + console tab)
- [ ] Arkaplan tam siyah (`#0a0a0a`) — gri cast veya beyazlık yok
- [ ] Font yükleniyor: Bebas Neue başlıklarda, DM Sans body'de görünüyor
- [ ] Gold rengi (#c9a96e) turuncu değil

---

## A1 — Navigation

| Kontrol | Referans | Mevcut | Durum |
|---------|----------|--------|-------|
| Transparent başlangıç | ✓ | Mevcut | [x] |
| Scroll > 50px: blur + gold border | ✓ | Mevcut | [x] |
| Logo diamond icon | ✓ | Mevcut | [x] |
| Logo Bebas Neue, letter-spacing: 6px | ✓ | Mevcut | [x] |
| Nav link: silver, uppercase, 0.8rem | ✓ | Mevcut | [x] |
| Hover: gold color + underline slide | ✓ | Mevcut | [x] |
| CTA: gold border, hover fill | ✓ | Mevcut | [x] |
| Mobile hamburger: 3 çizgi | ✓ | Mevcut | [x] |
| Mobile menü: tam ekran, dark | ✓ | Mevcut | [x] |

---

## A2 — Hero Section

| Kontrol | Referans | Mevcut | Durum |
|---------|----------|--------|-------|
| Min-height 100vh | ✓ | 100vh | [x] |
| Radial gold glow arkaplan | ✓ | Mevcut | [x] |
| Gold grid overlay görünür (hafif) | ✓ | Mevcut | [x] |
| Carbon texture body'den geliyor | ✓ | Mevcut | [x] |
| Label: gold, letter-spacing: 8px | ✓ | Mevcut | [x] |
| H1: Bebas Neue, dev font | ✓ | Mevcut | [x] |
| H1 `<em>`: Cormorant italic, gold | ✓ | Mevcut | [x] |
| H1 yüklenince görünür (animasyon yok) | ✓ | Mevcut | [x] |
| Desc: silver, font-weight 300 | ✓ | Mevcut | [x] |
| Btn-primary: gold fill, shimmer | ✓ | Mevcut | [x] |
| Btn-outline: silver border → gold hover | ✓ | Mevcut | [x] |
| Scroll indicator: alt orta, animasyonlu | ✓ | Mevcut | [x] |

---

## A3 — Stats Bar

| Kontrol | Referans | Durum |
|---------|----------|-------|
| 4 kolon grid | ✓ | [x] |
| Gold top + bottom border | ✓ | [x] |
| Dikey gold ayırıcı çizgiler | ✓ | [x] |
| Sayı: Bebas Neue, 3rem, gold | ✓ | [x] |
| Label: uppercase, silver, 0.7rem | ✓ | [x] |
| Hover: hafif gold bg | ✓ | [x] |
| Mobile: 2x2 grid | ✓ | [x] |
| Veriler API'den geliyor (15+, 500+ vb.) | ✓ | [x] |

---

## A4 — About Section

| Kontrol | Referans | Durum |
|---------|----------|-------|
| Graphite arkaplan (#1a1a1a) | ✓ | [x] |
| 2 kolon grid, 6rem gap | ✓ | [x] |
| Sol: fiber gradient visual | ✓ | [x] |
| "COMPOSITE STRUCTURE" watermark | ✓ | [x] |
| Gold accent square (sağ-alt) | ✓ | [x] |
| Section label: gold, uppercase | ✓ | [x] |
| H2: Bebas Neue + em italic gold | ✓ | [x] |
| Serif italic h3 alıntı | ✓ | [x] |
| Body: silver, font-weight 300 | ✓ | [x] |
| Mobile: tek kolon | ✓ | [x] |

---

## A5 — Materials

| Kontrol | Referans | Durum |
|---------|----------|-------|
| 2 kart, 2px gap | ✓ | [x] |
| Graphite arkaplan | ✓ | [x] |
| Hover: gold top border slide (sol→sağ) | ✓ | [x] |
| Hover: kart aydınlanıyor | ✓ | [x] |
| Icon kutusu: 60px, gold border, "CF"/"GF" | ✓ | [x] |
| Başlık: Bebas Neue | ✓ | [x] |
| 2x2 spec grid, dark bg | ✓ | [x] |
| Spec value: Bebas Neue, gold | ✓ | [x] |
| Spec label: uppercase, silver, 0.7rem | ✓ | [x] |

---

## A6 — Products Grid

| Kontrol | Referans | Durum |
|---------|----------|-------|
| Graphite section arkaplanı | ✓ | [x] |
| 3 kolon grid, 2px gap | ✓ | [x] |
| Görsel: 400px, radial gradient | ✓ | [x] |
| Ürün numarası: "01 / PRODUCT" | ✓ | [x] |
| Orta büyük icon (sembolik, soluk) | ✓ | [x] |
| Hover: scale(1.03) smooth | ✓ | [x] |
| H3: Bebas Neue | ✓ | [x] |
| Product-tag: gold border, uppercase | ✓ | [x] |
| Veriler API'den (item_type=kompozit) | ✓ | [x] |
| Fallback mock data render ediyor | ✓ | [x] |

---

## A7 — Process Timeline

| Kontrol | Referans | Durum |
|---------|----------|-------|
| Carbon arkaplan | ✓ | [x] |
| Merkez gold gradient çizgi | ✓ | [x] |
| Gold dot her adımda (glow shadow) | ✓ | [x] |
| Alternatif sol/sağ layout | ✓ | [x] |
| Büyük soluk adım numarası | ✓ | [x] |
| Mobile: tek kolon, çizgi sola | ✓ | [x] |

---

## A8 — Advantages / Why Us

| Kontrol | Referans | Durum |
|---------|----------|-------|
| Graphite arkaplan | ✓ | [x] |
| 3 kolon (veya 2 sıra 3+3), 2px gap | ✓ | [x] |
| Her kart: carbon bg | ✓ | [x] |
| Büyük dekoratif sayı (01, 02...) soluk gold | ✓ | [x] |
| Hover: alt gold şerit açılıyor | ✓ | [x] |
| Hover: kart aydınlanıyor | ✓ | [x] |
| Mobile: tek kolon | ✓ | [x] |

---

## A9 — Gallery

| Kontrol | Referans | Durum |
|---------|----------|-------|
| Full-bleed (yan padding yok) | ✓ | [x] |
| 4 kolon grid, 2px gap | ✓ | [x] |
| 1. ve 4. öğe grid-row: span 2 | ✓ | [x] |
| Her öğe farklı color-hint gradyanı | ✓ | [x] |
| Hover: karanlık overlay gelir | ✓ | [x] |
| Hover: caption fade-up | ✓ | [x] |
| Caption: gold span + Bebas h4 | ✓ | [x] |
| Fiber weave texture overlay | ✓ | [x] |
| Mobile: 2 kolon, span yok | ✓ | [x] |

---

## A10 — Industries Strip

| Kontrol | Referans | Durum |
|---------|----------|-------|
| Graphite arkaplan | ✓ | [x] |
| Flex layout, 2px gap | ✓ | [x] |
| Carbon item arkaplanı | ✓ | [x] |
| Hover: translateY(-4px) | ✓ | [x] |
| Hover: radial glow alt | ✓ | [x] |
| İkon + Bebas başlık + silver metin | ✓ | [x] |

---

## A11 — Testimonial

| Kontrol | Referans | Durum |
|---------|----------|-------|
| Carbon arkaplan, 10rem padding | ✓ | [x] |
| Büyük dekoratif tırnak (15rem, %6 opacity) | ✓ | [x] |
| Cormorant Garamond italic blockquote | ✓ | [x] |
| Yazar: gold, letter-spacing: 4px, uppercase | ✓ | [x] |

---

## A12 — CTA Section

| Kontrol | Referans | Durum |
|---------|----------|-------|
| Gradient bg (graphite→carbon, 135deg) | ✓ | [x] |
| Animasyonlu radial glow görünüyor | ✓ | [x] |
| H2: Bebas Neue dev | ✓ | [x] |
| 2 buton: gold fill + silver outline | ✓ | [x] |

---

## A13 — Footer

| Kontrol | Referans | Durum |
|---------|----------|-------|
| Carbon arkaplan | ✓ | [x] |
| Gold top border (0.1 opacity) | ✓ | [x] |
| 4 kolon: brand 2fr + 3x 1fr | ✓ | [x] |
| Brand desc: silver, 0.9rem | ✓ | [x] |
| Kolon başlıkları: Bebas Neue | ✓ | [x] |
| Link hover: gold | ✓ | [x] |
| Footer bottom: copyright + sosyal | ✓ | [x] |
| Veriler DB'den geliyor | ✓ | [x] |
| Tablet: 2x2 | Mobile: 1 kolon | ✓ | [x] |

---

## A14 — TR ↔ EN Dil Geçişi

- [x] `/tr` — tüm içerik Türkçe
- [x] `/en` — tüm içerik İngilizce
- [x] Dil geçişi header'dan çalışıyor
- [x] URL doğru değişiyor
- [x] Missing key crash yok (fallback görünüyor)

---

## A15 — Solutions Sayfaları

- [x] `/tr/solutions` — liste sayfası açılıyor
- [x] `/tr/solutions/solution-planters` — detay açılıyor
- [x] Tasarım dili ana sayfa ile tutarlı
- [x] HowTo + FAQ JSON-LD var (DevTools > Sources > page source)

---

## A16 — Products Sayfaları

- [x] `/tr/products` — liste sayfası açılıyor
- [x] `/tr/products/[slug]` — detay açılıyor
- [x] Tasarım dili tutarlı

---

## A17 — Responsive Kontrol (Mobil Simülatör)

- [x] 375px: Hero taşmıyor, H1 okunaklı
- [x] 375px: Navbar hamburger çalışıyor
- [x] 375px: Stats 2x2 grid
- [x] 375px: Footer tek kolon
- [x] 768px: Products 2 kolon
- [x] 1024px: Tüm masaüstü layoutlar tam

---

## A18 — Performans (İsteğe Bağlı)

- [ ] Lighthouse Performance ≥ 80 (mobile)
- [ ] Lighthouse Accessibility ≥ 90
- [ ] LCP elementi H1 veya hero görseli — hızlı yükleniyor

---

## Sorun Bildirme Formatı

```
BÖLÜM: A5 — Materials
SORUN: Gold top border hover'da çalışmıyor
DOSYA: frontend/src/components/sections/MaterialCards.tsx
EKRAN: [screenshot]
CURSOR BLOĞU: V2-C6
```
