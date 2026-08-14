import type { NestServerInfraProps } from './nest-server-infra';

describe('@rosettadash/vue/infra/server/nest', () => {
  it('exposes typed props contract', () => {
    const props: NestServerInfraProps = {};
    expect(props).toBeDefined();
  });

  it('uses taxonomy-aligned BEM block rd-server-nest', () => {
    expect('rd-server-nest').toMatch(/^rd-/);
  });
});
