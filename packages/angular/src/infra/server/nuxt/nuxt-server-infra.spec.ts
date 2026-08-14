import type { NuxtServerInfraProps } from './nuxt-server-infra';

describe('@rosettadash/angular/infra/server/nuxt', () => {
  it('exposes typed props contract', () => {
    const props: NuxtServerInfraProps = {};
    expect(props).toBeDefined();
  });

  it('uses taxonomy-aligned BEM block rd-server-nuxt', () => {
    expect('rd-server-nuxt').toMatch(/^rd-/);
  });
});
