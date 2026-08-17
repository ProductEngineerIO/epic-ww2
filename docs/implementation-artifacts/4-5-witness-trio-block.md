# Story 4.5: Implement WitnessTrioBlock Atomic Container

Status: ready-for-dev

## Story

As a developer,
I want `WitnessTrioBlock` to unconditionally compose `AttributionCaption`, `DossierCard`, and `NarrativeSection` as an atomic unit,
so that FR-6 (Witness Document Trio integrity) is enforced structurally — no ship page can ship with a partial trio.

## Acceptance Criteria

1. `WitnessTrioBlockComponent` is a standalone component at `src/app/shared/components/witness-trio-block/witness-trio-block.component.ts` accepting `@Input() ship!: Ship`
2. The template renders `AttributionCaptionComponent`, `DossierCardComponent`, and `NarrativeSectionComponent` — all three, unconditionally, in that order (Attribution → Dossier → Narrative)
3. `DossierCardComponent`, `AttributionCaptionComponent`, and `NarrativeSectionComponent` are never imported or used in any template other than `WitnessTrioBlockComponent` — verified by code search
4. `WitnessTrioBlockComponent` logs warnings in `ngOnInit` for missing data: if `ship.narrative` is empty or every entry equals `'[Content pending]'`, it logs `` console.warn(`WitnessTrioBlock: narrative missing for slug "${this.ship.slug}"`) ``; if `ship.fate` is falsy or equals `'[Content pending]'`, it logs `` console.warn(`WitnessTrioBlock: fate missing for slug "${this.ship.slug}"`) `` — all three child components always render unconditionally; each child handles its own pending/unknown display state
5. The block has `max-width: var(--space-content-max)` (880px) centered, with `2rem` gap between the three child components

## Tasks / Subtasks

- [ ] Create `src/app/shared/components/witness-trio-block/witness-trio-block.component.ts` + `.html` + `.scss` (AC: 1)
  - [ ] `standalone: true`
  - [ ] Import `AttributionCaptionComponent`, `DossierCardComponent`, `NarrativeSectionComponent` in the `imports` array
  - [ ] `@Input() ship!: Ship`
- [ ] Implement data-gap warning checks in `ngOnInit` (AC: 4)
  - [ ] `get narrativePending(): boolean` getter — true if `ship.narrative` is empty or every entry equals `'[Content pending]'` (use `.every()`)
  - [ ] Log `` console.warn(`WitnessTrioBlock: narrative missing for slug "${this.ship.slug}"`) `` in `ngOnInit` when `narrativePending` is true — **not in the getter** (getters fire on every change-detection cycle)
  - [ ] Log `` console.warn(`WitnessTrioBlock: fate missing for slug "${this.ship.slug}"`) `` in `ngOnInit` when `ship.fate` is falsy or equals `'[Content pending]'`
- [ ] Build the template (AC: 2)
  - [ ] Always render `<app-attribution-caption>` (no `[ship]` input — `AttributionCaptionComponent` has no inputs; text is fixed per Story 4.2)
  - [ ] Always render `<app-dossier-card [ship]="ship">`
  - [ ] Always render `<app-narrative-section [ship]="ship">` — `NarrativeSectionComponent` handles its own "Content pending" display (Story 4.4); WitnessTrioBlock's role is detection + logging only
- [ ] SCSS: max-width, centered, gap between children (AC: 5)
- [ ] Verify AD-5 compliance: no other template uses the three child component selectors (AC: 3)
- [ ] Write unit tests for `witness-trio-block.component.spec.ts`
  - [ ] `narrativePending` returns `true` for an empty `narrative` array
  - [ ] `narrativePending` returns `true` when all entries equal `'[Content pending]'`
  - [ ] `narrativePending` returns `false` when at least one entry is real content
  - [ ] `ngOnInit` calls `console.warn` for narrative when `narrativePending` is true
  - [ ] `ngOnInit` calls `console.warn` for fate when `ship.fate` equals `'[Content pending]'`
  - [ ] `ngOnInit` does not call `console.warn` when both narrative and fate are populated
  - [ ] Template always renders all three child component selectors regardless of data state

## Dev Notes

### Dependency Chain

**Requires Stories 4.2, 4.3, 4.4** (all three child components must exist). Also requires **Story 1.4** (Ship model). Used by **Story 4.7** (ShipPageComponent).

### AD-5 Invariant — The Atomic Constraint

Architecture invariant AD-5:
> "`ShipPageComponent` renders exactly one `<app-witness-trio-block>`. `WitnessTrioBlock` renders `DossierCard`, `AttributionCaption`, and `NarrativeSection` unconditionally. If any data field required by those children is absent, `WitnessTrioBlock` renders a visible 'Content pending' placeholder for that element — never an empty or missing block. `DossierCard`, `AttributionCaption`, and `NarrativeSection` are not used outside `WitnessTrioBlock`."

This means:
- Do NOT add `DossierCardComponent`, `AttributionCaptionComponent`, or `NarrativeSectionComponent` to the `imports` array of any other component
- Do NOT render `<app-dossier-card>`, `<app-attribution-caption>`, or `<app-narrative-section>` in any template except `witness-trio-block.component.html`

Verify after implementation:
```bash
grep -r "app-dossier-card\|app-attribution-caption\|app-narrative-section" src/app --include="*.html" | grep -v "witness-trio-block"
```
Must return no results.

### Rendering Order: Attribution First

> ⚠️ **DOM Order: Attribution → Dossier → Narrative** — do not follow the order listed in `epics.md`; that document has a listing error. EXPERIENCE.md and DESIGN.md are authoritative.

The DOM order inside WitnessTrioBlock is **AttributionCaption → DossierCard → NarrativeSection**. This places the attribution immediately below the ShipHero photograph (which is rendered by ShipPageComponent before WitnessTrioBlock), satisfying EXPERIENCE.md:

> "Placed directly after `ShipHero` in DOM order for screen readers."

The attribution caption logically pairs with the photo above it before the reader encounters the dossier data.

### Content Pending Handling

WitnessTrioBlock is responsible for **detecting** data gaps and logging warnings. The child components handle their own visual fallback (DossierCard shows "Not confirmed"; NarrativeSection shows "Content pending"). WitnessTrioBlock's role is the structural warning layer:

```typescript
import { Component, Input, OnInit } from '@angular/core';
import { Ship } from '../../models/ship.model';
import { AttributionCaptionComponent } from '../attribution-caption/attribution-caption.component';
import { DossierCardComponent } from '../dossier-card/dossier-card.component';
import { NarrativeSectionComponent } from '../narrative-section/narrative-section.component';

@Component({
  selector: 'app-witness-trio-block',
  standalone: true,
  imports: [AttributionCaptionComponent, DossierCardComponent, NarrativeSectionComponent],
  templateUrl: './witness-trio-block.component.html',
  styleUrl: './witness-trio-block.component.scss',
})
export class WitnessTrioBlockComponent implements OnInit {
  @Input() ship!: Ship;

  get narrativePending(): boolean {
    return !this.ship.narrative?.length ||
           this.ship.narrative.every(p => p === '[Content pending]');
  }

  ngOnInit(): void {
    if (this.narrativePending) {
      console.warn(`WitnessTrioBlock: narrative missing for slug "${this.ship.slug}"`);
    }
    if (!this.ship.fate || this.ship.fate === '[Content pending]') {
      console.warn(`WitnessTrioBlock: fate missing for slug "${this.ship.slug}"`);
    }
  }
}
```

### Template

```html
<!-- witness-trio-block.component.html -->
<div class="trio">
  <app-attribution-caption />
  <app-dossier-card [ship]="ship" />
  <app-narrative-section [ship]="ship" />
</div>
```

Container element is `<div>` (not `<section>`) — WitnessTrioBlock is a layout coordinator, not a landmark region. No conditional rendering — all three always render. Child components handle their own pending/unknown display states.

### SCSS

```scss
// witness-trio-block.component.scss
:host {
  display: block;
}

.trio {
  max-width: var(--space-content-max);
  margin-inline: auto;
  padding: var(--space-section-gap) var(--space-gutter);
  display: flex;
  flex-direction: column;
  gap: 2rem; // DESIGN.md specifies gap-between-elements: '2rem'; no token in _tokens.scss — intentional raw value

  @media (max-width: 767px) {
    padding: var(--space-section-gap-mobile) var(--space-gutter-mobile);
  }
}
```

### Project Structure Notes

- Component dir: `src/app/shared/components/witness-trio-block/`
- This is a coordination component with minimal logic — keep it thin

### References

- [Source: docs/planning-artifacts/ux-designs/ux-epic-ww2-2026-07-29/DESIGN.md — components.WitnessTrioBlock]
- [Source: docs/planning-artifacts/ux-designs/ux-epic-ww2-2026-07-29/EXPERIENCE.md — Component Patterns (WitnessTrioBlock), State Patterns (WitnessTrioBlock data incomplete)]
- [Source: docs/planning-artifacts/architecture/architecture-epic-ww2-2026-07-29/architecture-document.md — Component Architecture diagram]
- [Source: docs/planning-artifacts/architecture/architecture-epic-ww2-2026-07-29/ARCHITECTURE-SPINE.md — AD-4, AD-5]
- [Source: docs/planning-artifacts/prds/prd-epic-ww2-2026-07-29/prd.md — FR-6]
- [Source: docs/planning-artifacts/epics.md — Epic 4, Story 4.5]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6

### Debug Log References

### Completion Notes List

### File List
