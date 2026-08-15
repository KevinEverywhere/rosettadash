import { useState } from 'react';
import type { GeoExplorerListPlacement } from '@rosettadash/react/layout/geo-explorer';
import { SelectInput } from '@rosettadash/react/visual/input/select';
import { useDestinationAtlasState } from '../state/useDestinationAtlasState';
import { MapScreen } from './MapScreen';
import { GlobeScreen } from './GlobeScreen';
import { MapsPanelNav } from '../components/MapsPanelNav';

export const MAPS_SOURCE = `<MapsScreen mapsPanel={mapsPanel}>
  <MapScreen part="toolbar" />
  <SelectInput label="Destination list placement" />
  <MapsPanelNav panel={mapsPanel} />
  {mapsPanel === 'map' ? <MapScreen part="explorer" /> : <GlobeScreen part="explorer" />}
</MapsScreen>`;

type Props = Pick<
  ReturnType<typeof useDestinationAtlasState>,
  | 'locale'
  | 'selectedId'
  | 'setSelectedId'
  | 'mapProvider'
  | 'setMapProvider'
  | 'mapLocationQuery'
  | 'setMapLocationQuery'
  | 'mapViewOverride'
  | 'focusDestinationOnMap'
  | 'goToMapView'
  | 'setScreen'
  | 'setHighlightTarget'
  | 'mapsPanel'
  | 'setMapsPanel'
>;

export function MapsScreen(props: Props) {
  const { mapsPanel, setMapsPanel, ...panelProps } = props;
  const [listPlacement, setListPlacement] = useState<GeoExplorerListPlacement>('right');

  return (
    <section className={`da-panel da-maps-panel da-maps-panel--${mapsPanel}`}>
      <div className="da-maps-panel__body">
        <div className="da-maps-toolbar">
          <MapScreen part="toolbar" embedded {...panelProps} />
          <SelectInput
            label="Destination list placement"
            options={[
              { value: 'right', label: 'List on right' },
              { value: 'left', label: 'List on left' },
            ]}
            value={listPlacement}
            onChange={(value) => setListPlacement(value as GeoExplorerListPlacement)}
          />
        </div>

        <MapsPanelNav panel={mapsPanel} onSelectPanel={setMapsPanel} />

        <div className="da-maps-explorer">
          {mapsPanel === 'map' ? (
            <MapScreen part="explorer" embedded listPlacement={listPlacement} {...panelProps} />
          ) : (
            <GlobeScreen part="explorer" embedded listPlacement={listPlacement} {...panelProps} />
          )}
        </div>

        {mapsPanel === 'globe' ? <GlobeScreen part="footer" embedded {...panelProps} /> : null}
      </div>
    </section>
  );
}
