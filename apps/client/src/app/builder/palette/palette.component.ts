import { Component, computed, inject } from '@angular/core';
import {
  ComponentDefinition,
  NodeCategory,
  defaultComponentRegistry,
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

@Component({
  selector: 'app-palette',
  templateUrl: './palette.component.html',
  styleUrl: './palette.component.scss',
})
export class PaletteComponent {
  private readonly state = inject(BuilderStateService);

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
    () => this.state.selectedDefinition()?.type ?? this.state.selectedNode()?.type ?? null,
  );

  protected select(definition: ComponentDefinition): void {
    this.state.selectDefinition(definition);
  }
}
