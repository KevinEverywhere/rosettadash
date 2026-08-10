import type { ExportTargetConfig, StackProfile } from '../model/types';

export type UiFrameworkChoice = StackProfile['ui'];
export type ServerTargetChoice = NonNullable<ExportTargetConfig['server']>;
export type DatabaseTargetChoice = NonNullable<ExportTargetConfig['database']>;

export type { StackProfile };

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

/** Idiomatic default partners per UI framework. */
const UI_PARTNER_DEFAULTS: Record<Exclude<UiFrameworkChoice, 'any'>, Required<Pick<StackProfile, 'server' | 'database'>>> = {
  react: { server: 'next', database: 'postgresql' },
  angular: { server: 'nest', database: 'postgresql' },
  vue: { server: 'nuxt', database: 'postgresql' },
  svelte: { server: 'nest', database: 'postgresql' },
};

export const DEFAULT_EXPORT_TARGETS: Required<ExportTargetConfig> = {
  ui: 'react',
  server: 'nest',
  database: 'postgresql',
};

export function getCompatibleStackDefaults(ui: UiFrameworkChoice): StackProfile {
  if (ui === 'any') {
    return { ui: 'any' };
  }

  const partners = UI_PARTNER_DEFAULTS[ui];
  return {
    ui,
    server: partners.server,
    database: partners.database,
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

  if (profile.ui === 'any') {
    return { ui: 'any' };
  }

  const defaults = getCompatibleStackDefaults(profile.ui);
  return {
    ui: profile.ui,
    server: profile.server ?? defaults.server,
    database: profile.database ?? defaults.database,
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

export function isScratchPadStack(profile: StackProfile | undefined): boolean {
  return profile?.ui === 'any' || !profile;
}
