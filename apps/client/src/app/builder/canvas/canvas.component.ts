import { AfterViewInit, Component, ElementRef, HostListener, ViewChild, computed, inject, signal } from '@angular/core';
import { Binding, ComponentNode, PlacementPrompt, getGroupingGuide, getInstructionSteps, groupingAnimationLabel, hasInstructionGuide, resolveGroupingAnimationBlocks, type InstructionStep } from '@dashbuilder/core';
import { BuilderStateService } from '../builder-state.service';
import {
  CANVAS_MIN_NODE_HEIGHT,
  clampCanvasNodeHeight,
  clampCanvasNodeWidth,
  snapToCanvasGrid,
} from './canvas-layout';
import {
  type CanvasViewport,
  filterVisibleCanvasNodes,
} from './canvas-viewport';

const PORT_ROW_HEIGHT = 24;
const NODE_HEADER_HEIGHT = 44;

export interface BindingEdge {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface DragState {
  pointerId: number;
  startClientX: number;
  startClientY: number;
  origins: Map<string, { x: number; y: number }>;
}

interface ResizeState {
  pointerId: number;
  nodeId: string;
  originWidth: number;
  originHeight: number;
  startClientX: number;
  startClientY: number;
}

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.scss',
})
export class CanvasComponent implements AfterViewInit {
  protected readonly state = inject(BuilderStateService);

  @ViewChild('surface') private surfaceRef?: ElementRef<HTMLElement>;

  private dragState: DragState | null = null;
  private resizeState: ResizeState | null = null;

  protected readonly viewportScroll = signal<CanvasViewport>({
    left: 0,
    top: 0,
    width: 800,
    height: 600,
  });

  protected readonly visibleCanvasNodes = computed(() =>
    filterVisibleCanvasNodes(
      this.state.nodes(),
      this.viewportScroll(),
      this.state.selectedNodeIdsSet(),
    ),
  );

  protected readonly bindingEdges = computed(() => {
    const nodesById = this.state.nodesById();
    const visibleIds = new Set(this.visibleCanvasNodes().map((node) => node.id));
    const selectedIds = this.state.selectedNodeIdsSet();
    const cullEdges = this.state.nodes().length > 50;

    return this.state
      .bindings()
      .filter((binding) => {
        if (!cullEdges) {
          return true;
        }
        const sourceVisible =
          visibleIds.has(binding.sourceNodeId) || selectedIds.has(binding.sourceNodeId);
        const targetVisible =
          visibleIds.has(binding.targetNodeId) || selectedIds.has(binding.targetNodeId);
        return sourceVisible && targetVisible;
      })
      .map((binding) => this.edgeForBinding(binding, nodesById))
      .filter((edge): edge is BindingEdge => edge !== null);
  });

  ngAfterViewInit(): void {
    this.syncViewport();
  }

  protected syncViewport(): void {
    const surface = this.surfaceRef?.nativeElement;
    if (!surface) {
      return;
    }
    this.viewportScroll.set({
      left: surface.scrollLeft,
      top: surface.scrollTop,
      width: surface.clientWidth,
      height: surface.clientHeight,
    });
  }

  protected onSurfaceScroll(): void {
    this.syncViewport();
  }

  protected promptAnimationLabel(prompt: PlacementPrompt): string {
    return groupingAnimationLabel(prompt.animationKey);
  }

  protected promptAnimationBlocks(prompt: PlacementPrompt): string[] {
    const guide = getGroupingGuide(prompt.sourceType);
    return guide ? resolveGroupingAnimationBlocks(guide) : ['Component', 'Companion'];
  }

  protected promptHasInstructionSteps(prompt: PlacementPrompt): boolean {
    return hasInstructionGuide(prompt.sourceType);
  }

  protected promptOutcome(prompt: PlacementPrompt): string {
    return getGroupingGuide(prompt.sourceType)?.outcomeSummary ?? '';
  }

  protected promptSteps(prompt: PlacementPrompt): InstructionStep[] {
    return getInstructionSteps(prompt.sourceType);
  }

  protected instructionStepClass(step: InstructionStep): string {
    return step.highlight ? `grouping-instruction__step--${step.highlight}` : '';
  }

  protected promptLeft(prompt: PlacementPrompt): number {
    const source = this.state.nodesById().get(prompt.sourceNodeId);
    return (source?.layout?.x ?? 24) + (source?.layout?.width ?? 220) + 16;
  }

  protected promptTop(prompt: PlacementPrompt): number {
    const source = this.state.nodesById().get(prompt.sourceNodeId);
    return source?.layout?.y ?? 24;
  }

  protected addCompanionFromPrompt(companionType: string, event: Event): void {
    event.stopPropagation();
    this.state.addCompanionFromPrompt(companionType);
  }

  protected dismissPlacementPrompt(event: Event): void {
    event.stopPropagation();
    this.state.dismissPlacementPrompt();
  }

  protected selectNode(nodeId: string, event: Event): void {
    event.stopPropagation();
    if (event instanceof KeyboardEvent && event.key === ' ') {
      event.preventDefault();
    }
    const additive = event instanceof MouseEvent && event.shiftKey;
    this.state.selectNode(nodeId, { additive });
  }

  protected removeNode(nodeId: string, event: Event): void {
    event.stopPropagation();
    this.state.removeNode(nodeId);
  }

  protected stopHeaderEvent(event: Event): void {
    event.stopPropagation();
    if (event instanceof KeyboardEvent && event.key === ' ') {
      event.preventDefault();
    }
  }

  protected clearCanvasSelection(event: Event): void {
    if (this.dragState || this.resizeState) {
      return;
    }
    if (event instanceof KeyboardEvent && event.key === ' ') {
      event.preventDefault();
    }
    event.stopPropagation();
    this.state.clearSelection();
  }

  protected onHeaderPointerDown(nodeId: string, event: PointerEvent): void {
    event.stopPropagation();

    const additive = event.shiftKey;
    if (additive) {
      this.state.selectNode(nodeId, { additive: true });
      return;
    }

    if (!this.state.isNodeSelected(nodeId)) {
      this.state.selectNode(nodeId);
    }

    const node = this.state.nodes().find((item) => item.id === nodeId);
    event.preventDefault();
    if (!node?.layout) {
      return;
    }

    const nodeIds = this.state.selectedNodeIdsSet().has(nodeId)
      ? [...this.state.selectedNodeIds()]
      : [nodeId];

    const nodesById = this.state.nodesById();
    const origins = new Map<string, { x: number; y: number }>();
    for (const id of nodeIds) {
      const selectedNode = nodesById.get(id);
      if (selectedNode?.layout) {
        origins.set(id, { x: selectedNode.layout.x, y: selectedNode.layout.y });
      }
    }

    this.dragState = {
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      origins,
    };

    this.state.beginLayoutHistory();
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  }

  protected onHeaderPointerMove(event: PointerEvent): void {
    if (!this.dragState || this.dragState.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - this.dragState.startClientX;
    const deltaY = event.clientY - this.dragState.startClientY;

    const updates = new Map<string, { x: number; y: number }>();
    for (const [id, origin] of this.dragState.origins) {
      updates.set(id, {
        x: snapToCanvasGrid(origin.x + deltaX),
        y: snapToCanvasGrid(origin.y + deltaY),
      });
    }
    this.state.updateNodesLayoutBatch(updates, { skipHistory: true });
  }

  protected onHeaderPointerUp(event: PointerEvent): void {
    if (!this.dragState || this.dragState.pointerId !== event.pointerId) {
      return;
    }
    (event.currentTarget as HTMLElement).releasePointerCapture(event.pointerId);
    this.dragState = null;
    this.state.commitLayoutHistory();
  }

  protected onResizePointerDown(nodeId: string, event: PointerEvent): void {
    event.stopPropagation();
    event.preventDefault();

    if (!this.state.isNodeSelected(nodeId)) {
      this.state.selectNode(nodeId);
    }

    const node = this.state.nodes().find((item) => item.id === nodeId);
    if (!node?.layout) {
      return;
    }

    this.resizeState = {
      pointerId: event.pointerId,
      nodeId,
      originWidth: node.layout.width,
      originHeight: node.layout.height ?? this.minNodeHeight(node),
      startClientX: event.clientX,
      startClientY: event.clientY,
    };

    this.state.beginLayoutHistory();
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  }

  protected onResizePointerMove(event: PointerEvent): void {
    const resizeState = this.resizeState;
    if (!resizeState || resizeState.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - resizeState.startClientX;
    const deltaY = event.clientY - resizeState.startClientY;
    const node = this.state.nodes().find((item) => item.id === resizeState.nodeId);
    const minHeight = node ? this.minNodeHeight(node) : CANVAS_MIN_NODE_HEIGHT;

    this.state.updateNodeLayout(resizeState.nodeId, {
      width: clampCanvasNodeWidth(resizeState.originWidth + deltaX),
      height: clampCanvasNodeHeight(Math.max(minHeight, resizeState.originHeight + deltaY)),
    }, { skipHistory: true });
  }

  protected onResizePointerUp(event: PointerEvent): void {
    if (!this.resizeState || this.resizeState.pointerId !== event.pointerId) {
      return;
    }
    (event.currentTarget as HTMLElement).releasePointerCapture(event.pointerId);
    this.resizeState = null;
    this.state.commitLayoutHistory();
  }

  @HostListener('document:pointerup', ['$event'])
  protected onDocumentPointerUp(event: PointerEvent): void {
    if (this.dragState?.pointerId === event.pointerId) {
      this.dragState = null;
      this.state.commitLayoutHistory();
    }
    if (this.resizeState?.pointerId === event.pointerId) {
      this.resizeState = null;
      this.state.commitLayoutHistory();
    }
  }

  protected onOutputPortClick(nodeId: string, portId: string, event: Event): void {
    event.stopPropagation();
    const additive = event instanceof MouseEvent && event.shiftKey;
    if (additive) {
      this.state.selectNode(nodeId, { additive: true });
      return;
    }
    this.state.beginBindingFrom(nodeId, portId);
  }

  protected onInputPortClick(nodeId: string, portId: string, event: Event): void {
    event.stopPropagation();
    if (this.state.pendingBindingSource()) {
      this.state.tryCompleteBindingTo(nodeId, portId);
      return;
    }
    const additive = event instanceof MouseEvent && event.shiftKey;
    this.state.selectNode(nodeId, { additive });
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
    const minHeight = this.minNodeHeight(node);
    const layoutHeight = node.layout?.height;
    if (layoutHeight !== undefined && layoutHeight >= minHeight) {
      return layoutHeight;
    }
    return minHeight;
  }

  protected minNodeHeight(node: ComponentNode): number {
    const portCount = Math.max(node.ports.inputs.length, node.ports.outputs.length, 1);
    return Math.max(CANVAS_MIN_NODE_HEIGHT, NODE_HEADER_HEIGHT + portCount * PORT_ROW_HEIGHT + 12);
  }

  private edgeForBinding(
    binding: Binding,
    nodesById: ReadonlyMap<string, ComponentNode>,
  ): BindingEdge | null {
    const source = this.portAnchor(binding.sourceNodeId, binding.sourcePortId, 'output', nodesById);
    const target = this.portAnchor(binding.targetNodeId, binding.targetPortId, 'input', nodesById);
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
    nodesById: ReadonlyMap<string, ComponentNode>,
  ): { x: number; y: number } | null {
    const node = nodesById.get(nodeId);
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
