import { useState } from 'react';
import { GeoExplorerLayout, type GeoExplorerListPlacement } from '@rosettadash/react/layout/geo-explorer';
import { ThreeGeoGlobe } from '@rosettadash/react/visual/display/3d-geo-globe';
import { SelectInput } from '@rosettadash/react/visual/input/select';
import {
  DEFAULT_WORLD_EQUIRECT_ATTRIBUTION,
  DEFAULT_WORLD_EQUIRECT_URL,
  GLOBE_TEXTURE_SOURCE_OPTIONS,
  MOCK_DESTINATIONS,
} from '@destination-atlas';
import type { AtlasContext } from '../state/useDestinationAtlasState';
import { formatRegionLabel, localizedDestinationName } from '../lib/atlas-utils';

export const GLOBE_SOURCE = `<GlobeScreen locale={locale} selectedId={selectedId}>
  <GeoExplorerLayout listPlacement={listPlacement} items={destinationItems} selectedId={selectedId}>
    <ThreeGeoGlobe textureUrl={DEFAULT_WORLD_EQUIRECT_URL} markers={destinationMarkers} selectedId={selectedId} />
  </GeoExplorerLayout>
</GlobeScreen>`;

type Props = Pick<AtlasContext, 'locale' | 'selectedId' | 'setSelectedId' | 'focusDestinationOnMap'>;

export function GlobeScreen({ locale, selectedId, setSelectedId, focusDestinationOnMap }: Props) {
  const [listPlacement, setListPlacement] = useState<GeoExplorerListPlacement>('right');

  const markers = MOCK_DESTINATIONS.map((dest) => ({
    id: dest.id,
    lat: dest.lat,
    lng: dest.lng,
    label: localizedDestinationName(dest, locale),
  }));

  const listItems = MOCK_DESTINATIONS.map((dest) => ({
    id: dest.id,
    label: localizedDestinationName(dest, locale),
    meta: formatRegionLabel(dest.region),
  }));

  const selectFromList = (id: string) => {
    setSelectedId(id);
  };

  const selectFromGlobe = (id: string) => {
    if (id === selectedId) {
      focusDestinationOnMap(id);
      return;
    }
    setSelectedId(id);
  };

  return (
    <section className="da-panel">
      <h2>Globe</h2>
      <p>
        Three.js globe with dataset destination markers — pick a destination in the list to fly the globe to it;
        click the same marker again to open the Map screen.
      </p>

      <SelectInput
        label="Destination list placement"
        options={[
          { value: 'right', label: 'List on right' },
          { value: 'left', label: 'List on left' },
        ]}
        value={listPlacement}
        onChange={(value) => setListPlacement(value as GeoExplorerListPlacement)}
      />

      <GeoExplorerLayout
        title="World view"
        listPlacement={listPlacement}
        items={listItems}
        selectedId={selectedId}
        onSelect={selectFromList}
      >
        <ThreeGeoGlobe
          title="Destination globe (Three.js)"
          textureUrl={DEFAULT_WORLD_EQUIRECT_URL}
          markers={markers}
          selectedId={selectedId}
          onMarkerSelect={selectFromGlobe}
        />
      </GeoExplorerLayout>

      <p className="da-note">{DEFAULT_WORLD_EQUIRECT_ATTRIBUTION}</p>
      <details className="da-globe-sources">
        <summary>Future globe texture sources</summary>
        <ul>
          {GLOBE_TEXTURE_SOURCE_OPTIONS.map((source) => (
            <li key={source.id}>
              <strong>{source.label}</strong> — {source.license}. {source.notes}
              {source.apiKeyRequired ? ' API key required.' : ''}
            </li>
          ))}
        </ul>
      </details>
    </section>
  );
}
