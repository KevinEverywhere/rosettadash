import { Injectable, signal, effect } from '@angular/core';

export type ThemePreference = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'destination-atlas-theme';

function readStoredTheme(): ThemePreference {
  if (typeof localStorage === 'undefined') {
    return 'system';
  }
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored;
  }
  return 'system';
}

function applyTheme(theme: ThemePreference): void {
  if (theme === 'system') {
    document.documentElement.removeAttribute('data-theme');
    return;
  }
  document.documentElement.setAttribute('data-theme', theme);
}

export function themeLabel(theme: ThemePreference): string {
  switch (theme) {
    case 'light':
      return 'Light';
    case 'dark':
      return 'Dark';
    default:
      return 'System';
  }
}

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme = signal<ThemePreference>(readStoredTheme());

  constructor() {
    effect(() => {
      const value = this.theme();
      localStorage.setItem(STORAGE_KEY, value);
      applyTheme(value);
    });
    applyTheme(this.theme());
  }

  setTheme(theme: ThemePreference): void {
    this.theme.set(theme);
  }
}
