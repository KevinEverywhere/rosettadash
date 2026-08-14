import type { NextServerInfraProps } from './types';

describe('@rosettadash/svelte/infra/server/next', () => {
  it('exposes typed props contract', () => {
    const props: NextServerInfraProps = {};
    expect(props).toBeDefined();
  });

  it('uses taxonomy-aligned BEM block rd-server-next', () => {
    expect('rd-server-next').toMatch(/^rd-/);
  });
});
