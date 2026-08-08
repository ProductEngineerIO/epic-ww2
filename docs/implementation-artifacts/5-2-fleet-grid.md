# Story 5.2: Implement FleetGrid Component

Status: done

## Story

As a site visitor,
I want to see all 21 ships as a browsable thumbnail grid,
so that I can find and click into any ship without losing the overview.

## Acceptance Criteria

1. `FleetGridComponent` is a standalone component at `src/app/features/home/fleet-grid.component.ts`; it injects `ShipDataService` via `inject()` and calls `getAll()` to obtain the 21-ship roster
2. Each grid cell wraps in a `[routerLink]="['/ships', ship.slug]"` anchor; no bare `<a href>` to paths (AD-2)
3. Each cell contains a `<picture>` with `<source type="image/webp">` pointing to `assets/images/thumb/{slug}.webp` and `<img>` fallback pointing to `assets/images/thumb/{slug}.jpg`; thumbnails use `loading="lazy"` and a 4:3 aspect ratio enforced via CSS
4. Each cell overlays the ship name on the thumbnail; overlay text uses `type-hl-sm` typography (Roboto Slab, 1rem/600) in `var(--color-khaki)` over `var(--color-overlay)` gradient; no raw hex values in component SCSS
5. Grid breakpoints: 1 column on mobile (<768px), 2 columns on tablet (768–1023px), 3 columns on desktop (≥1024px); handled entirely in CSS — no separate Angular components per breakpoint
6. On desktop, hovering a cell applies `transform: scale(1.02)` with `transition: transform 200ms ease`; this transform is completely absent under `@media (prefers-reduced-motion: reduce)`
7. Alt text for every thumbnail image reads `"{Ship name} — thumbnail"` (e.g., `"USS Valley Forge — thumbnail"`)
8. All 21 ship links are keyboard-reachable via Tab and each has a visible focus ring: `outline: 2px solid var(--color-olive); outline-offset: 3px`
9. Unit tests in `fleet-grid.component.spec.ts` cover: component creates successfully; `ShipDataService.getAll()` is called exactly once; the rendered template contains the same number of `<a>` anchors as ships returned by the mock; each anchor's `routerLink` resolves to `['/ships', ship.slug]`; each `<img>` alt text matches the `"{name} — thumbnail"` format; a mock `ShipDataService` is used via `jasmine.createSpyObj`

## Tasks / Subtasks

- [ ] Create `src/app/features/home/fleet-grid.component.ts` (AC: 1, 2)
  - [ ] `standalone: true`; import `RouterLink` from `@angular/router`
  - [ ] Inject `ShipDataService` via `inject(ShipDataService)`; expose `ships = this.shipData.getAll()` as a class property (computed once at construction — not a method call in the template)
  - [ ] Selector: `app-fleet-grid`
  - [ ] `templateUrl: './fleet-grid.component.html'`, `styleUrl: './fleet-grid.component.scss'`

- [ ] Create `src/app/features/home/fleet-grid.component.html` (AC: 2, 3, 4)
  - [ ] Outer `<section class="fleet-grid" aria-label="Fleet — 21 ships">` — use `aria-label` for the screen reader region name; do NOT add a visually-hidden `<h2>` (heading hierarchy is managed by HomeComponent in Story 5.3)
  - [ ] `@for (ship of ships; track ship.slug)` loop; each iteration renders one `<a class="fleet-grid__link">` as a **direct child** of `<section class="fleet-grid">` — no wrapper div; the anchor IS the CSS Grid item
  - [ ] Each anchor: `<a [routerLink]="['/ships', ship.slug]" class="fleet-grid__link">`
  - [ ] Inside the anchor: `<figure class="fleet-grid__figure">` containing `<picture>` + `<figcaption class="fleet-grid__name">`
  - [ ] `<picture>`: `<source type="image/webp" [srcset]="'assets/images/thumb/' + ship.slug + '.webp'">` + `<img [src]="'assets/images/thumb/' + ship.slug + '.jpg'" [alt]="ship.name + ' — thumbnail'" loading="lazy" class="fleet-grid__img">`
  - [ ] `<figcaption>`: `{{ ship.name }}` with `type-hl-sm` class applied

- [ ] Create `src/app/features/home/fleet-grid.component.scss` (AC: 4, 5, 6, 8)
  - [ ] `:host { display: block; }`
  - [ ] `.fleet-grid`: CSS Grid, `grid-template-columns: 1fr` mobile-first; `gap: var(--space-unit)` (8px) between cells; `padding: 0 var(--space-gutter-mobile)` on mobile — the `<a class="fleet-grid__link">` elements are the direct children and therefore the CSS Grid column items; there is no intermediate wrapper element between the grid container and the anchors
  - [ ] Tablet breakpoint (`@media (min-width: 768px)`): `grid-template-columns: repeat(2, 1fr)`; `padding: 0 var(--space-gutter)`
  - [ ] Desktop breakpoint (`@media (min-width: 1024px)`): `grid-template-columns: repeat(3, 1fr)`
  - [ ] `.fleet-grid__link`: `display: block; text-decoration: none; color: inherit; position: relative; overflow: hidden;`
  - [ ] `.fleet-grid__link:focus-visible`: `outline: 2px solid var(--color-olive); outline-offset: 3px`
  - [ ] `.fleet-grid__figure`: `margin: 0; position: relative; aspect-ratio: 4 / 3; overflow: hidden; background: var(--color-surface);`
  - [ ] `.fleet-grid__img`: `width: 100%; height: 100%; object-fit: cover; display: block;`
  - [ ] Hover scale (AC: 6): `.fleet-grid__link:hover .fleet-grid__img { transform: scale(1.02); }` with `transition: transform 200ms ease` on `.fleet-grid__img`
  - [ ] Reduced-motion guard: `@media (prefers-reduced-motion: reduce) { .fleet-grid__img { transition: none; } .fleet-grid__link:hover .fleet-grid__img { transform: none; } }` — **note:** this story uses the `reduce` guard (transition defined unconditionally, stripped under `reduce`); do NOT copy the `prefers-reduced-motion: no-preference` guard pattern from Story 5.1 — using that pattern here would silently break the hover transition
  - [ ] `.fleet-grid__name` overlay: `position: absolute; bottom: 0; left: 0; right: 0; padding: 0.5rem var(--space-gutter-mobile); background: linear-gradient(to top, var(--color-overlay) 0%, transparent 100%); color: var(--color-khaki);` — apply `type-hl-sm` utility class in HTML, not duplicate properties in SCSS

- [ ] Create `src/app/features/home/fleet-grid.component.spec.ts` (AC: 9)
  - [ ] Mock `ShipDataService` with `jasmine.createSpyObj(['getAll'])` returning a representative ship array (3–5 ships is sufficient)
  - [ ] Provide mock via `TestBed.configureTestingModule` overriding the real service
  - [ ] Test: component creates successfully
  - [ ] Test: `getAll()` is called exactly once on construction
  - [ ] Test: rendered template contains the same number of `<a>` anchors as ships in the mock array
  - [ ] Test: first anchor's `routerLink` input resolves to `['/ships', mockShips[0].slug]`
  - [ ] Test: first `<img>` alt text equals `"{mockShips[0].name} — thumbnail"`

## Dev Notes

### File Locations — Do Not Deviate

| File | Path |
|---|---|
| Component TS | `src/app/features/home/fleet-grid.component.ts` |
| Template HTML | `src/app/features/home/fleet-grid.component.html` |
| SCSS | `src/app/features/home/fleet-grid.component.scss` |
| Unit Tests | `src/app/features/home/fleet-grid.component.spec.ts` |
| Consumer (Story 5.3) | `src/app/features/home/home.component.ts` |

`FleetGrid` is homepage-specific and lives in the `features/home/` folder — **not** in `src/app/shared/components/`. The architectural rule is that shared components are reused by multiple features; `FleetGrid` is used exclusively by `HomeComponent`.

### Dependency Chain

Requires: **1.2** (router/routerLink), **1.3** (token system), **1.5** (ShipDataService), **2.1** (thumbnail assets at `src/assets/images/thumb/`).  
Used by: **Story 5.3** (HomeComponent imports and renders `<app-fleet-grid>`).

**Do not wire FleetGrid into HomeComponent in this story.** Story 5.3 owns that composition. Deliver a standalone, renderable component only.

### ShipDataService Usage Pattern

`FleetGrid` is data-self-sufficient — it injects `ShipDataService` directly rather than receiving data via `@Input()`. The correct reference for this pattern is `HomepageHeroComponent` (Story 5.1) or `ShipPageComponent` — **not** the recent shared components (`ShipHeroComponent`, `DossierCard`, `ShipNavComponent`), which all receive data via `@Input()` and do not inject the service. Copy this injection pattern:

```typescript
import { inject } from '@angular/core';
import { ShipDataService } from '../../core/services/ship-data.service';

// Inside the class body — no constructor needed:
private readonly shipData = inject(ShipDataService);
ships = this.shipData.getAll();
```

**Do NOT** inject via constructor parameter syntax (the existing codebase uses `inject()`).  
**Do NOT** `import { SHIPS }` from `src/data/ships.ts` directly into the component — that violates AD-3.

### Complete TypeScript Skeleton

```typescript
// src/app/features/home/fleet-grid.component.ts
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ShipDataService } from '../../core/services/ship-data.service';

@Component({
  selector: 'app-fleet-grid',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './fleet-grid.component.html',
  styleUrl: './fleet-grid.component.scss',
})
export class FleetGridComponent {
  private readonly shipData = inject(ShipDataService);
  ships = this.shipData.getAll();
}
```

Key points: no `ngOnInit` needed — `ships` is initialized directly as a class property at construction time (unlike `HomepageHeroComponent` which uses `ngOnInit`). No `@Input()`. Import path for `ShipDataService` from `features/home/` is `../../core/services/ship-data.service`.

### Thumbnail Asset Paths

The image pipeline (Story 2.1) outputs:
- `src/assets/images/thumb/{slug}.webp`
- `src/assets/images/thumb/{slug}.jpg`

Slugs match `ship.slug` exactly. Two anomalies already handled in `ships.ts`:
- `uss-keppler` (no trailing dash)
- `uss-massachusettes` (intentional misspelling matching the image filename)

At dev time, assets may not yet exist — the component renders correctly either way (graceful `<img>` with missing source simply shows nothing; no error state needed on thumbnails, unlike the hero).

### `<picture>` Template Pattern

Mirror the pattern from `ShipHeroComponent` but using the `thumb/` path and `loading="lazy"`:

```html
<picture>
  <source type="image/webp"
          [srcset]="'assets/images/thumb/' + ship.slug + '.webp'">
  <img [src]="'assets/images/thumb/' + ship.slug + '.jpg'"
       [alt]="ship.name + ' — thumbnail'"
       loading="lazy"
       class="fleet-grid__img">
</picture>
```

No blur-up loading state needed for thumbnails — they are lazy-loaded and below the fold. `loading="lazy"` is sufficient.

### 4:3 Aspect Ratio Enforcement

Use CSS `aspect-ratio: 4 / 3` on the `.fleet-grid__figure` wrapper with `overflow: hidden`. This is the simplest, most robust approach for modern browsers. The `<img>` inside it should be `width: 100%; height: 100%; object-fit: cover`.

Do **not** use the padding-top hack (`padding-top: 75%`) — `aspect-ratio` is available in all targeted browsers (Angular 22 / modern evergreen).

### Token Reference — Use These Exclusively

| Purpose | Token |
|---|---|
| Cell background / fallback | `var(--color-surface)` |
| Name overlay gradient end | `var(--color-overlay)` |
| Ship name text | `var(--color-khaki)` |
| Focus ring | `var(--color-olive)` |
| Mobile gutter | `var(--space-gutter-mobile)` (16px) |
| Desktop gutter | `var(--space-gutter)` (24px) |
| Cell gap | `var(--space-unit)` (8px) |

### Ship Name Overlay Implementation

Apply the `type-hl-sm` global utility class (defined in `_tokens.scss`) to the `<figcaption>` in the HTML template. The class is fully self-contained — it sets `font-family` (Roboto Slab), `font-size` (1rem), `font-weight` (600), `line-height` (1.4), and `letter-spacing` (0.02em). Do not redeclare any of these properties in the component SCSS. Only overlay-specific positioning and `color: var(--color-khaki)` belong in the component SCSS.

### AD-4 Compliance — No Raw Hex Values

Every color in `fleet-grid.component.scss` must be a `var(--color-*)` reference. The gradient `linear-gradient(to top, var(--color-overlay) 0%, transparent 100%)` is compliant — `transparent` is a CSS keyword, not a hex value.

### AD-2 Compliance — RouterLink Only

All ship links must use Angular `RouterLink` directive with `[routerLink]="['/ships', ship.slug]"`. Never use:
- `href="/#/ships/uss-valley-forge"` ❌
- `href="/ships/uss-valley-forge"` ❌
- `routerLink="/ships/{{ ship.slug }}"` (string interpolation in attribute — use array binding instead)

### Accessibility — Keyboard Navigation

Each `<a [routerLink]>` cell is natively keyboard-focusable (no `tabIndex` manipulation needed). The focus ring must be set on `:focus-visible` (not `:focus`) to avoid showing focus ring on mouse clicks. Use `:focus-visible` pseudo-class consistently with other components in the project.

### Grid Section Semantics

Wrap the grid in `<section aria-label="Fleet — 21 ships">` to give screen reader users a named region. Do not add a visible `<h2>` here — the HomeComponent (Story 5.3) manages the overall page heading hierarchy. The section label is screen-reader-only context.

### Recent Git Patterns (from last 5 commits)

All four most recent story commits (ShipNav, WitnessTrioBlock, NarrativeSection, DossierCard) follow this pattern:
- Standalone components with `templateUrl` + `styleUrl` (separate files, not inline)
- Injection via `inject()` functional API, not constructor injection
- `@Input()` inputs declared with `!` (definite assignment assertion)
- CSS BEM naming (`.block__element--modifier`)
- `:host { display: block; }` as first SCSS rule

`FleetGrid` has no `@Input()` (it is data-self-sufficient via ShipDataService), but all other patterns apply.

### Project Structure Notes

- Component lives at `src/app/features/home/` — not in `shared/components/`
- Import path for ShipDataService from this location: `../../core/services/ship-data.service`
- Import path for Ship model (if needed for typing): `../../shared/models/ship.model`
- The `Ship` type is not strictly required in the template since `ships` is already typed from `getAll(): Ship[]`, but the import is available if needed

### References

- [Source: docs/planning-artifacts/epics.md — Story 5.2]
- [Source: docs/planning-artifacts/epics.md — UX-DR10 (FleetGrid UX spec)]
- [Source: docs/planning-artifacts/epics.md — AD-2 (RouterLink), AD-3 (ShipDataService), AD-4 (tokens), AD-10 (dependency direction)]
- [Source: docs/planning-artifacts/epics.md — FR-10, FR-25, FR-26, FR-31]
- [Source: src/app/shared/components/ship-hero/ship-hero.component.html — `<picture>` pattern]
- [Source: src/app/shared/components/ship-hero/ship-hero.component.scss — SCSS structure pattern]
- [Source: src/app/core/services/ship-data.service.ts — inject() pattern, getAll()]
- [Source: src/styles/_tokens.scss — all token names]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6 (GitHub Copilot)

### Debug Log References

### Completion Notes List

### File List
