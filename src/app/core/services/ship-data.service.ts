// src/app/core/services/ship-data.service.ts
import { Injectable } from '@angular/core';
import { Ship } from '../../shared/models/ship.model';
import { SHIPS } from '../../../data/ships';

@Injectable({ providedIn: 'root' })
export class ShipDataService {
  private readonly ships: Ship[] = SHIPS;

  /** Returns all 21 ships in roster order (PRD §3.5). Order is canonical. */
  getAll(): Ship[] {
    return this.ships;
  }

  /** Returns the ship matching the given slug, or undefined if not found. */
  getBySlug(slug: string): Ship | undefined {
    return this.ships.find(s => s.slug === slug);
  }

  /**
   * Returns circular prev/next slugs for the given slug.
   * Ship #1 prev → Ship #21 (wraps). Ship #21 next → Ship #1 (wraps).
   */
  getAdjacentSlugs(slug: string): { prev: string; next: string } {
    const idx = this.ships.findIndex(s => s.slug === slug);
    const len = this.ships.length;

    if (idx === -1) {
      console.warn(`ShipDataService.getAdjacentSlugs: slug "${slug}" not found`);
      return { prev: this.ships[0].slug, next: this.ships[0].slug };
    }

    return {
      prev: this.ships[(idx - 1 + len) % len].slug,
      next: this.ships[(idx + 1) % len].slug,
    };
  }
}
