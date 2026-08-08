import { Component, inject } from '@angular/core';
import { BuilderStateService } from '../builder-state.service';
import { PreviewNodeComponent } from './preview-node.component';

@Component({
  selector: 'app-preview-panel',
  imports: [PreviewNodeComponent],
  templateUrl: './preview-panel.component.html',
  styleUrl: './preview-panel.component.scss',
})
export class PreviewPanelComponent {
  protected readonly state = inject(BuilderStateService);

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
}
