import {
  BUILDER_MIN_WIDTH_PX,
  type DisplayAvailability,
  type ViewportMetrics,
} from './display-availability';

export type WorkspaceLayoutMode = 'full' | 'compact';

/**
 * Viewports at or below this width (once allowed) use collapsible side panels
 * so the canvas remains usable on tablet landscape and narrow desktop windows.
 */
export const COMPACT_BUILDER_MAX_WIDTH_PX = 1280;

export function resolveWorkspaceLayout(
  metrics: ViewportMetrics,
  availability: DisplayAvailability,
): WorkspaceLayoutMode {
  if (!availability.allowed) {
    return 'full';
  }

  if (metrics.width < BUILDER_MIN_WIDTH_PX) {
    return 'full';
  }

  return metrics.width <= COMPACT_BUILDER_MAX_WIDTH_PX ? 'compact' : 'full';
}
