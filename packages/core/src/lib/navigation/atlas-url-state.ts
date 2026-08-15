import type { DestinationAtlasScreenId } from './destination-atlas-routes';
import {
  DEFAULT_DESTINATION_ATLAS_SCREEN,
  pathForDestinationAtlasScreen,
  screenFromDestinationAtlasPath,
} from './destination-atlas-routes';

export const ATLAS_URL_PARAM_DEST = 'dest';
export const ATLAS_URL_PARAM_LOCALE = 'locale';
export const ATLAS_URL_PARAM_PROVIDER = 'provider';
export const ATLAS_URL_PARAM_ROLE = 'role';

export const ATLAS_GEO_MAP_PROVIDERS = ['maplibre', 'leaflet', 'google-maps'] as const;
export type AtlasGeoMapProvider = (typeof ATLAS_GEO_MAP_PROVIDERS)[number];

export const ATLAS_CLIENT_ROLES = ['viewer', 'editor', 'admin'] as const;
export type AtlasClientRole = (typeof ATLAS_CLIENT_ROLES)[number];

export interface AtlasUrlState {
  screen: DestinationAtlasScreenId;
  dest: string;
  locale: string;
  provider: AtlasGeoMapProvider;
  role: AtlasClientRole;
}

export interface AtlasUrlDefaults {
  dest: string;
  locale: string;
  provider: AtlasGeoMapProvider;
  role: AtlasClientRole;
}

export const DEFAULT_ATLAS_URL_DEFAULTS: AtlasUrlDefaults = {
  dest: '',
  locale: 'en',
  provider: 'leaflet',
  role: 'viewer',
};

function parseSearchParams(search: string): URLSearchParams {
  const normalized = search.startsWith('?') ? search.slice(1) : search;
  return new URLSearchParams(normalized);
}

export function parseAtlasGeoMapProvider(value: string | null | undefined): AtlasGeoMapProvider {
  if (value && (ATLAS_GEO_MAP_PROVIDERS as readonly string[]).includes(value)) {
    return value as AtlasGeoMapProvider;
  }
  return DEFAULT_ATLAS_URL_DEFAULTS.provider;
}

export function parseAtlasClientRole(value: string | null | undefined): AtlasClientRole {
  if (value && (ATLAS_CLIENT_ROLES as readonly string[]).includes(value)) {
    return value as AtlasClientRole;
  }
  return DEFAULT_ATLAS_URL_DEFAULTS.role;
}

export function parseAtlasUrlState(
  pathname: string,
  search: string,
  defaults: Partial<AtlasUrlDefaults> = {},
): AtlasUrlState {
  const mergedDefaults: AtlasUrlDefaults = {
    ...DEFAULT_ATLAS_URL_DEFAULTS,
    ...defaults,
  };
  const params = parseSearchParams(search);

  return {
    screen: screenFromDestinationAtlasPath(pathname),
    dest: params.get(ATLAS_URL_PARAM_DEST) ?? mergedDefaults.dest,
    locale: params.get(ATLAS_URL_PARAM_LOCALE) ?? mergedDefaults.locale,
    provider: parseAtlasGeoMapProvider(params.get(ATLAS_URL_PARAM_PROVIDER)),
    role: parseAtlasClientRole(params.get(ATLAS_URL_PARAM_ROLE)),
  };
}

export function buildAtlasSearchParams(
  state: Pick<AtlasUrlState, 'dest' | 'locale' | 'provider' | 'role'>,
  defaults: Partial<AtlasUrlDefaults> = {},
): URLSearchParams {
  const mergedDefaults: AtlasUrlDefaults = {
    ...DEFAULT_ATLAS_URL_DEFAULTS,
    ...defaults,
  };
  const params = new URLSearchParams();

  if (state.dest && state.dest !== mergedDefaults.dest) {
    params.set(ATLAS_URL_PARAM_DEST, state.dest);
  }
  if (state.locale && state.locale !== mergedDefaults.locale) {
    params.set(ATLAS_URL_PARAM_LOCALE, state.locale);
  }
  if (state.provider !== mergedDefaults.provider) {
    params.set(ATLAS_URL_PARAM_PROVIDER, state.provider);
  }
  if (state.role !== mergedDefaults.role) {
    params.set(ATLAS_URL_PARAM_ROLE, state.role);
  }

  return params;
}

export function buildAtlasLocation(
  screen: DestinationAtlasScreenId,
  state: Pick<AtlasUrlState, 'dest' | 'locale' | 'provider' | 'role'>,
  defaults: Partial<AtlasUrlDefaults> = {},
): { pathname: string; search: string } {
  const params = buildAtlasSearchParams(state, defaults);
  const search = params.toString();
  return {
    pathname: pathForDestinationAtlasScreen(screen),
    search: search ? `?${search}` : '',
  };
}

export function defaultAtlasScreenPath(): string {
  return pathForDestinationAtlasScreen(DEFAULT_DESTINATION_ATLAS_SCREEN);
}
