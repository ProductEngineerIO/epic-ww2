# Story 9.2: Pre-Deployment Smoke Test

Status: ready-for-dev

## Story

As a developer and product owner,
I want a complete smoke test of the built site before FTP upload,
so that no broken links, missing images, or failed routes reach the live domain.

## Acceptance Criteria

1. `ng build` (via `npm run build:prod`) completes with zero errors; `dist/epic-ww2/browser/index.html` exists and contains `<base href="/">`
2. Navigating to `/#/` via a local static server renders the Homepage: HomepageHero + intro text + FleetGrid showing all 21 ship thumbnails — no "Content pending" text, no console errors
3. Navigating to `/#/about` renders the AboutComponent ComingSoon page with "About Howard" heading and correct body copy; browser tab reads `"About Howard — Howard Hertzog WWII Photography"`
4. Navigating to `/#/not-found` renders the NotFoundComponent with `"Page not found."` heading and a working `"← Back to fleet"` link
5. Navigating to `/#/ships/uss-valley-forge` renders the full ship page: ShipHero photograph, WitnessTrioBlock (DossierCard + AttributionCaption + NarrativeSection with historical caveat), and ShipNav — no "Content pending" text in any field
6. At least 3 additional ship pages (`/#/ships/burton-island-ag-88`, `/#/ships/uss-atlanta`, `/#/ships/uss-vicksburg`) render completely without errors and without "Content pending" text
7. All 21 fleet grid thumbnail links navigate to the correct `/#/ships/:slug` route and each ship page renders with complete content
8. ShipNav Prev/Next navigates through all 21 ships in roster order without breaking; circular wrap is verified: `burton-island-ag-88` Prev → `uss-vicksburg`, and `uss-vicksburg` Next → `burton-island-ag-88`
9. All PersistentNav links (Fleet, About Howard) resolve without 404; any unknown hash route (e.g., `/#/foo`) redirects to `/#/not-found`
10. On a 375px-wide viewport, every page type (home, ship, about, not-found) renders with no horizontal scroll
11. Every ship hero image and all 21 fleet grid thumbnails load successfully — no broken-image icons anywhere

## Tasks / Subtasks

- [ ] **Prerequisite check** — Confirm all upstream stories are complete before proceeding (AC: all)
  - [ ] Verify `ShipPageComponent` at `src/app/features/ship/ship-page.component.ts` is NOT the stub (`template: '<p>ShipPageComponent</p>'`) — Story 4.7 must be done
  - [ ] Verify `HomeComponent` at `src/app/features/home/home.component.ts` is NOT the stub — Stories 5.1–5.3 must be done
  - [ ] Verify `AboutComponent` at `src/app/features/about/about.component.ts` is NOT the stub — Story 6.1 must be done
  - [ ] Verify `NotFoundComponent` at `src/app/features/not-found/not-found.component.ts` is NOT the stub — Story 6.2 must be done
  - [ ] Verify `ships.ts` has no `[Content pending]` data entries for any of the 21 ships — Epic 8 must be done
  - [ ] If any prerequisite is unmet: STOP and document which stories are blocking; do not mark this story done

- [ ] **Production build** (AC: 1)
  - [ ] Confirm `package.json` has a `"build:prod": "ng build --base-href /"` script (added by Story 9.1); if missing, add it now
  - [ ] Run `npm run build:prod` and capture any errors or warnings
  - [ ] Verify `dist/epic-ww2/browser/index.html` exists
  - [ ] Open `dist/epic-ww2/browser/index.html` and confirm `<base href="/">` is present in `<head>`
  - [ ] Note initial bundle sizes from build output; flag anything over 1 MB initial as a concern

- [ ] **Start local static server** (AC: 2–11)
  - [ ] Run `npx http-server dist/epic-ww2/browser -p 4200 --proxy http://localhost:4200?` (the `--proxy` flag routes all 404s back to index.html, mimicking Bluehost behavior with HashLocationStrategy)
  - [ ] Alternatively, `ng serve` is acceptable for dev-build testing but production build + static server is the authoritative check
  - [ ] Open browser at `http://localhost:4200`

- [ ] **Homepage smoke test** (AC: 2)
  - [ ] Navigate to `http://localhost:4200/#/`
  - [ ] Confirm HomepageHero renders with the `uss-valley-forge` photograph (the ship with `isHomepageHero: true` in `ships.ts`)
  - [ ] Confirm intro text is visible above or below the hero (Roboto Slab, khaki, opening paragraph identifies Howard Hertzog, San Francisco Bay, c. 1944–1946)
  - [ ] Confirm FleetGrid shows all 21 ship thumbnail cells — count them
  - [ ] Confirm no cell displays "Content pending" in its overlay
  - [ ] Confirm no JavaScript errors in browser console
  - [ ] Confirm "Fleet" link in PersistentNav has active styling

- [ ] **About page smoke test** (AC: 3)
  - [ ] Navigate to `http://localhost:4200/#/about`
  - [ ] Confirm ComingSoon page renders: dark surface, heading "About Howard" (or similar per UX-DR13), body "The story of Howard Hertzog — coming soon."
  - [ ] Confirm browser tab title reads `"About Howard — Howard Hertzog WWII Photography"`
  - [ ] Confirm "About Howard" link in PersistentNav has active styling
  - [ ] Confirm PersistentNav is intact (sticky)

- [ ] **Not-found page smoke test** (AC: 4, 9)
  - [ ] Navigate to `http://localhost:4200/#/not-found` directly
  - [ ] Confirm `"Page not found."` heading and `"← Back to fleet"` link render
  - [ ] Click `"← Back to fleet"` — confirm it navigates to `/#/`
  - [ ] Navigate to `http://localhost:4200/#/foo` (unknown route) — confirm redirect to `/#/not-found`
  - [ ] Confirm neither "Fleet" nor "About Howard" is active in PersistentNav

- [ ] **Single ship page smoke test — uss-valley-forge** (AC: 5)
  - [ ] Navigate to `http://localhost:4200/#/ships/uss-valley-forge`
  - [ ] Confirm browser tab title reads `"USS Valley Forge — Howard Hertzog WWII Photography"`
  - [ ] Confirm ShipHero photograph renders (no broken image icon, no "Image unavailable" error state)
  - [ ] Confirm AttributionCaption is visible: "Photographed by Howard Hertzog, San Francisco Bay, c. 1944–1946"
  - [ ] Confirm DossierCard shows vessel class, commissioned date, and fate — no blank fields, no "[Content pending]"
  - [ ] Confirm NarrativeSection has 2–4 paragraphs of narrative text and historical caveat in italic at bottom
  - [ ] Confirm ShipNav renders Prev, Next, and Back to fleet; click Prev → previous ship page renders; click Next → next ship page renders
  - [ ] Confirm no `"Content pending"` text anywhere on the page

- [ ] **Additional ship page smoke tests** (AC: 6)
  - [ ] Navigate to `/#/ships/burton-island-ag-88` — full page renders, all WitnessTrioBlock fields populated
  - [ ] Navigate to `/#/ships/uss-atlanta` — full page renders, all WitnessTrioBlock fields populated
  - [ ] Navigate to `/#/ships/uss-vicksburg` — full page renders, all WitnessTrioBlock fields populated

- [ ] **Full fleet navigation via FleetGrid** (AC: 7)
  - [ ] From homepage, click each of the 21 thumbnail cells in sequence and confirm each ship page renders
  - [ ] Use browser Back to return to grid between clicks (or use ShipNav's Back to fleet link)
  - [ ] Confirm each ship page title matches the clicked ship

- [ ] **ShipNav circular navigation test** (AC: 8)
  - [ ] Navigate to `/#/ships/burton-island-ag-88` (ship #1 in roster)
  - [ ] Click Prev → confirm navigation to `/#/ships/uss-vicksburg` (ship #21, circular wrap)
  - [ ] Navigate to `/#/ships/uss-vicksburg` (ship #21)
  - [ ] Click Next → confirm navigation to `/#/ships/burton-island-ag-88` (ship #1, circular wrap)
  - [ ] Using keyboard ArrowRight from any ship page, navigate through all 21 ships in order; confirm no broken pages
  - [ ] Confirm ship order matches `SHIPS` array order in `ships.ts` (see Dev Notes — Full Fleet Roster)

- [ ] **Mobile viewport test** (AC: 10)
  - [ ] In browser DevTools, set viewport to 375×812 (iPhone SE / 375px width)
  - [ ] Check `/#/` — no horizontal scrollbar, all content fits
  - [ ] Check `/#/ships/uss-valley-forge` — hero renders, WitnessTrioBlock stacks correctly, ShipNav wraps as specified
  - [ ] Check `/#/about` and `/#/not-found` — no horizontal scroll
  - [ ] Check that ShipNav on mobile has "Back to fleet" centered on its own row (UX-DR9)
  - [ ] Check FleetGrid on mobile is 1-column layout

- [ ] **Image load verification** (AC: 11)
  - [ ] On homepage, open DevTools Network tab filtered to "Img"; confirm all 21 thumbnail images return 200 (no 404s)
  - [ ] On `/#/ships/uss-valley-forge`, confirm hero WebP (or JPEG fallback) loads successfully
  - [ ] Spot-check 3 additional ship hero images for 200 status
  - [ ] Confirm no broken-image icon appears anywhere across the tested pages

- [ ] **Final build artifact check** (AC: 1)
  - [ ] Confirm `dist/epic-ww2/browser/` contains `index.html`, hashed JS bundles, hashed CSS bundles, and the `assets/` directory with all images
  - [ ] Confirm `assets/images/hero/` and `assets/images/thumb/` directories are present inside the build output
  - [ ] Verify no `src/` paths appear in the built `index.html` (all paths should be relative, not Webpack/CLI source paths)

## Dev Notes

### Dependency Chain

This is the final integration checkpoint before FTP deploy. Story 9.2 **cannot pass** until these stories are all complete and verified:

| Prerequisite | Story | Key Output |
|---|---|---|
| ShipPageComponent (full) | 4.7 | Ship pages render with Witness Trio |
| HomepageHero | 5.1 | Homepage hero photograph renders |
| FleetGrid | 5.2 | 21-ship thumbnail grid on homepage |
| HomeComponent | 5.3 | Homepage fully assembled |
| AboutComponent (ComingSoon) | 6.1 | `/#/about` renders gracefully |
| NotFoundComponent | 6.2 | `/#/not-found` renders; wildcard redirect works |
| Responsive layouts | 7.1 | No horizontal scroll at 375px |
| Accessibility floor | 7.2 | Focus rings, alt text, semantic HTML |
| Ship content (all 21) | 8.1–8.3 | No `[Content pending]` in any field |
| Historical caveat | 8.4 | NarrativeSection caveat text finalized |
| ng build config + base-href | 9.1 | `build:prod` script, `<base href="/">` |

**If any upstream story is incomplete**, open the appropriate story file and complete it first. Do not mark Story 9.2 done while any story above is unfinished.

### Current Codebase State (as of story creation)

As of this story's creation, several components remain as stubs. The following files need to be updated by their respective stories before this smoke test can run:

| File | Current State | Required By |
|---|---|---|
| `src/app/features/ship/ship-page.component.ts` | Stub: `template: '<p>ShipPageComponent</p>'` | Story 4.7 |
| `src/app/features/home/home.component.ts` | Stub: `template: '<p>HomeComponent</p>'` | Stories 5.1–5.3 |
| `src/app/features/about/about.component.ts` | Stub: `template: '<p>AboutComponent</p>'` | Story 6.1 |
| `src/app/features/not-found/not-found.component.ts` | Stub: `template: '<p>NotFoundComponent</p>'` | Story 6.2 |
| `src/data/ships.ts` | All 21 ships have `[Content pending]` in vesselClass, commissioned, fate, narrative | Epic 8 |

The following components ARE fully implemented and should already be working:
- `PersistentNavComponent` (`src/app/core/components/persistent-nav/`)
- `ShipHeroComponent`, `AttributionCaptionComponent`, `DossierCardComponent`, `NarrativeSectionComponent`, `WitnessTrioBlockComponent`, `ShipNavComponent` (all in `src/app/shared/components/`)
- `ShipDataService` (`src/app/core/services/ship-data.service.ts`)
- `RouterTitleStrategy` (`src/app/core/services/router-title-strategy.ts`)
- All route wiring in `app.routes.ts` and `app.config.ts`

### Build Pipeline

**Angular version:** 21.2.x (package.json `^21.2.0`)
**Build command:** `npm run build:prod` → runs `ng build --base-href /`
**Output path:** `dist/epic-ww2/browser/` (configured in `angular.json` `outputPath`)
**Styles entry:** `src/styles/styles.scss` (configured in `angular.json`)
**Default build config:** `production` (outputHashing: all)

The `build:prod` script must be in `package.json` (Story 9.1 AC). If missing, add it:
```json
"build:prod": "ng build --base-href /"
```

**Static server for built output:**
```bash
# Option A — npx http-server (zero-install)
npx http-server dist/epic-ww2/browser -p 4200

# Option B — Python (macOS built-in)
cd dist/epic-ww2/browser && python3 -m http.server 4200
```
Note: HashLocationStrategy means all navigation is hash-based (`/#/...`); the static server never needs to rewrite 404s to `index.html` because the browser never requests `/ships/uss-valley-forge` as a real URL. Any basic static server works.

### Full Fleet Roster (21 Ships in Canonical Order)

This is the order defined in `src/data/ships.ts`. ShipNav Prev/Next follows this exact order.

| # | Slug | Display Name |
|---|---|---|
| 1 | `burton-island-ag-88` | Burton Island (AG-88) |
| 2 | `dms-doran` | DMS Doran |
| 3 | `general-hersey` | General Hersey |
| 4 | `general-hw-butler` | General H.W. Butler |
| 5 | `lsm-276` | LSM-276 |
| 6 | `tug-181` | Tug 181 |
| 7 | `uss-allen-m-sumner` | USS Allen M. Sumner |
| 8 | `uss-atlanta` | USS Atlanta |
| 9 | `uss-benham` | USS Benham |
| 10 | `uss-caiman` | USS Caiman |
| 11 | `uss-chipola` | USS Chipola |
| 12 | `uss-columbus` | USS Columbus |
| 13 | `uss-haven` | USS Haven |
| 14 | `uss-keppler` | USS Keppler |
| 15 | `uss-massachusettes` | USS Massachusettes (intentional misspelling in slug — matches image filename; display name correct) |
| 16 | `uss-oklahoma-city` | USS Oklahoma City |
| 17 | `uss-rockwall` | USS Rockwall |
| 18 | `uss-rodgers` | USS Rodgers |
| 19 | `uss-theodore-e-chandler` | USS Theodore E. Chandler |
| 20 | `uss-valley-forge` | USS Valley Forge ← `isHomepageHero: true` |
| 21 | `uss-vicksburg` | USS Vicksburg |

**Circular navigation boundary checks:**
- Ship #1 (`burton-island-ag-88`) → Prev → Ship #21 (`uss-vicksburg`) ✓
- Ship #21 (`uss-vicksburg`) → Next → Ship #1 (`burton-island-ag-88`) ✓

**Image anomalies to verify (from AD-6 architecture note):**
- `uss-massachusettes` slug uses the misspelled form — the optimized images at `src/assets/images/hero/uss-massachusettes.webp` and `.jpg` BOTH exist (confirmed in asset directory). Verify the ship page loads the photograph correctly despite the misspelling.
- `uss-keppler` slug has trailing dash stripped (original source file was `uss-keppler-.jpg`); assets are at `src/assets/images/hero/uss-keppler.webp` and `.jpg` (confirmed). Verify image loads.

### Image Asset Verification

All 42 optimized image files are present in `src/assets/images/hero/` and `src/assets/images/thumb/` (21 × WebP + 21 × JPEG in each directory = 84 files total across both directories). Presence was confirmed during story creation. The `<picture>` element in ShipHero and FleetGrid should serve WebP to modern browsers with JPEG fallback.

All images were produced by `scripts/optimize-images.mjs` (Story 2.1) using `sharp`. Format: WebP primary, JPEG fallback. Target: ≤200 KB per hero image (NFR-1).

### Architecture Constraints to Verify During Smoke Test

During testing, confirm these architecture invariants hold:

- **AD-1:** No NgModules in Angular DevTools; all components are standalone
- **AD-2:** No bare `<a href="/ships/...">` in any rendered HTML — all ship links use `routerLink` (Angular renders them as `<a href="/#/ships/...">`)
- **AD-3:** Confirm no component directly imports from `src/data/ships.ts` — only `ShipDataService` should consume it; verify in DevTools Sources
- **AD-4:** Open browser DevTools Elements panel — no `color: #...` or `font-family: "..."` inline styles from Angular component styles; all should use `var(--...)` references
- **AD-5:** On any ship page, confirm `<app-dossier-card>`, `<app-attribution-caption>`, and `<app-narrative-section>` only appear inside `<app-witness-trio-block>` — never as direct children of `<app-ship-page>`

### Smoke Test Pass Criteria

A smoke test PASSES only when ALL of the following are true:
1. `ng build` exits with code 0, zero errors
2. All 5 tested routes render content without stubs or "Content pending" text
3. All 21 ship thumbnails on the homepage link correctly
4. ShipNav circular wrap confirmed (both endpoints)
5. No broken image icons on any tested page
6. No horizontal scroll at 375px width on any tested page
7. No JavaScript console errors on any tested page

**If any criterion fails**, document the failure in the Completion Notes List below with:
- Which AC failed
- Which page/route
- What was observed vs. expected
- Which upstream story is responsible

### References

- [Source: docs/planning-artifacts/epics.md#Story 9.2] — Acceptance criteria source
- [Source: docs/planning-artifacts/epics.md#Epic 9] — Epic goal: "run a pre-deployment smoke test covering all routes and the no-broken-links requirement"
- [Source: docs/planning-artifacts/epics.md#FR Coverage Map] — NFR-1 (performance), NFR-2 (accessibility) mapped to this story
- [Source: docs/planning-artifacts/architecture/architecture-epic-ww2-2026-07-29/architecture-document.md] — AD-1 through AD-10 architecture invariants
- [Source: docs/planning-artifacts/ux-designs/ux-epic-ww2-2026-07-29/EXPERIENCE.md] — UX-DR9 (ShipNav mobile layout), UX-DR10 (FleetGrid), UX-DR19 (scroll-to-top on route change)
- [Source: src/data/ships.ts] — Canonical 21-ship roster order, `isHomepageHero` flag on `uss-valley-forge`
- [Source: src/app/app.routes.ts] — All defined routes: `''`, `ships/:slug`, `about`, `not-found`, `**`
- [Source: angular.json] — `outputPath: "dist/epic-ww2/browser"`, `defaultConfiguration: "production"`

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6 (GitHub Copilot)

### Debug Log References

### Completion Notes List

### File List
