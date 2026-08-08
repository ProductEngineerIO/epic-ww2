# Story 1.1: Scaffold Angular 22 Standalone Project

Status: ready-for-dev

## Story

As a developer,
I want to initialize the Angular project with the correct folder structure and configuration,
so that the entire codebase has a consistent, architecture-compliant scaffold to build on.

## Acceptance Criteria

1. The Angular project is scaffolded using the installed Angular CLI (21.2.2) with standalone components, Angular routing, and SCSS styles; `ng serve` starts without errors and displays the default Angular app at `localhost:4200`
2. The following directories exist after scaffolding and any manual additions: `src/app/core/components/`, `src/app/core/services/`, `src/app/shared/components/`, `src/app/shared/models/`, `src/app/features/home/`, `src/app/features/ship/`, `src/app/features/about/`, `src/app/features/not-found/`, `src/data/`, `src/styles/`, `src/assets/images/hero/`, `src/assets/images/thumb/`, `scripts/`
3. `src/main.ts` uses `bootstrapApplication()` — no `AppModule`, no `NgModule` anywhere in the project
4. `angular.json` build target `outputPath` resolves to `dist/epic-ww2/browser/` and `styles` includes `src/styles/styles.scss`
5. Stub components exist for `HomeComponent`, `ShipPageComponent`, `AboutComponent`, `NotFoundComponent` — each a minimal standalone component that renders a single `<p>` with its name (real implementation in later stories)
6. `AppComponent` is a standalone component that renders `<router-outlet>` and imports the `RouterOutlet` directive

## Tasks / Subtasks

- [ ] Scaffold the Angular project into the existing workspace directory (AC: 1, 3)
  - [ ] Navigate to **parent** directory: `cd /Users/edhertzog/Documents/ProductEngineerIO`
  - [ ] Run: `ng new epic-ww2 --standalone --routing --style=scss --skip-git --force`
  - [ ] The `--force` flag allows scaffolding into the existing `epic-ww2/` directory without destroying existing files (`_bmad/`, `docs/`, `images/` are preserved)
  - [ ] Verify `ng serve` starts without errors from `epic-ww2/`
- [ ] Verify `bootstrapApplication()` is used in `src/main.ts` (AC: 3)
  - [ ] Confirm no `AppModule` or `@NgModule` exists anywhere — delete any generated module files if the CLI produced them
- [ ] Confirm and fix `angular.json` output path (AC: 4)
  - [ ] Under `projects.epic-ww2.architect.build.options`, verify `outputPath` is `dist/epic-ww2/browser/` (Angular 17+ default; check it matches exactly)
  - [ ] Verify `styles` array includes `"src/styles/styles.scss"` 
- [ ] Create required feature and shared directory structure (AC: 2)
  - [ ] `mkdir -p src/app/core/components src/app/core/services`
  - [ ] `mkdir -p src/app/shared/components src/app/shared/models`
  - [ ] `mkdir -p src/app/features/home src/app/features/ship src/app/features/about src/app/features/not-found`
  - [ ] `mkdir -p src/data src/styles src/assets/images/hero src/assets/images/thumb`
  - [ ] `mkdir -p scripts`
  - [ ] Add a `.gitkeep` to each empty directory that has no files yet
- [ ] Create stub feature components (AC: 5)
  - [ ] `ng generate component features/home/home --standalone --flat` (then simplify template to `<p>HomeComponent</p>`)
  - [ ] `ng generate component features/ship/ship-page --standalone --flat` (template: `<p>ShipPageComponent</p>`)
  - [ ] `ng generate component features/about/about --standalone --flat` (template: `<p>AboutComponent</p>`)
  - [ ] `ng generate component features/not-found/not-found --standalone --flat` (template: `<p>NotFoundComponent</p>`)
- [ ] Update `AppComponent` to render router outlet (AC: 6)
  - [ ] `src/app/app.component.ts`: add `RouterOutlet` to `imports`, template: `<router-outlet />`
  - [ ] Remove all default Angular boilerplate HTML from app template
- [ ] Final verification: `ng serve` runs clean with no errors or warnings about missing modules (AC: 1)

## Dev Notes

### Angular CLI Version

**Installed CLI: 21.2.2** (confirmed on this machine). The architecture document references "Angular 22" as the aspirational version — use the installed CLI 21.2.2. The Angular version installed by the CLI is what matters at build time. Do not attempt to force-install Angular 22 if it is not available via the installed CLI.

The PRD requirement (FR-27) states "Angular (current stable release at time of development)" — Angular CLI 21.2.2 satisfies this requirement.

### Scaffolding into Existing Directory

The project root at `/Users/edhertzog/Documents/ProductEngineerIO/epic-ww2` already contains:
```
_bmad/        ← BMad planning system — DO NOT DELETE
docs/         ← Planning artifacts — DO NOT DELETE
images/       ← 21 source photographs — DO NOT DELETE
.gitignore    ← Existing gitignore — preserve, then merge with Angular's
```

Run `ng new` from the **parent** directory with `--force`:
```bash
cd /Users/edhertzog/Documents/ProductEngineerIO
ng new epic-ww2 --standalone --routing --style=scss --skip-git --force
```

Angular CLI with `--force` will scaffold into the existing directory without deleting its contents. The Angular-generated `.gitignore` will **overwrite** the existing one — after scaffolding, manually merge any custom entries back from git history or the existing file.

**If `--force` fails or is not supported in CLI 21.2.2:** alternative approach:
1. Scaffold into a temp location: `ng new epic-ww2-temp --standalone --routing --style=scss --skip-git`
2. Copy all generated files from `epic-ww2-temp/` into `epic-ww2/` (excluding `epic-ww2-temp/.git`)
3. Delete `epic-ww2-temp/`

### Standalone Architecture (AD-1)

Angular CLI 17+ defaults to standalone components. With CLI 21.2.2 and `--standalone` flag, the generated project will have:
- `bootstrapApplication()` in `main.ts` ✓
- No `AppModule` ✓
- `AppComponent` with `standalone: true` ✓

**Verify** after scaffolding: search the project for any file containing `@NgModule` — there should be none.

### Directory Structure (from Architecture Document)

```
src/
  app/
    core/
      components/    ← PersistentNav (Story 3.2)
      services/      ← ShipDataService (Story 1.5)
    shared/
      components/    ← All reusable UI components (Epics 4–6)
      models/        ← ship.model.ts (Story 1.4)
    features/
      home/          ← HomeComponent (Story 5.3)
      ship/          ← ShipPageComponent (Story 4.7)
      about/         ← AboutComponent (Story 6.1)
      not-found/     ← NotFoundComponent (Story 6.2)
  data/              ← ships.ts (Story 1.4)
  styles/            ← _tokens.scss, styles.scss (Story 1.3)
  assets/
    images/
      hero/          ← 1920w WebP + JPEG (Story 2.1)
      thumb/         ← 600w WebP + JPEG (Story 2.1)
scripts/             ← optimize-images.mjs (Story 2.1)
```

### angular.json Output Path

Angular CLI 17+ places browser output at `dist/{project-name}/browser/`. With project name `epic-ww2`, expect: `dist/epic-ww2/browser/`.

**Check this value after scaffolding** — it must match exactly for the AD-8 deployment invariant ("FTP contents of `dist/epic-ww2/browser/` to Bluehost `public_html/`").

If the generated value is `dist/epic-ww2` (without `/browser/`), update it:
```json
"outputPath": "dist/epic-ww2/browser"
```

### Routing Note for Story 1.2

This story creates **stub routes** — `AppComponent` only needs `<router-outlet />`. The routes file and routing config are fully implemented in Story 1.2. For this story, the generated `app.routes.ts` can remain as an empty routes array:
```typescript
export const routes: Routes = [];
```

Story 1.2 will replace the entire routes array and app.config.ts.

### Project Structure Notes

- All feature components live under `src/app/features/{feature-name}/` as flat files (no sub-subdirectory per component) — use `--flat` with `ng generate component`
- Components are named with their full feature context: `home.component.ts`, `ship-page.component.ts`, `about.component.ts`, `not-found.component.ts`
- `AppComponent` file: `src/app/app.component.ts` — stays at root of `src/app/`

### References

- [Source: docs/planning-artifacts/architecture/architecture-epic-ww2-2026-07-29/ARCHITECTURE-SPINE.md — AD-1, AD-8, AD-10, Layer/Directory table]
- [Source: docs/planning-artifacts/architecture/architecture-epic-ww2-2026-07-29/architecture-document.md — Component Architecture section]
- [Source: docs/planning-artifacts/prds/prd-epic-ww2-2026-07-29/prd.md — FR-27, FR-29, FR-32]
- [Source: docs/planning-artifacts/epics.md — Epic 1, Story 1.1]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6

### Debug Log References

### Completion Notes List

### File List
