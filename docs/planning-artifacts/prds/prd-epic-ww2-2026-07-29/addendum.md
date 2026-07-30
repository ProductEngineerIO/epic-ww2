# Addendum: Howard Hertzog WWII Ship Photography Website

*Overflow from the PRD — technical options considered, deferred rationale, and mechanism-level notes that belong downstream of the PRD.*

---

## Angular Routing: HashLocationStrategy Decision

**Decision:** Use `HashLocationStrategy` (`/#/ships/vessel-slug`) rather than `PathLocationStrategy` (`/ships/vessel-slug`).

**Rationale:** The site deploys via FTP to a standard web host. `PathLocationStrategy` requires the server to return `index.html` for all route paths (via `.htaccess` on Apache or equivalent). FTP-hosted environments vary in their support for custom rewrite rules, and configuring them adds deployment complexity for every future host change. `HashLocationStrategy` requires no server-side configuration — the hash fragment is never sent to the server, so `index.html` always resolves. The trade-off (slightly less clean URLs) is acceptable for a personal/family project.

**Alternative considered:** Angular with pre-rendering via Angular SSR / `ng generate app-shell` to produce per-route HTML files. Rejected: meaningful additional build complexity for a 21-page site where client-side rendering is fast enough and search indexing is not a primary concern.

---

## Ship Data Storage: TypeScript Data Files vs. JSON

**Decision:** TypeScript data files (`.ts` with typed interfaces) preferred over plain JSON.

**Rationale:** TypeScript data files give compile-time type checking on the ship data schema — a missing `fate` field or wrong date format fails at build time rather than silently rendering an empty dossier card. For a single-developer project with a fixed 21-entry dataset, the overhead is minimal and the safety is meaningful. JSON remains a valid fallback if the team prefers to separate content from code.

---

## Image Format Strategy

WebP is the primary format because it delivers 25–35% smaller file sizes than JPEG at equivalent visual quality. All modern browsers in current use support WebP. A JPEG fallback (via `<picture>` element with `<source>` for WebP and `<img>` for JPEG) covers any legacy browser edge cases. The ≤200 KB target per image at full-width resolution is achievable for typical ship photographs without visible quality loss at web display sizes.

---

## Content Production Scope Note

Writing 21 "Where was it going" narratives is a substantial content workload — estimated 2–4 hours of research + writing per ship for a thorough treatment, or 42–84 hours total. This should be planned as a dedicated content sprint parallel to or preceding the development sprint for ship pages. Historical sources likely include:
- Naval History and Heritage Command (history.navy.mil)
- Dictionary of American Naval Fighting Ships (DANFS)
- NavSource Online (navsource.org)
- Fold3 / ancestry records for crew and voyage records

The historical-source caveat on each page (FR-5, FR-23) provides appropriate epistemic humility without undermining the narrative.

---

## Analytics (Deferred)

Not in PRD scope. If analytics are added post-launch, a lightweight option (Plausible, Fathom, or a simple `<script>` tag for a self-hosted solution) can be injected into `index.html` or the Angular `app.component.html` without any architectural changes. No PRD revision required.
