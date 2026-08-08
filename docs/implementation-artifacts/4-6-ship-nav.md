# Story 4.6: Implement ShipNav Component

Status: done

## Story

As a site visitor,
I want Prev / Next ship navigation and a "Back to fleet" link on every ship page,
so that I can browse all 21 ships without losing my place or fighting the browser back button.

## Acceptance Criteria

1. `ShipNavComponent` is a standalone component at `src/app/shared/components/ship-nav/ship-nav.component.ts` accepting `@Input() currentSlug!: string`; it injects `ShipDataService` to resolve adjacent slugs
2. Renders three navigation elements with the exact microcopy: "← Previous ship", "↑ Back to fleet", "Next ship →" — using `[routerLink]` (never bare `<a href>`)
3. Navigation is always circular: ship #1 Previous → ship #21; ship #21 Next → ship #1; no disabled states on any button
4. Arrow-key keyboard navigation: a document-level `keydown` listener on the ship page activates `ArrowLeft` → previous ship, `ArrowRight` → next ship; the listener is added `OnInit` and removed `OnDestroy` (no memory leak)
5. On tablet+ (≥768px): all three elements appear on one horizontal line; on mobile (<768px): Prev and Next are on the outer edges and "↑ Back to fleet" centers on its own row between them
6. All interactive elements have a minimum 44×44px tap area and show a visible focus ring on keyboard focus
7. No raw hex values in component SCSS

## Tasks / Subtasks

- [ ] Create `src/app/shared/components/ship-nav/ship-nav.component.ts` + `.html` + `.scss` (AC: 1)
  - [ ] `standalone: true`; import `RouterLink` from `@angular/router`
  - [ ] `@Input() currentSlug!: string`
  - [ ] Inject `ShipDataService` via `inject(ShipDataService)`
  - [ ] Expose `prevSlug` and `nextSlug` getters that call `this.shipData.getAdjacentSlugs(this.currentSlug)`
- [ ] Build the template with three `routerLink` elements (AC: 2, 3)
  - [ ] Prev: `[routerLink]="['/ships', prevSlug]"` with label "← Previous ship"
  - [ ] Back to fleet: `[routerLink]="['/']"` with label "↑ Back to fleet"
  - [ ] Next: `[routerLink]="['/ships', nextSlug]"` with label "Next ship →"
- [ ] Implement keyboard listener (AC: 4)
  - [ ] `implements OnInit, OnDestroy`
  - [ ] Inject `Router` to use `this.router.navigate()`
  - [ ] In `ngOnInit`: `document.addEventListener('keydown', this.onKeyDown)`
  - [ ] In `ngOnDestroy`: `document.removeEventListener('keydown', this.onKeyDown)`
  - [ ] `onKeyDown` is an arrow function bound to `this`; handles `ArrowLeft` and `ArrowRight`
- [ ] SCSS: flex layout, responsive swap, touch targets, token-only colors (AC: 5, 6, 7)
  - [ ] Tablet+: `display: flex; justify-content: space-between; align-items: center`
  - [ ] Mobile: `display: grid; grid-template-areas: "prev back next" → "prev . next" / ". back ."` or equivalent two-row layout

## Dev Notes

### Dependency Chain

Requires **Story 1.1**, **Story 1.2** (router), **Story 1.3** (tokens), **Story 1.5** (ShipDataService). Used by **Story 4.7** (ShipPageComponent).

### DESIGN.md Component Spec

```yaml
ShipNav:
  background: surface            # → var(--color-surface)
  border-top: '1px solid {colors.outline-variant}'  # → var(--color-outline-v)
  padding: '1.5rem {spacing.gutter}'
  prev-next-style: headline-sm   # Roboto Slab 1rem, w600, lh 1.4, ls 0.02em
  prev-next-color: on-surface-variant  # → var(--color-khaki)
  back-link-style: label-caps    # Roboto Slab 0.7rem, uppercase, ls 0.12em
  back-link-color: primary       # → var(--color-olive)
```

### Exact Microcopy (EXPERIENCE.md Voice & Tone)

Navigation labels are defined exactly:
- `← Previous ship` (← is a Unicode left arrow character, not an icon component)
- `Next ship →` (→ is a Unicode right arrow character)
- `↑ Back to fleet` (↑ is a Unicode up arrow character)

Do not use `&larr;` HTML entities or icon libraries — use the actual Unicode characters inline: `←`, `→`, `↑`.

### Keyboard Navigation Implementation

EXPERIENCE.md Interaction Primitives:
> "`ArrowLeft` → Previous ship. `ArrowRight` → Next ship. No other keyboard shortcuts."
> "Document-level `keydown` listener on ship page routes only."

The listener must be active only when `ShipNavComponent` is mounted (on ship pages). Angular's `OnInit`/`OnDestroy` lifecycle guarantees the listener is active exactly when the component exists:

```typescript
import { Component, Input, OnInit, OnDestroy, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ShipDataService } from '../../core/services/ship-data.service';  // adjust path

@Component({
  selector: 'app-ship-nav',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './ship-nav.component.html',
  styleUrl: './ship-nav.component.scss',
})
export class ShipNavComponent implements OnInit, OnDestroy {
  @Input() currentSlug!: string;

  private readonly shipData = inject(ShipDataService);
  private readonly router = inject(Router);
  private readonly onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      this.router.navigate(['/ships', this.prevSlug]);
    } else if (e.key === 'ArrowRight') {
      this.router.navigate(['/ships', this.nextSlug]);
    }
  };

  get prevSlug(): string {
    return this.shipData.getAdjacentSlugs(this.currentSlug).prev;
  }
  get nextSlug(): string {
    return this.shipData.getAdjacentSlugs(this.currentSlug).next;
  }

  ngOnInit(): void {
    document.addEventListener('keydown', this.onKeyDown);
  }
  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.onKeyDown);
  }
}
```

**Arrow function binding:** `this.onKeyDown` is defined as an arrow function property — this ensures `this` is correctly bound when used as an event listener reference (required for `removeEventListener` to work correctly). Do not use `.bind(this)` inline — it creates a new function reference that cannot be removed.

### Template

```html
<!-- ship-nav.component.html -->
<nav class="ship-nav" aria-label="Ship navigation">
  <a [routerLink]="['/ships', prevSlug]" class="ship-nav__link ship-nav__prev">
    ← Previous ship
  </a>
  <a [routerLink]="['/']" class="ship-nav__link ship-nav__back">
    ↑ Back to fleet
  </a>
  <a [routerLink]="['/ships', nextSlug]" class="ship-nav__link ship-nav__next">
    Next ship →
  </a>
</nav>
```

### Responsive Layout (EXPERIENCE.md)

> "All three elements (Prev, Back to fleet, Next) on one line on tablet+. On mobile, 'Back to fleet' centers on its own row between Prev and Next."

```scss
// ship-nav.component.scss
:host { display: block; }

.ship-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem var(--space-gutter);
  border-top: 1px solid var(--color-outline-v);
  background-color: var(--color-surface);

  @media (max-width: 767px) {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    grid-template-rows: auto auto;
    grid-template-areas:
      "prev . next"
      ". back .";
    gap: 0.75rem;
    padding: 1.5rem var(--space-gutter-mobile);
  }
}

.ship-nav__link {
  display: flex;
  align-items: center;
  min-height: 44px;
  padding: 0.25rem 0.5rem;
  text-decoration: none;
  transition: color 150ms ease;

  @media (prefers-reduced-motion: reduce) { transition: none; }
}

.ship-nav__prev {
  font-family: var(--font-display);
  font-size: var(--font-hl-sm-size);
  font-weight: var(--font-hl-sm-weight);
  color: var(--color-khaki);

  @media (max-width: 767px) { grid-area: prev; }
}

.ship-nav__next {
  font-family: var(--font-display);
  font-size: var(--font-hl-sm-size);
  font-weight: var(--font-hl-sm-weight);
  color: var(--color-khaki);
  text-align: right;

  @media (max-width: 767px) { grid-area: next; justify-self: end; }
}

.ship-nav__back {
  font-family: var(--font-display);
  font-size: var(--font-label-caps-size);
  font-weight: var(--font-label-caps-weight);
  letter-spacing: var(--font-label-caps-ls);
  text-transform: uppercase;
  color: var(--color-olive);

  @media (max-width: 767px) { grid-area: back; justify-self: center; }
}
```

### No Disabled State

EXPERIENCE.md:
> "Circular: ship 1 Prev → ship 21; ship 21 Next → ship 1. Keyboard: ← → arrow keys trigger on ship page. No disabled state."

Ship #1's Previous is always ship #21 (circular). Do not add `disabled` or `pointer-events: none` to any ShipNav element. The `ShipDataService.getAdjacentSlugs()` circular modulo handles this.

### Import Path for ShipDataService

From `src/app/shared/components/ship-nav/`, the relative path to `ShipDataService` is:
```typescript
import { ShipDataService } from '../../../core/services/ship-data.service';
```

### Project Structure Notes

- Component dir: `src/app/shared/components/ship-nav/`
- Used by: ShipPageComponent (Story 4.7) — not inside WitnessTrioBlock

### References

- [Source: docs/planning-artifacts/ux-designs/ux-epic-ww2-2026-07-29/DESIGN.md — components.ShipNav]
- [Source: docs/planning-artifacts/ux-designs/ux-epic-ww2-2026-07-29/EXPERIENCE.md — Component Patterns (ShipNav), Interaction Primitives (arrow keys), Responsive & Platform (ShipNav responsive), State Patterns (ShipNav circular)]
- [Source: docs/planning-artifacts/architecture/architecture-epic-ww2-2026-07-29/architecture-document.md — ShipDataService.getAdjacentSlugs()]
- [Source: docs/planning-artifacts/architecture/architecture-epic-ww2-2026-07-29/ARCHITECTURE-SPINE.md — AD-2, AD-4]
- [Source: docs/planning-artifacts/prds/prd-epic-ww2-2026-07-29/prd.md — FR-7, FR-8]
- [Source: docs/planning-artifacts/epics.md — Epic 4, Story 4.6]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6

### Debug Log References

### Completion Notes List

### File List
