import { mount } from '@vue/test-utils';
import { DB_YOUTUBE_EMBED_TAG } from '@rosettadash/web-components/visual/media/youtube-embed';
import { YoutubeEmbed } from './index';

describe('@rosettadash/vue/visual/media/youtube-embed', () => {
  it('renders and registers the WC host', () => {
    const wrapper = mount(YoutubeEmbed, {
      props: { videoId: 'dQw4w9WgXcQ', title: 'Sample' },
    });

    const host = wrapper.find(DB_YOUTUBE_EMBED_TAG);
    expect(host.exists()).toBe(true);
    expect(host.attributes('video-id')).toBe('dQw4w9WgXcQ');
    expect(customElements.get(DB_YOUTUBE_EMBED_TAG)).toBeTruthy();
  });
});
