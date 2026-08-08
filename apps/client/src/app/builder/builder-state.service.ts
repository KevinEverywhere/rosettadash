import { Injectable, signal } from '@angular/core';
import type { ComponentDefinition, ComponentNode } from '@dashbuilder/core';

@Injectable({ providedIn: 'root' })
export class BuilderStateService {
  readonly selectedDefinition = signal<ComponentDefinition | null>(null);
  readonly selectedNode = signal<ComponentNode | null>(null);

  selectDefinition(definition: ComponentDefinition): void {
    this.selectedDefinition.set(definition);
    this.selectedNode.set(null);
  }

  selectNode(node: ComponentNode): void {
    this.selectedNode.set(node);
    this.selectedDefinition.set(null);
  }

  clearSelection(): void {
    this.selectedDefinition.set(null);
    this.selectedNode.set(null);
  }
}
