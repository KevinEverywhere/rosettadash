import { mount } from '@vue/test-utils';
import { DB_EQUIRECT_VIEWPORT_TAG } from '@rosettadash/web-components/visual/media/equirect-viewport';
import { EquirectViewport } from './index';

describe('@rosettadash/vue/visual/media/equirect-viewport', () => {
  it('renders and registers the WC host', () => {
    const wrapper = mount(EquirectViewport, {
      props: { label: 'Viewport', previewMode: 'flat-crop', yaw: 15 },
    });

    const host = wrapper.find(DB_EQUIRECT_VIEWPORT_TAG);
    expect(host.exists()).toBe(true);
    expect(host.attributes('label')).toBe('Viewport');
    expect(host.attributes('preview-mode')).toBe('flat-crop');
    expect(host.attributes('yaw')).toBe('15');
    expect(customElements.get(DB_EQUIRECT_VIEWPORT_TAG)).toBeTruthy();
  });
});
