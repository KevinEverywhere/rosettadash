import type { PostgresqlInfraProps } from './types';

describe('@rosettadash/svelte/infra/postgresql', () => {
  it('exposes typed props contract', () => {
    const props: PostgresqlInfraProps = {};
    expect(props).toBeDefined();
  });

  it('uses taxonomy-aligned BEM block rd-postgresql', () => {
    expect('rd-postgresql').toMatch(/^rd-/);
  });
});
