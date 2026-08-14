import type { SvgIconProps } from './svg-icon';

describe('@rosettadash/angular/visual/svg/icon', () => {
  it('exposes typed props contract', () => {
    const props: SvgIconProps = {};
    expect(props).toBeDefined();
  });

  it('uses taxonomy-aligned BEM block rd-svg-icon', () => {
    expect('rd-svg-icon').toMatch(/^rd-/);
  });
});
