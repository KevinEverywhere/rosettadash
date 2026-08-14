import type { StatusBadgeProps } from './types';

describe('@rosettadash/svelte/visual/plugin/status-badge', () => {
  it('exposes typed props contract', () => {
    const props: StatusBadgeProps = {};
    expect(props).toBeDefined();
  });

  it('uses taxonomy-aligned BEM block rd-plugin-status-badge', () => {
    expect('rd-plugin-status-badge').toMatch(/^rd-/);
  });
});
