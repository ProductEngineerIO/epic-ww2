import { Component, OnInit, inject } from '@angular/core';
import { Ship } from '../../models/ship.model';
import { ShipDataService } from '../../../core/services/ship-data.service';

@Component({
  selector: 'app-homepage-hero',
  standalone: true,
  imports: [],
  templateUrl: './homepage-hero.component.html',
  styleUrl: './homepage-hero.component.scss',
})
export class HomepageHeroComponent implements OnInit {
  private readonly shipData = inject(ShipDataService);

  ship: Ship | null = null;
  imageLoaded = false;
  imageError = false;

  ngOnInit(): void {
    this.ship = this.shipData.getAll().find(s => s.isHomepageHero) ?? null;
  }

  onImageLoad(): void {
    this.imageLoaded = true;
  }

  onImageError(): void {
    this.imageError = true;
  }
}
