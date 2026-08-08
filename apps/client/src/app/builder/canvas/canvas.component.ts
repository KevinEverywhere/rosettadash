import { Component, computed, inject } from '@angular/core';
import { Binding, ComponentNode } from '@dashbuilder/core';
import { BuilderStateService } from '../builder-state.service';

const PORT_ROW_HEIGHT = 24;
const NODE_HEADER_HEIGHT = 44;

export interface BindingEdge {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.scss',
})
export class CanvasComponent {
  protected readonly state = inject(BuilderStateService);

  protected readonly bindingEdges = computed(() =>
    this.state.bindings().map((binding) => this.edgeForBinding(binding)).filter(Boolean) as BindingEdge[],
  );

  protected selectNode(nodeId: string, event: Event): void {
    event.stopPropagation();
    if (event instanceof KeyboardEvent && event.key === ' ') {
      event.preventDefault();
    }
    this.state.selectNode(nodeId);
  }

  protected onOutputPortClick(nodeId: string, portId: string, event: Event): void {
    event.stopPropagation();
    this.state.beginBindingFrom(nodeId, portId);
  }

  protected onInputPortClick(nodeId: string, portId: string, event: Event): void {
    event.stopPropagation();
    if (this.state.pendingBindingSource()) {
      this.state.tryCompleteBindingTo(nodeId, portId);
      return;
    }
    this.state.selectNode(nodeId);
  }

  protected isPendingOutput(nodeId: string, portId: string): boolean {
    const pending = this.state.pendingBindingSource();
    return pending?.nodeId === nodeId && pending?.portId === portId;
  }

  protected isPendingTarget(nodeId: string, portId: string): boolean {
    if (!this.state.pendingBindingSource()) {
      return false;
    }
    return !this.isPendingOutput(nodeId, portId);
  }

  protected nodeHeight(node: ComponentNode): number {
    const portCount = Math.max(node.ports.inputs.length, node.ports.outputs.length, 1);
    return NODE_HEADER_HEIGHT + portCount * PORT_ROW_HEIGHT + 12;
  }

  private edgeForBinding(binding: Binding): BindingEdge | null {
    const source = this.portAnchor(binding.sourceNodeId, binding.sourcePortId, 'output');
    const target = this.portAnchor(binding.targetNodeId, binding.targetPortId, 'input');
    if (!source || !target) {
      return null;
    }
    return {
      id: binding.id,
      x1: source.x,
      y1: source.y,
      x2: target.x,
      y2: target.y,
    };
  }

  private portAnchor(
    nodeId: string,
    portId: string,
    direction: 'input' | 'output',
  ): { x: number; y: number } | null {
    const node = this.state.nodes().find((item) => item.id === nodeId);
    if (!node?.layout) {
      return null;
    }

    const ports = direction === 'input' ? node.ports.inputs : node.ports.outputs;
    const index = ports.findIndex((port) => port.id === portId);
    if (index < 0) {
      return null;
    }

    const x =
      direction === 'input'
        ? node.layout.x
        : node.layout.x + node.layout.width;
    const y = node.layout.y + NODE_HEADER_HEIGHT + index * PORT_ROW_HEIGHT + PORT_ROW_HEIGHT / 2;

    return { x, y };
  }
}
