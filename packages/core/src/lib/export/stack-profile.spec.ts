import {
  DEFAULT_EXPORT_TARGETS,
  getCompatibleStackDefaults,
  getCompatibleStylingOptions,
  getDefaultStyling,
  normalizeStackProfile,
  resolveEffectiveExportTargets,
  resolveEffectiveStyling,
  stackProfileToExportTargets,
} from './stack-profile';

describe('stack profile', () => {
  it('returns partner defaults for a concrete UI framework', () => {
    expect(getCompatibleStackDefaults('react')).toEqual({
      ui: 'react',
      server: 'next',
      database: 'postgresql',
      styling: 'tailwind',
    });
    expect(getCompatibleStackDefaults('vue')).toEqual({
      ui: 'vue',
      server: 'nuxt',
      database: 'postgresql',
      styling: 'tailwind',
    });
    expect(getCompatibleStackDefaults('angular')).toEqual({
      ui: 'angular',
      server: 'nest',
      database: 'postgresql',
      styling: 'angular-material',
    });
  });

  it('returns scratch-pad profile for any', () => {
    expect(getCompatibleStackDefaults('any')).toEqual({ ui: 'any', styling: 'neutral' });
    expect(stackProfileToExportTargets({ ui: 'any', styling: 'tailwind' })).toBeUndefined();
  });

  it('filters styling options by UI framework', () => {
    expect(getCompatibleStylingOptions('react').map((option) => option.id)).toEqual([
      'neutral',
      'tailwind',
      'mui',
      'plain-css',
    ]);
    expect(getCompatibleStylingOptions('any').map((option) => option.id)).toEqual([
      'neutral',
      'tailwind',
    ]);
  });

  it('normalizes partial profiles and styling compatibility', () => {
    expect(normalizeStackProfile({ ui: 'angular', server: 'express' })).toEqual({
      ui: 'angular',
      server: 'express',
      database: 'postgresql',
      styling: 'angular-material',
    });

    expect(
      normalizeStackProfile({ ui: 'react', styling: 'mui' as const, server: 'next', database: 'postgresql' }),
    ).toEqual({
      ui: 'react',
      server: 'next',
      database: 'postgresql',
      styling: 'mui',
    });

    expect(normalizeStackProfile({ ui: 'react', styling: 'vuetify' as never })).toEqual({
      ui: 'react',
      server: 'next',
      database: 'postgresql',
      styling: 'tailwind',
    });
  });

  it('resolves export targets from composite then project profile', () => {
    expect(
      resolveEffectiveExportTargets(
        { ui: 'svelte', server: 'nest', database: 'mongodb' },
        { ui: 'react', server: 'next', database: 'postgresql', styling: 'mui' },
      ),
    ).toEqual({ ui: 'svelte', server: 'nest', database: 'mongodb' });

    expect(
      resolveEffectiveExportTargets(undefined, {
        ui: 'vue',
        server: 'nuxt',
        database: 'postgresql',
        styling: 'vuetify',
      }),
    ).toEqual({ ui: 'vue', server: 'nuxt', database: 'postgresql' });

    expect(resolveEffectiveExportTargets(undefined, { ui: 'any', styling: 'tailwind' })).toEqual(
      DEFAULT_EXPORT_TARGETS,
    );
  });

  it('resolves styling from project profile for export UI target', () => {
    expect(
      resolveEffectiveStyling({ ui: 'react', styling: 'mui' }, 'react'),
    ).toBe('mui');
    expect(
      resolveEffectiveStyling({ ui: 'react', styling: 'mui' }, 'vue'),
    ).toBe(getDefaultStyling('vue'));
  });
});
