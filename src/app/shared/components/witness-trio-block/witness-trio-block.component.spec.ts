// src/app/shared/components/witness-trio-block/witness-trio-block.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { WitnessTrioBlockComponent } from './witness-trio-block.component';
import { Ship } from '../../models/ship.model';

const baseShip: Ship = {
  slug: 'uss-test',
  name: 'USS Test',
  vesselClass: 'Test-class',
  commissioned: '1 January 1944',
  fate: 'Scrapped 1950',
  narrative: ['A real paragraph about the ship.'],
  sources: ['Naval History and Heritage Command'],
  altText: 'A test ship in the bay',
};

describe('WitnessTrioBlockComponent', () => {
  let component: WitnessTrioBlockComponent;
  let fixture: ComponentFixture<WitnessTrioBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WitnessTrioBlockComponent],
      // NO_ERRORS_SCHEMA silences unknown child component elements (DossierCard, etc.)
      // so we test WitnessTrioBlock in isolation without pulling in child component deps.
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WitnessTrioBlockComponent);
    component = fixture.componentInstance;
  });

  // --- narrativePending getter ---

  it('narrativePending returns true for an empty narrative array', () => {
    component.ship = { ...baseShip, narrative: [] };
    expect(component.narrativePending).toBeTrue();
  });

  it('narrativePending returns true when all entries equal "[Content pending]"', () => {
    component.ship = { ...baseShip, narrative: ['[Content pending]', '[Content pending]'] };
    expect(component.narrativePending).toBeTrue();
  });

  it('narrativePending returns false when at least one entry is real content', () => {
    component.ship = { ...baseShip, narrative: ['[Content pending]', 'Real narrative paragraph.'] };
    expect(component.narrativePending).toBeFalse();
  });

  // --- ngOnInit warnings ---

  it('ngOnInit calls console.warn for narrative when narrativePending is true', () => {
    component.ship = { ...baseShip, narrative: [] };
    spyOn(console, 'warn');
    component.ngOnInit();
    expect(console.warn).toHaveBeenCalledWith(
      `WitnessTrioBlock: narrative missing for slug "${component.ship.slug}"`
    );
  });

  it('ngOnInit calls console.warn for fate when ship.fate equals "[Content pending]"', () => {
    component.ship = { ...baseShip, fate: '[Content pending]' };
    spyOn(console, 'warn');
    component.ngOnInit();
    expect(console.warn).toHaveBeenCalledWith(
      `WitnessTrioBlock: fate missing for slug "${component.ship.slug}"`
    );
  });

  it('ngOnInit calls console.warn for fate when ship.fate is falsy', () => {
    component.ship = { ...baseShip, fate: '' };
    spyOn(console, 'warn');
    component.ngOnInit();
    expect(console.warn).toHaveBeenCalledWith(
      `WitnessTrioBlock: fate missing for slug "${component.ship.slug}"`
    );
  });

  it('ngOnInit does not call console.warn when both narrative and fate are populated', () => {
    component.ship = { ...baseShip };
    spyOn(console, 'warn');
    component.ngOnInit();
    expect(console.warn).not.toHaveBeenCalled();
  });

  // --- Template rendering ---

  it('always renders app-attribution-caption regardless of data state', () => {
    component.ship = { ...baseShip, narrative: [], fate: '' };
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('app-attribution-caption')).not.toBeNull();
  });

  it('always renders app-dossier-card regardless of data state', () => {
    component.ship = { ...baseShip, narrative: [], fate: '' };
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('app-dossier-card')).not.toBeNull();
  });

  it('always renders app-narrative-section regardless of data state', () => {
    component.ship = { ...baseShip, narrative: [], fate: '' };
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('app-narrative-section')).not.toBeNull();
  });

  it('renders all three child component selectors even when all data is populated', () => {
    component.ship = { ...baseShip };
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('app-attribution-caption')).not.toBeNull();
    expect(el.querySelector('app-dossier-card')).not.toBeNull();
    expect(el.querySelector('app-narrative-section')).not.toBeNull();
  });

  it('renders child components in DOM order: Attribution → Dossier → Narrative', () => {
    component.ship = { ...baseShip };
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    const children = el.querySelector('.trio')?.children;
    expect(children).toBeTruthy();
    expect(children![0].tagName.toLowerCase()).toBe('app-attribution-caption');
    expect(children![1].tagName.toLowerCase()).toBe('app-dossier-card');
    expect(children![2].tagName.toLowerCase()).toBe('app-narrative-section');
  });
});
