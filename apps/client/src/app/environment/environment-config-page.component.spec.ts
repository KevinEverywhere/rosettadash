import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { provideRouter } from '@angular/router';
import { EnvironmentConfigPageComponent } from './environment-config-page.component';
import { EnvironmentConfigService } from './environment-config.service';

describe('EnvironmentConfigPageComponent', () => {
  let fixture: ComponentFixture<EnvironmentConfigPageComponent>;
  let config: EnvironmentConfigService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnvironmentConfigPageComponent],
      providers: [
        provideRouter([]),
        EnvironmentConfigService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { queryParamMap: { get: () => null } },
          },
        },
      ],
    }).compileComponents();

    config = TestBed.inject(EnvironmentConfigService);
    vi.spyOn(config, 'initialize').mockResolvedValue(undefined);
    config.loaded.set(true);

    fixture = TestBed.createComponent(EnvironmentConfigPageComponent);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('renders environment configuration page with collapsed sections', () => {
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('[data-testid="environment-config-page"]')).toBeTruthy();
    expect(element.querySelector('[data-testid="env-ai-provider"]')).toBeNull();
    expect(element.querySelector('[data-testid="env-section-toggle-ai"]')).toBeTruthy();
  });

  it('opens AI section when toggled', () => {
    const element = fixture.nativeElement as HTMLElement;
    element.querySelector<HTMLButtonElement>('[data-testid="env-section-toggle-ai"]')?.click();
    fixture.detectChanges();
    expect(element.querySelector('[data-testid="env-ai-provider"]')).toBeTruthy();
    expect(element.querySelector('[data-testid="env-provider-card-openai"]')).toBeTruthy();
  });

  it('opens AI section by default when arriving from welcome BYOK link', async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [EnvironmentConfigPageComponent],
      providers: [
        provideRouter([]),
        EnvironmentConfigService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { queryParamMap: { get: (key: string) => (key === 'from' ? 'byok' : null) } },
          },
        },
      ],
    }).compileComponents();

    const byokConfig = TestBed.inject(EnvironmentConfigService);
    vi.spyOn(byokConfig, 'initialize').mockResolvedValue(undefined);
    byokConfig.loaded.set(true);

    const byokFixture = TestBed.createComponent(EnvironmentConfigPageComponent);
    await byokFixture.componentInstance.ngOnInit();
    byokFixture.detectChanges();

    const element = byokFixture.nativeElement as HTMLElement;
    expect(element.querySelector('[data-testid="env-ai-provider"]')).toBeTruthy();
  });
});
