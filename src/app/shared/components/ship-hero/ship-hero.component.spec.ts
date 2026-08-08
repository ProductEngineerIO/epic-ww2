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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShipHeroComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ShipHeroComponent);
    component = fixture.componentInstance;
    component.ship = STUB_SHIP;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initial state', () => {
    it('should have imageLoaded as false on init', () => {
      expect(component.imageLoaded).toBeFalse();
    });

    it('should have imageError as false on init', () => {
      expect(component.imageError).toBeFalse();
    });
  });

  describe('onImageLoad()', () => {
    it('should set imageLoaded to true', () => {
      component.onImageLoad();
      expect(component.imageLoaded).toBeTrue();
    });
  });

  describe('onImageError()', () => {
    it('should set imageError to true', () => {
      component.onImageError();
      expect(component.imageError).toBeTrue();
    });
  });

  describe('default template (no error)', () => {
    it('should render a <picture> element when imageError is false', () => {
      expect(component.imageError).toBeFalse();
      const picture = fixture.nativeElement.querySelector('picture');
      expect(picture).not.toBeNull();
    });

    it('should not render the error state element', () => {
      const errorState = fixture.nativeElement.querySelector('.ship-hero--error');
      expect(errorState).toBeNull();
    });

    it('should set the img src from ship.slug', () => {
      const img: HTMLImageElement = fixture.nativeElement.querySelector('img');
      expect(img.getAttribute('src')).toContain('test-ship');
    });

    it('should set the img alt from ship.altText', () => {
      const img: HTMLImageElement = fixture.nativeElement.querySelector('img');
      expect(img.getAttribute('alt')).toBe('Test alt');
    });

    it('should set loading="eager" on the img', () => {
      const img: HTMLImageElement = fixture.nativeElement.querySelector('img');
      expect(img.getAttribute('loading')).toBe('eager');
    });

    it('should render the ship name in the figcaption', () => {
      const figcaption = fixture.nativeElement.querySelector('figcaption');
      expect(figcaption.textContent.trim()).toBe('Test Ship');
    });

    it('should add is-loaded class to img after onImageLoad()', () => {
      component.onImageLoad();
      fixture.detectChanges();
      const img = fixture.nativeElement.querySelector('img');
      expect(img.classList.contains('is-loaded')).toBeTrue();
    });
  });

  describe('error template', () => {
    beforeEach(() => {
      component.onImageError();
      fixture.detectChanges();
    });

    it('should render the .ship-hero--error element', () => {
      const errorFigure = fixture.nativeElement.querySelector('.ship-hero--error');
      expect(errorFigure).not.toBeNull();
    });

    it('should display "Image unavailable" text', () => {
      const errorText = fixture.nativeElement.querySelector('.ship-hero__error-text');
      expect(errorText).not.toBeNull();
      expect(errorText.textContent.trim()).toBe('Image unavailable');
    });

    it('should not render a <picture> element in the error state', () => {
      const picture = fixture.nativeElement.querySelector('picture');
      expect(picture).toBeNull();
    });

    it('should still render the ship name in the figcaption', () => {
      const figcaption = fixture.nativeElement.querySelector('figcaption');
      expect(figcaption.textContent.trim()).toBe('Test Ship');
    });
  });
});
