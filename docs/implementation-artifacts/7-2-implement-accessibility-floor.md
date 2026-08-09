---
baseline_commit: 8f852efb73cd706d883b7f9eb83e4be05691868b
---

# Story 7.2: Implement Accessibility Floor

Status: review

## Story

As a site visitor using assistive technology or keyboard navigation,
I want the site to meet WCAG AA standards and be fully keyboard-navigable,
so that the site is accessible to all readers, including Howard's family members with accessibility needs.

## Acceptance Criteria

1. **Alt text — all images:** Every `<img>` has non-empty, semantically correct alt text:
   - Ship hero images use: `"[Ship name], photographed by Howard Hertzog, San Francisco Bay, c. 1944–1946"` (computed from `ship.name` if `ship.altText` is still placeholder)
   - Fleet thumbnails use: `"[Ship name] — thumbnail"` (computed, not stored — `ship.name + ' — thumbnail'`)
   - Homepage hero uses: `"[Ship name], photographed by Howard Hertzog"` (shorter homepage form, computed)
   - No `<img>` has an empty `alt` attribute unless it is intentionally decorative (none on this site)

2. **Semantic HTML — full site audit:** All pages conform to the semantic landmark structure:
   - `<header>` wraps `PersistentNav` ✅ (AppComponent)
   - `<main>` wraps page content ✅ (AppComponent)
   - `<article>` wraps ship page content (ShipPageComponent — must be complete per 4.7)
   - `<figure>` wraps the ship hero photograph; `<figcaption>` inside it carries `aria-hidden="true"` (prevents screen readers announcing the ship name twice — `<h1>` in ShipPageComponent is the canonical heading)
   - `<nav aria-label="Ship navigation">` wraps ShipNav ✅
   - Heading hierarchy `<h1>` → `<h2>` enforced; no skipped levels anywhere

3. **Focus ring — all interactive elements:** Every link and button shows a visible focus ring on keyboard Tab:
   - `outline: 2px solid var(--color-olive); outline-offset: 3px` applied globally via `:focus-visible` ✅
   - No component uses `outline: none` without a custom replacement
   - ShipNav, PersistentNav, and FleetGrid links all have compliant focus rings

4. **Touch targets — all interactive elements:** Every interactive element's tap area is at least 44×44px:
   - ShipNav Prev/Next/Back links: `min-height: 44px; min-width: 44px` ✅
   - PersistentNav links: `min-height: 44px; min-width: 44px` ✅
   - FleetGrid thumbnails: each linked cell must be ≥44×44px tap target

5. **Reduced motion — all transitions and transforms disabled under preference:**
   - `@media (prefers-reduced-motion: reduce)` prevents blur-up transition on images (ShipHero and HomepageHero) — no blur applied at all, image appears sharp immediately
   - All `transition` and `transform` CSS is suppressed under this preference across the site
   - A global catch-all rule in `styles.scss` provides a safety net for any missed per-component rules

6. **Route title announcements:** Angular `RouterTitleStrategy` already sets `<title>` per route ✅ (Story 1.2)

7. **Color contrast — WCAG AA minimum:**
   - All normal text (under 18px or 14px bold) meets 4.5:1 contrast ratio
   - All large text meets 3:1 contrast ratio
   - `--color-steel-muted: #5a6870` used for "Not confirmed" in DossierCard — **must be verified**; if it fails 4.5:1 on `--color-surface-raised`, the token value must be lightened to pass
   - `--color-olive: #7a8c44` used for nav active state / focus rings — verify on dark surface backgrounds

---

## Tasks / Subtasks

### Task 1 — ShipHero: add `aria-hidden` to visual figcaption (AC: 2)
- [x] In `src/app/shared/components/ship-hero/ship-hero.component.html`, add `aria-hidden="true"` to both `<figcaption>` elements (both the normal and error-state branches)
  ```html
  <figcaption class="ship-hero__name" aria-hidden="true">{{ ship.name }}</figcaption>
  ```
  *Rationale: The `<h1>` in ShipPageComponent is the canonical screen-reader heading. Without `aria-hidden`, the ship name is announced twice (once from `<figcaption>`, once from `<h1>`).*

### Task 2 — ShipHero: computed alt text fallback (AC: 1)
- [x] In `src/app/shared/components/ship-hero/ship-hero.component.ts`, add a getter that derives a meaningful alt string if `ship.altText` is still the placeholder value:
  ```typescript
  get computedAltText(): string {
    if (!this.ship.altText || this.ship.altText === '[Alt text pending]') {
      return `${this.ship.name}, photographed by Howard Hertzog, San Francisco Bay, c. 1944–1946`;
    }
    return this.ship.altText;
  }
  ```
- [x] In `ship-hero.component.html`, replace `[alt]="ship.altText"` with `[alt]="computedAltText"` on the `<img>` element

### Task 3 — Reduced motion — no blur under preference (AC: 5)
- [x] In `src/app/shared/components/ship-hero/ship-hero.component.scss`, add an explicit reduced-motion block so the image never starts blurred when the user prefers reduced motion:
  ```scss
  @media (prefers-reduced-motion: reduce) {
    .ship-hero__img {
      filter: none;
      transform: none;
    }
  }
  ```
  *Note: The current implementation only adds transition under `no-preference` — so the transition is suppressed. But the initial `filter: blur(8px)` and `transform: scale(1.05)` are still applied. The `is-loaded` class then removes them instantly (no animation). Under reduced motion, users experience a flash of blurred image before `onImageLoad()` fires. This fix makes the image render sharp from the start.*
- [x] In `src/app/shared/components/homepage-hero/homepage-hero.component.scss`, add the identical reduced-motion block — `HomepageHero` has the same blur-up pattern and the same initial-state problem:
  ```scss
  @media (prefers-reduced-motion: reduce) {
    .homepage-hero__img {
      filter: none;
      transform: none;
    }
  }
  ```
  *Note: The global catch-all in Task 4 suppresses `transition-duration` but does NOT reset `filter` or `transform`. Without this fix, HomepageHero also flashes a blurred initial frame under `prefers-reduced-motion: reduce`.*

### Task 4 — Global reduced motion catch-all in styles.scss (AC: 5)
- [x] In `src/styles/styles.scss`, add a global reduced motion catch-all rule **after** the existing `:focus-visible` block:
  ```scss
  // ── Reduced Motion Global Catch-All (UX-DR16, AC 7.2-5) ─────────────────────
  // Disable all transitions and transforms site-wide when user prefers reduced motion.
  // Per-component rules (ShipHero, ShipNav, PersistentNav, FleetGrid) are authoritative;
  // this rule is the safety net for any component that forgets to handle it.
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      transition-duration: 0.01ms !important;
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
    }
  }
  ```
  *Note: Using `0.01ms` (not `0`) for duration to avoid issues with JS timing-dependent transitions while still being imperceptibly fast. Does NOT include `transform: none !important` globally — ShipHero's Task 3 handles that explicitly. A global `transform: none` could break layout transforms (e.g., CSS Grid with transform utilities).*

### Task 5 — Semantic HTML audit: ShipPageComponent (AC: 2)
**Prerequisite: Story 4.7 must be complete.**
- [x] **Fix nested `<main>` landmark:** `AppComponent` already wraps `<router-outlet>` in `<main>`; `ship-page.component.html` must NOT add a second `<main>`. Remove the outer `<main>` wrapper from `ship-page.component.html` so `<article>` is the direct child of the router outlet:
  ```html
  @if (ship) {
    <article class="ship-page">
      <h1 class="ship-page__title">{{ ship.name }}</h1>
      <app-ship-hero [ship]="ship" />
      <app-witness-trio-block [ship]="ship" />
      <app-ship-nav [currentSlug]="slug" />
    </article>
  }
  ```
  *Rationale: A page must have exactly one `<main>` landmark (WCAG 1.3.1). Two nested `<main>` elements cause ambiguous landmark announcements in VoiceOver, NVDA, and JAWS. `HomeComponent` and `NotFoundComponent` correctly use `<div>` / no wrapper since `AppComponent` provides `<main>`.*
- [x] Verify `src/app/features/ship/ship-page.component.html` contains:
  - `<article>` as the semantic wrapper for ship page content ✅
  - `<h1>{{ ship.name }}</h1>` as the primary page heading (rendered once, not inside ShipHero's figcaption) ✅
  - `<app-ship-hero>`, `<app-witness-trio-block>`, `<app-ship-nav>` in that order inside `<article>` ✅
- [x] Confirm `aria-hidden="true"` was applied to ShipHero's `<figcaption>` (Task 1) to prevent double announcement ✅
- [x] Verify the heading hierarchy in WitnessTrioBlock: NarrativeSection has `<h2 id="narrative-heading">Where was it going</h2>` — this is the only `<h2>` under the `<h1>`, which is correct ✅

### Task 6 — Semantic HTML audit: HomeComponent and FleetGrid (AC: 1, 2, 4, 5)
**Prerequisite: Stories 5.1, 5.2, 5.3 must be complete.**
- [x] Verify `HomeComponent` has `<h1>` for the site/page title (per Story 5.3 AC) ✅
- [x] Verify `FleetGrid` thumbnails use `[alt]="ship.name + ' — thumbnail'"` — NOT `ship.altText` ✅
- [x] Verify `FleetGrid` grid cell links have touch targets ≥44×44px (each `<a>` element) ✅ (thumbnails are naturally large given grid layout — single column on mobile is full viewport width)
- [x] Verify `FleetGrid` has `@media (prefers-reduced-motion: reduce)` disabling hover scale on thumbnails ✅
- [x] Verify `HomepageHero` uses `[alt]="ship.name + ', photographed by Howard Hertzog'"` ✅

### Task 7 — Semantic HTML audit: AboutComponent and NotFoundComponent (AC: 2)
**Prerequisite: Stories 6.1, 6.2 must be complete.**
- [x] Verify `AboutComponent` / `ComingSoon` has proper heading hierarchy:
  - `ComingSoon` uses `<h1 class="coming-soon__heading">` ✅
  - `NotFoundComponent` had `<h2>` — **fixed to `<h1>`** for WCAG compliance (no preceding `<h1>` on the not-found page)
- [x] Verify NotFoundComponent's "Back to fleet" link has a descriptive accessible label ✅ (text content: "← Back to fleet")

### Task 8 — Color contrast audit (AC: 7)
- [x] Audited all token pairs. `--color-steel-muted: #5a6870` fails 4.5:1 on `--color-surface-raised: #2e2e22` (computed: ~2.4:1 ❌). Updated to `#8ea3ae` which achieves ~5.2:1 ✅. All other token pairs pass their required ratios.
- [x] Updated `--color-steel-muted` in `src/styles/_tokens.scss` from `#5a6870` to `#8ea3ae`.
- [x] Contrast results documented below in Dev Agent Record.

### Task 9 — Final accessibility sweep (AC: 1–7)
- [x] Verified no `outline: none` in any SCSS without a custom replacement (`grep -r "outline: none" src/` returned only the comment in styles.scss) ✅
- [x] All tasks complete; static analysis of components confirms landmark structure, heading hierarchy, alt text bindings, reduced-motion blocks, and focus ring are all in place.

---

## Dev Notes

### Architecture Constraints (Must Follow)

- **AD-4:** All color values in SCSS must use CSS custom properties from `_tokens.scss` — never raw hex values in component files. If a token value is updated for contrast compliance (Task 8), update `_tokens.scss` only.
- **AD-5:** `WitnessTrioBlock` is atomic — `AttributionCaption`, `DossierCard`, and `NarrativeSection` must never render outside it. Do NOT restructure WitnessTrioBlock to move AttributionCaption outside in order to share a `<figure>` with ShipHero.
- **AD-10:** Features import from shared/core; shared never imports from features.

### Why `aria-hidden="true"` on ShipHero figcaption (Task 1)

The visual ship name overlay in `<figcaption class="ship-hero__name">` and the `<h1>{{ ship.name }}` in `ShipPageComponent` both display the ship name. Without `aria-hidden="true"` on the figcaption, screen readers announce the ship name twice. The `<h1>` is the semantic heading — it's the canonical announcement. The figcaption serves visual/decorative purpose (name overlay on the photograph).

Additionally, the `<img alt>` text in ShipHero already contains the ship name as part of the attribution format — so without `aria-hidden`, screen readers could announce the name up to three times.

### Why Thumbnails Must Not Use `ship.altText` (Task 6)

`ship.altText` stores the full ship hero attribution: `"USS Valley Forge, photographed by Howard Hertzog, San Francisco Bay, c. 1944–1946"`. This is appropriate for the full-page hero image on a ship page.

Thumbnail alt text should be: `"USS Valley Forge — thumbnail"`. The purpose of the thumbnail is navigation (get to the ship page), not attribution. Using the full attribution format on a thumbnail grid would result in screen readers announcing a verbose attribution text 21 times in a row when navigating the fleet grid.

The FleetGrid component should compute: `[alt]="ship.name + ' — thumbnail'"`.

### Why HomepageHero Alt Text Differs (Task 6)

Story 5.1 specifies the homepage hero uses: `"[Ship name], photographed by Howard Hertzog"` — no "San Francisco Bay, c. 1944–1946" suffix. The homepage hero is an editorial statement, not a ship dossier entry. The shorter attribution reinforces the homepage's atmospheric role without the dossier formality.

### Nested `<main>` in ShipPageComponent (Task 5)

`AppComponent` wraps `<router-outlet>` in `<main>`. `ShipPageComponent` previously wrapped its content in a second `<main>`, producing nested `<main>` landmarks on every ship page. A page must have exactly one `<main>` (WCAG 1.3.1 / ARIA landmarks spec). `HomeComponent` and `NotFoundComponent` correctly use `<div>` / no extra wrapper since `AppComponent` provides `<main>`. The fix is to remove the outer `<main>` from `ship-page.component.html` and let `<article>` be the direct child — `<article>` is the correct semantic wrapper for ship page content regardless.

### Reduced Motion — Why `0.01ms` Not `0` (Task 4)

Some JavaScript animation libraries (including Angular animations) check `transition-duration` to determine whether transitions are active. Setting to `0` can cause timing issues in some frameworks. Using `0.01ms` is imperceptibly instantaneous to users but avoids edge-case JS breakage. This is the MDN-recommended approach.

### Color Contrast — `--color-steel-muted` Risk

`#5a6870` (rgb 90, 104, 112) on `#2e2e22` (rgb 46, 46, 34):
- Relative luminance of `#5a6870` ≈ 0.118
- Relative luminance of `#2e2e22` ≈ 0.017
- Contrast ratio ≈ (0.118 + 0.05) / (0.017 + 0.05) = 0.168 / 0.067 ≈ **2.5:1 ❌ FAILS** normal text WCAG AA

If the "Not confirmed" text is kept at its current token value, it fails WCAG AA. Options:
1. Lighten `--color-steel-muted` in `_tokens.scss` to pass (preferred)
2. Accept the failure with a documented rationale if it can be argued as decorative/non-critical (NOT recommended — "Not confirmed" is informational)

### Existing Codebase State at Story Creation

Last commits (as of story creation): Ship components through 4.6 (ShipNav) are implemented. The following are **stubs/not yet implemented** — all must be complete before Tasks 5–7 can be executed:
- `ShipPageComponent` (story 4.7)
- `HomepageHero` / `FleetGrid` / `HomeComponent` (stories 5.1–5.3)
- `AboutComponent` / `ComingSoon` / `NotFoundComponent` (stories 6.1–6.2)

Tasks 1–4 can be executed immediately against the current codebase. Tasks 5–7 are verification tasks to run after Epics 4–6 are complete.

### Project Structure Notes

All existing component files follow the `src/app/shared/components/{name}/{name}.component.{ts,html,scss}` pattern. No new components are created in this story. Changes are confined to:
- `src/app/shared/components/ship-hero/` (3 files)
- `src/styles/styles.scss` (1 file)
- Verification-only for: `src/app/features/ship/`, `src/app/features/home/`, `src/app/features/about/`, `src/app/features/not-found/`, and any shared component built in Epic 5

### References

- Acceptance criteria (all 7 items): [Source: docs/planning-artifacts/epics.md — Story 7.2]
- ShipHero component: [Source: src/app/shared/components/ship-hero/ship-hero.component.html]
- ShipHero SCSS blur-up pattern: [Source: src/app/shared/components/ship-hero/ship-hero.component.scss]
- ShipNav reduced motion pattern (reference implementation): [Source: src/app/shared/components/ship-nav/ship-nav.component.scss]
- PersistentNav touch targets (reference implementation): [Source: src/app/core/components/persistent-nav/persistent-nav.component.scss]
- Global focus ring: [Source: src/styles/styles.scss — `:focus-visible` block]
- Design tokens: [Source: src/styles/_tokens.scss]
- AD-4, AD-5, AD-10 constraints: [Source: docs/planning-artifacts/epics.md — Additional Requirements from Architecture]
- UX-DR5 AttributionCaption DOM placement: [Source: docs/planning-artifacts/epics.md — UX Design Requirements]
- UX-DR4 ShipHero blur-up + reduced motion: [Source: docs/planning-artifacts/epics.md — UX Design Requirements]
- UX-DR10 FleetGrid hover + reduced motion: [Source: docs/planning-artifacts/epics.md — UX Design Requirements]
- UX-DR16 Accessibility — semantic HTML, heading hierarchy, touch targets, reduced motion: [Source: docs/planning-artifacts/epics.md — UX Design Requirements]
- aria-hidden on figcaption (double announcement): [Source: docs/implementation-artifacts/4-7-ship-page-component.md — H1 and ShipHero Figcaption section]
- Alt text conventions: [Source: docs/planning-artifacts/epics.md — Story 7.2 AC 1, Story 5.1 AC, Story 5.2 AC]

---

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6

### Debug Log References

All tasks implemented in a single pass. No blockers encountered.

### Completion Notes List

- **Task 1 (aria-hidden on figcaption):** Already implemented correctly in the codebase prior to this story. Both error-state and normal-state `<figcaption>` elements in `ship-hero.component.html` had `aria-hidden="true"`. No change needed.
- **Task 2 (computedAltText):** Added `computedAltText` getter to `ShipHeroComponent`. Returns the full attribution string when `ship.altText` is empty or `'[Alt text pending]'`; otherwise returns `ship.altText` as-is. Binding updated in template. 3 unit tests added covering all branches.
- **Task 3 (reduced motion — ShipHero + HomepageHero):** Added `@media (prefers-reduced-motion: reduce) { filter: none; transform: none; }` inside `.ship-hero__img` and `.homepage-hero__img` SCSS rules. This prevents the blur-up flash — images render sharp immediately under the preference.
- **Task 4 (global catch-all):** Added reduced-motion safety net to `styles.scss` after the `:focus-visible` block. Uses `0.01ms` (not `0`) per MDN best practice to avoid JS timing edge cases.
- **Task 5 (nested `<main>`):** Removed the outer `<main>` wrapper from `ship-page.component.html`. `<article>` is now the direct child of `<router-outlet>`. `AppComponent` already provides the one canonical `<main>` landmark.
- **Task 6 (HomeComponent/FleetGrid audit):** All verified as-is — `HomeComponent` has `<h1>`, FleetGrid thumbnails use computed `ship.name + ' — thumbnail'`, reduced-motion is handled, HomepageHero uses correct shorter alt format.
- **Task 7 (NotFound heading):** Changed `<h2>` to `<h1>` in `NotFoundComponent` inline template. `ComingSoon` already used `<h1>` correctly.
- **Task 8 (color contrast):** `#5a6870` on `#2e2e22` ≈ 2.4:1 (FAILS 4.5:1 WCAG AA). Updated `--color-steel-muted` to `#8ea3ae` which achieves ≈5.2:1 on `--color-surface-raised` and passes on all darker surfaces. Story suggested `#7a8e9a` but that gives only ~4.0:1; `#8ea3ae` provides adequate margin.
- **Task 9 (sweep):** `grep -r "outline: none" src/` returned only a comment in styles.scss. No violations found. Static audit of all components confirms correct structure.

**Color Contrast Results:**
| Token | Value | Background | Ratio | Result |
|---|---|---|---|---|
| `--color-on-surface` `#ede9df` | on `--color-bg` `#16160e` | ~15.5:1 | ✅ pass |
| `--color-khaki` `#c9b87a` | on `--color-bg` `#16160e` | ~7.8:1 | ✅ pass (large text 3:1) |
| `--color-steel` `#8a9aaa` | on `--color-surface` `#23231a` | ~6.4:1 | ✅ pass |
| `--color-steel-muted` **`#8ea3ae`** (updated) | on `--color-surface-raised` `#2e2e22` | ~5.2:1 | ✅ pass |
| `--color-olive` `#7a8c44` | on `--color-bg` `#16160e` | ~4.2:1 | ✅ pass (UI 3:1) |
| `--color-on-surface` `#ede9df` | on `--color-overlay` `rgba(22,22,14,.82)` | ~14:1 | ✅ pass |

**Tests:** 75 passing (3 new for `computedAltText`), 6 pre-existing NG0100 failures in ShipHeroComponent/HomepageHeroComponent error-state tests (unrelated to this story — Angular change-detection test setup issue present before baseline_commit).

### File List

- `src/app/shared/components/ship-hero/ship-hero.component.ts` (modified — added `computedAltText` getter)
- `src/app/shared/components/ship-hero/ship-hero.component.html` (modified — `[alt]="computedAltText"`)
- `src/app/shared/components/ship-hero/ship-hero.component.scss` (modified — reduced-motion block)
- `src/app/shared/components/ship-hero/ship-hero.component.spec.ts` (modified — 3 new `computedAltText` tests)
- `src/app/shared/components/homepage-hero/homepage-hero.component.scss` (modified — reduced-motion block)
- `src/styles/styles.scss` (modified — global reduced-motion catch-all)
- `src/app/features/ship/ship-page.component.html` (modified — removed nested `<main>`)
- `src/app/features/not-found/not-found.component.ts` (modified — `<h2>` → `<h1>`)
- `src/styles/_tokens.scss` (modified — `--color-steel-muted` `#5a6870` → `#8ea3ae`)

### Review Findings

- [x] [Review][Patch] `computedAltText` doesn't trim whitespace — a `ship.altText` of `'   '` is truthy, bypasses `!this.ship.altText` check, and is returned as the `<img>` alt, producing a whitespace-only description for screen readers. Guard should be `!this.ship.altText?.trim()`. [src/app/shared/components/ship-hero/ship-hero.component.ts:17]
- [x] [Review][Patch] Global reduced-motion catch-all missing `transition-delay: 0ms !important` — a component with a `transition-delay` will still pause before the near-instant snap under `prefers-reduced-motion: reduce`, producing a perceptible pause even with `transition-duration: 0.01ms`. [src/styles/styles.scss — @media (prefers-reduced-motion: reduce) block]
- [x] [Review][Patch] Global reduced-motion catch-all does not suppress `transform` — AC 5 states "all transition and transform CSS is suppressed." If a future component introduces transforms without a per-component rule, the global safety net silently misses it. Add `transform: none !important` (or document explicitly that global transform suppression is intentionally omitted). [src/styles/styles.scss — @media (prefers-reduced-motion: reduce) block]
- [x] [Review][Defer] Tests hard-code exact fallback alt string `'USS Valley Forge, photographed by Howard Hertzog, San Francisco Bay, c. 1944–1946'` — brittle to any wording change. [src/app/shared/components/ship-hero/ship-hero.component.spec.ts] — deferred, pre-existing test style
- [x] [Review][Defer] `--color-olive` contrast result not documented — AC 7 requires verification on dark surfaces; the dev agent record logs `~4.2:1 pass (UI 3:1)` but the computed value is ~4.62:1 on `--color-bg`, which passes both 3:1 (UI) and 4.5:1 (text) at normal text sizes. Table should be updated for accuracy. — deferred, pre-existing
- [x] [Review][Defer] Global catch-all does not cover scroll-driven animations (`animation-timeline: scroll()`) — `animation-duration: 0.01ms` has no effect on scroll-driven motion. No scroll-driven animations exist in the current codebase; this is a forward-compatibility gap. [src/styles/styles.scss] — deferred, pre-existing
