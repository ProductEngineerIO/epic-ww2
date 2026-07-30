# PRD Quality Review — Howard Hertzog WWII Ship Photography Website

## Overall verdict

The PRD holds up well for its stakes: a focused public-facing heritage site with a clear thesis, resolved open questions, concrete NFR thresholds, and a hard gate (FR-6 Witness Document Trio) that directly enforces the product's core idea. Two medium findings need fixing before finalize — FR-7 ship ordering is ambiguous (downstream story can't implement it unambiguously), and UJ-2 has no named protagonist (violates the UJ convention the PRD itself establishes). Both are one-line fixes. No blocking findings.

---

## 1. Decision-readiness — strong

All three open questions resolved with specifics (ship roster, images folder, Bluehost + www.ww2epic.com). Angular + HashLocationStrategy decision is explicit with documented rationale. FR-6 is stated as a hard gate, not a guideline. Content production is unambiguously in scope. No decisions buried as "considerations."

### Findings
- None.

---

## 2. Substance over theater — strong

UJs are named and drive real decisions (mobile-first layout, Prev/Next navigation, no broken links). NFRs have product-specific thresholds (≤200 KB images, 3-second 4G load, WCAG AA, ≥320px no-scroll). The Vision statement is specific to this project — not interchangeable with any other heritage site PRD. The Witness Document Trio framing is a genuine product thesis, not template furniture.

### Findings
- None.

---

## 3. Strategic coherence — strong

Clear thesis: a photograph becomes a witness document when fate + attribution + narrative co-appear; removing any one degrades the page from story to reference entry. FR-6 enforces the thesis as a gate. Success metrics validate completeness (all 21 ships, all Witness Document Trios) rather than activity. Counter-metric explicitly named (stub ≠ shipped page). Scope logic is coherent: everything in §3 serves the thesis; everything in §7 is excluded for reasons that follow from it.

### Findings
- None.

---

## 4. Done-ness clarity — adequate

Most FRs are testable. The ≤200 KB image threshold, ≥320px no-scroll, WCAG AA contrast, and HashLocationStrategy configuration are all verifiable by inspection or tooling. FR-6's gate condition is a binary check. However:

### Findings
- **medium** — FR-7 ambiguous ship ordering (§3.1) — "cycles through the 21-ship fleet in a consistent order" is not implementable without knowing what that order is. The data file order from the §3.5 roster table is the natural choice. *Fix:* specify "in the order they appear in the ship data file (§3.5 table order)."
- **low** — FR-11 "album-like visual treatment" (§3.2) is atmospheric, not testable. This is intentional (pushed to UX spec), but the PRD should acknowledge that the UX spec is the acceptance authority for this FR. *Fix:* add a parenthetical: "(UX spec is the acceptance authority for this FR)."

---

## 5. Scope honesty — strong

§7 Out of Scope is comprehensive. The one remaining `[ASSUMPTION]` (analytics) is accurate and self-contained. Content production scope (FR-20–23) is explicit and unambiguous. De-scoping decisions are stated with reasons.

### Findings
- None.

---

## 6. Downstream usability — adequate

Glossary is defined at the top and used consistently throughout. FR IDs are globally numbered FR-1 through FR-32 with no gaps (8+3+4+4+4+3+6 = 32). Cross-references resolve. However:

### Findings
- **medium** — UJ-2 protagonist unnamed (§2.2) — UJ-1 has Sarah (named, role established). UJ-2 is "a WWII naval history reader" — a category, not a person. UJs without named protagonists can't carry inline persona context, which the PRD's own UJ convention requires. *Fix:* give UJ-2 a name and one-line persona context.

---

## 7. Shape fit — strong

Chain-top PRD (feeds UX → architecture → stories). Two UJs for a focused-audience heritage site is appropriate — not under-formalized for its public-facing ambition, not over-formalized for its personal-project scale. FR density (32 FRs) is proportionate to the scope (21 ships × content + platform + design system).

### Findings
- None.

---

## Mechanical notes

- Glossary: "Witness Document Trio," "Fleet index," "Coming-soon page" — used consistently throughout. No drift detected.
- FR IDs: FR-1 through FR-32, contiguous, no duplicates, no gaps.
- UJ IDs: UJ-1 and UJ-2 present; UJ-1 protagonist named (Sarah); UJ-2 protagonist unnamed — see §6 finding.
- `[ASSUMPTION]` tag: one instance (analytics in §7); accurate and not requiring inline indexing at this stakes level.
- Required sections for a chain-top public-facing project: all present (Vision, JTBD, UJs, FRs, NFRs, SMs, OQs resolved, OOS).
