import type { ExpressServerInfraProps } from './express-server-infra';

describe('@rosettadash/vue/infra/server/express', () => {
  it('exposes typed props contract', () => {
    const props: ExpressServerInfraProps = {};
    expect(props).toBeDefined();
  });

  it('uses taxonomy-aligned BEM block rd-server-express', () => {
    expect('rd-server-express').toMatch(/^rd-/);
  });
});
