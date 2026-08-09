import { Component, computed, effect, inject } from '@angular/core';
import { BuilderStateService } from '../builder-state.service';
import { PreviewDataService } from './preview-data.service';
import { PreviewNodeComponent } from './preview-node.component';

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

  constructor() {
    effect(() => {
      if (this.state.workspaceMode() !== 'preview') {
        return;
      }

      const project = this.state.project();
      const composite = this.state.composite();
      const domainContext = composite?.domainContext;
      const dateRangeNode = this.state
        .nodes()
        .find((node) => node.type === 'visual.input.date-range');
      const preset =
        typeof dateRangeNode?.properties['preset'] === 'string'
          ? dateRangeNode.properties['preset']
          : domainContext?.defaultTimeRange ?? 'last-7-days';

      void this.previewData.load({
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
        nodes: this.state.nodes().map((node) => ({
          id: node.id,
          type: node.type,
          properties: node.properties,
        })),
        bindings: this.state.bindings().map((binding) => ({
          id: binding.id,
          sourceNodeId: binding.sourceNodeId,
          sourcePortId: binding.sourcePortId,
          targetNodeId: binding.targetNodeId,
          targetPortId: binding.targetPortId,
        })),
      });
    });
  }

  protected sortedPreviewNodes() {
    return [...this.state.previewNodes()].sort((left, right) => {
      const leftY = left.layout?.y ?? 0;
      const rightY = right.layout?.y ?? 0;
      if (leftY !== rightY) {
        return leftY - rightY;
      }
      return (left.layout?.x ?? 0) - (right.layout?.x ?? 0);
    });
  }

  protected updatePreviewRole(roleId: string): void {
    this.state.setPreviewRoleId(roleId);
  }
}
