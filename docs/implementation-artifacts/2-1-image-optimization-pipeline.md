# Story 2.1: Build and Run the Image Optimization Pipeline

Status: ready-for-dev

## Story

As a developer,
I want `scripts/optimize-images.mjs` to process all 21 source JPEGs and produce optimized hero and thumbnail variants,
so that Angular components can deliver fast-loading, properly formatted WebP and JPEG images from `src/assets/images/`.

## Acceptance Criteria

1. `scripts/optimize-images.mjs` exists and uses `sharp` `^0.33.0`; `sharp` is listed under `dependencies` (not `devDependencies`) in `package.json`; running `node scripts/optimize-images.mjs` from the project root completes without errors
2. Each of the 21 ships produces exactly four output files: `src/assets/images/hero/{slug}.webp`, `src/assets/images/hero/{slug}.jpg`, `src/assets/images/thumb/{slug}.webp`, `src/assets/images/thumb/{slug}.jpg`
3. Hero images are resized to 1920px width; thumb images are resized to 600px width; aspect ratio is preserved in both cases (`fit: 'inside'` or equivalent)
4. Every hero WebP file is ≤200 KB
5. Filename anomaly `./images/uss-keppler-.jpg` → outputs named `uss-keppler.webp` / `uss-keppler.jpg` (trailing dash stripped in output slug)
6. Filename anomaly `./images/uss-massachusettes.jpg` → outputs named `uss-massachusettes.webp` / `uss-massachusettes.jpg` (misspelling preserved — matches `ships.ts` slug)
7. Script is idempotent: re-running produces no errors and simply overwrites outputs
8. `package.json` contains `"optimize-images": "node scripts/optimize-images.mjs"` in the `scripts` section
9. If `./images/` contains fewer than 21 `.jpg` files, the script logs a warning per missing expected file and exits with a non-zero code so CI catches the gap — it does not silently produce a partial output set

## Tasks / Subtasks

- [ ] Install `sharp` as a project dependency (AC: 1)
  - [ ] Run `npm install sharp@^0.33.0` from project root
  - [ ] Confirm `sharp` appears in `dependencies` (not `devDependencies`) in `package.json` — it is a build tool not a dev-only tool (AC: 1)
- [ ] Create output directories if they do not exist (AC: 2)
  - [ ] Script must `mkdir -p` (or `fs.mkdirSync(..., { recursive: true })`) for `src/assets/images/hero/` and `src/assets/images/thumb/` before writing any files
- [ ] Build slug derivation logic with anomaly corrections (AC: 5, 6)
  - [ ] For each `.jpg` in `./images/`, derive slug by stripping `.jpg` extension and stripping any trailing dash
  - [ ] Result: `uss-keppler-.jpg` → slug `uss-keppler`; `uss-massachusettes.jpg` → slug `uss-massachusettes`
  - [ ] All other 19 filenames produce slugs equal to filename minus extension
- [ ] Implement hero image processing (AC: 3, 4)
  - [ ] Resize to 1920w with `sharp().resize(1920, null, { fit: 'inside', withoutEnlargement: true })`
  - [ ] Write `.webp` with quality tuned to keep ≤200 KB (start at quality 80, reduce if needed; `sharp` `.webp({ quality: 80 })`)
  - [ ] Write `.jpg` JPEG fallback with `sharp().jpeg({ quality: 82, progressive: true })`
- [ ] Implement thumbnail image processing (AC: 2, 3)
  - [ ] Resize to 600w with `sharp().resize(600, null, { fit: 'inside', withoutEnlargement: true })`
  - [ ] Write `.webp` thumb: `.webp({ quality: 75 })`
  - [ ] Write `.jpg` thumb: `.jpeg({ quality: 78 })`
- [ ] Add `optimize-images` npm script to `package.json` (AC: 8)
- [ ] Implement source-file count guard (AC: 9)
  - [ ] Before processing, glob `./images/*.jpg` and compare against the 21 expected slugs; log a warning and exit non-zero for any missing file
- [ ] Run the script and verify all 42 output files exist and hero WebPs are ≤200 KB (AC: 2, 4)
  - [ ] `ls src/assets/images/hero/ | wc -l` should output `42`
  - [ ] Check file sizes: `ls -lh src/assets/images/hero/*.webp`

## Dev Notes

### Dependency on Story 1.1

This story is **self-contained** — it does not require the Angular project to be scaffolded. The script only uses Node.js and `sharp`. However, the output path `src/assets/images/hero/` and `src/assets/images/thumb/` will be created by the script itself. If Story 1.1 runs first, the directories may already exist — that's fine; `recursive: true` mkdir is idempotent.

**Run order recommendation:** This story can be done in parallel with or before Story 1.1 since it produces static output files. The Angular app (Stories 1.x–9.x) simply reads these pre-built assets from `src/assets/images/`.

### Source Images

All 21 Howard Hertzog JPEG source files are confirmed present in `./images/`:

```
burton-island-ag-88.jpg    dms-doran.jpg           general-hersey.jpg
general-hw-butler.jpg      lsm-276.jpg             tug-181.jpg
uss-allen-m-sumner.jpg     uss-atlanta.jpg          uss-benham.jpg
uss-caiman.jpg             uss-chipola.jpg          uss-columbus.jpg
uss-haven.jpg              uss-keppler-.jpg         uss-massachusettes.jpg
uss-oklahoma-city.jpg      uss-rockwall.jpg         uss-rodgers.jpg
uss-theodore-e-chandler.jpg  uss-valley-forge.jpg   uss-vicksburg.jpg
```

**Two filename anomalies require explicit handling in the script:**

| Source file | Output slug | Reason |
|---|---|---|
| `uss-keppler-.jpg` | `uss-keppler` | Trailing dash stripped — PRD §3.5 housekeeping note |
| `uss-massachusettes.jpg` | `uss-massachusettes` | Misspelling preserved — must match `ships.ts` slug |

All other 19 files: output slug = filename minus `.jpg` extension.

### Architecture Invariants (AD-6)

From `ARCHITECTURE-SPINE.md` AD-6:

> "Run `node scripts/optimize-images.mjs` before the first build and whenever source images change. It reads `./images/*.jpg`, writes to `src/assets/images/hero/{slug}.webp`, `src/assets/images/hero/{slug}.jpg`, `src/assets/images/thumb/{slug}.webp`, `src/assets/images/thumb/{slug}.jpg`. `ShipHero` and `HomepageHero` use hero variants; `FleetGrid` uses thumb variants. All image elements use `<picture>` with `<source type="image/webp">` and `<img>` JPEG fallback."

This is a **pre-build step**, not part of `ng build`. It runs once (or whenever source images change) and its outputs are static assets checked into the project (or at minimum present before `ng build` runs).

### sharp API — Node 24 / sharp ^0.33.x

Node.js v24.5.0 is confirmed on this machine. `sharp ^0.33.0` supports Node 18+, so no compatibility issues.

Key sharp patterns for this script:

```js
import sharp from 'sharp';
import { readdir, mkdir } from 'node:fs/promises';
import { join, basename, extname } from 'node:path';

// Resize + WebP hero
await sharp(inputPath)
  .resize(1920, null, { fit: 'inside', withoutEnlargement: true })
  .webp({ quality: 80 })
  .toFile(outputWebpPath);

// Resize + JPEG hero fallback
await sharp(inputPath)
  .resize(1920, null, { fit: 'inside', withoutEnlargement: true })
  .jpeg({ quality: 82, progressive: true })
  .toFile(outputJpgPath);
```

Use `withoutEnlargement: true` to prevent upscaling images that are smaller than the target width — some of the 1940s-era photos may be lower resolution.

**200 KB hero WebP target:** `quality: 80` is a good starting point for photographic content. If a specific image exceeds 200 KB at q80, the script should retry at q70, then q60, stopping when ≤200 KB or reaching q50 as a floor. Document this adaptive logic in comments.

### Script Structure

Use ES modules (`.mjs` extension — the architecture specifies `optimize-images.mjs`). Do not use CommonJS `require()`.

```js
// scripts/optimize-images.mjs
import sharp from 'sharp';
import { readdir, mkdir, stat } from 'node:fs/promises';
import { join, basename, extname } from 'node:path';

const SOURCE_DIR = './images';
const HERO_DIR = 'src/assets/images/hero';
const THUMB_DIR = 'src/assets/images/thumb';

// Slug derivation with anomaly corrections
function toSlug(filename) {
  return basename(filename, extname(filename))
    .replace(/-+$/, '');  // strip trailing dashes (handles uss-keppler-)
}
```

### File Size Verification

After running the script, verify hero WebP sizes meet the ≤200 KB requirement:

```bash
node scripts/optimize-images.mjs
ls -lh src/assets/images/hero/*.webp
```

Any file > 200 KB is a build violation (NFR-1, FR-25).

### gitignore Decision (resolved)

Neither `./images/` nor `src/assets/images/` is listed in `.gitignore` — both directories are tracked by git. **Commit both:** the 21 source JPEGs in `./images/` and all 84 optimized outputs in `src/assets/images/`. This ensures `ng build` works in CI without requiring the script to re-run. No `.gitignore` changes are needed.

### Project Structure Notes

- Script file: `scripts/optimize-images.mjs` — at project root, not inside `src/`
- Output hero: `src/assets/images/hero/{slug}.webp` + `{slug}.jpg`
- Output thumb: `src/assets/images/thumb/{slug}.webp` + `{slug}.jpg`
- `package.json` script key: `"optimize-images"` (not `"build:images"` or other variants)

### References

- [Source: docs/planning-artifacts/architecture/architecture-epic-ww2-2026-07-29/architecture-document.md — Image Pipeline section]
- [Source: docs/planning-artifacts/architecture/architecture-epic-ww2-2026-07-29/ARCHITECTURE-SPINE.md — AD-6]
- [Source: docs/planning-artifacts/prds/prd-epic-ww2-2026-07-29/prd.md — FR-24, FR-25, FR-26, §3.6 Image Management]
- [Source: docs/planning-artifacts/epics.md — Epic 2, Story 2.1]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6

### Debug Log References

### Completion Notes List

### File List
