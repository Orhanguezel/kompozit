Tamam, şimdi **König Energetik** branding için logo ve favicon'u detaylı özelleştirelim ve actual files oluşturalım!

## 👑 KÖNIG ENERGETIK - LOGO & FAVICON DETAYLARI

### 🎨 Logo Tasarım Stratejisi

Mevcut Flower of Life + Hands sembolünü 3 versiyonda adapte edeceğiz:

#### **Version 1: Full Logo - Primary (Header, Cards, Print)**
```
┌───────────────────────────────────┐
│                                   │
│    [Flower of Life + Hands]       │  (Original symbol)
│          (160px height)           │
│                                   │
│      KÖNIG ENERGETIK              │  (Inter Bold, 24px, tracking: 0.15em)
│      Anastasia König              │  (Crimson Pro Light, 16px, tracking: 0.05em)
│   Heilende Berührung mit Herz     │  (Inter Regular, 12px, tracking: 0.02em)
│                                   │
└───────────────────────────────────┘
```

**Renk Varyasyonları:**
- **Light BG:** Logo coral (#D88D7E), text dark sand (#2D2520)
- **Dark BG:** Logo light coral (#F4BDB3), text sand (#FDFCFB)
- **Gradient BG:** Logo strong coral (#C77665), text balanced

---

#### **Version 2: Horizontal Logo (Navigation, Mobile)**
```
┌────────────────────────────────────────────────┐
│  [Symbol]  KÖNIG ENERGETIK                     │
│  (48px)    Anastasia König                     │
└────────────────────────────────────────────────┘
```

**Use case:** Header navigation, mobile menu, compact spaces

---

#### **Version 3: Icon Only (Favicon, Social, App Icons)**
```
┌──────────┐
│  [🌸👐]   │  (Simplified Flower + Hands)
│          │  (No text, pure symbol)
└──────────┘
```

---

### 🎯 FAVICON DESIGN - Detailed Specifications

Favicon için **3 farklı size** optimize edeceğiz:

#### **1. Small Sizes (16x16, 32x32) - Simplified**
```
Design approach:
- Sadece Flower of Life'ın merkezi
- 3-4 circle layer (tam pattern değil)
- High contrast
- No hands (too detailed for small size)
- Solid color, no gradients
```

**Color:**
- Background: Transparent OR white/black
- Icon: Single color coral (#D88D7E)

---

#### **2. Medium Size (64x64, 128x128) - Balanced**
```
Design approach:
- Flower of Life merkez + 1 layer surrounding circles
- Hands silhouette (simplified, stylized)
- Slight gradient allowed
```

**Color:**
- Background: Soft gradient (rose-50 to rose-100)
- Icon: Coral (#D88D7E) with light coral (#F4BDB3) accent

---

#### **3. Large Sizes (180x180, 512x512) - Full Detail**
```
Design approach:
- Complete Flower of Life pattern
- Detailed hands illustration
- Soft shadow/glow effect
- Full color palette
```

**Color:**
- Background: Gradient (rose-50 to white)
- Icon: Full coral palette with gold accents
- Glow: Soft shadow (#E8A598 at 15% opacity)

---

### 📐 LOGO FILES - Complete Package

Şimdi sana actual SVG codes'larını oluşturayım:

#### **1. Primary Logo - Light Background**

```svg
<!-- koenig-energetik-primary-light.svg -->
<svg width="400" height="500" viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Subtle gradient for symbol -->
    <linearGradient id="symbolGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#E8A598;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#D88D7E;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Flower of Life + Hands Symbol (simplified for illustration) -->
  <g id="symbol" transform="translate(200, 140)">
    <!-- Outer circle -->
    <circle cx="0" cy="0" r="80" fill="none" stroke="url(#symbolGradient)" stroke-width="2"/>

    <!-- Flower of Life pattern (simplified - 7 circles) -->
    <circle cx="0" cy="0" r="25" fill="none" stroke="#D88D7E" stroke-width="1.5"/>
    <circle cx="22" cy="0" r="25" fill="none" stroke="#D88D7E" stroke-width="1.5"/>
    <circle cx="-22" cy="0" r="25" fill="none" stroke="#D88D7E" stroke-width="1.5"/>
    <circle cx="11" cy="19" r="25" fill="none" stroke="#D88D7E" stroke-width="1.5"/>
    <circle cx="-11" cy="19" r="25" fill="none" stroke="#D88D7E" stroke-width="1.5"/>
    <circle cx="11" cy="-19" r="25" fill="none" stroke="#D88D7E" stroke-width="1.5"/>
    <circle cx="-11" cy="-19" r="25" fill="none" stroke="#D88D7E" stroke-width="1.5"/>

    <!-- Hands silhouette (abstract representation) -->
    <path d="M -60 50 Q -50 40 -40 50 L -30 60 L -50 70 Z" fill="#F4BDB3" opacity="0.7"/>
    <path d="M 60 50 Q 50 40 40 50 L 30 60 L 50 70 Z" fill="#F4BDB3" opacity="0.7"/>
  </g>

  <!-- Text -->
  <text x="200" y="320" font-family="Inter, sans-serif" font-size="32" font-weight="700"
        text-anchor="middle" letter-spacing="4.8" fill="#2D2520">
    KÖNIG ENERGETIK
  </text>

  <text x="200" y="355" font-family="Crimson Pro, serif" font-size="20" font-weight="300"
        text-anchor="middle" letter-spacing="1" fill="#4A4139">
    Anastasia König
  </text>

  <text x="200" y="385" font-family="Inter, sans-serif" font-size="14" font-weight="400"
        text-anchor="middle" letter-spacing="0.3" fill="#C9BFB3">
    Heilende Berührung mit Herz
  </text>
</svg>
```

---

#### **2. Horizontal Logo - For Navigation**

```svg
<!-- koenig-energetik-horizontal.svg -->
<svg width="500" height="80" viewBox="0 0 500 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="symbolGradH" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#E8A598;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#D88D7E;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Symbol (compact) -->
  <g id="symbol-compact" transform="translate(40, 40)">
    <circle cx="0" cy="0" r="32" fill="none" stroke="url(#symbolGradH)" stroke-width="1.5"/>

    <!-- Simplified Flower of Life -->
    <circle cx="0" cy="0" r="12" fill="none" stroke="#D88D7E" stroke-width="1"/>
    <circle cx="10" cy="0" r="12" fill="none" stroke="#D88D7E" stroke-width="1"/>
    <circle cx="-10" cy="0" r="12" fill="none" stroke="#D88D7E" stroke-width="1"/>
    <circle cx="5" cy="8.7" r="12" fill="none" stroke="#D88D7E" stroke-width="1"/>
    <circle cx="-5" cy="8.7" r="12" fill="none" stroke="#D88D7E" stroke-width="1"/>
    <circle cx="5" cy="-8.7" r="12" fill="none" stroke="#D88D7E" stroke-width="1"/>
    <circle cx="-5" cy="-8.7" r="12" fill="none" stroke="#D88D7E" stroke-width="1"/>

    <!-- Hands hint -->
    <path d="M -25 20 Q -20 17 -15 20" fill="none" stroke="#F4BDB3" stroke-width="2" opacity="0.6"/>
    <path d="M 25 20 Q 20 17 15 20" fill="none" stroke="#F4BDB3" stroke-width="2" opacity="0.6"/>
  </g>

  <!-- Text -->
  <text x="100" y="38" font-family="Inter, sans-serif" font-size="20" font-weight="700"
        letter-spacing="3" fill="#2D2520">
    KÖNIG ENERGETIK
  </text>

  <text x="100" y="58" font-family="Crimson Pro, serif" font-size="14" font-weight="300"
        letter-spacing="0.7" fill="#4A4139">
    Anastasia König
  </text>
</svg>
```

---

#### **3. Icon Only - For Favicon (Base)**

```svg
<!-- koenig-energetik-icon.svg -->
<svg width="256" height="256" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bgGradient">
      <stop offset="0%" style="stop-color:#FFF5F3;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#FFE8E3;stop-opacity:1" />
    </radialGradient>
    <linearGradient id="iconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#E8A598;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#C77665;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="256" height="256" rx="48" fill="url(#bgGradient)"/>

  <!-- Symbol centered -->
  <g transform="translate(128, 128)">
    <!-- Outer glow circle -->
    <circle cx="0" cy="0" r="90" fill="none" stroke="#E8A598" stroke-width="8" opacity="0.2"/>

    <!-- Main circle -->
    <circle cx="0" cy="0" r="80" fill="none" stroke="url(#iconGrad)" stroke-width="3"/>

    <!-- Flower of Life (7 circles) -->
    <g stroke="#D88D7E" stroke-width="2" fill="none">
      <circle cx="0" cy="0" r="28"/>
      <circle cx="24" cy="0" r="28"/>
      <circle cx="-24" cy="0" r="28"/>
      <circle cx="12" cy="20.8" r="28"/>
      <circle cx="-12" cy="20.8" r="28"/>
      <circle cx="12" cy="-20.8" r="28"/>
      <circle cx="-12" cy="-20.8" r="28"/>
    </g>

    <!-- Hands silhouette -->
    <g fill="#F4BDB3" opacity="0.8">
      <path d="M -55 45 Q -48 38 -42 42 L -38 50 Q -45 55 -52 52 Z"/>
      <path d="M 55 45 Q 48 38 42 42 L 38 50 Q 45 55 52 52 Z"/>
    </g>
  </g>
</svg>
```

---

### 🎨 FAVICON SIZE VARIATIONS

Şimdi her size için optimize versiyonlar:

#### **16x16 - Ultra Simplified**
```svg
<!-- favicon-16.svg -->
<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="16" height="16" rx="3" fill="#FFF5F3"/>

  <!-- Super simplified: Just 3 circles -->
  <g transform="translate(8, 8)" stroke="#D88D7E" stroke-width="1.2" fill="none">
    <circle cx="0" cy="0" r="6"/>
    <circle cx="0" cy="0" r="3"/>
    <circle cx="3" cy="0" r="3"/>
    <circle cx="-3" cy="0" r="3"/>
  </g>
</svg>
```

#### **32x32 - Simplified**
```svg
<!-- favicon-32.svg -->
<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" rx="6" fill="#FFF5F3"/>

  <g transform="translate(16, 16)" stroke="#D88D7E" stroke-width="1.5" fill="none">
    <circle cx="0" cy="0" r="12"/>
    <circle cx="0" cy="0" r="5"/>
    <circle cx="4" cy="0" r="5"/>
    <circle cx="-4" cy="0" r="5"/>
    <circle cx="2" cy="3.5" r="5"/>
    <circle cx="-2" cy="3.5" r="5"/>
  </g>

  <!-- Hands hint -->
  <path d="M 6 22 Q 8 20 10 22" stroke="#F4BDB3" stroke-width="1.5" fill="none"/>
  <path d="M 26 22 Q 24 20 22 22" stroke="#F4BDB3" stroke-width="1.5" fill="none"/>
</svg>
```

---

### 📦 COMPLETE FAVICON PACKAGE

Aşağıdaki dosyaları oluşturmalısın:

```
public/
├── logo/
│   ├── koenig-energetik-primary-light.svg      # Main logo (light bg)
│   ├── koenig-energetik-primary-dark.svg       # Main logo (dark bg)
│   ├── koenig-energetik-horizontal.svg         # Horizontal variant
│   ├── koenig-energetik-icon.svg               # Icon only (high res)
│   │
│   └── png/
│       ├── logo-primary-512.png                # Social media
│       ├── logo-primary-256.png
│       └── logo-horizontal-256.png
│
└── favicon/
    ├── favicon.ico                              # Multi-size .ico
    ├── favicon-16x16.png
    ├── favicon-32x32.png
    ├── favicon-96x96.png
    ├── apple-touch-icon.png                     # 180x180
    ├── android-chrome-192x192.png
    ├── android-chrome-512x512.png
    ├── mstile-150x150.png                       # Windows
    └── safari-pinned-tab.svg                    # Safari mask icon
```

---

### 🔧 HTML HEAD Implementation

```html
<!-- app/layout.tsx or index.html -->
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <!-- Primary Meta Tags -->
  <title>König Energetik - Energetische Massage Berlin | Anastasia König</title>
  <meta name="title" content="König Energetik - Energetische Massage Berlin | Anastasia König" />
  <meta name="description" content="König Energetik: Ganzheitliche energetische Massage in Berlin. Anastasia König bietet mobile Körperarbeit bei Ihnen zu Hause. Heilende Berührung mit Herz." />

  <!-- Favicons -->
  <link rel="icon" type="image/x-icon" href="/favicon/favicon.ico" />
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
  <link rel="icon" type="image/png" sizes="96x96" href="/favicon/favicon-96x96.png" />

  <!-- Apple Touch Icon -->
  <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />

  <!-- Android Chrome -->
  <link rel="icon" type="image/png" sizes="192x192" href="/favicon/android-chrome-192x192.png" />
  <link rel="icon" type="image/png" sizes="512x512" href="/favicon/android-chrome-512x512.png" />

  <!-- Safari Pinned Tab -->
  <link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#D88D7E" />

  <!-- MS Tiles -->
  <meta name="msapplication-TileColor" content="#FFF5F3" />
  <meta name="msapplication-TileImage" content="/favicon/mstile-150x150.png" />

  <!-- Theme Color -->
  <meta name="theme-color" content="#FDFCFB" />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://koenig-energetik.de/" />
  <meta property="og:title" content="König Energetik - Energetische Massage Berlin" />
  <meta property="og:description" content="Ganzheitliche energetische Massage in Berlin. Heilende Berührung mit Herz. Mobile Körperarbeit von Anastasia König." />
  <meta property="og:image" content="https://koenig-energetik.de/logo/png/logo-primary-512.png" />

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content="https://koenig-energetik.de/" />
  <meta property="twitter:title" content="König Energetik - Energetische Massage Berlin" />
  <meta property="twitter:description" content="Ganzheitliche energetische Massage in Berlin. Heilende Berührung mit Herz." />
  <meta property="twitter:image" content="https://koenig-energetik.de/logo/png/logo-primary-512.png" />
</head>
```

---

### 🎨 LOGO COLOR SPECIFICATIONS - Final Reference

```css
/* König Energetik Brand Colors - Final */
:root {
  /* Logo Primary Colors */
  --logo-coral-light: #F4BDB3;      /* Highlights, light bg text */
  --logo-coral: #E8A598;            /* Main brand color */
  --logo-coral-medium: #D88D7E;     /* Default logo on light */
  --logo-coral-dark: #C77665;       /* Logo on very light bg */
  --logo-coral-darkest: #A6604F;    /* Text, details */

  /* Background Colors for Logo */
  --logo-bg-light: #FDFCFB;         /* Light mode primary */
  --logo-bg-white: #FFFFFF;         /* Pure white */
  --logo-bg-dark: #1A1512;          /* Dark mode */
  --logo-bg-black: #0A0806;         /* Pure black */

  /* Logo Accents */
  --logo-gold: #E8C57A;             /* Accent touch */
  --logo-shadow: rgba(232, 165, 152, 0.15);  /* Soft glow */
}
```

---

### 🖼️ LOGO USAGE EXAMPLES

```typescript
// components/layout/header.tsx
import Image from 'next/image';
import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-sand-50 border-b border-sand-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <Image
            src="/logo/koenig-energetik-icon.svg"
            alt="König Energetik"
            width={48}
            height={48}
            className="w-12 h-12"
          />
          <div className="hidden sm:block">
            <div className="font-bold text-sm tracking-[0.15em] text-sand-900">
              KÖNIG ENERGETIK
            </div>
            <div className="font-serif text-xs text-sand-400 tracking-wide">
              Anastasia König
            </div>
          </div>
        </Link>

        {/* Navigation */}
        <nav>...</nav>
      </div>
    </header>
  );
}
```

---

Şimdi ne yapayım?

1. **🎨 Actual logo files oluşturayım** (SVG + PNG export)
2. **📱 Favicon generator script** yazayım
3. **🏗️ Component implementations** (Header, Footer with logos)
4. **📦 Complete brand package** ZIP olarak hazırlayayım

Hangisini istersin?