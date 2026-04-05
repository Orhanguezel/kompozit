# Cursor — V2 Görsel Eşleştirme Checklist

> **Hedef:** `compositecraft-website.html` görünümüne piksel düzeyinde yaklaşmak.  
> **Referans:** Repo kökündeki `compositecraft-website.html` — her section için CSS orada.  
> **Kural:** Her öğeyi bitirince işaretle. Codex'in aynı dosyaya dokunmasını bekleme.  
> **Backend:** `http://localhost:8186` üzerinde çalışıyor. Frontend: `http://localhost:3020`

---

## V2-C1 — Globals & Token Doğrulama

**Dosya:** `frontend/src/styles/globals.css`

Referans HTML `:root` değerleri ile karşılaştır — eksik varsa ekle:

```css
/* Referans HTML :root */
--carbon: #0a0a0a;
--graphite: #1a1a1a;
--steel: #2a2a2a;
--fiber: #3a3a3a;
--silver: #8a8a8a;
--light: #c0c0c0;
--cream: #e8e4df;
--gold: #c9a96e;
--gold-bright: #dbb978;
--white: #f5f2ed;
```

Mevcut `globals.css` token adları farklı (`--color-carbon` vb.). Bunlar zaten doğru değerlere sahip — sadece `body { background: var(--color-bg); color: var(--color-cream); }` ve `body { font-family: var(--font-sans), 'DM Sans', sans-serif; line-height: 1.7; }` kontrol et.

- [x] `body` arkaplanı `#0a0a0a` (`--color-bg` / `--color-carbon`)
- [x] `body` text rengi `#e8e4df` (`--color-cream`)
- [x] `body` font-family `DM Sans`, line-height `1.7`
- [x] `overflow-x: hidden` body'de mevcut
- [x] `.carbon-texture` class tam olarak mevcut (4 linear-gradient, 4px 4px)
- [x] `.gold-grid-bg` class mevcut (80px grid, mask-image radial)

---

## V2-C2 — Navigation / Header

**Dosya:** `frontend/src/components/layout/Header.tsx`

Referans HTML nav CSS (satır 58-171) ile karşılaştır:

### Logo Diamond İkon
```tsx
{/* Sol: gold border rotated diamond + küçük gold inner square */}
<div className="w-9 h-9 border-2 border-[var(--color-gold)] rotate-45 flex items-center justify-center">
  <div className="w-4 h-4 bg-[var(--color-gold)]" />
</div>
<span className="font-[family-name:var(--font-display)] text-[1.8rem] tracking-[6px] text-[#f5f2ed]">
  MOE KOMPOZİT
</span>
```

### Nav Link Stili
```css
/* Referans */
color: var(--light);           /* #c0c0c0 */
font-size: 0.8rem;
letter-spacing: 3px;
text-transform: uppercase;
font-weight: 500;

/* Hover */
color: var(--gold);
::after { width: 100%; }       /* altın underline slide */

/* ::after base */
position: absolute; bottom: -4px; left: 0;
width: 0; height: 1px;
background: var(--gold);
transition: width 0.3s;
```

### CTA Butonu (nav'daki "Teklif Al")
```css
padding: 10px 28px;
border: 1px solid var(--gold);
color: var(--gold);
font-size: 0.75rem;
letter-spacing: 3px;
/* Hover: background: gold, color: carbon */
/* ::after: display: none (underline yok) */
```

### Scroll Glassmorphism
```css
/* nav.scrolled */
background: rgba(10,10,10,0.95);
backdrop-filter: blur(20px);
border-bottom: 1px solid rgba(201,169,110,0.15);
padding: 0.8rem 3rem;  /* küçülüyor */
```

### Checklist
- [x] Logo diamond ikonu doğru render ediyor (rotated border + inner fill)
- [x] Logo Bebas Neue font, letter-spacing: 6px
- [x] Nav link rengi `#c0c0c0` (silver/light), uppercase, 0.8rem, letter-spacing: 3px
- [x] Nav link hover: `var(--color-gold)` + `::after` underline slide animasyonu
- [x] Nav CTA: gold border, font-size 0.75rem, letter-spacing 3px
- [x] Nav CTA hover: gold fill + carbon text, `::after` display: none
- [x] Scroll sonrası: blur arkaplan + gold bottom border
- [x] Mobile hamburger: 3 satır, `background: var(--cream)`, `width: 28px`
- [x] Mobile menü açılınca: `background: rgba(10,10,10,0.98)`, gold bottom border

---

## V2-C3 — Hero Section

**Dosya:** `frontend/src/app/[locale]/page.tsx` (hero block) + `globals.css`

Referans HTML hero CSS (satır 173-325):

### Arka Plan Katmanları
```tsx
{/* 1: hero-bg */}
<div className="absolute inset-0" style={{background: `
  radial-gradient(ellipse at 20% 50%, rgba(201,169,110,0.08) 0%, transparent 60%),
  radial-gradient(ellipse at 80% 20%, rgba(201,169,110,0.05) 0%, transparent 50%),
  linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)
`}} />
{/* 2: gold grid */}
<div className="gold-grid-bg absolute inset-0" />
{/* 3: carbon texture body'den geliyor */}
```

### Hero İçerik
```css
/* hero-label */
font-size: 0.75rem; letter-spacing: 8px; text-transform: uppercase;
color: var(--gold); margin-bottom: 2rem;
opacity: 0; animation: fadeUp 1s 0.3s forwards;

/* hero h1 */
font-family: 'Bebas Neue', sans-serif;
font-size: clamp(3.5rem, 10vw, 8rem);
line-height: 0.95; letter-spacing: 4px;
color: var(--white); margin-bottom: 2rem;
/* H1 ANİMASYON YOK — opacity: 1 başlangıçta (LCP kuralı) */

/* hero h1 em */
font-family: 'Cormorant Garamond', serif;
font-style: italic; font-weight: 400;
color: var(--gold);

/* hero-desc */
font-size: 1.1rem; color: var(--silver); max-width: 600px;
margin: 0 auto 3rem; font-weight: 300; line-height: 1.8;
opacity: 0; animation: fadeUp 1s 0.7s forwards;

/* btn-primary */
padding: 16px 48px; background: var(--gold); color: var(--carbon);
font-size: 0.75rem; letter-spacing: 4px; text-transform: uppercase;
font-weight: 600;
/* ::before: shimmer sweep on hover */

/* btn-outline */
padding: 16px 48px; border: 1px solid var(--silver);
color: var(--cream); font-size: 0.75rem; letter-spacing: 4px;
/* hover: border-color: gold, color: gold */

/* hero-scroll */
position: absolute; bottom: 3rem; left: 50%; translateX(-50%);
color: var(--silver); font-size: 0.65rem; letter-spacing: 4px;
opacity: 0; animation: fadeUp 1s 1.2s forwards;

/* scroll-line */
width: 1px; height: 40px;
background: linear-gradient(to bottom, var(--gold), transparent);
animation: scrollPulse 2s infinite;
```

- [x] Hero tam ekran (`min-height: 100vh`, centered content)
- [x] Radial gradient arkaplan (3 katman) uygulandı
- [x] Gold grid overlay uygulandı
- [x] Carbon texture body'den hero'ya aktarılıyor
- [x] Hero label: gold, letter-spacing: 8px, fadeUp animasyon 0.3s delay
- [x] H1: Bebas Neue, clamp(3.5rem, 10vw, 8rem), LH 0.95, **animasyon YOK**
- [x] H1 içinde `<em>`: Cormorant Garamond italic, gold rengi
- [x] Hero desc: silver, font-weight: 300, fadeUp 0.7s delay
- [x] btn-primary: gold fill, 16px 48px padding, shimmer hover efekti
- [x] btn-outline: silver border, gold hover
- [x] Scroll indicator: alt orta, animasyonlu gold çizgi (`scrollPulse` referansla uyumlu)
- [x] Mobile: butonlar alt alta, H1 responsive küçülüyor

---

## V2-C4 — Stats Bar

**Dosya:** `frontend/src/components/sections/StatsBar.tsx`

Referans (satır 326-357):
```css
.stats-bar {
  display: grid; grid-template-columns: repeat(4, 1fr);
  border-top: 1px solid rgba(201,169,110,0.15);
  border-bottom: 1px solid rgba(201,169,110,0.15);
}
.stat-item {
  padding: 3rem 2rem; text-align: center;
  border-right: 1px solid rgba(201,169,110,0.1);
}
.stat-item:last-child { border-right: none; }
.stat-item:hover { background: rgba(201,169,110,0.03); }
.stat-number { font-family: 'Bebas Neue'; font-size: 3rem; color: var(--gold); }
.stat-label { font-size: 0.7rem; letter-spacing: 3px; text-transform: uppercase; color: var(--silver); }
```

Veriler admin panelden `kompozit__home.stats` key'i ile gelecek (Codex ekleyecek).

- [x] 4 kolon grid, gold top/bottom border (0.15 opacity)
- [x] Dikey gold ayırıcı (0.1 opacity), son öğede yok
- [x] Stat number: Bebas Neue, 3rem, gold
- [x] Stat label: 0.7rem, letter-spacing: 3px, uppercase, silver
- [x] Hover: çok hafif gold arka plan (`rgba(201,169,110,0.03)`)
- [x] `data-testid="stats-bar"` var
- [x] Mobile: 2x2 grid

---

## V2-C5 — About Section

**Dosya:** `frontend/src/app/[locale]/page.tsx` (about block)

Referans (satır 396-469):
```css
.about { background: var(--graphite); }  /* #1a1a1a */
.about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6rem; max-width: 1300px; align-items: center; }
.about-visual { position: relative; height: 500px; }
.about-img-main {
  width: 100%; height: 100%;
  background: linear-gradient(135deg, var(--steel) 0%, var(--fiber) 50%, var(--steel) 100%);
}
/* ::before: grid lines */
/* ::after: "COMPOSITE\nSTRUCTURE" Bebas Neue watermark, opacity: 0.08 */
.about-accent {
  position: absolute; bottom: -2rem; right: -2rem;
  width: 200px; height: 200px;
  border: 1px solid var(--gold); opacity: 0.3;
}
.about-text-content h3 { font-family: 'Cormorant Garamond'; font-size: 1.6rem; italic; }
```

- [x] About section arkaplanı `#1a1a1a` (graphite)
- [x] 2 kolon grid, 6rem gap, 1300px max-width
- [x] Sol görsel: fiber gradyan placeholder, grid lines overlay, "COMPOSITE STRUCTURE" watermark
- [x] Gold accent square (bottom-right, 200x200, border: 1px gold, opacity 0.3)
- [x] Section-label: gold, uppercase, letter-spacing: 6px
- [x] H2: Bebas Neue + `<em>` Cormorant italic gold
- [x] Serif italic h3 (`"Where science meets craftsmanship"`)
- [x] Body text: silver, font-weight: 300, line-height: 1.9
- [x] Mobile: tek kolon, görsel önce

---

## V2-C6 — Materials Section

**Dosya:** `frontend/src/components/sections/MaterialCards.tsx`

Referans CSS zaten `globals.css`'te `.material-card` class'ında. Kontrol et:

- [x] Cards arkaplanı `var(--color-graphite)` (#1a1a1a)
- [x] `::before`: gold gradient, `transform: scaleX(0)` → hover'da `scaleX(1)` (sol→sağ)
- [x] Hover: `background: var(--color-steel)` (#2a2a2a)
- [x] Material icon: 60x60px, gold border, Bebas Neue "CF" / "GF" text, gold rengi
- [x] H3: Bebas Neue, 1.8rem, letter-spacing: 3px, cream/white
- [x] Spec grid: 2x2, `background: rgba(0,0,0,0.3)`
- [x] Spec value: Bebas Neue, 1.4rem, gold
- [x] Spec label: 0.7rem, letter-spacing: 2px, uppercase, silver
- [x] 2px gap aralığı korunuyor
- [x] `data-testid="material-cards"` var
- [x] Mobile: tek kolon

---

## V2-C7 — Products Section

**Dosya:** `frontend/src/app/[locale]/page.tsx` (products grid)

Referans CSS (satır 564-672):
```css
.products { background: var(--graphite); }
.products-showcase { grid-template-columns: repeat(3, 1fr); gap: 2px; max-width: 1300px; }
.product-visual { height: 400px; }
.product-card:hover .product-visual { transform: scale(1.03); }
/* Her kart farklı radial gradient placeholder */
.product-number {
  position: absolute; top: 1.5rem; left: 1.5rem;
  font-family: 'Bebas Neue'; font-size: 0.8rem; letter-spacing: 4px;
  color: var(--gold); opacity: 0.6;
}
/* product-icon-lg: 4rem, opacity: 0.15 → hover: 0.25 */
.product-info { padding: 2.5rem; }
.product-info h3 { Bebas Neue 1.6rem, letter-spacing: 3px; }
.product-info p { silver, font-weight: 300, 0.95rem }
.product-tag { border: 1px solid rgba(201,169,110,0.2); font-size: 0.65rem; letter-spacing: 2px; color: var(--gold); }
```

- [x] Products section arkaplanı graphite
- [x] 3 kolon grid, 2px gap
- [x] Görsel alan: 400px yükseklik, her kart için farklı radial gradient (warm, cool tones)
- [x] Sol üst köşede ürün numarası (01 / PRODUCT formatında)
- [x] Orta büyük icon (transparent): hover'da biraz daha görünür
- [x] Hover: scale(1.03) transition: 0.6s
- [x] Ürün adı: Bebas Neue 1.6rem
- [x] Product-tag: gold border (0.2 opacity), gold text, uppercase, 0.65rem
- [x] Veriler API'den (`/products?item_type=kompozit`) çekiliyor, fallback mock var
- [x] Mobile: tek kolon | Tablet: 2 kolon

---

## V2-C8 — Process Timeline

**Dosya:** `frontend/src/components/sections/ProcessTimeline.tsx`

Referans CSS (satır 673-760):
```css
.process { background: var(--carbon); }
.process-timeline::before {
  left: 50%; width: 1px;
  background: linear-gradient(to bottom, var(--gold), rgba(201,169,110,0.1));
}
.process-step { grid-template-columns: 1fr 1fr; gap: 4rem; }
.process-step::before { /* gold dot */
  left: 50%; top: 1.5rem; width: 12px; height: 12px;
  background: var(--gold); border-radius: 50%;
  box-shadow: 0 0 20px rgba(201,169,110,0.3);
}
/* ODD: content sol (text-right, padding-right: 3rem), number sağ */
/* EVEN: content sağ (text-left, padding-left: 3rem), number sol */
.step-num { Bebas Neue, 5rem, rgba(201,169,110,0.1) — dekoratif }
.step-content h3 { Bebas Neue, 1.5rem, letter-spacing: 3px }
.step-content p { silver, 0.95rem, font-weight: 300 }
```

- [x] Carbon arkaplan
- [x] Merkez gold gradient çizgi (1px, top-to-bottom fades) — `ProcessTimeline` dikey eksen
- [x] Gold dot her adımda (12px, glow shadow)
- [x] Tek adımlar (1,3,5): content sol, number sağ
- [x] Çift adımlar (2,4): content sağ, number sol
- [x] Büyük soluk step number (5rem, opacity 0.1)
- [x] Mobile: tek kolon, çizgi sola taşınıyor

---

## V2-C9 — Advantages / Why Us

**Dosya:** `frontend/src/app/[locale]/page.tsx` (whyUs block)

Referans CSS (satır 762-817):
```css
.advantages { background: var(--graphite); }
.advantages-grid { grid-template-columns: repeat(3, 1fr); gap: 2px; max-width: 1300px; }
.advantage-item { padding: 3rem 2.5rem; background: var(--carbon); }
.advantage-item::after {
  position: absolute; bottom: 0; left: 0;
  width: 100%; height: 2px; background: var(--gold);
  transform: scaleX(0);  /* hover'da scaleX(1) */
}
.advantage-num { Bebas Neue, 2.5rem, rgba(201,169,110,0.15) }
.advantage-item h3 { Bebas Neue, 1.2rem, letter-spacing: 2px, white }
.advantage-item p { silver, 0.9rem, font-weight: 300 }
```

- [x] Graphite section arkaplanı
- [x] 3 kolon grid, 2px gap
- [x] Her kart: carbon arkaplan, bottom gold slide animation
- [x] Büyük dekoratif sayı (01, 02, 03...) — gold, %15 opacity
- [x] Başlık: Bebas Neue, letter-spacing: 2px
- [x] Hover: kart aydınlanıyor + bottom gold şerit açılıyor
- [x] Advantage kartları: Kalite, Deneyim, Özel İmalat, Teslimat (+ ek value-prop anahtarları DB/i18n)
- [x] Veriler `valuePropsApi` veya i18n fallback

---

## V2-C10 — Gallery Section

**Dosya:** `frontend/src/app/[locale]/page.tsx` (gallery block)

Referans CSS (satır 819-922):
```css
.gallery { padding: 8rem 0; }  /* yan padding YOK — full bleed */
.gallery-grid {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 2px;
}
.gallery-item { height: 350px; }
/* 1. öğe: grid-row: span 2, height: auto */
/* 4. öğe: grid-row: span 2, height: auto */
/* Her öğe farklı renk gradyan */
.gallery-item::before {
  background: linear-gradient(to top, rgba(10,10,10,0.8) 0%, transparent 50%);
  opacity: 0 → hover: 1;
}
.gallery-caption {
  position: absolute; bottom: 1.5rem; left: 1.5rem;
  opacity: 0; transform: translateY(10px) → hover: visible
}
.gallery-caption span { gold, 0.7rem, letter-spacing: 3px }
.gallery-caption h4 { Bebas Neue, 1.3rem }
.gallery-weave {
  repeating-linear-gradient(45deg, ...) + repeating-linear-gradient(-45deg, ...);
  /* fiber weave texture */
}
```

- [x] Full-bleed galeri (section padding-left/right: 0)
- [x] 4 kolon grid, 2px gap
- [x] 1. ve 4. item `grid-row: span 2` (uzun)
- [x] Her item için karanlık color-hint gradyanlar
- [x] Hover: alttan karanlık overlay opacity geçişi
- [x] Hover: caption fade-up (span: gold label, h4: Bebas Neue başlık)
- [x] Fiber weave texture overlay her item'da
- [x] Veriler `/galleries?module_key=kompozit` API'den
- [x] Mobile: 2 kolon, span kaldırılıyor

---

## V2-C11 — Industries Strip

**Dosya:** `frontend/src/components/sections/IndustryStrip.tsx`

Referans CSS (satır 924-978):
```css
.industries { background: var(--graphite); }
.industries-flex { display: flex; gap: 2px; max-width: 1300px; }
.industry-item {
  flex: 1; padding: 3rem 2rem; background: var(--carbon); text-align: center;
}
.industry-item::before { /* radial gold glow center bottom */ opacity: 0 → hover: 1 }
.industry-item:hover { transform: translateY(-4px); }
.industry-icon { font-size: 2rem; margin-bottom: 1.5rem; }
.industry-item h4 { Bebas Neue, 1.1rem, letter-spacing: 3px }
.industry-item p { silver, 0.85rem, font-weight: 300 }
```

- [x] Graphite arkaplan, flex layout (tüm itemlar eşit genişlik)
- [x] Her item carbon arkaplan
- [x] Hover: `translateY(-4px)` + radial gold glow alt-merkez
- [x] İkon: 2rem emoji/svg, margin-bottom: 1.5rem
- [x] Başlık: Bebas Neue, letter-spacing: 3px
- [x] Açıklama: silver, 0.85rem
- [x] Mobile: dikey kolon ya da scroll

---

## V2-C12 — Testimonial

**Dosya:** `frontend/src/components/sections/HomeTestimonial.tsx`

Referans CSS (satır 980-1016):
```css
.testimonial { background: var(--carbon); text-align: center; padding: 10rem 3rem; }
.testimonial::before {
  content: '"';
  font-family: 'Cormorant Garamond'; font-size: 15rem;
  color: rgba(201,169,110,0.06);
  position: absolute; top: 2rem; left: 50%; translateX(-50%);
}
.testimonial blockquote {
  font-family: 'Cormorant Garamond'; font-style: italic;
  font-size: clamp(1.5rem, 3vw, 2.2rem); color: var(--cream);
  max-width: 800px; line-height: 1.6;
}
.testimonial-author { font-size: 0.75rem; letter-spacing: 4px; uppercase; color: var(--gold); }
```

- [x] Carbon arkaplan, 10rem padding
- [x] Büyük dekoratif tırnak: Cormorant Garamond, 15rem, opacity 0.06
- [x] Alıntı: Cormorant Garamond italic, clamp(1.5rem, 3vw, 2.2rem)
- [x] Yazar: 0.75rem, letter-spacing: 4px, uppercase, gold

---

## V2-C13 — CTA Section

**Dosya:** `frontend/src/app/[locale]/page.tsx` veya ilgili CTA bileşeni

Referans CSS (satır 1018-1051):
```css
.cta-section {
  background: linear-gradient(135deg, var(--graphite) 0%, var(--carbon) 100%);
  padding: 10rem 3rem; text-align: center;
}
.cta-section::before {
  position: absolute; top: -50%; left: -50%; width: 200%; height: 200%;
  background:
    radial-gradient(circle at 30% 50%, rgba(201,169,110,0.04) 0%, transparent 40%),
    radial-gradient(circle at 70% 50%, rgba(201,169,110,0.03) 0%, transparent 40%);
  animation: ctaGlow 8s ease-in-out infinite alternate;
}
```

- [x] Gradient arkaplan (graphite → carbon, 135deg)
- [x] Animasyonlu radial glow overlay
- [x] H2: Bebas Neue, clamp(2.5rem, 6vw, 4.5rem)
- [x] Desc: silver, max-width: 600px, 3rem margin-bottom
- [x] İki buton: `btn-primary` (gold fill) + `btn-outline` (silver border)

---

## V2-C14 — Contact Bölümü Ana Sayfada

**Referans HTML:** `compositecraft-website.html` §contact — Ana sayfada inline form var.

Mevcut implementasyonda `/contact` ayrı sayfada.

**Karar: Seçenek B** — Tam form `/contact` sayfasında; ana sayfada `contact.homeTeaser` metni + `/contact` CTA (`HomeContact`).

- [x] Kullanıcı kararı: Seçenek B (form `/contact`'ta, home'da CTA)
- [x] `ContactFormSection` (`ContactFormClient` + V2 shell + `Reveal`) ayrı bileşen: `frontend/src/components/sections/ContactFormSection.tsx` — **kullanım:** `/contact` sayfası
- [ ] **(Seçenek A — isteğe bağlı)** Aynı `ContactFormSection`’ı `HomeContact` içinde göstermek (şu an home’da CTA ile `/contact`’a yönlendirme)

---

## V2-C15 — Footer

**Dosya:** `frontend/src/components/layout/Footer.tsx`

Referans CSS (satır 1146-1227):
```css
footer { background: var(--carbon); border-top: 1px solid rgba(201,169,110,0.1); padding: 5rem 3rem 2rem; }
.footer-top { grid-template-columns: 2fr 1fr 1fr 1fr; gap: 4rem; max-width: 1300px; }
.footer-brand p { silver, 0.9rem, font-weight: 300 }
.footer-col h4 { Bebas Neue, 1rem, letter-spacing: 3px, white, margin-bottom: 1.5rem }
.footer-col a { silver, 0.9rem, font-weight: 300 → hover: gold }
.footer-bottom { border-top: 1px solid rgba(201,169,110,0.08); padding-top: 2rem; }
.footer-social a { silver, 0.75rem, letter-spacing: 2px → hover: gold }
```

- [x] Carbon arkaplan, gold top border (0.1 opacity)
- [x] 4 kolon: marka (2fr) + 3 link kolonu (1fr each)
- [x] Brand desc: silver, 0.9rem, font-weight: 300
- [x] Kolon başlıkları: Bebas Neue, letter-spacing: 3px
- [x] Linkler: silver → gold hover
- [x] Footer bottom: copyright sol + sosyal sağ (LinkedIn / Instagram / YouTube — `site_settings.socials`)
- [x] Veriler DB'den (footer_sections API; menü ayrı `Header` kaynağı)
- [x] Tablet: 2x2 grid | Mobile: tek kolon

---

## V2-C16 — Solutions & Products Detay Sayfaları

**Dosyalar:**
- `frontend/src/app/[locale]/solutions/page.tsx` + `[slug]/page.tsx`
- `frontend/src/app/[locale]/products/page.tsx` + `[slug]/page.tsx`

Referans HTML'de bu sayfalar yok ama tasarım diline uygun olmalı:

- [x] Solutions list: kart grid, referans HTML ürün kartı stilinde (dark gradyan, product number)
- [x] Products list: referans products-showcase stilinde
- [x] Product detail: büyük görsel, specs, tags, related products (V2 karbon/gold shell + `prose-invert`)
- [x] Solution detail: hero (Bebas + kapak görseli), `prose-invert` içerik, CTA; spec tablo / ek galeri blokları içerikten geliyor

---

## V2-C17 — Scroll Reveal Animasyonları

Referans HTML JS (1868. satır civarı): `IntersectionObserver` ile `.reveal` class → `.visible`.

**Mevcut `Reveal` componenti** (`frontend/src/components/motion/Reveal.tsx`) kullanılıyor.

- [x] Ana sayfa section'larında `Reveal` + `.reveal` / `globals.css` ile tutarlı
- [x] Animasyon: `opacity: 0, translateY(40px)` → `opacity: 1, translateY(0)`, transition: 0.8s cubic-bezier(0.16, 1, 0.3, 1)
- [x] `prefers-reduced-motion` dikkate alınıyor (`Reveal` + CSS)

---

## Teslim Kriterleri

### Otomatik (repo / CI)

- [x] `npm run build` / `bun run build` hatasız
- [x] `bun run type-check` hatasız
- [x] CI: `deploy.yml` içinde frontend build sonrası `test:smoke:home-content:offline` + `test:smoke:home-api:offline`
- [x] PR: `.github/workflows/ci.yml` — `main` hedefli PR’larda **paralel** üç job: backend build, frontend (type-check + build + offline smoke), admin_panel build
- [x] Canlı API smoke altyapısı: yerelde `cd frontend && bun run test:smoke:home-api && bun run test:smoke:home-content` (çalışan `NEXT_PUBLIC_API_URL` / `SMOKE_API_BASE_URL` gerekir); GitHub’da **Actions → Smoke API (canlı)** (`.github/workflows/smoke-api.yml`) ile `api_base_url` girilerek aynı doğrulama uzaktan çalıştırılabilir

### Manuel (QA / görsel)

- [ ] Her section referans HTML ile yan yana görsel tutarlılık — `docs/V2_ANTIGRAVITY.md` C1–C17 checklist
- [ ] Antigravity: `docs/V2_ANTIGRAVITY.md` manuel maddeleri tamamlanınca orada ve burada işaretle
