---
title: Howard Hertzog WWII Ship Photography Website
status: final
created: 2026-07-29
updated: 2026-07-29
---

# PRD: Howard Hertzog WWII Ship Photography Website

## 0. Document Purpose

This PRD defines requirements for a public-facing static website presenting 21 WWII-era ship photographs taken by Howard Hertzog from San Francisco Bay (c. 1944–1946). It is written for the builder as PM, downstream architecture, and story creation. All requirements derive from the brainstorming session of 2026-07-29 (`docs/brainstorming/brainstorm-ww2-ship-photo-website-2026-07-29/brainstorm-intent.md`).

**Glossary:**
- *Witness Document Trio* — the atomic unit of every ship page: the fate dossier card (FR-3), Howard attribution caption (FR-2), and "Where was it going" narrative (FR-4). All three must appear together; removing any one degrades the page from story to reference entry.
- *Fleet index* — the browsable list of all 21 ships, accessible from every page.
- *Coming-soon page* — a placeholder page for navigation slots whose content is deferred; never a broken link.

---

## 1. Vision

Howard Hertzog stood at the edge of San Francisco Bay between 1944 and 1946 and photographed ships heading to war. Each photograph is a primary document — a specific person at a specific moment, capturing a vessel whose fate was not yet written. This site gives each of those 21 ships its own page, pairs Howard's photograph with its historical context, and makes that context feel earned rather than supplied.

The site is built for general public and family history readers who come for a photograph and stay for a story. It is extensible by design: adding an "About Howard" page, a second photograph series, or a new section should feel like it was always planned — not like reconstructive surgery on an existing structure.

---

## 2. Target User

### 2.1 Jobs To Be Done

- **Discover and feel** — encounter a specific ship photograph and understand what it meant in 1944, not just what the ship was called
- **Honor the photographer** — experience Howard Hertzog's work treated as authorial and historically significant, not as anonymous archive material
- **Learn and share** — find the historical context credible and shareable (able to link to a ship page without embarrassment about source quality)
- **Browse the fleet** — move through all 21 ships without losing their place or fighting the browser back button

### 2.2 Key User Journeys

**UJ-1. A family member shares a ship page link.**
Sarah, Howard's granddaughter, shares a link to a specific ship page on social media. A friend clicks it on mobile. They land on the full-width hero photograph, read the dossier card (vessel class, commissioned date, fate), read the "Where was it going" narrative, and see Howard's attribution caption. They tap the fleet index link and browse two more ships before closing the tab. At no point do they encounter a broken link or a page that loads slowly enough to abandon.

**UJ-2. Robert browses the fleet and bookmarks for later.**
Robert, a retired high school history teacher with a long interest in Pacific theater naval history, finds the site via search. They land on the homepage, read the opening paragraph establishing Howard + San Francisco Bay + 1944–1946, and click into the fleet overview. They navigate three ship pages using Prev/Next, bookmark the site, and notice "About Howard — coming soon" in the nav. The coming-soon page loads rather than 404ing.

---

## 3. Features & Requirements

### 3.1 Ship Page (Core Product Unit)

All 21 ships are rendered from a single Angular component template. A ship page is not considered complete unless all six FRs in this section are satisfied — FR-6 in particular is the gate.

- **FR-1** Full-width hero photograph of the ship (Howard Hertzog's photograph)
- **FR-2** Howard attribution caption displayed on or immediately beneath the hero photo; present on every ship page without exception
- **FR-3** Dossier card containing: vessel class, commissioned date, fate (e.g., decommissioned / sunk / scrapped / survived)
- **FR-4** "Where was it going" narrative — 2–4 paragraphs of contextual framing placing the ship in its WWII operational moment (theatre, mission type, approximate route or assignment from San Francisco Bay, historical significance); researched and written per ship (see §3.5)
- **FR-5** Sourced history summary with an explicit historical-source caveat displayed on the page (e.g., *"Historical details sourced from [source]; accuracy not guaranteed"*)
- **FR-6** **Witness Document Trio integrity:** FR-3 (fate line / dossier), FR-2 (attribution caption), and FR-4 (narrative) must co-appear on every ship page. No ship page ships without all three present and non-empty.
- **FR-7** Prev / Next ship navigation on every ship page (cycles through the 21-ship fleet in the order defined by the ship data file — see §3.5 roster table)
- **FR-8** "Back to fleet" link on every ship page

### 3.2 Homepage

- **FR-9** Opening paragraph — above the fold — identifies: Howard Hertzog as photographer, San Francisco Bay as location, and c. 1944–1946 as the era; date range explicitly stated
- **FR-10** Fleet overview entry point (grid or list of all 21 ships with photograph thumbnails) visible above the fold or within one viewport scroll
- **FR-11** Dark, album-like visual treatment (consistent with §3.4); homepage tone is memorial and atmospheric, not a product landing page (UX spec is the acceptance authority for this FR)

### 3.3 Navigation & Site Structure

- **FR-12** Persistent fleet index accessible from every page (nav link or dedicated sidebar element)
- **FR-13** Navigation scaffold includes named placeholder slots for future sections beyond the 21 ships (e.g., future photo series, additional historical content)
- **FR-14** "About Howard" navigation slot present at launch; links to a coming-soon placeholder page
- **FR-15** Coming-soon placeholder pages used for any linked-to content not ready at launch — no broken links, no 404s at launch

### 3.4 Visual Design System

Visual direction is a constraint from brainstorming, not a decision to be revisited. The downstream UX spec will specify layout; these are the non-negotiable signals this PRD locks in:

- **FR-16** Color palette: olive drab, khaki, steel grey — no bright consumer palette
- **FR-17** Typeface: slab serif or condensed grotesque — no rounded sans
- **FR-18** Texture / grain applied to UI surfaces to suggest materiality and the photographic era
- **FR-19** Single Angular component template used for all 21 ship pages — visual consistency is enforced by the template, not by manual per-page styling

### 3.5 Content Production (Historical Research & Writing)

Content production for all 21 ships is in scope. A ship page cannot be considered complete until all four FRs in this section are satisfied for that ship.

- **FR-20** Dossier data researched and confirmed per ship: vessel class, commissioned date, fate (with date and manner where known)
- **FR-21** "Where was it going" narrative written per ship (satisfies FR-4): 2–4 paragraphs placing the vessel in its WWII operational context — theatre, mission type, route or assignment from San Francisco Bay, historical significance
- **FR-22** At least one primary or secondary historical source identified and cited per ship to support the dossier data and narrative
- **FR-23** Historical-source caveat text finalized; wording consistent across all 21 pages

**Confirmed ship roster (21 ships)** — derived from image filenames in `./images/`:

| # | Ship | Source filename |
|---|---|---|
| 1 | Burton Island (AG-88) | `burton-island-ag-88.jpg` |
| 2 | DMS Doran | `dms-doran.jpg` |
| 3 | General Hersey | `general-hersey.jpg` |
| 4 | General H.W. Butler | `general-hw-butler.jpg` |
| 5 | LSM-276 | `lsm-276.jpg` |
| 6 | Tug 181 | `tug-181.jpg` |
| 7 | USS Allen M. Sumner | `uss-allen-m-sumner.jpg` |
| 8 | USS Atlanta | `uss-atlanta.jpg` |
| 9 | USS Benham | `uss-benham.jpg` |
| 10 | USS Caiman | `uss-caiman.jpg` |
| 11 | USS Chipola | `uss-chipola.jpg` |
| 12 | USS Columbus | `uss-columbus.jpg` |
| 13 | USS Haven | `uss-haven.jpg` |
| 14 | USS Keppler | `uss-keppler-.jpg` |
| 15 | USS Massachusetts | `uss-massachusettes.jpg` |
| 16 | USS Oklahoma City | `uss-oklahoma-city.jpg` |
| 17 | USS Rockwall | `uss-rockwall.jpg` |
| 18 | USS Rodgers | `uss-rodgers.jpg` |
| 19 | USS Theodore E. Chandler | `uss-theodore-e-chandler.jpg` |
| 20 | USS Valley Forge | `uss-valley-forge.jpg` |
| 21 | USS Vicksburg | `uss-vicksburg.jpg` |

*Note: two filename anomalies to correct during image management — trailing dash in `uss-keppler-.jpg`, and `massachusettes` misspelling in `uss-massachusettes.jpg`. Ship identities are unambiguous; file renames are a housekeeping task.*

### 3.6 Image Management

- **FR-24** One hero photograph per ship sourced from Howard Hertzog's original collection (21 photographs total)
- **FR-25** Images optimized for web delivery: compressed to ≤200 KB per image at full-width display resolution; WebP format preferred with JPEG fallback for browser compatibility
- **FR-26** All images include descriptive alt text (ship name + minimal context) for screen reader accessibility

**Confirmed:** All 21 Howard photographs are present in `./images/` as JPEG files. Family ownership assumed; cleared for web publication. Current resolution to be assessed during image management — optimization to ≤200 KB WebP (FR-25) applied as part of the image sprint.

### 3.7 Technical Platform

- **FR-27** Built with Angular (current stable release at time of development); no server-side runtime required
- **FR-28** Angular routing configured with **HashLocationStrategy** (`/#/ships/vessel-slug`) so all routes resolve correctly on the Bluehost Apache server without `.htaccess` rewrite rules
- **FR-29** `ng build` produces a self-contained `dist/` folder; deployment is FTP upload of `dist/` contents to Bluehost — no CI/CD pipeline required at launch
- **FR-32** Site hosted at **www.ww2epic.com** (Bluehost); `base-href` in `ng build` set to `/` for root-domain deployment
- **FR-30** Ship data (vessel name, class, dates, fate, narrative copy, image path) stored in structured TypeScript data files or JSON — not hard-coded into component templates — enabling single-template rendering across all 21 ships
- **FR-31** Mobile-first responsive layout; no horizontal scroll on viewports ≥320px wide

---

## 4. Non-Functional Requirements

- **NFR-1 Performance:** Pages render meaningful content within 3 seconds on a 4G mobile connection. Image optimization (FR-25) is the primary lever; Angular bundle size is secondary.
- **NFR-2 Accessibility:** All images have alt text (FR-26). Text over dark or textured backgrounds meets WCAG AA contrast minimum. Keyboard navigation works on all interactive elements.
- **NFR-3 Extensibility:** Adding a new ship page requires only: adding a data entry to the ship data file, dropping an optimized image into the assets folder, and adding a nav entry. No structural Angular changes required. Adding a new top-level section (e.g., "About Howard") requires only generating a new Angular route and component — no template changes to existing ship pages.
- **NFR-4 Hosting compatibility:** The built `dist/` folder deploys to any standard FTP-capable web host with no server-side configuration beyond uploading files.

---

## 5. Success Metrics

This is a personal/family project; success is qualitative and completion-based:

| Metric | Definition of Done |
|---|---|
| Fleet completeness | All 21 ship pages live with complete Witness Document Trio (FR-6) |
| Content completeness | Historical content researched, written, and cited for all 21 ships (FR-20–22) |
| Mobile quality | Site renders without horizontal scroll on 320px–428px viewports |
| Navigation integrity | No broken links at launch; all nav slots resolve (FR-15) |
| Attribution coverage | Howard credited on every ship page (FR-2) |

**Counter-metric:** A ship page that goes live without FR-4 or FR-6 complete is a stub, not a shipped page. Partial fleet launches count against fleet completeness.

---

## 6. Open Questions

All three original open questions are resolved:

- **OQ-1 ✅ Resolved** — 21 ships confirmed; roster derived from image filenames in `./images/` (see §3.5 table)
- **OQ-2 ✅ Resolved** — All 21 photographs present in `./images/` as JPEGs; family-owned and cleared for publication
- **OQ-3 ✅ Resolved** — Hosting: Bluehost via FTP; domain: **www.ww2epic.com**

No blocking open questions remain. PRD is ready for architecture and sprint planning.

---

## 7. Out of Scope (v1)

| Item | Disposition |
|---|---|
| "About Howard" page content | Nav slot required at launch; page content deferred to v2 |
| Search or filter across fleet index | Could — not needed at 21 ships |
| Interactive map (Bay area / Pacific route) | Could — high effort, low immediate value |
| User comments or guestbook | Won't — out of scope for a static site with family-history tone |
| Digitization / scanning workflow documentation | Out of scope for this site |
| CMS or server-side backend | Won't — static site is a hard constraint |
| Analytics integration | [ASSUMPTION] Not in scope unless stated; can be added as a script tag post-launch without PRD changes |
