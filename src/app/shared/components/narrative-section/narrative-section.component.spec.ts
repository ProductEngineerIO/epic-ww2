import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NarrativeSectionComponent } from './narrative-section.component';
import { Ship } from '../../models/ship.model';

const baseShip: Ship = {
  slug: 'test-ship',
  name: 'Test Ship',
  vesselClass: 'Test Class',
  commissioned: '1 January 1944',
  fate: 'Scrapped 1960',
  narrative: [],
  sources: [],
  altText: 'A test ship at sea.',
};

describe('NarrativeSectionComponent', () => {
  let component: NarrativeSectionComponent;
  let fixture: ComponentFixture<NarrativeSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NarrativeSectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NarrativeSectionComponent);
    component = fixture.componentInstance;
  });

  // --- isPending getter ---

  it('isPending returns true for empty narrative array', () => {
    component.ship = { ...baseShip, narrative: [] };
    expect(component.isPending).toBe(true);
  });

  it('isPending returns true when all entries are [Content pending]', () => {
    component.ship = { ...baseShip, narrative: ['[Content pending]', '[Content pending]'] };
    expect(component.isPending).toBe(true);
  });

  it('isPending returns false when at least one entry is real content', () => {
    component.ship = { ...baseShip, narrative: ['[Content pending]', 'The ship sailed north.'] };
    expect(component.isPending).toBe(false);
  });

  // --- caveats getter ---

  it('caveats returns fallback text when sources is empty', () => {
    component.ship = { ...baseShip, sources: [] };
    expect(component.caveats).toBe(
      'Historical details sourced from historical sources. Accuracy not guaranteed.'
    );
  });

  it('caveats returns fallback text when sources[0] is [Source pending]', () => {
    component.ship = { ...baseShip, sources: ['[Source pending]'] };
    expect(component.caveats).toBe(
      'Historical details sourced from historical sources. Accuracy not guaranteed.'
    );
  });

  it('caveats returns source-formatted text when sources[0] is a real citation', () => {
    component.ship = { ...baseShip, sources: ['Naval History and Heritage Command'] };
    expect(component.caveats).toBe(
      'Historical details sourced from Naval History and Heritage Command. Accuracy not guaranteed.'
    );
  });

  // --- Template rendering ---

  it('renders narrative__pending when isPending is true', () => {
    component.ship = { ...baseShip, narrative: [] };
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.narrative__pending')).not.toBeNull();
    expect(el.querySelector('.narrative__pending')?.textContent?.trim()).toBe('Content pending');
  });

  it('does not render narrative__pending when isPending is false', () => {
    component.ship = { ...baseShip, narrative: ['The convoy steamed east.'] };
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.narrative__pending')).toBeNull();
  });

  it('renders @for paragraphs when isPending is false', () => {
    component.ship = { ...baseShip, narrative: ['First paragraph.', 'Second paragraph.'] };
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    const paras = el.querySelectorAll('.narrative__para');
    expect(paras.length).toBe(2);
    expect(paras[0].textContent?.trim()).toBe('First paragraph.');
    expect(paras[1].textContent?.trim()).toBe('Second paragraph.');
  });

  it('caveat <p> is always rendered when isPending is true', () => {
    component.ship = { ...baseShip, narrative: [] };
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.narrative__caveat')).not.toBeNull();
  });

  it('caveat <p> is always rendered when isPending is false', () => {
    component.ship = { ...baseShip, narrative: ['The ship sailed north.'] };
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.narrative__caveat')).not.toBeNull();
  });
});
