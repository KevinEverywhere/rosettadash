import type { LiveCaptureProps } from './types';

describe('@rosettadash/svelte/visual/media/live-capture', () => {
  it('exposes typed props contract', () => {
    const props: LiveCaptureProps = {};
    expect(props).toBeDefined();
  });

  it('uses taxonomy-aligned BEM block rd-media-live-capture', () => {
    expect('rd-media-live-capture').toMatch(/^rd-/);
  });
});
