import type { GeoMapProps } from './geo-map';

describe('@rosettadash/angular/visual/display/geo-map', () => {
  it('exposes a typed props contract', () => {
    const props: GeoMapProps = {
      provider: 'leaflet',
      selectedId: 'paris',
    };
    expect(props.selectedId).toBe('paris');
  });
});
