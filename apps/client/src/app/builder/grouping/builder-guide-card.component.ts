import { Component, input, output } from '@angular/core';
import {
  type ComponentGroupingGuide,
  getInstructionSteps,
  groupingAnimationLabel,
  hasInstructionGuide,
  resolveGroupingAnimationBlocks,
  type InstructionStep,
} from '@dashbuilder/core';
import { AppCollapsibleComponent } from '../../shared/app-collapsible/app-collapsible.component';

@Component({
  selector: 'app-builder-guide-card',
  templateUrl: './builder-guide-card.component.html',
  styleUrl: './builder-guide-card.component.scss',
  imports: [AppCollapsibleComponent],
})
export class BuilderGuideCardComponent {
  readonly label = input.required<string>();
  readonly type = input.required<string>();
  readonly guide = input.required<ComponentGroupingGuide>();
  readonly expanded = input(false);

  readonly toggled = output<void>();

  protected animationBlocks(): string[] {
    return resolveGroupingAnimationBlocks(this.guide());
  }

  protected animationLabel(): string {
    return groupingAnimationLabel(this.guide().animationKey);
  }

  protected hasSteps(): boolean {
    return hasInstructionGuide(this.type());
  }

  protected steps() {
    return getInstructionSteps(this.type());
  }

  protected instructionStepClass(step: InstructionStep): string {
    return step.highlight ? `grouping-instruction__step--${step.highlight}` : '';
  }
}
