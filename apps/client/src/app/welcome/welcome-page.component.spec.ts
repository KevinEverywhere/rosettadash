import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import {
  ACTIVE_STACK_KEY,
  BUILDER_SESSION_KEY,
  PENDING_STACK_KEY,
} from './stack-profile-session';
import { WelcomePageComponent } from './welcome-page.component';

function expandSection(fixture: ComponentFixture<WelcomePageComponent>, section: string): void {
  const toggle = fixture.nativeElement.querySelector(`[data-testid="stack-section-toggle-${section}"]`);
  if (toggle && toggle.getAttribute('aria-expanded') !== 'true') {
    toggle.click();
    fixture.detectChanges();
  }
}

function selectReact(fixture: ComponentFixture<WelcomePageComponent>): void {
  expandSection(fixture, 'ui');
  fixture.nativeElement.querySelector('[data-testid="stack-ui-react"]').click();
  fixture.detectChanges();
}

describe('WelcomePageComponent', () => {
  let fixture: ComponentFixture<WelcomePageComponent>;
  let router: Router;

  beforeEach(async () => {
    sessionStorage.clear();

    await TestBed.configureTestingModule({
      imports: [WelcomePageComponent],
      providers: [
        provideRouter([
          { path: '', component: WelcomePageComponent },
          { path: 'builder', component: WelcomePageComponent },
        ]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WelcomePageComponent);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('starts with collapsed stack sections and no pre-selected labels', () => {
    expect(fixture.nativeElement.querySelector('[data-testid="welcome-heading"]')?.textContent).toContain(
      'Build Components and Dashboards for your stack',
    );
    expect(fixture.nativeElement.querySelector('[data-testid="welcome-framework-prompt"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('[data-testid="stack-section-panel-ui"]')).toBeFalsy();
    expect(fixture.nativeElement.querySelector('[data-testid="stack-section-toggle-server"]')).toBeFalsy();
    expect((fixture.nativeElement.querySelector('[data-testid="welcome-continue"]') as HTMLButtonElement).disabled).toBe(true);
  });

  it('enables continue after selecting a UI framework', () => {
    selectReact(fixture);
    expect((fixture.nativeElement.querySelector('[data-testid="welcome-continue"]') as HTMLButtonElement).disabled).toBe(false);
    expect(fixture.nativeElement.querySelector('[data-testid="stack-section-toggle-server"]')).toBeTruthy();
  });

  it('shows scratch-pad note when Any is selected', () => {
    expandSection(fixture, 'ui');
    fixture.nativeElement.querySelector('[data-testid="stack-ui-any"]').click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-testid="stack-scratch-note"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('[data-testid="stack-section-toggle-server"]')).toBeFalsy();
  });

  it('shows framework-filtered styling options when styling section is expanded', () => {
    selectReact(fixture);
    expandSection(fixture, 'styling');

    expect(fixture.nativeElement.querySelector('[data-testid="stack-styling-authoring-css-modules"]')).toBeTruthy();
    expect(
      fixture.nativeElement.querySelector('[data-testid="stack-styling-authoring-styled-components"]'),
    ).toBeTruthy();

    fixture.nativeElement.querySelector('[data-testid="stack-ui-any"]').click();
    fixture.detectChanges();
    expandSection(fixture, 'styling');

    expect(
      fixture.nativeElement.querySelector('[data-testid="stack-styling-authoring-styled-components"]'),
    ).toBeFalsy();
    expect(fixture.nativeElement.querySelector('[data-testid="stack-styling-authoring-css-modules"]')).toBeTruthy();
  });

  it('filters component libraries by UI framework', () => {
    selectReact(fixture);
    expandSection(fixture, 'styling');
    expect(fixture.nativeElement.querySelector('[data-testid="stack-styling-library-mui"]')).toBeTruthy();

    fixture.nativeElement.querySelector('[data-testid="stack-ui-angular"]').click();
    fixture.detectChanges();
    expandSection(fixture, 'styling');

    expect(fixture.nativeElement.querySelector('[data-testid="stack-styling-library-mui"]')).toBeFalsy();
    expect(
      fixture.nativeElement.querySelector('[data-testid="stack-styling-library-angular-material"]'),
    ).toBeTruthy();
  });

  it('offers None for server and database when sections are expanded', () => {
    selectReact(fixture);
    expandSection(fixture, 'server');
    expandSection(fixture, 'database');

    expect(fixture.nativeElement.querySelector('[data-testid="stack-server-none"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('[data-testid="stack-database-none"]')).toBeTruthy();
  });

  it('persists None server and database in pending stack profile', async () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    selectReact(fixture);
    expandSection(fixture, 'server');
    expandSection(fixture, 'database');
    fixture.nativeElement.querySelector('[data-testid="stack-server-none"]').click();
    fixture.nativeElement.querySelector('[data-testid="stack-database-none"]').click();
    fixture.detectChanges();
    fixture.nativeElement.querySelector('[data-testid="welcome-continue"]').click();

    expect(JSON.parse(sessionStorage.getItem(PENDING_STACK_KEY) ?? '{}')).toEqual({
      ui: 'react',
      server: 'none',
      database: 'none',
      styling: {
        foundation: ['tailwind'],
        authoring: ['css-modules'],
        inlineStyles: true,
      },
    });
    expect(navigateSpy).toHaveBeenCalledWith(['/builder']);
  });

  it('stores pending stack profile and navigates to builder', async () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    expandSection(fixture, 'ui');
    fixture.nativeElement.querySelector('[data-testid="stack-ui-svelte"]').click();
    fixture.detectChanges();
    fixture.nativeElement.querySelector('[data-testid="welcome-continue"]').click();

    const pending = JSON.parse(sessionStorage.getItem(PENDING_STACK_KEY) ?? '{}');
    expect(pending).toEqual({
      ui: 'svelte',
      server: 'nest',
      database: 'postgresql',
      styling: {
        foundation: ['tailwind'],
        authoring: ['plain-css'],
        inlineStyles: true,
      },
    });
    expect(navigateSpy).toHaveBeenCalledWith(['/builder']);
  });

  it('stays on welcome when a builder session exists', () => {
    sessionStorage.setItem(
      BUILDER_SESSION_KEY,
      JSON.stringify({ projectId: 'p1', compositeId: 'c1' }),
    );
    sessionStorage.setItem(
      ACTIVE_STACK_KEY,
      JSON.stringify({
        ui: 'react',
        server: 'next',
        database: 'postgresql',
        styling: {
          foundation: ['tailwind'],
          authoring: ['css-modules'],
          inlineStyles: true,
        },
      }),
    );

    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture = TestBed.createComponent(WelcomePageComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-testid="welcome-page"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('[data-testid="welcome-resume-note"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('[data-testid="welcome-framework-prompt"]')).toBeFalsy();
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('resumes builder without rewriting pending stack', async () => {
    sessionStorage.setItem(
      BUILDER_SESSION_KEY,
      JSON.stringify({ projectId: 'p1', compositeId: 'c1' }),
    );
    sessionStorage.setItem(
      ACTIVE_STACK_KEY,
      JSON.stringify({
        ui: 'react',
        server: 'next',
        database: 'postgresql',
        styling: {
          foundation: ['tailwind'],
          authoring: ['css-modules'],
          inlineStyles: true,
        },
      }),
    );

    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture = TestBed.createComponent(WelcomePageComponent);
    fixture.detectChanges();
    fixture.nativeElement.querySelector('[data-testid="welcome-continue"]').click();

    expect(sessionStorage.getItem(PENDING_STACK_KEY)).toBeNull();
    expect(navigateSpy).toHaveBeenCalledWith(['/builder']);
  });

  it('starts a fresh project with the selected stack', async () => {
    sessionStorage.setItem(
      BUILDER_SESSION_KEY,
      JSON.stringify({ projectId: 'p1', compositeId: 'c1' }),
    );
    sessionStorage.setItem(
      ACTIVE_STACK_KEY,
      JSON.stringify({
        ui: 'react',
        server: 'next',
        database: 'postgresql',
        styling: {
          foundation: ['tailwind'],
          authoring: ['css-modules'],
          inlineStyles: true,
        },
      }),
    );

    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture = TestBed.createComponent(WelcomePageComponent);
    fixture.detectChanges();
    expandSection(fixture, 'ui');
    fixture.nativeElement.querySelector('[data-testid="stack-ui-vue"]').click();
    fixture.detectChanges();
    fixture.nativeElement.querySelector('[data-testid="welcome-stack-change-new-project"]').click();
    fixture.detectChanges();
    fixture.nativeElement.querySelector('[data-testid="welcome-start-fresh"]').click();

    expect(sessionStorage.getItem(BUILDER_SESSION_KEY)).toBeNull();
    expect(JSON.parse(sessionStorage.getItem(PENDING_STACK_KEY) ?? '{}')).toEqual({
      ui: 'vue',
      server: 'nuxt',
      database: 'postgresql',
      styling: {
        foundation: ['tailwind'],
        authoring: ['css-modules'],
        inlineStyles: true,
      },
    });
    expect(navigateSpy).toHaveBeenCalledWith(['/builder']);
  });
});
