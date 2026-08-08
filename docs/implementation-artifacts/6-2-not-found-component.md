# Story 6.2: Implement NotFoundComponent

Status: done

## Story

As a site visitor who navigates to an unknown route,
I want a clear not-found page that brings me back to the fleet,
so that I am never stranded with a browser 404 error or a blank page.

## Acceptance Criteria

1. Navigating to any unknown route (e.g., `/#/foo`) redirects to `/#/not-found` via the Angular router wildcard (`'**'` → `redirectTo: 'not-found'`, already configured in `app.routes.ts`) and `NotFoundComponent` renders
2. `NotFoundComponent` uses a full-page dark surface (`var(--color-bg)` background), centered content, matching the ComingSoon visual treatment
3. Heading reads `"Page not found."` — rendered as `<h2>` (not `<h1>`); color `var(--color-khaki)`; font `var(--font-display)` (Roboto Slab); `var(--font-hl-lg-size)` / `var(--font-hl-lg-weight)`
4. A `"← Back to fleet"` link navigates to `/#/` via Angular `[routerLink]="['/']"` — never a bare `<a href>`; color `var(--color-olive)`, hover `var(--color-khaki)`; meets the 44×44px minimum tap target
5. `PersistentNav` is intact on the not-found page; neither "Fleet" nor "About Howard" is marked active (no route match)
6. No raw hex values appear in any SCSS for this component — only `var(--color-*)` and `var(--font-*)` references
7. Focus ring on the back-link: `outline: 2px solid var(--color-olive); outline-offset: 3px` (UX-DR15)
8. Back-link hover `color` transition is disabled under `@media (prefers-reduced-motion: reduce)` (UX-DR16)
9. The server never serves a 404 HTTP status on Bluehost — all routing is handled client-side from `index.html` via `HashLocationStrategy` (already configured in Story 1.2; no action needed here)

## Tasks / Subtasks

- [ ] Check if `ComingSoonComponent` exists at `src/app/shared/components/coming-soon/` (created by Story 6.1)
  - [ ] **If it exists:** import and use it (see "Using ComingSoonComponent" in Dev Notes)
  - [ ] **If it does NOT exist:** implement `NotFoundComponent` with its own flat template and inline SCSS (see "Flat Fallback Pattern" in Dev Notes)
- [ ] Update `NotFoundComponent` at `src/app/features/not-found/not-found.component.ts`
  - [ ] Replace the inline stub template `<p>NotFoundComponent</p>` with the full implementation
  - [ ] Import `RouterLink` (required for `[routerLink]`)
  - [ ] Import `ComingSoonComponent` if using it (conditional on path above)
  - [ ] Apply heading `<h2>` — not `<h1>` (AC: 3)
  - [ ] Apply `"← Back to fleet"` routerLink with tap target styles (AC: 4)
  - [ ] Apply `min-height: 44px; min-width: 44px; display: inline-flex; align-items: center` to the back-link (AC: 4)
  - [ ] Apply focus-visible ring (AC: 7)
  - [ ] Apply reduced-motion guard on transition (AC: 8)
- [ ] Verify no raw hex values in SCSS (AC: 6)
- [ ] Smoke test at runtime (AC: 1, 5)
  - [ ] `ng serve` → navigate to `/#/foo`: redirected to `/#/not-found`; heading "Page not found." and "← Back to fleet" link are visible
  - [ ] Verify neither "Fleet" nor "About Howard" is active in PersistentNav

## Dev Notes

### Current State

`src/app/features/not-found/not-found.component.ts` is a stub with `template: '<p>NotFoundComponent</p>'`. No `ComingSoonComponent` exists in `src/app/shared/components/` yet. The router is already fully wired (`'**'` → `redirectTo: 'not-found'`) from Story 1.2.

### Dependency Chain

- **Requires Story 1.1** — `not-found.component.ts` stub file exists to update
- **Requires Story 1.2** — router wildcard redirect to `'not-found'` is already in place; tab title `'Not Found — Howard Hertzog WWII Photography'` is set by `RouterTitleStrategy`; no router changes needed here
- **Requires Story 1.3** — design token CSS custom properties are live
- **Requires Story 3.1** — `PersistentNav` is mounted in `AppComponent`; renders on all routes automatically
- **Soft dependency on Story 6.1** — if Story 6.1 ran first and created `ComingSoonComponent`, use it; otherwise use the flat fallback pattern below

### Why `<h2>` and Not `<h1>` for the Not-Found Heading

UX-DR14 specifies `<h2>` for the not-found heading. `PersistentNav` contains the implied site-level `<h1>` hierarchy; the page heading is subordinate. This is consistent with semantic HTML requirements (UX-DR16) and is not an error to be corrected.

### Design Spec (UX-DR13 + UX-DR14)

| Element | Token |
|---|---|
| Page background | `var(--color-bg)` |
| Heading font | `var(--font-display)` (Roboto Slab) |
| Heading color | `var(--color-khaki)` |
| Heading size | `var(--font-hl-lg-size)` (`1.625rem`) |
| Heading weight | `var(--font-hl-lg-weight)` (`600`) |
| Heading line-height | `var(--font-hl-lg-lh)` (`1.2`) |
| Back-link color | `var(--color-olive)` |
| Back-link hover | `var(--color-khaki)` |
| Body font (if ComingSoon wraps body copy) | `var(--font-narrative)` (Lora) |
| Body color | `var(--color-on-surface)` |
| Body size | `var(--font-body-md-size)` (`1rem`) |

### Exact Microcopy (EXPERIENCE.md Voice & Tone)

| Location | Text |
|---|---|
| Not-found heading | `"Page not found."` |
| Not-found back link | `"← Back to fleet"` (← is the Unicode left arrow `\u2190`, not an HTML entity) |

Do NOT use: "Oops!", "404 Error", "🚧", "Page not found!" (no exclamation). Tone is quiet and intentional.

### Path 1 — Using ComingSoonComponent (if Story 6.1 created it)

If `src/app/shared/components/coming-soon/coming-soon.component.ts` exists, use it via named slot projection for the `<h2>` heading and back-link:

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

**Note on ng-content named slots:** If `ComingSoonComponent` uses `<ng-content select="[slot=heading]">` and `<ng-content select="[slot=actions]">`, the projection above works. If the ComingSoonComponent created by Story 6.1 uses a different API (e.g., `@Input() heading` + `@Input() body`), use Path 2 (flat fallback) instead — do not fight the existing component's API.

### Path 2 — Flat Fallback (if ComingSoonComponent does not exist or is incompatible)

If no `ComingSoonComponent` exists, or if its API doesn't support named slot projection cleanly, implement `NotFoundComponent` self-contained with its own template + inline styles. This is architecturally acceptable per AD-10 (features may have their own layouts):

```typescript
// src/app/features/not-found/not-found.component.ts
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="not-found">
      <h2 class="not-found__heading">Page not found.</h2>
      <a [routerLink]="['/']" class="not-found__back">← Back to fleet</a>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: calc(100vh - 56px);
      background-color: var(--color-bg);
    }
    .not-found {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: inherit;
      padding: 3rem 1.5rem;
      text-align: center;
    }
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

### Architecture Compliance Checklist

| Constraint | Requirement | Check |
|---|---|---|
| AD-1 | `standalone: true` — no NgModules | Must have `standalone: true` |
| AD-2 | No bare `<a href>` to routes | Back-link must use `[routerLink]` |
| AD-4 | Token-only SCSS | No raw hex values — only `var(--color-*)` and `var(--font-*)` |
| AD-10 | Features may import from shared/core; shared never imports from features | `NotFoundComponent` importing `ComingSoonComponent` is valid |
| UX-DR14 | Heading is `<h2>`, not `<h1>` | Enforce heading level |
| UX-DR15 | Focus ring: 2px solid primary, offset 3px | Apply `focus-visible` rule |
| UX-DR16 | Reduced motion disables transitions | `@media (prefers-reduced-motion: reduce)` guard |
| UX-DR17 | Back link text: `← Back to fleet` (Unicode ←) | Exact microcopy |

### What This Story Does NOT Do

- Does NOT change `app.routes.ts` — routing is already wired from Story 1.2
- Does NOT implement `ComingSoonComponent` — that is Story 6.1's responsibility
- Does NOT implement `AboutComponent` — that is Story 6.1's responsibility
- Does NOT affect `HomeComponent` — that is Epic 5's responsibility

### References

- [Source: docs/planning-artifacts/epics.md — Epic 6, Story 6.2; FR-15; UX-DR14, UX-DR17]
- [Source: docs/planning-artifacts/epics.md — Requirements: AD-1, AD-2, AD-4, AD-10; UX-DR15, UX-DR16]
- [Source: docs/planning-artifacts/ux-designs/ux-epic-ww2-2026-07-29/EXPERIENCE.md — Voice & Tone microcopy, accessibility floor]
- [Source: src/styles/_tokens.scss — all CSS custom property names and values]
- [Source: src/app/app.routes.ts — wildcard redirect to `not-found` already wired]
- [Source: docs/implementation-artifacts/6-1-supporting-placeholder-pages.md — ComingSoonComponent design, ng-content slot API]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6

### Debug Log References

### Completion Notes List

### File List
