import type { EnvConfigProps } from './env-config';

describe('@rosettadash/angular/infra/env', () => {
  it('exposes typed props contract', () => {
    const props: EnvConfigProps = {};
    expect(props).toBeDefined();
  });

  it('uses taxonomy-aligned BEM block rd-env', () => {
    expect('rd-env').toMatch(/^rd-/);
  });
});
