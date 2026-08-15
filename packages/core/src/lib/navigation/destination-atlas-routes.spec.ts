import {
  DEFAULT_DESTINATION_ATLAS_SCREEN,
  pathForDestinationAtlasScreen,
  screenFromDestinationAtlasPath,
} from './destination-atlas-routes';

describe('destination atlas routes', () => {
  it('maps about to root', () => {
    expect(pathForDestinationAtlasScreen('about')).toBe('/');
    expect(screenFromDestinationAtlasPath('/')).toBe('about');
  });

  it('resolves nested screen paths', () => {
    expect(pathForDestinationAtlasScreen('authoring')).toBe('/authoring');
    expect(screenFromDestinationAtlasPath('/authoring/')).toBe('authoring');
  });

  it('falls back to about for unknown paths', () => {
    expect(screenFromDestinationAtlasPath('/missing')).toBe(DEFAULT_DESTINATION_ATLAS_SCREEN);
  });
});
