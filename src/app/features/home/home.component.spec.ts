import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { HomeComponent } from './home.component';
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
    altText: 'USS Valley Forge, photographed by Howard Hertzog, San Francisco Bay, c. 1944–1946',
    isHomepageHero: true,
  },
  {
    slug: 'uss-leyte',
    name: 'USS Leyte',
    vesselClass: 'Essex-class aircraft carrier',
    commissioned: '11 April 1946',
    fate: 'Scrapped 1970',
    narrative: [],
    sources: [],
    altText: 'USS Leyte, photographed by Howard Hertzog, San Francisco Bay, c. 1944–1946',
  },
];

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockShipDataService: { getAll: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    mockShipDataService = { getAll: vi.fn().mockReturnValue(mockShips) };

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        { provide: ShipDataService, useValue: mockShipDataService },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render app-homepage-hero', () => {
    expect(fixture.nativeElement.querySelector('app-homepage-hero')).toBeTruthy();
  });

  it('should render app-fleet-grid', () => {
    expect(fixture.nativeElement.querySelector('app-fleet-grid')).toBeTruthy();
  });

  it('should have a single h1 element', () => {
    expect(fixture.nativeElement.querySelectorAll('h1').length).toBe(1);
  });

  it('h1 should include Howard Hertzog', () => {
    expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Howard Hertzog');
  });

  it('intro section should mention San Francisco Bay', () => {
    expect(fixture.nativeElement.textContent).toContain('San Francisco Bay');
  });

  it('intro section should mention 1944', () => {
    expect(fixture.nativeElement.textContent).toContain('1944');
  });

  it('should render app-homepage-hero before app-fleet-grid in DOM', () => {
    const hero = fixture.nativeElement.querySelector('app-homepage-hero');
    const grid = fixture.nativeElement.querySelector('app-fleet-grid');
    expect(hero).toBeTruthy();
    expect(grid).toBeTruthy();
    // DOCUMENT_POSITION_FOLLOWING = 4 means grid comes after hero
    expect(hero.compareDocumentPosition(grid) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
