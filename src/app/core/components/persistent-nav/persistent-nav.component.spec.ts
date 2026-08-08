// src/app/core/components/persistent-nav/persistent-nav.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterLinkActive, provideRouter } from '@angular/router';

import { PersistentNavComponent } from './persistent-nav.component';

describe('PersistentNavComponent', () => {
  let component: PersistentNavComponent;
  let fixture: ComponentFixture<PersistentNavComponent>;
  let nativeEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersistentNavComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PersistentNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    nativeEl = fixture.nativeElement;
  });

  // AC-1: component creates without error
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // AC-1: nav landmark with accessible label
  it('should render a <nav> with aria-label="Site navigation"', () => {
    const nav = nativeEl.querySelector('nav[aria-label="Site navigation"]');
    expect(nav).toBeTruthy();
  });

  // AC-1: site title text
  it('should render the site title link text "Howard Hertzog — WWII Photography"', () => {
    const titleLink = nativeEl.querySelector('.nav__title');
    expect(titleLink?.textContent?.trim())
      .toBe('Howard Hertzog — WWII Photography');
  });

  // AC-8: site title link aria-label contains "Home"
  it('should have an aria-label containing "Home" on the site title link', () => {
    const titleLink = nativeEl.querySelector('.nav__title');
    expect(titleLink?.getAttribute('aria-label'))
      .toContain('Home');
  });

  // AC-3: Fleet link exists with href pointing to root
  it('should render a Fleet link with href="/"', () => {
    const links = Array.from(nativeEl.querySelectorAll<HTMLAnchorElement>('.nav__link'));
    const fleetLink = links.find(l => l.textContent?.trim() === 'Fleet');
    expect(fleetLink).toBeTruthy();
    expect(fleetLink?.getAttribute('href'))
      .toBe('/');
  });

  // AC-4: About Howard link exists with href pointing to /about
  it('should render an About Howard link with href="/about"', () => {
    const links = Array.from(nativeEl.querySelectorAll<HTMLAnchorElement>('.nav__link'));
    const aboutLink = links.find(l => l.textContent?.trim() === 'About Howard');
    expect(aboutLink).toBeTruthy();
    expect(aboutLink?.getAttribute('href'))
      .toBe('/about');
  });

  // AC-1: exactly two nav links
  it('should render exactly 2 .nav__link elements', () => {
    const links = nativeEl.querySelectorAll('.nav__link');
    expect(links.length).toBe(2);
  });

  // Accessibility: list semantics for Safari VoiceOver
  it('should have role="list" on .nav__links', () => {
    const navLinks = nativeEl.querySelector('.nav__links');
    expect(navLinks?.getAttribute('role'))
      .toBe('list');
  });

  // AC-11: Fleet link must use exact matching so it never activates on non-root routes
  it('should set routerLinkActiveOptions { exact: true } on the Fleet link', () => {
    const navLinkEls = fixture.debugElement.queryAll(By.css('.nav__link'));
    const fleetDebugEl = navLinkEls.find(
      el => (el.nativeElement as HTMLElement).textContent?.trim() === 'Fleet'
    );
    expect(fleetDebugEl)
      .toBeTruthy();

    const rla = fleetDebugEl!.injector.get(RouterLinkActive);
    expect(rla.routerLinkActiveOptions)
      .toEqual({ exact: true });
  });
});
