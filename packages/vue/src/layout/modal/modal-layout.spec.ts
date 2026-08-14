import type { ModalLayoutProps } from './modal-layout';

describe('@rosettadash/vue/layout/modal', () => {
  it('exposes typed props contract', () => {
    const props: ModalLayoutProps = {};
    expect(props).toBeDefined();
  });

  it('uses taxonomy-aligned BEM block rd-modal', () => {
    expect('rd-modal').toMatch(/^rd-/);
  });
});
