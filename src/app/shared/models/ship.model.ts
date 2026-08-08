// src/app/shared/models/ship.model.ts

export interface Ship {
  /** URL segment and asset filename base (e.g. 'uss-valley-forge') */
  slug: string;
  /** Display name (e.g. 'USS Valley Forge') */
  name: string;
  /** Dossier field — vessel class (e.g. 'Essex-class aircraft carrier') */
  vesselClass: string;
  /** Dossier field — human-readable commissioning date (e.g. '15 November 1946') */
  commissioned: string;
  /** Dossier field — fate with date and manner where known */
  fate: string;
  /** Array of paragraph strings for NarrativeSection ('Where was it going') */
  narrative: string[];
  /** Citation strings for historical caveat display */
  sources: string[];
  /** Full alt text string per EXPERIENCE.md alt text convention */
  altText: string;
  /** Exactly one ship sets this true; used by HomepageHero to select its image */
  isHomepageHero?: boolean;
}
