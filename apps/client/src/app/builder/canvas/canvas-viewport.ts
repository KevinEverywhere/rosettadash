import type { ComponentNode, NodeLayout } from '@dashbuilder/core';
import { readNodeDisplayDataSource, readNodeDisplaySubtitle } from '@dashbuilder/core';
import { CANVAS_MIN_NODE_HEIGHT } from './canvas-layout';

export const CANVAS_VIEWPORT_CULL_THRESHOLD = 50;
export const CANVAS_VIEWPORT_BUFFER_PX = 120;

const PORT_ROW_HEIGHT = 24;
const NODE_NAME_BAR_HEIGHT = 36;
const NODE_TYPE_ROW_HEIGHT = 22;

export interface CanvasViewport {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface CanvasContentBounds {
  width: number;
  height: number;
}

export function canvasNodeHeaderHeight(node: ComponentNode): number {
  let height = NODE_NAME_BAR_HEIGHT + NODE_TYPE_ROW_HEIGHT;
  if (readNodeDisplaySubtitle(node.properties)) {
    height += 16;
  }
  if (readNodeDisplayDataSource(node.properties)) {
    height += 14;
  }
  return height;
}

export function estimateCanvasNodeHeight(node: ComponentNode): number {
  const portCount = Math.max(node.ports.inputs.length, node.ports.outputs.length, 1);
  const minHeight = Math.max(
    CANVAS_MIN_NODE_HEIGHT,
    canvasNodeHeaderHeight(node) + portCount * PORT_ROW_HEIGHT + 12,
  );
  const layoutHeight = node.layout?.height;
  if (layoutHeight !== undefined && layoutHeight >= minHeight) {
    return layoutHeight;
  }
  return minHeight;
}

export function computeCanvasContentBounds(
  nodes: ComponentNode[],
  heightEstimator: (node: ComponentNode) => number = estimateCanvasNodeHeight,
): CanvasContentBounds {
  if (nodes.length === 0) {
    return { width: 320, height: 320 };
  }

  let maxRight = 0;
  let maxBottom = 0;

  for (const node of nodes) {
    const x = node.layout?.x ?? 24;
    const y = node.layout?.y ?? 24;
    const width = node.layout?.width ?? 220;
    const height = heightEstimator(node);
    maxRight = Math.max(maxRight, x + width);
    maxBottom = Math.max(maxBottom, y + height);
  }

  return {
    width: maxRight + 24,
    height: maxBottom + 48,
  };
}

export function isNodeInViewport(
  node: ComponentNode,
  viewport: CanvasViewport,
  bufferPx = CANVAS_VIEWPORT_BUFFER_PX,
): boolean {
  const layout = node.layout ?? { x: 24, y: 24, width: 220, height: 72 };
  const height = estimateCanvasNodeHeight(node);
  const right = layout.x + layout.width;
  const bottom = layout.y + height;
  const viewRight = viewport.left + viewport.width + bufferPx;
  const viewBottom = viewport.top + viewport.height + bufferPx;

  return (
    right >= viewport.left - bufferPx &&
    layout.x <= viewRight &&
    bottom >= viewport.top - bufferPx &&
    layout.y <= viewBottom
  );
}

export function filterVisibleCanvasNodes(
  nodes: ComponentNode[],
  viewport: CanvasViewport,
  selectedNodeIds: ReadonlySet<string>,
): ComponentNode[] {
  if (nodes.length <= CANVAS_VIEWPORT_CULL_THRESHOLD) {
    return nodes;
  }

  return nodes.filter(
    (node) => selectedNodeIds.has(node.id) || isNodeInViewport(node, viewport),
  );
}

export function mergeNodeLayout(
  current: NodeLayout,
  layout: Partial<NodeLayout>,
  snap: (value: number) => number,
  clampWidth: (value: number) => number,
  clampHeight: (value: number) => number,
): NodeLayout {
  const next: NodeLayout = { ...current, ...layout };
  if (layout.x !== undefined) {
    next.x = snap(layout.x);
  }
  if (layout.y !== undefined) {
    next.y = snap(layout.y);
  }
  if (layout.width !== undefined) {
    next.width = clampWidth(layout.width);
  }
  if (layout.height !== undefined) {
    next.height = clampHeight(layout.height);
  }
  return next;
}
