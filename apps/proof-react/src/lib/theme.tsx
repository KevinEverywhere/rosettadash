import { forwardRef, useEffect, useState } from 'react';

export type ThemePreference = 'system' | 'light' | 'dark';

const STORAGE_KEY = 'destination-atlas-theme';

export function useThemePreference(): {
  theme: ThemePreference;
  setTheme: (theme: ThemePreference) => void;
} {
  const [theme, setThemeState] = useState<ThemePreference>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, theme);
    if (theme === 'system') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);

  return {
    theme,
    setTheme: setThemeState,
  };
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

export const ThemeToggle = forwardRef<
  HTMLLabelElement,
  {
    theme: ThemePreference;
    onChange: (theme: ThemePreference) => void;
    className?: string;
  }
>(function ThemeToggle({ theme, onChange, className }, ref) {
  const rootClass = ['da-theme-toggle', className].filter(Boolean).join(' ');
  return (
    <label ref={ref} className={rootClass}>
      <span>Theme</span>
      <select
        value={theme}
        onChange={(event) => onChange(event.target.value as ThemePreference)}
        aria-label="Color theme"
      >
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>
  );
});
