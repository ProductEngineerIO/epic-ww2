# Story 1.5: Implement ShipDataService

Status: ready-for-dev

## Story

As a developer,
I want a root-scope `ShipDataService` that is the sole access point to the `SHIPS` array,
so that no component ever imports `ships.ts` directly, fleet ordering is always consistent, and ship lookups are reliable across the entire application.

## Acceptance Criteria

1. `src/app/core/services/ship-data.service.ts` exists, is decorated `@Injectable({ providedIn: 'root' })`, imports `SHIPS` from `src/data/ships.ts`, and exposes exactly three public methods: `getAll()`, `getBySlug()`, `getAdjacentSlugs()`
2. `getAll(): Ship[]` returns the full ships array in the defined order (PRD §3.5 roster order as declared in `ships.ts`)
3. `getBySlug(slug: string): Ship | undefined` returns the matching ship or `undefined` — never throws, never returns null
4. `getAdjacentSlugs(slug: string): { prev: string; next: string }` returns circular prev/next slugs: ship #1's prev is ship #21, ship #21's next is ship #1
5. `getAdjacentSlugs('burton-island-ag-88')` returns `{ prev: 'uss-vicksburg', next: 'dms-doran' }`
6. `getAdjacentSlugs('uss-vicksburg')` returns `{ prev: 'uss-valley-forge', next: 'burton-island-ag-88' }`
7. No component has `ShipDataService` in its `providers` array — root-only injection enforced

## Tasks / Subtasks

- [ ] Create `src/app/core/services/ship-data.service.ts` (AC: 1)
  - [ ] Decorator: `@Injectable({ providedIn: 'root' })`
  - [ ] Private field: `private readonly ships = SHIPS` (imported from `src/data/ships`)
  - [ ] Import `Ship` model from `src/app/shared/models/ship.model`
- [ ] Implement `getAll()` (AC: 2)
  - [ ] Returns `this.ships` — no copy, no sort, just the reference to the array (order is canonical)
- [ ] Implement `getBySlug(slug: string): Ship | undefined` (AC: 3)
  - [ ] Use `Array.find()` — returns `undefined` naturally when not found
- [ ] Implement `getAdjacentSlugs(slug: string): { prev: string; next: string }` (AC: 4–6)
  - [ ] Find index with `findIndex()`; use modulo arithmetic for circular wrap
  - [ ] `prev` index: `(idx - 1 + len) % len`; `next` index: `(idx + 1) % len`
  - [ ] Handle edge case: if `slug` is not found (returns -1 from findIndex), return first ship as both prev and next (or throw — see Dev Notes)
- [ ] Update `RouterTitleStrategy` in Story 1.2 to inject `ShipDataService` if it was stubbed (if applicable)
- [ ] Verify `ng build` compiles without errors (AC: 1)
- [ ] Verify no component file imports `SHIPS` or `ships.ts` directly — search: `grep -r "from.*ships" src/app/` (AC: 7)

## Dev Notes

### Dependency on Story 1.4

Story 1.5 **requires Story 1.4** to be complete. `SHIPS` and the `Ship` interface must exist before `ShipDataService` can be written.

### Also Needed By Story 1.2

`RouterTitleStrategy` (Story 1.2) injects `ShipDataService` to resolve ship page titles. If Story 1.2 was completed before Story 1.5 with a stub, update `RouterTitleStrategy` now to use the real service.

### Complete Service Implementation

```typescript
// src/app/core/services/ship-data.service.ts
import { Injectable } from '@angular/core';
import { Ship } from '../shared/models/ship.model';
import { SHIPS } from '../../../data/ships';

@Injectable({ providedIn: 'root' })
export class ShipDataService {
  private readonly ships: Ship[] = SHIPS;

  /** Returns all 21 ships in roster order (PRD §3.5). Order is canonical. */
  getAll(): Ship[] {
    return this.ships;
  }

  /** Returns the ship matching the given slug, or undefined if not found. */
  getBySlug(slug: string): Ship | undefined {
    return this.ships.find(s => s.slug === slug);
  }

  /**
   * Returns circular prev/next slugs for the given slug.
   * Ship #1 prev → Ship #21 (wraps). Ship #21 next → Ship #1 (wraps).
   */
  getAdjacentSlugs(slug: string): { prev: string; next: string } {
    const idx = this.ships.findIndex(s => s.slug === slug);
    const len = this.ships.length;
    return {
      prev: this.ships[(idx - 1 + len) % len].slug,
      next: this.ships[(idx + 1) % len].slug,
    };
  }
}
```

### Import Path from `src/app/core/services/`

From `src/app/core/services/ship-data.service.ts`, the relative paths are:
- `Ship` model: `'../../shared/models/ship.model'`
- `SHIPS` data: `'../../../data/ships'`

Verify the relative depth by counting: `core/services/` is 2 levels below `app/`, and `data/` is one level below `src/`, so `../../..` goes from `services/` → `core/` → `app/` → `src/`, then `/data/ships`.

If the project has a `tsconfig.json` with `paths` configured, use the path alias instead. In the default Angular 21 scaffold, no paths aliases are configured — use relative imports.

### Edge Case: Unknown Slug in getAdjacentSlugs

If `getAdjacentSlugs` is called with a slug not in the array, `findIndex` returns `-1`. With the modulo formula `(-1 - 1 + 21) % 21 = 19`, which would return an unexpected ship. 

**Recommended handling:** If `idx === -1`, return `{ prev: this.ships[0].slug, next: this.ships[0].slug }` as a safe fallback. Add a `console.warn` for diagnostics:

```typescript
if (idx === -1) {
  console.warn(`ShipDataService.getAdjacentSlugs: slug "${slug}" not found`);
  return { prev: this.ships[0].slug, next: this.ships[0].slug };
}
```

This fallback prevents navigation to `undefined` slugs if called with an invalid slug from `ShipPageComponent`.

### No HTTP, No Async

`ShipDataService` is fully synchronous. It reads from an in-memory array (`SHIPS`) that is imported at module load time. There are no HTTP calls, no `Observable`, no `Promise`. Methods return values directly — no reactive wrappers needed.

Do not add `HttpClient` or any reactive patterns. If a future requirement adds dynamic data, that is a separate story.

### AD-7 Compliance

Architecture invariant AD-7: *"`ShipDataService` is decorated `@Injectable({ providedIn: 'root' })`. It is never listed in a component's `providers` array."*

After implementation, search all component files:
```bash
grep -r "ShipDataService" src/app --include="*.ts" | grep "providers"
```
This should return no results.

### AD-3 Compliance Verification

After implementation, verify no component bypasses the service:
```bash
grep -r "from.*data/ships\|from.*ships\.ts" src/app --include="*.ts"
```
Only `ship-data.service.ts` should import from `ships.ts`. If any other file appears, it is a violation of AD-3.

### Usage Pattern in Components

Components inject the service via Angular's `inject()` function (standalone component pattern):

```typescript
// In any component that needs ship data
import { inject } from '@angular/core';
import { ShipDataService } from '../../core/services/ship-data.service';

// In component class:
private readonly shipData = inject(ShipDataService);
```

Or via constructor injection:
```typescript
constructor(private readonly shipData: ShipDataService) {}
```

Both patterns are valid in Angular 21. Prefer `inject()` for standalone components as it is the idiomatic modern pattern.

### Project Structure Notes

- Service file: `src/app/core/services/ship-data.service.ts`
- Angular CLI naming convention: `ship-data.service.ts` (kebab-case, `.service.ts` suffix)
- No barrel `index.ts` needed yet — import directly by file path

### References

- [Source: docs/planning-artifacts/architecture/architecture-epic-ww2-2026-07-29/architecture-document.md — ShipDataService section, full implementation example]
- [Source: docs/planning-artifacts/architecture/architecture-epic-ww2-2026-07-29/ARCHITECTURE-SPINE.md — AD-3, AD-7]
- [Source: docs/planning-artifacts/prds/prd-epic-ww2-2026-07-29/prd.md — FR-30]
- [Source: docs/planning-artifacts/epics.md — Epic 1, Story 1.5]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6

### Debug Log References

None.

### Completion Notes List

- All 7 ACs pass.
- AC 1 build verification required patching a pre-existing Story 1.2 regression: `withRouterConfig({ scrollPositionRestoration: 'top' })` is invalid in Angular 21 — replaced with `withInMemoryScrolling({ scrollPositionRestoration: 'top' })` in `src/app/app.config.ts`.
- AC 5 & 6 verified by inspecting `ships.ts` roster order: `burton-island-ag-88` is idx 0, `uss-valley-forge` is idx 19, `uss-vicksburg` is idx 20 (21 ships total). Modulo arithmetic produces correct circular results.
- AD-3 compliance confirmed: only `ship-data.service.ts` imports from `ships.ts`.
- AD-7 compliance confirmed: no component lists `ShipDataService` in a `providers` array.
- `RouterTitleStrategy` already injects `ShipDataService` and uses `getBySlug()` — no stub update needed.

### File List

- `src/app/core/services/ship-data.service.ts` — created (ShipDataService implementation)
- `src/app/app.config.ts` — patched (`withRouterConfig` → `withInMemoryScrolling`, Story 1.2 regression fix)
