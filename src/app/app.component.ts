import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PersistentNavComponent } from './core/components/persistent-nav/persistent-nav.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PersistentNavComponent],
  template: `
    <app-persistent-nav />
    <router-outlet />
  `,
  styleUrl: './app.component.scss'
})
export class AppComponent {}
