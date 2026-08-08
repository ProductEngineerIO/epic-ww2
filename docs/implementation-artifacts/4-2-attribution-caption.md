# Story 4.2: Implement AttributionCaption Component

Status: done

## Story

As a site visitor,
I want Howard Hertzog's attribution caption to appear on every ship page immediately after the hero photograph,
so that his authorship as photographer is always credited in the correct position.

## Acceptance Criteria

1. `AttributionCaptionComponent` is a standalone component at `src/app/shared/components/attribution-caption/attribution-caption.component.ts` with no inputs — the text is fixed per the site's voice and tone spec
2. The component renders the exact text: "Photographed by Howard Hertzog, San Francisco Bay, c. 1944–1946"
3. Typography uses `caption` style: Roboto Slab, 0.8rem, italic, `var(--color-steel)` (on-surface-secondary)
4. No raw hex color values appear in the component SCSS
5. The component renders unconditionally — no `*ngIf`, no optional binding, no conditional class that hides it; the element is always present in the DOM

## Tasks / Subtasks

- [ ] Create `src/app/shared/components/attribution-caption/attribution-caption.component.ts` (AC: 1)
  - [ ] `standalone: true`, `imports: []`
  - [ ] No `@Input()` properties — text is fixed
- [ ] Build the component template (AC: 2)
  - [ ] Render the attribution text in a `<p>` element (see dev notes — `<figcaption>` and `<cite>` are not appropriate here)
- [ ] Style with caption tokens (AC: 3, 4)
  - [ ] `font-family: var(--font-display)`, `font-size: var(--font-caption-size)`, `font-weight: var(--font-caption-weight)`, `font-style: var(--font-caption-style)`, `line-height: var(--font-caption-lh)`, `color: var(--color-steel)`
  - [ ] `margin-top: 0.5rem; padding: 0 var(--space-gutter)` (desktop); `padding: 0 var(--space-gutter-mobile)` under `@media (max-width: 767px)`

## Dev Notes

### Dependency Chain

Requires **Story 1.1** (scaffold) and **Story 1.3** (design tokens). Used by **Story 4.5** (WitnessTrioBlock).

### Fixed vs. Parameterised Text

The attribution text is fixed: *"Photographed by Howard Hertzog, San Francisco Bay, c. 1944–1946"*. No `@Input()` is needed. All 21 ship pages use identical attribution per FR-2 and EXPERIENCE.md Voice & Tone:

> *"Photographed by Howard Hertzog, San Francisco Bay, c. 1944–1946"* — not "Photo credit:" or "© Howard Hertzog"

Do not make the text configurable with an `@Input()` — it introduces the possibility of omission. The component enforces FR-2 by design.

### DOM Position

This component is rendered **first** inside `WitnessTrioBlock` (before DossierCard and NarrativeSection), immediately following `ShipHero` in the page's overall DOM order. This satisfies EXPERIENCE.md:

> "Placed directly after `ShipHero` in DOM order for screen readers."

Screen readers encountering the page will read: photo alt text → ship name figcaption → attribution caption → dossier → narrative. This is the intended reading order.

### `<p>` vs `<figcaption>` Element Choice

EXPERIENCE.md (line 118) and the epics accessibility spec describe a `<figure>` + `<figcaption>` semantic wrapping ShipHero + AttributionCaption. This does **not** mean the `AttributionCaptionComponent` itself should render a `<figcaption>`.

- `ShipHero` owns its own `<figure>` with a `<figcaption>` for the ship name. A second `<figcaption>` cannot be a direct child of the same `<figure>` as a peer `<figcaption>` without violating HTML semantics.
- `AttributionCaptionComponent` lives inside `WitnessTrioBlock`, which is a sibling of `ShipHero` in the DOM — outside any `<figure>` element. Rendering `<figcaption>` outside a `<figure>` is invalid HTML.
- The outer `<figure>` + `<figcaption>` grouping described in the accessibility spec is assembled at the **`ShipPageComponent`** level (Story 4.7) by wrapping `<app-ship-hero>` and `<app-attribution-caption>` together. That is where the semantic relationship is established.

Use `<p class="attribution">` here. Do **not** use `<figcaption>` or `<cite>` (`<cite>` is for titles of works, not persons).

### DESIGN.md Spec

```yaml
AttributionCaption:
  typography: caption          # → Roboto Slab, 0.8rem, italic, lh 1.5
  color: on-surface-secondary  # → var(--color-steel) = #8a9aaa
  margin-top: '0.5rem'
  padding: '0 1rem'
```

> **Padding note:** DESIGN.md specifies `padding: '0 1rem'` (= 0 16px). This story uses `var(--space-gutter)` (24px) on desktop and `var(--space-gutter-mobile)` (16px) on mobile instead. This aligns the component with the site-wide horizontal gutter system used by all other content blocks and avoids a one-off raw value. The desktop padding is intentionally wider than the literal DESIGN.md value.

### Complete Implementation

```typescript
// attribution-caption.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-attribution-caption',
  standalone: true,
  imports: [],
  template: `
    <p class="attribution">
      Photographed by Howard Hertzog, San Francisco Bay, c.&nbsp;1944–1946
    </p>
  `,
  styles: [`
    .attribution {
      font-family: var(--font-display);
      font-size: var(--font-caption-size);
      font-weight: var(--font-caption-weight);
      font-style: var(--font-caption-style);
      line-height: var(--font-caption-lh);
      color: var(--color-steel);
      margin-top: 0.5rem;
      padding: 0 var(--space-gutter);

      @media (max-width: 767px) {
        padding: 0 var(--space-gutter-mobile);
      }
    }
  `]
})
export class AttributionCaptionComponent {}
```

Note the `c.&nbsp;1944–1946` — the non-breaking space after "c." prevents the period from sitting alone on a wrapped line.

### AD-5 Reminder

Per AD-5, `AttributionCaptionComponent` must only be used inside `WitnessTrioBlock`. Do not import it directly into `ShipPageComponent` or any other template. If you see `<app-attribution-caption>` outside of `witness-trio-block.component.html`, that is an AD-5 violation.

### Project Structure Notes

- Component dir: `src/app/shared/components/attribution-caption/`
- Because this is a tiny, self-contained component with no logic, inline template + styles in a single `.ts` file is acceptable (no separate `.html` / `.scss` files needed)

### References

- [Source: docs/planning-artifacts/ux-designs/ux-epic-ww2-2026-07-29/DESIGN.md — components.AttributionCaption]
- [Source: docs/planning-artifacts/ux-designs/ux-epic-ww2-2026-07-29/EXPERIENCE.md — Component Patterns (AttributionCaption), Voice & Tone, Accessibility Floor]
- [Source: docs/planning-artifacts/architecture/architecture-epic-ww2-2026-07-29/ARCHITECTURE-SPINE.md — AD-4, AD-5]
- [Source: docs/planning-artifacts/prds/prd-epic-ww2-2026-07-29/prd.md — FR-2, FR-6]
- [Source: docs/planning-artifacts/epics.md — Epic 4, Story 4.2]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6

### Debug Log References

### Completion Notes List

### File List
