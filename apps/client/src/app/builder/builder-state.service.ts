import { Injectable, computed, signal } from '@angular/core';
import {
  Binding,
  ComponentDefinition,
  ComponentNode,
  Composite,
  DefaultSuggestion,
  Project,
  areDataTypesCompatible,
  defaultComponentRegistry,
  evaluateDefaults,
  suggestionsForSelectedNode,
} from '@dashbuilder/core';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';
export type WorkspaceMode = 'design' | 'preview';

export interface PendingBindingSource {
  nodeId: string;
  portId: string;
}

export type CreateBindingResult =
  | { ok: true; binding: Binding }
  | { ok: false; error: string };

@Injectable({ providedIn: 'root' })
export class BuilderStateService {
  readonly project = signal<Project | null>(null);
  readonly composite = signal<Composite | null>(null);
  readonly nodes = signal<ComponentNode[]>([]);
  readonly bindings = signal<Binding[]>([]);
  readonly selectedDefinition = signal<ComponentDefinition | null>(null);
  readonly selectedNodeId = signal<string | null>(null);
  readonly pendingBindingSource = signal<PendingBindingSource | null>(null);
  readonly bindingMessage = signal<string | null>(null);
  readonly workspaceMode = signal<WorkspaceMode>('design');
  readonly dirty = signal(false);
  readonly saveStatus = signal<SaveStatus>('idle');
  readonly loading = signal(true);
  readonly errorMessage = signal<string | null>(null);
  readonly suggestions = signal<DefaultSuggestion[]>([]);
  readonly dismissedSuggestionIds = signal<Set<string>>(new Set());

  readonly selectedNode = computed(() => {
    const id = this.selectedNodeId();
    if (!id) {
      return null;
    }
    return this.nodes().find((node) => node.id === id) ?? null;
  });

  readonly bindingsForSelectedNode = computed(() => {
    const nodeId = this.selectedNodeId();
    if (!nodeId) {
      return [];
    }
    return this.bindings().filter(
      (binding) => binding.sourceNodeId === nodeId || binding.targetNodeId === nodeId,
    );
  });

  selectDefinition(definition: ComponentDefinition): void {
    this.selectedDefinition.set(definition);
    this.selectedNodeId.set(null);
    this.clearPendingBinding();
  }

  selectNode(nodeId: string): void {
    this.selectedNodeId.set(nodeId);
    this.selectedDefinition.set(null);
    this.refreshSuggestionsForSelection();
  }

  clearSelection(): void {
    this.selectedDefinition.set(null);
    this.selectedNodeId.set(null);
    this.clearPendingBinding();
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
    this.mergeSuggestions(
      evaluateDefaults(this.defaultsContext(), { type: 'nodeAdded', nodeId: node.id }, defaultComponentRegistry, {
        dismissedIds: this.dismissedSuggestionIds(),
      }),
    );
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
    this.bindings.update((bindings) =>
      bindings.filter(
        (binding) => binding.sourceNodeId !== id && binding.targetNodeId !== id,
      ),
    );
    this.selectedNodeId.set(null);
    this.clearPendingBinding();
    this.markDirty();
  }

  setProjectContext(project: Project, composite: Composite): void {
    this.project.set(project);
    this.composite.set(composite);
    this.nodes.set([...composite.nodes]);
    this.bindings.set([...(composite.bindings ?? [])]);
    this.dirty.set(false);
    this.saveStatus.set('idle');
    this.errorMessage.set(null);
    this.clearPendingBinding();
  }

  applySavedComposite(composite: Composite): void {
    this.composite.set(composite);
    this.nodes.set([...composite.nodes]);
    this.bindings.set([...(composite.bindings ?? [])]);
    this.dirty.set(false);
    this.saveStatus.set('saved');
    this.clearPendingBinding();
  }

  buildCompositePayload(): Composite {
    const composite = this.composite();
    if (!composite) {
      throw new Error('No composite loaded');
    }
    return {
      ...composite,
      nodes: this.nodes(),
      bindings: this.bindings(),
    };
  }

  beginBindingFrom(nodeId: string, portId: string): void {
    const pending = this.pendingBindingSource();
    if (pending?.nodeId === nodeId && pending?.portId === portId) {
      this.clearPendingBinding();
      return;
    }
    this.pendingBindingSource.set({ nodeId, portId });
    this.bindingMessage.set(null);
  }

  tryCompleteBindingTo(targetNodeId: string, targetPortId: string): void {
    const pending = this.pendingBindingSource();
    if (!pending) {
      return;
    }

    const result = this.createBinding(
      pending.nodeId,
      pending.portId,
      targetNodeId,
      targetPortId,
    );
    this.pendingBindingSource.set(null);

    if (result.ok) {
      this.bindingMessage.set(null);
      this.mergeSuggestions(
        evaluateDefaults(
          this.defaultsContext(),
          { type: 'bindingCreated', bindingId: result.binding.id },
          defaultComponentRegistry,
          { dismissedIds: this.dismissedSuggestionIds() },
        ),
      );
      this.markDirty();
      return;
    }

    this.bindingMessage.set(result.error);
  }

  createBinding(
    sourceNodeId: string,
    sourcePortId: string,
    targetNodeId: string,
    targetPortId: string,
  ): CreateBindingResult {
    if (sourceNodeId === targetNodeId) {
      return { ok: false, error: 'Cannot bind a node to itself' };
    }

    const sourceNode = this.nodes().find((node) => node.id === sourceNodeId);
    const targetNode = this.nodes().find((node) => node.id === targetNodeId);
    if (!sourceNode || !targetNode) {
      return { ok: false, error: 'Binding nodes not found on canvas' };
    }

    const sourcePort = defaultComponentRegistry.findPort(
      sourceNode,
      sourcePortId,
      'output',
    );
    const targetPort = defaultComponentRegistry.findPort(
      targetNode,
      targetPortId,
      'input',
    );

    if (!sourcePort) {
      return { ok: false, error: 'Source output port not found' };
    }
    if (!targetPort) {
      return { ok: false, error: 'Target input port not found' };
    }

    if (!areDataTypesCompatible(sourcePort.dataType, targetPort.dataType)) {
      return {
        ok: false,
        error: `Incompatible types: ${sourcePort.dataType} → ${targetPort.dataType}`,
      };
    }

    const duplicate = this.bindings().some(
      (binding) =>
        binding.sourceNodeId === sourceNodeId &&
        binding.sourcePortId === sourcePortId &&
        binding.targetNodeId === targetNodeId &&
        binding.targetPortId === targetPortId,
    );
    if (duplicate) {
      return { ok: false, error: 'This binding already exists' };
    }

    const binding: Binding = {
      id: crypto.randomUUID(),
      sourceNodeId,
      sourcePortId,
      targetNodeId,
      targetPortId,
    };

    this.bindings.update((bindings) => [
      ...bindings.filter(
        (existing) =>
          !(
            existing.targetNodeId === targetNodeId &&
            existing.targetPortId === targetPortId
          ),
      ),
      binding,
    ]);

    return { ok: true, binding };
  }

  removeBinding(bindingId: string): void {
    this.bindings.update((bindings) =>
      bindings.filter((binding) => binding.id !== bindingId),
    );
    this.markDirty();
  }

  clearPendingBinding(): void {
    this.pendingBindingSource.set(null);
    this.bindingMessage.set(null);
  }

  setWorkspaceMode(mode: WorkspaceMode): void {
    this.workspaceMode.set(mode);
    if (mode === 'preview') {
      this.clearPendingBinding();
    }
  }

  previewNodes = computed(() =>
    this.nodes().filter((node) => {
      const definition = defaultComponentRegistry.get(node.type);
      return definition?.isVisual ?? false;
    }),
  );

  isInputBound(nodeId: string, portId: string): boolean {
    return this.bindings().some(
      (binding) =>
        binding.targetNodeId === nodeId && binding.targetPortId === portId,
    );
  }

  markDirty(): void {
    this.dirty.set(true);
    this.saveStatus.set('idle');
  }

  suggestionsForNode(nodeId: string): DefaultSuggestion[] {
    return this.suggestions().filter((suggestion) => suggestion.nodeId === nodeId);
  }

  applySuggestion(suggestionId: string): void {
    const suggestion = this.suggestions().find((entry) => entry.id === suggestionId);
    if (!suggestion?.patches?.length) {
      return;
    }

    for (const patch of suggestion.patches) {
      this.updateNodeProperty(suggestion.nodeId, patch.key, patch.value);
    }

    this.nodes.update((nodes) =>
      nodes.map((node) =>
        node.id === suggestion.nodeId
          ? { ...node, meta: { ...node.meta, suggestedBy: 'defaults-engine' } }
          : node,
      ),
    );

    this.dismissSuggestion(suggestionId);
  }

  dismissSuggestion(suggestionId: string): void {
    this.dismissedSuggestionIds.update((ids) => new Set([...ids, suggestionId]));
    this.suggestions.update((entries) => entries.filter((entry) => entry.id !== suggestionId));
  }

  private defaultsContext() {
    return {
      nodes: this.nodes(),
      bindings: this.bindings(),
    };
  }

  private mergeSuggestions(incoming: DefaultSuggestion[]): void {
    if (incoming.length === 0) {
      return;
    }

    this.suggestions.update((current) => {
      const merged = new Map(current.map((entry) => [entry.id, entry]));
      for (const suggestion of incoming) {
        merged.set(suggestion.id, suggestion);
      }
      return [...merged.values()];
    });
  }

  private refreshSuggestionsForSelection(): void {
    const nodeId = this.selectedNodeId();
    if (!nodeId) {
      return;
    }

    this.mergeSuggestions(
      suggestionsForSelectedNode(this.defaultsContext(), nodeId, defaultComponentRegistry, {
        dismissedIds: this.dismissedSuggestionIds(),
      }),
    );
  }
}
