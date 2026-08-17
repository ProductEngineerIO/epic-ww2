// src/app/features/not-found/not-found.component.ts
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ComingSoonComponent } from '../../shared/components/coming-soon/coming-soon.component';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [ComingSoonComponent, RouterLink],
  template: `
    <app-coming-soon
      heading="Page not found."
      body="">
      <a slot="actions" [routerLink]="['/']" class="not-found__back">← Back to fleet</a>
    </app-coming-soon>
  `,
  styles: [`
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
