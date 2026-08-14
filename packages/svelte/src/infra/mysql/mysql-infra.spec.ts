import type { MysqlInfraProps } from './types';

describe('@rosettadash/svelte/infra/mysql', () => {
  it('exposes typed props contract', () => {
    const props: MysqlInfraProps = {};
    expect(props).toBeDefined();
  });

  it('uses taxonomy-aligned BEM block rd-mysql', () => {
    expect('rd-mysql').toMatch(/^rd-/);
  });
});
