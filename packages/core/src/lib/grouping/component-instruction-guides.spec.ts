import { PALETTE_GROUP_DEFINITIONS } from '../palette/palette-groups';
import {
  getGroupingGuide,
  getInstructionSteps,
  hasInstructionGuide,
  listGroupingGuides,
  listInstructionGuides,
  resolveGroupingAnimationBlocks,
} from './component-grouping-guides';
import { HAND_AUTHORED_INSTRUCTION_TYPES } from './component-instruction-guides';

const PALETTE_TYPES = PALETTE_GROUP_DEFINITIONS.flatMap((group) => group.types);

describe('component-instruction-guides', () => {
  it('defines hand-authored instruction guides for ten priority components', () => {
    expect(HAND_AUTHORED_INSTRUCTION_TYPES).toHaveLength(10);
  });

  it('covers every palette component with grouping and instruction guides', () => {
    expect(listGroupingGuides().length).toBeGreaterThanOrEqual(PALETTE_TYPES.length);

    for (const type of PALETTE_TYPES) {
      expect(getGroupingGuide(type)).toBeDefined();
      expect(hasInstructionGuide(type)).toBe(true);
      expect(getInstructionSteps(type).length).toBeGreaterThanOrEqual(3);
    }
  });

  it('includes at least three ordered steps for each instruction guide', () => {
    for (const guide of listInstructionGuides()) {
      expect(guide.steps?.length).toBeGreaterThanOrEqual(3);
      expect(guide.steps?.[0]?.order).toBe(1);
    }
  });

  it('merges hand-authored metadata for priority components', () => {
    const tableGuide = getGroupingGuide('visual.table');
    expect(tableGuide?.outcomeSummary).toContain('Sortable tabular view');
    expect(tableGuide?.steps?.length).toBe(5);
    expect(tableGuide && resolveGroupingAnimationBlocks(tableGuide)).toEqual([
      'Date Range',
      'Data Table',
      'Detail',
    ]);
  });

  it('auto-generates instructions for components without hand-authored guides', () => {
    const textGuide = getGroupingGuide('visual.input.text');
    expect(textGuide?.steps?.length).toBe(5);
    expect(textGuide?.steps?.[2]?.title).toBe('Add what it goes with');
    expect(textGuide?.outcomeSummary).toContain('Single-line text field');
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
});
