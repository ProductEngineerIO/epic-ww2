# Story 7.1: Implement Responsive Layouts Across All Breakpoints

Status: ready-for-dev

## Story

As a site visitor on any device,
I want the site to display correctly without horizontal scroll from 320px up through desktop,
so that the site works for family members on phones and history readers on laptops equally well.

## Acceptance Criteria

1. At **mobile** viewport (320–767px), every page renders with no horizontal scroll
2. At **mobile**, `FleetGrid` shows 1 column; `DossierCard` fields stack vertically; `ShipNav` places "Back to fleet" centered on its own row between Prev and Next; `PersistentNav` shows site title left + Fleet/About right with no hamburger menu
3. At **tablet** viewport (768–1023px), `FleetGrid` shows 2 columns; `DossierCard` fields display in a 3-column horizontal grid; `ShipNav` shows all 3 elements on one line
4. At **desktop** viewport (≥1024px), `FleetGrid` shows 3 columns; content columns center at `max-width: 880px` (`var(--space-content-max)`); all responsive rules are CSS-only — no separate Angular component variants
5. The `display-hero` type scale uses `clamp(2rem, 6vw, 3.5rem)` (token `--font-display-hero-size`) for fluid scaling — no breakpoint jump on the ship name or homepage hero heading
6. `ShipHero` image height uses `clamp(400px, 68vh, 680px)` (token `--space-hero-height`) at all viewports — no fixed pixel height
7. No component SCSS file has raw hex color values — only `var(--color-*)` references (AD-4 check)
8. All responsive behavior is implemented with `@media` queries in CSS — no JavaScript-based responsive logic

## Tasks / Subtasks

### Phase 1: Audit — verify what's already implemented

- [ ] Confirm `DossierCard` responsive (`max-width: 767px` → `grid-template-columns: 1fr`) is present and working — **already in `dossier-card.component.scss`; do NOT modify unless broken**
- [ ] Confirm `ShipNav` mobile grid layout (`max-width: 767px` → `grid-template-areas: "prev . next" / ". back ."`) is present — **already in `ship-nav.component.scss`; do NOT modify**
- [ ] Confirm `PersistentNav` mobile padding (`max-width: 767px`) and title truncation (`max-width: 479px`) are present — **already in `persistent-nav.component.scss`; do NOT modify**
- [ ] Confirm `WitnessTrioBlock` padding (`max-width: 767px`) is present — **already in `witness-trio-block.component.scss`; do NOT modify**
- [ ] Confirm `NarrativeSection` padding (`max-width: 767px`) is present — **already in `narrative-section.component.scss`; do NOT modify**

### Phase 2: FleetGrid responsive (depends on Story 5.2)

- [ ] Read `src/app/shared/components/fleet-grid/fleet-grid.component.scss` (created by Story 5.2)
- [ ] Verify `FleetGrid` has a 3-tier grid:
  - Default (mobile-first): `grid-template-columns: 1fr` — 1 column
  - `@media (min-width: 768px)`: `grid-template-columns: repeat(2, 1fr)` — 2 columns (tablet)
  - `@media (min-width: 1024px)`: `grid-template-columns: repeat(3, 1fr)` — 3 columns (desktop)
- [ ] If any tier is missing, add it to `fleet-grid.component.scss`
- [ ] Verify `gap: 12px` per DESIGN.md spec; do not use `var(--space-*)` for this — raw value is intentional (DESIGN.md specifies `gap: '12px'` exactly, no matching token)

### Phase 3: Content max-width centering

- [ ] Verify `ShipPageComponent` outer wrapper (`<article>`) either has `max-width: var(--space-content-max)` + `margin-inline: auto` or that all child components handle their own centering — **do not duplicate centering if WitnessTrioBlock already applies it**
- [ ] Verify `HomeComponent` outer `<main>` wrapper has no horizontal overflow at 320px — ensure it does not have a fixed `min-width` or missing `padding: 0 var(--space-gutter-mobile)` on mobile
- [ ] Confirm that `HomepageHero` image bleeds full viewport width at all breakpoints (no max-width constraint on the hero element itself — only on text/content layers above it)

### Phase 4: No-horizontal-scroll validation

- [ ] At 320px, load each route and confirm no `overflow-x` — focus on:
  - `/#/` (HomeComponent + FleetGrid)
  - `/#/ships/uss-valley-forge` (ShipPageComponent + all sub-components)
  - `/#/about` (AboutComponent)
  - `/#/not-found` (NotFoundComponent)
- [ ] If any element causes overflow, locate and fix the specific selector — common causes: missing `box-sizing: border-box` (already in global reset), fixed-width elements without max-width, or `padding` without matching `box-sizing`

### Phase 5: AD-4 token audit

- [ ] Scan ALL component SCSS files for raw hex values; any found must be replaced with a `var(--color-*)` token
  - Files to scan: all `.scss` files under `src/app/`
  - Acceptable raw values: `none`, `transparent`, `inherit`, `currentColor`, and `12px` gap on FleetGrid

## Dev Notes

### Breakpoint Convention Used in This Project

All existing components use a **mobile-first default** with a single `max-width` media query for mobile overrides. Do not introduce `min-width` breakpoints into existing components (DossierCard, ShipNav, etc.) — changing the approach would break existing styles.

For **new responsive tiers** (e.g., FleetGrid's tablet column), use `min-width`:

```scss
// Mobile-first: 1 column (default)
.fleet-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

// Tablet: 2 columns
@media (min-width: 768px) {
  .fleet-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

// Desktop: 3 columns
@media (min-width: 1024px) {
  .fleet-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### What Is Already Responsive — Do Not Touch

These components already have correct responsive implementations from their Epic 4 stories:

| Component | File | Mobile Rule |
|---|---|---|
| DossierCard | `dossier-card.component.scss` | `max-width: 767px` → `grid-template-columns: 1fr` |
| ShipNav | `ship-nav.component.scss` | `max-width: 767px` → grid with `prev/back/next` areas |
| PersistentNav | `persistent-nav.component.scss` | `max-width: 767px` padding, `max-width: 479px` title truncation |
| WitnessTrioBlock | `witness-trio-block.component.scss` | `max-width: 767px` section padding |
| NarrativeSection | `narrative-section.component.scss` | `max-width: 767px` gutter padding |

**Do not change these.** If any of these appear broken during audit, document it and fix only that specific rule.

### ShipNav Mobile Layout (Already Correct)

The ShipNav mobile layout defined in Story 4.6 places "Back to fleet" centered on its own row:

```scss
// already in ship-nav.component.scss — do not duplicate
@media (max-width: 767px) {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  grid-template-rows: auto auto;
  grid-template-areas:
    "prev . next"
    ". back .";
}
```

The `.ship-nav__prev` has `grid-area: prev`, `.ship-nav__next` has `grid-area: next` at mobile. **Verify the `.ship-nav__back` has `grid-area: back`** in the mobile rule — this is the most likely omission to check.

### FleetGrid Gap Value

DESIGN.md specifies `gap: '12px'` for FleetGrid. There is no `--space-12` or matching token for this value. Use `gap: 12px` directly — this is one of the two intentional raw non-hex values permitted in component SCSS (the other is `gap: 2rem` in WitnessTrioBlock per its comment).

### Content Max-Width Centering: Component Responsibility Pattern

In this project, centering is handled **per component** (not by a global page wrapper):

| Component | Max-width rule |
|---|---|
| `PersistentNav` inner `.nav` | `max-width: var(--space-content-max); margin: 0 auto;` |
| `WitnessTrioBlock` `.trio` | `max-width: var(--space-content-max); margin-inline: auto;` |
| `NarrativeSection` `.narrative` | `max-width: var(--space-content-narrow); margin-inline: auto;` |

Hero images (`ShipHero`, `HomepageHero`, `FleetGrid` thumbnails) **intentionally bleed full viewport width** — they do not get a `max-width` constraint. Only text/content layers have max-width applied.

`ShipPageComponent`'s `<article>` wrapper should **not** have its own `max-width` if `WitnessTrioBlock` handles it — adding a second max-width at the page level would double-constrain the hero image. The correct approach is:

```html
<!-- ship-page.component.html -->
<main>
  <article class="ship-page">
    <!-- full-bleed: no max-width on article -->
    <app-ship-hero [ship]="ship" />
    <app-witness-trio-block [ship]="ship" />
    <app-ship-nav [currentSlug]="slug" />
  </article>
</main>
```

```scss
// ship-page.component.scss (if it exists)
// No max-width on .ship-page — each child manages its own centering
:host { display: block; }
.ship-page { /* no max-width */ }
```

### HomeComponent Layout Pattern

`HomeComponent` should compose `HomepageHero` → intro text block → `FleetGrid`. The intro text block is the only element that needs centering:

```html
<main class="home">
  <app-homepage-hero />
  <section class="home__intro">
    <p class="home__tagline"><!-- FR-9 required text --></p>
  </section>
  <app-fleet-grid />
</main>
```

```scss
// home.component.scss
.home__intro {
  max-width: var(--space-content-max);
  margin-inline: auto;
  padding: var(--space-section-gap) var(--space-gutter);

  @media (max-width: 767px) {
    padding: var(--space-section-gap-mobile) var(--space-gutter-mobile);
  }
}
```

### 320px Horizontal Overflow — Common Causes

When verifying at 320px, watch for:
1. **Long unbroken strings** — ship names with long slugs in nav; `word-break: break-word` or `overflow-wrap: break-word` on `.nav__title` if needed
2. **FleetGrid with `gap` + `padding`** — ensure the grid has `padding: 0 var(--space-gutter-mobile)` on mobile and that `gap` doesn't push cells over
3. **PersistentNav title** — already has truncation at `max-width: 479px`; verify `overflow: hidden; text-overflow: ellipsis` on `.nav__title` at narrow widths
4. **`box-sizing` on grid children** — already globally reset to `border-box` in `styles.scss`; should not be an issue

### Dependency Chain

**Requires (all must be done first):**
- Story 1.3 — design token system and `_tokens.scss` (provides all `var()` references)
- Story 3.1 — PersistentNav (responsive already implemented in 3.1)
- Story 4.3 — DossierCard (responsive already implemented in 4.3)
- Story 4.6 — ShipNav (responsive already implemented in 4.6)
- Story 4.7 — ShipPageComponent layout (ship-page template structure)
- Story 5.1 — HomepageHero (needed for HomeComponent full-bleed verification)
- Story 5.2 — FleetGrid (needed for 3-tier column verification)
- Story 5.3 — HomeComponent (needed for 320px overflow audit)
- Stories 6.1, 6.2 — AboutComponent, NotFoundComponent (needed for 320px audit)

**Note:** If Epic 5 stories (5.1, 5.2, 5.3) are not yet done, skip Phase 2 and Phase 3 (FleetGrid + HomeComponent) and create a follow-up note to re-verify after those stories land. Do not block this story on stub components.

### Smoke Test Sequence

After all tasks are complete, verify the following in a live `ng serve`:

1. Resize browser to 320px width → load `/#/` → no horizontal scroll; fleet grid at 1 column
2. Resize to 768px → fleet grid at 2 columns; DossierCard at 3 columns
3. Resize to 1024px → fleet grid at 3 columns; content centered at 880px max
4. Load `/#/ships/uss-valley-forge` at 320px → ShipNav shows Prev and Next on top row, Back to fleet centered below
5. Load `/#/about` at 320px → no overflow; "Coming soon." body text readable
6. Enable Reduced Motion in OS settings → load any page → no transition animations

