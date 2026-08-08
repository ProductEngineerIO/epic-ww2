# Story 5.1: Implement HomepageHero Component

Status: done

## Story

As a site visitor,
I want a single dominant photograph to greet me on the homepage,
so that the site opens with the visual weight of an album cover before I encounter the fleet.

## Acceptance Criteria

1. `HomepageHeroComponent` is a standalone component at `src/app/shared/components/homepage-hero/homepage-hero.component.ts`; it accepts **no `@Input()`** — it injects `ShipDataService` and finds the homepage hero ship itself via `getAll().find(s => s.isHomepageHero)`
2. The template renders a `<figure>` containing a `<picture>` with `<source type="image/webp">` and `<img>` JPEG fallback; the `<img>` uses `loading="eager"` and constructs its alt text as `"[ship.name], photographed by Howard Hertzog"` — **not** `ship.altText` (which is the ship-page long form)
3. The ship name is **not** overlaid on the image — no `<figcaption>` with the ship name; the image is purely visual, an editorial statement (UX-DR11); hero image dimensions and `object-fit: cover` identical to `ShipHeroComponent` (`var(--space-hero-height)`, `width: 100%`)
4. Blur-up loading pattern: `filter: blur(8px)` and `transform: scale(1.05)` applied to the `<img>` from initial paint; removed via `transition: filter 400ms ease, transform 400ms ease` when the `load` event fires (`[class.is-loaded]="imageLoaded"`); under `@media (prefers-reduced-motion: reduce)` no transition occurs — image appears immediately sharp; this is **identical** to the ShipHero blur-up implementation
5. On image error: the figure shows a dark surface fill at `var(--space-hero-height)` height with the text "Image unavailable" in label-caps styling; uses `@if (imageError) / @else` control flow **nested inside the outer `@if (ship)` guard** (same visual/UX error pattern as `ShipHeroComponent`, but structurally different — `ShipHero` has no null-ship guard since its data arrives via `@Input()`)
6. No raw hex color values appear in the component SCSS — only `var(--color-*)`, `var(--space-*)`, `var(--font-*)` references (AD-4)
7. Unit tests cover: `imageLoaded` is `false` on init; calling `onImageLoad()` sets it `true`; `imageError` is `false` on init; calling `onImageError()` sets it `true`; default template contains a `<picture>` element when `imageError` is false; error template contains the "Image unavailable" text when `imageError` is true; a mock `ShipDataService` is used with `getAll()` returning a ship array containing one ship with `isHomepageHero: true`; when no ship has `isHomepageHero: true`, the component renders nothing (silent by design)

## Tasks / Subtasks

- [ ] Create `src/app/shared/components/homepage-hero/homepage-hero.component.ts` (AC: 1)
  - [ ] `standalone: true`, `imports: []`
  - [ ] Inject `ShipDataService` with `inject()` (not constructor injection)
  - [ ] Implement `OnInit`: `this.ship = this.shipData.getAll().find(s => s.isHomepageHero) ?? null`
  - [ ] Component properties: `ship: Ship | null = null`, `imageLoaded = false`, `imageError = false`
  - [ ] Methods: `onImageLoad()` sets `imageLoaded = true`; `onImageError()` sets `imageError = true`
- [ ] Build the component template at `homepage-hero.component.html` (AC: 2, 3)
  - [ ] Outer `@if (ship)` guard — nothing renders if data is absent
  - [ ] `<figure class="homepage-hero">` container
  - [ ] `<picture>` with `<source type="image/webp" [srcset]="'assets/images/hero/' + ship.slug + '.webp'">` and `<img [src]="'assets/images/hero/' + ship.slug + '.jpg'">`
  - [ ] `[alt]="ship.name + ', photographed by Howard Hertzog'"` — do NOT use `ship.altText` here
  - [ ] `loading="eager"` — above-the-fold, critical to first paint
  - [ ] **No `<figcaption>` with ship name** — this is the key difference from ShipHero
- [ ] Implement blur-up loading state (AC: 4) — replicate ShipHero's CSS pattern exactly
  - [ ] `[class.is-loaded]="imageLoaded"` on the `<img>`
  - [ ] `(load)="onImageLoad()"` event binding on the `<img>`
  - [ ] SCSS: `.homepage-hero__img` starts with `filter: blur(8px); transform: scale(1.05); transition: none`
  - [ ] Wrap transition in `@media (prefers-reduced-motion: no-preference)` (not `reduce`)
  - [ ] `.is-loaded` class removes blur and scale
- [ ] Implement error state (AC: 5)
  - [ ] `(error)="onImageError()"` event binding on the `<img>`
  - [ ] `@if (imageError) / @else` outer control flow wrapping the `<figure>`
  - [ ] Error `<figure>` uses `.homepage-hero--error` modifier class
  - [ ] Error content: `<span class="homepage-hero__error-text">Image unavailable</span>`
- [ ] SCSS at `homepage-hero.component.scss` (AC: 6) — tokens only, no hex
  - [ ] `:host { display: block; }`
  - [ ] `.homepage-hero` height, overflow, background-color from tokens
  - [ ] `.homepage-hero__img` blur-up styles and `is-loaded` state
  - [ ] `.homepage-hero--error` dark surface fill with centered text
  - [ ] `.homepage-hero__error-text` label-caps typography from tokens
- [ ] Write unit tests at `homepage-hero.component.spec.ts` (AC: 7)
  - [ ] Mock `ShipDataService` with `jasmine.createSpyObj`
  - [ ] Provide mock via `TestBed.configureTestingModule` overriding the real service
  - [ ] Test `imageLoaded` / `imageError` state transitions
  - [ ] Test template renders `<picture>` in default state and error text in error state

## Dev Notes

### Dependency Chain

**Requires**: Story 1.1 (project scaffold), Story 1.4 (Ship model + `isHomepageHero` flag in `ships.ts`), Story 1.5 (`ShipDataService` with `getAll()`), Story 2.1 (hero images at `src/assets/images/hero/{slug}.webp/.jpg`). This story is a prerequisite for Story 5.3 (`HomeComponent`).

**No dependency on Stories 4.x** — `HomepageHeroComponent` is independent of all ship-page components.

### Critical Difference from ShipHero: Self-Resolving vs Input-Driven

`ShipHeroComponent` (Story 4.1) receives its data via `@Input() ship!: Ship` — it is a pure presentational component.

`HomepageHeroComponent` is a **smart component**: it injects `ShipDataService` and resolves its own data in `ngOnInit`. This is intentional — the homepage hero is a singleton concept and prop-drilling `isHomepageHero` discovery through `HomeComponent` adds no value.

> **Architecture Spine divergence:** The Consistency Conventions table in `ARCHITECTURE-SPINE.md` attributes the `isHomepageHero` query to `HomeComponent`. This story deliberately places it in `HomepageHeroComponent` instead. Story 5.3 (`HomeComponent`) does **not** perform this query — `HomepageHeroComponent` is fully self-resolving. This is a scoped, intentional exception to the convention entry.

Use `ngOnInit` (not `ngOnChanges`) because there is no route-bound `@Input()` that changes. The component is only ever instantiated once per homepage visit. Compare to `ShipPageComponent` which must use `ngOnChanges` due to slug changing between ship navigations.

```
HomepageHeroComponent lifecycle:
  constructor() → inject(ShipDataService) wired
  ngOnInit() → getAll().find(isHomepageHero) → this.ship set
  template renders @if (ship) → <figure><picture>...
```

### No Ship Name Overlay — Intentional (UX-DR11)

`ShipHeroComponent` overlays the ship name via an absolutely-positioned `<figcaption>` — this creates the atmospheric "album cover" effect on ship pages.

`HomepageHeroComponent` does **not** overlay the ship name. UX-DR11 explicitly states: "ship name NOT overlaid (unlike ShipHero — this is an editorial statement, not a ship page)". The intro text (Howard's context paragraph) appears **below** the hero image in `HomeComponent`'s template, not on top of it.

**Do not add a `<figcaption>` with `{{ ship.name }}`**. Doing so would break the visual design intent.

### Alt Text: Constructed String, Not ship.altText

The `ship.altText` field (from `ships.ts`) is the long-form alt text used on ship pages (per EXPERIENCE.md convention). On the homepage, the alt text convention is shorter:

```
"[ship.name], photographed by Howard Hertzog"
```

Construct this in the template: `[alt]="ship.name + ', photographed by Howard Hertzog'"` — do **not** bind `[alt]="ship.altText"`.

### Null-Ship Rendering Contract

If no ship in `SHIPS` has `isHomepageHero: true`, `ngOnInit` assigns `this.ship = null`. The outer `@if (ship)` guard causes the component to render **nothing** — no element, no error state, no placeholder. This is silent by design; the homepage should never ship without a hero-designated ship in `ships.ts`.

### No Gradient Overlay

`ShipHeroComponent` uses an `::after` pseudo-element with `linear-gradient(to bottom, transparent 40%, var(--color-overlay) 100%)` to darken the bottom of the image so the white ship-name text is readable. `HomepageHeroComponent` has no ship-name overlay, so **no gradient pseudo-element is needed**. The image renders clean, full-bleed.

### Complete TypeScript

```typescript
// src/app/shared/components/homepage-hero/homepage-hero.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { Ship } from '../../models/ship.model';
import { ShipDataService } from '../../../core/services/ship-data.service';

@Component({
  selector: 'app-homepage-hero',
  standalone: true,
  imports: [],
  templateUrl: './homepage-hero.component.html',
  styleUrl: './homepage-hero.component.scss',
})
export class HomepageHeroComponent implements OnInit {
  private readonly shipData = inject(ShipDataService);

  ship: Ship | null = null;
  imageLoaded = false;
  imageError = false;

  ngOnInit(): void {
    this.ship = this.shipData.getAll().find(s => s.isHomepageHero) ?? null;
  }

  onImageLoad(): void {
    this.imageLoaded = true;
  }

  onImageError(): void {
    this.imageError = true;
  }
}
```

**Import path notes (from `src/app/shared/components/homepage-hero/`):**
- `Ship` model: `../../models/ship.model`
- `ShipDataService`: `../../../core/services/ship-data.service`

### Complete Template

```html
<!-- src/app/shared/components/homepage-hero/homepage-hero.component.html -->
@if (ship) {
  @if (imageError) {
    <figure class="homepage-hero homepage-hero--error"
            [attr.aria-label]="ship.name + ', photographed by Howard Hertzog — image unavailable'">
      <div class="homepage-hero__error-state">
        <span class="homepage-hero__error-text">Image unavailable</span>
      </div>
    </figure>
  } @else {
    <figure class="homepage-hero">
      <picture>
        <source type="image/webp"
                [srcset]="'assets/images/hero/' + ship.slug + '.webp'">
        <img [src]="'assets/images/hero/' + ship.slug + '.jpg'"
             [alt]="ship.name + ', photographed by Howard Hertzog'"
             loading="eager"
             class="homepage-hero__img"
             [class.is-loaded]="imageLoaded"
             (load)="onImageLoad()"
             (error)="onImageError()">
      </picture>
    </figure>
  }
}
```

### Complete SCSS

```scss
// src/app/shared/components/homepage-hero/homepage-hero.component.scss

:host {
  display: block;
}

.homepage-hero {
  position: relative;
  width: 100%;
  height: var(--space-hero-height);   // clamp(400px, 68vh, 680px)
  overflow: hidden;
  margin: 0;
  background-color: var(--color-surface);
  // NOTE: No ::after gradient overlay — no ship name is overlaid on this hero
}

.homepage-hero__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;

  // Blur-up: start blurred, transition to sharp on load
  filter: blur(8px);
  transform: scale(1.05); // prevent blur edge artifacts
  transition: none; // disabled by default; enabled below for users without reduced-motion preference

  @media (prefers-reduced-motion: no-preference) {
    transition: filter 400ms ease, transform 400ms ease;
  }

  &.is-loaded {
    filter: blur(0);
    transform: scale(1);
  }
}

// Error state
.homepage-hero--error {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-surface);
}

.homepage-hero__error-state {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.homepage-hero__error-text {
  font-family: var(--font-display);
  font-size: var(--font-label-caps-size);
  font-weight: var(--font-label-caps-weight);
  line-height: var(--font-label-caps-lh);
  letter-spacing: var(--font-label-caps-ls);
  text-transform: uppercase;
  color: var(--color-steel-muted);
}
```

### Unit Tests

```typescript
// src/app/shared/components/homepage-hero/homepage-hero.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomepageHeroComponent } from './homepage-hero.component';
import { ShipDataService } from '../../../core/services/ship-data.service';
import { Ship } from '../../models/ship.model';

const heroShip: Ship = {
  slug: 'uss-valley-forge',
  name: 'USS Valley Forge',
  vesselClass: 'Essex-class',
  commissioned: 'November 3, 1946',
  fate: 'Decommissioned 1980',
  narrative: ['[Content pending]'],
  sources: ['[Source pending]'],
  altText: 'USS Valley Forge in San Francisco Bay, photographed by Howard Hertzog, c. 1944-1946.',
  isHomepageHero: true,
};

const nonHeroShip: Ship = {
  slug: 'uss-atlanta',
  name: 'USS Atlanta',
  vesselClass: 'Oakland-class',
  commissioned: 'December 3, 1944',
  fate: 'Scrapped 1970',
  narrative: ['[Content pending]'],
  sources: ['[Source pending]'],
  altText: 'USS Atlanta in San Francisco Bay.',
  // isHomepageHero: omitted — non-hero ships do not set this field (optional per Ship interface)
};

describe('HomepageHeroComponent', () => {
  let component: HomepageHeroComponent;
  let fixture: ComponentFixture<HomepageHeroComponent>;
  let mockShipDataService: jasmine.SpyObj<ShipDataService>;

  beforeEach(async () => {
    mockShipDataService = jasmine.createSpyObj('ShipDataService', ['getAll']);
    mockShipDataService.getAll.and.returnValue([nonHeroShip, heroShip]);

    await TestBed.configureTestingModule({
      imports: [HomepageHeroComponent],
      providers: [
        { provide: ShipDataService, useValue: mockShipDataService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomepageHeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have imageLoaded false on init', () => {
    expect(component.imageLoaded).toBeFalse();
  });

  it('should set imageLoaded to true when onImageLoad is called', () => {
    component.onImageLoad();
    expect(component.imageLoaded).toBeTrue();
  });

  it('should have imageError false on init', () => {
    expect(component.imageError).toBeFalse();
  });

  it('should set imageError to true when onImageError is called', () => {
    component.onImageError();
    expect(component.imageError).toBeTrue();
  });

  it('should find the ship with isHomepageHero true', () => {
    expect(component.ship).toEqual(heroShip);
  });

  it('should render a <picture> element in default state', () => {
    const picture = fixture.nativeElement.querySelector('picture');
    expect(picture).toBeTruthy();
  });

  it('should render error text when imageError is true', () => {
    component.imageError = true;
    fixture.detectChanges();
    const errorText = fixture.nativeElement.querySelector('.homepage-hero__error-text');
    expect(errorText?.textContent?.trim()).toBe('Image unavailable');
  });

  it('should construct alt text from ship name, not ship.altText', () => {
    const img = fixture.nativeElement.querySelector('img');
    expect(img?.alt).toBe('USS Valley Forge, photographed by Howard Hertzog');
  });

  it('should NOT render ship name overlay (no figcaption with name)', () => {
    const figcaption = fixture.nativeElement.querySelector('figcaption');
    expect(figcaption).toBeNull();
  });

  it('should render nothing when no ship has isHomepageHero: true', async () => {
    mockShipDataService.getAll.and.returnValue([nonHeroShip]);
    fixture = TestBed.createComponent(HomepageHeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.ship).toBeNull();
    const figure = fixture.nativeElement.querySelector('figure');
    expect(figure).toBeNull();
  });
});
```

### Architecture Compliance Checklist

| Invariant | How This Story Complies |
|---|---|
| AD-1: Standalone | `standalone: true`, no NgModules |
| AD-3: `ships.ts` sole truth | Component never imports `ships.ts` directly — consumes via `ShipDataService` |
| AD-4: Tokens only | All SCSS uses `var(--color-*)`, `var(--space-*)`, `var(--font-*)` — no hex |
| AD-6: `<picture>` + WebP | `<source type="image/webp">` + `<img>` fallback; `hero/` variant used |
| AD-7: Service root-scope | `ShipDataService` not in component `providers`; injected with `inject()` |
| AD-10: Dependency direction | **Exception:** `shared/components → core/services` is not in AD-10's permitted list (only `shared/components → shared/models` is listed). `HomepageHeroComponent` is a scoped exception — it is a smart singleton with no meaningful `@Input()` alternative. This exception is intentional and documented in Dev Notes above. |

### File Locations Summary

| File | Path | Action |
|---|---|---|
| Component TS | `src/app/shared/components/homepage-hero/homepage-hero.component.ts` | CREATE |
| Component HTML | `src/app/shared/components/homepage-hero/homepage-hero.component.html` | CREATE |
| Component SCSS | `src/app/shared/components/homepage-hero/homepage-hero.component.scss` | CREATE |
| Unit test | `src/app/shared/components/homepage-hero/homepage-hero.component.spec.ts` | CREATE |

No existing files are modified in this story. `HomeComponent` will import `HomepageHeroComponent` in Story 5.3.

### Previous Story Intelligence (from Story 4.7 — ShipPageComponent)

- **`inject()` over constructor injection** — established pattern in this codebase; use `private readonly shipData = inject(ShipDataService)`
- **`@if` control flow** — use Angular 17+ control flow syntax throughout (`@if`, `@else`), not `*ngIf`
- **`ngOnChanges` vs `ngOnInit`** — use `ngOnInit` here (no route-bound input); `ngOnChanges` is only needed when a `@Input()` changes between navigations (as in `ShipPageComponent`)
- **Visually-hidden content pattern** — not applicable here, but note that `ShipHero`'s `<figcaption>` has `aria-hidden="true"` in the ship page context; `HomepageHeroComponent` has no figcaption at all

### What Story 5.3 (HomeComponent) Will Do with This Component

`HomeComponent` (Story 5.3) will import `HomepageHeroComponent` and render it as:

```html
<main class="home-page">
  <app-homepage-hero />
  <!-- intro text block (Howard, San Francisco Bay, c. 1944–1946) -->
  <app-fleet-grid />
</main>
```

HomepageHeroComponent is standalone and self-contained — Story 5.3 needs only to add `HomepageHeroComponent` to `HomeComponent`'s `imports` array and drop `<app-homepage-hero />` in the template. No inputs required.

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6 (GitHub Copilot)

### Debug Log References

### Completion Notes List

### File List
