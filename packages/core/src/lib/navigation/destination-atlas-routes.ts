export type DestinationAtlasScreenId =
  | 'about'
  | 'overview'
  | 'destinations'
  | 'map'
  | 'globe'
  | 'media'
  | 'authoring'
  | 'intel'
  | 'plan'
  | 'views'
  | 'stack'
  | 'settings';

export interface DestinationAtlasRouteDefinition {
  id: DestinationAtlasScreenId;
  path: string;
}

/** Canonical path table for Destination Atlas proof apps. */
export const DESTINATION_ATLAS_ROUTES: readonly DestinationAtlasRouteDefinition[] = [
  { id: 'about', path: '/' },
  { id: 'overview', path: '/overview' },
  { id: 'destinations', path: '/destinations' },
  { id: 'map', path: '/map' },
  { id: 'globe', path: '/globe' },
  { id: 'media', path: '/media' },
  { id: 'authoring', path: '/authoring' },
  { id: 'intel', path: '/intel' },
  { id: 'plan', path: '/plan' },
  { id: 'views', path: '/views' },
  { id: 'stack', path: '/stack' },
  { id: 'settings', path: '/settings' },
] as const;

const PATH_BY_SCREEN = new Map(
  DESTINATION_ATLAS_ROUTES.map((route) => [route.id, route.path] as const),
);

const SCREEN_BY_PATH = new Map(
  DESTINATION_ATLAS_ROUTES.map((route) => [normalizePath(route.path), route.id] as const),
);

export const DEFAULT_DESTINATION_ATLAS_SCREEN: DestinationAtlasScreenId = 'about';

function normalizePath(pathname: string): string {
  if (!pathname || pathname === '/') {
    return '/';
  }
  const trimmed = pathname.replace(/\/+$/, '');
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

export function pathForDestinationAtlasScreen(screen: DestinationAtlasScreenId): string {
  return PATH_BY_SCREEN.get(screen) ?? '/';
}

export function screenFromDestinationAtlasPath(pathname: string): DestinationAtlasScreenId {
  const normalized = normalizePath(pathname);
  return SCREEN_BY_PATH.get(normalized) ?? DEFAULT_DESTINATION_ATLAS_SCREEN;
}

export function isKnownDestinationAtlasPath(pathname: string): boolean {
  return SCREEN_BY_PATH.has(normalizePath(pathname));
}
