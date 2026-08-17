import { onMounted, ref, watch } from 'vue';

export type ThemePreference = 'system' | 'light' | 'dark';

const STORAGE_KEY = 'destination-atlas-theme';

function readStoredTheme(): ThemePreference {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system';
}

export function useThemePreference() {
  const theme = ref<ThemePreference>(readStoredTheme());

  watch(
    theme,
    (value) => {
      localStorage.setItem(STORAGE_KEY, value);
      if (value === 'system') {
        document.documentElement.removeAttribute('data-theme');
      } else {
        document.documentElement.setAttribute('data-theme', value);
      }
    },
    { immediate: true },
  );

  function setTheme(next: ThemePreference) {
    theme.value = next;
  }

  return { theme, setTheme };
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
