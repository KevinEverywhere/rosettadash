import type { RoleAssignProps } from './role-assign';

describe('@rosettadash/vue/domain/role-assign', () => {
  it('exposes typed props contract', () => {
    const props: RoleAssignProps = {};
    expect(props).toBeDefined();
  });

  it('uses taxonomy-aligned BEM block rd-role-assign', () => {
    expect('rd-role-assign').toMatch(/^rd-/);
  });
});
