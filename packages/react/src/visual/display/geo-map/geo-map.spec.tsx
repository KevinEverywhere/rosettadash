import type { GeoMapProps } from './GeoMap';

describe('@rosettadash/react/visual/display/geo-map', () => {
  it('exposes a typed props contract', () => {
    const props: GeoMapProps = {
      provider: 'maplibre',
      center: '48.8566,2.3522',
      zoom: 5,
    };
    expect(props.provider).toBe('maplibre');
  });
});
