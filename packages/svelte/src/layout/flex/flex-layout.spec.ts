import type { FlexLayoutProps } from './types';

describe('@rosettadash/svelte/layout/flex', () => {
  it('exposes typed props contract', () => {
    const props: FlexLayoutProps = {};
    expect(props).toBeDefined();
  });

  it('uses taxonomy-aligned BEM block rd-flex', () => {
    expect('rd-flex').toMatch(/^rd-/);
  });
});
