import { resolveDisplayAvailability } from './display-availability';
import {
  COMPACT_BUILDER_MAX_WIDTH_PX,
  resolveWorkspaceLayout,
} from './workspace-layout';

describe('workspace layout', () => {
  it('uses compact layout for tablet landscape at 1024px', () => {
    const metrics = { width: 1024, height: 768, coarsePointer: true };
    expect(resolveWorkspaceLayout(metrics, resolveDisplayAvailability(metrics))).toBe('compact');
  });

  it('uses compact layout for narrow desktop windows', () => {
    const metrics = { width: 1180, height: 820, coarsePointer: false };
    expect(resolveWorkspaceLayout(metrics, resolveDisplayAvailability(metrics))).toBe('compact');
  });

  it('uses full layout above the compact breakpoint', () => {
    const metrics = { width: 1440, height: 900, coarsePointer: false };
    expect(resolveWorkspaceLayout(metrics, resolveDisplayAvailability(metrics))).toBe('full');
  });

  it('uses full layout when the builder is blocked', () => {
    const metrics = { width: 430, height: 932, coarsePointer: true };
    expect(resolveWorkspaceLayout(metrics, resolveDisplayAvailability(metrics))).toBe('full');
  });

  it('documents the compact breakpoint', () => {
    expect(COMPACT_BUILDER_MAX_WIDTH_PX).toBe(1280);
  });
});
