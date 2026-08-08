# Story 3.1: Implement PersistentNav Component

Status: ready-for-dev

## Story

As a site visitor,
I want a sticky top navigation bar showing the site title and Fleet/About Howard links at all breakpoints,
so that I can navigate to the fleet index or the about page from anywhere on the site without losing context.

## Acceptance Criteria

1. `PersistentNavComponent` is a standalone component at `src/app/core/components/persistent-nav/persistent-nav.component.ts` that renders a `<nav>` inside a `<header>`-compatible element with site title on the left and "Fleet" + "About Howard" links on the right
2. The nav is sticky: `position: sticky; top: 0; z-index: var(--z-nav)` — it stays visible on scroll at all breakpoints
3. The "Fleet" link navigates to `/#/` via Angular `[routerLink]="['/']"` and is marked active with `routerLinkActive` when on the homepage
4. The "About Howard" link navigates to `/#/about` via Angular `[routerLink]="['/about']"` and is marked active with `routerLinkActive` when on the about page
5. The active link renders in `var(--color-olive)` (primary accent); inactive links render in `var(--color-steel)` (on-surface-secondary)
6. On a 320px wide mobile viewport, no hamburger menu appears — the site title is left-aligned and both nav links fit on the right without overflow or horizontal scroll
7. All interactive elements (site title link, Fleet, About Howard) have a minimum 44×44px tap area
8. Keyboard Tab navigation reaches all three interactive elements; each shows a visible focus ring (`outline: 2px solid var(--color-olive); outline-offset: 3px`) — never `outline: none` without a custom replacement
9. No raw hex color values appear in the component SCSS — only `var(--color-*)` and `var(--font-*)` references
10. The component height is `56px` as specified in DESIGN.md
11. When the user is on a ship page (`/#/ships/:slug`), neither "Fleet" nor "About Howard" is marked active — `[routerLinkActiveOptions]="{ exact: true }"` on Fleet ensures it does not activate on non-root routes, and the About Howard route (`/about`) does not match ship routes

## Tasks / Subtasks

- [ ] Generate the component (AC: 1)
  - [ ] `ng generate component core/components/persistent-nav --standalone --flat` from `src/app/`
  - [ ] Or create manually: `src/app/core/components/persistent-nav/persistent-nav.component.ts` + `.scss`
- [ ] Build the component template (AC: 1, 3, 4)
  - [ ] Import `RouterLink` and `RouterLinkActive` from `@angular/router` in the component's `imports` array
  - [ ] Template structure: site title (as a `routerLink` to `'/'`) on the left; Fleet + About Howard links on the right
  - [ ] Use `routerLinkActive="nav__link--active"` on each link element
  - [ ] Use `[routerLinkActiveOptions]="{ exact: true }"` on the Fleet link (to avoid matching all routes that start with `/`)
- [ ] Implement sticky positioning and layout (AC: 2, 6, 10)
  - [ ] `position: sticky; top: 0; z-index: var(--z-nav)` — add `--z-nav: 100` to `src/styles/_tokens.scss` (not present from Story 1.3; must be added now)
  - [ ] Flexbox layout: `display: flex; align-items: center; justify-content: space-between`
  - [ ] Fixed height `56px` (from DESIGN.md PersistentNav spec)
  - [ ] Mobile 320px: add `flex-shrink: 0` to `.nav__links` so links never compress before the title
  - [ ] Mobile 320px: add `overflow: hidden; text-overflow: ellipsis; max-width: 180px` to `.nav__title` below 480px so long title text truncates rather than pushing links off-screen
- [ ] Style active and rest states using tokens (AC: 5, 9, 11)
  - [ ] `.nav__link`: `color: var(--color-steel)` at rest
  - [ ] `.nav__link--active`: `color: var(--color-olive)`
  - [ ] Apply `letter-spacing: var(--font-nav-link-ls)` to `.nav__link` (DESIGN.md nav-link spec includes `0.06em` letter-spacing via `--font-nav-link-ls`)
  - [ ] `transition: color 150ms ease` on link color
  - [ ] Add `@media (prefers-reduced-motion: reduce) { transition: none; }` inside `.nav__link` — global styles.scss does not suppress component-level transitions
- [ ] Implement touch targets ≥44×44px (AC: 7)
  - [ ] All three interactive elements — site title link (`.nav__title`), Fleet link, and About Howard link — must have `min-height: 44px`
  - [ ] Fleet and About Howard links: `min-height: 44px; min-width: 44px; display: flex; align-items: center; padding: 0 0.75rem`
  - [ ] Site title link (`.nav__title`): `display: flex; align-items: center; min-height: 44px`
- [ ] Implement focus ring (AC: 8)
  - [ ] Global `:focus-visible` from Story 1.3 styles.scss applies site-wide, including here
  - [ ] Verify focus ring is visible on dark background — `var(--color-olive)` on `var(--color-surface)` passes WCAG AA
  - [ ] Do NOT add `outline: none` anywhere in this component's SCSS
- [ ] Verify at 320px viewport no hamburger and no horizontal scroll (AC: 6)
  - [ ] Open Chrome DevTools → device emulation → set viewport to 320px wide
  - [ ] Confirm no horizontal scrollbar is present at 320px (scrollWidth === clientWidth)
  - [ ] Confirm both "Fleet" and "About Howard" labels are fully visible (not clipped)
  - [ ] Confirm no hamburger icon or toggle button appears
- [ ] Write unit tests (AC: 1–11)
  - [ ] Component creates without error
  - [ ] `<nav aria-label="Site navigation">` renders
  - [ ] Site title link text is "Howard Hertzog — WWII Photography" and links to `/#/`
  - [ ] Fleet link text is "Fleet" and href is `/`
  - [ ] About Howard link text is "About Howard" and href is `/about`
  - [ ] Exactly 2 `.nav__link` elements exist
  - [ ] `.nav__links` has `role="list"`
  - [ ] Site title link has an `aria-label` containing "Home"
  - [ ] Fleet link has `routerLinkActiveOptions` set to `{ exact: true }`

## Dev Notes

### Dependency Chain

Story 3.1 **requires Story 1.1** (Angular scaffold), **Story 1.3** (design tokens in `_tokens.scss` must exist for `var(--color-*)` references), and the route structure from **Story 1.2** (for `routerLink` and `routerLinkActive` to work correctly). Note: `--z-nav` was not added in Story 1.3 and must be added to `_tokens.scss` as part of this story.

### DESIGN.md Component Spec

From DESIGN.md `components.PersistentNav`:
```yaml
PersistentNav:
  background: surface            # var(--color-surface) = #23231a
  border-bottom: '1px solid {colors.outline-variant}'   # var(--color-outline-v) = #3d3d2e
  height: '56px'
  position: sticky
  top: 0
  z-index: 100
  site-title-style: headline-sm  # Roboto Slab 1rem, weight 600, lh 1.4, ls 0.02em
  site-title-color: on-surface-variant   # var(--color-khaki) = #c9b87a
  link-style: nav-link           # Roboto Slab 0.875rem, weight 400
  link-color: on-surface-secondary       # var(--color-steel) = #8a9aaa (rest state)
  link-active-color: primary             # var(--color-olive) = #7a8c44 (active state)
```

### EXPERIENCE.md Behavioral Spec

From EXPERIENCE.md Component Patterns:
> "`PersistentNav` | Site title + Fleet + About Howard links; sticky top | Stays visible on scroll at all breakpoints. Active link (current route) gets `{colors.primary}` color. Mobile: site title left, Fleet + About right (no hamburger — two links fit)."

Navigation labels (exact microcopy from EXPERIENCE.md Voice & Tone):
- Fleet (links to `/#/`)
- About Howard (links to `/#/about`)

Do not change the label text to "Fleet Index", "About", "About the Photographer", etc. Exact labels are: **Fleet** and **About Howard**.

### Site Title Text

EXPERIENCE.md does not specify the exact site title text for the nav. Reasonable options:
- "Howard Hertzog — WWII Photography"
- "WW2 Epic"

Use **"Howard Hertzog — WWII Photography"** as it establishes the photographer's name prominently (FR-2 spirit). The site title in the nav is also a link to `/#/` per EXPERIENCE.md heading hierarchy (the `<h1>` is on the homepage, not in the nav — nav title is a styled link, not an `<h1>`).

### RouterLinkActive — Exact Match for Fleet

The Fleet link points to `path: ''` (the root route). Without `[routerLinkActiveOptions]="{ exact: true }"`, Angular `RouterLinkActive` will match this link as active for **every route** (because every route starts with `/`). 

```html
<a [routerLink]="['/']"
   routerLinkActive="nav__link--active"
   [routerLinkActiveOptions]="{ exact: true }"
   class="nav__link">
  Fleet
</a>
```

The About Howard link does **not** need `exact: true` since `'/about'` only matches one route.

### Complete Component Implementation

```typescript
// src/app/core/components/persistent-nav/persistent-nav.component.ts
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-persistent-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './persistent-nav.component.html',
  styleUrl: './persistent-nav.component.scss',
})
export class PersistentNavComponent {}
```

```html
<!-- persistent-nav.component.html -->
<nav class="nav" aria-label="Site navigation">
  <a [routerLink]="['/']"
     routerLinkActive="nav__title--active"
     [routerLinkActiveOptions]="{ exact: true }"
     class="nav__title"
     aria-label="Howard Hertzog WWII Photography — Home">
    Howard Hertzog — WWII Photography
  </a>

  <ul class="nav__links" role="list">
    <li>
      <a [routerLink]="['/']"
         routerLinkActive="nav__link--active"
         [routerLinkActiveOptions]="{ exact: true }"
         class="nav__link">
        Fleet
      </a>
    </li>
    <li>
      <a [routerLink]="['/about']"
         routerLinkActive="nav__link--active"
         class="nav__link">
        About Howard
      </a>
    </li>
  </ul>
</nav>
```

```scss
// persistent-nav.component.scss
:host {
  display: block;
  position: sticky;
  top: 0;
  z-index: var(--z-nav);
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-outline-v);
  height: 56px;
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 var(--space-gutter);
  max-width: var(--space-content-max);
  margin: 0 auto;

  @media (max-width: 767px) {
    padding: 0 var(--space-gutter-mobile);
  }
}

.nav__title {
  font-family: var(--font-display);
  font-size: var(--font-hl-sm-size);
  font-weight: var(--font-hl-sm-weight);
  line-height: var(--font-hl-sm-lh);
  letter-spacing: var(--font-hl-sm-ls);
  color: var(--color-khaki);
  text-decoration: none;
  white-space: nowrap;
  /* Touch target */
  display: flex;
  align-items: center;
  min-height: 44px;
}

.nav__links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  list-style: none;
  flex-shrink: 0;   /* prevent links from wrapping onto new line */
}

.nav__link {
  font-family: var(--font-display);
  font-size: var(--font-nav-link-size);
  font-weight: var(--font-nav-link-weight);
  letter-spacing: var(--font-nav-link-ls);
  color: var(--color-steel);
  text-decoration: none;
  /* Touch target */
  display: flex;
  align-items: center;
  min-height: 44px;
  min-width: 44px;
  padding: 0 0.75rem;
  transition: color 150ms ease;

  &:hover {
    color: var(--color-on-surface);
  }

  &.nav__link--active {
    color: var(--color-olive);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
}
```

### Mobile 320px Verification

At 320px viewport the nav must fit on one line. Verify that:
1. Site title does not overflow — use `overflow: hidden; text-overflow: ellipsis` on `.nav__title` as a fallback, or shorten the title text if necessary
2. The two nav links ("Fleet" and "About Howard") fit without wrapping — "About Howard" is 11 characters at 0.875rem; with 24px padding it fits comfortably at 320px
3. `flex-shrink: 0` on `.nav__links` prevents the links from shrinking before the title

If the title "Howard Hertzog — WWII Photography" is too long at 320px, truncate it with `overflow: hidden; text-overflow: ellipsis; max-width: 180px` on `.nav__title`. The important thing is that the nav links are always fully visible.

### AD-4 Compliance

Do not hardcode any colors. Every color reference in `persistent-nav.component.scss` must use `var(--color-*)`. Verify after writing:
```bash
grep '#[0-9a-fA-F]' src/app/core/components/persistent-nav/persistent-nav.component.scss
```
Should return no results.

### z-index Token

Add `--z-nav: 100` to `src/styles/_tokens.scss` if not already present (from Story 1.3). Then reference it as `z-index: var(--z-nav)` in the component. If the token was not added in Story 1.3, add it now.

### Accessibility Notes

- The `<nav>` element with `aria-label="Site navigation"` creates a named navigation landmark, distinct from `<nav>` elements on ship pages (ShipNav). Screen readers can jump directly to this landmark.
- The site title link has `aria-label` that clarifies its destination for screen readers (it is a link to home, not just decorative text).
- The `<ul role="list">` pattern (with `list-style: none`) requires `role="list"` for Safari VoiceOver to announce it as a list.

### Project Structure Notes

- Component directory: `src/app/core/components/persistent-nav/`
- Files: `persistent-nav.component.ts`, `persistent-nav.component.html`, `persistent-nav.component.scss`
- Used by: `AppComponent` (Story 3.1) — imported directly, not via a barrel

### References

- [Source: docs/planning-artifacts/ux-designs/ux-epic-ww2-2026-07-29/DESIGN.md — components.PersistentNav spec]
- [Source: docs/planning-artifacts/ux-designs/ux-epic-ww2-2026-07-29/EXPERIENCE.md — Component Patterns (PersistentNav), Voice & Tone (nav labels), Accessibility Floor, Responsive & Platform table]
- [Source: docs/planning-artifacts/prds/prd-epic-ww2-2026-07-29/prd.md — FR-12, FR-13, FR-14]
- [Source: docs/planning-artifacts/architecture/architecture-epic-ww2-2026-07-29/ARCHITECTURE-SPINE.md — AD-2 (routerLink not bare href), AD-4 (no hex values)]
- [Source: docs/planning-artifacts/epics.md — Epic 3, Story 3.1]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6

### Debug Log References

### Completion Notes List

### File List
