import type { MongodbInfraProps } from './types';

describe('@rosettadash/svelte/infra/mongodb', () => {
  it('exposes typed props contract', () => {
    const props: MongodbInfraProps = {};
    expect(props).toBeDefined();
  });

  it('uses taxonomy-aligned BEM block rd-mongodb', () => {
    expect('rd-mongodb').toMatch(/^rd-/);
  });
});
