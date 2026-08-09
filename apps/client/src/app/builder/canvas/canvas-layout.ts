export const CANVAS_GRID_SIZE = 16;
export const CANVAS_MIN_NODE_WIDTH = 160;
export const CANVAS_MIN_NODE_HEIGHT = 72;

export function snapToCanvasGrid(value: number, gridSize = CANVAS_GRID_SIZE): number {
  return Math.round(value / gridSize) * gridSize;
}

export function clampCanvasNodeWidth(width: number): number {
  return Math.max(CANVAS_MIN_NODE_WIDTH, snapToCanvasGrid(width));
}

export function clampCanvasNodeHeight(height: number): number {
  return Math.max(CANVAS_MIN_NODE_HEIGHT, snapToCanvasGrid(height));
}
