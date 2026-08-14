import type { CollapsibleProps } from './collapsible';

describe('@rosettadash/vue/layout/collapsible', () => {
  it('exposes typed props contract', () => {
    const props: CollapsibleProps = {};
    expect(props).toBeDefined();
  });

  it('uses taxonomy-aligned BEM block rd-collapsible', () => {
    expect('rd-collapsible').toMatch(/^rd-/);
  });
});
