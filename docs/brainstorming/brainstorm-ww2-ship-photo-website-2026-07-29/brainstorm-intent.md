# Brainstorm Intent: Howard Hertzog WWII Ship Photography Website

_Source: brainstorming session 2026-07-29 — lean PRD input only_

---

## Project Overview

A static website to present 21 WWII-era ship photographs taken by Howard Hertzog from San Francisco Bay, approximately 1944–1946. The site gives each ship its own page with historical context, credits Howard as the photographer throughout, and is built to extend (e.g., an About Howard page) without restructuring.

**Scale:** 21 ships at launch, extensible template.  
**Audience:** General public / family history readers; expects clarity and emotional resonance over interactivity.

---

## Core User Experience Goals

1. Each ship feels like it has a story worth staying for — not a caption to skim.
2. Howard's photographs are treated as primary documents of a specific moment and person, not generic stock imagery.
3. Adding an "About Howard" story page feels like it was always supposed to be there.

---

## Must-Have Requirements

### Ship Pages
- Full-width hero photograph per ship page
- Dossier card with: vessel class, commissioned date, fate
- "Where was it going" framing — contextual narrative placing the ship in its WWII moment
- Howard attribution caption on every ship photo
- Sourced history summary with an explicit historical-source caveat

### Visual Design
- Palette: olive drab / khaki / steel grey
- Typeface: slab serif or condensed grotesque
- Texture / grain applied to UI surfaces
- Homepage has a dark, album-like feel

### Navigation & Structure
- One dedicated page per ship
- Prev / Next ship navigation + back-to-fleet link on every ship page
- Persistent fleet index accessible from any page
- Nav scaffold includes placeholder slots for future sections
- Coming-soon pages used instead of broken or missing links

### Homepage
- First paragraph establishes: Howard Hertzog + San Francisco Bay + era (c. 1944–1946)
- Fleet overview / entry point visible above the fold
- Date range explicitly stated

### Identity & Attribution
- Howard credited on every page (not just the About page)
- "About Howard" slot present in navigation even if page is coming-soon at launch

### Technical
- Static site (no CMS, no server-side runtime)
- Mobile-first responsive layout
- Fast load times (optimized images)
- Consistent single-template approach across all ship pages

---

## Key Design Insight: The Witness Document Trio

> **Fate line + Howard attribution caption + "Where was it going" framing** together transform a photograph from image into witness document.

This trio is the emotional core of every ship page. All three elements must appear together — removing any one degrades the page from story to reference entry. The PRD should treat this trio as an atomic requirement.

---

## Parked for Later

The MoSCoW session only formalized MUST items. The following were surfaced but not scheduled:

| Item | Status |
|------|--------|
| Full "About Howard" page content | Should — nav slot required at launch; content deferred |
| Search or filter across the fleet index | Could — not needed at 21 ships |
| Interactive map (Bay / Pacific route) | Could — high effort, low immediate value |
| User comments or guestbook | Won't — out of scope for static, family-history tone |
| Digitization / scanning workflow docs | Out of scope for this site |

---

## Next Steps

1. **PRD creation** — use this document as sole input; no need to re-read the full session log
2. PRD should specify: information architecture, ship page template schema, image optimization strategy, static site generator selection, and hosting approach
3. After PRD approval: UX / design spec for the witness-document trio layout
4. Confirm final ship list (21 ships) and available metadata before story creation
