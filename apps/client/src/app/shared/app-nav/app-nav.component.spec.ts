import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppNavComponent } from './app-nav.component';

describe('AppNavComponent', () => {
  let fixture: ComponentFixture<AppNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppNavComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AppNavComponent);
    fixture.detectChanges();
  });

  it('renders app name and primary navigation links', () => {
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('[data-testid="app-nav-logo"]')?.textContent).toContain('RosettaDash');
    expect(element.querySelector('[data-testid="app-nav-settings"]')?.textContent?.trim()).toBe('Settings');
    expect(element.querySelector('[data-testid="app-nav-builder"]')?.textContent?.trim()).toBe('Builder');
    expect(element.querySelector('[data-testid="app-nav-home"]')).toBeFalsy();
  });
});
