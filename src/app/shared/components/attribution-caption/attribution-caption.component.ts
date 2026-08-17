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
