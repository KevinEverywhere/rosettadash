import { mount } from '@vue/test-utils';
import { DB_GEO_MAP_TAG } from '@rosettadash/web-components/visual/display/geo-map';
import { GeoMap } from './index';

describe('@rosettadash/vue/visual/display/geo-map', () => {
  it('renders and registers the WC host', () => {
    const wrapper = mount(GeoMap, {
      props: {
        provider: 'maplibre',
        center: '35.6762,139.6503',
        zoom: 8,
      },
    });

    const host = wrapper.find(DB_GEO_MAP_TAG);
    expect(host.exists()).toBe(true);
    expect(host.attributes('provider')).toBe('maplibre');
    expect(customElements.get(DB_GEO_MAP_TAG)).toBeTruthy();
  });
});
