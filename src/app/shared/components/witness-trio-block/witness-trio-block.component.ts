// src/app/shared/components/witness-trio-block/witness-trio-block.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { Ship } from '../../models/ship.model';
import { AttributionCaptionComponent } from '../attribution-caption/attribution-caption.component';
import { DossierCardComponent } from '../dossier-card/dossier-card.component';
import { NarrativeSectionComponent } from '../narrative-section/narrative-section.component';

@Component({
  selector: 'app-witness-trio-block',
  standalone: true,
  imports: [AttributionCaptionComponent, DossierCardComponent, NarrativeSectionComponent],
  templateUrl: './witness-trio-block.component.html',
  styleUrl: './witness-trio-block.component.scss',
})
export class WitnessTrioBlockComponent implements OnInit {
  @Input() ship!: Ship;

  get narrativePending(): boolean {
    return !this.ship.narrative?.length ||
           this.ship.narrative.every(p => p === '[Content pending]');
  }

  ngOnInit(): void {
    if (this.narrativePending) {
      console.warn(`WitnessTrioBlock: narrative missing for slug "${this.ship.slug}"`);
    }
    if (!this.ship.fate || this.ship.fate === '[Content pending]') {
      console.warn(`WitnessTrioBlock: fate missing for slug "${this.ship.slug}"`);
    }
  }
}
