import { TestBed } from '@angular/core/testing';
import { defaultComponentRegistry } from '@rosettadash/core';
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

  it('opens the wizard in mode-choice phase on an empty canvas', () => {
    service.openWizard();
    expect(service.open()).toBe(true);
    expect(service.phase()).toBe('mode-choice');
  });

  it('does not auto-show the welcome banner after permanent dismiss', () => {
    service.closeWizard(true);
    expect(service.shouldAutoShowWelcomeBanner()).toBe(false);
  });

  it('excludes explore from guided goals', () => {
    service.openWizard();
    service.startGuidedCreation();
    expect(service.guidedGoals().some((goal) => goal.id === 'explore')).toBe(false);
  });

  it('highlights wasm-compute on the final media pipeline step', () => {
    service.openWizard();
    service.startGuidedCreation();
    service.selectGoal('media-wasm');
    expect(service.highlightGroupId()).toBe('media-authoring');
    service.advanceStep();
    service.advanceStep();
    expect(service.highlightGroupId()).toBe('wasm-compute');
  });

  it('opens extend phase when the canvas already has components', () => {
    const state = TestBed.inject(BuilderStateService);
    const definition = defaultComponentRegistry.get('visual.kpi');
    if (!definition) {
      throw new Error('Expected visual.kpi in default registry');
    }
    state.addNodeFromDefinition(definition);
    service.openWizard();
    expect(service.phase()).toBe('extend');
  });
});
