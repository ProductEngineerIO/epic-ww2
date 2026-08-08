---
name: Howard Hertzog WWII Ship Photography
description: Dark archival memorial aesthetic. Olive drab / khaki / steel grey palette. Roboto Slab display + Lora narrative body. Grain texture. Mobile-first public web.
status: final
sources:
  - docs/planning-artifacts/prds/prd-epic-ww2-2026-07-29/prd.md
created: 2026-07-29
updated: 2026-07-29
colors:
  background: '#16160e'
  surface: '#23231a'
  surface-raised: '#2e2e22'
  surface-container: '#38382c'
  on-surface: '#ede9df'
  on-surface-variant: '#c9b87a'
  on-surface-secondary: '#8a9aaa'
  on-surface-muted: '#5a6870'
  outline: '#4a5a6a'
  outline-variant: '#3d3d2e'
  primary: '#7a8c44'
  on-primary: '#16160e'
  primary-dim: '#4a5228'
  error: '#c0392b'
  on-error: '#ede9df'
  overlay: 'rgba(22, 22, 14, 0.82)'
typography:
  display-hero:
    fontFamily: "'Roboto Slab', Georgia, serif"
    fontSize: "clamp(2rem, 6vw, 3.5rem)"
    fontWeight: '700'
    lineHeight: '1.05'
    letterSpacing: '-0.01em'
  headline-lg:
    fontFamily: "'Roboto Slab', Georgia, serif"
    fontSize: '1.625rem'
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: "'Roboto Slab', Georgia, serif"
    fontSize: '1.25rem'
    fontWeight: '600'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: "'Roboto Slab', Georgia, serif"
    fontSize: '1rem'
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: '0.02em'
  body-lg:
    fontFamily: "'Lora', Georgia, serif"
    fontSize: '1.1rem'
    fontWeight: '400'
    lineHeight: '1.8'
  body-md:
    fontFamily: "'Lora', Georgia, serif"
    fontSize: '1rem'
    fontWeight: '400'
    lineHeight: '1.7'
  label-caps:
    fontFamily: "'Roboto Slab', Georgia, serif"
    fontSize: '0.7rem'
    fontWeight: '400'
    lineHeight: '1.4'
    letterSpacing: '0.12em'
    textTransform: 'uppercase'
  label-value:
    fontFamily: "'Roboto Slab', Georgia, serif"
    fontSize: '0.9rem'
    fontWeight: '600'
    lineHeight: '1.3'
  caption:
    fontFamily: "'Roboto Slab', Georgia, serif"
    fontSize: '0.8rem'
    fontWeight: '400'
    lineHeight: '1.5'
    fontStyle: 'italic'
  nav-link:
    fontFamily: "'Roboto Slab', Georgia, serif"
    fontSize: '0.875rem'
    fontWeight: '400'
    lineHeight: '1'
    letterSpacing: '0.06em'
    textTransform: 'uppercase'
rounded:
  DEFAULT: '0'
  sm: '2px'
spacing:
  unit: '8px'
  gutter: '24px'
  gutter-mobile: '16px'
  content-max: '880px'
  content-narrow: '660px'
  hero-height: 'clamp(400px, 68vh, 680px)'
  section-gap: '4rem'
  section-gap-mobile: '2.5rem'
components:
  ShipHero:
    height: '{spacing.hero-height}'
    object-fit: cover
    width: '100%'
    gradient-overlay: 'linear-gradient(to bottom, transparent 40%, {colors.overlay} 100%)'
    ship-name-position: 'bottom-left, over overlay'
    ship-name-style: display-hero
    ship-name-color: on-surface-variant
  AttributionCaption:
    typography: caption
    color: on-surface-secondary
    margin-top: '0.5rem'
    padding: '0 1rem'
  DossierCard:
    background: surface-raised
    border-left: '4px solid {colors.primary}'
    border-radius: sm
    padding: '1.5rem'
    label-style: label-caps
    label-color: on-surface-secondary
    value-style: label-value
    value-color: on-surface
    grid-columns: '3 on tablet+, 1 on mobile'
    grid-gap: '1.5rem'
  NarrativeSection:
    typography: body-lg
    color: on-surface
    max-width: content-narrow
    historical-caveat-style: caption
    historical-caveat-color: on-surface-muted
  WitnessTrioBlock:
    description: 'Atomic wrapper — DossierCard + AttributionCaption + NarrativeSection. Never render partial. Max-width: content-max, centered.'
    gap-between-elements: '2rem'
  ShipNav:
    background: surface
    border-top: '1px solid {colors.outline-variant}'
    padding: '1.5rem {spacing.gutter}'
    prev-next-style: headline-sm
    prev-next-color: on-surface-variant
    back-link-style: label-caps
    back-link-color: primary
  FleetGrid:
    columns-desktop: 3
    columns-tablet: 2
    columns-mobile: 1
    gap: '12px'
    thumbnail-aspect: '4/3'
    thumbnail-overlay: 'linear-gradient(to top, {colors.overlay} 0%, transparent 55%)'
    ship-name-style: headline-sm
    ship-name-color: on-surface-variant
  PersistentNav:
    background: surface
    border-bottom: '1px solid {colors.outline-variant}'
    height: '56px'
    position: sticky
    top: 0
    z-index: 100
    site-title-style: headline-sm
    site-title-color: on-surface-variant
    link-style: nav-link
    link-color: on-surface-secondary
    link-active-color: primary
  ComingSoon:
    background: background
    min-height: '60vh'
    content-align: center
    heading-style: headline-lg
    heading-color: on-surface-variant
---

## Brand & Style

This design system serves a memorial function: it holds space for 21 WWII-era ship photographs taken by one man at the edge of San Francisco Bay. The aesthetic draws from the materiality of the archive — photographic grain, olive drab field equipment, stamped metal, wartime dispatch paper. Nothing should feel modern-consumer. Nothing should feel precious or over-designed. The right register is *found document* — discovered rather than produced.

**Emotional target:** reverent without solemnity, precise without coldness, personal without sentimentality. The photographs are the primary voice; every design decision should defer to them.

**System personality:** Dark-primary throughout. The site never enters a light mode. The dark surface is not a stylistic choice — it is the environment that makes Howard's photographs visible in the way a darkroom makes a print visible.

**Keywords:** archival · witness document · field dispatch · grain · olive · memorial

## Colors

The palette is derived from three source registers:

- **Olive drab** (`#7a8c44` primary, `#4a5228` dim) — U.S. military field equipment color. Used for accent borders, active nav states, hover highlights. Never used for decorative purposes — it signals importance.
- **Khaki warm** (`#c9b87a` on-surface-variant) — sun-faded paper, wartime document tone. Used exclusively for ship names, page headings, and titles. It is the warmth in an otherwise cool-dark palette.
- **Steel grey** (`#8a9aaa` on-surface-secondary) — the secondary voice. Metadata dates, dossier field labels, nav links at rest, attribution captions. Reads as filed information rather than featured content.

Background `#16160e` is not pure black. It carries an olive undertone that warms the dark and keeps photographs from floating on an anti-room void.

All text/background pairs meet WCAG AA minimum contrast. The khaki heading (`#c9b87a`) on background (`#16160e`) achieves approximately 7:1.

## Typography

Two families; both loaded from Google Fonts via `<link>` in Angular's `index.html`.

**Roboto Slab** — display, headings, labels, navigation, dossier data, captions. The slab serif brings editorial authority and wartime-newspaper gravitas without the fragility of a thin serif. Used at multiple weights (400 for labels/captions, 600 for section headings, 700 for ship name hero).

**Lora** — narrative body text only (the "Where was it going" section and any extended prose). Lora is warm, readable at length, and carries a humanist quality that suits first-person witness writing. Never used for UI chrome.

This two-family system enforces a clear hierarchy: Roboto Slab is the document's skeleton; Lora is its voice.

**Type scale is fluid on hero.** `display-hero` uses `clamp(2rem, 6vw, 3.5rem)` so the ship name scales gracefully from mobile to wide desktop without a breakpoint jump.

**Label-caps treatment** (letter-spacing 0.12em, uppercase, 0.7rem) on dossier field names creates the dispatch-form register — vessel class, commissioned, fate read as form fields, not prose.

## Layout & Spacing

- Base unit: 8px. All spacing is multiples of this unit.
- Content max-width: 880px (centered). Narrative sections use the narrower 660px max-width to maintain a comfortable reading measure (~65 characters).
- Mobile gutters: 16px. Desktop gutters: 24px.
- Section gap: 4rem desktop, 2.5rem mobile.
- Hero photographs bleed full viewport width at all breakpoints — no content max-width constraint on the hero.

## Elevation & Depth

No box shadows. The dark palette provides natural depth via surface-level stepping (`#16160e` → `#23231a` → `#2e2e22` → `#38382c`). Elevation reads as color, not shadow.

**DossierCard** uses a 4px left border in `{colors.primary}` (olive drab) instead of a shadow — it reads as a field classification marker, not a UI affordance for hover.

## Shapes

Hard corners throughout (`border-radius: 0`). The 2px radius on `DossierCard` is the sole exception — imperceptibly soft, just enough to not read as a rendering artifact on low-DPI screens.

No pill buttons. No rounded input fields. Square everything.

## Components

See YAML frontmatter for token-level specs. Behavioral rules live in `EXPERIENCE.md`.

**Grain texture** is applied via `body::after` pseudo-element with an inline SVG noise pattern at 8% opacity, `pointer-events: none`, `position: fixed`, `inset: 0`. It sits above the background but below all content (`z-index: -1` relative to content). This is the one globally applied visual treatment that no individual surface turns off.

## Do's and Don'ts

| Do | Don't |
|---|---|
| Full-bleed hero photos at every breakpoint | Constrain hero photos to a content column |
| Khaki (`on-surface-variant`) for ship names and page titles | Use khaki for body text or navigation |
| Roboto Slab for all UI chrome | Mix Lora into navigation or dossier labels |
| Hard-corner elements throughout | Add border-radius > 2px to any element |
| Let photographs dominate — use generous padding around text | Crowd narrative text against the photograph edge |
| Attribution caption directly beneath or overlaid on every ship photo | Place attribution at page bottom or in a footer-only credit |
| Olive drab (`primary`) sparingly for active states and accent borders | Use olive drab as a background fill or decorative color |
| Circular Prev/Next (ship 21 Next → ship 1) | Dead-end the navigation at first or last ship |
