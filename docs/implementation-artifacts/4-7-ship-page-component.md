# Story 4.7: Implement ShipPageComponent Feature

Status: ready-for-dev

## Story

As a site visitor,
I want a complete ship page that composes the hero photograph, witness trio, and ship navigation into one coherent view,
so that I experience the full Witness Document Trio for any ship I navigate to.

## Acceptance Criteria

1. `ShipPageComponent` at `src/app/features/ship/ship-page.component.ts` receives `slug` as an `@Input()` bound via Angular's `withComponentInputBinding()` (no `ActivatedRoute` injection needed for the slug)
2. The component calls `ShipDataService.getBySlug(slug)` and renders `ShipHeroComponent`, `WitnessTrioBlockComponent`, and `ShipNavComponent` in that DOM order — inside a `<main>` → `<article>` semantic structure with `<h1>` for the ship name (once, not duplicated)
3. If `getBySlug(slug)` returns `undefined` (unknown slug), the component redirects to `/#/not-found` using Angular `Router.navigate`
4. The browser tab title is set to `"[Ship Name] — Howard Hertzog WWII Photography"` automatically by `RouterTitleStrategy` from Story 1.2
5. The page scrolls to the top on load (handled by `scrollPositionRestoration: 'top'` from Story 1.2 — no additional scroll code needed)
6. Navigating to `/#/ships/uss-valley-forge` renders the full page without errors; the Witness Document Trio components all render (with placeholder content acceptable until Epic 8)
7. Any ship whose data includes `isHomepageHero: true` renders identically to all other ship pages — no conditional behavior or visual difference based on this flag (it is consumed only by `HomepageHeroComponent` in Story 5.1)

## Tasks / Subtasks

- [ ] Update the stub `ShipPageComponent` created in Story 1.1 (AC: 1)
  - [ ] Replace stub template with the full implementation
  - [ ] Add `@Input() slug!: string` — no `ActivatedRoute` import
  - [ ] Inject `ShipDataService` and `Router`
- [ ] Implement the ship lookup and not-found redirect (AC: 3)
  - [ ] Implement `ngOnChanges(changes: SimpleChanges)` — **not** `ngOnInit` — so the lookup re-runs whenever `slug` changes (Angular reuses the same component instance when navigating between ship pages via ShipNav Prev/Next; `ngOnInit` only fires once and will show stale data on subsequent ships)
  - [ ] Inside `ngOnChanges`, check `if (changes['slug'])` then look up `this.ship = this.shipData.getBySlug(this.slug)`
  - [ ] If `!this.ship`, call `this.router.navigate(['/not-found'])`
  - [ ] Guard the template with `@if (ship)` to prevent rendering before redirect completes
- [ ] Build the template (AC: 2)
  - [ ] `<article>` as main content wrapper
  - [ ] `<h1>` for ship name — appears once (not inside ShipHero's figcaption AND here — ShipHero's figcaption overlays the photo visually but the structural `<h1>` is the accessible heading)
  - [ ] `<app-ship-hero [ship]="ship">`
  - [ ] `<app-witness-trio-block [ship]="ship">`
  - [ ] `<app-ship-nav [currentSlug]="slug">`
  - [ ] In `ship-hero.component.html`: add `aria-hidden="true"` to the `<figcaption class="ship-hero__name">` element — the visually-hidden `<h1>` in this component is the canonical screen-reader heading; without this change, screen readers announce the ship name twice (AC: 2)
- [ ] Import all three child components in the `imports` array (AC: 2)
- [ ] Verify smoke test: `ng serve`, navigate to `/#/ships/uss-valley-forge`, page renders without errors (AC: 6)

## Dev Notes

### Dependency Chain

**Requires all of**: Story 1.2 (routing + `withComponentInputBinding`), Story 1.5 (ShipDataService), Story 4.1 (ShipHero), Story 4.5 (WitnessTrioBlock), Story 4.6 (ShipNav). This is the final integration story for Epic 4.

### `@Input() slug` via `withComponentInputBinding()`

Angular's `withComponentInputBinding()` (configured in Story 1.2's `app.config.ts`) automatically binds route parameters to `@Input()` properties with matching names. The route `'ships/:slug'` maps to `@Input() slug!: string` in `ShipPageComponent`. No `ActivatedRoute` injection is needed.

**Important:** The `slug` input is set *after* component construction, in the binding phase. Use `ngOnChanges` — **not** `ngOnInit` — to react to it. Angular's default `RouteReuseStrategy` reuses the same component instance when navigating between routes with the same route config (e.g., ship → ship via ShipNav). `ngOnInit` fires only once; only `ngOnChanges` fires on each slug update. Do not access `this.slug` in the constructor.

### H1 and ShipHero Figcaption — Not a Duplication

The `<h1>` in the page structure and the ship name in ShipHero's `<figcaption>` serve different roles:
- `<h1>` is the **accessible page heading** — screen readers announce this as the page title; it is the primary landmark
- ShipHero's `<figcaption>` shows the ship name as a **visual overlay** on the photograph — it is decorative/atmospheric

These can display the same text (`ship.name`) without being semantically duplicated, because they serve different document roles. However, consider adding `aria-hidden="true"` to the ShipHero figcaption to prevent screen readers from announcing the ship name twice:

In `ship-hero.component.html`:
```html
<figcaption class="ship-hero__name" aria-hidden="true">{{ ship.name }}</figcaption>
```

The `<h1>` in `ShipPageComponent` is the canonical heading for screen readers.

### Complete TypeScript

```typescript
// src/app/features/ship/ship-page.component.ts
import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Ship } from '../../shared/models/ship.model';
import { ShipDataService } from '../../core/services/ship-data.service';
import { ShipHeroComponent } from '../../shared/components/ship-hero/ship-hero.component';
import { WitnessTrioBlockComponent } from '../../shared/components/witness-trio-block/witness-trio-block.component';
import { ShipNavComponent } from '../../shared/components/ship-nav/ship-nav.component';

@Component({
  selector: 'app-ship-page',
  standalone: true,
  imports: [ShipHeroComponent, WitnessTrioBlockComponent, ShipNavComponent],
  templateUrl: './ship-page.component.html',
  styleUrl: './ship-page.component.scss',
})
export class ShipPageComponent implements OnChanges {
  @Input() slug!: string;

  private readonly shipData = inject(ShipDataService);
  private readonly router = inject(Router);

  ship: Ship | undefined;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['slug']) {
      this.ship = this.shipData.getBySlug(this.slug);
      if (!this.ship) {
        this.router.navigate(['/not-found']);
      }
    }
  }
}
```

### Complete Template

```html
<!-- ship-page.component.html -->
@if (ship) {
  <article class="ship-page">
    <h1 class="ship-page__title">{{ ship.name }}</h1>
    <app-ship-hero [ship]="ship" />
    <app-witness-trio-block [ship]="ship" />
    <app-ship-nav [currentSlug]="slug" />
  </article>
}
```

### SCSS

```scss
// ship-page.component.scss
:host {
  display: block;
}

.ship-page {
  // The article is a full-page layout container; no max-width here
  // — ShipHero bleeds full-width, WitnessTrioBlock and ShipNav manage their own max-width
}

.ship-page__title {
  // Visually hidden — the ship name is already visually shown by ShipHero's figcaption overlay
  // This <h1> is for screen readers and document outline only
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

**Note on visually-hidden h1:** The ship name is visually prominent in ShipHero's figcaption overlay. The `<h1>` is for document structure and screen reader announcement. Making it visually hidden (screen-reader-only) avoids visual duplication. This is a common pattern. If the product owner prefers a visible `<h1>`, remove the visually-hidden styles — both approaches are valid.

### `isHomepageHero` Has No Effect on Ship Page (AC: 7)

One ship has `isHomepageHero: true` in `ships.ts`. This flag is consumed only by `HomepageHeroComponent` (Story 5.1). The `ShipPageComponent` renders all ships identically regardless of this flag — do not add any conditional logic based on `isHomepageHero` here. Smoke-test this ship's page explicitly (find its slug in `ships.ts` and navigate to `/#/ships/{slug}`) to confirm AC 7.

### AD-10 Import Direction

From AD-10: `features/*` may import from `shared/components/*`, `shared/models/*`, `core/services/*`. This story follows that direction:
- `ShipPageComponent` (feature) imports `ShipHeroComponent`, `WitnessTrioBlockComponent`, `ShipNavComponent` (shared)
- `ShipPageComponent` (feature) injects `ShipDataService` (core)

Never import from `features/*` into `shared/*` or `core/*`.

### Project Structure Notes

- File: `src/app/features/ship/ship-page.component.ts` (updated from Story 1.1 stub)
- This story **replaces** the stub created in Story 1.1 — it is not a new file

### References

- [Source: docs/planning-artifacts/ux-designs/ux-epic-ww2-2026-07-29/EXPERIENCE.md — Key Flow 1 (full ship page load), Accessibility Floor (article, h1), Component Patterns (WitnessTrioBlock atomic)]
- [Source: docs/planning-artifacts/architecture/architecture-epic-ww2-2026-07-29/architecture-document.md — Routing (withComponentInputBinding), Component Architecture diagram]
- [Source: docs/planning-artifacts/architecture/architecture-epic-ww2-2026-07-29/ARCHITECTURE-SPINE.md — AD-5 (WitnessTrioBlock atomic), AD-9 (RouterTitleStrategy sets title), AD-10 (import direction)]
- [Source: docs/planning-artifacts/prds/prd-epic-ww2-2026-07-29/prd.md — FR-1–FR-8, FR-15, FR-19]
- [Source: docs/planning-artifacts/epics.md — Epic 4, Story 4.7]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6

### Debug Log References

### Completion Notes List

### File List
