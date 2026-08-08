# Story 9.1: Configure ng build for Production Deployment

Status: ready-for-dev

## Story

As a developer,
I want `ng build` configured to produce a `dist/epic-ww2/browser/` output ready for Bluehost FTP upload,
so that deployment is a simple `ng build` + FTP without any server-side configuration.

## Acceptance Criteria

1. `npm run build:prod` completes with no errors and output is written to `dist/epic-ww2/browser/`
2. `dist/epic-ww2/browser/index.html` exists at the root of the output directory after build
3. The built `index.html` contains `<base href="/">`, correct for root-domain deployment at www.ww2epic.com
4. All asset paths in the built `index.html` are root-relative (no `./` prefix) and resolve correctly when served from Bluehost `public_html/`
5. Angular's production build optimizer (esbuild) runs successfully — initial bundle stays under the 500kB warning budget configured in `angular.json`
6. `package.json` has a `"build:prod": "ng build --base-href /"` script entry for reproducible production builds

## Tasks / Subtasks

- [ ] Add `"build:prod": "ng build --base-href /"` to `package.json` scripts section (AC: 6)
- [ ] Run `npm run build:prod` and verify it succeeds (AC: 1, 2, 3, 4, 5)
  - [ ] Confirm `dist/epic-ww2/browser/index.html` is present after the build completes
  - [ ] Open `dist/epic-ww2/browser/index.html` and confirm `<base href="/">` appears in `<head>`
  - [ ] Confirm script/style references in `index.html` use root-relative paths (e.g., `main.abc123.js`, not `./main.abc123.js`)
  - [ ] Confirm no `WARNING` or `ERROR` for initial bundle budget threshold in CLI output

## Dev Notes

### Current State of `angular.json` — Read Before Touching

`angular.json` is **already production-ready**. Do not modify it unless a budget violation is found during the build verification task.

Key existing configuration:

```json
"build": {
  "builder": "@angular/build:application",
  "options": {
    "outputPath": "dist/epic-ww2/browser",  // ✅ Correct — no change needed
    "browser": "src/main.ts",
    "tsConfig": "tsconfig.app.json",
    "inlineStyleLanguage": "scss",
    "assets": [{ "glob": "**/*", "input": "public" }],
    "styles": ["src/styles/styles.scss"]
  },
  "configurations": {
    "production": {
      "budgets": [
        { "type": "initial", "maximumWarning": "500kB", "maximumError": "1MB" },
        { "type": "anyComponentStyle", "maximumWarning": "4kB", "maximumError": "8kB" }
      ],
      "outputHashing": "all"   // ✅ Content-hash fingerprinting for Bluehost CDN cache-busting
    },
    "development": {
      "optimization": false,
      "extractLicenses": false,
      "sourceMap": true
    }
  },
  "defaultConfiguration": "production"  // ✅ ng build already runs production config
}
```

Critical facts:
- `outputPath: "dist/epic-ww2/browser"` is the correct upload source for Bluehost — the contents of this folder go directly into `public_html/`
- `defaultConfiguration: "production"` means `ng build` already runs the production config (esbuild optimization, tree-shaking, output hashing)
- Builder is `@angular/build:application` — Angular 21's esbuild-based builder, not the legacy webpack builder. The `--base-href` CLI flag is fully supported

### The One Code Change Required

Add `"build:prod"` to `package.json` scripts. **Only this one line changes.**

**Before:**
```json
"scripts": {
  "ng": "ng",
  "start": "ng serve",
  "build": "ng build",
  "watch": "ng build --watch --configuration development",
  "test": "ng test",
  "optimize-images": "node scripts/optimize-images.mjs"
}
```

**After:**
```json
"scripts": {
  "ng": "ng",
  "start": "ng serve",
  "build": "ng build",
  "build:prod": "ng build --base-href /",
  "watch": "ng build --watch --configuration development",
  "test": "ng test",
  "optimize-images": "node scripts/optimize-images.mjs"
}
```

### Why `--base-href /` Matters

Angular's build injects `<base href="...">` into `index.html`. This tells the browser where to resolve relative URLs for JavaScript and CSS bundle assets. For deployment to the root of Bluehost `public_html/` at www.ww2epic.com, the correct value is `/`.

Without it, Angular defaults to a path derived from the build context, which can produce incorrect asset resolution when the file is served from a web root. Explicitly passing `--base-href /` in the `build:prod` script makes the deployment intent unambiguous and protects against environment-specific build behavior.

**`base-href` vs. HashLocationStrategy:** These are independent concerns:
- `withHashLocation()` (in `app.config.ts`) controls how Angular routes URLs — using the `#` fragment so Bluehost never receives non-`index.html` requests
- `--base-href /` controls how the browser resolves asset URLs embedded in `index.html`

Do not conflate them. Do not modify `app.config.ts`.

### No Lazy Loading Required

`app.routes.ts` uses eager component imports for all four routes:

```typescript
import { HomeComponent } from './features/home/home.component';
import { ShipPageComponent } from './features/ship/ship-page.component';
import { AboutComponent } from './features/about/about.component';
import { NotFoundComponent } from './features/not-found/not-found.component';
```

For this small 21-ship SPA with no third-party heavy dependencies, eager loading is appropriate. Angular 21's esbuild optimizer handles tree-shaking automatically. Do not introduce lazy loading (`loadComponent: () => import(...)`) — it is out of scope and untested.

### Expected Build Output Structure

After `npm run build:prod`:

```
dist/epic-ww2/browser/
  index.html                       ← must have <base href="/">
  main.<hash>.js                   ← Angular app bundle (esbuild output)
  polyfills.<hash>.js              ← Browser polyfills
  styles.<hash>.css                ← Global styles from styles.scss + tokens
  assets/
    images/
      hero/                        ← Hero WebP + JPEG (from scripts/optimize-images.mjs)
      thumb/                       ← Thumbnail WebP + JPEG
```

The `assets/` tree is populated from `src/assets/` during build. **The image optimization script (`npm run optimize-images`) must be run before building** if images haven't been processed yet — this story only covers the build configuration, not the image pipeline (that was Story 2.1).

### Bundle Size Expectation

The current production budget is:
- Warning: 500kB initial bundle
- Error: 1MB initial bundle

This SPA has no heavy third-party dependencies. Angular 21 with esbuild produces highly optimized bundles. Expected initial bundle: well under 200kB. If a budget WARNING appears, check `angular.json` for accidental dev-only imports that made it into the production bundle.

If a budget ERROR appears: do not raise the limit without investigation. Identify the offending module using `ng build --stats-json` and the `webpack-bundle-analyzer` equivalent for esbuild.

### HashLocationStrategy — Bluehost Compatibility Summary

AD-2 invariant: `withHashLocation()` is already configured in `app.config.ts`. This means:
- All URLs use the `/#/...` fragment pattern: `www.ww2epic.com/#/ships/uss-valley-forge`
- Bluehost only ever serves `index.html` — no `.htaccess` rewrite rules needed
- Direct links to any ship page work without server-side routing support
- **Do not change this.** Any switch to PathLocationStrategy would require server-side URL rewriting that Bluehost shared hosting cannot guarantee.

### Files Touched by This Story

| File | Change |
|------|--------|
| `package.json` | Add `"build:prod": "ng build --base-href /"` to scripts |

### Files That Must NOT Be Changed

| File | Reason |
|------|--------|
| `angular.json` | Already correct — change only if budget violation is found |
| `src/app/app.config.ts` | HashLocationStrategy already configured via `withHashLocation()` |
| `src/app/app.routes.ts` | Routes already correct — no lazy loading needed |
| Any component `.ts`, `.html`, `.scss` | This is a build config story — zero component changes |

### Project Structure Notes

This story is the minimal build configuration change. Only `package.json` is modified. No Angular source files, components, services, or templates are touched.

### References

- [angular.json](angular.json) — current build configuration (outputPath, budgets, defaultConfiguration)
- [package.json](package.json) — scripts section to update
- [src/app/app.config.ts](src/app/app.config.ts) — HashLocationStrategy confirmation (`withHashLocation()`)
- [src/app/app.routes.ts](src/app/app.routes.ts) — eager route definitions (no lazy loading)
- [docs/planning-artifacts/architecture/architecture-epic-ww2-2026-07-29/ARCHITECTURE-SPINE.md](docs/planning-artifacts/architecture/architecture-epic-ww2-2026-07-29/ARCHITECTURE-SPINE.md) — AD-2 (HashLocationStrategy), AD-6 (image pipeline)
- [docs/planning-artifacts/epics.md](docs/planning-artifacts/epics.md) — Epic 9, Story 9.1 acceptance criteria

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
