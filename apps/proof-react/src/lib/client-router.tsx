import { useCallback, useState, type ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
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

export function useClientRouterMode(): {
  routerMode: ClientRouterMode;
  setRouterMode: (mode: ClientRouterMode) => void;
} {
  const [routerMode, setRouterModeState] = useState<ClientRouterMode>(() => readStoredRouterMode());

  const setRouterMode = useCallback((mode: ClientRouterMode) => {
    setRouterModeState(mode);
    localStorage.setItem(STORAGE_KEY, mode);
  }, []);

  return { routerMode, setRouterMode };
}

export function ClientRouterProvider({
  children,
  mode = DEFAULT_CLIENT_ROUTER_MODE,
}: {
  children: ReactNode;
  mode?: ClientRouterMode;
}) {
  if (mode === 'browser') {
    return <BrowserRouter>{children}</BrowserRouter>;
  }

  return <BrowserRouter>{children}</BrowserRouter>;
}
