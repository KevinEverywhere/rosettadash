import { render } from '@testing-library/react';
import { DB_VIDEO_SOURCE_TAG } from '@rosettadash/web-components/visual/media/video-source';
import { VideoSource } from './VideoSource';

describe('@rosettadash/react/visual/media/video-source', () => {
  it('renders and registers the WC host', () => {
    const { container } = render(
      <VideoSource label="Clip" sourceWidth={3840} sourceHeight={1920} />,
    );
    const host = container.querySelector(DB_VIDEO_SOURCE_TAG);
    expect(host).toBeTruthy();
    expect(host?.getAttribute('label')).toBe('Clip');
    expect(host?.getAttribute('source-width')).toBe('3840');
    expect(customElements.get(DB_VIDEO_SOURCE_TAG)).toBeTruthy();
  });
});
