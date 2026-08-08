---
stepsCompleted: ["step-01-validate-prerequisites", "step-02-design-epics", "step-03-create-stories"]
inputDocuments:
  - docs/planning-artifacts/prds/prd-epic-ww2-2026-07-29/prd.md
  - docs/planning-artifacts/architecture/architecture-epic-ww2-2026-07-29/architecture-document.md
  - docs/planning-artifacts/architecture/architecture-epic-ww2-2026-07-29/ARCHITECTURE-SPINE.md
  - docs/planning-artifacts/ux-designs/ux-epic-ww2-2026-07-29/DESIGN.md
  - docs/planning-artifacts/ux-designs/ux-epic-ww2-2026-07-29/EXPERIENCE.md
---

# Howard Hertzog WWII Ship Photography Website - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for the Howard Hertzog WWII Ship Photography Website, decomposing the requirements from the PRD, UX Design, and Architecture into implementable stories for the Developer agent.

---

## Requirements Inventory

### Functional Requirements

FR-1: Full-width hero photograph of the ship (Howard Hertzog's photograph) on every ship page
FR-2: Howard attribution caption displayed on or immediately beneath the hero photo; present on every ship page without exception
FR-3: Dossier card containing: vessel class, commissioned date, fate (e.g., decommissioned / sunk / scrapped / survived)
FR-4: "Where was it going" narrative — 2–4 paragraphs of contextual framing placing the ship in its WWII operational moment
FR-5: Sourced history summary with an explicit historical-source caveat displayed on the page
FR-6: Witness Document Trio integrity — FR-3, FR-2, and FR-4 must co-appear on every ship page; no ship page ships without all three present and non-empty
FR-7: Prev / Next ship navigation on every ship page (circular, cycles through 21-ship fleet in defined order)
FR-8: "Back to fleet" link on every ship page
FR-9: Opening paragraph above the fold on the homepage identifies Howard Hertzog, San Francisco Bay, and c. 1944–1946
FR-10: Fleet overview entry point (grid of all 21 ships with photograph thumbnails) visible above the fold or within one viewport scroll
FR-11: Dark, album-like visual treatment on homepage (memorial and atmospheric tone)
FR-12: Persistent fleet index accessible from every page (nav link)
FR-13: Navigation scaffold includes named placeholder slots for future sections
FR-14: "About Howard" navigation slot present at launch; links to a coming-soon placeholder page
FR-15: Coming-soon placeholder pages for any linked-to content not ready at launch — no broken links, no 404s
FR-16: Color palette: olive drab, khaki, steel grey — no bright consumer palette
FR-17: Typeface: slab serif (Roboto Slab + Lora) — no rounded sans
FR-18: Texture / grain applied to UI surfaces
FR-19: Single Angular component template used for all 21 ship pages
FR-20: Dossier data researched and confirmed per ship: vessel class, commissioned date, fate
FR-21: "Where was it going" narrative written per ship (2–4 paragraphs)
FR-22: At least one primary or secondary historical source identified and cited per ship
FR-23: Historical-source caveat text finalized; wording consistent across all 21 pages
FR-24: One hero photograph per ship sourced from Howard Hertzog's original collection (21 photographs total)
FR-25: Images optimized for web delivery: ≤200 KB per image at full-width; WebP format preferred with JPEG fallback
FR-26: All images include descriptive alt text for screen reader accessibility
FR-27: Built with Angular (current stable release); no server-side runtime required
FR-28: Angular routing configured with HashLocationStrategy
FR-29: `ng build` produces a self-contained `dist/` folder; deployment is FTP upload to Bluehost
FR-30: Ship data stored in structured TypeScript data file (`ships.ts`) — not hard-coded into templates
FR-31: Mobile-first responsive layout; no horizontal scroll on viewports ≥320px wide
FR-32: Site hosted at www.ww2epic.com (Bluehost); base-href set to `/` for root-domain deployment

### Non-Functional Requirements

NFR-1: Performance — Pages render meaningful content within 3 seconds on a 4G mobile connection. Image optimization is the primary lever; Angular bundle size is secondary.
NFR-2: Accessibility — All images have alt text. Text over dark/textured backgrounds meets WCAG AA contrast minimum. Keyboard navigation works on all interactive elements.
NFR-3: Extensibility — Adding a new ship requires only a data entry + image drop + nav entry. Adding a new section requires only a new Angular route and component — no structural changes to existing ship pages.
NFR-4: Hosting compatibility — The built `dist/` folder deploys to any standard FTP-capable web host with no server-side configuration beyond uploading files.

### Additional Requirements from Architecture

- **Starter:** No starter template; greenfield Angular 22 project via `ng new epic-ww2 --standalone --routing --style=scss`
- **AD-1:** All Angular components must be standalone (`standalone: true`); no NgModules anywhere; bootstrapped via `bootstrapApplication()`
- **AD-2:** Router configured with `withHashLocation()` — all internal links use Angular `routerLink`; no bare `<a href>` to paths
- **AD-3:** `src/data/ships.ts` is the sole source of truth for ship data; `ShipDataService` is the only consumer; no component imports `ships.ts` directly
- **AD-4:** Every color, font-family, spacing constant must be a CSS custom property from `src/styles/_tokens.scss`; no hex values in component files
- **AD-5:** `WitnessTrioBlock` is atomic; `ShipPageComponent` renders exactly one `<app-witness-trio-block>`; `DossierCard`, `AttributionCaption`, `NarrativeSection` must never render outside `WitnessTrioBlock`
- **AD-6:** Offline image pipeline (`scripts/optimize-images.mjs` using `sharp`) produces `hero/` and `thumb/` variants (WebP + JPEG fallback); `<picture>` element used for all images
- **AD-7:** `ShipDataService` is root-scope singleton (`providedIn: 'root'`); never provided at component level
- **AD-8:** Deploy from `dist/epic-ww2/browser/`; FTP contents (not the directory) to Bluehost `public_html/` root
- **AD-9:** Custom `RouterTitleStrategy` sets `<title>` per route from ship name or route label
- **AD-10:** Dependency direction — features import from shared/core; shared never imports from features
- **Image pipeline:** `Input: ./images/{slug}.jpg → Output: src/assets/images/hero/{slug}.webp`, `src/assets/images/hero/{slug}.jpg`, `src/assets/images/thumb/{slug}.webp`, `src/assets/images/thumb/{slug}.jpg`
- **Two filename anomalies:** `uss-keppler-.jpg` (trailing dash — strip it) and `uss-massachusettes.jpg` (misspelling — use misspelled slug to match image; name field shows correct spelling)

### UX Design Requirements

UX-DR1: Design token system — implement all color tokens from DESIGN.md as CSS custom properties in `_tokens.scss`; token names follow `--color-{name}`, `--font-{role}`, `--space-{size}`
UX-DR2: Typography system — implement both font families (Roboto Slab display, Lora narrative body) loaded via Google Fonts CDN; apply all 9 type scales defined in DESIGN.md (display-hero, headline-lg, headline-md, headline-sm, body-lg, body-md, label-caps, label-value, caption, nav-link)
UX-DR3: Grain/texture applied to UI surface backgrounds (suggests photographic era and materiality)
UX-DR4: ShipHero — full-bleed hero photograph, `object-fit: cover`, full viewport width, height `clamp(400px, 68vh, 680px)`, ship name overlay bottom-left in khaki Roboto Slab over gradient; blur-up loading placeholder (10px wide, CSS `filter: blur(8px)` → transition on load); `loading="eager"`
UX-DR5: AttributionCaption — placed directly after ShipHero in DOM order for screen readers; text: "Photographed by Howard Hertzog, San Francisco Bay, c. 1944–1946"; never omitted
UX-DR6: DossierCard — three-field card (vessel class / commissioned / fate); left olive-drab border visual anchor; "Not confirmed" in muted color if value unknown (never blank field); 3-column horizontal grid on tablet+, stacked on mobile
UX-DR7: NarrativeSection — Lora body-lg, max-width 660px, centered; historical caveat displayed as italic caption at base of section, always
UX-DR8: WitnessTrioBlock — renders DossierCard + AttributionCaption + NarrativeSection unconditionally; any missing data field → visible "Content pending" placeholder (not empty/broken); never partial
UX-DR9: ShipNav — Prev / Next + Back to fleet; circular (ship 1 Prev → ship 21; ship 21 Next → ship 1); no disabled state; keyboard: `ArrowLeft` → Previous, `ArrowRight` → Next (document-level listener on ship page routes only); responsive: all 3 on one line tablet+, "Back to fleet" centers on own row on mobile
UX-DR10: FleetGrid — 21-ship thumbnail grid; 1-col mobile, 2-col tablet, 3-col desktop; each cell: WebP thumbnail (4:3 aspect ratio), ship name overlay; tap/click → `/#/ships/:slug`; thumbnail `loading="lazy"`; desktop hover `transform: scale(1.02)` (disabled under `prefers-reduced-motion`)
UX-DR11: HomepageHero — single dominant photograph (ship with `isHomepageHero: true`); full viewport width; ship name NOT overlaid; intro text (Roboto Slab khaki + opening paragraph) appears below
UX-DR12: PersistentNav — sticky top; stays visible on scroll at all breakpoints; site title left + Fleet + About Howard right; no hamburger (two links fit at all sizes); active link gets `{colors.primary}` color via Angular RouterLinkActive
UX-DR13: ComingSoon — full-page dark surface; centered heading Roboto Slab; body copy "The story of Howard Hertzog — coming soon."; PersistentNav intact
UX-DR14: NotFound — same treatment as ComingSoon; heading "Page not found."; link back to `/#/`
UX-DR15: Focus ring — `outline: 2px solid {colors.primary}; outline-offset: 3px` on all interactive elements; never `outline: none` without custom replacement
UX-DR16: Accessibility — semantic HTML (`<header>`, `<main>`, `<article>`, `<figure>`, `<figcaption>`, `<nav>`, `<h1>`, `<h2>`); heading hierarchy enforced; touch targets minimum 44×44px; screen reader route announcements via `<title>` update; reduced motion: `@media (prefers-reduced-motion: reduce)` disables all transitions and transforms
UX-DR17: Voice & tone microcopy — attribution format, navigation labels (Fleet, About Howard, ← Previous ship, Next ship →, ↑ Back to fleet), fate line as statement of fact, "Coming soon." (no emoji), "Not confirmed" for unknown dossier values, historical caveat format
UX-DR18: Hero image error state — dark surface fill at hero height; text overlay "Image unavailable" in label-caps; does not block WitnessTrioBlock rendering
UX-DR19: Scroll behavior — page scrolls to top on each route change (`scrollPositionRestoration: 'top'`)
UX-DR20: PersistentNav active route — Angular `RouterLinkActive` applies `{colors.primary}` to current route's nav link

---

### FR Coverage Map

| FR | Story |
|---|---|
| FR-1 | 4.1 (ShipHero component) |
| FR-2 | 4.2 (AttributionCaption component) |
| FR-3 | 4.3 (DossierCard component) |
| FR-4 | 4.4 (NarrativeSection component) |
| FR-5 | 4.4 (NarrativeSection — caveat), 8.4 (caveat finalization) |
| FR-6 | 4.5 (WitnessTrioBlock) |
| FR-7 | 4.6 (ShipNav) |
| FR-8 | 4.6 (ShipNav — back to fleet) |
| FR-9 | 5.3 (HomeComponent) |
| FR-10 | 5.2 (FleetGrid), 5.3 (HomeComponent) |
| FR-11 | 5.3 (HomeComponent), 1.3 (design tokens) |
| FR-12 | 3.2 (PersistentNav) |
| FR-13 | 3.2 (PersistentNav — placeholder slots) |
| FR-14 | 3.2 (PersistentNav), 6.1 (AboutComponent) |
| FR-15 | 6.1 (AboutComponent coming-soon), 6.2 (NotFound) |
| FR-16 | 1.3 (design tokens) |
| FR-17 | 1.3 (design tokens + Google Fonts) |
| FR-18 | 1.3 (grain texture in tokens/global styles) |
| FR-19 | 4.7 (ShipPageComponent single template) |
| FR-20 | 8.1–8.3 (dossier data research) |
| FR-21 | 8.1–8.3 (narrative writing) |
| FR-22 | 8.1–8.3 (sources per ship) |
| FR-23 | 8.4 (caveat wording finalization) |
| FR-24 | 2.1 (image pipeline — 21 photographs) |
| FR-25 | 2.1 (optimize-images.mjs → ≤200 KB WebP) |
| FR-26 | 1.4 (ship.model.ts altText field), 8.1–8.3 (alt text per ship) |
| FR-27 | 1.1 (Angular 22 scaffold) |
| FR-28 | 1.2 (HashLocationStrategy routing) |
| FR-29 | 9.1 (ng build configuration) |
| FR-30 | 1.4 (ships.ts + Ship interface), 1.5 (ShipDataService) |
| FR-31 | 7.1 (responsive layouts) |
| FR-32 | 9.1 (base-href + Bluehost) |
| NFR-1 | 2.1 (image optimization), 9.2 (smoke test) |
| NFR-2 | 7.2 (accessibility floor) |
| NFR-3 | 1.1–1.5 (data-driven scaffold) |
| NFR-4 | 9.1 (static dist/ deploy) |

---

## Epic List

1. **Epic 1: Angular Project Foundation** — Scaffold, configure routing, design tokens, data model, and ShipDataService
2. **Epic 2: Image Pipeline & Asset Management** — Optimize all 21 photographs; produce WebP + JPEG hero and thumb variants
3. **Epic 3: Application Shell** — AppComponent, PersistentNav with sticky nav and active state
4. **Epic 4: Ship Page Components** — ShipHero, AttributionCaption, DossierCard, NarrativeSection, WitnessTrioBlock, ShipNav, ShipPageComponent
5. **Epic 5: Homepage** — HomepageHero, FleetGrid, HomeComponent
6. **Epic 6: Supporting Pages** — AboutComponent (coming soon), NotFound
7. **Epic 7: Responsive Design & Accessibility** — All breakpoints, accessibility floor, reduced motion, focus ring
8. **Epic 8: Ship Content Research & Data Population** — All 21 ships' dossier data, narratives, sources, alt text
9. **Epic 9: Build, Smoke Test & Deployment** — ng build config, smoke test, FTP deploy to ww2epic.com

---

## Epic 1: Angular Project Foundation

**Epic Goal:** Bootstrap a clean Angular 22 standalone SPA that enforces the full architectural invariant set — correct folder structure, HashLocationStrategy routing, design token SCSS system, Ship data model, and ShipDataService — so every downstream epic builds on a proven substrate. No visible UI is required by this epic; the output is a running `ng serve` with no errors.

---

### Story 1.1: Scaffold Angular 22 Standalone Project

As a developer,
I want to initialize the Angular 22 project with the correct folder structure and configuration,
So that the entire codebase has a consistent, architecture-compliant scaffold to build on.

**Acceptance Criteria:**

**Given** an empty repository at `/Users/edhertzog/Documents/ProductEngineerIO/epic-ww2`,
**When** the scaffold command runs,
**Then** `ng new epic-ww2 --standalone --routing --style=scss` (or equivalent Angular 22 CLI command) produces a working project
**And** `ng serve` starts without errors

**Given** the project is initialized,
**When** the folder structure is verified,
**Then** the following directories exist: `src/app/core/components/`, `src/app/core/services/`, `src/app/shared/components/`, `src/app/shared/models/`, `src/app/features/home/`, `src/app/features/ship/`, `src/app/features/about/`, `src/app/features/not-found/`, `src/data/`, `src/styles/`, `src/assets/images/hero/`, `src/assets/images/thumb/`, `scripts/`

**Given** the project is bootstrapped,
**When** `src/main.ts` is inspected,
**Then** `bootstrapApplication()` is used — no `AppModule`, no `NgModule` anywhere in the project

**Given** the project configuration,
**When** `angular.json` is inspected,
**Then** `outputPath` resolves to `dist/epic-ww2/browser/` and `styles` includes `src/styles/styles.scss`

---

### Story 1.2: Configure Routing with HashLocationStrategy and TitleStrategy

As a developer,
I want Angular routing configured with HashLocationStrategy and a custom TitleStrategy,
So that all routes resolve correctly on Bluehost's Apache server without `.htaccess` rewrite rules and each page has a meaningful browser tab title.

**Acceptance Criteria:**

**Given** the app config is set up,
**When** `src/app/app.config.ts` is inspected,
**Then** `provideRouter()` includes `withHashLocation()`, `withComponentInputBinding()`, and `withRouterConfig({ scrollPositionRestoration: 'top' })`
**And** a custom `RouterTitleStrategy` is provided that extends Angular's `TitleStrategy`

**Given** the routes file is set up,
**When** `src/app/app.routes.ts` is inspected,
**Then** it defines exactly these routes:
- `''` → `HomeComponent`, title: `'Fleet — Howard Hertzog WWII Photography'`
- `'ships/:slug'` → `ShipPageComponent` (title set dynamically by RouterTitleStrategy from `ship.name`)
- `'about'` → `AboutComponent`, title: `'About Howard — Howard Hertzog WWII Photography'`
- `'not-found'` → `NotFoundComponent`, title: `'Not Found — Howard Hertzog WWII Photography'`
- `'**'` → redirectTo `'not-found'`

**Given** a user navigates to `/#/ships/uss-valley-forge`,
**When** the ship page loads,
**Then** the browser tab title reads `"USS Valley Forge — Howard Hertzog WWII Photography"`

**Given** a user navigates to an unresolved route like `/#/foo`,
**When** the Angular router resolves it,
**Then** the user is redirected to `/#/not-found` (not a server 404)

---

### Story 1.3: Implement Design Token System

As a developer,
I want all DESIGN.md color and typography values expressed as CSS custom properties in `_tokens.scss`,
So that every component references tokens by name — never raw hex values — and the design is consistent and easy to update.

**Acceptance Criteria:**

**Given** `src/styles/_tokens.scss` is created,
**When** the file is inspected,
**Then** all 17 color tokens from DESIGN.md are defined as `--color-{name}` CSS custom properties matching these exact values:
- `--color-bg: #16160e`, `--color-surface: #23231a`, `--color-surface-raised: #2e2e22`, `--color-surface-cont: #38382c`
- `--color-on-surface: #ede9df`, `--color-khaki: #c9b87a`, `--color-steel: #8a9aaa`, `--color-steel-muted: #5a6870`
- `--color-olive: #7a8c44`, `--color-olive-dim: #4a5228`, `--color-outline: #4a5a6a`, `--color-outline-v: #3d3d2e`
- `--color-overlay: rgba(22, 22, 14, 0.82)`, `--color-error: #c0392b`, `--color-on-primary: #16160e`

**Given** the typography tokens are defined,
**When** `_tokens.scss` is inspected,
**Then** all 10 type scale tokens from DESIGN.md are expressed as `--font-*` or referenced via class utilities, including display-hero (clamp(2rem, 6vw, 3.5rem)), body-lg (1.1rem/1.8 Lora), and label-caps (0.7rem uppercase 0.12em spacing)

**Given** `src/styles/styles.scss` is updated,
**When** the global stylesheet is inspected,
**Then** it imports `_tokens.scss`, imports Google Fonts (Roboto Slab + Lora), applies `body { background: var(--color-bg); color: var(--color-on-surface); font-family: var(--font-body-md); }`, and includes a CSS reset

**Given** a grain/texture effect is required (FR-18, UX-DR3),
**When** the global styles are applied,
**Then** a subtle grain texture is applied to surface backgrounds (via CSS `::before` pseudo-element with SVG or CSS noise, or `background-image` grain pattern), consistent with the photographic-era aesthetic

**Given** the AD-4 invariant,
**When** any component SCSS file is inspected,
**Then** no raw hex color values appear — only `var(--color-*)` references

---

### Story 1.4: Define Ship Data Model and Initialize ships.ts

As a developer,
I want the `Ship` TypeScript interface and the `ships.ts` data file with all 21 entries,
So that the ShipDataService has a complete, typed, architecture-compliant data source.

**Acceptance Criteria:**

**Given** `src/app/shared/models/ship.model.ts` is created,
**When** the interface is inspected,
**Then** it exports `interface Ship` with these exact fields:
- `slug: string` — URL segment and asset filename base
- `name: string` — display name
- `vesselClass: string` — dossier field
- `commissioned: string` — dossier field (human-readable date string)
- `fate: string` — dossier field
- `narrative: string[]` — array of paragraph strings
- `sources: string[]` — citation strings
- `altText: string` — full alt text string per EXPERIENCE.md convention
- `isHomepageHero?: boolean` — exactly one ship sets this true

**Given** `src/data/ships.ts` is created,
**When** the file is inspected,
**Then** it exports a single `SHIPS: Ship[]` array with all 21 entries in this exact order matching the PRD §3.5 roster:

| # | slug | name |
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
| 15 | `uss-massachusettes` | USS Massachusetts |
| 16 | `uss-oklahoma-city` | USS Oklahoma City |
| 17 | `uss-rockwall` | USS Rockwall |
| 18 | `uss-rodgers` | USS Rodgers |
| 19 | `uss-theodore-e-chandler` | USS Theodore E. Chandler |
| 20 | `uss-valley-forge` | USS Valley Forge |
| 21 | `uss-vicksburg` | USS Vicksburg |

**And** slug `uss-keppler` has no trailing dash (anomaly corrected from source filename `uss-keppler-.jpg`)
**And** slug `uss-massachusettes` uses the misspelled form (matches the image filename `uss-massachusettes.jpg`); the `name` field shows the correct spelling "USS Massachusetts"
**And** exactly one ship has `isHomepageHero: true`
**And** all narrative/sources/altText fields are populated with placeholder strings (e.g., `narrative: ['[Content pending]']`) until Epic 8 data population

---

### Story 1.5: Implement ShipDataService

As a developer,
I want a root-scope `ShipDataService` that is the sole access point to the `SHIPS` array,
So that no component ever imports `ships.ts` directly, and fleet ordering and lookups are always consistent.

**Acceptance Criteria:**

**Given** `src/app/core/services/ship-data.service.ts` is created,
**When** the service is inspected,
**Then** it is decorated `@Injectable({ providedIn: 'root' })`
**And** it imports `SHIPS` from `src/data/ships.ts`
**And** it exposes exactly three public methods:
- `getAll(): Ship[]` — returns the full ships array
- `getBySlug(slug: string): Ship | undefined` — returns the matching ship or undefined
- `getAdjacentSlugs(slug: string): { prev: string; next: string }` — returns circular prev/next slugs

**Given** `getAdjacentSlugs('burton-island-ag-88')` is called (ship #1),
**When** the result is evaluated,
**Then** `prev` is `'uss-vicksburg'` (ship #21, circular wrap) and `next` is `'dms-doran'` (ship #2)

**Given** `getAdjacentSlugs('uss-vicksburg')` is called (ship #21),
**When** the result is evaluated,
**Then** `prev` is `'uss-valley-forge'` (ship #20) and `next` is `'burton-island-ag-88'` (ship #1, circular wrap)

**Given** `getBySlug('nonexistent-slug')` is called,
**When** the result is evaluated,
**Then** it returns `undefined` (not an error)

**Given** the AD-7 invariant,
**When** any component file is inspected,
**Then** no component has `ShipDataService` in its `providers` array (root-only injection)

---

## Epic 2: Image Pipeline & Asset Management

**Epic Goal:** Process all 21 Howard Hertzog JPEG photographs through the image optimization pipeline to produce WebP and JPEG hero (1920w, ≤200 KB) and thumbnail (600w) variants, with corrected filenames, so that Angular components have correctly named, optimized assets ready in `src/assets/images/`.

---

### Story 2.1: Build and Run the Image Optimization Pipeline

As a developer,
I want `scripts/optimize-images.mjs` to process all 21 source JPEGs and produce optimized hero and thumbnail variants,
So that Angular components can deliver fast-loading, properly formatted images with WebP and JPEG fallback.

**Acceptance Criteria:**

**Given** `scripts/optimize-images.mjs` is created using `sharp` (`^0.33.0`),
**When** `node scripts/optimize-images.mjs` is run from the project root,
**Then** it reads each `.jpg` file from `./images/` and produces four output files per ship:
- `src/assets/images/hero/{slug}.webp` — resized to 1920w, WebP, ≤200 KB
- `src/assets/images/hero/{slug}.jpg` — resized to 1920w, JPEG fallback
- `src/assets/images/thumb/{slug}.webp` — resized to 600w, WebP
- `src/assets/images/thumb/{slug}.jpg` — resized to 600w, JPEG fallback

**Given** the filename anomalies in source images,
**When** the script processes `./images/uss-keppler-.jpg`,
**Then** it outputs files named `uss-keppler.webp` / `uss-keppler.jpg` (trailing dash stripped)
**And** when it processes `./images/uss-massachusettes.jpg`, it outputs files named `uss-massachusettes.webp` / `uss-massachusettes.jpg` (misspelled slug preserved to match `ships.ts`)

**Given** all 21 source images are processed,
**When** `src/assets/images/hero/` and `src/assets/images/thumb/` are inspected,
**Then** each directory contains exactly 42 files (21 × WebP + 21 × JPEG)
**And** every hero WebP file is ≤200 KB

**Given** the script is run on a source image that has already been processed,
**When** it is run again,
**Then** it completes without error (idempotent)

**Given** `package.json` is updated,
**When** the scripts section is inspected,
**Then** a `"optimize-images": "node scripts/optimize-images.mjs"` script entry exists

---

## Epic 3: Application Shell

**Epic Goal:** Build the `AppComponent` router outlet and the `PersistentNav` component so the application has a working navigation frame that is sticky, shows the active route, and is accessible at all breakpoints — before any feature pages exist.

---

### Story 3.1: Implement PersistentNav Component

As a site visitor,
I want a sticky top navigation bar with the site title and Fleet/About Howard links,
So that I can navigate to the fleet index or the about page from anywhere on the site.

**Acceptance Criteria:**

**Given** PersistentNav is rendered,
**When** the page is inspected,
**Then** it shows: site title ("Howard Hertzog — WWII Photography" or equivalent) on the left, and "Fleet" + "About Howard" links on the right
**And** it is contained in a `<header>` element with `position: sticky; top: 0` styling
**And** all colors use CSS custom property tokens only — no hex values

**Given** the user is on the homepage (`/#/`),
**When** PersistentNav renders,
**Then** the "Fleet" link has the active state color (`var(--color-olive)`)
**And** "About Howard" does not have the active state color
**And** this is achieved via Angular `RouterLinkActive`

**Given** the user is on a ship page (`/#/ships/:slug`),
**When** PersistentNav renders,
**Then** neither "Fleet" nor "About Howard" is marked active (ship page is not a nav-level route)

**Given** the user is on the about page (`/#/about`),
**When** PersistentNav renders,
**Then** "About Howard" has the active state color

**Given** a mobile viewport (320px wide),
**When** PersistentNav renders,
**Then** no hamburger menu appears; site title is left-aligned, Fleet and About Howard links are right-aligned and fit on one line without overflow

**Given** the user scrolls down on any page,
**When** the page is scrolled,
**Then** PersistentNav remains visible at the top of the viewport (sticky)

**Given** the user navigates via keyboard (Tab key),
**When** PersistentNav has focus,
**Then** all nav links are reachable by Tab and have a visible focus ring (`outline: 2px solid var(--color-olive); outline-offset: 3px`)

**Given** touch targets are required to be ≥44×44px,
**When** the Fleet and About Howard links are measured,
**Then** each has a minimum 44px tap area height

---

### Story 3.2: Implement AppComponent Router Outlet

As a developer,
I want `AppComponent` to render the `PersistentNav` and a `<router-outlet>`,
So that all feature pages are framed by the persistent navigation shell.

**Acceptance Criteria:**

**Given** `src/app/app.component.ts` and its template are set up,
**When** the app loads in a browser,
**Then** `PersistentNav` renders at the top of every page
**And** the `<router-outlet>` renders the currently active route component below it

**Given** the Angular router config has `scrollPositionRestoration: 'top'`,
**When** the user navigates between routes,
**Then** the page scrolls to the top on every route change

**Given** any route is active,
**When** the page is inspected,
**Then** `<header>` wraps PersistentNav, `<main>` wraps `<router-outlet>` — correct semantic HTML

---

## Epic 4: Ship Page Components

**Epic Goal:** Build all components that make up a ship page — `ShipHero`, `AttributionCaption`, `DossierCard`, `NarrativeSection`, `WitnessTrioBlock`, `ShipNav`, and `ShipPageComponent` — with correct atomic composition, keyboard navigation, and all state patterns (blur-up, error, content-pending) implemented.

---

### Story 4.1: Implement ShipHero Component

As a site visitor,
I want a full-bleed hero photograph when I land on a ship page,
So that my first experience is the full impact of Howard's photograph.

**Acceptance Criteria:**

**Given** `ShipHero` receives a `ship: Ship` input,
**When** the component renders,
**Then** it renders a `<figure>` containing a `<picture>` with:
- `<source type="image/webp" [srcset]="'assets/images/hero/' + ship.slug + '.webp'">`
- `<img [src]="'assets/images/hero/' + ship.slug + '.jpg'" [alt]="ship.altText" loading="eager">`
- `<figcaption>` with the ship name overlaid bottom-left over a gradient

**Given** the hero renders,
**When** the image dimensions are inspected,
**Then** the image is full viewport width (`width: 100%`) and height is `clamp(400px, 68vh, 680px)` with `object-fit: cover`

**Given** the blur-up loading pattern,
**When** the hero image is loading,
**Then** a low-quality placeholder (10px wide, scaled up, CSS `filter: blur(8px)`) is shown
**And** when the full image fires the `load` event, it transitions with `transition: filter 400ms ease`

**Given** `@media (prefers-reduced-motion: reduce)` is active,
**When** the image loads,
**Then** no blur-up transition occurs; the image appears immediately

**Given** the hero image fails to load (error state),
**When** the `error` event fires on the `<img>`,
**Then** the figure shows a dark surface fill at the same height with text overlay "Image unavailable" in label-caps styling
**And** the `WitnessTrioBlock` below it is not affected

---

### Story 4.2: Implement AttributionCaption Component

As a site visitor,
I want Howard Hertzog's attribution to appear on every ship page,
So that his authorship as photographer is always credited.

**Acceptance Criteria:**

**Given** `AttributionCaption` is rendered inside `WitnessTrioBlock`,
**When** the component renders,
**Then** it displays the text: "Photographed by Howard Hertzog, San Francisco Bay, c. 1944–1946"
**And** it is placed directly after `ShipHero` in DOM order (for screen readers)

**Given** the component renders,
**When** it is inspected,
**Then** it uses caption typography (0.8rem, italic, Roboto Slab) from the token system
**And** no raw hex colors appear in the component SCSS

**Given** the WitnessTrioBlock renders a ship with data,
**When** the page is inspected,
**Then** AttributionCaption is always present — never conditionally hidden

---

### Story 4.3: Implement DossierCard Component

As a site visitor,
I want a clearly structured card showing a ship's class, commissioning date, and fate,
So that I understand the key facts about the vessel at a glance.

**Acceptance Criteria:**

**Given** `DossierCard` receives dossier data (vesselClass, commissioned, fate),
**When** the component renders,
**Then** it displays three labeled fields: "Vessel Class", "Commissioned", and "Fate"
**And** each field has a label in `label-caps` typography above its value in `label-value` typography
**And** a left olive-drab border (`border-left: 3px solid var(--color-olive)`) visually anchors the card

**Given** a field value is missing or empty in the data,
**When** the card renders,
**Then** it displays "Not confirmed" in `var(--color-steel-muted)` — never a blank field

**Given** a desktop viewport (≥768px),
**When** DossierCard renders,
**Then** the three fields display in a horizontal 3-column grid

**Given** a mobile viewport (<768px),
**When** DossierCard renders,
**Then** the three fields stack vertically in a single column

**Given** the component uses colors,
**When** any SCSS file for DossierCard is inspected,
**Then** no raw hex color values appear — only `var(--color-*)` references

---

### Story 4.4: Implement NarrativeSection Component

As a site visitor,
I want to read a 2–4 paragraph narrative placing the ship in its WWII context,
So that I understand where this vessel was going when Howard photographed it.

**Acceptance Criteria:**

**Given** `NarrativeSection` receives `narrative: string[]` and `sources: string[]` inputs,
**When** the component renders,
**Then** each string in the `narrative` array is rendered as a separate `<p>` element
**And** the narrative is styled with `body-lg` typography (Lora, 1.1rem, line-height 1.8)
**And** the section has `max-width: 660px` and is centered

**Given** the component renders,
**When** the bottom of the section is inspected,
**Then** a historical-source caveat appears as an italic caption: "Historical details sourced from [source]. Accuracy not guaranteed." (or equivalent from finalized wording in Story 8.4)
**And** this caveat is always present — never conditionally hidden

**Given** the semantic structure,
**When** the HTML is inspected,
**Then** a `<section>` element with an `<h2>` heading wraps the narrative paragraphs

---

### Story 4.5: Implement WitnessTrioBlock Atomic Container

As a developer,
I want `WitnessTrioBlock` to unconditionally compose `DossierCard`, `AttributionCaption`, and `NarrativeSection`,
So that FR-6 (Witness Document Trio integrity) is enforced structurally — no ship page can ship with a partial trio.

**Acceptance Criteria:**

**Given** `WitnessTrioBlock` receives a complete `ship: Ship` input,
**When** the component renders,
**Then** it renders `DossierCard`, `AttributionCaption`, and `NarrativeSection` — all three, unconditionally, in that order

**Given** AD-5 invariant,
**When** the entire codebase is searched for `<app-dossier-card>`, `<app-attribution-caption>`, `<app-narrative-section>`,
**Then** these selectors appear only inside `WitnessTrioBlock`'s template — never in `ShipPageComponent` or any other template

**Given** a ship data entry has a missing or empty `narrative` field,
**When** `WitnessTrioBlock` renders,
**Then** `NarrativeSection` renders a visible "Content pending" block in place of the narrative
**And** a `console.warn()` is logged identifying which field is missing
**And** the other two trio members render normally

**Given** a ship data entry has a missing or empty `fate` / `vesselClass` / `commissioned` field,
**When** `WitnessTrioBlock` renders,
**Then** `DossierCard` shows "Not confirmed" for that field — never a broken or empty card

---

### Story 4.6: Implement ShipNav Component

As a site visitor,
I want Prev / Next ship navigation and a "Back to fleet" link on every ship page,
So that I can browse through all 21 ships without losing my place or fighting the back button.

**Acceptance Criteria:**

**Given** `ShipNav` receives `currentSlug: string` input,
**When** the component renders,
**Then** it renders three navigation elements: "← Previous ship", "↑ Back to fleet", "Next ship →"
**And** Prev and Next use Angular `routerLink` pointing to the prev/next slug from `ShipDataService.getAdjacentSlugs()`
**And** "Back to fleet" links to `/#/` (homepage)

**Given** the user is on ship #1 (Burton Island) and clicks "← Previous ship",
**When** navigation resolves,
**Then** the user arrives on ship #21 (USS Vicksburg) — circular wrap, no disabled state

**Given** the user is on ship #21 (USS Vicksburg) and clicks "Next ship →",
**When** navigation resolves,
**Then** the user arrives on ship #1 (Burton Island) — circular wrap, no disabled state

**Given** a keyboard user is on a ship page,
**When** they press `ArrowLeft`,
**Then** they navigate to the previous ship
**And** when they press `ArrowRight`, they navigate to the next ship
**And** this listener is a document-level `keydown` listener that is active only on ship page routes and destroyed when leaving

**Given** a desktop viewport (≥768px),
**When** ShipNav renders,
**Then** all three elements appear on one horizontal line

**Given** a mobile viewport (<768px),
**When** ShipNav renders,
**Then** "← Previous ship" and "Next ship →" are on the outer edges, and "↑ Back to fleet" centers on its own row between them

**Given** keyboard navigation,
**When** the Tab key is used,
**Then** all three ShipNav elements are reachable and have a visible focus ring

**Given** touch targets,
**When** the Prev and Next links are measured,
**Then** each has a minimum 44×44px tap area

---

### Story 4.7: Implement ShipPageComponent Feature

As a site visitor,
I want a complete ship page that composes the hero, attribution, witness trio, and ship nav,
So that I experience the full Witness Document Trio for any ship I navigate to.

**Acceptance Criteria:**

**Given** the user navigates to `/#/ships/uss-valley-forge`,
**When** the ShipPageComponent loads,
**Then** it receives `slug` as an `@Input()` via Angular's `withComponentInputBinding()`
**And** it calls `ShipDataService.getBySlug(slug)` to get the ship data
**And** it renders: `ShipHero`, `WitnessTrioBlock`, `ShipNav` — in that DOM order

**Given** the slug resolves to a valid ship,
**When** the page renders,
**Then** the browser tab title is `"{Ship Name} — Howard Hertzog WWII Photography"`

**Given** the slug does not resolve to a known ship (e.g., `/#/ships/nonexistent`),
**When** ShipPageComponent loads,
**Then** the user is redirected to `/#/not-found`

**Given** the semantic HTML requirement,
**When** the ship page HTML is inspected,
**Then** it uses `<article>` as the main content wrapper, `<h1>` for the ship name (appears once and only once), and `<main>` wrapping the article

**Given** the `isHomepageHero: true` flag on one ship,
**When** that ship's page loads,
**Then** it renders identically to all other ship pages — the flag has no visual effect on the ship page itself (it is only consumed by HomepageHero)

---

## Epic 5: Homepage

**Epic Goal:** Build the homepage with a dominant hero photograph, the opening paragraph establishing Howard's context, and the complete 21-ship fleet grid — delivering the "album cover + browsable fleet" experience described in UJ-2.

---

### Story 5.1: Implement HomepageHero Component

As a site visitor,
I want a single dominant photograph to greet me on the homepage,
So that the site opens with the visual weight of an album cover before I encounter the fleet.

**Acceptance Criteria:**

**Given** `HomepageHero` receives no inputs (it finds the hero ship itself),
**When** the component renders,
**Then** it calls `ShipDataService.getAll()`, finds the ship with `isHomepageHero: true`, and renders its hero image
**And** the image is full viewport width using `<picture>` with WebP source and JPEG fallback
**And** the ship name is NOT overlaid (unlike ShipHero — this is an editorial statement, not a ship page)

**Given** the hero image loads,
**When** the image is inspected,
**Then** it uses `loading="eager"` (above the fold, critical to first paint)
**And** alt text follows the convention: `"[Ship name], photographed by Howard Hertzog"` (shorter form for homepage)

**Given** a blur-up loading pattern,
**When** the image is loading,
**Then** the same blur-up placeholder pattern from ShipHero is applied
**And** reduced motion disables the transition

---

### Story 5.2: Implement FleetGrid Component

As a site visitor,
I want to see all 21 ships as a browsable thumbnail grid,
So that I can find and click into any ship without losing the overview.

**Acceptance Criteria:**

**Given** `FleetGrid` renders,
**When** the component is inspected,
**Then** it calls `ShipDataService.getAll()` and renders all 21 ships as grid cells
**And** each cell contains a `<picture>` thumbnail (WebP + JPEG fallback, `loading="lazy"`) with a 4:3 aspect ratio
**And** each cell overlays the ship name on the thumbnail
**And** each cell wraps in a `routerLink` to `/#/ships/{slug}`

**Given** a desktop viewport (≥1024px),
**When** FleetGrid renders,
**Then** it displays a 3-column grid

**Given** a tablet viewport (768–1023px),
**When** FleetGrid renders,
**Then** it displays a 2-column grid

**Given** a mobile viewport (<768px),
**When** FleetGrid renders,
**Then** it displays a 1-column layout

**Given** a desktop user hovers over a thumbnail,
**When** the hover state is active,
**Then** `transform: scale(1.02)` is applied with `transition: transform 200ms ease`

**Given** `@media (prefers-reduced-motion: reduce)` is active,
**When** the user hovers,
**Then** no scale transform is applied

**Given** each thumbnail,
**When** its alt text is inspected,
**Then** it reads `"[Ship name] — thumbnail"` per EXPERIENCE.md convention

**Given** the fleet grid thumbnails,
**When** keyboard Tab navigation is used,
**Then** all 21 ship links are reachable and each has a visible focus ring

---

### Story 5.3: Implement HomeComponent Feature Page

As a site visitor,
I want a homepage that opens with a hero photograph, an identifying intro paragraph, and the full fleet grid,
So that I immediately understand who Howard was, where he photographed, and when — then can browse the fleet.

**Acceptance Criteria:**

**Given** the user navigates to `/#/`,
**When** HomeComponent renders,
**Then** it composes: `HomepageHero` → intro text block → `FleetGrid` — in that DOM order

**Given** the intro text block,
**When** it is inspected,
**Then** it includes all three elements required by FR-9: Howard Hertzog as photographer, San Francisco Bay as location, and c. 1944–1946 as the date range — explicitly stated above the fold

**Given** a mobile viewport (320px wide),
**When** the homepage renders,
**Then** no horizontal scroll occurs
**And** the fleet grid is visible within one viewport scroll below the hero

**Given** the semantic HTML,
**When** the homepage HTML is inspected,
**Then** `<h1>` is used for the site title (once, on the homepage)
**And** `<main>` wraps the page content

**Given** the visual tone (FR-11),
**When** the homepage is viewed,
**Then** it has a dark, memorial, atmospheric appearance consistent with the olive drab / khaki / steel grey token palette — not a product landing page

---

## Epic 6: Supporting Pages

**Epic Goal:** Build the `AboutComponent` (coming-soon) and `NotFoundComponent` so every navigation slot and unresolved route resolves gracefully with no 404s — a hard launch requirement.

---

### Story 6.1: Implement AboutComponent (Coming Soon)

As a site visitor who clicks "About Howard",
I want a graceful coming-soon page that confirms the site is intentional and complete,
So that I don't see a broken link or a 404 when the About content isn't ready yet.

**Acceptance Criteria:**

**Given** the user navigates to `/#/about`,
**When** AboutComponent renders,
**Then** `ComingSoon` is rendered with the heading and body copy appropriate for the About Howard section
**And** PersistentNav is intact and "About Howard" has the active state
**And** the browser tab title reads "About Howard — Howard Hertzog WWII Photography"

**Given** ComingSoon component renders,
**When** it is inspected,
**Then** it uses a full-page dark surface (`var(--color-bg)`)
**And** centered heading in Roboto Slab at headline-lg weight
**And** body copy: "The story of Howard Hertzog — coming soon."
**And** no broken state, no placeholder images, no lorem ipsum

**Given** the microcopy convention (EXPERIENCE.md Voice & Tone),
**When** the body copy is inspected,
**Then** it reads "Coming soon." — no emoji, no "🚧 Coming soon!", no "Page under construction"

---

### Story 6.2: Implement NotFoundComponent

As a site visitor who navigates to an unknown route,
I want a clear not-found page that brings me back to the fleet,
So that I am never stranded with a browser 404 error or a blank page.

**Acceptance Criteria:**

**Given** the user navigates to any unresolved route (e.g., `/#/foo`),
**When** the Angular router resolves it,
**Then** the user is redirected to `/#/not-found` and `NotFoundComponent` renders

**Given** `NotFoundComponent` renders,
**When** it is inspected,
**Then** it uses the same `ComingSoon` visual treatment (full-page dark surface)
**And** heading text reads "Page not found." (using `<h2>`, not `<h1>`)
**And** a "Back to fleet" link navigates to `/#/` via Angular `routerLink`
**And** PersistentNav is intact

**Given** the page renders on any unresolved hash route,
**When** it is viewed on a Bluehost server,
**Then** the server never serves a 404 HTTP status — the Angular router handles all routing from `index.html`

---

## Epic 7: Responsive Design & Accessibility

**Epic Goal:** Verify and complete the responsive layout implementation across all three breakpoints and implement the full accessibility floor — semantic HTML, WCAG AA focus rings, keyboard navigation, screen reader title announcements, touch targets, and reduced motion support — across the entire site.

---

### Story 7.1: Implement Responsive Layouts Across All Breakpoints

As a site visitor on any device,
I want the site to display correctly without horizontal scroll from 320px up through desktop,
So that the site works for family members on phones and history readers on laptops equally well.

**Acceptance Criteria:**

**Given** a mobile viewport (320–767px),
**When** every page is rendered,
**Then** no horizontal scroll occurs at any point
**And** FleetGrid shows 1 column
**And** DossierCard fields stack vertically
**And** ShipNav has "Back to fleet" on its own centered row between Prev and Next
**And** PersistentNav shows site title left, Fleet + About right with no hamburger

**Given** a tablet viewport (768–1023px),
**When** every page is rendered,
**Then** FleetGrid shows 2 columns
**And** DossierCard fields show in 3-column horizontal layout
**And** ShipNav shows all 3 elements on one line

**Given** a desktop viewport (≥1024px),
**When** every page is rendered,
**Then** FleetGrid shows 3 columns
**And** content columns center at 880px max-width
**And** all responsive layouts are handled in CSS only — no separate desktop Angular components

**Given** the `display-hero` typography token,
**When** it is applied on any viewport,
**Then** it uses `clamp(2rem, 6vw, 3.5rem)` for fluid scaling (the only fluid type size)

---

### Story 7.2: Implement Accessibility Floor

As a site visitor using assistive technology or keyboard navigation,
I want the site to meet WCAG AA standards and be fully keyboard-navigable,
So that the site is accessible to all readers, including Howard's family members with accessibility needs.

**Acceptance Criteria:**

**Given** every `<img>` on the site,
**When** alt text is inspected,
**Then** ship hero images use: `"[Ship name], photographed by Howard Hertzog, San Francisco Bay, c. 1944–1946"`
**And** fleet thumbnails use: `"[Ship name] — thumbnail"`
**And** homepage hero uses: `"[Ship name], photographed by Howard Hertzog"`
**And** no image has an empty `alt` attribute (except intentionally decorative images, which have `alt=""`)

**Given** the semantic HTML requirement,
**When** any page is inspected,
**Then** `<header>` wraps PersistentNav, `<main>` wraps page content, `<article>` wraps ship page content, `<figure>` + `<figcaption>` wrap ShipHero + AttributionCaption, `<nav>` wraps ShipNav, and heading hierarchy (`<h1>` → `<h2>`) is enforced with no skipped levels

**Given** every interactive element (links, buttons),
**When** it receives focus via keyboard Tab,
**Then** it shows a visible focus ring: `outline: 2px solid var(--color-olive); outline-offset: 3px`
**And** `outline: none` is never applied without a custom focus replacement

**Given** the touch target requirement,
**When** any interactive element's tap area is measured,
**Then** it is at least 44×44px (ShipNav Prev/Next, fleet thumbnails, nav links)

**Given** every CSS transition and transform animation in the codebase,
**When** `@media (prefers-reduced-motion: reduce)` is active,
**Then** all `transition` and `transform` animations are disabled
**And** images appear without blur-up transition
**And** hover scale on fleet thumbnails does not occur

**Given** Angular route navigation,
**When** the user navigates to a new route,
**Then** the `<title>` element updates to the correct route title, which screen readers announce

**Given** the color contrast requirement (WCAG AA),
**When** any text-over-background combination in the site is evaluated against the design tokens,
**Then** all text meets the 4.5:1 contrast ratio (normal text) or 3:1 (large text) minimum
**And** no inline styles override token colors in a way that breaks contrast

---

## Epic 8: Ship Content Research & Data Population

**Epic Goal:** Research and write historically grounded dossier data, "Where was it going" narratives, source citations, and alt text for all 21 ships — populating `ships.ts` completely so every ship page passes the Witness Document Trio integrity check and no "Content pending" placeholders remain.

---

### Story 8.1: Research and Populate Data for Ships 1–7

As Howard's family and the site's readers,
I want the first 7 ships to have accurate dossier data, a compelling narrative, and source citations,
So that those ship pages deliver the full Witness Document Trio experience.

**Ships covered:** Burton Island (AG-88), DMS Doran, General Hersey, General H.W. Butler, LSM-276, Tug 181, USS Allen M. Sumner

**Acceptance Criteria:**

**Given** `ships.ts` is updated for ships 1–7,
**When** each entry is inspected,
**Then** each ship has all fields populated with non-placeholder values:
- `vesselClass` — confirmed vessel class (e.g., "Wind-class icebreaker")
- `commissioned` — human-readable commissioning date (e.g., "27 December 1946")
- `fate` — fate with date and manner where known (e.g., "Decommissioned 14 August 1966, sold for scrap")
- `narrative` — array of 2–4 paragraph strings placing the ship in its WWII operational context (theatre, mission type, route or assignment from San Francisco Bay, historical significance)
- `sources` — at least one primary or secondary historical source citation per ship (e.g., "NavSource Online, DANFS — Dictionary of American Naval Fighting Ships")
- `altText` — `"[Ship name], photographed by Howard Hertzog, San Francisco Bay, c. 1944–1946"`

**Given** the historical-source caveat is required (FR-5, FR-23),
**When** NarrativeSection renders for these ships,
**Then** the caveat text is visible on the page and consistent with the finalized wording from Story 8.4

**Given** the Witness Document Trio integrity check (FR-6),
**When** WitnessTrioBlock renders for each of these 7 ships,
**Then** no "Content pending" placeholder appears — all three trio members render with real content

---

### Story 8.2: Research and Populate Data for Ships 8–14

As Howard's family and the site's readers,
I want ships 8–14 to have accurate dossier data, compelling narratives, and source citations.

**Ships covered:** USS Atlanta, USS Benham, USS Caiman, USS Chipola, USS Columbus, USS Haven, USS Keppler

**Acceptance Criteria:**

**Given** `ships.ts` is updated for ships 8–14,
**When** each entry is inspected,
**Then** each ship has all fields populated with non-placeholder values (same criteria as Story 8.1)
**And** USS Keppler uses slug `uss-keppler` (no trailing dash) and the image assets are at `src/assets/images/hero/uss-keppler.webp` etc.

**Given** the Witness Document Trio integrity check,
**When** WitnessTrioBlock renders for each of these 7 ships,
**Then** no "Content pending" placeholder appears

---

### Story 8.3: Research and Populate Data for Ships 15–21

As Howard's family and the site's readers,
I want ships 15–21 to have accurate dossier data, compelling narratives, and source citations.

**Ships covered:** USS Massachusetts, USS Oklahoma City, USS Rockwall, USS Rodgers, USS Theodore E. Chandler, USS Valley Forge, USS Vicksburg

**Acceptance Criteria:**

**Given** `ships.ts` is updated for ships 15–21,
**When** each entry is inspected,
**Then** each ship has all fields populated with non-placeholder values (same criteria as Story 8.1)
**And** USS Massachusetts uses slug `uss-massachusettes` (matching the image filename) but `name` field shows "USS Massachusetts" (correct spelling)

**Given** the homepage hero designation,
**When** `ships.ts` is inspected,
**Then** exactly one ship has `isHomepageHero: true`
**And** all other ships have `isHomepageHero` as `undefined` (not `false`)

**Given** the Witness Document Trio integrity check,
**When** WitnessTrioBlock renders for each of these 7 ships,
**Then** no "Content pending" placeholder appears

---

### Story 8.4: Finalize Historical Caveat Wording and Verify All 21 Citations

As a site visitor reading historical content,
I want a consistent, honest source caveat on every ship page and at least one confirmed citation per ship,
So that I trust the content enough to share the site without embarrassment about source quality.

**Acceptance Criteria:**

**Given** the caveat wording is finalized,
**When** any ship page's NarrativeSection is inspected,
**Then** the caveat reads consistently — e.g., "Historical details sourced from [Source Name]. Accuracy not guaranteed." — with the actual source name substituted per ship, not a generic placeholder

**Given** all 21 ships in `ships.ts`,
**When** the `sources` array is inspected for each ship,
**Then** every ship has at least one citation string (not empty, not `['[Content pending]']`)

**Given** the full set of 21 ship pages renders,
**When** each page is loaded in a browser,
**Then** zero "Content pending" placeholders appear anywhere on the site
**And** every page passes the Witness Document Trio integrity check

---

## Epic 9: Build, Smoke Test & Deployment

**Epic Goal:** Configure `ng build` for production with the correct `base-href`, run a pre-deployment smoke test covering all routes and the no-broken-links requirement, and FTP-deploy the `dist/epic-ww2/browser/` contents to Bluehost `public_html/` so the site is live at www.ww2epic.com.

---

### Story 9.1: Configure ng build for Production Deployment

As a developer,
I want `ng build` configured to produce a `dist/epic-ww2/browser/` output ready for Bluehost FTP upload,
So that deployment is a simple `ng build` + FTP without any server-side configuration.

**Acceptance Criteria:**

**Given** `angular.json` is configured,
**When** `ng build` is run,
**Then** it succeeds with no errors
**And** output is written to `dist/epic-ww2/browser/`
**And** `index.html` exists at the root of that output directory

**Given** `ng build --base-href /` is run,
**When** the built `index.html` is inspected,
**Then** `<base href="/">` is set correctly for root-domain deployment at www.ww2epic.com

**Given** HashLocationStrategy is in use,
**When** any built asset path in `index.html` or component templates is inspected,
**Then** all asset paths are root-relative (e.g., `assets/images/hero/uss-valley-forge.webp`) and resolve correctly when served from Bluehost `public_html/`

**Given** the production build,
**When** Angular's build optimizer runs,
**Then** lazy loading is applied where applicable and the initial bundle size is reasonable for a 4G connection

**Given** `package.json`,
**When** the scripts section is inspected,
**Then** a `"build:prod": "ng build --base-href /"` script entry exists for reproducible production builds

---

### Story 9.2: Pre-Deployment Smoke Test

As a developer and product owner,
I want a complete smoke test of the built site before FTP upload,
So that no broken links, missing images, or failed routes reach the live domain.

**Acceptance Criteria:**

**Given** `ng serve` or a local static server serving `dist/epic-ww2/browser/`,
**When** each of the following routes is navigated to,
**Then** it renders without errors and without "Content pending" text:
- `/#/` — Homepage with HomepageHero + intro text + FleetGrid (21 ships)
- `/#/about` — ComingSoon page, "About Howard — Howard Hertzog WWII Photography" in tab
- `/#/not-found` — NotFound page with back-to-fleet link
- `/#/ships/uss-valley-forge` — full ship page with Witness Document Trio
- At least 3 additional ship pages across the roster

**Given** all 21 fleet grid thumbnails on the homepage,
**When** each is clicked,
**Then** it navigates to the correct `/#/ships/:slug` route and the ship page renders

**Given** the ShipNav on any ship page,
**When** Prev and Next are clicked through the full fleet,
**Then** all 21 ships are navigable and the circular wrap (ship 1 ↔ ship 21) works

**Given** the no-broken-links requirement (FR-15),
**When** all nav links in PersistentNav are clicked,
**Then** no 404 errors occur — all routes resolve

**Given** the mobile viewport (375px wide),
**When** all pages are rendered,
**Then** no horizontal scroll occurs on any page

**Given** the homepage hero image and all ship hero images,
**When** they are loaded in the browser,
**Then** all images load successfully (no broken image icons)

---

### Story 9.3: FTP Deploy to Bluehost and Verify Live Site

As the site owner,
I want the built site deployed to www.ww2epic.com via FTP,
So that Howard's photographs and their stories are publicly accessible.

**Acceptance Criteria:**

**Given** `ng build --base-href /` has completed successfully,
**When** the contents of `dist/epic-ww2/browser/` are FTP-uploaded to Bluehost `public_html/`,
**Then** `index.html` lands at `public_html/index.html` (not inside a subdirectory)

**Given** the live site at www.ww2epic.com,
**When** the homepage is loaded in a browser,
**Then** it renders with the correct hero photograph, intro text, and fleet grid

**Given** the HashLocationStrategy,
**When** a direct link to `www.ww2epic.com/#/ships/uss-valley-forge` is opened,
**Then** the ship page renders correctly (the `#` route is handled by the browser, not the server)

**Given** the live site,
**When** `/#/about` and `/#/not-found` are navigated to,
**Then** both resolve without a server 404 — HashLocationStrategy ensures only `index.html` is requested from Bluehost

**Given** the deployment is complete,
**When** the site is verified live,
**Then** the completion criteria from PRD §5 are met:
- All 21 ship pages live with complete Witness Document Trio
- No broken links
- Site renders without horizontal scroll on 320px–428px viewports
- Howard credited on every ship page
