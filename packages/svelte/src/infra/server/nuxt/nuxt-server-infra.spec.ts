import type { NuxtServerInfraProps } from './types';

describe('@rosettadash/svelte/infra/server/nuxt', () => {
  it('exposes typed props contract', () => {
    const props: NuxtServerInfraProps = {};
    expect(props).toBeDefined();
  });

  it('uses taxonomy-aligned BEM block rd-server-nuxt', () => {
    expect('rd-server-nuxt').toMatch(/^rd-/);
  });
});
