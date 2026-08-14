export {
  RdGeoMapElement,
  DB_GEO_MAP_TAG,
  registerRdGeoMap,
  type GeoMapProps,
  type GeoMapMarker,
  type GeoMapProvider,
} from './geo-map/index.js';

import { registerRdGeoMap } from './geo-map/index.js';

export function registerRosettaDashDisplayElements(): void {
  registerRdGeoMap();
}
