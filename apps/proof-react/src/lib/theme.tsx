import { useEffect, useState } from 'react';

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

export function ThemeToggle({
  theme,
  onChange,
}: {
  theme: ThemePreference;
  onChange: (theme: ThemePreference) => void;
}) {
  return (
    <label className="da-theme-toggle">
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
}
