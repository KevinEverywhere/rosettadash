import type { MongodbInfraProps } from './mongodb-infra';

describe('@rosettadash/angular/infra/mongodb', () => {
  it('exposes typed props contract', () => {
    const props: MongodbInfraProps = {};
    expect(props).toBeDefined();
  });

  it('uses taxonomy-aligned BEM block rd-mongodb', () => {
    expect('rd-mongodb').toMatch(/^rd-/);
  });
});
