# Story 1.3: Implement Design Token System

Status: ready-for-dev

## Story

As a developer,
I want all DESIGN.md color, typography, and spacing values expressed as CSS custom properties in `src/styles/_tokens.scss` and applied globally in `styles.scss`,
so that every component references design values by name — never raw hex codes — and the entire site is visually consistent with the DESIGN.md specification.

## Acceptance Criteria

1. `src/styles/_tokens.scss` exists and defines all color, typography, and spacing CSS custom properties exactly matching DESIGN.md values; no hex values appear anywhere in component SCSS files — only `var(--color-*)`, `var(--font-*)`, `var(--space-*)` references
2. `src/styles/styles.scss` imports `_tokens.scss`, imports Google Fonts (Roboto Slab + Lora) via `<link>` in `index.html`, applies the global body styles, and includes a minimal CSS reset
3. A grain/texture effect is applied to the site's background surface using CSS — visible as a subtle photographic-era grain on dark surfaces
4. Running `ng serve` renders the Angular app with a dark background (`#16160e`) body, Roboto Slab as the default font, and the khaki/steel/olive palette visible on the default `<p>` or heading text
5. All spacing tokens are defined including: `--space-unit: 8px`, `--space-gutter: 24px`, `--space-gutter-mobile: 16px`, `--space-content-max: 880px`, `--space-content-narrow: 660px`, `--space-hero-height: clamp(400px, 68vh, 680px)`, `--space-section-gap: 4rem`, `--space-section-gap-mobile: 2.5rem`

## Tasks / Subtasks

- [ ] Create `src/styles/_tokens.scss` with all color tokens (AC: 1)
  - [ ] Define all 15 color tokens as `:root` CSS custom properties (see Dev Notes for complete list)
- [ ] Add typography tokens to `_tokens.scss` (AC: 1, 2)
  - [ ] Define CSS custom properties for font families, font sizes, weights, line heights, and letter spacings for all 10 type scales
  - [ ] Token names follow `--font-{role}-{property}` pattern (e.g., `--font-display-hero-size`, `--font-body-lg-family`)
  - [ ] Alternatively (and preferably), define typography as utility CSS classes (`display-hero`, `body-lg`, etc.) referencing the custom properties — this is how components will use them
- [ ] Add spacing tokens to `_tokens.scss` (AC: 5)
  - [ ] Define all spacing values as `--space-*` custom properties listed in AC-5
- [ ] Update `src/index.html` to load Google Fonts (AC: 2)
  - [ ] Add `<link rel="preconnect" href="https://fonts.googleapis.com">` and `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>` in `<head>`
  - [ ] Add Google Fonts `<link>` loading `Roboto+Slab:wght@400;600;700&family=Lora:ital,wght@0,400;0,600;1,400`
- [ ] Update `src/styles/styles.scss` with global styles (AC: 2, 3, 4)
  - [ ] Import `_tokens.scss`
  - [ ] Add CSS reset (box-sizing, margin/padding reset, `*` selector)
  - [ ] Apply global body styles using token variables
  - [ ] Implement grain/texture effect on dark surfaces
- [ ] Verify no hex values in component files; `ng serve` shows dark theme (AC: 1, 4)

## Dev Notes

### Dependency on Story 1.1

Story 1.3 **requires Story 1.1** (Angular scaffold). The `src/styles/` directory and `src/index.html` must exist.

### Complete Color Token List (from DESIGN.md)

All 15 tokens, mapped to DESIGN.md `colors` section:

```scss
// src/styles/_tokens.scss
:root {
  // ── Surfaces ─────────────────────────────────────────────
  --color-bg:              #16160e;   // page background (olive-undertone near-black)
  --color-surface:         #23231a;   // card/nav surface
  --color-surface-raised:  #2e2e22;   // elevated surface (DossierCard bg)
  --color-surface-cont:    #38382c;   // container surface

  // ── Text ─────────────────────────────────────────────────
  --color-on-surface:      #ede9df;   // primary body text
  --color-khaki:           #c9b87a;   // headings, ship names (on-surface-variant)
  --color-steel:           #8a9aaa;   // secondary text, metadata (on-surface-secondary)
  --color-steel-muted:     #5a6870;   // muted / placeholder text (on-surface-muted)

  // ── Accent ───────────────────────────────────────────────
  --color-olive:           #7a8c44;   // primary accent — nav active, borders, hover
  --color-olive-dim:       #4a5228;   // dimmed olive for subtle accents

  // ── Borders ──────────────────────────────────────────────
  --color-outline:         #4a5a6a;   // dividers, borders
  --color-outline-v:       #3d3d2e;   // subtle variant borders

  // ── Overlays ─────────────────────────────────────────────
  --color-overlay:         rgba(22, 22, 14, 0.82);  // hero gradient overlay

  // ── Semantic ─────────────────────────────────────────────
  --color-error:           #c0392b;
  --color-on-primary:      #16160e;   // text on olive primary bg
}
```

### Typography Tokens (from DESIGN.md)

DESIGN.md defines 10 type scales. Express each as CSS custom properties. Using a combination of custom properties AND utility classes is the recommended pattern — components apply the class, not a manual collection of properties:

```scss
:root {
  // Font families
  --font-display:  'Roboto Slab', Georgia, serif;
  --font-narrative: 'Lora', Georgia, serif;

  // display-hero: ship name on ShipHero, homepage hero
  --font-display-hero-size:    clamp(2rem, 6vw, 3.5rem);
  --font-display-hero-weight:  700;
  --font-display-hero-lh:      1.05;
  --font-display-hero-ls:      -0.01em;

  // headline-lg: section headings
  --font-hl-lg-size:    1.625rem;
  --font-hl-lg-weight:  600;
  --font-hl-lg-lh:      1.2;

  // headline-md
  --font-hl-md-size:    1.25rem;
  --font-hl-md-weight:  600;
  --font-hl-md-lh:      1.3;

  // headline-sm: ShipNav prev/next, FleetGrid ship names
  --font-hl-sm-size:    1rem;
  --font-hl-sm-weight:  600;
  --font-hl-sm-lh:      1.4;
  --font-hl-sm-ls:      0.02em;

  // body-lg: NarrativeSection prose (Lora)
  --font-body-lg-size:    1.1rem;
  --font-body-lg-weight:  400;
  --font-body-lg-lh:      1.8;

  // body-md: general body text
  --font-body-md-size:    1rem;
  --font-body-md-weight:  400;
  --font-body-md-lh:      1.7;

  // label-caps: DossierCard field labels
  --font-label-caps-size:    0.7rem;
  --font-label-caps-weight:  400;
  --font-label-caps-lh:      1.4;
  --font-label-caps-ls:      0.12em;

  // label-value: DossierCard field values
  --font-label-value-size:    0.9rem;
  --font-label-value-weight:  600;
  --font-label-value-lh:      1.3;

  // caption: AttributionCaption, historical caveat
  --font-caption-size:    0.8rem;
  --font-caption-weight:  400;
  --font-caption-lh:      1.5;
  --font-caption-style:   italic;

  // nav-link: PersistentNav links
  --font-nav-link-size:    0.875rem;
  --font-nav-link-weight:  400;
}
```

Then add utility classes that bundle the related properties:

```scss
// Utility typography classes — used by components
.type-display-hero {
  font-family: var(--font-display);
  font-size: var(--font-display-hero-size);
  font-weight: var(--font-display-hero-weight);
  line-height: var(--font-display-hero-lh);
  letter-spacing: var(--font-display-hero-ls);
}
.type-body-lg {
  font-family: var(--font-narrative);
  font-size: var(--font-body-lg-size);
  font-weight: var(--font-body-lg-weight);
  line-height: var(--font-body-lg-lh);
}
.type-label-caps {
  font-family: var(--font-display);
  font-size: var(--font-label-caps-size);
  font-weight: var(--font-label-caps-weight);
  line-height: var(--font-label-caps-lh);
  letter-spacing: var(--font-label-caps-ls);
  text-transform: uppercase;
}
// ... etc for each scale
```

### Spacing Tokens

```scss
:root {
  --space-unit:           8px;
  --space-gutter:         24px;
  --space-gutter-mobile:  16px;
  --space-content-max:    880px;
  --space-content-narrow: 660px;
  --space-hero-height:    clamp(400px, 68vh, 680px);
  --space-section-gap:    4rem;
  --space-section-gap-mobile: 2.5rem;
  --space-border-radius-sm: 2px;
}
```

### Global styles.scss

```scss
// src/styles/styles.scss
@use 'tokens';   // or @import 'tokens' — use @use for modern Sass

// ── CSS Reset ──────────────────────────────────────────────
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

// ── Global Body ───────────────────────────────────────────
body {
  background-color: var(--color-bg);
  color: var(--color-on-surface);
  font-family: var(--font-display);
  font-size: var(--font-body-md-size);
  line-height: var(--font-body-md-lh);
  -webkit-font-smoothing: antialiased;
}

// ── Global anchor reset ───────────────────────────────────
a {
  color: inherit;
  text-decoration: none;
}

// ── Focus ring (UX-DR15) ─────────────────────────────────
:focus-visible {
  outline: 2px solid var(--color-olive);
  outline-offset: 3px;
}
// Never use `outline: none` without a custom replacement

img {
  display: block;
  max-width: 100%;
}
```

### Grain/Texture Effect (FR-18, UX-DR3)

From DESIGN.md Brand & Style: *"The aesthetic draws from the materiality of the archive — photographic grain, olive drab field equipment, stamped metal, wartime dispatch paper."*

Implement as a CSS `::after` pseudo-element on `body` (or as a fixed overlay):

```scss
// In styles.scss — grain overlay
body::after {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.035;
  // SVG noise pattern (base64 encoded inline, ~200 bytes):
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 200px 200px;
}
```

Keep `opacity` between 0.02–0.05 — barely perceptible, just enough to break the flat digital surface and evoke photographic grain. Do not use `mix-blend-mode` as it can conflict with z-index stacking contexts.

### AD-4 Compliance Verification

After creating all token files, verify compliance by scanning component SCSS files for any raw hex color values:
```bash
grep -r '#[0-9a-fA-F]\{3,6\}' src/app/ --include="*.scss"
```
This should return no results. All colors must be `var(--color-*)` references.

### Google Fonts Loading

Load fonts in `src/index.html` (not via CSS `@import` — CSS `@import` blocks rendering):

```html
<!-- src/index.html <head> section -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@400;600;700&family=Lora:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
```

The `display=swap` parameter ensures text is visible during font load (prevents invisible text flash).

### DESIGN.md Border Radius

From DESIGN.md Shapes: *"Hard corners throughout (`border-radius: 0`). The 2px radius on DossierCard is the sole exception."*

Set global:
```scss
// In styles.scss or _tokens.scss
:root {
  --border-radius: 0;
  --border-radius-sm: 2px;  // DossierCard only
}
```

Do not apply `border-radius: var(--border-radius)` globally — just establish the token. Components apply it explicitly.

### Project Structure Notes

- Token file: `src/styles/_tokens.scss` (underscore prefix = Sass partial, not compiled standalone)
- Import in `styles.scss` with `@use 'tokens'` (Sass module system) — token variables are then available as `tokens.$variable` in the module scope, but since they are CSS custom properties (not Sass variables), they are globally available in `:root` regardless
- Do NOT add `src/styles/_tokens.scss` to the `styles` array in `angular.json` — partials are imported, not compiled directly
- `src/styles/styles.scss` is the only entry point in `angular.json`

### References

- [Source: docs/planning-artifacts/ux-designs/ux-epic-ww2-2026-07-29/DESIGN.md — colors, typography, spacing, brand-style, components sections]
- [Source: docs/planning-artifacts/architecture/architecture-epic-ww2-2026-07-29/architecture-document.md — Design Token System section, _tokens.scss excerpt]
- [Source: docs/planning-artifacts/architecture/architecture-epic-ww2-2026-07-29/ARCHITECTURE-SPINE.md — AD-4]
- [Source: docs/planning-artifacts/prds/prd-epic-ww2-2026-07-29/prd.md — FR-16, FR-17, FR-18]
- [Source: docs/planning-artifacts/ux-designs/ux-epic-ww2-2026-07-29/EXPERIENCE.md — Accessibility Floor (focus ring UX-DR15)]
- [Source: docs/planning-artifacts/epics.md — Epic 1, Story 1.3]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6

### Debug Log References

### Completion Notes List

### File List
