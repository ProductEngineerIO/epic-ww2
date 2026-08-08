# Story 9.3: FTP Deploy to Bluehost and Verify Live Site

Status: ready-for-dev

## Story

As the site owner,
I want the built site deployed to www.ww2epic.com via FTP,
So that Howard's photographs and their stories are publicly accessible.

## Acceptance Criteria

1. Given `ng build --base-href /` has completed successfully, when the contents of `dist/epic-ww2/browser/` are FTP-uploaded to Bluehost `public_html/`, then `index.html` lands at `public_html/index.html` (not inside a subdirectory)
2. Given the live site at www.ww2epic.com, when the homepage is loaded in a browser, then it renders with the correct hero photograph (USS Valley Forge), intro text, and fleet grid of 21 ships
3. Given the HashLocationStrategy, when a direct URL `www.ww2epic.com/#/ships/uss-valley-forge` is opened in a browser, then the ship page renders correctly without a server 404 (the `#` fragment is resolved client-side, not by Bluehost)
4. Given the live site, when `www.ww2epic.com/#/about` and `www.ww2epic.com/#/not-found` are navigated to, then both resolve without a server 404 — HashLocationStrategy ensures only `index.html` is requested from Bluehost
5. Given the deployment is complete, when the site is verified live, then the PRD §5 completion criteria are met:
   - All 21 ship pages are live with complete Witness Document Trio (DossierCard + AttributionCaption + NarrativeSection) — zero `[Content pending]` or `[Source pending]` placeholders
   - No broken links — all PersistentNav links resolve; no 404s on any route
   - Site renders without horizontal scroll on 320px–428px viewports
   - Howard Hertzog is credited (AttributionCaption) on every ship page

## Tasks / Subtasks

- [ ] **Pre-flight: Verify all prerequisites are met before building or uploading**
  - [ ] Confirm Epic 8 (Stories 8.1–8.4) is complete: open `src/data/ships.ts` and verify zero `[Content pending]` or `[Source pending]` strings remain across all 21 ships
  - [ ] Confirm `"build:prod": "ng build --base-href /"` is present in `package.json` scripts (Story 9.1); if absent, add it now before proceeding
  - [ ] Confirm Story 9.2 smoke test has passed — every route rendered without errors on the local build
  - [ ] Confirm all 21 hero and thumb image pairs exist in `src/assets/images/hero/` and `src/assets/images/thumb/` (42 WebP + 42 JPEG = 84 files total); if any are missing, run `npm run optimize-images` first
- [ ] **Build: Produce the production artifact**
  - [ ] Run `npm run build:prod` from the project root
  - [ ] Verify the command exits with code 0 (no TypeScript or Angular compilation errors)
  - [ ] Verify `dist/epic-ww2/browser/index.html` exists
  - [ ] Open `dist/epic-ww2/browser/index.html` in a text editor and confirm `<base href="/">` is present in the `<head>`
  - [ ] Confirm `dist/epic-ww2/browser/assets/images/hero/` and `/thumb/` directories are present and populated
- [ ] **FTP Upload: Deploy to Bluehost `public_html/`**
  - [ ] Open FTP client (FileZilla recommended; see Dev Notes for connection settings)
  - [ ] Connect to Bluehost using FTP/SFTP credentials for www.ww2epic.com (retrieve from Bluehost cPanel → FTP Accounts)
  - [ ] Navigate to `public_html/` on the remote server
  - [ ] Select all contents inside `dist/epic-ww2/browser/` locally (do NOT drag the `browser/` folder — upload its contents)
  - [ ] Upload / overwrite all files to `public_html/`; confirm `public_html/index.html` exists after transfer (not `public_html/browser/index.html`)
  - [ ] Verify transfer completes with no errors in the FTP log
- [ ] **Live Verification: Confirm site at www.ww2epic.com**
  - [ ] Hard-refresh homepage (`www.ww2epic.com`) — USS Valley Forge hero photograph, intro paragraph, and fleet grid of 21 thumbnails render
  - [ ] Open `www.ww2epic.com/#/ships/uss-valley-forge` directly (paste URL into address bar) — ship page loads with full Witness Document Trio, no `[Content pending]` text
  - [ ] Open `www.ww2epic.com/#/about` directly — ComingSoon placeholder page renders, no server 404
  - [ ] Open `www.ww2epic.com/#/not-found` directly — NotFound page with "← Back to fleet" renders, no server 404
  - [ ] Click through at least 5 fleet grid thumbnails; confirm each navigates to the correct `/#/ships/:slug` route and renders without content placeholders
  - [ ] Use ShipNav Prev/Next on USS Vicksburg → confirm circular wrap to ship #1 (Burton Island AG-88)
  - [ ] Use ShipNav Prev/Next on Burton Island AG-88 → confirm circular wrap to ship #21 (USS Vicksburg)
  - [ ] Click all PersistentNav links — no 404s (Fleet, About Howard)
  - [ ] Check all hero images on at least 5 ship pages — no broken image icons
  - [ ] Open homepage on mobile (375px Chrome DevTools viewport) — no horizontal scroll
  - [ ] Open a ship page on mobile (375px) — no horizontal scroll; WitnessTrioBlock readable

## Dev Notes

### Current State

`src/data/ships.ts` currently has all 21 ships with `[Content pending]` placeholder values for every field (`vesselClass`, `commissioned`, `fate`, `narrative`, `sources`, `altText`). **Story 9.3 cannot complete its acceptance criteria until Epic 8 populates this data.** Do not proceed to the FTP upload step until `ships.ts` is fully populated.

`package.json` currently has `"build": "ng build"` only — no `--base-href /` argument, no `build:prod` script. Story 9.1 is responsible for adding `"build:prod": "ng build --base-href /"`. If Story 9.1 has not run, add the script entry before building.

All 21 hero and thumb images are already optimized and present in `src/assets/images/` — the image pipeline (`npm run optimize-images`) has already run successfully.

### Dependency Chain

This story cannot deliver its acceptance criteria until the following are done:

| Prerequisite | Status | What it provides |
|---|---|---|
| Epic 8 (8.1–8.4) | ⚠️ Not done — all `[Content pending]` | Real dossier data, narratives, sources, alt text |
| Story 9.1 | ⚠️ Not done — `build:prod` script missing | `ng build --base-href /` script + outputPath confirmed |
| Story 9.2 | Not verified | Smoke test clearance: all routes, FleetGrid, ShipNav, mobile |
| Image pipeline | ✓ Done | All 42 hero + 42 thumb images present |

### Why HashLocationStrategy Eliminates Server Configuration (AD-2 + AD-8)

Angular's `HashLocationStrategy` (configured in Story 1.2 via `withHashLocation()` in `app.config.ts`) prepends `#` to all route paths. When a user opens `www.ww2epic.com/#/ships/uss-valley-forge`, the browser requests only `index.html` from Bluehost — the `#/ships/uss-valley-forge` segment is a client-side fragment that never reaches the server. This means:

- **No `.htaccess` rewrite rules needed** — Bluehost serves only static files
- **Direct URL bookmarks work** — the `#` routes resolve from `index.html` without a server-side redirect
- **No Bluehost configuration changes required** — FTP + static file serving is sufficient

This is the combined intent of AD-2 and AD-8. If HashLocationStrategy were ever removed in favor of PathLocationStrategy, `.htaccess` rewrites would become mandatory.

### Architecture Compliance (AD-8)

AD-8 mandates precise upload targeting. The most common deployment mistake for this project is uploading the `browser/` folder as a child of `public_html/` rather than its contents:

| ❌ Wrong — DO NOT do this | ✓ Correct |
|---|---|
| `public_html/browser/index.html` | `public_html/index.html` |
| `public_html/browser/assets/...` | `public_html/assets/...` |
| `public_html/browser/main-*.js` | `public_html/main-*.js` |

In FileZilla, open the `dist/epic-ww2/browser/` directory locally, select all files and folders inside it (Ctrl+A / Cmd+A), then drag or upload those to `public_html/`. Do not drag the `browser/` folder itself.

### Build Verification

After `npm run build:prod` (or `ng build --base-href /`) completes successfully, confirm these paths exist inside `dist/epic-ww2/browser/`:

| Path | What it is |
|---|---|
| `index.html` | App entry point — must contain `<base href="/">` |
| `main-*.js` | Angular application bundle |
| `styles-*.css` | Global styles (tokens, typography, grain texture) |
| `assets/images/hero/{slug}.webp` | Hero images — all 21 ships |
| `assets/images/hero/{slug}.jpg` | Hero JPEG fallbacks — all 21 ships |
| `assets/images/thumb/{slug}.webp` | Thumbnail images — all 21 ships |
| `assets/images/thumb/{slug}.jpg` | Thumbnail JPEG fallbacks — all 21 ships |

### FTP Connection Settings

Retrieve credentials from Bluehost cPanel → FTP Accounts. Credentials are not stored in this repository.

| Setting | Value |
|---|---|
| Host | `ww2epic.com` or `ftp.ww2epic.com` |
| Protocol | SFTP (preferred) or FTP |
| Port | 22 (SFTP) or 21 (FTP) |
| Username | Bluehost FTP account username |
| Password | Retrieve from Bluehost cPanel |
| Remote root | `/public_html/` |

**FileZilla recommended settings:** Transfer → Transfer type → Binary (not Auto or ASCII — ASCII mode can corrupt JavaScript bundles).

### The 21 Ships — Fleet Order from `ships.ts`

The fleet order in `ships.ts` defines the ShipNav Prev/Next sequence. Position 1 wraps back from position 21 (circular).

| # | Slug | Display Name | Anomaly |
|---|---|---|---|
| 1 | `burton-island-ag-88` | Burton Island (AG-88) | |
| 2 | `dms-doran` | DMS Doran | |
| 3 | `general-hersey` | General Hersey | |
| 4 | `general-hw-butler` | General H.W. Butler | |
| 5 | `lsm-276` | LSM-276 | |
| 6 | `tug-181` | Tug 181 | |
| 7 | `uss-allen-m-sumner` | USS Allen M. Sumner | |
| 8 | `uss-atlanta` | USS Atlanta | |
| 9 | `uss-benham` | USS Benham | |
| 10 | `uss-caiman` | USS Caiman | |
| 11 | `uss-chipola` | USS Chipola | |
| 12 | `uss-columbus` | USS Columbus | |
| 13 | `uss-haven` | USS Haven | |
| 14 | `uss-keppler` | USS Keppler | Source image was `uss-keppler-.jpg`; trailing dash stripped by pipeline |
| 15 | `uss-massachusettes` | USS Massachusetts | Slug misspelled to match image filename; `name` field shows correct spelling |
| 16 | `uss-oklahoma-city` | USS Oklahoma City | |
| 17 | `uss-rockwall` | USS Rockwall | |
| 18 | `uss-rodgers` | USS Rodgers | |
| 19 | `uss-theodore-e-chandler` | USS Theodore E. Chandler | |
| 20 | `uss-valley-forge` | USS Valley Forge ★ | `isHomepageHero: true` — HomepageHero renders this image |
| 21 | `uss-vicksburg` | USS Vicksburg | |

★ `isHomepageHero: true` — this ship's photograph is used by the HomepageHero component on the homepage.

**Circular navigation boundaries:** ship 1 (Burton Island AG-88) **Prev** → ship 21 (USS Vicksburg); ship 21 (USS Vicksburg) **Next** → ship 1 (Burton Island AG-88).

### PRD §5 Completion Gate

Story 9.3 is the final story in the project. It is complete only when every item below is verified **on the live site** at www.ww2epic.com:

- All 21 ship pages live with complete Witness Document Trio — no `[Content pending]` anywhere
- No broken links — all routes resolve, no server 404s
- No horizontal scroll at 320px–428px viewport widths
- Howard Hertzog credited via AttributionCaption on every ship page
