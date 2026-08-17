// src/app/core/components/persistent-nav/persistent-nav.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterLinkActive, provideRouter } from '@angular/router';

import { PersistentNavComponent } from './persistent-nav.component';

describe('PersistentNavComponent', () => {
  let component: PersistentNavComponent;
  let fixture: ComponentFixture<PersistentNavComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersistentNavComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PersistentNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.nativeElement as HTMLElement;
  });

  it('should create the component without error', () => {
    expect(component).toBeTruthy();
  });

  it('should render <nav> with aria-label="Site navigation"', () => {
    const nav = compiled.querySelector('nav');
    expect(nav).toBeTruthy();
    expect(nav?.getAttribute('aria-label')).toBe('Site navigation');
  });

  it('should render the site title with text "Howard Hertzog — WWII Photography"', () => {
    const titleLink = compiled.querySelector('.nav__title');
    expect(titleLink).toBeTruthy();
    expect(titleLink?.textContent?.trim()).toBe('Howard Hertzog — WWII Photography');
  });

  it('should render the site title link pointing to /', () => {
    const titleLink = compiled.querySelector<HTMLAnchorElement>('.nav__title');
    expect(titleLink?.getAttribute('href')).toBe('/');
  });

  it('should render the Fleet link with text "Fleet" and href "/"', () => {
    const links = compiled.querySelectorAll<HTMLAnchorElement>('.nav__link');
    const fleetLink = Array.from(links).find(l => l.textContent?.trim() === 'Fleet');
    expect(fleetLink).toBeTruthy();
    expect(fleetLink?.getAttribute('href')).toBe('/');
  });

  it('should render the About Howard link with text "About Howard" and href "/about"', () => {
    const links = compiled.querySelectorAll<HTMLAnchorElement>('.nav__link');
    const aboutLink = Array.from(links).find(l => l.textContent?.trim() === 'About Howard');
    expect(aboutLink).toBeTruthy();
    expect(aboutLink?.getAttribute('href')).toBe('/about');
  });

  it('should render exactly 2 .nav__link elements', () => {
    const links = compiled.querySelectorAll('.nav__link');
    expect(links.length).toBe(2);
  });

  it('should render .nav__links with role="list"', () => {
    const navLinks = compiled.querySelector('.nav__links');
    expect(navLinks).toBeTruthy();
    expect(navLinks?.getAttribute('role')).toBe('list');
  });

  it('should have an aria-label containing "Home" on the site title link', () => {
    const titleLink = compiled.querySelector('.nav__title');
    const ariaLabel = titleLink?.getAttribute('aria-label') ?? '';
    expect(ariaLabel.toLowerCase()).toContain('home');
  });

  it('should have routerLinkActiveOptions set to { exact: true } on the Fleet link', () => {
    const links = compiled.querySelectorAll<HTMLAnchorElement>('.nav__link');
    const fleetLink = Array.from(links).find(l => l.textContent?.trim() === 'Fleet');
    // If exact: true is NOT set, the Fleet link would match every route including /about.
    // Inspect the RouterLinkActive directive instance via the debug element injector.
    const debugEl = fixture.debugElement.queryAll(
      el => el.nativeElement === fleetLink
    )[0];
    const rla = debugEl?.injector?.get(RouterLinkActive, null);
    expect(rla).toBeTruthy();
    expect((rla as RouterLinkActive).routerLinkActiveOptions).toEqual({ exact: true });
  });
});
