/** Visual accent tokens for palette groups — used by creation wizard and palette highlights. */
export interface PaletteGroupColor {
  accent: string;
  soft: string;
  border: string;
}

export const PALETTE_GROUP_COLORS: Record<string, PaletteGroupColor> = {
  'form-inputs': {
    accent: '#2563eb',
    soft: 'rgb(37 99 235 / 12%)',
    border: 'rgb(37 99 235 / 35%)',
  },
  'data-display': {
    accent: '#059669',
    soft: 'rgb(5 150 105 / 12%)',
    border: 'rgb(5 150 105 / 35%)',
  },
  'logic-motion': {
    accent: '#7c3aed',
    soft: 'rgb(124 58 237 / 12%)',
    border: 'rgb(124 58 237 / 35%)',
  },
  charts: {
    accent: '#d97706',
    soft: 'rgb(217 119 6 / 12%)',
    border: 'rgb(217 119 6 / 35%)',
  },
  layout: {
    accent: '#0891b2',
    soft: 'rgb(8 145 178 / 12%)',
    border: 'rgb(8 145 178 / 35%)',
  },
  'access-onboarding': {
    accent: '#db2777',
    soft: 'rgb(219 39 119 / 12%)',
    border: 'rgb(219 39 119 / 35%)',
  },
  'data-sources': {
    accent: '#64748b',
    soft: 'rgb(100 116 139 / 12%)',
    border: 'rgb(100 116 139 / 35%)',
  },
  'api-servers': {
    accent: '#475569',
    soft: 'rgb(71 85 105 / 12%)',
    border: 'rgb(71 85 105 / 35%)',
  },
  'news-discovery': {
    accent: '#0d9488',
    soft: 'rgb(13 148 136 / 12%)',
    border: 'rgb(13 148 136 / 35%)',
  },
  'plugin-extensions': {
    accent: '#9333ea',
    soft: 'rgb(147 51 234 / 12%)',
    border: 'rgb(147 51 234 / 35%)',
  },
  'vr-visuals': {
    accent: '#4f46e5',
    soft: 'rgb(79 70 229 / 12%)',
    border: 'rgb(79 70 229 / 35%)',
  },
  'svg-visuals': {
    accent: '#ea580c',
    soft: 'rgb(234 88 12 / 12%)',
    border: 'rgb(234 88 12 / 35%)',
  },
  'media-authoring': {
    accent: '#0284c7',
    soft: 'rgb(2 132 199 / 12%)',
    border: 'rgb(2 132 199 / 35%)',
  },
  'wasm-compute': {
    accent: '#6366f1',
    soft: 'rgb(99 102 241 / 12%)',
    border: 'rgb(99 102 241 / 35%)',
  },
};

const FALLBACK_COLOR: PaletteGroupColor = {
  accent: '#64748b',
  soft: 'rgb(100 116 139 / 12%)',
  border: 'rgb(100 116 139 / 35%)',
};

export function paletteGroupColor(groupId: string): PaletteGroupColor {
  return PALETTE_GROUP_COLORS[groupId] ?? FALLBACK_COLOR;
}
