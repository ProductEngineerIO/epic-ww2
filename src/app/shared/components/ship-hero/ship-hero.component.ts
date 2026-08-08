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

  onImageLoad(): void {
    this.imageLoaded = true;
  }

  onImageError(): void {
    this.imageError = true;
  }
}
