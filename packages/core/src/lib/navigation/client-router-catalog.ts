import type { ClientRouterModeOption } from './types';

/** Pulldown catalog for host apps — extend when HashRouter / MemoryRouter ship. */
export const CLIENT_ROUTER_MODE_OPTIONS: readonly ClientRouterModeOption[] = [
  {
    id: 'browser',
    label: 'Browser (HTML5 history)',
    description: 'Uses the URL path and query string; supports back/forward navigation.',
  },
] as const;

export const DEFAULT_CLIENT_ROUTER_MODE = CLIENT_ROUTER_MODE_OPTIONS[0].id;
