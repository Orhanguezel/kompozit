# MOE Kompozit — Premium Tasarım Planı

> **Referans HTML:** `compositecraft-website.html` (repo kökü)
> **Hedef:** CompositeCraft tasarım dilini MOE Kompozit'e adapte etmek.
> **Orkestrasyon:** Claude Code (mimar) → Cursor (uygulama) → Antigravity (görsel onay) → Codex (toplu iş)

---

## Tasarım Dili Analizi — CompositeCraft HTML'den Çıkarılanlar

### Renk Paleti

```css
--carbon:    #0a0a0a   /* Ana zemin — tam siyah */
--graphite:  #1a1a1a   /* Bölüm arkaplanı */
--steel:     #2a2a2a   /* Hover state arkaplanı */
--fiber:     #3a3a3a   /* Border/ayırıcı */
--silver:    #8a8a8a   /* Body metin, açıklamalar */
--light:     #c0c0c0   /* Nav linkleri */
--cream:     #e8e4df   /* Başlıklar */
--gold:      #c9a96e   /* ANA VURGU — tüm accent'ler */
--gold-bright: #dbb978 /* Hover gold */
--white:     #f5f2ed   /* Hero H1, en yüksek kontrast metin */
```

**Mevcut turuncu brand → altın vurguya geçiş gerekiyor.**

### Tipografi

| Kullanım | Font | Özellik |
|----------|------|---------|
| Ana başlıklar, logo | **Bebas Neue** | All-caps, letter-spacing: 3-6px |
| Elegans vurgusu (em, blockquote) | **Cormorant Garamond** | Italic, serif, 400/600 |
| Body, nav, form | **DM Sans** | 300/400/500/600 |

**Mevcut: Syne + Inter → Hedef: Bebas Neue + Cormorant Garamond + DM Sans**

### Carbon Fiber Dokusu (CSS-only, görsel gerektirmez)

```css
.carbon-texture {
  background-image:
    linear-gradient(45deg,  rgba(255,255,255,0.02) 25%, transparent 25%),
    linear-gradient(-45deg, rgba(255,255,255,0.02) 25%, transparent 25%),
    linear-gradient(45deg,  transparent 75%, rgba(255,255,255,0.02) 75%),
    linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.02) 75%);
  background-size: 4px 4px;
  background-position: 0 0, 0 2px, 2px -2px, -2px 0px;
}
```

### Grid & Kart Sistemi

- **2px gap** — kartlar arası boşluk (grafik güç hissi)
- **Full-bleed section'lar** — max-width: 1300px içeride
- Hover'da `border-top: 3px solid gold` scale animasyonu (`.material-card::before`)
- Hover'da `border-bottom: 2px solid gold` scale animasyonu (`.advantage-item::after`)

---

## Sayfa Bölümleri — Hedef Yapı

### 1. Navigation (sabit, scroll'da glassmorphism)

```
[LOGO ◆ MOE KOMPOZİT]    [Ürünler] [Çözümler] [Galeri] [Hakkımızda] [İletişim]    [TEKLİF AL →]
```

- Şeffaf başlar, scroll'da: `bg: rgba(10,10,10,0.95)` + `backdrop-filter: blur(20px)` + gold alt border
- Logo: **Bebas Neue**, letter-spacing: 6px + dörtgen ikon
- Nav linkleri: 0.8rem, letter-spacing: 3px, uppercase, gold underline hover
- CTA: gold border + fill on hover

### 2. Hero (100vh)

```
[Arkaplan: radial gold glow + gold grid lines + carbon texture]

                    ── KARBON & CAM ELYAFı İMALATI ──   ← gold, uppercase, ls:8px
          GÜÇLÜ. HAFİF.        ← Bebas Neue, clamp(3.5rem, 10vw, 8rem)
            KOMPOZİT.          ← em içinde: Cormorant Garamond italic, gold

    Premium kompozit çözümler — savunma, enerji, peyzaj

       [ÜRÜNLER]    [TEKLİF AL]

                ↓ SCROLL
```

**LCP notu:** H1 başlangıçta görünür olmalı (opacity:1), sadece alt elementler animate olur.

### 3. Stats Bar (hero'nun hemen altı)

```
| 15+ YIL |   500+ PROJE |   AS9100   |   ISO 9001 |
  Deneyim     Teslim Edilen   Standart     Sertifikalı
```

- 4 kolon grid, gold border ayrımlar
- Sayı: **Bebas Neue** 3rem, gold
- Etiket: 0.7rem, letter-spacing: 3px, silver

### 4. Hakkımızda (graphite bg)

2 kolon: Sol — görsel placeholder (CSS gradient + fiber doku overlay) + gold accent kare, Sağ — metin

### 5. Malzeme Kartları (carbon bg)

2 kolon grid, 2px gap:

| Karbon Fiber | Cam Elyafı (CTP) |
|---|---|
| CF logo ikonu | GRP logo ikonu |
| Teknik özellikler: çekme mukavemeti, yoğunluk, elastisite modülü, termal |

Her kart: `border-top` gold slide animasyonu hover'da

### 6. Ürün Vitrini (graphite bg)

3 kolon grid, 2px gap — Mevcut `ListingCard` bu tasarıma uyarlanacak:

- Ürün görsel alanı: 400px height, CSS radial gradient arkaplan (görsel gelene kadar)
- Sol üst: ürün numarası, altın, küçük
- Alt: başlık (Bebas Neue) + açıklama + tag'ler

### 7. Üretim Süreci (carbon bg)

Alternatif sol/sağ timeline:

```
            │ ← gold çizgi
    ①       ●      Tasarım & Mühendislik
            ●      ②  Kalıp & Prototip
    ③       ●      Üretim
            ●      ④  Kalite Kontrolü
```

### 8. Avantajlarımız (graphite bg)

3 kolon grid — `FeatureCard`'a karşılık:

| 01 Hafiflik | 02 Dayanıklılık | 03 Korozyon Direnci |
| 04 Termal | 05 Tasarım Özgürlüğü | 06 Maliyet Verimliliği |

Her kart: `border-bottom` gold scale animasyonu hover'da

### 9. Galeri (carbon bg, full-bleed)

Mevcut bento grid korunur — 4 kolon masonry:
- `grid-item:nth-child(1)` → `grid-row: span 2` (büyük kart)
- Hover: caption fade-up, gold label + Bebas Neue başlık

### 10. Sektörler (graphite bg)

Yatay flex: Savunma | Enerji | Peyzaj | Depolama | Özel İmalat

Her ikon + başlık + kısa açıklama, hover'da `translateY(-4px)` + radial glow

### 11. Referans Alıntısı (carbon bg, merkez hizalı)

Cormorant Garamond, büyük italik alıntı — `"` işareti çok büyük, çok düşük opacity

### 12. CTA Bölümü (gradient bg)

Command Center görünümü — radial gold glow animasyonlu, büyük Bebas başlık + 2 buton

### 13. İletişim (graphite bg)

2 kolon: Sol — adres/telefon/email bilgileri, Sağ — form (gold focus border)

### 14. Footer

4 kolon: Marka açıklaması | Ürünler | Şirket | İletişim
Alt: telif + sosyal medya linkleri

---

## Token Değişim Tablosu

| Token | Mevcut | Yeni |
|-------|--------|------|
| `--color-brand` | `#f97316` (turuncu) | `#c9a96e` (gold) |
| `--color-brand-dark` | `#ea6b0c` | `#b8935a` |
| `--color-accent` | `#7c3aed` | `#dbb978` (gold-bright) |
| `--color-bg` | `#0a0a0a` | `#0a0a0a` (aynı) |
| `--color-bg-secondary` | `#141414` | `#1a1a1a` (graphite) |
| `--color-text-primary` | `#f5f5f5` | `#e8e4df` (cream) |
| `--color-text-secondary` | `#a3a3a3` | `#8a8a8a` (silver) |
| `--font-display` | Syne | **Bebas Neue** |
| `--font-sans` | Inter | **DM Sans** |
| Yeni: `--font-serif` | — | **Cormorant Garamond** |

---

## Mevcut Yapıyla Uyum Notları

- Tüm token değişimleri `frontend/src/styles/globals.css` içinde yapılır — component'lere dokunulmaz
- `next/font/google` ile: `Bebas_Neue`, `Cormorant_Garamond`, `DM_Sans` import edilecek
- `font-display` CSS variable `[locale]/layout.tsx` ile bağlanacak
- Admin panel tema sistemi bağımsız — sadece frontend etkilenir
- Mevcut `carbon-texture` CSS pattern korunur, spec'e uygun
- `motion-fade-up` class'ları korunur — hero H1'e uygulanmaz (LCP kuralı)

---

## Öncelik Sırası

```
1. Token güncelleme (renk + font)          → Cursor
2. Layout.tsx font import güncelleme        → Cursor
3. Nav bileşeni scroll davranışı            → Cursor
4. Hero bölümü grid + glow arkaplan        → Cursor
5. Stats bar yeni bileşeni                  → Cursor
6. Malzeme kartları bileşeni               → Cursor
7. Process timeline bileşeni               → Cursor
8. Sektörler bileşeni                       → Cursor
9. Referans alıntısı bileşeni              → Cursor
10. Kart hover animasyonları token'a uygun  → Cursor + Copilot
11. Görsel doğrulama (tüm bölümler)        → Antigravity
12. Accessibility + focus-visible           → Cursor
13. Build + type-check                      → Codex
```
