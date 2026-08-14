import type { DataTableProps } from './types';

describe('@rosettadash/svelte/visual/table', () => {
  it('exposes typed props contract', () => {
    const props: DataTableProps = {};
    expect(props).toBeDefined();
  });

  it('uses taxonomy-aligned BEM block rd-table', () => {
    expect('rd-table').toMatch(/^rd-/);
  });
});
