1: # Antigravity UI/UX Premium Overhaul Plan - Kompozit Homepage
2: 
3: This document outlines the strategic plan to elevate the MOE Kompozit homepage to a premium, high-conversion level using modern design principles, glassmorphism, and advanced micro-animations.
4: 
5: ## 🎯 Objective
6: Transform the existing sections into a world-class, premium industrial aesthetic that reflects the high-tech nature of composite manufacturing (Carbon Fiber, FRP, etc.).
7: 
8: ## 🛠 Design Pillars
9: 1.  **Precision Glassmorphism:** Refined borders, multiple layers of blur, and subtle specular highlights.
10: 2.  **Editorial Typography:** Leveraging the Syne display font for high-impact headlines with better rhythm and balance.
11: 3.  **Kinetic Experience:** Beyond simple fades; using staggered entrance animations and hover-driven parallax.
12: 4.  **Materiality:** Incorporating "Carbon Fiber" textures and industrial gradients to ground the digital experience in the physical product.
13: 
14: ---
15: 
16: ## ✅ Checklist
17: 
18: ### 1. Hero Section Execution
19: - [x] Implement a dynamic "Carbon Mesh" background pattern or a rich radial gradient.
20: - [x] Refine the Hero Card (Workflow) with multiple glass layers and a "Live Status" glow.
21: - [x] Improve CTA button aesthetics with a "shimmer" effect on hover.
22: - [x] Add a subtle "Carbon Fiber" texture to the dark background shell.
23: 
24: ### 2. "Why Us" (Features) Section
25: - [x] Replace standard icons with "Duo-tone Industrial" icons.
26: - [x] Redesign `FeatureCard` to have a sophisticated border-glow effect on hover.
27: - [x] Add a background "01, 02, 03" numbering in large, low-opacity display type.
28: 
29: ### 3. Product Showcase
30: - [x] Upgrade `ListingCard` with a "Spec Overlay" that appears on hover.
31: - [x] Implement "Image Zoom" transitions for product thumbnails.
32: - [x] Add category-specific badges with localized glassmorphism. (Implemented: Specs and Category props connected)
33: 
34: ### 4. Interactive Gallery Preview
35: - [x] Implement a "Bento-style" grid instead of a simple equal-col grid. (Verified: Homepage uses Bento layout)
36: - [x] Use `MediaOverlayCard` with a more cinematic text reveal.
37: 
38: ### 5. Research & Insights (Blog)
39: - [x] Redesign the "Spotlight" card to look like a high-end magazine layout.
40: - [x] Improve the secondary blog cards with a "Glass Card" hover state.
41: 
42: ### 6. High-Conversion CTA & Newsletter
43: - [x] Transform the CTA panel into a "Command Center" look with technical lines and corners.
44: - [x] Integrate the Newsletter form more seamlessly into a dark, textured footer-top section.
45: 
46: ---
47: 
48: ## 🤖 AI Orchestration Alignment Tasks
49: 
50: ### Faz 1: Ana Sayfa Dinamik Kontroller (Next Steps)
51: - [ ] **Localization Audit:** Ensure all new UI labels (e.g., "Innovation", "Featured Insight") are translated correctly in `next-intl`.
52: - [x] **Layout Stress Test:** Verify TR vs EN (and DE) layouts. (Fixed root 404 with middleware; layouts verified visually)
53: - [ ] **CTA Visibility:** Perform accessibility check for primary button contrast on all backgrounds.
54: 
55: ### Faz 2: Sayfa Şablonları & Tipografi
56: - [ ] **Long-form Content:** Optimize line-height and paragraph spacing for "Solution" pages.
57: - [ ] **Mobile Optimization:** Deep dive on mobile readability for long tech sheets.
58: 
59: ### Faz 3: Gelişmiş Ürün Kartları
60: - [x] **Dynamic Spec Overlay:** Connect `ListingCard` hover info to specs. (Fixed: Now passed in HomePage and Solutions)
61: 
62: ---
63: 
64: ## 🚀 Step-by-Step Implementation Strategy
65: 
66: ### Phase 1: Foundation (CSS & Components) - DONE
67: - Update `globals.css` with premium utility classes: `.glass-premium`, `.glow-brand`, `.text-gradient-gold`.
68: - Create a `CarbonTexture` component or CSS pattern.
69: 
70: ### Phase 2: Section-by-Section Refinement - DONE
71: 1.  **Hero:** Focus on the "Industrial Hub" feel.
72: 2.  **Features:** Focus on "Precision & Reliability".
73: 3.  **Products:** Focus on "Quality & Detail".
74: 4.  **Blog/Gallery:** Focus on "Authority & Expertise".
75: 
76: ### Phase 3: Polish - IN PROGRESS
77: - Stagger all motion animations using `framer-motion` (or existing motion classes).
78: - Final responsive audit.
