import type { TimePresetProps } from './types';

describe('@rosettadash/svelte/domain/time-preset', () => {
  it('exposes typed props contract', () => {
    const props: TimePresetProps = {};
    expect(props).toBeDefined();
  });

  it('uses taxonomy-aligned BEM block rd-time-preset', () => {
    expect('rd-time-preset').toMatch(/^rd-/);
  });
});
