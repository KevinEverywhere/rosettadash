import { defaultComponentRegistry } from '../registry/component-registry';
import {
  findPaletteGroupIdForType,
  PALETTE_GROUP_DEFINITIONS,
  resolvePaletteGroups,
  validatePaletteGroupDefinitions,
} from './palette-groups';

describe('palette-groups', () => {
  it('validates group sizes and full P0 coverage', () => {
    expect(() => validatePaletteGroupDefinitions()).not.toThrow();
  });

  it('keeps every group within 2–7 items', () => {
    for (const group of PALETTE_GROUP_DEFINITIONS) {
      expect(group.types.length).toBeGreaterThanOrEqual(2);
      expect(group.types.length).toBeLessThanOrEqual(7);
    }
  });

  it('resolves registry definitions in group order', () => {
    const groups = resolvePaletteGroups(defaultComponentRegistry);
    expect(groups.map((group) => group.id)).toEqual([
      'form-inputs',
      'data-display',
      'logic-motion',
      'charts',
      'views',
      'layout',
      'access-onboarding',
      'data-sources',
      'api-servers',
      'news-discovery',
      'plugin-extensions',
      'vr-visuals',
      'svg-visuals',
      'media-authoring',
      'wasm-compute',
    ]);
    expect(groups[0]?.items[0]?.type).toBe('visual.input.text');
    expect(groups[1]?.items.map((item) => item.type)).toEqual([
      'visual.table',
      'visual.detail',
      'visual.kpi',
    ]);
    expect(groups[2]?.items.map((item) => item.type)).toEqual([
      'visual.skeleton',
      'logic.timer',
    ]);
  });

  it('finds the group id for a component type', () => {
    expect(findPaletteGroupIdForType('visual.table')).toBe('data-display');
    expect(findPaletteGroupIdForType('infra.server.nest')).toBe('api-servers');
    expect(findPaletteGroupIdForType('unknown.type')).toBeUndefined();
  });
});
