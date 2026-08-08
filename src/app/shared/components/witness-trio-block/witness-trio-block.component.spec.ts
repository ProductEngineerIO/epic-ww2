// src/app/shared/components/witness-trio-block/witness-trio-block.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { WitnessTrioBlockComponent } from './witness-trio-block.component';
import { Ship } from '../../models/ship.model';

const baseShip: Ship = {
  slug: 'uss-test',
  name: 'USS Test',
  vesselClass: 'Essex-class aircraft carrier',
  commissioned: '1 January 1944',
  fate: 'Scrapped 1960',
  narrative: ['The ship sailed north.', 'It arrived safely.'],
  sources: ['Naval History and Heritage Command'],
  altText: 'USS Test at anchor.',
};

describe('WitnessTrioBlockComponent', () => {
  let component: WitnessTrioBlockComponent;
  let fixture: ComponentFixture<WitnessTrioBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WitnessTrioBlockComponent],
      // NO_ERRORS_SCHEMA stubs out child components so we can test the trio wrapper in isolation
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WitnessTrioBlockComponent);
    component = fixture.componentInstance;
  });

  // --- narrativePending getter ---

  describe('narrativePending getter', () => {
    it('returns true for an empty narrative array', () => {
      component.ship = { ...baseShip, narrative: [] };
      expect(component.narrativePending).toBe(true);
    });

    it('returns true when all entries equal "[Content pending]"', () => {
      component.ship = { ...baseShip, narrative: ['[Content pending]', '[Content pending]'] };
      expect(component.narrativePending).toBe(true);
    });

    it('returns false when at least one entry is real content', () => {
      component.ship = { ...baseShip, narrative: ['[Content pending]', 'The ship sailed north.'] };
      expect(component.narrativePending).toBe(false);
    });

    it('returns false when all entries are real content', () => {
      component.ship = { ...baseShip, narrative: ['The ship sailed north.', 'It arrived safely.'] };
      expect(component.narrativePending).toBe(false);
    });
  });

  // --- ngOnInit warning checks ---

  describe('ngOnInit', () => {
    let warnSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('calls console.warn for narrative when narrativePending is true (empty array)', () => {
      component.ship = { ...baseShip, narrative: [] };
      component.ngOnInit();
      expect(warnSpy).toHaveBeenCalledWith(
        `WitnessTrioBlock: narrative missing for slug "${baseShip.slug}"`
      );
    });

    it('calls console.warn for narrative when all entries are "[Content pending]"', () => {
      component.ship = { ...baseShip, narrative: ['[Content pending]'] };
      component.ngOnInit();
      expect(warnSpy).toHaveBeenCalledWith(
        `WitnessTrioBlock: narrative missing for slug "${baseShip.slug}"`
      );
    });

    it('calls console.warn for fate when ship.fate equals "[Content pending]"', () => {
      component.ship = { ...baseShip, fate: '[Content pending]', narrative: ['Real content.'] };
      component.ngOnInit();
      expect(warnSpy).toHaveBeenCalledWith(
        `WitnessTrioBlock: fate missing for slug "${baseShip.slug}"`
      );
    });

    it('calls console.warn for fate when ship.fate is falsy (empty string)', () => {
      component.ship = { ...baseShip, fate: '', narrative: ['Real content.'] };
      component.ngOnInit();
      expect(warnSpy).toHaveBeenCalledWith(
        `WitnessTrioBlock: fate missing for slug "${baseShip.slug}"`
      );
    });

    it('does not call console.warn when both narrative and fate are fully populated', () => {
      component.ship = { ...baseShip };
      component.ngOnInit();
      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('calls both warnings when both narrative and fate are missing', () => {
      component.ship = { ...baseShip, narrative: [], fate: '[Content pending]' };
      component.ngOnInit();
      expect(warnSpy).toHaveBeenCalledTimes(2);
      expect(warnSpy).toHaveBeenCalledWith(
        `WitnessTrioBlock: narrative missing for slug "${baseShip.slug}"`
      );
      expect(warnSpy).toHaveBeenCalledWith(
        `WitnessTrioBlock: fate missing for slug "${baseShip.slug}"`
      );
    });
  });

  // --- Template rendering ---

  describe('template', () => {
    it('always renders app-attribution-caption regardless of data state', () => {
      component.ship = { ...baseShip, narrative: [], fate: '[Content pending]' };
      fixture.detectChanges();
      const el: HTMLElement = fixture.nativeElement;
      expect(el.querySelector('app-attribution-caption')).not.toBeNull();
    });

    it('always renders app-dossier-card regardless of data state', () => {
      component.ship = { ...baseShip, narrative: [], fate: '[Content pending]' };
      fixture.detectChanges();
      const el: HTMLElement = fixture.nativeElement;
      expect(el.querySelector('app-dossier-card')).not.toBeNull();
    });

    it('always renders app-narrative-section regardless of data state', () => {
      component.ship = { ...baseShip, narrative: [], fate: '[Content pending]' };
      fixture.detectChanges();
      const el: HTMLElement = fixture.nativeElement;
      expect(el.querySelector('app-narrative-section')).not.toBeNull();
    });

    it('renders all three child component selectors when data is fully populated', () => {
      component.ship = { ...baseShip };
      fixture.detectChanges();
      const el: HTMLElement = fixture.nativeElement;
      expect(el.querySelector('app-attribution-caption')).not.toBeNull();
      expect(el.querySelector('app-dossier-card')).not.toBeNull();
      expect(el.querySelector('app-narrative-section')).not.toBeNull();
    });

    it('renders child components in correct DOM order: Attribution → Dossier → Narrative', () => {
      component.ship = { ...baseShip };
      fixture.detectChanges();
      const el: HTMLElement = fixture.nativeElement;
      const children = el.querySelector('.trio')?.children;
      expect(children).toBeTruthy();
      expect(children![0].tagName.toLowerCase()).toBe('app-attribution-caption');
      expect(children![1].tagName.toLowerCase()).toBe('app-dossier-card');
      expect(children![2].tagName.toLowerCase()).toBe('app-narrative-section');
    });

    it('wraps children in a .trio div container', () => {
      component.ship = { ...baseShip };
      fixture.detectChanges();
      const el: HTMLElement = fixture.nativeElement;
      expect(el.querySelector('.trio')).not.toBeNull();
    });
  });
});
