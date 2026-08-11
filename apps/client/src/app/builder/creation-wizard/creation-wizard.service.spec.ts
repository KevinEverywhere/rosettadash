import { TestBed } from '@angular/core/testing';
import { CreationWizardService } from './creation-wizard.service';
import { BuilderStateService } from '../builder-state.service';

describe('CreationWizardService', () => {
  let service: CreationWizardService;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [CreationWizardService, BuilderStateService],
    });
    service = TestBed.inject(CreationWizardService);
  });

  it('opens the wizard in intent phase', () => {
    service.openWizard();
    expect(service.open()).toBe(true);
    expect(service.phase()).toBe('intent');
  });

  it('does not auto-open after the user dismisses the wizard', () => {
    service.closeWizard(true);
    expect(service.shouldAutoOpen()).toBe(false);
  });

  it('highlights wasm-compute on the final media pipeline step', () => {
    service.openWizard();
    service.selectGoal('media-wasm');
    expect(service.highlightGroupId()).toBe('media-authoring');
    service.advanceStep();
    service.advanceStep();
    expect(service.highlightGroupId()).toBe('wasm-compute');
  });
});
