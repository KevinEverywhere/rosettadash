import type { VideoSourceProps } from './video-source';

describe('@rosettadash/angular/visual/media/video-source', () => {
  it('exposes a typed props contract', () => {
    const props: VideoSourceProps = {
      label: 'Clip',
      sourceWidth: 3840,
      sourceHeight: 1920,
    };
    expect(props.label).toBe('Clip');
  });
});
