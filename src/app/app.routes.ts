import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ShipPageComponent } from './features/ship/ship-page.component';
import { AboutComponent } from './features/about/about.component';
import { NotFoundComponent } from './features/not-found/not-found.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Fleet — Howard Hertzog WWII Photography',
  },
  {
    path: 'ships/:slug',
    component: ShipPageComponent,
    // No static title — RouterTitleStrategy resolves from ship.name
  },
  {
    path: 'about',
    component: AboutComponent,
    title: 'About Howard — Howard Hertzog WWII Photography',
  },
  {
    path: 'not-found',
    component: NotFoundComponent,
    title: 'Not Found — Howard Hertzog WWII Photography',
  },
  { path: '**', redirectTo: 'not-found' },
];
