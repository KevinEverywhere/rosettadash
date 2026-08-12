import type { NodeLayout } from '../model/types';

export type GroupingAnimationKey =
  | 'filter-table'
  | 'filter-chart'
  | 'data-stack'
  | 'form-row'
  | 'access-flow'
  | 'server-data';

export type CompanionPlacement = 'above' | 'below' | 'left' | 'right';

export type InstructionStepHighlight = 'source' | 'target' | 'bind' | 'layout';

export interface InstructionStep {
  order: number;
  title: string;
  body: string;
  highlight?: InstructionStepHighlight;
}

export interface ComponentGroupingGuide {
  type: string;
  summary: string;
  animationKey: GroupingAnimationKey;
  companionTypes: string[];
  placementMessage: string;
  steps?: InstructionStep[];
  outcomeSummary?: string;
  animationBlocks?: string[];
}

export interface PlacementPromptCompanion {
  type: string;
  label: string;
}

export interface PlacementPrompt {
  sourceNodeId: string;
  sourceType: string;
  message: string;
  animationKey: GroupingAnimationKey;
  companions: PlacementPromptCompanion[];
}

export interface CompanionLayoutOptions {
  gridSize?: number;
  defaultWidth?: number;
  defaultHeight?: number;
}

export type ResolvedCompanionLayout = Pick<NodeLayout, 'x' | 'y' | 'width' | 'height'>;
