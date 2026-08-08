// src/app/core/components/persistent-nav/persistent-nav.component.ts
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-persistent-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './persistent-nav.component.html',
  styleUrl: './persistent-nav.component.scss',
})
export class PersistentNavComponent {}
