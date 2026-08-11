import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { getGroupingGuide } from '@rosettadash/core';
import { AdminPageComponent } from './admin-page.component';
import { ContentLibraryService } from './content-library.service';
import { AdminFeatureFlagsService } from './admin-feature-flags.service';
import { EnvironmentConfigService } from '../environment/environment-config.service';
import { AiAssistService } from '../builder/ai/ai-assist.service';
import { AppLockService } from '../environment/app-lock.service';
import { SpeechInputService } from '../builder/ai/speech-input.service';

describe('AdminPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPageComponent],
      providers: [
        provideRouter([]),
        ContentLibraryService,
        AdminFeatureFlagsService,
        {
          provide: EnvironmentConfigService,
          useValue: {
            initialize: async () => undefined,
            settings: () => ({ byok: { activeProvider: 'ollama', activeModel: 'llama3.2' } }),
          },
        },
        {
          provide: AiAssistService,
          useValue: {
            refreshReadiness: async () => undefined,
            readiness: signal({ ready: true, freeLocal: true, message: '' }),
          },
        },
        {
          provide: AppLockService,
          useValue: { initialize: () => undefined, isEnabled: () => false },
        },
        {
          provide: SpeechInputService,
          useValue: { isSupported: () => true },
        },
      ],
    }).compileComponents();
  });

  it('creates the admin page', async () => {
    const fixture = TestBed.createComponent(AdminPageComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('[data-testid="admin-page"]')).toBeTruthy();
  });

  it('renders readable builder guide cards when the guides section is expanded', async () => {
    const fixture = TestBed.createComponent(AdminPageComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.componentInstance.loaded.set(true);
    fixture.detectChanges();

    const guidesToggle = fixture.nativeElement.querySelector('[data-testid="admin-section-toggle-guides"]');
    expect(guidesToggle).toBeTruthy();
    guidesToggle.click();
    fixture.detectChanges();

    const tableGuide = fixture.nativeElement.querySelector('[data-testid="builder-guide-visual.table"]');
    expect(tableGuide).toBeTruthy();
    expect(tableGuide.textContent).toContain('Data Table');
    expect(tableGuide.textContent).toContain('visual.table');

    tableGuide.querySelector('.app-collapsible__toggle').click();
    fixture.detectChanges();

    const expectedGuide = getGroupingGuide('visual.table');
    expect(expectedGuide?.summary).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.app-builder-guide-card__summary')?.textContent).toContain(
      expectedGuide?.summary.slice(0, 24) ?? '',
    );
  });
});
