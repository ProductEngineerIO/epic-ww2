// src/app/features/home/fleet-grid.component.ts
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ShipDataService } from '../../core/services/ship-data.service';

@Component({
  selector: 'app-fleet-grid',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './fleet-grid.component.html',
  styleUrl: './fleet-grid.component.scss',
})
export class FleetGridComponent {
  private readonly shipData = inject(ShipDataService);
  ships = this.shipData.getAll();
}
