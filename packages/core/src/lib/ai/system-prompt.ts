import type { AiBuilderContext } from './types';
import { DASHBOARD_STARTER_TEMPLATE_IDS } from '../templates/dashboard-starter-template-ids';

const DASHBOARD_STARTER_TEMPLATE_HINT = DASHBOARD_STARTER_TEMPLATE_IDS.join(', ');

export function buildAiAssistSystemPrompt(context: AiBuilderContext): string {
  const types = context.availableComponentTypes.slice(0, 80).join(', ');
  const groups = context.paletteGroups.join(', ');
  const selected = context.selectedNodeSummaries.length
    ? JSON.stringify(context.selectedNodeSummaries, null, 2)
    : 'none';

  return [
    'You are DashBuilder AI assist. Return ONLY valid JSON matching this schema:',
    '{ "summary": string, "actions": AiBuilderAction[], "followUp"?: string }',
    '',
    'AiBuilderAction ops:',
    '- add_node: { op, ref?, type, layout?, properties? } — ref is a temporary id for later bind/set_property',
    '- bind: { op, sourceNodeId?|sourceRef?, sourcePort, targetNodeId?|targetRef?, targetPort }',
    '- set_property: { op, nodeId?|nodeRef?, key, value }',
    `- apply_template: { op, templateId } — replaces canvas (analytics-overview, crud-list, onboarding, settings-admin, empty-starter, news-finder, ${DASHBOARD_STARTER_TEMPLATE_HINT})`,
    '- explain: { op, markdown } — read-only explanation, not applied to canvas',
    '',
    'Rules:',
    '- Use only component types from the allowed list.',
    '- Prefer small, valid steps (add nodes, then bind).',
    '- Use refs for nodes you add in the same response when binding.',
    '- Never invent API keys, env values, or server URLs.',
    '- Do not output markdown outside the JSON object.',
    '',
    `Allowed component types: ${types}`,
    `Palette groups: ${groups}`,
    `Canvas node count: ${context.canvasNodeCount}`,
    `Selected nodes: ${selected}`,
    context.stackProfile ? `Stack profile: ${JSON.stringify(context.stackProfile)}` : '',
    context.groupingGuideHints?.length
      ? `Grouping hints: ${context.groupingGuideHints.join(' | ')}`
      : '',
  ]
    .filter(Boolean)
    .join('\n');
}
