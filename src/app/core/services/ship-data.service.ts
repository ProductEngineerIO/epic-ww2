// src/app/core/services/ship-data.service.ts
// STUB — Story 1.5 will replace this with the full dataset.
import { Injectable } from '@angular/core';

export interface Ship {
  slug: string;
  name: string;
}

// Seeded with representative entries so RouterTitleStrategy can resolve
// dynamic ship-page titles during development (e.g. AC-3).
// Story 1.5 will replace this map with the complete ship catalogue.
const SHIP_STUBS: Ship[] = [
  { slug: 'uss-valley-forge', name: 'USS Valley Forge' },
];

const shipMap = new Map<string, Ship>(SHIP_STUBS.map((s) => [s.slug, s]));

@Injectable({ providedIn: 'root' })
export class ShipDataService {
  getBySlug(slug: string): Ship | undefined {
    return shipMap.get(slug);
  }
}
