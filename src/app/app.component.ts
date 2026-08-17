import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PersistentNavComponent } from './core/components/persistent-nav/persistent-nav.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PersistentNavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {}
