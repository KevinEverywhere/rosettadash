import { Component, computed, inject, signal } from '@angular/core';
import {
  ComponentDefinition,
  defaultComponentRegistry,
  getGroupingGuide,
  getInstructionSteps,
  groupingAnimationLabel,
  hasInstructionGuide,
  resolveGroupingAnimationBlocks,
  resolvePaletteGroups,
  type InstructionStep,
  type ResolvedPaletteGroup,
} from '@dashbuilder/core';
import { BuilderStateService } from '../builder-state.service';

type GuidePanelMode = 'info' | 'link';

@Component({
  selector: 'app-palette',
  templateUrl: './palette.component.html',
  styleUrl: './palette.component.scss',
})
export class PaletteComponent {
  private readonly state = inject(BuilderStateService);

  protected readonly openGuideType = signal<string | null>(null);
  protected readonly openGuideMode = signal<GuidePanelMode | null>(null);
  protected readonly expandedGroupIds = signal<ReadonlySet<string>>(new Set());

  protected readonly groups = computed<ResolvedPaletteGroup[]>(() =>
    resolvePaletteGroups(defaultComponentRegistry),
  );

  protected readonly selectedType = computed(
    () =>
      this.state.selectedDefinition()?.type ??
      this.state.selectedNode()?.type ??
      null,
  );

  protected select(definition: ComponentDefinition): void {
    this.state.selectDefinition(definition);
  }

  protected add(definition: ComponentDefinition, event: Event): void {
    event.stopPropagation();
    this.state.addNodeFromDefinition(definition);
  }

  protected isGroupExpanded(groupId: string): boolean {
    return this.expandedGroupIds().has(groupId);
  }

  protected toggleGroup(groupId: string, event?: Event): void {
    event?.stopPropagation();
    this.expandedGroupIds.update((current) => {
      const next = new Set(current);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  }

  protected onGroupHeaderKeydown(groupId: string, event: KeyboardEvent): void {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }
    event.preventDefault();
    this.toggleGroup(groupId, event);
  }

  protected hasGuide(type: string): boolean {
    return Boolean(getGroupingGuide(type));
  }

  protected guideSummary(type: string): string {
    return getGroupingGuide(type)?.summary ?? '';
  }

  protected guideAnimationKey(type: string): string {
    return getGroupingGuide(type)?.animationKey ?? 'filter-table';
  }

  protected guideAnimationLabel(type: string): string {
    const key = getGroupingGuide(type)?.animationKey;
    return key ? groupingAnimationLabel(key) : '';
  }

  protected hasInstructionSteps(type: string): boolean {
    return hasInstructionGuide(type);
  }

  protected guideOutcome(type: string): string {
    return getGroupingGuide(type)?.outcomeSummary ?? '';
  }

  protected guideSteps(type: string): InstructionStep[] {
    return getInstructionSteps(type);
  }

  protected instructionStepClass(step: InstructionStep): string {
    return step.highlight ? `grouping-instruction__step--${step.highlight}` : '';
  }

  protected guideCompanions(type: string): ComponentDefinition[] {
    const guide = getGroupingGuide(type);
    if (!guide) {
      return [];
    }
    return guide.companionTypes
      .map((companionType) => defaultComponentRegistry.get(companionType))
      .filter(Boolean) as ComponentDefinition[];
  }

  protected isGuideOpen(type: string, mode: GuidePanelMode): boolean {
    return this.openGuideType() === type && this.openGuideMode() === mode;
  }

  protected toggleGuide(type: string, mode: GuidePanelMode, event: Event): void {
    event.stopPropagation();
    if (this.isGuideOpen(type, mode)) {
      this.closeGuide();
      return;
    }
    this.openGuideType.set(type);
    this.openGuideMode.set(mode);
  }

  protected closeGuide(): void {
    this.openGuideType.set(null);
    this.openGuideMode.set(null);
  }

  protected addCompanion(definition: ComponentDefinition, event: Event): void {
    event.stopPropagation();
    this.state.addNodeFromDefinition(definition);
    this.closeGuide();
  }

  protected animationBlocks(type: string): string[] {
    const guide = getGroupingGuide(type);
    return guide ? resolveGroupingAnimationBlocks(guide) : ['Component', 'Companion'];
  }
}
