import {
  DEFAULT_EXPORT_TARGETS,
  getCompatibleStackDefaults,
  normalizeStackProfile,
  resolveEffectiveExportTargets,
  stackProfileToExportTargets,
} from './stack-profile';

describe('stack profile', () => {
  it('returns partner defaults for a concrete UI framework', () => {
    expect(getCompatibleStackDefaults('react')).toEqual({
      ui: 'react',
      server: 'next',
      database: 'postgresql',
    });
    expect(getCompatibleStackDefaults('vue')).toEqual({
      ui: 'vue',
      server: 'nuxt',
      database: 'postgresql',
    });
  });

  it('returns scratch-pad profile for any', () => {
    expect(getCompatibleStackDefaults('any')).toEqual({ ui: 'any' });
    expect(stackProfileToExportTargets({ ui: 'any' })).toBeUndefined();
  });

  it('normalizes partial profiles', () => {
    expect(normalizeStackProfile({ ui: 'angular', server: 'express' })).toEqual({
      ui: 'angular',
      server: 'express',
      database: 'postgresql',
    });
  });

  it('resolves export targets from composite then project profile', () => {
    expect(
      resolveEffectiveExportTargets(
        { ui: 'svelte', server: 'nest', database: 'mongodb' },
        { ui: 'react', server: 'next', database: 'postgresql' },
      ),
    ).toEqual({ ui: 'svelte', server: 'nest', database: 'mongodb' });

    expect(
      resolveEffectiveExportTargets(undefined, { ui: 'vue', server: 'nuxt', database: 'postgresql' }),
    ).toEqual({ ui: 'vue', server: 'nuxt', database: 'postgresql' });

    expect(resolveEffectiveExportTargets(undefined, { ui: 'any' })).toEqual(DEFAULT_EXPORT_TARGETS);
  });
});
