# Story 4.4: Implement NarrativeSection Component

Status: ready-for-dev

## Story

As a site visitor,
I want to read a contextual narrative placing the ship in its WWII moment, followed by a source caveat,
so that I understand where this vessel was going when Howard photographed it and can trust the historical content.

## Acceptance Criteria

1. `NarrativeSectionComponent` is a standalone component at `src/app/shared/components/narrative-section/narrative-section.component.ts` accepting `@Input() ship!: Ship`
2. Each string in `ship.narrative` is rendered as a separate `<p>` element using `@for`; the section is wrapped in `<section>` with an `<h2>` heading "Where was it going"
3. The section uses `body-lg` typography (Lora, 1.1rem, line-height 1.8), `max-width: var(--space-content-narrow)` (660px), centered with `margin-inline: auto`
4. A historical-source caveat is always rendered at the bottom of the section as an italic `caption`-styled `<p>`: the text includes the source from `ship.sources[0]` (or "historical sources" if sources is empty) followed by ". Accuracy not guaranteed."
5. If `ship.narrative` is empty or contains only `'[Content pending]'`, the section renders a visible `<p class="narrative__pending">Content pending</p>` placeholder instead of the narrative paragraphs — the caveat still renders
6. No raw hex color values appear in the component SCSS

## Tasks / Subtasks

- [ ] Create `src/app/shared/components/narrative-section/narrative-section.component.ts` + `.html` + `.scss` (AC: 1)
  - [ ] `standalone: true`, `imports: []`
  - [ ] `@Input() ship!: Ship`
- [ ] Define a getter for "is pending" state (AC: 5)
  - [ ] `get isPending(): boolean` — true if `narrative` is empty or every entry equals `'[Content pending]'` (use `.every()`)
- [ ] Define a getter for caveat text (AC: 4)
  - [ ] `get caveats(): string` — returns formatted caveat using `ship.sources[0]` or fallback
- [ ] Build the template with `@for` paragraphs and caveat (AC: 2, 4, 5)
- [ ] SCSS: body-lg, max-width, centered, caveat styling (AC: 3, 6)
- [ ] Write unit tests for `narrative-section.component.spec.ts`
  - [ ] `isPending` returns `true` for empty `narrative` array
  - [ ] `isPending` returns `true` when all entries are `'[Content pending]'`
  - [ ] `isPending` returns `false` when at least one entry is real content
  - [ ] `caveats` returns fallback text when `sources` is empty or contains `'[Source pending]'`
  - [ ] `caveats` returns source-formatted text when `sources[0]` is a real citation
  - [ ] Template renders `narrative__pending` when `isPending` is true
  - [ ] Template renders `@for` paragraphs when `isPending` is false
  - [ ] Caveat `<p>` is always rendered regardless of `isPending` state

## Dev Notes

### Dependency Chain

Requires **Story 1.1**, **Story 1.3** (tokens), **Story 1.4** (Ship model). Used by **Story 4.5** (WitnessTrioBlock).

### DESIGN.md Component Spec

```yaml
NarrativeSection:
  typography: body-lg              # → Lora, 1.1rem, lh 1.8
  color: on-surface                # → var(--color-on-surface)
  max-width: content-narrow        # → var(--space-content-narrow) = 660px
  historical-caveat-style: caption # → Roboto Slab, 0.8rem, italic
  historical-caveat-color: on-surface-muted  # → var(--color-steel-muted)
```

### Caveat Wording

EXPERIENCE.md Voice & Tone:
> *"Historical details sourced from [Source Name]. Accuracy not guaranteed."*

Not: "We can't guarantee accuracy" or no caveat at all.

The `sources` array is populated per ship in Epic 8. Until then, `ship.sources[0]` will be `'[Source pending]'`. Handle this gracefully:

```typescript
get caveats(): string {
  const source = this.ship.sources?.[0];
  if (!source || source === '[Source pending]') {
    return 'Historical details sourced from historical records. Accuracy not guaranteed.';
  }
  return `Historical details sourced from ${source}. Accuracy not guaranteed.`;
}
```

The caveat **always renders** — it is not conditional on `isPending`. FR-5 requires it on every ship page.

### Complete Template

```html
<!-- narrative-section.component.html -->
<section class="narrative" aria-labelledby="narrative-heading">
  <h2 id="narrative-heading" class="narrative__heading">Where was it going</h2>

  @if (isPending) {
    <p class="narrative__pending">Content pending</p>
  } @else {
    @for (paragraph of ship.narrative; track $index) {
      <p class="narrative__para">{{ paragraph }}</p>
    }
  }

  <p class="narrative__caveat">{{ caveats }}</p>
</section>
```

### Complete TypeScript

```typescript
import { Component, Input } from '@angular/core';
import { Ship } from '../../models/ship.model';

@Component({
  selector: 'app-narrative-section',
  standalone: true,
  imports: [],
  templateUrl: './narrative-section.component.html',
  styleUrl: './narrative-section.component.scss',
})
export class NarrativeSectionComponent {
  @Input() ship!: Ship;

  get isPending(): boolean {
    return !this.ship.narrative?.length ||
           this.ship.narrative.every(p => p === '[Content pending]');
  }

  get caveats(): string {
    const source = this.ship.sources?.[0];
    if (!source || source === '[Source pending]') {
      return 'Historical details sourced from historical records. Accuracy not guaranteed.';
    }
    return `Historical details sourced from ${source}. Accuracy not guaranteed.`;
  }
}
```

### Complete SCSS

```scss
// narrative-section.component.scss
:host {
  display: block;
}

.narrative {
  max-width: var(--space-content-narrow);
  margin-inline: auto;
  padding: 0 var(--space-gutter);

  @media (max-width: 767px) {
    padding: 0 var(--space-gutter-mobile);
  }
}

.narrative__heading {
  font-family: var(--font-display);
  font-size: var(--font-hl-md-size);
  font-weight: var(--font-hl-md-weight);
  line-height: var(--font-hl-md-lh);
  color: var(--color-khaki);
  margin-bottom: 1.5rem;
}

.narrative__para {
  font-family: var(--font-narrative);
  font-size: var(--font-body-lg-size);
  font-weight: var(--font-body-lg-weight);
  line-height: var(--font-body-lg-lh);
  color: var(--color-on-surface);
  margin-bottom: 1.25rem;

  &:last-child {
    margin-bottom: 0;
  }
}

.narrative__pending {
  font-family: var(--font-display);
  font-size: var(--font-body-md-size);
  color: var(--color-steel-muted);
  font-style: italic;
  margin-bottom: 1.25rem;
}

.narrative__caveat {
  margin-top: 1.5rem;
  font-family: var(--font-display);
  font-size: var(--font-caption-size);
  font-style: var(--font-caption-style);
  line-height: var(--font-caption-lh);
  color: var(--color-steel-muted);
}
```

### Section Heading

EXPERIENCE.md does not specify a heading for NarrativeSection explicitly, but uses `<h2>` for section headings. "Where was it going" is the natural section title (from the PRD FR-4 description). The `id="narrative-heading"` + `aria-labelledby` makes the section a labelled landmark for screen readers.

### AD-4 and AD-5 Compliance

- No hex values in SCSS (AD-4)
- Used only inside WitnessTrioBlock (AD-5)
- **AD-5 guard:** `app-narrative-section` selector must appear in exactly one template: `witness-trio-block.component.html`. Do not use it in any feature component, route, or test harness directly.

### Project Structure Notes

- Component dir: `src/app/shared/components/narrative-section/`

### References

- [Source: docs/planning-artifacts/ux-designs/ux-epic-ww2-2026-07-29/DESIGN.md — components.NarrativeSection]
- [Source: docs/planning-artifacts/ux-designs/ux-epic-ww2-2026-07-29/EXPERIENCE.md — Component Patterns (NarrativeSection), Voice & Tone (caveat wording)]
- [Source: docs/planning-artifacts/architecture/architecture-epic-ww2-2026-07-29/ARCHITECTURE-SPINE.md — AD-4, AD-5]
- [Source: docs/planning-artifacts/prds/prd-epic-ww2-2026-07-29/prd.md — FR-4, FR-5, FR-6, FR-23]
- [Source: docs/planning-artifacts/epics.md — Epic 4, Story 4.4]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6

### Debug Log References

### Completion Notes List

### File List
