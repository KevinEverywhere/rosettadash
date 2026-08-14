import { ThreeGeoGlobe } from '@rosettadash/react/visual/display/3d-geo-globe';
import { MOCK_DESTINATIONS } from '@destination-atlas';
import type { AtlasContext } from '../state/useDestinationAtlasState';
import { localizedDestinationName } from '../lib/atlas-utils';

type Props = Pick<AtlasContext, 'locale' | 'selectedId'>;

export function GlobeScreen({ locale, selectedId }: Props) {
  return (
    <section className="da-panel">
      <h2>Globe</h2>
      <p>3D geo globe host with lat/lng markers from the destination rowset.</p>
      <ThreeGeoGlobe title="Destination globe" mode="geo-globe" />
      <p className="da-note">
        Markers:{' '}
        {MOCK_DESTINATIONS.map((dest) => localizedDestinationName(dest, locale)).join(', ')}
        {selectedId ? ` · Selected: ${selectedId}` : ''}
      </p>
    </section>
  );
}
