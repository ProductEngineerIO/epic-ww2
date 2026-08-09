// src/app/shared/components/ship-hero/ship-hero.component.ts
import { Component, Input } from '@angular/core';
import { Ship } from '../../models/ship.model';

@Component({
  selector: 'app-ship-hero',
  standalone: true,
  imports: [],
  templateUrl: './ship-hero.component.html',
  styleUrl: './ship-hero.component.scss',
})
export class ShipHeroComponent {
  @Input() ship!: Ship;
  imageLoaded = false;
  imageError = false;

  get computedAltText(): string {
    if (!this.ship.altText?.trim() || this.ship.altText === '[Alt text pending]') {
      return `${this.ship.name}, photographed by Howard Hertzog, San Francisco Bay, c. 1944\u20131946`;
    }
    return this.ship.altText;
  }

  onImageLoad(): void {
    this.imageLoaded = true;
  }

  onImageError(): void {
    this.imageError = true;
  }
}
