import { readString } from './element-utils.js';

export interface LinkListItem {
  label: string;
  href: string;
}

export function parseLinkItems(raw: string | null): LinkListItem[] {
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed
      .map((entry) => {
        if (!entry || typeof entry !== 'object') {
          return null;
        }
        const record = entry as Record<string, unknown>;
        const label = readString(record['label'], '');
        const href = readString(record['href'], '');
        if (!label || !href) {
          return null;
        }
        return { label, href };
      })
      .filter((item): item is LinkListItem => item !== null);
  } catch {
    return [];
  }
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
