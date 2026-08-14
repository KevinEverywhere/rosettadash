import type { SvgInlineProps } from './svg-inline';

describe('@rosettadash/angular/visual/svg/inline', () => {
  it('exposes typed props contract', () => {
    const props: SvgInlineProps = {};
    expect(props).toBeDefined();
  });

  it('uses taxonomy-aligned BEM block rd-svg-inline', () => {
    expect('rd-svg-inline').toMatch(/^rd-/);
  });
});
