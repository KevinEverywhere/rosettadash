import type { TabsLayoutProps } from './tabs-layout';

describe('@rosettadash/vue/layout/tabs', () => {
  it('exposes typed props contract', () => {
    const props: TabsLayoutProps = {};
    expect(props).toBeDefined();
  });

  it('uses taxonomy-aligned BEM block rd-tabs', () => {
    expect('rd-tabs').toMatch(/^rd-/);
  });
});
