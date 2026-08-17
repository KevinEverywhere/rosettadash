import {
  CLIENT_ROUTER_MODE_OPTIONS,
  DEFAULT_CLIENT_ROUTER_MODE,
  type ClientRouterMode,
} from '@rosettadash/core';

const STORAGE_KEY = 'rosettadash.clientRouterMode';

function readStoredRouterMode(): ClientRouterMode {
  if (typeof localStorage === 'undefined') {
    return DEFAULT_CLIENT_ROUTER_MODE;
  }
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && CLIENT_ROUTER_MODE_OPTIONS.some((option) => option.id === stored)) {
    return stored as ClientRouterMode;
  }
  return DEFAULT_CLIENT_ROUTER_MODE;
}

export function createClientRouterMode() {
  let routerMode = $state<ClientRouterMode>(readStoredRouterMode());

  function setRouterMode(mode: ClientRouterMode) {
    routerMode = mode;
    localStorage.setItem(STORAGE_KEY, mode);
  }

  return {
    get routerMode() {
      return routerMode;
    },
    setRouterMode,
  };
}
