---
name: Luminous Lab Tech
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#484555'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#797587'
  outline-variant: '#c9c4d8'
  surface-tint: '#5e3be7'
  primary: '#5d39e5'
  on-primary: '#ffffff'
  primary-container: '#7657ff'
  on-primary-container: '#fffdff'
  inverse-primary: '#c9beff'
  secondary: '#a73a00'
  on-secondary: '#ffffff'
  secondary-container: '#fd651e'
  on-secondary-container: '#571a00'
  tertiary: '#006678'
  on-tertiary: '#ffffff'
  tertiary-container: '#008197'
  on-tertiary-container: '#fdfeff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e6deff'
  primary-fixed-dim: '#c9beff'
  on-primary-fixed: '#1b0063'
  on-primary-fixed-variant: '#4612cf'
  secondary-fixed: '#ffdbce'
  secondary-fixed-dim: '#ffb599'
  on-secondary-fixed: '#370e00'
  on-secondary-fixed-variant: '#7f2b00'
  tertiary-fixed: '#acedff'
  tertiary-fixed-dim: '#4cd7f6'
  on-tertiary-fixed: '#001f26'
  on-tertiary-fixed-variant: '#004e5c'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-lg:
    fontFamily: Space Grotesk
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 64px
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-md:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-sm:
    fontFamily: Space Grotesk
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.06em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system embodies high-velocity software engineering, precision computing, and modern laboratory innovation. Built for engineers, founders, and technical operators, the aesthetic pairs the clinical clarity of a cutting-edge research terminal with the vibrant kinetic energy found in modern developer tools.

The design movement synthesizes **Modern High-Contrast Precision** with **Subtle Technical Tactility**:
- **Pristine, Luminous Canvases:** Clean, crisp paper-white and cool-slate surfaces establish absolute clarity and legibility.
- **Electric Scientific Accents:** Intense electric violet anchors brand authority and navigation, while high-velocity vermilion acts as an urgent operational catalyst for conversion, active metrics, and alerts.
- **Telemetry Indicators:** Luminous cyan provides pulse indicators, system telemetry, and active status readouts.
- **Technical Rigor:** Crisp hairline boundaries, deliberate structural rhythm, and engineered micro-interactions evoke confidence, speed, and analytical exactness.

## Colors

The palette directly mirrors the chromatic structure of the brand mark, balancing electric vibrancy against crisp slate surfaces.

### Semantic Roles & Palette Application
- **Primary Brand (`#7657FF` / `#9333EA`):** Deployed for primary brand presence, focused navigation items, active tab highlights, and structural brand moments.
- **Secondary Energy (`#EA580C` / `#F97316`):** High-priority operational triggers, primary CTA buttons, mission-critical metrics, and critical notification states.
- **Tertiary Telemetry (`#06B6D4` / `#42E8D4`):** Real-time data streams, live pings, system connectivity chips, and telemetry trends.
- **Neutral Foundation:**
  - Canvas / Background: `#FFFFFF` and `#F8FAFC`.
  - Surface Containers / Cards: `#FFFFFF` with muted borders (`#E2E8F0`).
  - Text Primary: `#0F172A` (deep structural slate) ensuring high-contrast readability.
  - Text Secondary: `#475569` (cool muted slate).
  - Inverse Accent Surface: `#0F172A` used for isolated high-density inspection panels or code blocks.

## Typography

The typographic pairing reflects the technical precision of modern labs:
- **Headlines & Labels (`Space Grotesk`):** Built with engineered geometry and technical charm. Delivers instant scientific credibility in titles, numeric readouts, badge pills, and tab structures. Uppercase tracking is applied to micro-labels to replicate instrument readouts.
- **Body & Data Prose (`Inter`):** Selected for its neutral, highly legible rendering of dense tables, documentation, input fields, and operational descriptions across screens of all pixel densities.

## Layout & Spacing

The layout model uses a **12-column fluid grid** for desktop and wide screens, adapting to **8 columns** on tablet viewports and **4 columns** on mobile devices.

- **Breakpoints:**
  - Mobile: `< 640px` (4 columns, `margin-mobile: 1rem`, `gutter-mobile: 1rem`).
  - Tablet: `640px - 1024px` (8 columns, `margin: 1.5rem`, `gutter: 1.25rem`).
  - Desktop: `> 1024px` (12 columns, max-width container 1280px or 1440px, `margin: 2rem`, `gutter: 1.5rem`).
- **Rhythm & Padding:** All internal card padding and element gaps conform to a strict 4px/8px baseline grid (`space-xs` through `space-xl`), ensuring telemetry modules, graphs, and toolbars align to mathematically consistent axes.

## Elevation & Depth

Visual hierarchy is maintained through crisp hairline borders and layered tonal surfaces rather than heavy blur shadows, maintaining a clean, high-tech instrument feel.

- **Surface Levels:**
  - **Base Canvas:** `#F8FAFC` providing soft contrast against card layers.
  - **Level 1 (Panels & Cards):** Pure `#FFFFFF` framed by a 1px solid border in `#E2E8F0`.
  - **Level 2 (Overlays & Dropdowns):** `#FFFFFF` paired with a delicate, colored ambient shadow (`0 8px 24px -4px rgba(15, 23, 42, 0.08), 0 2px 6px -1px rgba(118, 87, 255, 0.05)`).
  - **Level 3 (Modal / Telemetry HUD):** Raised `#FFFFFF` framed by `#CBD5E1` with high-density backdrop dimming (`rgba(15, 23, 42, 0.40)` with `4px` blur).
- **Glow & Active States:** Focused fields and active telemetry nodes use a 3px soft outer ring tinted in primary violet (`rgba(118, 87, 255, 0.20)`) or live cyan (`rgba(6, 182, 212, 0.25)`).

## Shapes

The shape hierarchy takes direct inspiration from the brand's rounded app-icon container and the pill-shaped studio badge:
- **Level 2 (`roundedness: 2`):** Standard components (cards, text fields, notification banners) use `0.5rem` (8px) corners.
- **Large Containers (`rounded-lg` & `rounded-xl`):** Feature `1rem` (16px) to `1.5rem` (24px) corners, emulating the smooth, ergonomic silhouette of the brand tile.
- **Pill Badges & Filter Chips:** Fully pill-shaped (`9999px` radius) matching the signature secondary badge style from the identity.

## Components

### Buttons
- **Primary Action (High-Energy CTA):** Vermilion background (`#EA580C`), crisp white text, bold `Space Grotesk` label (`label-lg`). Hover state brightens to `#F97316` with a slight transform lift.
- **Brand Secondary:** Electric Violet (`#7657FF`), white text, subtle violet focus ring.
- **Tertiary / Outline:** `#FFFFFF` background, 1px solid `#CBD5E1` border, `#0F172A` text. Hover shifts to `#F1F5F9`.
- **Destructive:** Deep crimson outline with subtle red-tinted fill on hover.

### Chips & Badges
- **Studio Pill (Category/Module):** Muted cool slate background (`#F1F5F9`), bordered with `#E2E8F0`, uppercase tracked text (`#475569`, `label-sm`), pill radius (`9999px`).
- **Telemetry / Live Status Pill:** Soft cyan tint background (`#ECFEFF`), border `#A5F3FC`, text `#0E7490`, with a pulsing 6px `#06B6D4` dot on the left.
- **Urgent / Hot Metric Chip:** Soft vermilion tint (`#FFF7ED`), text `#C2410C`, border `#FFEDD5`.

### Input Fields
- **Default State:** Background `#FFFFFF`, border 1px solid `#CBD5E1`, text `#0F172A`, placeholder `#94A3B8`, border-radius 8px.
- **Focus State:** Border shifts to primary violet (`#7657FF`) with a 3px ring of `rgba(118, 87, 255, 0.15)`.
- **Validation:** Clear vermilion underline and inline warning indicator.

### Checkboxes & Radio Buttons
- **Unchecked:** 1.5px slate border (`#94A3B8`) on `#FFFFFF`.
- **Checked:** Filled with `#7657FF` featuring an optical white checkmark or inner dot. Smooth spring micro-interaction on toggle.

### Cards & Panels
- **Telemetry Data Card:** Pure `#FFFFFF` background, 1px hairline border (`#E2E8F0`), padding `1.5rem`. Top-right slot reserved for status pills or trend metrics.
- **Hero / Highlight Panel:** Subtle gradient line along the top border (`linear-gradient(90deg, #7657FF, #EA580C, #06B6D4)`), elevating dashboard focal points.

### Lists & Data Tables
- **Table Headers:** `Space Grotesk` font (`label-md`), uppercase, tracked, `#64748B`, bottom border 1px solid `#E2E8F0`.
- **Rows:** Alternating subtle hover states (`#F8FAFC`), padded with `space-md`, divider line in `#F1F5F9`.