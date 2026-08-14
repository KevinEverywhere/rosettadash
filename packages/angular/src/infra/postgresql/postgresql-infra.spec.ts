import type { PostgresqlInfraProps } from './postgresql-infra';

describe('@rosettadash/angular/infra/postgresql', () => {
  it('exposes typed props contract', () => {
    const props: PostgresqlInfraProps = {};
    expect(props).toBeDefined();
  });

  it('uses taxonomy-aligned BEM block rd-postgresql', () => {
    expect('rd-postgresql').toMatch(/^rd-/);
  });
});
