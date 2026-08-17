# Story 4.1: Implement ShipHero Component

Status: ready-for-dev

## Story

As a site visitor,
I want a full-bleed hero photograph when I land on a ship page,
so that my first experience is the full visual impact of Howard's photograph before any text.

## Acceptance Criteria

1. `ShipHeroComponent` is a standalone component at `src/app/shared/components/ship-hero/ship-hero.component.ts` that accepts a `@Input() ship!: Ship` input
2. The template renders `<figure>` → `<picture>` (with WebP source + JPEG img fallback) → `<figcaption>` with the ship name; the `<img>` uses `loading="eager"`, `[alt]="ship.altText"`, and the `ship.slug` to derive the asset path
3. The image is full viewport width (`width: 100%`), height `clamp(400px, 68vh, 680px)` (`var(--space-hero-height)`), `object-fit: cover`; a gradient overlay `linear-gradient(to bottom, transparent 40%, var(--color-overlay) 100%)` covers the bottom of the image; the ship name in the figcaption is positioned bottom-left over the overlay in `display-hero` typography and `var(--color-khaki)`
4. Blur-up loading: `filter: blur(8px)` and `transform: scale(1.05)` are applied to the hero `<img>` from initial paint; when the `load` event fires, both are removed via `transition: filter 400ms ease, transform 400ms ease`, revealing the sharp image at natural scale; under `@media (prefers-reduced-motion: reduce)` no transition occurs — the image appears immediately sharp
5. On image error: the figure shows a dark surface fill at `var(--space-hero-height)` height with the text "Image unavailable" in `label-caps` styling; the error state never blocks rendering of the `WitnessTrioBlock` below it
6. No raw hex color values appear in the component SCSS — only `var(--color-*)` and `var(--space-*)` references

## Tasks / Subtasks

- [ ] Create `src/app/shared/components/ship-hero/ship-hero.component.ts` (AC: 1)
  - [ ] `standalone: true`, `imports: []` (no Angular directives needed — event bindings are native)
  - [ ] `@Input() ship!: Ship` with Ship imported from `src/app/shared/models/ship.model`
- [ ] Build the component template (AC: 2, 3)
  - [ ] `<figure>` container with gradient overlay via `::after` pseudo-element
  - [ ] `<picture>` with `<source type="image/webp">` and `<img>` JPEG fallback
  - [ ] Asset paths derived from `ship.slug`: `assets/images/hero/{{ ship.slug }}.webp` / `.jpg`
  - [ ] `<figcaption>` with `{{ ship.name }}` positioned absolutely bottom-left
- [ ] Implement blur-up loading state (AC: 4)
  - [ ] Component property `imageLoaded = false`; bind `(load)="onImageLoad()"` on `<img>`
  - [ ] CSS: when `imageLoaded` is false apply `filter: blur(8px)` on the img; when true remove it with transition
  - [ ] Use `[class.is-loaded]="imageLoaded"` on the `<img>` and CSS class toggle
  - [ ] Wrap transition in `@media (prefers-reduced-motion: no-preference)`
- [ ] Implement error state (AC: 5)
  - [ ] Component property `imageError = false`; bind `(error)="onImageError()"` on `<img>`
  - [ ] When `imageError` is true, replace image with dark surface + "Image unavailable" overlay text
  - [ ] Use `@if (imageError)` / `@else` blocks (Angular 17+ control flow syntax)
- [ ] SCSS implementation with tokens only (AC: 6)
  - [ ] All colors via `var(--color-*)`, hero height via `var(--space-hero-height)`
- [ ] Write unit tests (AC: 1–5)
  - [ ] Configure `TestBed` with the standalone `ShipHeroComponent`; use `NO_ERRORS_SCHEMA` and a stub `Ship` input: `{ slug: 'test-ship', name: 'Test Ship', altText: 'Test alt', vesselClass: '', commissioned: '', fate: '', narrative: [], sources: [] }`
  - [ ] Assert `imageLoaded` is `false` on init; calling `onImageLoad()` sets it to `true`
  - [ ] Assert `imageError` is `false` on init; calling `onImageError()` sets it to `true`
  - [ ] Assert default template contains a `<picture>` element when `imageError` is false
  - [ ] Assert error template contains `.ship-hero--error` and the text "Image unavailable" when `imageError` is true

## Dev Notes

### Dependency Chain

Requires **Story 1.1** (scaffold), **Story 1.3** (design tokens), **Story 1.4** (Ship model). Image assets must exist in `src/assets/images/hero/` from **Story 2.1** for visual verification, but the component compiles without them.

### Blur-Up Implementation: CSS-Only Approach

The epic spec language says "10px wide placeholder image" but the image pipeline (Story 2.1) produces `thumb/` at 600w — no 10px asset exists. This story intentionally implements blur-up as a **CSS-only effect on the single `<img>` element**:

- `filter: blur(8px)` is applied from the moment the element renders
- `transform: scale(1.05)` prevents blurred-pixel edge bleed at the container boundary; on `load` it is removed alongside the filter, producing a subtle sharpen-and-settle effect
- When the browser fires the `load` event, both properties are removed with a `400ms ease` transition, revealing the sharp hero image
- This requires no additional asset and delivers the intended progressive-reveal experience

Do NOT attempt to load a separate 10px placeholder — no such asset is produced by the pipeline.

### DESIGN.md Component Spec

```yaml
ShipHero:
  height: clamp(400px, 68vh, 680px)   # → var(--space-hero-height)
  object-fit: cover
  width: '100%'
  gradient-overlay: 'linear-gradient(to bottom, transparent 40%, {colors.overlay} 100%)'
  ship-name-position: 'bottom-left, over overlay'
  ship-name-style: display-hero       # Roboto Slab, clamp(2rem,6vw,3.5rem), w700
  ship-name-color: on-surface-variant # → var(--color-khaki)
```

### Architecture Template Pattern (from architecture-document.md)

```html
<figure class="ship-hero">
  <picture>
    <source type="image/webp" [srcset]="'assets/images/hero/' + ship.slug + '.webp'">
    <img [src]="'assets/images/hero/' + ship.slug + '.jpg'"
         [alt]="ship.altText"
         loading="eager"
         class="ship-hero__img">
  </picture>
  <figcaption class="ship-hero__name">{{ ship.name }}</figcaption>
</figure>
```

Extend this with blur-up and error state handling.

### Complete Component TypeScript

```typescript
// src/app/shared/components/ship-hero/ship-hero.component.ts
import { Component, Input } from '@angular/core';
import { Ship } from '../../models/ship.model';

@Component({
  selector: 'app-ship-hero',
  standalone: true,
  imports: [],
  templateUrl: './ship-hero.component.html',
  styleUrl: './ship-hero.component.scss',
})
export class ShipHeroComponent {
  @Input() ship!: Ship;
  imageLoaded = false;
  imageError = false;

  onImageLoad(): void {
    this.imageLoaded = true;
  }

  onImageError(): void {
    this.imageError = true;
  }
}
```

### Template with Angular 17+ Control Flow

```html
<!-- ship-hero.component.html -->
@if (imageError) {
  <figure class="ship-hero ship-hero--error" aria-label="{{ ship.name }} — image unavailable">
    <div class="ship-hero__error-state">
      <span class="ship-hero__error-text">Image unavailable</span>
    </div>
    <figcaption class="ship-hero__name">{{ ship.name }}</figcaption>
  </figure>
} @else {
  <figure class="ship-hero">
    <picture>
      <source type="image/webp"
              [srcset]="'assets/images/hero/' + ship.slug + '.webp'">
      <img [src]="'assets/images/hero/' + ship.slug + '.jpg'"
           [alt]="ship.altText"
           loading="eager"
           class="ship-hero__img"
           [class.is-loaded]="imageLoaded"
           (load)="onImageLoad()"
           (error)="onImageError()">
    </picture>
    <figcaption class="ship-hero__name">{{ ship.name }}</figcaption>
  </figure>
}
```

### SCSS

```scss
// ship-hero.component.scss
:host {
  display: block;
}

.ship-hero {
  position: relative;
  width: 100%;
  height: var(--space-hero-height);
  overflow: hidden;
  background-color: var(--color-surface);

  // Gradient overlay (bottom of image)
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, transparent 40%, var(--color-overlay) 100%);
    pointer-events: none;
  }
}

.ship-hero__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  // Blur-up: start blurred, transition to sharp on load
  filter: blur(8px);
  transform: scale(1.05); // prevent blur edge artifacts
  transition: none; // disabled until prefers-reduced-motion check below

  @media (prefers-reduced-motion: no-preference) {
    transition: filter 400ms ease, transform 400ms ease;
  }

  &.is-loaded {
    filter: blur(0);
    transform: scale(1);
  }
}

.ship-hero__name {
  position: absolute;
  bottom: 1.5rem;
  left: var(--space-gutter);
  z-index: 1; // above ::after overlay
  font-family: var(--font-display);
  font-size: var(--font-display-hero-size);
  font-weight: var(--font-display-hero-weight);
  line-height: var(--font-display-hero-lh);
  letter-spacing: var(--font-display-hero-ls);
  color: var(--color-khaki);
}

// Error state
.ship-hero--error {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-surface);
  &::after { display: none; } // no gradient on error

  .ship-hero__name {
    bottom: 1.5rem;
    // still show ship name even in error state
  }
}

.ship-hero__error-state {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.ship-hero__error-text {
  font-family: var(--font-display);
  font-size: var(--font-label-caps-size);
  font-weight: var(--font-label-caps-weight);
  letter-spacing: var(--font-label-caps-ls);
  text-transform: uppercase;
  color: var(--color-steel-muted);
}
```

### Token Utility Classes vs. Individual Properties

`_tokens.scss` defines a `.type-display-hero` utility class that composes all display-hero properties. The SCSS for `.ship-hero__name` intentionally uses **individual `var(--font-display-hero-*)` references** rather than that class to keep all BEM styles within the component's SCSS file and avoid mixing utility classes into component HTML. Do not replace these with `@apply` or add `.type-display-hero` to the figcaption element.

### Project Structure Notes

- Component dir: `src/app/shared/components/ship-hero/`
- Used by: `ShipPageComponent` (Story 4.7) — not by `WitnessTrioBlock`

### References

- [Source: docs/planning-artifacts/ux-designs/ux-epic-ww2-2026-07-29/DESIGN.md — components.ShipHero]
- [Source: docs/planning-artifacts/ux-designs/ux-epic-ww2-2026-07-29/EXPERIENCE.md — Component Patterns (ShipHero), State Patterns, Key Flow 1 step 4 & failure case]
- [Source: docs/planning-artifacts/architecture/architecture-epic-ww2-2026-07-29/architecture-document.md — ShipHero template pattern, AD-6]
- [Source: docs/planning-artifacts/architecture/architecture-epic-ww2-2026-07-29/ARCHITECTURE-SPINE.md — AD-4, AD-6]
- [Source: docs/planning-artifacts/prds/prd-epic-ww2-2026-07-29/prd.md — FR-1, FR-26]
- [Source: docs/planning-artifacts/epics.md — Epic 4, Story 4.1]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6

### Debug Log References

### Completion Notes List

### File List
