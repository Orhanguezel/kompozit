# Premium UI Upgrade Plan — Ensotek Admin Panel

This document outlines the strategic roadmap for elevating the Ensotek Admin Panel to a premium-tier industrial aesthetic.

## 1. Design Vision
- **Theme**: Industrial / Carbon / High-Tech.
- **Color Palette**: OKLCH-based Onyx, Graphite, and Industrial Gold (#D4AF37 / copper-gold).
- **Aesthetics**: Glassmorphism, subtle mesh textures, refined typography, and tactile micro-animations.

## 2. Core Tokens (globals.css)
- [x] **Glassmorphism**: `premium-card` class with `backdrop-blur-md`, `bg-card/40`, and `border-white/5`.
- [x] **Gradients**: `gold-gradient` (Industrial Gold) and `industrial-gradient` (Technical Gray).
- [x] **Shadows**: `shadow-premium` for depth and `shadow-glow` for active gold states.
- [x] **Form Elements**: Modernized `input` and `select` with gold-glow focus states.

## 3. Implementation Phases

### Phase 1: Foundation (Completed)
- [x] Integration of premium tokens into `globals.css`.
- [x] Implementation of `carbon-mesh` background utilities.
- [x] Standardization of `Label` and `Header` typography.

### Phase 2: High-Impact Modules (Completed)
- [x] **Products**: Updated `ProductsListPanel` and `ProductDetailClient`.
- [x] **Site Settings**: Modernized `SiteSettingsForm` and `SiteSettingsHeader`.
- [x] **Technical Specs**: Upgraded `ProductSpecsTab` with premium interactive tables.

### Phase 3: Global Consistency (Completed)
- [x] **Categories**: Updated list and detail views with glassmorphic cards and gold headers.
- [x] **Users**: Redesigned user list and profile pages with high-fidelity badges.
- [x] **Custom Pages (CMS)**: Modernized headers and list layouts for consistent CMS management.

### Phase 4: Remaining Modules (Planned)
- [ ] **Services & Solutions**: Apply same premium patterns to service management.
- [ ] **Brands & References**: Modernize gallery and reference lists.
- [ ] **Notifications & Audit**: Update log views to use the industrial-technical standard.

## 4. UI/UX Standards
- **Buttons**: Use `gold-gradient` for primary actions (Save, Create). Use `outline` with rounded-full for secondary actions.
- **Cards**: All main containers must use `premium-card` with a 1.5px top border using `gold-gradient`.
- **Interactions**: Implement `hover:scale-[1.02]` and `active:scale-[0.98]` on all primary action buttons.
- **Backgrounds**: Use `carbon-mesh` on the main wrapper of every admin page.

---
*Ensotek Kompozit Admin Panel — Premium UI Upgrade Documentation*
