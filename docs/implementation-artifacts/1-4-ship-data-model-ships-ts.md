# Story 1.4: Define Ship Data Model and Initialize ships.ts

Status: ready-for-dev

## Story

As a developer,
I want the `Ship` TypeScript interface defined and `ships.ts` initialized with all 21 ship entries,
so that `ShipDataService` (Story 1.5) and every downstream component has a complete, typed, architecture-compliant data source to work from.

## Acceptance Criteria

1. `src/app/shared/models/ship.model.ts` exports `interface Ship` with exactly these fields: `slug: string`, `name: string`, `vesselClass: string`, `commissioned: string`, `fate: string`, `narrative: string[]`, `sources: string[]`, `altText: string`, `isHomepageHero?: boolean`
2. `src/data/ships.ts` exports a single `SHIPS: Ship[]` array containing all 21 ship entries in the exact roster order from PRD §3.5
3. All 21 slugs are correct: `uss-keppler` has no trailing dash (anomaly fixed from source filename `uss-keppler-.jpg`); `uss-massachusettes` uses the misspelled form (matching the image filename); the `name` field for that entry shows the correct spelling "USS Massachusetts"
4. Exactly one ship has `isHomepageHero: true`; all others have `isHomepageHero` as `undefined` (not `false`, not missing the field)
5. All `narrative`, `sources`, and `altText` fields are populated with placeholder strings until Epic 8 data population — specifically: `narrative: ['[Content pending]']`, `sources: ['[Source pending]']`, `altText: '[Alt text pending]'`
6. `ng build` completes without TypeScript errors — the `Ship` interface is fully satisfied by all 21 entries

## Tasks / Subtasks

- [ ] Create `src/app/shared/models/ship.model.ts` (AC: 1)
  - [ ] Export `export interface Ship { ... }` with all 9 fields exactly as specified in AC-1
  - [ ] `isHomepageHero` is optional (`?`) and typed `boolean` — not `boolean | undefined`
- [ ] Create `src/data/ships.ts` (AC: 2–6)
  - [ ] Import `Ship` from `../app/shared/models/ship.model` (or use relative path from `src/data/`)
  - [ ] Define `export const SHIPS: Ship[] = [...]` with all 21 entries
  - [ ] Entries in PRD §3.5 order (1 = Burton Island through 21 = USS Vicksburg)
  - [ ] Apply slug anomaly corrections (AC: 3)
  - [ ] Choose the homepage hero ship and set `isHomepageHero: true` on it (AC: 4) — USS Valley Forge is a reasonable choice (see Dev Notes)
  - [ ] Set all `narrative`, `sources`, `altText` to placeholder values (AC: 5)
- [ ] Verify TypeScript compiles: `ng build` or `npx tsc --noEmit` passes without errors (AC: 6)

## Dev Notes

### Dependency on Story 1.1

Story 1.4 **requires Story 1.1** (Angular scaffold). The `src/app/shared/models/` and `src/data/` directories must exist. If they were not created in Story 1.1, create them now.

### Complete `ship.model.ts`

```typescript
// src/app/shared/models/ship.model.ts

export interface Ship {
  /** URL segment and asset filename base (e.g. 'uss-valley-forge') */
  slug: string;
  /** Display name (e.g. 'USS Valley Forge') */
  name: string;
  /** Dossier field — vessel class (e.g. 'Essex-class aircraft carrier') */
  vesselClass: string;
  /** Dossier field — human-readable commissioning date (e.g. '15 November 1946') */
  commissioned: string;
  /** Dossier field — fate with date and manner where known */
  fate: string;
  /** Array of paragraph strings for NarrativeSection ('Where was it going') */
  narrative: string[];
  /** Citation strings for historical caveat display */
  sources: string[];
  /** Full alt text string per EXPERIENCE.md alt text convention */
  altText: string;
  /** Exactly one ship sets this true; used by HomepageHero to select its image */
  isHomepageHero?: boolean;
}
```

### Complete 21-Entry Roster and Slug Rules

The authoritative order is from PRD §3.5. Two slug anomalies require special handling:

| # | Slug | Display Name | Source filename |
|---|---|---|---|
| 1 | `burton-island-ag-88` | Burton Island (AG-88) | `burton-island-ag-88.jpg` |
| 2 | `dms-doran` | DMS Doran | `dms-doran.jpg` |
| 3 | `general-hersey` | General Hersey | `general-hersey.jpg` |
| 4 | `general-hw-butler` | General H.W. Butler | `general-hw-butler.jpg` |
| 5 | `lsm-276` | LSM-276 | `lsm-276.jpg` |
| 6 | `tug-181` | Tug 181 | `tug-181.jpg` |
| 7 | `uss-allen-m-sumner` | USS Allen M. Sumner | `uss-allen-m-sumner.jpg` |
| 8 | `uss-atlanta` | USS Atlanta | `uss-atlanta.jpg` |
| 9 | `uss-benham` | USS Benham | `uss-benham.jpg` |
| 10 | `uss-caiman` | USS Caiman | `uss-caiman.jpg` |
| 11 | `uss-chipola` | USS Chipola | `uss-chipola.jpg` |
| 12 | `uss-columbus` | USS Columbus | `uss-columbus.jpg` |
| 13 | `uss-haven` | USS Haven | `uss-haven.jpg` |
| 14 | `uss-keppler` | USS Keppler | `uss-keppler-.jpg` ⚠️ trailing dash stripped |
| 15 | `uss-massachusettes` | **USS Massachusetts** | `uss-massachusettes.jpg` ⚠️ name corrected, slug preserved |
| 16 | `uss-oklahoma-city` | USS Oklahoma City | `uss-oklahoma-city.jpg` |
| 17 | `uss-rockwall` | USS Rockwall | `uss-rockwall.jpg` |
| 18 | `uss-rodgers` | USS Rodgers | `uss-rodgers.jpg` |
| 19 | `uss-theodore-e-chandler` | USS Theodore E. Chandler | `uss-theodore-e-chandler.jpg` |
| 20 | `uss-valley-forge` | USS Valley Forge | `uss-valley-forge.jpg` |
| 21 | `uss-vicksburg` | USS Vicksburg | `uss-vicksburg.jpg` |

**Slug `uss-massachusettes`:** The misspelling is intentional in the slug — it must match the image filename `uss-massachusettes.jpg` which is the only copy available. The `name` field must show the correct spelling: `"USS Massachusetts"`. This discrepancy is documented in the PRD and Architecture docs.

### Placeholder `ships.ts` Skeleton

```typescript
// src/data/ships.ts
import { Ship } from '../app/shared/models/ship.model';

export const SHIPS: Ship[] = [
  {
    slug: 'burton-island-ag-88',
    name: 'Burton Island (AG-88)',
    vesselClass: '[Content pending]',
    commissioned: '[Content pending]',
    fate: '[Content pending]',
    narrative: ['[Content pending]'],
    sources: ['[Source pending]'],
    altText: '[Alt text pending]',
  },
  {
    slug: 'dms-doran',
    name: 'DMS Doran',
    vesselClass: '[Content pending]',
    commissioned: '[Content pending]',
    fate: '[Content pending]',
    narrative: ['[Content pending]'],
    sources: ['[Source pending]'],
    altText: '[Alt text pending]',
  },
  // ... repeat pattern for ships 3–13 ...
  {
    slug: 'uss-keppler',          // ← no trailing dash
    name: 'USS Keppler',
    vesselClass: '[Content pending]',
    commissioned: '[Content pending]',
    fate: '[Content pending]',
    narrative: ['[Content pending]'],
    sources: ['[Source pending]'],
    altText: '[Alt text pending]',
  },
  {
    slug: 'uss-massachusettes',   // ← misspelling preserved (matches image file)
    name: 'USS Massachusetts',    // ← correct spelling in display name
    vesselClass: '[Content pending]',
    commissioned: '[Content pending]',
    fate: '[Content pending]',
    narrative: ['[Content pending]'],
    sources: ['[Source pending]'],
    altText: '[Alt text pending]',
  },
  // ... ships 16–19 ...
  {
    slug: 'uss-valley-forge',
    name: 'USS Valley Forge',
    vesselClass: '[Content pending]',
    commissioned: '[Content pending]',
    fate: '[Content pending]',
    narrative: ['[Content pending]'],
    sources: ['[Source pending]'],
    altText: '[Alt text pending]',
    isHomepageHero: true,         // ← exactly one ship; choose this one
  },
  {
    slug: 'uss-vicksburg',
    name: 'USS Vicksburg',
    vesselClass: '[Content pending]',
    commissioned: '[Content pending]',
    fate: '[Content pending]',
    narrative: ['[Content pending]'],
    sources: ['[Source pending]'],
    altText: '[Alt text pending]',
  },
];
```

**Write all 21 entries in full** — do not use `...` shorthand in the actual file.

### Homepage Hero Selection

The architecture says: *"Exactly one ship sets `isHomepageHero: true`; default `undefined`."* The story creates this designation as `uss-valley-forge` (ship #20). This is a reasonable placeholder — the actual editorial choice can be changed later by the content owner by setting `isHomepageHero: true` on a different ship and removing it from Valley Forge. The `HomepageHero` component (Story 5.1) will call `ShipDataService.getAll().find(s => s.isHomepageHero)`.

Do NOT set `isHomepageHero: false` on the other 20 ships — leave the field absent (`undefined`). Setting it to `false` would not break anything functionally, but it is not the convention defined in the model.

### Import Path from `src/data/ships.ts`

The `Ship` interface is at `src/app/shared/models/ship.model.ts`. From `src/data/ships.ts`, the relative import is:
```typescript
import { Ship } from '../app/shared/models/ship.model';
```

TypeScript path aliases are not configured in this story — use relative imports. A future refactor could add `paths` to `tsconfig.json`, but do not introduce that complexity here.

### AD-3 Compliance

Architecture invariant AD-3: *"`src/data/ships.ts` is the sole source of truth for ship data. `ShipDataService` reads this array; no component imports `ships.ts` directly."*

Only `ShipDataService` (Story 1.5) should import from `ships.ts`. Verify no component file imports directly from `src/data/ships`.

### Project Structure Notes

- Interface: `src/app/shared/models/ship.model.ts` — singular, no extra barrel `index.ts` needed yet
- Data file: `src/data/ships.ts` — at `src/data/`, a sibling of `src/app/` and `src/styles/`
- Both files are TypeScript (`.ts`), not JSON — consistent with AD-3 and the architecture's type-safety requirement

### References

- [Source: docs/planning-artifacts/architecture/architecture-epic-ww2-2026-07-29/architecture-document.md — Data Model section, Ship interface definition, ships.ts slug table]
- [Source: docs/planning-artifacts/architecture/architecture-epic-ww2-2026-07-29/ARCHITECTURE-SPINE.md — AD-3, AD-5, AD-6]
- [Source: docs/planning-artifacts/prds/prd-epic-ww2-2026-07-29/prd.md — §3.5 confirmed ship roster, FR-30, §3.6 filename anomaly note]
- [Source: docs/planning-artifacts/epics.md — Epic 1, Story 1.4]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6

### Debug Log References

### Completion Notes List

### File List
