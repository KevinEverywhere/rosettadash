import { Injectable, computed, signal } from '@angular/core';
import {
  Binding,
  ComponentDefinition,
  ComponentNode,
  Composite,
  DefaultSuggestion,
  DomainContext,
  NodeLayout,
  Project,
  RoleDefinition,
  TimeRangePreset,
  areDataTypesCompatible,
  buildCompositeTemplate,
  defaultComponentRegistry,
  evaluateDefaults,
  listCompositeTemplates,
  normalizeDomainContext,
  slugifyDomainId,
  suggestionsForSelectedNode,
} from '@dashbuilder/core';
import {
  CANVAS_GRID_SIZE,
  clampCanvasNodeHeight,
  clampCanvasNodeWidth,
  snapToCanvasGrid,
} from './canvas/canvas-layout';

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
  readonly selectedNodeIds = signal<string[]>([]);
  readonly pendingBindingSource = signal<PendingBindingSource | null>(null);
  readonly bindingMessage = signal<string | null>(null);
  readonly workspaceMode = signal<WorkspaceMode>('design');
  readonly dirty = signal(false);
  readonly saveStatus = signal<SaveStatus>('idle');
  readonly loading = signal(true);
  readonly errorMessage = signal<string | null>(null);
  readonly suggestions = signal<DefaultSuggestion[]>([]);
  readonly dismissedSuggestionIds = signal<Set<string>>(new Set());
  readonly previewRoleId = signal('viewer');

  readonly selectedNodeId = computed(() => this.selectedNodeIds()[0] ?? null);

  readonly selectedNode = computed(() => {
    const id = this.selectedNodeId();
    if (!id) {
      return null;
    }
    return this.nodes().find((node) => node.id === id) ?? null;
  });

  readonly selectedNodes = computed(() => {
    const ids = new Set(this.selectedNodeIds());
    return this.nodes().filter((node) => ids.has(node.id));
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

  readonly domainContext = computed(() => this.composite()?.domainContext);

  readonly previewRoleOptions = computed(() => {
    const roles = this.domainContext()?.roles;
    if (roles?.length) {
      return roles;
    }
    return [
      { id: 'viewer', name: 'Viewer' },
      { id: 'editor', name: 'Editor' },
      { id: 'admin', name: 'Admin' },
      { id: 'owner', name: 'Owner' },
    ] satisfies RoleDefinition[];
  });

  selectDefinition(definition: ComponentDefinition): void {
    this.selectedDefinition.set(definition);
    this.selectedNodeIds.set([]);
    this.clearPendingBinding();
  }

  selectNode(nodeId: string, options?: { additive?: boolean }): void {
    const additive = options?.additive ?? false;
    if (additive) {
      this.selectedNodeIds.update((ids) =>
        ids.includes(nodeId) ? ids.filter((id) => id !== nodeId) : [...ids, nodeId],
      );
    } else {
      this.selectedNodeIds.set([nodeId]);
    }
    this.selectedDefinition.set(null);
    this.refreshSuggestionsForSelection();
  }

  isNodeSelected(nodeId: string): boolean {
    return this.selectedNodeIds().includes(nodeId);
  }

  clearSelection(): void {
    this.selectedDefinition.set(null);
    this.selectedNodeIds.set([]);
    this.clearPendingBinding();
  }

  updateNodeLayout(nodeId: string, layout: Partial<NodeLayout>): void {
    this.nodes.update((nodes) =>
      nodes.map((node) => {
        if (node.id !== nodeId) {
          return node;
        }
        const current = node.layout ?? { x: 24, y: 24, width: 220, height: 72 };
        const next: NodeLayout = {
          ...current,
          ...layout,
        };
        if (layout.x !== undefined) {
          next.x = snapToCanvasGrid(layout.x);
        }
        if (layout.y !== undefined) {
          next.y = snapToCanvasGrid(layout.y);
        }
        if (layout.width !== undefined) {
          next.width = clampCanvasNodeWidth(layout.width);
        }
        if (layout.height !== undefined) {
          next.height = clampCanvasNodeHeight(layout.height);
        }
        return { ...node, layout: next };
      }),
    );
    this.markDirty();
  }

  moveSelectedNodes(deltaX: number, deltaY: number): void {
    const selected = new Set(this.selectedNodeIds());
    if (selected.size === 0) {
      return;
    }
    this.nodes.update((nodes) =>
      nodes.map((node) => {
        if (!selected.has(node.id) || !node.layout) {
          return node;
        }
        return {
          ...node,
          layout: {
            ...node.layout,
            x: snapToCanvasGrid(node.layout.x + deltaX),
            y: snapToCanvasGrid(node.layout.y + deltaY),
          },
        };
      }),
    );
    this.markDirty();
  }

  addNodeFromDefinition(definition: ComponentDefinition): ComponentNode {
    const node = defaultComponentRegistry.createNode(definition.type, {
      layout: {
        x: snapToCanvasGrid(24),
        y: snapToCanvasGrid(this.nodes().length * CANVAS_GRID_SIZE * 6 + 24),
        width: clampCanvasNodeWidth(220),
        height: clampCanvasNodeHeight(72),
      },
    });
    this.nodes.update((nodes) => [...nodes, node]);
    this.selectedNodeIds.set([node.id]);
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
    const ids = new Set(this.selectedNodeIds());
    if (ids.size === 0) {
      return;
    }
    this.nodes.update((nodes) => nodes.filter((node) => !ids.has(node.id)));
    this.bindings.update((bindings) =>
      bindings.filter(
        (binding) => !ids.has(binding.sourceNodeId) && !ids.has(binding.targetNodeId),
      ),
    );
    this.selectedNodeIds.set([]);
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

  applyOnboardingTemplate(): void {
    this.applyCompositeTemplate('onboarding');
  }

  applyCompositeTemplate(templateId: string): void {
    const composite = this.composite();
    if (!composite) {
      return;
    }

    if (
      this.dirty() &&
      typeof globalThis.confirm === 'function' &&
      !globalThis.confirm(
        'Replace the current canvas with this template? Unsaved changes will be lost.',
      )
    ) {
      return;
    }

    const template = buildCompositeTemplate(templateId, defaultComponentRegistry, {
      id: composite.id,
      version: composite.version,
    });

    this.composite.set({
      ...composite,
      name: template.name,
      description: template.description,
      templateId: template.templateId,
      nodes: template.nodes,
      bindings: template.bindings,
      exportTargets: template.exportTargets,
      domainContext: template.domainContext,
    });
    this.nodes.set([...template.nodes]);
    this.bindings.set([...(template.bindings ?? [])]);
    this.selectedNodeIds.set([]);
    this.selectedDefinition.set(null);
    this.clearPendingBinding();
    this.markDirty();
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

  setPreviewRoleId(roleId: string): void {
    this.previewRoleId.set(roleId);
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

  patchDomainContext(patch: {
    clientName?: string;
    clientId?: string;
    projectName?: string;
    projectId?: string;
    defaultTimeRange?: TimeRangePreset | '';
  }): void {
    const composite = this.composite();
    if (!composite) {
      return;
    }

    const current: DomainContext = { ...(composite.domainContext ?? {}) };

    if (patch.clientName !== undefined) {
      if (patch.clientName.trim()) {
        current.client = {
          id:
            patch.clientId?.trim() ||
            current.client?.id?.trim() ||
            slugifyDomainId(patch.clientName) ||
            'client',
          name: patch.clientName.trim(),
        };
      } else {
        delete current.client;
      }
    } else if (patch.clientId !== undefined && current.client) {
      current.client = {
        ...current.client,
        id: patch.clientId.trim() || slugifyDomainId(current.client.name) || 'client',
      };
    }

    if (patch.projectName !== undefined) {
      if (patch.projectName.trim()) {
        current.project = {
          id:
            patch.projectId?.trim() ||
            current.project?.id?.trim() ||
            slugifyDomainId(patch.projectName) ||
            'project',
          name: patch.projectName.trim(),
        };
      } else {
        delete current.project;
      }
    } else if (patch.projectId !== undefined && current.project) {
      current.project = {
        ...current.project,
        id: patch.projectId.trim() || slugifyDomainId(current.project.name) || 'project',
      };
    }

    if (patch.defaultTimeRange !== undefined) {
      if (patch.defaultTimeRange) {
        current.defaultTimeRange = patch.defaultTimeRange;
      } else {
        delete current.defaultTimeRange;
      }
    }

    const normalized = normalizeDomainContext(current);
    this.composite.set({ ...composite, domainContext: normalized });
    this.markDirty();
  }

  addDomainRole(role: RoleDefinition): void {
    const composite = this.composite();
    if (!composite) {
      return;
    }

    const current = composite.domainContext ?? {};
    const roles = [...(current.roles ?? [])];
    if (roles.some((entry) => entry.id === role.id)) {
      return;
    }

    roles.push(role);
    const normalized = normalizeDomainContext({ ...current, roles });
    this.composite.set({ ...composite, domainContext: normalized });
    this.markDirty();
  }

  removeDomainRole(roleId: string): void {
    const composite = this.composite();
    if (!composite?.domainContext?.roles?.length) {
      return;
    }

    const current = composite.domainContext;
    const roles = current.roles?.filter((role) => role.id !== roleId) ?? [];
    const normalized = normalizeDomainContext({ ...current, roles });
    this.composite.set({ ...composite, domainContext: normalized });
    this.markDirty();
  }

  toggleRoleGateRole(roleId: string, enabled: boolean): void {
    const node = this.selectedNode();
    if (!node || node.type !== 'domain.role-gate') {
      return;
    }

    const current = Array.isArray(node.properties['roles'])
      ? node.properties['roles'].filter((entry): entry is string => typeof entry === 'string')
      : [];
    const next = enabled
      ? current.includes(roleId)
        ? current
        : [...current, roleId]
      : current.filter((entry) => entry !== roleId);

    this.updateNodeProperty(node.id, 'roles', next);
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
