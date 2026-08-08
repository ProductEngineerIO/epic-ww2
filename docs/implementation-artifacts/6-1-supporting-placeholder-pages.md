# Story 6.1 + 6.2: Implement Supporting Placeholder Pages

Status: ready-for-dev

## Story

As a site visitor who clicks "About Howard" or navigates to an unknown route,
I want a graceful, on-brand page in both cases,
so that no navigation slot or URL leaves me stranded with a blank stub or a browser 404.

## Root Cause (Context for Dev Agent)

`AboutComponent` and `NotFoundComponent` are unimplemented stubs from Story 1.1 — both render `<p>ComponentName</p>`. Navigation routes are wired correctly (`/#/about` → `AboutComponent`, unknown routes → `NotFoundComponent`), but the stub content is visually indistinguishable from the HomeComponent stub, making the site appear broken. This story replaces both stubs with proper placeholder pages per FR-14, FR-15, UX-DR13, and UX-DR14.

## Acceptance Criteria

### Story 6.1 — AboutComponent

1. Navigating to `/#/about` renders `AboutComponent` with a full-page dark-surface layout; `PersistentNav` is intact and "About Howard" has the active state via `routerLinkActive`
2. The page displays a centered `<h1>` heading in Roboto Slab (`var(--font-display)`) with `var(--color-khaki)` color
3. Body copy reads exactly: `"The story of Howard Hertzog — coming soon."` — no emoji, no "🚧", no lorem ipsum
4. The browser tab title reads `"About Howard — Howard Hertzog WWII Photography"` (already set by `RouterTitleStrategy` from Story 1.2 — no additional code needed)
5. No raw hex values appear in any SCSS for this component — only `var(--color-*)` and `var(--font-*)` references

### Story 6.2 — NotFoundComponent

6. Navigating to any unknown route (e.g., `/#/foo`) redirects to `/#/not-found` via the Angular router wildcard (`'**'` → `redirectTo: 'not-found'`, already configured in Story 1.2) and `NotFoundComponent` renders
7. `NotFoundComponent` uses the same full-page dark-surface visual treatment as `AboutComponent`
8. Heading reads `"Page not found."` — rendered as `<h2>` (not `<h1>`); color `var(--color-khaki)`; Roboto Slab font
9. A `"← Back to fleet"` link navigates to `/#/` via Angular `[routerLink]="['/']"` — never a bare `<a href>`; link is styled with `var(--color-olive)` and meets the 44×44px minimum tap target
10. `PersistentNav` is intact on the not-found page; neither "Fleet" nor "About Howard" is marked active (no route match)

## Tasks / Subtasks

- [ ] Create `ComingSoonComponent` at `src/app/shared/components/coming-soon/` (used by both AC 1–5 and AC 7–8)
  - [ ] `coming-soon.component.ts` — `standalone: true`; accepts `@Input() heading!: string` and `@Input() body!: string`
  - [ ] `coming-soon.component.html` — see Complete Template in Dev Notes
  - [ ] `coming-soon.component.scss` — full-page dark surface layout; heading in Roboto Slab; body in Lora; see SCSS in Dev Notes
  - [ ] Token-only colors and fonts — no raw hex values
- [ ] Update `AboutComponent` to use `ComingSoonComponent` (AC: 1–5)
  - [ ] Replace inline stub template with `templateUrl: './about.component.html'`
  - [ ] Create `about.component.html` that renders `<app-coming-soon>` with the About-specific heading and body copy
  - [ ] Import `ComingSoonComponent` in `AboutComponent`'s `imports` array
- [ ] Update `NotFoundComponent` to use `ComingSoonComponent` (AC: 6–10)
  - [ ] Replace inline stub template with `templateUrl: './not-found.component.html'`
  - [ ] Create `not-found.component.html` that renders `<app-coming-soon>` with the not-found heading and a "← Back to fleet" `routerLink`
  - [ ] Import `ComingSoonComponent` and `RouterLink` in `NotFoundComponent`'s `imports` array
  - [ ] "← Back to fleet" link: `[routerLink]="['/']"`; must have `min-height: 44px; min-width: 44px; display: inline-flex; align-items: center` for tap target (AC: 9)
- [ ] Verify both pages at runtime (AC: 1, 6, 10)
  - [ ] `ng serve` → navigate to `/#/about`: heading and body copy render correctly; "About Howard" is active in nav
  - [ ] Navigate to `/#/foo` (unknown route): redirected to `/#/not-found`; "Page not found." heading and "← Back to fleet" link visible; no nav link is active

## Dev Notes

### Dependency Chain

Requires Story 1.1 (stub files exist to update), Story 1.2 (routing wired), Story 1.3 (token system), Story 3.1 (PersistentNav present).

No ship data, no images, no services — this story is purely presentational.

### Why `ComingSoonComponent` as a Shared Component

Both `AboutComponent` and `NotFoundComponent` use the same full-page dark-surface layout. Extracting it to `src/app/shared/components/coming-soon/` prevents duplicating the SCSS and gives future placeholder pages (e.g., future content sections) the same consistent treatment. AD-10 permits this: `features/*` may import from `shared/components/*`.

### Design Spec (UX-DR13 + UX-DR14)

| Token | Value |
|---|---|
| Page background | `var(--color-bg)` |
| Heading font | `var(--font-display)` (Roboto Slab) |
| Heading color | `var(--color-khaki)` |
| Heading size | `var(--font-hl-lg-size)` (`1.625rem`), weight `var(--font-hl-lg-weight)` (`600`) |
| Body font | `var(--font-narrative)` (Lora) |
| Body color | `var(--color-on-surface)` |
| Body size | `var(--font-body-md-size)` (`1rem`) |
| Back-link color | `var(--color-olive)` |
| Back-link hover | `var(--color-khaki)` |

### Exact Microcopy (EXPERIENCE.md Voice & Tone)

| Location | Text |
|---|---|
| About page body | `"The story of Howard Hertzog — coming soon."` |
| Not-found heading | `"Page not found."` |
| Not-found back link | `"← Back to fleet"` (← is the Unicode character `←`, not an HTML entity) |

Do NOT use: "🚧 Coming soon!", "Under construction", "Oops!", "404". Tone is quiet and intentional.

### Complete ComingSoonComponent TypeScript

```typescript
// src/app/shared/components/coming-soon/coming-soon.component.ts
import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-coming-soon',
  standalone: true,
  imports: [],
  templateUrl: './coming-soon.component.html',
  styleUrl: './coming-soon.component.scss',
})
export class ComingSoonComponent {
  @Input() heading!: string;
  @Input() body!: string;
}
```

### Complete ComingSoonComponent Template

```html
<!-- coming-soon.component.html -->
<div class="coming-soon">
  <ng-content select="[slot=heading]">
    <h1 class="coming-soon__heading">{{ heading }}</h1>
  </ng-content>
  <p class="coming-soon__body">{{ body }}</p>
  <ng-content select="[slot=actions]"></ng-content>
</div>
```

**Note:** `ng-content` with named slots allows `NotFoundComponent` to project a custom `<h2>` heading and a "Back to fleet" link action without `ComingSoonComponent` needing special logic for the heading level distinction. If `ng-content` proves awkward in Angular 22, use separate `@Input() headingLevel: 'h1' | 'h2' = 'h1'` and `@if` blocks instead — the simpler approach wins.

### Alternative: Simpler Flat Approach (if ng-content is overkill)

If named slots feel over-engineered for two pages, each component can have its own template and SCSS while sharing only the SCSS utility class names — no `ComingSoonComponent` required. The SCSS would live in a shared partial. Only use this if the `ng-content` approach causes unexpected complexity.

### Complete ComingSoonComponent SCSS

```scss
// coming-soon.component.scss
:host {
  display: block;
  min-height: calc(100vh - 56px); // full page minus PersistentNav height
  background-color: var(--color-bg);
}

.coming-soon {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: inherit;
  padding: 3rem 1.5rem;
  text-align: center;
}

.coming-soon__heading {
  font-family: var(--font-display);
  font-size: var(--font-hl-lg-size);
  font-weight: var(--font-hl-lg-weight);
  line-height: var(--font-hl-lg-lh);
  color: var(--color-khaki);
  margin: 0 0 1.5rem;
}

.coming-soon__body {
  font-family: var(--font-narrative);
  font-size: var(--font-body-md-size);
  font-weight: var(--font-body-md-weight);
  line-height: var(--font-body-md-lh);
  color: var(--color-on-surface);
  max-width: 480px;
  margin: 0;
}
```

### AboutComponent After Update

```typescript
// src/app/features/about/about.component.ts
import { Component } from '@angular/core';
import { ComingSoonComponent } from '../../shared/components/coming-soon/coming-soon.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [ComingSoonComponent],
  template: `
    <app-coming-soon
      heading="About Howard"
      body="The story of Howard Hertzog — coming soon." />
  `,
})
export class AboutComponent {}
```

### NotFoundComponent After Update

```typescript
// src/app/features/not-found/not-found.component.ts
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ComingSoonComponent } from '../../shared/components/coming-soon/coming-soon.component';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [ComingSoonComponent, RouterLink],
  template: `
    <app-coming-soon body="">
      <h2 slot="heading" class="not-found__heading">Page not found.</h2>
      <a slot="actions" [routerLink]="['/']" class="not-found__back">← Back to fleet</a>
    </app-coming-soon>
  `,
  styles: [`
    .not-found__heading {
      font-family: var(--font-display);
      font-size: var(--font-hl-lg-size);
      font-weight: var(--font-hl-lg-weight);
      line-height: var(--font-hl-lg-lh);
      color: var(--color-khaki);
      margin: 0 0 1.5rem;
    }
    .not-found__back {
      display: inline-flex;
      align-items: center;
      min-height: 44px;
      min-width: 44px;
      margin-top: 2rem;
      padding: 0 0.75rem;
      font-family: var(--font-display);
      font-size: var(--font-hl-sm-size);
      font-weight: var(--font-hl-sm-weight);
      color: var(--color-olive);
      text-decoration: none;
      letter-spacing: var(--font-hl-sm-ls);
      transition: color 150ms ease;
    }
    .not-found__back:hover { color: var(--color-khaki); }
    .not-found__back:focus-visible {
      outline: 2px solid var(--color-olive);
      outline-offset: 3px;
    }
    @media (prefers-reduced-motion: reduce) {
      .not-found__back { transition: none; }
    }
  `],
})
export class NotFoundComponent {}
```

**Note:** If the `ng-content` named-slot approach proves problematic in Angular 22, use the simpler flat pattern instead: `NotFoundComponent` has its own full template (no `ComingSoonComponent` import), repeating only the SCSS layout. Prefer working code over elegant abstraction.

### Project Structure After This Story

```
src/app/
  shared/
    components/
      coming-soon/              ← NEW
        coming-soon.component.ts
        coming-soon.component.html
        coming-soon.component.scss
  features/
    about/
      about.component.ts        ← UPDATED (stub replaced)
    not-found/
      not-found.component.ts    ← UPDATED (stub replaced)
```

### What This Story Does NOT Fix

`HomeComponent` remains a stub. The homepage (FleetGrid + HomepageHero) is Epic 5's responsibility — that epic must be done for the "Fleet" nav link to show meaningful content.

### References

- [Source: docs/planning-artifacts/epics.md — Epic 6 Stories 6.1, 6.2; FR-14, FR-15; UX-DR13, UX-DR14, UX-DR17]
- [Source: docs/planning-artifacts/ux-designs/ux-epic-ww2-2026-07-29/DESIGN.md — type scale tokens, color tokens]
- [Source: docs/planning-artifacts/ux-designs/ux-epic-ww2-2026-07-29/EXPERIENCE.md — Voice & Tone microcopy, accessibility floor]
- [Source: docs/planning-artifacts/architecture/architecture-epic-ww2-2026-07-29/ARCHITECTURE-SPINE.md — AD-1 (standalone), AD-4 (token-only colors), AD-10 (import direction)]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6

### Debug Log References

### Completion Notes List

### File List
