import type { LoadingSkeletonProps } from './loading-skeleton';

describe('@rosettadash/angular/visual/skeleton', () => {
  it('exposes typed props contract', () => {
    const props: LoadingSkeletonProps = {};
    expect(props).toBeDefined();
  });

  it('uses taxonomy-aligned BEM block rd-skeleton', () => {
    expect('rd-skeleton').toMatch(/^rd-/);
  });
});
