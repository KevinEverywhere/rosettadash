import {
  DEFAULT_EXPORT_TARGETS,
  getCompatibleStackDefaults,
  getCompatibleStylingAuthoring,
  getCompatibleStylingOptions,
  getDefaultStyling,
  getDefaultStylingProfile,
  normalizeStackProfile,
  normalizeStackStyling,
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
      styling: getDefaultStylingProfile('react'),
    });
    expect(getCompatibleStackDefaults('vue')).toEqual({
      ui: 'vue',
      server: 'nuxt',
      database: 'postgresql',
      styling: getDefaultStylingProfile('vue'),
    });
    expect(getCompatibleStackDefaults('angular')).toEqual({
      ui: 'angular',
      server: 'nest',
      database: 'postgresql',
      styling: getDefaultStylingProfile('angular'),
    });
  });

  it('returns scratch-pad profile for any', () => {
    expect(getCompatibleStackDefaults('any')).toEqual({
      ui: 'any',
      styling: getDefaultStylingProfile('any'),
    });
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
    expect(getCompatibleStylingAuthoring('react').map((option) => option.id)).toEqual([
      'css-modules',
      'styled-components',
      'plain-css',
    ]);
  });

  it('normalizes partial profiles and styling compatibility', () => {
    expect(normalizeStackProfile({ ui: 'angular', server: 'express' })).toEqual({
      ui: 'angular',
      server: 'express',
      database: 'postgresql',
      styling: getDefaultStylingProfile('angular'),
    });

    expect(normalizeStackProfile({ ui: 'react', server: 'none', database: 'none' })).toEqual({
      ui: 'react',
      server: 'none',
      database: 'none',
      styling: getDefaultStylingProfile('react'),
    });

    expect(
      normalizeStackProfile({ ui: 'react', styling: 'mui' as const, server: 'next', database: 'postgresql' }),
    ).toEqual({
      ui: 'react',
      server: 'next',
      database: 'postgresql',
      styling: normalizeStackStyling('react', 'mui'),
    });

    expect(normalizeStackProfile({ ui: 'react', styling: 'vuetify' as never })).toEqual({
      ui: 'react',
      server: 'next',
      database: 'postgresql',
      styling: normalizeStackStyling('react', 'vuetify'),
    });
  });

  it('maps none server/database choices to UI-only export targets', () => {
    expect(stackProfileToExportTargets({ ui: 'react', server: 'none', database: 'none' })).toEqual({
      ui: 'react',
    });

    expect(
      stackProfileToExportTargets({ ui: 'vue', server: 'nuxt', database: 'none', styling: 'tailwind' }),
    ).toEqual({
      ui: 'vue',
      server: 'nuxt',
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
