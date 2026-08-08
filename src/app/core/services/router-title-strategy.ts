// src/app/core/services/router-title-strategy.ts
import { inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { ShipDataService } from './ship-data.service';

@Injectable({ providedIn: 'root' })
export class RouterTitleStrategy extends TitleStrategy {
  private readonly titleService = inject(Title);
  private readonly shipData = inject(ShipDataService);

  override updateTitle(routerState: RouterStateSnapshot): void {
    const staticTitle = this.buildTitle(routerState);
    if (staticTitle) {
      this.titleService.setTitle(staticTitle);
      return;
    }

    // Dynamic title for ship pages — extract slug from URL
    const shipMatch = routerState.url.match(/^#?\/ships\/([^/?#]+)/);
    if (shipMatch) {
      const slug = shipMatch[1];
      const ship = this.shipData.getBySlug(slug);
      if (ship) {
        this.titleService.setTitle(`${ship.name} — Howard Hertzog WWII Photography`);
        return;
      }
    }

    this.titleService.setTitle('Howard Hertzog WWII Photography');
  }
}
