import type {
  ExportTargetConfig,
  StackDatabaseChoice,
  StackProfile,
  StackServerChoice,
  StackStylingProfile,
  StylingAuthoring,
  StylingComponentLibrary,
  StylingFoundation,
  StylingFrameworkChoice,
} from '../model/types';

export type UiFrameworkChoice = StackProfile['ui'];
export type ServerTargetChoice = NonNullable<ExportTargetConfig['server']>;
export type DatabaseTargetChoice = NonNullable<ExportTargetConfig['database']>;

export type {
  StackProfile,
  StackStylingProfile,
  StylingFrameworkChoice,
  StackServerChoice,
  StackDatabaseChoice,
  StylingFoundation,
  StylingComponentLibrary,
  StylingAuthoring,
};

export const SERVER_STACK_ECOSYSTEM_NOTE =
  'v1 server exporters cover Node.js stacks below. Python (FastAPI, Django), Java (Spring), and Azure Functions are planned — pick None if you are UI-only for now.';

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

export const SERVER_STACK_OPTIONS: Array<{
  id: StackServerChoice;
  label: string;
  description?: string;
}> = [
  { id: 'none', label: 'None', description: 'UI components only — pick a server in export later' },
  { id: 'next', label: 'Next.js', description: 'React full-stack (Node.js)' },
  { id: 'nuxt', label: 'Nuxt', description: 'Vue full-stack (Node.js / Nitro)' },
  { id: 'nest', label: 'NestJS', description: 'TypeScript API framework (Node.js)' },
  { id: 'express', label: 'Express', description: 'Minimal Node.js HTTP server' },
];

export const DATABASE_TARGET_OPTIONS: Array<{ id: DatabaseTargetChoice; label: string }> = [
  { id: 'postgresql', label: 'PostgreSQL' },
  { id: 'mongodb', label: 'MongoDB' },
  { id: 'supabase', label: 'Supabase' },
  { id: 'mysql', label: 'MySQL' },
];

export const DATABASE_STACK_OPTIONS: Array<{
  id: StackDatabaseChoice;
  label: string;
  description?: string;
}> = [
  { id: 'none', label: 'None', description: 'Skip database export for now' },
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

export const STYLING_FOUNDATION_OPTIONS: Array<{
  id: StylingFoundation;
  label: string;
  description: string;
}> = [
  {
    id: 'neutral-tokens',
    label: 'Neutral tokens',
    description: 'DashBuilder CSS variables and semantic classes',
  },
  {
    id: 'tailwind',
    label: 'Tailwind CSS',
    description: 'Utility-first CSS layer shared across frameworks',
  },
];

export const STYLING_COMPONENT_LIBRARY_OPTIONS: Array<{
  id: StylingComponentLibrary;
  label: string;
  description: string;
}> = [
  { id: 'mui', label: 'MUI (Material UI)', description: 'Material Design components for React' },
  {
    id: 'angular-material',
    label: 'Angular Material',
    description: 'Material Design components for Angular',
  },
  { id: 'vuetify', label: 'Vuetify', description: 'Material Design components for Vue' },
];

export const STYLING_AUTHORING_OPTIONS: Array<{
  id: StylingAuthoring;
  label: string;
  description: string;
}> = [
  {
    id: 'css-modules',
    label: 'CSS Modules',
    description: 'Scoped .module.css classes colocated with components',
  },
  {
    id: 'styled-components',
    label: 'styled-components',
    description: 'CSS-in-JS styled primitives (React)',
  },
  { id: 'plain-css', label: 'Plain CSS', description: 'Standard stylesheets without a preprocessor' },
  { id: 'plain-scss', label: 'Plain SCSS', description: 'SCSS variables and component styles' },
];

const STYLING_FOUNDATION_BY_UI: Record<UiFrameworkChoice, StylingFoundation[]> = {
  any: ['neutral-tokens', 'tailwind'],
  react: ['neutral-tokens', 'tailwind'],
  angular: ['neutral-tokens', 'tailwind'],
  vue: ['neutral-tokens', 'tailwind'],
  svelte: ['neutral-tokens', 'tailwind'],
};

const STYLING_COMPONENT_LIBRARY_BY_UI: Record<UiFrameworkChoice, StylingComponentLibrary[]> = {
  any: [],
  react: ['mui'],
  angular: ['angular-material'],
  vue: ['vuetify'],
  svelte: [],
};

const STYLING_AUTHORING_BY_UI: Record<UiFrameworkChoice, StylingAuthoring[]> = {
  any: ['css-modules', 'plain-css'],
  react: ['css-modules', 'styled-components', 'plain-css'],
  angular: ['plain-scss', 'plain-css'],
  vue: ['css-modules', 'plain-css'],
  svelte: ['plain-css'],
};

const DEFAULT_STYLING_PROFILE_BY_UI: Record<UiFrameworkChoice, StackStylingProfile> = {
  any: { foundation: ['neutral-tokens'], authoring: ['plain-css'], inlineStyles: true },
  react: { foundation: ['tailwind'], authoring: ['css-modules'], inlineStyles: true },
  angular: {
    foundation: ['neutral-tokens'],
    componentLibrary: 'angular-material',
    authoring: ['plain-scss'],
    inlineStyles: true,
  },
  vue: { foundation: ['tailwind'], authoring: ['css-modules'], inlineStyles: true },
  svelte: { foundation: ['tailwind'], authoring: ['plain-css'], inlineStyles: true },
};

const LEGACY_STYLING_TO_PROFILE: Record<StylingFrameworkChoice, StackStylingProfile> = {
  neutral: { foundation: ['neutral-tokens'], authoring: ['plain-css'], inlineStyles: true },
  tailwind: { foundation: ['tailwind'], authoring: ['css-modules'], inlineStyles: true },
  mui: {
    foundation: ['neutral-tokens'],
    componentLibrary: 'mui',
    authoring: ['css-modules'],
    inlineStyles: true,
  },
  'angular-material': {
    foundation: ['neutral-tokens'],
    componentLibrary: 'angular-material',
    authoring: ['plain-scss'],
    inlineStyles: true,
  },
  vuetify: {
    foundation: ['neutral-tokens'],
    componentLibrary: 'vuetify',
    authoring: ['css-modules'],
    inlineStyles: true,
  },
  'plain-css': { foundation: ['neutral-tokens'], authoring: ['plain-css'], inlineStyles: true },
  'plain-scss': { foundation: ['neutral-tokens'], authoring: ['plain-scss'], inlineStyles: true },
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
  { server: ServerTargetChoice; database: DatabaseTargetChoice; styling: StylingFrameworkChoice }
> = {
  react: { server: 'next', database: 'postgresql', styling: 'tailwind' },
  angular: { server: 'nest', database: 'postgresql', styling: 'angular-material' },
  vue: { server: 'nuxt', database: 'postgresql', styling: 'tailwind' },
  svelte: { server: 'nest', database: 'postgresql', styling: 'tailwind' },
};

function isExportServerChoice(server: StackServerChoice | undefined): server is ServerTargetChoice {
  return !!server && server !== 'none';
}

function isExportDatabaseChoice(
  database: StackDatabaseChoice | undefined,
): database is DatabaseTargetChoice {
  return !!database && database !== 'none';
}

export const DEFAULT_EXPORT_TARGETS: Required<ExportTargetConfig> = {
  ui: 'react',
  server: 'nest',
  database: 'postgresql',
};

export function getCompatibleStylingFoundations(
  ui: UiFrameworkChoice,
): Array<{ id: StylingFoundation; label: string; description: string }> {
  const allowed = new Set(STYLING_FOUNDATION_BY_UI[ui]);
  return STYLING_FOUNDATION_OPTIONS.filter((option) => allowed.has(option.id));
}

export function getCompatibleStylingComponentLibraries(
  ui: UiFrameworkChoice,
): Array<{ id: StylingComponentLibrary; label: string; description: string }> {
  const allowed = new Set(STYLING_COMPONENT_LIBRARY_BY_UI[ui]);
  return STYLING_COMPONENT_LIBRARY_OPTIONS.filter((option) => allowed.has(option.id));
}

export function getCompatibleStylingAuthoring(
  ui: UiFrameworkChoice,
): Array<{ id: StylingAuthoring; label: string; description: string }> {
  const allowed = new Set(STYLING_AUTHORING_BY_UI[ui]);
  return STYLING_AUTHORING_OPTIONS.filter((option) => allowed.has(option.id));
}

const STYLING_NONE_CHIP = {
  id: 'none' as const,
  label: 'None',
};

export type StylingFoundationStackChoice = StylingFoundation | 'none';
export type StylingAuthoringStackChoice = StylingAuthoring | 'none';
export type StylingComponentLibraryStackChoice = StylingComponentLibrary | 'none';

export function createEmptyStylingProfile(): StackStylingProfile {
  return { foundation: [], authoring: [], inlineStyles: false };
}

export function isEmptyStylingProfile(profile: StackStylingProfile): boolean {
  return (
    profile.foundation.length === 0 &&
    profile.authoring.length === 0 &&
    !profile.componentLibrary &&
    !profile.inlineStyles
  );
}

export function getStylingFoundationStackOptions(
  ui: UiFrameworkChoice,
): Array<{ id: StylingFoundationStackChoice; label: string; description: string }> {
  return [
    {
      ...STYLING_NONE_CHIP,
      description: 'No foundation layer — choose at export',
    },
    ...getCompatibleStylingFoundations(ui),
  ];
}

export function getStylingComponentLibraryStackOptions(
  ui: UiFrameworkChoice,
): Array<{ id: StylingComponentLibraryStackChoice; label: string; description: string }> {
  return [
    {
      ...STYLING_NONE_CHIP,
      description: 'No component library — use primitives or pick at export',
    },
    ...getCompatibleStylingComponentLibraries(ui),
  ];
}

export function getStylingAuthoringStackOptions(
  ui: UiFrameworkChoice,
): Array<{ id: StylingAuthoringStackChoice; label: string; description: string }> {
  return [
    {
      ...STYLING_NONE_CHIP,
      description: 'No authoring preference — choose at export',
    },
    ...getCompatibleStylingAuthoring(ui),
  ];
}

export function getDefaultStylingProfile(ui: UiFrameworkChoice): StackStylingProfile {
  return cloneStylingProfile(DEFAULT_STYLING_PROFILE_BY_UI[ui]);
}

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

export function normalizeStackStyling(
  ui: UiFrameworkChoice,
  styling: StackStylingProfile | StylingFrameworkChoice | undefined,
): StackStylingProfile {
  const base =
    styling === undefined
      ? createEmptyStylingProfile()
      : typeof styling === 'string'
        ? cloneStylingProfile(LEGACY_STYLING_TO_PROFILE[styling])
        : cloneStylingProfile(styling);

  const foundation = base.foundation.filter((item) => STYLING_FOUNDATION_BY_UI[ui].includes(item));
  const authoring = base.authoring.filter((item) => STYLING_AUTHORING_BY_UI[ui].includes(item));
  const componentLibrary =
    base.componentLibrary && STYLING_COMPONENT_LIBRARY_BY_UI[ui].includes(base.componentLibrary)
      ? base.componentLibrary
      : undefined;

  return {
    foundation,
    authoring,
    ...(componentLibrary ? { componentLibrary } : {}),
    inlineStyles: base.inlineStyles ?? false,
  };
}

export function stylingProfilePrimaryFramework(profile: StackStylingProfile): StylingFrameworkChoice {
  if (profile.componentLibrary === 'mui') {
    return 'mui';
  }
  if (profile.componentLibrary === 'angular-material') {
    return 'angular-material';
  }
  if (profile.componentLibrary === 'vuetify') {
    return 'vuetify';
  }
  if (profile.foundation.includes('tailwind')) {
    return 'tailwind';
  }
  return 'neutral';
}

export function formatStylingProfileSummary(profile: StackStylingProfile): string {
  const parts: string[] = [];
  if (profile.foundation.length > 0) {
    parts.push(
      profile.foundation
        .map((item) => STYLING_FOUNDATION_OPTIONS.find((option) => option.id === item)?.label ?? item)
        .join(' + '),
    );
  }
  if (profile.componentLibrary) {
    parts.push(
      STYLING_COMPONENT_LIBRARY_OPTIONS.find((option) => option.id === profile.componentLibrary)?.label ??
        profile.componentLibrary,
    );
  }
  if (profile.authoring.length > 0) {
    parts.push(
      profile.authoring
        .map((item) => STYLING_AUTHORING_OPTIONS.find((option) => option.id === item)?.label ?? item)
        .join(' + '),
    );
  }
  if (profile.inlineStyles) {
    parts.push('inline styles');
  }
  return parts.join(' · ');
}

function cloneStylingProfile(profile: StackStylingProfile): StackStylingProfile {
  return {
    foundation: [...profile.foundation],
    authoring: [...profile.authoring],
    inlineStyles: profile.inlineStyles,
    ...(profile.componentLibrary ? { componentLibrary: profile.componentLibrary } : {}),
  };
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

export function resolveEffectiveStylingProfile(
  projectProfile: StackProfile | undefined,
  uiTarget: NonNullable<ExportTargetConfig['ui']>,
): StackStylingProfile {
  const normalized = normalizeStackProfile(projectProfile);
  if (!normalized?.styling) {
    return getDefaultStylingProfile(uiTarget);
  }

  if (normalized.ui !== 'any' && normalized.ui !== uiTarget) {
    return getDefaultStylingProfile(uiTarget);
  }

  const styling = normalizeStackStyling(uiTarget, normalized.styling);
  return isEmptyStylingProfile(styling) ? getDefaultStylingProfile(uiTarget) : styling;
}

export function getCompatibleStackDefaults(ui: UiFrameworkChoice): StackProfile {
  if (ui === 'any') {
    return { ui: 'any', styling: createEmptyStylingProfile() };
  }

  const partners = UI_PARTNER_DEFAULTS[ui];
  return {
    ui,
    server: partners.server,
    database: partners.database,
    styling: createEmptyStylingProfile(),
  };
}

export function stackProfileToExportTargets(profile: StackProfile): ExportTargetConfig | undefined {
  if (profile.ui === 'any') {
    return undefined;
  }

  const targets: ExportTargetConfig = { ui: profile.ui };

  if (isExportServerChoice(profile.server)) {
    targets.server = profile.server;
  } else if (profile.server === undefined) {
    targets.server = UI_PARTNER_DEFAULTS[profile.ui].server;
  }

  if (isExportDatabaseChoice(profile.database)) {
    targets.database = profile.database;
  } else if (profile.database === undefined) {
    targets.database = UI_PARTNER_DEFAULTS[profile.ui].database;
  }

  return targets;
}

export function normalizeStackProfile(profile: StackProfile | undefined): StackProfile | undefined {
  if (!profile) {
    return undefined;
  }

  const styling = normalizeStackStyling(profile.ui, profile.styling);

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
  return stylingProfilePrimaryFramework(resolveEffectiveStylingProfile(projectProfile, uiTarget));
}

export function stylingFrameworkLabel(styling: StylingFrameworkChoice): string {
  return STYLING_FRAMEWORK_OPTIONS.find((option) => option.id === styling)?.label ?? styling;
}

export function serverStackLabel(server: StackServerChoice | undefined): string {
  return SERVER_STACK_OPTIONS.find((option) => option.id === server)?.label ?? server ?? 'None';
}

export function databaseStackLabel(database: StackDatabaseChoice | undefined): string {
  return DATABASE_STACK_OPTIONS.find((option) => option.id === database)?.label ?? database ?? 'None';
}

export function isScratchPadStack(profile: StackProfile | undefined): boolean {
  return profile?.ui === 'any' || !profile;
}
