import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Ship } from '../../shared/models/ship.model';
import { ShipDataService } from '../../core/services/ship-data.service';
import { ShipHeroComponent } from '../../shared/components/ship-hero/ship-hero.component';
import { WitnessTrioBlockComponent } from '../../shared/components/witness-trio-block/witness-trio-block.component';
import { ShipNavComponent } from '../../shared/components/ship-nav/ship-nav.component';

@Component({
  selector: 'app-ship-page',
  standalone: true,
  imports: [ShipHeroComponent, WitnessTrioBlockComponent, ShipNavComponent],
  templateUrl: './ship-page.component.html',
  styleUrl: './ship-page.component.scss',
})
export class ShipPageComponent implements OnChanges {
  @Input() slug!: string;

  private readonly shipData = inject(ShipDataService);
  private readonly router = inject(Router);

  ship: Ship | undefined;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['slug']) {
      this.ship = this.shipData.getBySlug(this.slug);
      if (!this.ship) {
        this.router.navigate(['/not-found']);
      }
    }
  }
}
