# Story 4.3: Implement DossierCard Component

Status: done

## Story

As a site visitor,
I want a clearly structured card showing a ship's vessel class, commissioning date, and fate,
so that I can absorb the three key facts about the vessel at a glance before reading the narrative.

## Acceptance Criteria

1. `DossierCardComponent` is a standalone component at `src/app/shared/components/dossier-card/dossier-card.component.ts` accepting `@Input() ship!: Ship`
2. The card renders exactly three labeled fields: "Vessel Class", "Commissioned", "Fate" — each with a `label-caps` label above and a `label-value` value below
3. If any field value (`vesselClass`, `commissioned`, `fate`) is falsy or equals the placeholder `'[Content pending]'`, the component displays "Not confirmed" in `var(--color-steel-muted)` for that field — never a blank field
4. A `4px` left border in `var(--color-olive)` (primary accent color) visually anchors the card on the left edge; background is `var(--color-surface-raised)`; `border-radius: var(--border-radius-sm)` (2px)
5. On tablet+ (≥768px): the three fields display in a horizontal 3-column grid; on mobile (<768px): fields stack in a single column
6. No raw hex color values appear in the component SCSS

## Tasks / Subtasks

- [ ] Create `src/app/shared/components/dossier-card/dossier-card.component.ts` + `.html` + `.scss` (AC: 1)
  - [ ] `standalone: true`, `imports: []`
  - [ ] `@Input() ship!: Ship`
- [ ] Define a helper getter for each field that returns display value or "Not confirmed" (AC: 3)
  - [ ] `get vesselClassDisplay(): string` — returns `ship.vesselClass` or `'Not confirmed'`
  - [ ] `get commissionedDisplay(): string`
  - [ ] `get fateDisplay(): string`
  - [ ] Falsy check: `!value || value === '[Content pending]'` → "Not confirmed"
  - [ ] "Not confirmed" fields render in `var(--color-steel-muted)`; real values in `var(--color-on-surface)` — use `[class.dossier__value--unknown]` binding
- [ ] Build the template with three field cells (AC: 2)
  - [ ] Each cell: `<div class="dossier__field">` → `<span class="dossier__label">` + `<span class="dossier__value">`
- [ ] SCSS: card container + left border + responsive grid (AC: 4, 5, 6)
  - [ ] Card: `background: var(--color-surface-raised)`, `border-left: 4px solid var(--color-olive)`, `border-radius: var(--border-radius-sm)`, `padding: 1.5rem`
  - [ ] Grid: `display: grid; gap: 1.5rem` — `grid-template-columns: repeat(3, 1fr)` on tablet+, `grid-template-columns: 1fr` on mobile

## Dev Notes

### Dependency Chain

Requires **Story 1.1**, **Story 1.3** (tokens), **Story 1.4** (Ship model). Used by **Story 4.5** (WitnessTrioBlock).

### DESIGN.md Component Spec

> **Border width note:** `epics.md` AC erroneously states `3px` — `DESIGN.md` is authoritative and specifies `4px`. Use `4px`.

```yaml
DossierCard:
  background: surface-raised        # → var(--color-surface-raised) = #2e2e22
  border-left: '4px solid {colors.primary}'  # → var(--color-olive) = #7a8c44
  border-radius: sm                 # → var(--border-radius-sm) = 2px
  padding: '1.5rem'
  label-style: label-caps           # Roboto Slab 0.7rem, uppercase, ls 0.12em
  label-color: on-surface-secondary # → var(--color-steel) = #8a9aaa
  value-style: label-value          # Roboto Slab 0.9rem, weight 600
  value-color: on-surface           # → var(--color-on-surface) = #ede9df
  grid-columns: '3 on tablet+, 1 on mobile'
  grid-gap: '1.5rem'
```

### "Not confirmed" Display Logic

EXPERIENCE.md Component Patterns:
> "`DossierCard` field | Display 'Not confirmed' in `{colors.on-surface-muted}` — never blank."

The `[Content pending]` placeholder from Story 1.4 ships.ts should also map to "Not confirmed" since it is effectively missing content. Logic:

```typescript
private displayValue(raw: string): string {
  return (!raw || raw === '[Content pending]') ? 'Not confirmed' : raw;
}
get vesselClassDisplay() { return this.displayValue(this.ship.vesselClass); }
get commissionedDisplay() { return this.displayValue(this.ship.commissioned); }
get fateDisplay()         { return this.displayValue(this.ship.fate); }

isUnknown(value: string): boolean {
  return value === 'Not confirmed';
}
```

### Complete Template

```html
<!-- dossier-card.component.html -->
<div class="dossier-card">
  <div class="dossier__field">
    <span class="dossier__label">Vessel Class</span>
    <span class="dossier__value" [class.dossier__value--unknown]="isUnknown(vesselClassDisplay)">
      {{ vesselClassDisplay }}
    </span>
  </div>
  <div class="dossier__field">
    <span class="dossier__label">Commissioned</span>
    <span class="dossier__value" [class.dossier__value--unknown]="isUnknown(commissionedDisplay)">
      {{ commissionedDisplay }}
    </span>
  </div>
  <div class="dossier__field">
    <span class="dossier__label">Fate</span>
    <span class="dossier__value" [class.dossier__value--unknown]="isUnknown(fateDisplay)">
      {{ fateDisplay }}
    </span>
  </div>
</div>
```

### Complete SCSS

```scss
// dossier-card.component.scss
:host {
  display: block;
}

.dossier-card {
  background: var(--color-surface-raised);
  border-left: 4px solid var(--color-olive);
  border-radius: var(--border-radius-sm);
  padding: 1.5rem;
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(3, 1fr);

  @media (max-width: 767px) {
    grid-template-columns: 1fr;
  }
}

.dossier__label {
  display: block;
  font-family: var(--font-display);
  font-size: var(--font-label-caps-size);
  font-weight: var(--font-label-caps-weight);
  letter-spacing: var(--font-label-caps-ls);
  text-transform: uppercase;
  color: var(--color-steel);
  margin-bottom: 0.4rem;
}

.dossier__value {
  display: block;
  font-family: var(--font-display);
  font-size: var(--font-label-value-size);
  font-weight: var(--font-label-value-weight);
  line-height: var(--font-label-value-lh);
  color: var(--color-on-surface);

  &--unknown {
    color: var(--color-steel-muted);
  }
}
```

### AD-4 Compliance

```bash
grep '#[0-9a-fA-F]' src/app/shared/components/dossier-card/dossier-card.component.scss
```
Must return no results.

### Project Structure Notes

- Component dir: `src/app/shared/components/dossier-card/`
- Three files: `.ts`, `.html`, `.scss`
- **AD-5 guard:** `app-dossier-card` selector must appear in exactly one template: `witness-trio-block.component.html`. Do not use it in any feature component, route, or test harness directly.

### References

- [Source: docs/planning-artifacts/ux-designs/ux-epic-ww2-2026-07-29/DESIGN.md — components.DossierCard]
- [Source: docs/planning-artifacts/ux-designs/ux-epic-ww2-2026-07-29/EXPERIENCE.md — Component Patterns (DossierCard), State Patterns (DossierCard unknown value), Responsive & Platform (DossierCard responsive)]
- [Source: docs/planning-artifacts/architecture/architecture-epic-ww2-2026-07-29/ARCHITECTURE-SPINE.md — AD-4, AD-5]
- [Source: docs/planning-artifacts/prds/prd-epic-ww2-2026-07-29/prd.md — FR-3, FR-6]
- [Source: docs/planning-artifacts/epics.md — Epic 4, Story 4.3]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6

### Debug Log References

### Completion Notes List

### File List
