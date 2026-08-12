import type { NodeLayout, StackProfile } from '../model/types';

export interface AiNodeSummary {
  id: string;
  type: string;
  label: string;
  outputs: string[];
  inputs: string[];
}

export interface AiBuilderContext {
  stackProfile?: StackProfile | null;
  selectedNodeIds: string[];
  selectedNodeSummaries: AiNodeSummary[];
  canvasNodeCount: number;
  availableComponentTypes: string[];
  paletteGroups: string[];
  groupingGuideHints?: string[];
}

export type AiBuilderAction =
  | {
      op: 'add_node';
      ref?: string;
      type: string;
      layout?: Partial<NodeLayout>;
      properties?: Record<string, unknown>;
    }
  | {
      op: 'bind';
      sourceNodeId?: string;
      sourceRef?: string;
      sourcePort: string;
      targetNodeId?: string;
      targetRef?: string;
      targetPort: string;
    }
  | {
      op: 'set_property';
      nodeId?: string;
      nodeRef?: string;
      key: string;
      value: unknown;
    }
  | { op: 'apply_template'; templateId: string }
  | { op: 'explain'; markdown: string };

export interface AiBuilderResponse {
  summary: string;
  actions: AiBuilderAction[];
  followUp?: string;
}

export interface AiActionValidationIssue {
  index: number;
  message: string;
}

export interface AiActionValidationResult {
  valid: boolean;
  issues: AiActionValidationIssue[];
  applicableActions: AiBuilderAction[];
  explainActions: Array<{ op: 'explain'; markdown: string }>;
}
