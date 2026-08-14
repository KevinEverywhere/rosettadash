/** BCP-47 locale option for app-level i18n (developer-owned translations). */
export interface AppLocaleOption {
  code: string;
  label: string;
  nativeLabel?: string;
}

/** Supported 2D map backends — developer selects via component `provider` prop. */
export type GeoMapProvider = 'maplibre' | 'leaflet' | 'google-maps';

export interface GeoMapProviderInfo {
  id: GeoMapProvider;
  label: string;
  costSummary: string;
  apiKeyRequired: boolean;
  notes: string;
}

export const GEO_MAP_PROVIDERS: GeoMapProviderInfo[] = [
  {
    id: 'leaflet',
    label: 'Leaflet',
    costSummary: 'OSS engine; tile costs depend on provider (OSM has usage policies)',
    apiKeyRequired: false,
    notes: 'Recommended default — lightweight raster maps with reliable rendering.',
  },
  {
    id: 'maplibre',
    label: 'MapLibre GL',
    costSummary: 'OSS engine; vector tiles often via paid/free-tier host (e.g. MapTiler)',
    apiKeyRequired: true,
    notes: 'Modern vector maps; tiles often need a third-party key.',
  },
  {
    id: 'google-maps',
    label: 'Google Maps',
    costSummary: 'Free tier then usage-based billing',
    apiKeyRequired: true,
    notes: 'Strong geocoding and POI data; Google branding and Terms of Service apply.',
  },
];

export interface DestinationHistoricStat {
  year: number;
  visitors: number;
}

/** Mock destination row for Destination Atlas proof apps. */
export interface Destination {
  id: string;
  name: string;
  region: string;
  lat: number;
  lng: number;
  youtubeId?: string;
  /** When `equirect`, show 360° tooling; default flat for standard video. */
  videoProjection?: 'flat' | 'equirect';
  equirectUrl?: string;
  visitorsCurrent: number;
  visitorsHistoric: DestinationHistoricStat[];
  /** Optional per-locale labels — wired by developer i18n, not RosettaDash chrome. */
  labels?: Record<string, string>;
}

export type DestinationAtlasScreenId =
  | 'overview'
  | 'destinations'
  | 'map'
  | 'globe'
  | 'media'
  | 'intel'
  | 'plan'
  | 'stack'
  | 'settings';

export interface DestinationAtlasScreen {
  id: DestinationAtlasScreenId;
  label: string;
  description: string;
}

export const DESTINATION_ATLAS_SCREENS: DestinationAtlasScreen[] = [
  {
    id: 'overview',
    label: 'Overview',
    description: 'Current KPIs and historic visitor trends.',
  },
  {
    id: 'destinations',
    label: 'Destinations',
    description: 'Searchable table with detail panel and filters.',
  },
  {
    id: 'map',
    label: 'Map',
    description: '2D map with provider choice (MapLibre, Leaflet, Google Maps).',
  },
  {
    id: 'globe',
    label: 'Globe',
    description: '3D geo globe with lat/lng markers.',
  },
  {
    id: 'media',
    label: 'Media',
    description: 'YouTube embeds, video source, and 360° equirect viewport.',
  },
  {
    id: 'intel',
    label: 'Intel',
    description: 'Region-filtered news and discovery.',
  },
  {
    id: 'plan',
    label: 'Plan',
    description: 'Trip planning forms and role-gated collaboration.',
  },
  {
    id: 'stack',
    label: 'Stack',
    description: 'Read-only infra configuration demo.',
  },
  {
    id: 'settings',
    label: 'Settings',
    description: 'App base language for developer i18n.',
  },
];

export const DEFAULT_APP_LOCALES: AppLocaleOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'es', label: 'Spanish', nativeLabel: 'Español' },
  { code: 'fr', label: 'French', nativeLabel: 'Français' },
  { code: 'de', label: 'German', nativeLabel: 'Deutsch' },
  { code: 'ja', label: 'Japanese', nativeLabel: '日本語' },
];
