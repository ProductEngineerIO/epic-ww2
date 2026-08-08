# Story 8.4: Finalize Historical Caveat Wording and Verify All 21 Citations

Status: ready-for-dev

## Story

As a site visitor reading historical content,
I want a consistent, honest source caveat on every ship page and at least one confirmed citation per ship,
so that I trust the content enough to share the site without embarrassment about source quality.

## Acceptance Criteria

1. Every ship entry in `src/data/ships.ts` has a non-empty `sources` array whose first element is a real citation string — not `'[Source pending]'` and not empty.
2. The `NarrativeSectionComponent` `caveats` getter formats the caveat as: `"Historical details sourced from [Source Name]. Accuracy not guaranteed."` — with the actual `ship.sources[0]` value substituted.
3. The fallback caveat wording (used when `sources` is empty or `'[Source pending]'`) is finalized and consistent with EXPERIENCE.md: `"Historical details sourced from historical records. Accuracy not guaranteed."` — **update the component if the fallback currently reads `"historical sources"` instead of `"historical records"`**.
4. After all 21 ships have real sources populated, the fallback path is never triggered on any live ship page — every ship page shows a source-specific caveat, not the generic fallback.
5. Zero `"Content pending"` placeholder strings appear anywhere on the rendered site — all 21 ship pages pass the Witness Document Trio integrity check.
6. Zero `"[Source pending]"` strings appear in `ships.ts`.
7. All existing unit tests in `narrative-section.component.spec.ts` continue to pass; if any test hard-codes `"historical sources"` in its expected string and the fallback wording is updated to `"historical records"`, update those test expectations to match.

## Tasks / Subtasks

- [ ] **Verify dependency stories complete** (AC: 1, 5, 6)
  - [ ] Confirm 8.1 is done: ships 1–7 have real `sources`, `narrative`, `vesselClass`, `commissioned`, `fate`, `altText`
  - [ ] Confirm 8.2 is done: ships 8–14 have real `sources`, `narrative`, `vesselClass`, `commissioned`, `fate`, `altText`
  - [ ] Confirm 8.3 is done: ships 15–21 have real `sources`, `narrative`, `vesselClass`, `commissioned`, `fate`, `altText`
  - [ ] If any story is not done, populate any remaining `'[Source pending]'` entries before continuing

- [ ] **Finalize fallback caveat wording** (AC: 3, 7)
  - [ ] Open `src/app/shared/components/narrative-section/narrative-section.component.ts`
  - [ ] In the `caveats` getter, locate the fallback return string
  - [ ] If it reads `"historical sources"`, update to `"historical records"` to match EXPERIENCE.md and the Story 4.4 spec
  - [ ] Update `src/app/shared/components/narrative-section/narrative-section.component.spec.ts` — find any test expecting `"historical sources"` in the caveat string and update to `"historical records"` to match

- [ ] **Verify all 21 ships have real citations** (AC: 1, 6)
  - [ ] Open `src/data/ships.ts` and scan every entry
  - [ ] For each ship, confirm `sources[0]` is a non-empty string that is NOT `'[Source pending]'`
  - [ ] Document any ship still showing `'[Source pending]'` and populate it before completing this story

- [ ] **Verify caveat renders correctly for each ship** (AC: 2, 4)
  - [ ] Spot-check at least 5 ship pages across the roster in `ng serve`
  - [ ] Confirm each page shows a ship-specific caveat (not the generic fallback text)
  - [ ] Confirm caveat reads: `"Historical details sourced from [actual source name]. Accuracy not guaranteed."`

- [ ] **Verify zero Content pending placeholders** (AC: 5)
  - [ ] Run `ng serve` and navigate to each of the 21 ship pages
  - [ ] Confirm no `"Content pending"` text appears — all three Witness Document Trio members (DossierCard, AttributionCaption, NarrativeSection) render with real content
  - [ ] Also check homepage FleetGrid for 21 ships, `/#/about`, `/#/not-found`

- [ ] **Run tests** (AC: 7)
  - [ ] Run `ng test` — confirm all specs pass with zero failures

## Dev Notes

### Dependency on Stories 8.1–8.3

This story is a **verification + finalization** story that assumes Stories 8.1, 8.2, and 8.3 have already populated `ships.ts` with real content. The primary coding work is:
1. One small string fix in `NarrativeSectionComponent.caveats` (if not already correct)
2. Matching test expectation update (if needed)

If 8.1–8.3 are not yet done, the developer must also populate any missing ship data before this story can complete. In that case, follow the data requirements from those stories.

### Caveat Wording Discrepancy (Critical to Resolve)

There is a known discrepancy between the Story 4.4 spec and the actual implementation:

| Source | Fallback wording |
|--------|-----------------|
| Story 4.4 spec (docs/implementation-artifacts/4-4-narrative-section.md) | `"historical records"` |
| Current component (as observed) | `"historical sources"` |
| EXPERIENCE.md Voice & Tone | `"Historical details sourced from [Source Name]. Accuracy not guaranteed."` |

**Resolution:** Use `"historical records"` — it's the wording specified in Story 4.4 and aligns better with the archival/museum tone of the site.

### NarrativeSection — Files to Touch

| File | Change |
|------|--------|
| `src/app/shared/components/narrative-section/narrative-section.component.ts` | Update fallback string in `caveats` getter (if needed) |
| `src/app/shared/components/narrative-section/narrative-section.component.spec.ts` | Update any test expectation containing `"historical sources"` (if fallback changed) |
| `src/data/ships.ts` | No structural changes — only verify all `sources` fields have real values (populated by 8.1–8.3) |

**Do NOT change:** `ship.model.ts`, `narrative-section.component.html`, `narrative-section.component.scss`. The component's HTML, SCSS, and the `isPending` logic are already correct and finalized.

### Caveat Getter — Current Implementation

```typescript
// src/app/shared/components/narrative-section/narrative-section.component.ts
get caveats(): string {
  const source = this.ship.sources?.[0];
  if (!source || source === '[Source pending]') {
    return 'Historical details sourced from historical sources. Accuracy not guaranteed.';
    // ^ FIX: change "historical sources" → "historical records"
  }
  return `Historical details sourced from ${source}. Accuracy not guaranteed.`;
}
```

The template-level and happy-path behavior (`return \`Historical details sourced from ${source}. Accuracy not guaranteed.\``) is **already correct** — only the fallback string needs updating.

### Architecture Constraints

- **AD-3:** `src/data/ships.ts` is the sole source of truth for ship data. `ShipDataService` is the only consumer. No component imports `ships.ts` directly.
- **AD-4:** No hex values in component files — use CSS custom property tokens only. (No SCSS changes needed for this story.)
- **AD-5:** `WitnessTrioBlock` renders `DossierCard + AttributionCaption + NarrativeSection` unconditionally. All three must have non-placeholder content for the integrity check to pass.
- **FR-5, FR-23:** Historical-source caveat is required on every ship page; wording must be consistent across all 21 pages.

### Ship Roster for Verification (21 ships)

| # | Slug | Name | Story |
|---|------|------|-------|
| 1 | `burton-island-ag-88` | Burton Island (AG-88) | 8.1 |
| 2 | `dms-doran` | DMS Doran | 8.1 |
| 3 | `general-hersey` | General Hersey | 8.1 |
| 4 | `general-hw-butler` | General H.W. Butler | 8.1 |
| 5 | `lsm-276` | LSM-276 | 8.1 |
| 6 | `tug-181` | Tug 181 | 8.1 |
| 7 | `uss-allen-m-sumner` | USS Allen M. Sumner | 8.1 |
| 8 | `uss-atlanta` | USS Atlanta | 8.2 |
| 9 | `uss-benham` | USS Benham | 8.2 |
| 10 | `uss-caiman` | USS Caiman | 8.2 |
| 11 | `uss-chipola` | USS Chipola | 8.2 |
| 12 | `uss-columbus` | USS Columbus | 8.2 |
| 13 | `uss-haven` | USS Haven | 8.2 |
| 14 | `uss-keppler` | USS Keppler | 8.2 — slug has NO trailing dash |
| 15 | `uss-massachusettes` | USS Massachusetts | 8.3 — slug misspelled, `name` field correct |
| 16 | `uss-oklahoma-city` | USS Oklahoma City | 8.3 |
| 17 | `uss-rockwall` | USS Rockwall | 8.3 |
| 18 | `uss-rodgers` | USS Rodgers | 8.3 |
| 19 | `uss-theodore-e-chandler` | USS Theodore E. Chandler | 8.3 |
| 20 | `uss-valley-forge` | USS Valley Forge | 8.3 — has `isHomepageHero: true` |
| 21 | `uss-vicksburg` | USS Vicksburg | 8.3 |

**Slug anomalies to preserve (from AD notes in epics.md):**
- `uss-keppler` — no trailing dash (image file was `uss-keppler-.jpg` but pipeline strips the trailing dash)
- `uss-massachusettes` — misspelled slug to match the original image filename; `name` field reads "USS Massachusetts" (correct spelling)
- `uss-valley-forge` — must have `isHomepageHero: true`; all other ships must NOT have `isHomepageHero: false` (omit the field entirely for non-hero ships)

### Testing Approach

This story has minimal unit-test changes. The main test file is:
- `src/app/shared/components/narrative-section/narrative-section.component.spec.ts`

Only update tests if the fallback wording changes. The tests to check:
```typescript
// Check these two tests — update expected string if "sources" → "records"
it('caveats returns fallback text when sources is empty', ...)
it('caveats returns fallback text when sources[0] is [Source pending]', ...)
```

No new test files need to be created for this story.

### Project Structure Notes

- `src/data/ships.ts` — verify content only, no structural changes
- `src/app/shared/components/narrative-section/` — one string change in `.ts` and one test update in `.spec.ts` if needed
- No new files, no new routes, no new components

### References

- [Source: docs/planning-artifacts/epics.md#Story 8.4] — Story requirements
- [Source: docs/implementation-artifacts/4-4-narrative-section.md#Caveat Wording] — Specifies `"historical records"` as the finalized fallback
- [Source: docs/planning-artifacts/ux-designs/ux-epic-ww2-2026-07-29/EXPERIENCE.md] — Voice & Tone microcopy: `"Historical details sourced from [Source Name]. Accuracy not guaranteed."`
- [Source: src/app/shared/components/narrative-section/narrative-section.component.ts] — Current `caveats` getter implementation
- [Source: src/data/ships.ts] — 21 ship entries, all currently with `'[Source pending]'` placeholders
- [Source: docs/planning-artifacts/epics.md#FR-5, FR-23] — Caveat requirement and cross-story consistency

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6

### Debug Log References

### Completion Notes List

### File List
