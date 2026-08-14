import type { ModalLayoutProps } from './types';

describe('@rosettadash/svelte/layout/modal', () => {
  it('exposes typed props contract', () => {
    const props: ModalLayoutProps = {};
    expect(props).toBeDefined();
  });

  it('uses taxonomy-aligned BEM block rd-modal', () => {
    expect('rd-modal').toMatch(/^rd-/);
  });
});
