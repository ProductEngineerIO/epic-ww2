import { Component } from '@angular/core';
import { HomepageHeroComponent } from '../../shared/components/homepage-hero/homepage-hero.component';
import { FleetGridComponent } from './fleet-grid.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HomepageHeroComponent, FleetGridComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {}
