import { Component, computed, effect, inject } from '@angular/core';
import type { Binding, DomainContext } from '@dashbuilder/core';
import { BuilderStateService } from '../builder-state.service';
import { PreviewDataService } from './preview-data.service';
import { PreviewNodeComponent } from './preview-node.component';

const PREVIEW_LOAD_DEBOUNCE_MS = 200;

interface PreviewNodePayload {
  id: string;
  type: string;
  properties: Record<string, unknown>;
}

interface PreviewLoadPayload {
  projectName?: string;
  compositeName?: string;
  dateRangePreset: string;
  domainContext?: {
    client?: DomainContext['client'];
    project?: DomainContext['project'];
    defaultTimeRange?: DomainContext['defaultTimeRange'];
  };
  limit: number;
  nodes: PreviewNodePayload[];
  bindings: Binding[];
}

@Component({
  selector: 'app-preview-panel',
  imports: [PreviewNodeComponent],
  templateUrl: './preview-panel.component.html',
  styleUrl: './preview-panel.component.scss',
})
export class PreviewPanelComponent {
  protected readonly state = inject(BuilderStateService);
  protected readonly previewData = inject(PreviewDataService);

  protected readonly previewRoleOptions = computed(() => this.state.previewRoleOptions());

  protected readonly sortedPreviewNodes = computed(() =>
    [...this.state.previewNodes()].sort((left, right) => {
      const leftY = left.layout?.y ?? 0;
      const rightY = right.layout?.y ?? 0;
      if (leftY !== rightY) {
        return leftY - rightY;
      }
      return (left.layout?.x ?? 0) - (right.layout?.x ?? 0);
    }),
  );

  private readonly previewLoadFingerprint = computed(() => {
    const project = this.state.project();
    const composite = this.state.composite();
    const domainContext = composite?.domainContext;
    const nodes = this.state.nodes();
    const dateRangeNode = nodes.find((node) => node.type === 'visual.input.date-range');
    const timePresetNode = nodes.find((node) => node.type === 'domain.time-preset');
    const preset =
      this.previewData.selectedTimePreset() ??
      (typeof dateRangeNode?.properties['preset'] === 'string'
        ? dateRangeNode.properties['preset']
        : typeof timePresetNode?.properties['defaultPreset'] === 'string'
          ? timePresetNode.properties['defaultPreset']
          : domainContext?.defaultTimeRange ?? 'last-7-days');

    return JSON.stringify({
      projectName: project?.name,
      compositeName: composite?.name,
      dateRangePreset: preset,
      domainContext,
      nodes: nodes.map((node) => ({
        id: node.id,
        type: node.type,
        properties: node.properties,
      })),
      bindings: this.state.bindings(),
    });
  });

  constructor() {
    effect((onCleanup) => {
      if (this.state.workspaceMode() !== 'preview') {
        return;
      }

      this.previewLoadFingerprint();
      const timer = setTimeout(() => {
        void this.previewData.load(this.buildPreviewLoadPayload());
      }, PREVIEW_LOAD_DEBOUNCE_MS);

      onCleanup(() => clearTimeout(timer));
    });
  }

  protected updatePreviewRole(roleId: string): void {
    this.state.setPreviewRoleId(roleId);
  }

  private buildPreviewLoadPayload(): PreviewLoadPayload {
    const project = this.state.project();
    const composite = this.state.composite();
    const domainContext = composite?.domainContext;
    const nodes = this.state.nodes();
    const dateRangeNode = nodes.find((node) => node.type === 'visual.input.date-range');
    const timePresetNode = nodes.find((node) => node.type === 'domain.time-preset');
    const preset =
      this.previewData.selectedTimePreset() ??
      (typeof dateRangeNode?.properties['preset'] === 'string'
        ? dateRangeNode.properties['preset']
        : typeof timePresetNode?.properties['defaultPreset'] === 'string'
          ? timePresetNode.properties['defaultPreset']
          : domainContext?.defaultTimeRange ?? 'last-7-days');

    return {
      projectName: project?.name,
      compositeName: composite?.name,
      dateRangePreset: preset,
      domainContext: domainContext
        ? {
            client: domainContext.client,
            project: domainContext.project,
            defaultTimeRange: domainContext.defaultTimeRange,
          }
        : undefined,
      limit: 10,
      nodes: nodes.map((node) => ({
        id: node.id,
        type: node.type,
        properties: node.properties,
      })),
      bindings: this.state.bindings(),
    };
  }
}
