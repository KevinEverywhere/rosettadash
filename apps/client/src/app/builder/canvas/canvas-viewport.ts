import type { ComponentNode, NodeLayout } from '@dashbuilder/core';

export const CANVAS_VIEWPORT_CULL_THRESHOLD = 50;
export const CANVAS_VIEWPORT_BUFFER_PX = 120;

export interface CanvasViewport {
  left: number;
  top: number;
  width: number;
  height: number;
}

export function estimateCanvasNodeHeight(node: ComponentNode): number {
  const portCount = Math.max(node.ports.inputs.length, node.ports.outputs.length, 1);
  const minHeight = Math.max(72, 44 + portCount * 24 + 12);
  const layoutHeight = node.layout?.height;
  if (layoutHeight !== undefined && layoutHeight >= minHeight) {
    return layoutHeight;
  }
  return minHeight;
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
