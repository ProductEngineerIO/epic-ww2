---
name: Howard Hertzog WWII Ship Photography
status: final
sources:
  - docs/planning-artifacts/prds/prd-epic-ww2-2026-07-29/prd.md
  - docs/planning-artifacts/ux-designs/ux-epic-ww2-2026-07-29/DESIGN.md
created: 2026-07-29
updated: 2026-07-29
---

# Howard Hertzog WWII Ship Photography — Experience Spine

> Public-facing memorial static site. Angular SPA, HashLocationStrategy, FTP-deployed to www.ww2epic.com. Mobile-first. `DESIGN.md` is the visual identity reference; this spine owns how it works. Spines win on conflict with any mock, wireframe, or later implementation decision.

## Foundation

**Form factor:** Web — mobile-first responsive. Primary surfaces: mobile 320–767px, tablet 768–1023px, desktop 1024px+. No native app. No PWA in v1.

**UI system:** None. Bespoke design; all visual identity lives in `DESIGN.md`. Angular Material is not used — no inherited component library.

**Platform notes:** Angular SPA with `HashLocationStrategy`. All URLs use the `/#/path` pattern. The Angular `dist/` output is FTP-deployed to Bluehost at `www.ww2epic.com`; no server-side routing configuration required or assumed.

## Information Architecture

| Surface | Route | Purpose | Entry points |
|---|---|---|---|
| Homepage | `/#/` | Album-cover hero + site intro + fleet grid (21 ships) | Direct URL, nav "Fleet" link, any "Back to fleet" link |
| Ship Page | `/#/ships/:slug` | Individual ship — full Witness Document Trio | Fleet grid thumbnail, Prev/Next, direct URL |
| About | `/#/about` | Coming-soon placeholder | Nav "About Howard" link |
| Not Found | `/#/not-found` | 404 fallback | Any unresolved route |

**Route–slug mapping:** Each ship's slug is derived from its image filename, minus the extension (e.g., `uss-valley-forge`, `burton-island-ag-88`). Slug list is defined in the ship data file (`FR-30`). The 21 slugs and their display names live in one canonical data file; IA and routing derive from it.

**No separate fleet route.** The homepage (`/#/`) is the fleet index. The PersistentNav "Fleet" link scrolls to or navigates to `/#/` — no additional route.

**No nested routes in v1.** Every surface is a flat route; no child router outlets.

→ Mockup references: `mockups/homepage.html`, `mockups/ship-page.html`. Spine wins on conflict.

## Voice and Tone

Microcopy discipline. Brand voice and aesthetic posture live in `DESIGN.md.Brand & Style`.

| Do | Don't |
|---|---|
| "Photographed by Howard Hertzog, San Francisco Bay, c. 1944–1946" | "Photo credit: Howard Hertzog" or "© Howard Hertzog" |
| "USS Valley Forge" / "Burton Island (AG-88)" — full designation | "The Valley Forge" or shortened informal names |
| "Historical details sourced from [Source Name]. Accuracy not guaranteed." | "We can't guarantee accuracy" or no caveat at all |
| "Coming soon." | "Page under construction" or "🚧 Coming soon!" |
| Fate line as a statement of fact: "Decommissioned 12 August 1946." | Fate as a narrative flourish: "She met her end in…" |
| Ship names always capitalized and formatted with their designation | Inconsistent capitalization or informal forms |

Navigation labels follow the same register:

| Label | Use |
|---|---|
| Fleet | PersistentNav link to `/#/` |
| About Howard | PersistentNav link to `/#/about` |
| ← Previous ship / Next ship → | ShipNav |
| ↑ Back to fleet | ShipNav |

Arrow characters (← → ↑) are used as decorative glyphs, not icon components.

## Component Patterns

Behavioral. Visual specs — colors, typography, spacing, border treatments — live in `DESIGN.md.Components`.

| Component | Responsibility | Key behavioral rules |
|---|---|---|
| `PersistentNav` | Site title + Fleet + About Howard links; sticky top | Stays visible on scroll at all breakpoints. Active link (current route) gets `{colors.primary}` color. Mobile: site title left, Fleet + About right (no hamburger — two links fit). |
| `ShipHero` | Full-bleed hero photo for a ship page | `object-fit: cover`, full viewport width, height capped (see DESIGN.md). Ship name overlay bottom-left over gradient. Lazy-loads with blur-up placeholder. |
| `AttributionCaption` | "Photographed by Howard Hertzog…" below or overlaid on hero | Present on every ship page without exception. Never omitted. Placed directly after `ShipHero` in DOM order for screen readers. |
| `DossierCard` | Three-field card: vessel class / commissioned / fate | Three fields always present; if a value is unknown, display "Not confirmed" — never leave a field blank. Left olive-drab border is the visual anchor of the Witness Document Trio. |
| `NarrativeSection` | "Where was it going" body text + historical caveat | Lora body-lg, max-width 660px, centered. Caveat displayed as italic caption at base of section, always. |
| `WitnessTrioBlock` | Atomic container: `DossierCard` + `AttributionCaption` + `NarrativeSection` | **Never render partial.** Angular guards: if any of the three fields (dossierData, attribution, narrative) is absent in the data file, the component logs a warning and renders a visible "Content pending" placeholder rather than a partial trio. |
| `ShipNav` | Prev / Next ship + Back to fleet | Positioned after `WitnessTrioBlock`. Circular: ship 1 Prev → ship 21; ship 21 Next → ship 1. Keyboard: ← → arrow keys trigger on ship page (document-level listener). |
| `FleetGrid` | 21-ship thumbnail grid on homepage | Each cell: photograph thumbnail (4:3 aspect ratio), ship name overlay. Tap/click → `/#/ships/:slug`. Thumbnails are optimized WebP images (separate from hero-resolution assets if needed). |
| `HomepageHero` | Single dominant photograph for the homepage opening | One photograph chosen as the album-cover opener — not a ship-page hero, a standalone editorial statement. Ship name not overlaid; intro text appears below it. `[ASSUMPTION]` One photograph from the 21 is designated as the homepage hero in the data file via an `isHomepageHero: true` flag. |
| `ComingSoon` | Placeholder for `/#/about` | Full-page dark surface. Centered heading: ship name-weight Roboto Slab. Body copy: "The story of Howard Hertzog — coming soon." PersistentNav intact. No broken state. |
| `NotFound` | `/#/not-found` fallback | Same treatment as ComingSoon; heading "Page not found." Link back to `/#/`. |

## State Patterns

| State | Surface | Treatment |
|---|---|---|
| Hero image loading | ShipHero, HomepageHero, FleetGrid thumbnails | Blur-up: low-quality placeholder image (10px wide, CSS `filter: blur(8px)`, scaled up) transitions to full image on `load` event. `transition: filter 400ms ease`. |
| Hero image error | ShipHero | Dark surface fill at hero height; text overlay "Image unavailable" in label-caps. Does not block WitnessTrioBlock rendering. |
| WitnessTrioBlock data incomplete | WitnessTrioBlock | Any missing field → visible "Content pending" block in place of the incomplete element. Never a broken partial. |
| DossierCard unknown value | DossierCard field | Display "Not confirmed" in `{colors.on-surface-muted}`. Never blank. |
| ShipNav first ship | ShipNav Previous | Previous renders and is tappable — wraps to ship 21 (circular). No disabled state. |
| ShipNav last ship | ShipNav Next | Next renders and is tappable — wraps to ship 1 (circular). No disabled state. |
| ComingSoon | About surface | Static. PersistentNav active state on "About Howard." |
| Route not found | Any unresolved `/#/…` | Angular router redirects to `/#/not-found`. NotFound component renders. |
| Reduced motion | All animated transitions | `@media (prefers-reduced-motion: reduce)` disables blur-up transition; images appear immediately. |

## Interaction Primitives

- **Primary action:** tap or click. No swipe gestures.
- **Fleet grid:** hover on desktop applies `transform: scale(1.02)` on thumbnail — subtly signals interactivity without animation theater. `transition: transform 200ms ease`. Disabled under `prefers-reduced-motion`.
- **ShipNav arrow keys:** document-level `keydown` listener on ship page routes only. `ArrowLeft` → Previous ship. `ArrowRight` → Next ship. No other keyboard shortcuts.
- **PersistentNav active state:** Angular `RouterLinkActive` applies `{colors.primary}` to the active route's nav link.
- **Scroll behavior:** page scrolls to top on each route change (`router.scrollPositionRestoration: 'top'` in Angular router config).
- **Focus ring:** visible on all interactive elements. Style: `outline: 2px solid {colors.primary}; outline-offset: 3px`. Never `outline: none` without a custom focus replacement.
- **No infinite scroll, no pagination** — the fleet grid shows all 21 ships on one page. 21 items does not require progressive loading.

**Banned interactions:**
- No autoplay media.
- No parallax scroll on the hero photograph.
- No entrance animations on page load.
- No toast notifications.
- No modals or lightboxes in v1.

## Accessibility Floor

Behavioral. Visual contrast ratios live in `DESIGN.md.Colors`.

- **Alt text:** Every `<img>` has a descriptive `alt` attribute. Ship hero: `"[Ship name], photographed by Howard Hertzog, San Francisco Bay, c. 1944–1946"`. Fleet thumbnail: `"[Ship name] — thumbnail"`. Homepage hero: `"[Designated hero ship name], photographed by Howard Hertzog"`.
- **Semantic HTML:** `<header>` for PersistentNav, `<main>` for page content, `<article>` for each ship page, `<figure>` + `<figcaption>` wrapping ShipHero + AttributionCaption, `<nav>` for ShipNav, `<h1>` for ship name on ship page, `<h1>` for site title on homepage, `<h2>` for section headings.
- **Heading hierarchy:** Each ship page has exactly one `<h1>` (ship name). Homepage `<h1>` is the site title. No `<h1>` on ComingSoon or NotFound — use `<h2>`.
- **Keyboard navigation:** Tab traverses PersistentNav links → FleetGrid thumbnails → WitnessTrioBlock links → ShipNav. All interactive elements reachable without a mouse.
- **Focus visibility:** `{colors.primary}` 2px outline, 3px offset — visible on dark backgrounds.
- **Touch targets:** Minimum 44×44px tap area on all interactive elements (ShipNav Prev/Next, fleet thumbnails, nav links).
- **Screen reader:** Angular route changes announce page title via `<title>` update. Each route sets `<title>` to `"[Ship Name] — Howard Hertzog WWII Photography"` (ship pages) or `"Fleet — Howard Hertzog WWII Photography"` (homepage).
- **Reduced motion:** All CSS transitions and `transform` animations wrapped in `@media (prefers-reduced-motion: no-preference)`.
- **Color contrast:** WCAG AA minimum enforced by DESIGN.md token selection. Implementation must not override token colors with inline styles.

## Key Flows

### Flow 1 — Sarah shares a ship page link (UJ-1)

*Sarah, Howard's granddaughter, shares a direct ship page URL via social media.*

1. Friend receives link; taps it on mobile.
2. Angular loads `index.html`; HashLocationStrategy resolves `/#/ships/uss-valley-forge`.
3. PersistentNav renders (sticky). Page scrolls to top.
4. `ShipHero` renders — full-bleed photograph fills viewport. Ship name overlays bottom-left in khaki Roboto Slab.
5. `AttributionCaption` appears immediately below: "Photographed by Howard Hertzog, San Francisco Bay, c. 1944–1946."
6. **Witness Document Trio block** follows:
   - `DossierCard`: Vessel Class / Commissioned / Fate — three fields, olive left border.
   - `NarrativeSection`: 2–4 paragraphs of "Where was it going" + historical caveat at base.
7. `ShipNav` at bottom: ← Previous ship | ↑ Back to fleet | Next ship →
8. Friend taps "↑ Back to fleet" — navigates to `/#/`.
9. Fleet grid loads — 21 thumbnails. Friend browses two more ships.
10. **Climax:** Friend has held a story, not just seen an image. Howard's name appeared four times without redundancy.

*Failure case:* Image fails to load → dark placeholder at hero height, "Image unavailable." WitnessTrioBlock renders normally — the story is not lost with the image.

### Flow 2 — Robert browses the fleet (UJ-2)

*Robert, retired history teacher, arrives via search.*

1. Robert lands on `/#/` (homepage).
2. `HomepageHero` — single dominant photograph, full viewport width.
3. Intro text block below: site title in Roboto Slab khaki, opening paragraph establishing Howard + San Francisco Bay + c. 1944–1946.
4. `FleetGrid` — 21 thumbnails in 3-column grid (desktop). Each thumbnail shows ship name.
5. Robert clicks USS Theodore E. Chandler thumbnail → `/#/ships/uss-theodore-e-chandler`.
6. Full ship page loads. Robert reads narrative, uses ← → arrow keys to navigate to adjacent ships.
7. He sees "About Howard" in nav — clicks it → `/#/about`.
8. ComingSoon: "The story of Howard Hertzog — coming soon." PersistentNav intact. No 404.
9. **Climax:** Robert bookmarks `/#/`. The site has demonstrated historical credibility (citations visible) and he trusts the source enough to share it.

## Responsive & Platform

| Breakpoint | Grid | Hero | Navigation |
|---|---|---|---|
| Mobile 320–767px | FleetGrid: 1-col | Full viewport width, `clamp(400px, 68vh, 680px)` height | PersistentNav: site title left, Fleet + About right (no collapse) |
| Tablet 768–1023px | FleetGrid: 2-col | Full viewport width | PersistentNav: same as mobile |
| Desktop 1024px+ | FleetGrid: 3-col | Full viewport width | PersistentNav: same; content columns center at 880px max |

**DossierCard responsive:** 3-column horizontal grid on tablet+, stacked single-column on mobile. Field labels remain label-caps above each value in both layouts.

**ShipNav responsive:** All three elements (Prev, Back to fleet, Next) on one line on tablet+. On mobile, "Back to fleet" centers on its own row between Prev and Next.

**Typography responsive:** Only `display-hero` uses `clamp()` for fluid scaling. All other type sizes are fixed; they are sized appropriately for mobile and scale acceptably to desktop without breakpoint adjustments.

**No separate desktop-only components.** The same Angular components render at all breakpoints; layout differences are handled in CSS only.
