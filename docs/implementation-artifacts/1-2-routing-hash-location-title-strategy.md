# Story 1.2: Configure Routing with HashLocationStrategy and TitleStrategy

Status: done

## Story

As a developer,
I want Angular routing configured with HashLocationStrategy and a custom RouterTitleStrategy,
so that all routes resolve correctly on Bluehost's Apache server without `.htaccess` rewrite rules and each page displays a meaningful browser tab title.

## Acceptance Criteria

1. `src/app/app.config.ts` provides the router with `withHashLocation()`, `withComponentInputBinding()`, and `withRouterConfig({ scrollPositionRestoration: 'top' })`; a custom `RouterTitleStrategy` is registered as the `TitleStrategy` provider
2. `src/app/app.routes.ts` defines exactly five routes: `''` → HomeComponent, `'ships/:slug'` → ShipPageComponent, `'about'` → AboutComponent, `'not-found'` → NotFoundComponent, `'**'` → redirectTo `'not-found'`
3. Navigating to `/#/ships/uss-valley-forge` sets the browser tab title to `"USS Valley Forge — Howard Hertzog WWII Photography"`
4. Navigating to `/#/` sets the tab title to `"Fleet — Howard Hertzog WWII Photography"`
5. Navigating to `/#/about` sets the tab title to `"About Howard — Howard Hertzog WWII Photography"`
6. Navigating to any unknown route (e.g., `/#/foo`) redirects to `/#/not-found` (Angular router handles this — the server never serves a 404)
7. All URLs use the `/#/` hash pattern — no bare path routes exist

## Tasks / Subtasks

- [ ] Implement `src/app/app.config.ts` (AC: 1)
  - [ ] Import `provideRouter`, `withHashLocation`, `withComponentInputBinding`, `withRouterConfig` from `@angular/router`
  - [ ] Import `TitleStrategy` from `@angular/router` and `RouterTitleStrategy` from the custom service (created in next subtask)
  - [ ] Export `appConfig: ApplicationConfig` with `providers` array containing the router provider and TitleStrategy substitution
- [ ] Create `src/app/core/services/router-title-strategy.ts` (AC: 1, 3, 4, 5)
  - [ ] Class `RouterTitleStrategy extends TitleStrategy`
  - [ ] Override `updateTitle(routerState: RouterStateSnapshot)`: call `this.buildTitle(routerState)` to get the static title; if it exists use it as-is; otherwise try to resolve ship name from the URL for dynamic ship page titles
  - [ ] Ship page title logic: extract `slug` from `routerState.url`; look up ship name via `ShipDataService.getBySlug(slug)`; if found, set `"{ship.name} — Howard Hertzog WWII Photography"`; if not found (unknown slug), fall back to `"Not Found — Howard Hertzog WWII Photography"`
  - [ ] All other routes use their static `title` values defined in `app.routes.ts`
  - [ ] Use `inject(Title)` from `@angular/platform-browser` to actually call `this.titleService.setTitle(...)`
- [ ] Implement `src/app/app.routes.ts` (AC: 2, 6, 7)
  - [ ] Define the five routes as specified in AC-2
  - [ ] The `'ships/:slug'` route has **no static `title`** — title is resolved dynamically in `RouterTitleStrategy`
  - [ ] The `'**'` wildcard **must be last** in the routes array
- [ ] Wire `AppComponent` to import `RouterOutlet` (ensures router outlet is active) (AC: 1)
  - [ ] This should already be done from Story 1.1 — verify it is in place
- [ ] Manual smoke test: `ng serve`, navigate to each route, verify hash URLs and tab titles (AC: 3–6)

## Dev Notes

### Dependency on Story 1.1

Story 1.2 **requires Story 1.1 to be complete**. The Angular project, stub feature components (`HomeComponent`, `ShipPageComponent`, `AboutComponent`, `NotFoundComponent`), and `app.component.ts` with `<router-outlet />` must all exist.

**Also requires Story 1.5** for `ShipDataService` to be injectable into `RouterTitleStrategy`. If Story 1.5 is not yet done, create a temporary stub in `RouterTitleStrategy` that just sets the title from the URL slug without a service lookup — then update in Story 1.5.

### Complete `app.config.ts` Implementation

```typescript
// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import {
  provideRouter,
  TitleStrategy,
  withComponentInputBinding,
  withHashLocation,
  withRouterConfig,
} from '@angular/router';
import { routes } from './app.routes';
import { RouterTitleStrategy } from './core/services/router-title-strategy';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withHashLocation(),
      withComponentInputBinding(),
      withRouterConfig({ scrollPositionRestoration: 'top' })
    ),
    { provide: TitleStrategy, useClass: RouterTitleStrategy },
  ],
};
```

### Complete `app.routes.ts` Implementation

```typescript
// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ShipPageComponent } from './features/ship/ship-page.component';
import { AboutComponent } from './features/about/about.component';
import { NotFoundComponent } from './features/not-found/not-found.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Fleet — Howard Hertzog WWII Photography',
  },
  {
    path: 'ships/:slug',
    component: ShipPageComponent,
    // No static title — RouterTitleStrategy resolves from ship.name
  },
  {
    path: 'about',
    component: AboutComponent,
    title: 'About Howard — Howard Hertzog WWII Photography',
  },
  {
    path: 'not-found',
    component: NotFoundComponent,
    title: 'Not Found — Howard Hertzog WWII Photography',
  },
  { path: '**', redirectTo: 'not-found' },
];
```

### `RouterTitleStrategy` Implementation

```typescript
// src/app/core/services/router-title-strategy.ts
import { inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { ShipDataService } from './ship-data.service';

@Injectable({ providedIn: 'root' })
export class RouterTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly shipData = inject(ShipDataService);

  override updateTitle(routerState: RouterStateSnapshot): void {
    const staticTitle = this.buildTitle(routerState);
    if (staticTitle) {
      this.title.setTitle(staticTitle);
      return;
    }
    // Dynamic title for ship pages — extract slug from URL
    const shipMatch = routerState.url.match(/^#?\/ships\/([^/?#]+)/);
    if (shipMatch) {
      const slug = shipMatch[1];
      const ship = this.shipData.getBySlug(slug);
      if (ship) {
        this.title.setTitle(`${ship.name} — Howard Hertzog WWII Photography`);
        return;
      }
    }
    this.title.setTitle('Howard Hertzog WWII Photography');
  }
}
```

**Important:** `ShipDataService` must exist (`src/app/core/services/ship-data.service.ts`) before this compiles. If Story 1.5 is not yet complete, stub `ShipDataService` with a `getBySlug()` method that always returns `undefined`.

### `withComponentInputBinding()` — Slug as @Input

This provider enables Angular to bind route parameters directly to component `@Input()` properties. When `ShipPageComponent` (Story 4.7) is implemented, it will receive the slug via `@Input() slug!: string` — no need to inject `ActivatedRoute` for the slug parameter.

This provider must be in place from this story onwards so `ShipPageComponent` can rely on it in Story 4.7.

### HashLocationStrategy — Why It Matters

`withHashLocation()` configures Angular to use `/#/` prefixed URLs. This is required for Bluehost (FR-28): Apache serves `index.html` for all requests; the hash fragment (`#/ships/...`) is processed entirely in the browser by Angular. Without this, navigating to `www.ww2epic.com/ships/uss-valley-forge` directly would result in a 404 from Apache.

**Consequence for internal links:** Every Angular `routerLink` directive uses the correct `/#/` pattern automatically. Never use bare `<a href="/ships/...">` — always use `[routerLink]="['/ships', ship.slug]"` or equivalent. This invariant (AD-2) applies to all templates written in every subsequent story.

### scrollPositionRestoration: 'top'

`withRouterConfig({ scrollPositionRestoration: 'top' })` ensures the page scrolls to the top on every route change (UX-DR19). This is required behavior from EXPERIENCE.md and must be configured here, not patched in individual components.

### No Lazy Loading in v1

All four feature routes use eager loading (direct `component:` reference, not `loadComponent:`). The site is 21 pages of static content — bundle splitting would add complexity with no meaningful benefit. Do not introduce lazy loading unless explicitly requested.

### Project Structure Notes

- `RouterTitleStrategy` lives in `src/app/core/services/` (alongside `ShipDataService`) — it is a core application concern, not a feature concern
- It is `@Injectable({ providedIn: 'root' })` but is also provided via `{ provide: TitleStrategy, useClass: RouterTitleStrategy }` in `app.config.ts` — the `providedIn: 'root'` is redundant but harmless; the token substitution in `app.config.ts` is what actually wires it as Angular's title strategy

### References

- [Source: docs/planning-artifacts/architecture/architecture-epic-ww2-2026-07-29/architecture-document.md — Routing section, app.config.ts example, app.routes.ts example]
- [Source: docs/planning-artifacts/architecture/architecture-epic-ww2-2026-07-29/ARCHITECTURE-SPINE.md — AD-2, AD-9]
- [Source: docs/planning-artifacts/prds/prd-epic-ww2-2026-07-29/prd.md — FR-28, FR-29, FR-32]
- [Source: docs/planning-artifacts/ux-designs/ux-epic-ww2-2026-07-29/EXPERIENCE.md — Accessibility Floor (screen reader route announcements), UX-DR19]
- [Source: docs/planning-artifacts/epics.md — Epic 1, Story 1.2]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6

### Debug Log References

### Completion Notes List

### File List
