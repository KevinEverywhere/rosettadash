import type { EquirectViewportProps } from './types';

describe('@rosettadash/svelte/visual/media/equirect-viewport', () => {
  it('exposes a typed props contract', () => {
    const props: EquirectViewportProps = {
      label: 'Viewport',
      previewMode: 'flat-crop',
      yaw: 15,
    };
    expect(props.yaw).toBe(15);
  });
});
