# Deferred Work

## Deferred from: code review of 7-2-implement-accessibility-floor (2026-08-08)

- Tests hard-code exact fallback alt string in `ship-hero.component.spec.ts` — brittle to any wording change in `computedAltText`, but currently passing and correct. Pre-existing test style convention.
- `--color-olive` contrast table entry in the dev agent record shows `~4.2:1` but computed value is ~4.62:1; table should be corrected for accuracy. No functional impact.
- Global reduced-motion catch-all in `styles.scss` does not cover CSS scroll-driven animations (`animation-timeline: scroll()`). No scroll-driven animations exist in the current codebase; forward-compatibility gap only.
