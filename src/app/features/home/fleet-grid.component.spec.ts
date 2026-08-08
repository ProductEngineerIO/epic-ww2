// src/app/features/home/fleet-grid.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { FleetGridComponent } from './fleet-grid.component';
import { ShipDataService } from '../../core/services/ship-data.service';
import { Ship } from '../../shared/models/ship.model';

const mockShips: Ship[] = [
  {
    slug: 'uss-valley-forge',
    name: 'USS Valley Forge',
    vesselClass: 'Essex-class aircraft carrier',
    commissioned: '3 November 1946',
    fate: 'Scrapped 1970',
    narrative: [],
    sources: [],
    altText: 'USS Valley Forge',
  },
  {
    slug: 'uss-leyte',
    name: 'USS Leyte',
    vesselClass: 'Essex-class aircraft carrier',
    commissioned: '11 April 1946',
    fate: 'Scrapped 1970',
    narrative: [],
    sources: [],
    altText: 'USS Leyte',
  },
  {
    slug: 'uss-philippine-sea',
    name: 'USS Philippine Sea',
    vesselClass: 'Essex-class aircraft carrier',
    commissioned: '11 May 1946',
    fate: 'Scrapped 1958',
    narrative: [],
    sources: [],
    altText: 'USS Philippine Sea',
  },
];

describe('FleetGridComponent', () => {
  let fixture: ComponentFixture<FleetGridComponent>;
  let mockShipDataService: { getAll: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    mockShipDataService = { getAll: vi.fn().mockReturnValue(mockShips) };

    await TestBed.configureTestingModule({
      imports: [FleetGridComponent, RouterTestingModule],
      providers: [
        { provide: ShipDataService, useValue: mockShipDataService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FleetGridComponent);
    fixture.detectChanges();
  });

  it('should create successfully', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should call ShipDataService.getAll() exactly once on construction', () => {
    expect(mockShipDataService.getAll).toHaveBeenCalledTimes(1);
  });

  it('should render the same number of <a> anchors as ships in the mock', () => {
    const anchors: NodeListOf<HTMLAnchorElement> =
      fixture.nativeElement.querySelectorAll('a');
    expect(anchors.length).toBe(mockShips.length);
  });

  it('should set every anchor routerLink to ["/ships", ship.slug]', () => {
    const anchors: NodeListOf<HTMLAnchorElement> =
      fixture.nativeElement.querySelectorAll('a');
    anchors.forEach((anchor, i) => {
      expect(anchor.getAttribute('href')).toBe('/ships/' + mockShips[i].slug);
    });
  });

  it('should set the first <img> alt text to "{name} — thumbnail" format', () => {
    const img: HTMLImageElement = fixture.nativeElement.querySelector('img');
    expect(img.getAttribute('alt')).toBe(`${mockShips[0].name} — thumbnail`);
  });

  it('should set every <img> alt text to "{name} — thumbnail" format', () => {
    const imgs: NodeListOf<HTMLImageElement> =
      fixture.nativeElement.querySelectorAll('img');
    imgs.forEach((img, i) => {
      expect(img.getAttribute('alt')).toBe(`${mockShips[i].name} — thumbnail`);
    });
  });
});
