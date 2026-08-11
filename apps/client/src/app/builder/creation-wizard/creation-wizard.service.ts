import { Injectable, computed, inject, signal } from '@angular/core';
import {
  CreationGoalId,
  CreationWizardStep,
  defaultComponentRegistry,
  getCreationGoal,
  listCreationGoals,
  paletteGroupColor,
  type PaletteGroupColor,
} from '@rosettadash/core';
import { BuilderStateService } from '../builder-state.service';

const SESSION_DISMISS_KEY = 'rosettadash:creation-wizard:dismissed';

export type CreationWizardPhase = 'closed' | 'intent' | 'ai-choice' | 'steps';

@Injectable({ providedIn: 'root' })
export class CreationWizardService {
  private readonly state = inject(BuilderStateService);

  readonly open = signal(false);
  readonly phase = signal<CreationWizardPhase>('closed');
  readonly selectedGoalId = signal<CreationGoalId | null>(null);
  readonly stepIndex = signal(0);
  readonly wantsAi = signal(false);

  readonly goals = listCreationGoals();

  readonly activeGoal = computed(() => {
    const goalId = this.selectedGoalId();
    return goalId ? getCreationGoal(goalId) : null;
  });

  readonly activeStep = computed((): CreationWizardStep | null => {
    const goal = this.activeGoal();
    if (!goal || goal.steps.length === 0) {
      return null;
    }
    return goal.steps[this.stepIndex()] ?? null;
  });

  readonly highlightGroupId = computed(() => this.activeStep()?.highlightGroupId ?? null);

  readonly highlightTypes = computed(() => new Set(this.activeStep()?.highlightTypes ?? []));

  readonly highlightColor = computed((): PaletteGroupColor | null => {
    const groupId = this.highlightGroupId();
    return groupId ? paletteGroupColor(groupId) : null;
  });

  readonly progressLabel = computed(() => {
    const goal = this.activeGoal();
    if (!goal || goal.steps.length === 0) {
      return '';
    }
    return `Step ${this.stepIndex() + 1} of ${goal.steps.length}`;
  });

  readonly stepComplete = computed(() => {
    const step = this.activeStep();
    if (!step) {
      return true;
    }
    const types = new Set(this.state.nodes().map((node) => node.type));
    return step.completeWhenTypes.some((type) => types.has(type));
  });

  shouldAutoOpen(): boolean {
    if (sessionStorage.getItem(SESSION_DISMISS_KEY) === '1') {
      return false;
    }
    return this.state.nodes().length === 0 && !this.state.loading();
  }

  openWizard(): void {
    this.open.set(true);
    this.phase.set('intent');
    this.selectedGoalId.set(null);
    this.stepIndex.set(0);
    this.wantsAi.set(false);
  }

  closeWizard(dismiss = false): void {
    if (dismiss) {
      sessionStorage.setItem(SESSION_DISMISS_KEY, '1');
    }
    this.open.set(false);
    this.phase.set('closed');
    this.selectedGoalId.set(null);
    this.stepIndex.set(0);
  }

  selectGoal(goalId: CreationGoalId): void {
    this.selectedGoalId.set(goalId);
    const goal = getCreationGoal(goalId);

    if (goal.templateId) {
      this.state.applyCompositeTemplate(goal.templateId, { skipConfirm: true });
    }

    if (goal.steps.length === 0) {
      this.phase.set('ai-choice');
      return;
    }

    this.stepIndex.set(0);
    this.phase.set('steps');
    this.expandPaletteGroup(goal.steps[0]?.highlightGroupId);
  }

  chooseAiAssist(enabled: boolean): void {
    this.wantsAi.set(enabled);
    this.closeWizard();
  }

  skipAiChoice(): void {
    this.wantsAi.set(false);
    this.closeWizard();
  }

  advanceStep(): void {
    const goal = this.activeGoal();
    if (!goal) {
      return;
    }

    const nextIndex = this.stepIndex() + 1;
    if (nextIndex >= goal.steps.length) {
      this.phase.set('ai-choice');
      return;
    }

    this.stepIndex.set(nextIndex);
    this.expandPaletteGroup(goal.steps[nextIndex]?.highlightGroupId);
  }

  goBackStep(): void {
    const index = this.stepIndex();
    if (index <= 0) {
      this.phase.set('intent');
      this.selectedGoalId.set(null);
      return;
    }
    const goal = this.activeGoal();
    const nextIndex = index - 1;
    this.stepIndex.set(nextIndex);
    this.expandPaletteGroup(goal?.steps[nextIndex]?.highlightGroupId);
  }

  addSuggestedComponent(): void {
    const step = this.activeStep();
    if (!step?.suggestedType) {
      return;
    }
    const definition = defaultComponentRegistry.get(step.suggestedType);
    if (!definition) {
      return;
    }
    this.state.addNodeFromDefinition(definition, {
      layout: {
        y: 24 + this.state.nodes().length * 96,
      },
    });
  }

  aiPromptForGoal(): string {
    return this.activeGoal()?.aiPromptHint ?? 'Help me build on this canvas.';
  }

  isTypeHighlighted(type: string): boolean {
    return this.open() && this.phase() === 'steps' && this.highlightTypes().has(type);
  }

  isGroupHighlighted(groupId: string): boolean {
    return this.open() && this.phase() === 'steps' && this.highlightGroupId() === groupId;
  }

  private expandPaletteGroup(groupId?: string): void {
    if (!groupId) {
      return;
    }
    window.dispatchEvent(
      new CustomEvent('rosettadash:palette-expand-group', { detail: { groupId } }),
    );
  }
}
