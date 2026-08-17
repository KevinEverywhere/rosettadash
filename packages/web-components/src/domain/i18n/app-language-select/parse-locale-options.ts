import { readString } from '../../../lib/element-utils.js';

export interface AppLocaleOption {
  code: string;
  label: string;
  nativeLabel?: string;
}

export function formatLocaleLabel(option: AppLocaleOption): string {
  if (option.nativeLabel && option.nativeLabel !== option.label) {
    return `${option.label} (${option.nativeLabel})`;
  }
  return option.label;
}

export function parseAppLocaleOptions(raw: string | null): AppLocaleOption[] {
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed
      .map((entry): AppLocaleOption | null => {
        if (!entry || typeof entry !== 'object') {
          return null;
        }
        const record = entry as Record<string, unknown>;
        const code = readString(record['code'], '');
        const label = readString(record['label'], '');
        if (!code || !label) {
          return null;
        }
        const nativeLabel = readString(record['nativeLabel'], '');
        return nativeLabel
          ? { code, label, nativeLabel }
          : { code, label };
      })
      .filter((item): item is AppLocaleOption => item !== null);
  } catch {
    return [];
  }
}
