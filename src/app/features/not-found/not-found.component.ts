// src/app/features/not-found/not-found.component.ts
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="not-found">
      <h1 class="not-found__heading">Page not found.</h1>
      <a [routerLink]="['/']" class="not-found__back">← Back to fleet</a>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: calc(100vh - 56px);
      background-color: var(--color-bg);
    }
    .not-found {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: inherit;
      padding: 3rem 1.5rem;
      text-align: center;
    }
    .not-found__heading {
      font-family: var(--font-display);
      font-size: var(--font-hl-lg-size);
      font-weight: var(--font-hl-lg-weight);
      line-height: var(--font-hl-lg-lh);
      color: var(--color-khaki);
      margin: 0 0 1.5rem;
    }
    .not-found__back {
      display: inline-flex;
      align-items: center;
      min-height: 44px;
      min-width: 44px;
      margin-top: 2rem;
      padding: 0 0.75rem;
      font-family: var(--font-display);
      font-size: var(--font-hl-sm-size);
      font-weight: var(--font-hl-sm-weight);
      color: var(--color-olive);
      text-decoration: none;
      letter-spacing: var(--font-hl-sm-ls);
      transition: color 150ms ease;
    }
    .not-found__back:hover { color: var(--color-khaki); }
    .not-found__back:focus-visible {
      outline: 2px solid var(--color-olive);
      outline-offset: 3px;
    }
    @media (prefers-reduced-motion: reduce) {
      .not-found__back { transition: none; }
    }
  `],
})
export class NotFoundComponent {}
