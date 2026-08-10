import {
  getGroupingGuide,
  getInstructionSteps,
  hasInstructionGuide,
  listInstructionGuides,
  resolveGroupingAnimationBlocks,
} from './component-grouping-guides';
import { INSTRUCTION_GUIDE_TYPES } from './component-instruction-guides';

describe('component-instruction-guides', () => {
  it('defines instruction guides for ten common component types', () => {
    expect(INSTRUCTION_GUIDE_TYPES).toHaveLength(10);
    expect(listInstructionGuides()).toHaveLength(10);
  });

  it('includes at least three ordered steps for each instruction guide', () => {
    for (const type of INSTRUCTION_GUIDE_TYPES) {
      const steps = getInstructionSteps(type);
      expect(steps.length).toBeGreaterThanOrEqual(3);
      expect(steps[0]?.order).toBe(1);
      expect(hasInstructionGuide(type)).toBe(true);
    }
  });

  it('merges instruction metadata into getGroupingGuide', () => {
    const tableGuide = getGroupingGuide('visual.table');
    expect(tableGuide?.outcomeSummary).toContain('Sortable tabular view');
    expect(tableGuide?.steps?.length).toBe(5);
    expect(tableGuide && resolveGroupingAnimationBlocks(tableGuide)).toEqual([
      'Date Range',
      'Data Table',
      'Detail',
    ]);
  });

  it('uses server-data animation for PostgreSQL instruction guide', () => {
    const guide = getGroupingGuide('infra.postgresql');
    expect(guide?.animationKey).toBe('server-data');
    expect(guide && resolveGroupingAnimationBlocks(guide)).toEqual([
      'NestJS Server',
      'PostgreSQL',
      'Data Table',
    ]);
  });

  it('returns empty steps for types without instruction enrichment', () => {
    expect(getInstructionSteps('visual.chart.pie')).toEqual([]);
    expect(hasInstructionGuide('visual.chart.pie')).toBe(false);
  });
});
