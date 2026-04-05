# ANTIGRAVITY v1.0 | CompositeCraft Design System

This document outlines the industrial-luxury design system implemented for the Kompozit platform, ensuring absolute parity with the high-fidelity B2B reference design.

## 1. Visual Hierarchy & Grid System

- **Technical Grid**: All sections utilize an 80px technical padding standard (`section-py`).
- **Industrial Grid**: The `.industrial-grid-cc` pattern implements a 2px gap system with `.grid-item-cc` as the primary container.
- **Luminance Masking**: Sections utilize `radial-gradient(ellipse_at_center, transparent 0%, var(--carbon) 80%)` to create focus and depth.
- **Background Decor**: The `.gold-grid-bg` overlay (15% gold opacity) provides the technical blueprint aesthetic across all interior pages.

## 2. Typography System (EDITORIAL WEIGHTS)

- **Display (Bebas Neue)**: Used for all uppercase headings, labels, and primary navigation links. 
  - `section-label-cc`: 0.75rem, tracking 8px, gold.
  - `section-title-cc`: clamp(3rem, 8vw, 5rem), tracking-normal, white.
- **Serif (Cormorant Garamond)**: Used for italics, emphasis, and quote-led intros.
  - `font-serif`: Used to add "High-End Engineering" authority to descriptions.
- **Sans (DM Sans)**: The primary body copy and technical specification font.

## 3. Color Tokens (ABSOLUTE CARBON)

- `--carbon`: #0B0B0B (The foundation).
- `--graphite`: #101010 (Elevation).
- `--gold`: #C9A96E (The premium accent, 24K shade).
- `--silver`: #A8A8A8 (Technical readability).
- `--cream`: #F9F7F2 (The lux-white contrast).

## 4. Component Standards

- **Buttons**:
  - `.hero-btn-primary`: Solid gold background with carbon text and shimmer hover.
  - `.hero-btn-outline`: 15% gold border with transparent background and gold hover.
- **Cards**:
  - `ListingCard`: 1fr/1fr layout with technical specification metrics and gold-border transparency.
  - `MediaOverlayCard`: Full-height image focus with editorial-style caption overlays.
- **Navigation**:
  - Sticky header with glassmorphic blur and technical "Diamond" branding.
  - Full-screen mobile menu with editorial typography transitions.

## 5. Maintenance Guidelines

When adding new components:
1. Wrap root elements in the `.industrial-grid-cc`.
2. Use the `Reveal` motion component for entrance.
3. Ensure all gold accents use the standardized CSS variables for opacity control (e.g., `var(--gold)/15`).
4. Always prioritize typographic tracking over font-size for industrial "Luxury" feel.
