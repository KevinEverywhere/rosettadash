import { Component, inject } from '@angular/core';
import { BuilderStateService } from '../builder-state.service';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.scss',
})
export class CanvasComponent {
  protected readonly state = inject(BuilderStateService);

  protected selectNode(nodeId: string, event: Event): void {
    event.stopPropagation();
    this.state.selectNode(nodeId);
  }
}
