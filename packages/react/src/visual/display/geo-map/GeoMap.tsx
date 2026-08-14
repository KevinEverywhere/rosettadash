import { createElement, forwardRef, type CSSProperties } from 'react';
import {
  DB_GEO_MAP_TAG,
  registerRdGeoMap,
  type GeoMapMarker,
  type GeoMapProvider,
} from '@rosettadash/web-components/visual/display/geo-map';
import { useCustomElementHost } from '../../../lib/custom-element-host.js';

export type { GeoMapMarker, GeoMapProvider };

export interface GeoMapProps {
  provider?: GeoMapProvider;
  tileUrl?: string;
  apiKey?: string;
  center?: string;
  zoom?: number;
  markers?: GeoMapMarker[];
  selectedId?: string;
  minHeight?: string | number;
  className?: string;
  style?: CSSProperties;
  onMarkerSelect?: (detail: { id: string; lat: number; lng: number }) => void;
}

/** React wrapper around `<rd-geo-map>`. */
export const GeoMap = forwardRef<HTMLElement, GeoMapProps>(function GeoMap(
  {
    provider,
    tileUrl,
    apiKey,
    center,
    zoom,
    markers,
    selectedId,
    className,
    style,
    minHeight,
    onMarkerSelect,
  },
  ref,
) {
  const hostStyle: CSSProperties = {
    ...style,
    ...(minHeight !== undefined
      ? { minHeight: typeof minHeight === 'number' ? `${minHeight}px` : minHeight }
      : {}),
  };

  const hostRef = useCustomElementHost(
    {
      register: registerRdGeoMap,
      attrs: {
        tileUrl: 'tile-url',
        apiKey: 'api-key',
        selectedId: 'selected-id',
      },
      properties: ['markers'],
      events: {
        'marker-select': 'onMarkerSelect',
      },
    },
    { provider, tileUrl, apiKey, center, zoom, selectedId },
    {
      onMarkerSelect: onMarkerSelect as ((detail: unknown) => void) | undefined,
    },
    ref,
    { markers },
  );

  return createElement(DB_GEO_MAP_TAG, {
    ref: hostRef,
    className,
    style: hostStyle,
  });
});
