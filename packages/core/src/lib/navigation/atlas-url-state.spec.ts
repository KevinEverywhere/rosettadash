import {
  buildAtlasLocation,
  buildAtlasSearchParams,
  parseAtlasUrlState,
} from './atlas-url-state';

describe('atlas url state', () => {
  const defaults = { dest: 'tokyo', locale: 'en', provider: 'leaflet' as const, role: 'viewer' as const };

  it('parses pathname and search params', () => {
    expect(parseAtlasUrlState('/map', '?dest=paris&locale=fr&provider=maplibre&role=admin', defaults)).toEqual({
      screen: 'map',
      dest: 'paris',
      locale: 'fr',
      provider: 'maplibre',
      role: 'admin',
    });
  });

  it('omits default query values when building search', () => {
    const params = buildAtlasSearchParams(
      { dest: 'tokyo', locale: 'en', provider: 'leaflet', role: 'viewer' },
      defaults,
    );
    expect(params.toString()).toBe('');
  });

  it('builds pathname and non-default search together', () => {
    expect(
      buildAtlasLocation(
        'settings',
        { dest: 'tokyo', locale: 'es', provider: 'leaflet', role: 'editor' },
        defaults,
      ),
    ).toEqual({ pathname: '/settings', search: '?locale=es&role=editor' });
  });
});
