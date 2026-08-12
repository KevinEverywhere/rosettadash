import { mount } from '@vue/test-utils';
import { DB_VIDEO_SOURCE_TAG } from '@rosettadash/web-components/visual/media/video-source';
import { VideoSource } from './index';

describe('@rosettadash/vue/visual/media/video-source', () => {
  it('renders and registers the WC host', () => {
    const wrapper = mount(VideoSource, {
      props: { label: 'Clip', sourceWidth: 3840, sourceHeight: 1920 },
    });

    const host = wrapper.find(DB_VIDEO_SOURCE_TAG);
    expect(host.exists()).toBe(true);
    expect(host.attributes('label')).toBe('Clip');
    expect(host.attributes('source-width')).toBe('3840');
    expect(customElements.get(DB_VIDEO_SOURCE_TAG)).toBeTruthy();
  });
});
