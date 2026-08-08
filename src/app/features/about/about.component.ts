// src/app/features/about/about.component.ts
import { Component } from '@angular/core';
import { ComingSoonComponent } from '../../shared/components/coming-soon/coming-soon.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [ComingSoonComponent],
  template: `
    <app-coming-soon
      heading="About Howard"
      body="The story of Howard Hertzog — coming soon." />
  `,
})
export class AboutComponent {}
