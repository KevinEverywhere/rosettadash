import { ThreeGeoGlobe } from '@rosettadash/react/visual/display/3d-geo-globe';

export interface GlobeThreeMarker {
  id: string;
  lat: number;
  lng: number;
  label?: string;
}

export function GlobeThree({
  textureUrl,
  markers,
  selectedId,
  onMarkerSelect,
}: {
  textureUrl: string;
  markers: GlobeThreeMarker[];
  selectedId: string;
  onMarkerSelect: (id: string) => void;
}) {
  return (
    <ThreeGeoGlobe
      title="Destination globe (Three.js)"
      textureUrl={textureUrl}
      markers={markers}
      selectedId={selectedId}
      onMarkerSelect={onMarkerSelect}
    />
  );
}
