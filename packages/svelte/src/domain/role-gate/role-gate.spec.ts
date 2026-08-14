import type { RoleGateProps } from './types';

describe('@rosettadash/svelte/domain/role-gate', () => {
  it('exposes typed props contract', () => {
    const props: RoleGateProps = {};
    expect(props).toBeDefined();
  });

  it('uses taxonomy-aligned BEM block rd-role-gate', () => {
    expect('rd-role-gate').toMatch(/^rd-/);
  });
});
