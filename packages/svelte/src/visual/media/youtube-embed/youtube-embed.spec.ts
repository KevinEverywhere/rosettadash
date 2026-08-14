import type { YoutubeEmbedProps } from './types';

describe('@rosettadash/svelte/visual/media/youtube-embed', () => {
  it('exposes a typed props contract', () => {
    const props: YoutubeEmbedProps = {
      videoId: 'dQw4w9WgXcQ',
    };
    expect(props.videoId).toBe('dQw4w9WgXcQ');
  });
});
