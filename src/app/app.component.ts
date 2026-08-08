import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PersistentNavComponent } from './core/components/persistent-nav/persistent-nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PersistentNavComponent],
  template: `
    <header>
      <app-persistent-nav />
    </header>
    <main>
      <router-outlet />
    </main>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background-color: var(--color-bg);
    }
    main {
      /* PersistentNav is sticky 56px; no top padding needed here —
         each feature page manages its own layout */
    }
  `]
})
export class AppComponent {}
