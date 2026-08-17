// src/app/shared/components/ship-hero/ship-hero.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { ShipHeroComponent } from './ship-hero.component';
import { Ship } from '../../models/ship.model';

const STUB_SHIP: Ship = {
  slug: 'test-ship',
  name: 'Test Ship',
  altText: 'Test alt',
  vesselClass: '',
  commissioned: '',
  fate: '',
  narrative: [],
  sources: [],
};

describe('ShipHeroComponent', () => {
  let component: ShipHeroComponent;
  let fixture: ComponentFixture<ShipHeroComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShipHeroComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ShipHeroComponent);
    component = fixture.componentInstance;
    component.ship = STUB_SHIP;
    fixture.detectChanges();
    compiled = fixture.nativeElement as HTMLElement;
  });

  it('should create the component without error', () => {
    expect(component).toBeTruthy();
  });

  // --- Initial state ---

  it('should have imageLoaded as false on init', () => {
    expect(component.imageLoaded).toBe(false);
  });

  it('should have imageError as false on init', () => {
    expect(component.imageError).toBe(false);
  });

  // --- onImageLoad ---

  it('should set imageLoaded to true when onImageLoad() is called', () => {
    component.onImageLoad();
    expect(component.imageLoaded).toBe(true);
  });

  // --- onImageError ---

  it('should set imageError to true when onImageError() is called', () => {
    component.onImageError();
    expect(component.imageError).toBe(true);
  });

  // --- Default (non-error) template ---

  it('should render a <picture> element when imageError is false', () => {
    expect(component.imageError).toBe(false);
    const picture = compiled.querySelector('picture');
    expect(picture).toBeTruthy();
  });

  it('should render a <figure> without ship-hero--error class when imageError is false', () => {
    const figure = compiled.querySelector('figure');
    expect(figure).toBeTruthy();
    expect(figure?.classList.contains('ship-hero--error')).toBe(false);
  });

  it('should render the img with loading="eager"', () => {
    const img = compiled.querySelector<HTMLImageElement>('img');
    expect(img?.getAttribute('loading')).toBe('eager');
  });

  it('should derive the img src from ship.slug with .jpg extension', () => {
    const img = compiled.querySelector<HTMLImageElement>('img');
    expect(img?.getAttribute('src')).toBe('assets/images/hero/test-ship.jpg');
  });

  it('should derive the webp srcset from ship.slug with .webp extension', () => {
    const source = compiled.querySelector<HTMLSourceElement>('source[type="image/webp"]');
    expect(source?.getAttribute('srcset')).toBe('assets/images/hero/test-ship.webp');
  });

  it('should bind alt text from computedAltText when ship.altText is set', () => {
    const img = compiled.querySelector<HTMLImageElement>('img');
    expect(img?.getAttribute('alt')).toBe('Test alt');
  });

  // --- computedAltText getter ---

  it('computedAltText should return ship.altText when it is a non-placeholder non-empty string', () => {
    component.ship = { ...STUB_SHIP, altText: 'Custom alt text' };
    expect(component.computedAltText).toBe('Custom alt text');
  });

  it('computedAltText should return fallback attribution when ship.altText is the placeholder value', () => {
    component.ship = { ...STUB_SHIP, name: 'USS Valley Forge', altText: '[Alt text pending]' };
    expect(component.computedAltText).toBe(
      'USS Valley Forge, photographed by Howard Hertzog, San Francisco Bay, c. 1944–1946'
    );
  });

  it('computedAltText should return fallback attribution when ship.altText is empty or whitespace-only', () => {
    component.ship = { ...STUB_SHIP, name: 'USS Valley Forge', altText: '   ' };
    expect(component.computedAltText).toBe(
      'USS Valley Forge, photographed by Howard Hertzog, San Francisco Bay, c. 1944–1946'
    );
  });

  it('should render the ship name in a <figcaption>', () => {
    const figcaption = compiled.querySelector('figcaption');
    expect(figcaption?.textContent?.trim()).toBe('Test Ship');
  });

  it('should apply is-loaded class to img after onImageLoad()', () => {
    component.onImageLoad();
    fixture.detectChanges();
    const img = compiled.querySelector('img');
    expect(img?.classList.contains('is-loaded')).toBe(true);
  });

  it('should NOT apply is-loaded class to img before onImageLoad()', () => {
    const img = compiled.querySelector('img');
    expect(img?.classList.contains('is-loaded')).toBe(false);
  });

  // --- Error state template ---

  it('should render .ship-hero--error when imageError is true', () => {
    component.onImageError();
    fixture.detectChanges();
    const figure = compiled.querySelector('figure');
    expect(figure?.classList.contains('ship-hero--error')).toBe(true);
  });

  it('should render "Image unavailable" text when imageError is true', () => {
    component.onImageError();
    fixture.detectChanges();
    const errorText = compiled.querySelector('.ship-hero__error-text');
    expect(errorText?.textContent?.trim()).toBe('Image unavailable');
  });

  it('should NOT render a <picture> element when imageError is true', () => {
    component.onImageError();
    fixture.detectChanges();
    const picture = compiled.querySelector('picture');
    expect(picture).toBeNull();
  });

  it('should still render the ship name in figcaption when imageError is true', () => {
    component.onImageError();
    fixture.detectChanges();
    const figcaption = compiled.querySelector('figcaption');
    expect(figcaption?.textContent?.trim()).toBe('Test Ship');
  });
});
