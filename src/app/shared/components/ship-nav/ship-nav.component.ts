// src/app/shared/components/ship-nav/ship-nav.component.ts
import { Component, Input, OnInit, OnDestroy, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ShipDataService } from '../../../core/services/ship-data.service';

@Component({
  selector: 'app-ship-nav',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './ship-nav.component.html',
  styleUrl: './ship-nav.component.scss',
})
export class ShipNavComponent implements OnInit, OnDestroy {
  @Input() currentSlug!: string;

  private readonly shipData = inject(ShipDataService);
  private readonly router = inject(Router);

  private readonly onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      this.router.navigate(['/ships', this.prevSlug]);
    } else if (e.key === 'ArrowRight') {
      this.router.navigate(['/ships', this.nextSlug]);
    }
  };

  get prevSlug(): string {
    return this.shipData.getAdjacentSlugs(this.currentSlug).prev;
  }

  get nextSlug(): string {
    return this.shipData.getAdjacentSlugs(this.currentSlug).next;
  }

  ngOnInit(): void {
    document.addEventListener('keydown', this.onKeyDown);
  }

  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.onKeyDown);
  }
}
