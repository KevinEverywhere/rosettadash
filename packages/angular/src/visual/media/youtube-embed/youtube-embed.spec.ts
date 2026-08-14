import type { YoutubeEmbedProps } from './youtube-embed';

describe('@rosettadash/angular/visual/media/youtube-embed', () => {
  it('exposes a typed props contract', () => {
    const props: YoutubeEmbedProps = {
      videoId: 'dQw4w9WgXcQ',
      title: 'Sample',
    };
    expect(props.videoId).toBe('dQw4w9WgXcQ');
  });
});
