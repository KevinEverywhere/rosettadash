import type { EquirectViewportProps } from './equirect-viewport';

describe('@rosettadash/angular/visual/media/equirect-viewport', () => {
  it('exposes a typed props contract', () => {
    const props: EquirectViewportProps = {
      label: 'Viewport',
      previewMode: 'flat-crop',
      yaw: 10,
    };
    expect(props.previewMode).toBe('flat-crop');
  });
});
