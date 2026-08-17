// src/app/features/home/fleet-grid.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { provideRouter } from '@angular/router';

import { FleetGridComponent } from './fleet-grid.component';
import { ShipDataService } from '../../core/services/ship-data.service';
import { Ship } from '../../shared/models/ship.model';

const mockShips: Ship[] = [
  {
    slug: 'uss-valley-forge',
    name: 'USS Valley Forge',
    vesselClass: 'Essex-class aircraft carrier',
    commissioned: '3 November 1946',
    fate: 'Scrapped 1971',
    narrative: ['[Content pending]'],
    sources: ['[Source pending]'],
    altText: 'USS Valley Forge — thumbnail',
    isHomepageHero: true,
  },
  {
    slug: 'uss-atlanta',
    name: 'USS Atlanta',
    vesselClass: 'Oakland-class cruiser',
    commissioned: '3 December 1944',
    fate: 'Scrapped 1970',
    narrative: ['[Content pending]'],
    sources: ['[Source pending]'],
    altText: 'USS Atlanta — thumbnail',
  },
  {
    slug: 'uss-iowa',
    name: 'USS Iowa',
    vesselClass: 'Iowa-class battleship',
    commissioned: '22 February 1943',
    fate: 'Museum ship',
    narrative: ['[Content pending]'],
    sources: ['[Source pending]'],
    altText: 'USS Iowa — thumbnail',
  },
];

describe('FleetGridComponent', () => {
  let component: FleetGridComponent;
  let fixture: ComponentFixture<FleetGridComponent>;
  let mockShipDataService: { getAll: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    mockShipDataService = { getAll: vi.fn().mockReturnValue(mockShips) };

    await TestBed.configureTestingModule({
      imports: [FleetGridComponent],
      providers: [
        { provide: ShipDataService, useValue: mockShipDataService },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FleetGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ShipDataService.getAll() exactly once on construction', () => {
    expect(mockShipDataService.getAll).toHaveBeenCalledTimes(1);
  });

  it('should render the same number of <a> anchors as ships returned by the mock', () => {
    const anchors = fixture.nativeElement.querySelectorAll('a');
    expect(anchors.length).toBe(mockShips.length);
  });

  it('should set routerLink on every anchor to ["/ships", ship.slug]', () => {
    const linkDes = fixture.debugElement.queryAll(By.directive(RouterLink));
    expect(linkDes.length).toBe(mockShips.length);
    linkDes.forEach((de, i) => {
      expect(de.nativeElement.getAttribute('href')).toBe('/ships/' + mockShips[i].slug);
    });
  });

  it('should set alt text on every <img> to "{name} — thumbnail"', () => {
    const imgs = fixture.nativeElement.querySelectorAll('img');
    expect(imgs.length).toBe(mockShips.length);
    imgs.forEach((img: HTMLImageElement, i: number) => {
      expect(img.alt).toBe(`${mockShips[i].name} — thumbnail`);
    });
  });
});
