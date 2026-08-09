import { Component, computed, inject, signal } from '@angular/core';
import {
  ComponentDefinition,
  NodeCategory,
  defaultComponentRegistry,
  getGroupingGuide,
  groupingAnimationLabel,
} from '@dashbuilder/core';
import { BuilderStateService } from '../builder-state.service';

interface PaletteGroup {
  category: NodeCategory;
  label: string;
  items: ComponentDefinition[];
}

const CATEGORY_LABELS: Record<NodeCategory, string> = {
  visual: 'Form & Display',
  layout: 'Layout',
  logic: 'Logic',
  domain: 'Domain & Access',
  infra: 'Infrastructure',
};

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

  protected readonly groups = computed<PaletteGroup[]>(() => {
    const categories: NodeCategory[] = ['visual', 'layout', 'domain', 'infra'];
    return categories
      .map((category) => ({
        category,
        label: CATEGORY_LABELS[category],
        items: defaultComponentRegistry.listByCategory(category),
      }))
      .filter((group) => group.items.length > 0);
  });

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
    const key = getGroupingGuide(type)?.animationKey;
    switch (key) {
      case 'filter-table':
        return ['Date Range', 'Data Table'];
      case 'filter-chart':
        return ['Date Range', 'Chart'];
      case 'data-stack':
        return ['Database', 'Server', 'Table'];
      case 'form-row':
        return ['Text Input', 'Checkbox'];
      case 'access-flow':
        return ['Role Gate', 'Role Assign', 'Invite'];
      case 'server-data':
        return ['NestJS Server', 'PostgreSQL', 'Table'];
      default:
        return ['Component', 'Companion'];
    }
  }
}
