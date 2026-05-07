---
name: Cyber-Defense Intelligence
colors:
  surface: '#0f1222'
  surface-dim: '#0f1222'
  surface-bright: '#353849'
  surface-container-lowest: '#0a0d1c'
  surface-container-low: '#181b2a'
  surface-container: '#1c1f2f'
  surface-container-high: '#262939'
  surface-container-highest: '#313445'
  on-surface: '#e0e1f7'
  on-surface-variant: '#b9cacb'
  inverse-surface: '#e0e1f7'
  inverse-on-surface: '#2d2f40'
  outline: '#849495'
  outline-variant: '#3b494b'
  surface-tint: '#00dbe9'
  primary: '#dbfcff'
  on-primary: '#00363a'
  primary-container: '#00f0ff'
  on-primary-container: '#006970'
  inverse-primary: '#006970'
  secondary: '#d0bcff'
  on-secondary: '#3c0091'
  secondary-container: '#571bc1'
  on-secondary-container: '#c4abff'
  tertiary: '#f7f5ff'
  on-tertiary: '#292f49'
  tertiary-container: '#d3d8fa'
  on-tertiary-container: '#585d7a'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#7df4ff'
  primary-fixed-dim: '#00dbe9'
  on-primary-fixed: '#002022'
  on-primary-fixed-variant: '#004f54'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#d0bcff'
  on-secondary-fixed: '#23005c'
  on-secondary-fixed-variant: '#5516be'
  tertiary-fixed: '#dde1ff'
  tertiary-fixed-dim: '#c0c5e6'
  on-tertiary-fixed: '#141a33'
  on-tertiary-fixed-variant: '#404561'
  background: '#0f1222'
  on-background: '#e0e1f7'
  surface-variant: '#313445'
typography:
  h1:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  h2:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  h3:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  data-mono:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 16px
  margin: 32px
---

## Brand & Style

The design system is engineered to evoke a sense of absolute vigilance, technical authority, and rapid-response capability. It sits at the intersection of a high-end cyber-defense war room and a sophisticated financial terminal, prioritizing high data density without compromising on visual prestige.

The aesthetic utilizes **Glassmorphism** to create a sense of depth and layered intelligence. By using translucent surfaces and background blurs, the UI suggests a complex, multi-dimensional data environment where information is filtered through advanced AI. The overall mood is cold, calculated, and futuristic, designed to make users feel like they are operating at the cutting edge of global information warfare.

## Colors

The color palette is anchored in "Deep Space" (#080B1A) to minimize eye strain during long-duration monitoring. The core surfaces utilize "Midnight Glass" (#10162F) with a 70-80% opacity to allow for background blur effects.

Accent colors are purely functional:
- **Quantum Cyan** is used for primary actions and active data streams.
- **Neural Purple** denotes AI-driven insights and secondary cognitive paths.
- **Threat Red** and **Safe Green** are reserved strictly for status indicators and veracity scores.

Avoid using gradients for text; reserve them for button backgrounds and active border glows to maintain readability.

## Typography

This design system employs a dual-font strategy. **Space Grotesk** is used for headings to provide a technical, futuristic edge that signals innovation. For all data-heavy views, lists, and analytical summaries, **Inter** is utilized for its exceptional legibility at small scales and high character recognition.

For technical data points (timestamps, veracity percentages, coordinates), use the `data-mono` style with increased letter spacing to mimic terminal readouts. Always ensure a high contrast ratio between text and glass surfaces.

## Layout & Spacing

The layout follows a **fluid grid** model optimized for ultra-wide monitors and multi-dashboard setups. A 12-column grid system is used, allowing elements to span flexible widths while maintaining consistent 16px gutters.

The spacing rhythm is built on an 8px base unit. Given the enterprise nature of the platform, "Compact" density is preferred for data tables and feeds, while "Spacious" padding (24px+) is reserved for high-level summary cards and landing views. Use margins of at least 32px on the edges of the screen to prevent "bezel-bleed" in dark environments.

## Elevation & Depth

Depth in this design system is achieved through **Tonal Layering** and **Backdrop Blurs** rather than traditional drop shadows.

- **Level 0 (Background):** Solid Deep Space (#080B1A).
- **Level 1 (Cards/Panels):** Midnight Glass (#10162F) with 20px backdrop blur and a 1px "Quantum Cyan" border at 15% opacity.
- **Level 2 (Modals/Popovers):** Increased opacity Midnight Glass with a 1px border glow (100% opacity) and a subtle outer neon bloom effect (blur: 10px).

Animated particle effects should exist between Level 0 and Level 1 to create a sense of "data flowing beneath the glass."

## Shapes

The shape language balances the "cyber" aesthetic with modern software friendliness. The standard radius for primary containers and cards is **24px (rounded-xl)**, creating a distinctive "pod" look for data modules.

Smaller components like input fields and buttons follow a more standard 8px radius to maintain a professional, utility-first feel. Use 1px stroke widths for all borders to keep the UI feeling sharp and high-resolution.

## Components

### Buttons
Primary buttons use a "Quantum Cyan" to "Neural Purple" linear gradient (45 degrees). On hover, the button should gain an outer glow (bloom) and lift 2px. Secondary buttons are ghost-style with 1px neon borders.

### Cards
Cards are the primary container. They must feature a `backdrop-filter: blur(20px)` and a subtle internal 1px border. For "Critical" threats, the border should pulse slowly in "Threat Red."

### Inputs
Search and data entry fields are dark with bottom-only borders that light up in Cyan when focused. Use Inter for all input text to ensure clarity.

### Pulsing Indicators
Status indicators (Safe/Threat) must include a secondary, larger concentric circle with a CSS pulse animation to draw immediate attention to changing data states.

### Data Particles
Incorporate subtle, non-interactive canvas-based particles in the background of main dashboards to visualize the "stream" of misinformation being processed in real-time.