import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomepageHeroComponent } from './homepage-hero.component';
import { ShipDataService } from '../../../core/services/ship-data.service';
import { Ship } from '../../models/ship.model';

const heroShip: Ship = {
  slug: 'uss-valley-forge',
  name: 'USS Valley Forge',
  vesselClass: 'Essex-class',
  commissioned: 'November 3, 1946',
  fate: 'Decommissioned 1980',
  narrative: ['[Content pending]'],
  sources: ['[Source pending]'],
  altText: 'USS Valley Forge in San Francisco Bay, photographed by Howard Hertzog, c. 1944-1946.',
  isHomepageHero: true,
};

const nonHeroShip: Ship = {
  slug: 'uss-atlanta',
  name: 'USS Atlanta',
  vesselClass: 'Oakland-class',
  commissioned: 'December 3, 1944',
  fate: 'Scrapped 1970',
  narrative: ['[Content pending]'],
  sources: ['[Source pending]'],
  altText: 'USS Atlanta in San Francisco Bay.',
};

describe('HomepageHeroComponent', () => {
  let component: HomepageHeroComponent;
  let fixture: ComponentFixture<HomepageHeroComponent>;
  let mockShipDataService: jasmine.SpyObj<ShipDataService>;

  beforeEach(async () => {
    mockShipDataService = jasmine.createSpyObj('ShipDataService', ['getAll']);
    mockShipDataService.getAll.and.returnValue([nonHeroShip, heroShip]);

    await TestBed.configureTestingModule({
      imports: [HomepageHeroComponent],
      providers: [
        { provide: ShipDataService, useValue: mockShipDataService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomepageHeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have imageLoaded false on init', () => {
    expect(component.imageLoaded).toBeFalse();
  });

  it('should set imageLoaded to true when onImageLoad is called', () => {
    component.onImageLoad();
    expect(component.imageLoaded).toBeTrue();
  });

  it('should have imageError false on init', () => {
    expect(component.imageError).toBeFalse();
  });

  it('should set imageError to true when onImageError is called', () => {
    component.onImageError();
    expect(component.imageError).toBeTrue();
  });

  it('should find the ship with isHomepageHero true', () => {
    expect(component.ship).toEqual(heroShip);
  });

  it('should render a <picture> element in default state', () => {
    const picture = fixture.nativeElement.querySelector('picture');
    expect(picture).toBeTruthy();
  });

  it('should render error text when imageError is true', () => {
    component.imageError = true;
    fixture.detectChanges();
    const errorText = fixture.nativeElement.querySelector('.homepage-hero__error-text');
    expect(errorText?.textContent?.trim()).toBe('Image unavailable');
  });

  it('should construct alt text from ship name, not ship.altText', () => {
    const img = fixture.nativeElement.querySelector('img');
    expect(img?.alt).toBe('USS Valley Forge, photographed by Howard Hertzog');
  });

  it('should NOT render ship name overlay (no figcaption with name)', () => {
    const figcaption = fixture.nativeElement.querySelector('figcaption');
    expect(figcaption).toBeNull();
  });

  it('should render nothing when no ship has isHomepageHero: true', async () => {
    mockShipDataService.getAll.and.returnValue([nonHeroShip]);
    fixture = TestBed.createComponent(HomepageHeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.ship).toBeNull();
    const figure = fixture.nativeElement.querySelector('figure');
    expect(figure).toBeNull();
  });
});
