import { Injectable, computed, signal } from '@angular/core';
import {
  ComponentDefinition,
  ComponentNode,
  Composite,
  Project,
  defaultComponentRegistry,
} from '@dashbuilder/core';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

@Injectable({ providedIn: 'root' })
export class BuilderStateService {
  readonly project = signal<Project | null>(null);
  readonly composite = signal<Composite | null>(null);
  readonly nodes = signal<ComponentNode[]>([]);
  readonly selectedDefinition = signal<ComponentDefinition | null>(null);
  readonly selectedNodeId = signal<string | null>(null);
  readonly dirty = signal(false);
  readonly saveStatus = signal<SaveStatus>('idle');
  readonly loading = signal(true);
  readonly errorMessage = signal<string | null>(null);

  readonly selectedNode = computed(() => {
    const id = this.selectedNodeId();
    if (!id) {
      return null;
    }
    return this.nodes().find((node) => node.id === id) ?? null;
  });

  selectDefinition(definition: ComponentDefinition): void {
    this.selectedDefinition.set(definition);
    this.selectedNodeId.set(null);
  }

  selectNode(nodeId: string): void {
    this.selectedNodeId.set(nodeId);
    this.selectedDefinition.set(null);
  }

  clearSelection(): void {
    this.selectedDefinition.set(null);
    this.selectedNodeId.set(null);
  }

  addNodeFromDefinition(definition: ComponentDefinition): ComponentNode {
    const node = defaultComponentRegistry.createNode(definition.type, {
      layout: {
        x: 24,
        y: this.nodes().length * 96 + 24,
        width: 220,
        height: 72,
      },
    });
    this.nodes.update((nodes) => [...nodes, node]);
    this.selectedNodeId.set(node.id);
    this.selectedDefinition.set(null);
    this.markDirty();
    return node;
  }

  updateNodeProperty(nodeId: string, key: string, value: unknown): void {
    this.nodes.update((nodes) =>
      nodes.map((node) =>
        node.id === nodeId
          ? { ...node, properties: { ...node.properties, [key]: value } }
          : node,
      ),
    );
    this.markDirty();
  }

  removeSelectedNode(): void {
    const id = this.selectedNodeId();
    if (!id) {
      return;
    }
    this.nodes.update((nodes) => nodes.filter((node) => node.id !== id));
    this.selectedNodeId.set(null);
    this.markDirty();
  }

  setProjectContext(project: Project, composite: Composite): void {
    this.project.set(project);
    this.composite.set(composite);
    this.nodes.set([...composite.nodes]);
    this.dirty.set(false);
    this.saveStatus.set('idle');
    this.errorMessage.set(null);
  }

  applySavedComposite(composite: Composite): void {
    this.composite.set(composite);
    this.nodes.set([...composite.nodes]);
    this.dirty.set(false);
    this.saveStatus.set('saved');
  }

  buildCompositePayload(): Composite {
    const composite = this.composite();
    if (!composite) {
      throw new Error('No composite loaded');
    }
    return {
      ...composite,
      nodes: this.nodes(),
      bindings: composite.bindings ?? [],
    };
  }

  markDirty(): void {
    this.dirty.set(true);
    this.saveStatus.set('idle');
  }
}
