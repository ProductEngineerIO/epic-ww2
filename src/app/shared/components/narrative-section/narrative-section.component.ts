import { Component, Input } from '@angular/core';
import { Ship } from '../../models/ship.model';

@Component({
  selector: 'app-narrative-section',
  standalone: true,
  imports: [],
  templateUrl: './narrative-section.component.html',
  styleUrl: './narrative-section.component.scss',
})
export class NarrativeSectionComponent {
  @Input() ship!: Ship;

  get isPending(): boolean {
    return !this.ship.narrative?.length ||
           this.ship.narrative.every(p => p === '[Content pending]');
  }

  get caveats(): string {
    const source = this.ship.sources?.[0];
    if (!source || source === '[Source pending]') {
      return 'Historical details sourced from historical sources. Accuracy not guaranteed.';
    }
    return `Historical details sourced from ${source}. Accuracy not guaranteed.`;
  }
}
