import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import {
  BUILDER_SESSION_KEY,
  PENDING_STACK_KEY,
} from './stack-profile-session';
import { WelcomePageComponent } from './welcome-page.component';

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

  it('renders welcome hero and stack options', () => {
    expect(fixture.nativeElement.querySelector('[data-testid="welcome-page"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll('[data-testid^="stack-ui-"]').length).toBe(5);
  });

  it('shows scratch-pad note when Any is selected', () => {
    fixture.nativeElement.querySelector('[data-testid="stack-ui-any"]').click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-testid="stack-scratch-note"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('[data-testid="stack-server-nest"]')).toBeFalsy();
  });

  it('stores pending stack profile and navigates to builder', async () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture.nativeElement.querySelector('[data-testid="stack-ui-svelte"]').click();
    fixture.detectChanges();
    fixture.nativeElement.querySelector('[data-testid="welcome-continue"]').click();

    const pending = JSON.parse(sessionStorage.getItem(PENDING_STACK_KEY) ?? '{}');
    expect(pending).toEqual({
      ui: 'svelte',
      server: 'nest',
      database: 'postgresql',
    });
    expect(navigateSpy).toHaveBeenCalledWith(['/builder']);
  });

  it('redirects to builder when entry is already allowed', async () => {
    sessionStorage.setItem(
      BUILDER_SESSION_KEY,
      JSON.stringify({ projectId: 'p1', compositeId: 'c1' }),
    );

    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture = TestBed.createComponent(WelcomePageComponent);
    fixture.detectChanges();

    expect(navigateSpy).toHaveBeenCalledWith(['/builder']);
  });
});
