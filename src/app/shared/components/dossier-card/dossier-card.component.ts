// src/app/shared/components/dossier-card/dossier-card.component.ts
import { Component, Input } from '@angular/core';
import { Ship } from '../../models/ship.model';

@Component({
  selector: 'app-dossier-card',
  standalone: true,
  imports: [],
  templateUrl: './dossier-card.component.html',
  styleUrl: './dossier-card.component.scss',
})
export class DossierCardComponent {
  @Input() ship!: Ship;

  private displayValue(raw: string): string {
    return !raw || raw === '[Content pending]' ? 'Not confirmed' : raw;
  }

  get vesselClassDisplay(): string {
    return this.displayValue(this.ship.vesselClass);
  }

  get commissionedDisplay(): string {
    return this.displayValue(this.ship.commissioned);
  }

  get fateDisplay(): string {
    return this.displayValue(this.ship.fate);
  }

  isUnknown(value: string): boolean {
    return value === 'Not confirmed';
  }
}
