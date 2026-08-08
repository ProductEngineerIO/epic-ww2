# Story 3.2: Implement AppComponent Router Outlet

Status: done

## Story

As a developer,
I want `AppComponent` to render `PersistentNav` above a `<router-outlet>` with correct semantic HTML,
so that every page in the site is framed by the persistent navigation shell and page content loads into the correct region.

## Acceptance Criteria

1. `AppComponent` template renders `<app-persistent-nav>` (PersistentNav) followed by `<router-outlet>` and compiles without errors
2. `AppComponent` imports `RouterOutlet` and `PersistentNavComponent` in its `imports` array — no NgModule
3. The shell uses correct semantic HTML: `<header>` wraps `<app-persistent-nav>`, `<main>` wraps `<router-outlet>`
4. `ng serve` loads `/#/` and the HomeComponent stub renders inside `<main>` with PersistentNav visible above it
5. Navigating to `/#/about` renders AboutComponent stub inside `<main>`; PersistentNav remains visible throughout

## Tasks / Subtasks

- [x] Update `src/app/app.component.ts` to import `RouterOutlet` and `PersistentNavComponent` (AC: 2)
  - [x] Add `RouterOutlet` and `PersistentNavComponent` to the `imports` array
  - [x] `PersistentNavComponent` is the stub created in Story 3.1 — Story 3.1 must be complete before this story ships
- [x] Update `AppComponent` template with semantic shell structure (AC: 1, 3)
  - [x] `<header>` containing `<app-persistent-nav>`
  - [x] `<main>` containing `<router-outlet />`
  - [x] Remove all Angular default boilerplate HTML (the generated template with Angular logo etc.)
  - [x] Switch from `styleUrl: './app.component.scss'` to inline `styles: [...]` as shown in the Complete AppComponent below (the scaffold's scss file is empty and not needed)
- [x] Update `src/app/app.component.spec.ts` to add `provideRouter([])` (AC: 1, 2)
  - [x] Add `import { provideRouter } from '@angular/router';` to imports
  - [x] Add `providers: [provideRouter([])]` to the `configureTestingModule` call — required because `PersistentNavComponent` uses `RouterLink`/`RouterLinkActive` which need the router injected
- [x] Verify `ng serve` shows nav + page content at each route (AC: 4, 5)

## Dev Notes

### Story Ordering Note

**Dependency chain:** Requires Stories 1.1 (scaffold), 1.2 (routing), and 3.1 (PersistentNav component). Story 3.1 must be complete before this story — `AppComponent` imports `PersistentNavComponent`.

### Complete AppComponent

```typescript
// src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PersistentNavComponent } from './core/components/persistent-nav/persistent-nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PersistentNavComponent],
  template: `
    <header>
      <app-persistent-nav />
    </header>
    <main>
      <router-outlet />
    </main>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background-color: var(--color-bg);
    }
    main {
      /* PersistentNav is sticky 56px; no top padding needed here —
         each feature page manages its own layout */
    }
  `]
})
export class AppComponent {}
```

### Semantic HTML Requirement (EXPERIENCE.md)

From EXPERIENCE.md Accessibility Floor:
> "`<header>` for PersistentNav, `<main>` for page content"

This is both an accessibility requirement and a screen-reader landmark requirement. `<header>` and `<main>` are HTML landmark elements that screen readers use to navigate the page. Do not use `<div>` wrappers here.

### scrollPositionRestoration Already Handled

`withInMemoryScrolling({ scrollPositionRestoration: 'top' })` was configured in Story 1.2 (`app.config.ts`). `AppComponent` does not need any scroll management code — it is handled at the router level.

### No title attribute on AppComponent

The `AppComponent` selector is `app-root` and it does not have a `title` route property — only feature route components (Home, Ship, About, NotFound) have titles managed by `RouterTitleStrategy`. `AppComponent` is the persistent shell, not a routed view.

### Project Structure Notes

- File: `src/app/app.component.ts` (already exists from Story 1.1 scaffold — this story updates it)
- No separate `app.component.html` or `app.component.scss` file needed — keep template and styles inline for this minimal shell component

### References

- [Source: docs/planning-artifacts/architecture/architecture-epic-ww2-2026-07-29/architecture-document.md — Component Architecture diagram (AppComponent → Nav + feature components)]
- [Source: docs/planning-artifacts/ux-designs/ux-epic-ww2-2026-07-29/EXPERIENCE.md — Accessibility Floor (semantic HTML)]
- [Source: docs/planning-artifacts/epics.md — Epic 3, Story 3.2]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6

### Debug Log References

### Completion Notes List

### File List
