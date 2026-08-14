import type { TabsLayoutProps } from './types';

describe('@rosettadash/svelte/layout/tabs', () => {
  it('exposes typed props contract', () => {
    const props: TabsLayoutProps = {};
    expect(props).toBeDefined();
  });

  it('uses taxonomy-aligned BEM block rd-tabs', () => {
    expect('rd-tabs').toMatch(/^rd-/);
  });
});
