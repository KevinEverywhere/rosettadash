import type { GeoMapProps } from './types';

describe('@rosettadash/svelte/visual/display/geo-map', () => {
  it('exposes a typed props contract', () => {
    const props: GeoMapProps = {
      provider: 'google-maps',
      apiKey: 'test-key',
    };
    expect(props.apiKey).toBe('test-key');
  });
});
