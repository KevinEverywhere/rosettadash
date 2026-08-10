import type { ExportTargetConfig, StackProfile, StylingFrameworkChoice } from '../model/types';

export type UiFrameworkChoice = StackProfile['ui'];
export type ServerTargetChoice = NonNullable<ExportTargetConfig['server']>;
export type DatabaseTargetChoice = NonNullable<ExportTargetConfig['database']>;

export type { StackProfile, StylingFrameworkChoice };

export const UI_FRAMEWORK_OPTIONS: Array<{ id: UiFrameworkChoice; label: string; description: string }> = [
  { id: 'any', label: 'Any (scratch pad)', description: 'Experiment freely — pick export targets later' },
  { id: 'react', label: 'React', description: 'TSX components and hooks' },
  { id: 'angular', label: 'Angular', description: 'Standalone components' },
  { id: 'vue', label: 'Vue', description: 'Composition API SFCs' },
  { id: 'svelte', label: 'Svelte', description: 'Svelte 5 runes + SFCs' },
];

export const SERVER_TARGET_OPTIONS: Array<{ id: ServerTargetChoice; label: string }> = [
  { id: 'nest', label: 'NestJS' },
  { id: 'express', label: 'Express' },
  { id: 'next', label: 'Next.js' },
  { id: 'nuxt', label: 'Nuxt' },
];

export const DATABASE_TARGET_OPTIONS: Array<{ id: DatabaseTargetChoice; label: string }> = [
  { id: 'postgresql', label: 'PostgreSQL' },
  { id: 'mongodb', label: 'MongoDB' },
  { id: 'supabase', label: 'Supabase' },
  { id: 'mysql', label: 'MySQL' },
];

export const STYLING_FRAMEWORK_OPTIONS: Array<{
  id: StylingFrameworkChoice;
  label: string;
  description: string;
}> = [
  {
    id: 'neutral',
    label: 'Neutral tokens',
    description: 'DashBuilder CSS variables and semantic classes (current default export)',
  },
  {
    id: 'tailwind',
    label: 'Tailwind CSS',
    description: 'Utility-first CSS shared across React, Vue, Svelte, and Angular',
  },
  {
    id: 'mui',
    label: 'MUI (Material UI)',
    description: 'Material Design component library for React',
  },
  {
    id: 'angular-material',
    label: 'Angular Material',
    description: 'Material Design components for Angular',
  },
  {
    id: 'vuetify',
    label: 'Vuetify',
    description: 'Material Design component library for Vue',
  },
  {
    id: 'plain-css',
    label: 'Plain CSS',
    description: 'Minimal custom stylesheet without a utility framework',
  },
  {
    id: 'plain-scss',
    label: 'Plain SCSS',
    description: 'SCSS variables and component styles (typical for Angular)',
  },
];

const STYLING_BY_UI: Record<UiFrameworkChoice, StylingFrameworkChoice[]> = {
  any: ['neutral', 'tailwind'],
  react: ['neutral', 'tailwind', 'mui', 'plain-css'],
  angular: ['neutral', 'angular-material', 'tailwind', 'plain-scss'],
  vue: ['neutral', 'tailwind', 'vuetify', 'plain-css'],
  svelte: ['neutral', 'tailwind', 'plain-css'],
};

const DEFAULT_STYLING_BY_UI: Record<UiFrameworkChoice, StylingFrameworkChoice> = {
  any: 'neutral',
  react: 'tailwind',
  angular: 'angular-material',
  vue: 'tailwind',
  svelte: 'tailwind',
};

/** Idiomatic default partners per UI framework. */
const UI_PARTNER_DEFAULTS: Record<
  Exclude<UiFrameworkChoice, 'any'>,
  Required<Pick<StackProfile, 'server' | 'database' | 'styling'>>
> = {
  react: { server: 'next', database: 'postgresql', styling: 'tailwind' },
  angular: { server: 'nest', database: 'postgresql', styling: 'angular-material' },
  vue: { server: 'nuxt', database: 'postgresql', styling: 'tailwind' },
  svelte: { server: 'nest', database: 'postgresql', styling: 'tailwind' },
};

export const DEFAULT_EXPORT_TARGETS: Required<ExportTargetConfig> = {
  ui: 'react',
  server: 'nest',
  database: 'postgresql',
};

export function getCompatibleStylingOptions(
  ui: UiFrameworkChoice,
): Array<{ id: StylingFrameworkChoice; label: string; description: string }> {
  const allowed = new Set(STYLING_BY_UI[ui]);
  return STYLING_FRAMEWORK_OPTIONS.filter((option) => allowed.has(option.id));
}

export function getDefaultStyling(ui: UiFrameworkChoice): StylingFrameworkChoice {
  return DEFAULT_STYLING_BY_UI[ui];
}

export function isStylingCompatible(
  ui: UiFrameworkChoice,
  styling: StylingFrameworkChoice,
): boolean {
  return STYLING_BY_UI[ui].includes(styling);
}

export function normalizeStyling(
  ui: UiFrameworkChoice,
  styling: StylingFrameworkChoice | undefined,
): StylingFrameworkChoice {
  if (styling && isStylingCompatible(ui, styling)) {
    return styling;
  }

  return getDefaultStyling(ui);
}

export function getCompatibleStackDefaults(ui: UiFrameworkChoice): StackProfile {
  if (ui === 'any') {
    return { ui: 'any', styling: getDefaultStyling('any') };
  }

  const partners = UI_PARTNER_DEFAULTS[ui];
  return {
    ui,
    server: partners.server,
    database: partners.database,
    styling: partners.styling,
  };
}

export function stackProfileToExportTargets(profile: StackProfile): ExportTargetConfig | undefined {
  if (profile.ui === 'any') {
    return undefined;
  }

  return {
    ui: profile.ui,
    server: profile.server ?? UI_PARTNER_DEFAULTS[profile.ui].server,
    database: profile.database ?? UI_PARTNER_DEFAULTS[profile.ui].database,
  };
}

export function normalizeStackProfile(profile: StackProfile | undefined): StackProfile | undefined {
  if (!profile) {
    return undefined;
  }

  const styling = normalizeStyling(profile.ui, profile.styling);

  if (profile.ui === 'any') {
    return { ui: 'any', styling };
  }

  const defaults = getCompatibleStackDefaults(profile.ui);
  return {
    ui: profile.ui,
    server: profile.server ?? defaults.server,
    database: profile.database ?? defaults.database,
    styling,
  };
}

export function resolveEffectiveExportTargets(
  compositeTargets: ExportTargetConfig | undefined,
  projectProfile: StackProfile | undefined,
): Required<ExportTargetConfig> {
  if (compositeTargets?.ui) {
    return {
      ui: compositeTargets.ui,
      server: compositeTargets.server ?? DEFAULT_EXPORT_TARGETS.server,
      database: compositeTargets.database ?? DEFAULT_EXPORT_TARGETS.database,
    };
  }

  const fromProfile = stackProfileToExportTargets(normalizeStackProfile(projectProfile) ?? { ui: 'any' });
  if (fromProfile?.ui) {
    return {
      ui: fromProfile.ui,
      server: fromProfile.server ?? DEFAULT_EXPORT_TARGETS.server,
      database: fromProfile.database ?? DEFAULT_EXPORT_TARGETS.database,
    };
  }

  return { ...DEFAULT_EXPORT_TARGETS };
}

export function resolveEffectiveStyling(
  projectProfile: StackProfile | undefined,
  uiTarget: NonNullable<ExportTargetConfig['ui']>,
): StylingFrameworkChoice {
  const normalized = normalizeStackProfile(projectProfile);
  if (normalized?.styling && isStylingCompatible(uiTarget, normalized.styling)) {
    return normalized.styling;
  }

  return getDefaultStyling(uiTarget);
}

export function stylingFrameworkLabel(styling: StylingFrameworkChoice): string {
  return STYLING_FRAMEWORK_OPTIONS.find((option) => option.id === styling)?.label ?? styling;
}

export function isScratchPadStack(profile: StackProfile | undefined): boolean {
  return profile?.ui === 'any' || !profile;
}
