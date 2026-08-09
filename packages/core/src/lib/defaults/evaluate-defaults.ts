import type { ComponentRegistry } from '../registry/component-registry';
import { defaultComponentRegistry } from '../registry/component-registry';
import { getGroupingGuide, listMissingCompanionTypes } from '../grouping';
import type {
  DefaultSuggestion,
  DefaultsContext,
  DefaultsTrigger,
  EvaluateDefaultsOptions,
} from './types';

const DATE_RANGE_INPUTS = new Set(['filter', 'range']);
const ROWSET_DATA_INPUTS = new Set(['data']);

export function evaluateDefaults(
  context: DefaultsContext,
  trigger: DefaultsTrigger,
  registry: ComponentRegistry = defaultComponentRegistry,
  options: EvaluateDefaultsOptions = {},
): DefaultSuggestion[] {
  const dismissed = options.dismissedIds ?? new Set<string>();
  const suggestions: DefaultSuggestion[] = [];

  if (trigger.type === 'nodeAdded') {
    suggestions.push(...suggestionsForNodeAdded(context, trigger.nodeId, registry));
  }

  if (trigger.type === 'bindingCreated') {
    suggestions.push(
      ...suggestionsForBindingCreated(context, trigger.bindingId, registry),
    );
  }

  return suggestions.filter((suggestion) => !dismissed.has(suggestion.id));
}

export function suggestionsForSelectedNode(
  context: DefaultsContext,
  nodeId: string,
  registry: ComponentRegistry = defaultComponentRegistry,
  options: EvaluateDefaultsOptions = {},
): DefaultSuggestion[] {
  const dismissed = options.dismissedIds ?? new Set<string>();
  const node = context.nodes.find((entry) => entry.id === nodeId);
  if (!node) {
    return [];
  }

  const suggestions: DefaultSuggestion[] = [
    ...suggestionsForUnboundRequiredInputs(context, node, registry),
    ...suggestionsForMissingDateRangeFilter(context, node, registry),
  ];

  return suggestions.filter((suggestion) => !dismissed.has(suggestion.id));
}

function suggestionsForNodeAdded(
  context: DefaultsContext,
  nodeId: string,
  registry: ComponentRegistry,
): DefaultSuggestion[] {
  const node = context.nodes.find((entry) => entry.id === nodeId);
  if (!node) {
    return [];
  }

  const suggestions: DefaultSuggestion[] = [];

  if (node.type === 'visual.table') {
    const pageSize = node.properties['pageSize'];
    if (typeof pageSize !== 'number' || pageSize <= 0) {
      suggestions.push({
        id: `table-page-size:${node.id}`,
        nodeId: node.id,
        kind: 'patch',
        title: 'Pagination',
        message: 'Set table page size to 25 rows for a balanced default.',
        patches: [{ key: 'pageSize', value: 25 }],
      });
    }

    suggestions.push(...suggestionsForUnboundRequiredInputs(context, node, registry));
  }

  if (node.type === 'infra.postgresql') {
    const table = node.properties['table'];
    if (typeof table !== 'string' || table.trim() === '') {
      suggestions.push({
        id: `postgres-table:${node.id}`,
        nodeId: node.id,
        kind: 'patch',
        title: 'PostgreSQL table',
        message: 'Name the PostgreSQL table so export routes can target it.',
        patches: [{ key: 'table', value: 'records' }],
      });
    }
  }

  if (node.type === 'infra.mongodb') {
    const collection = node.properties['collection'];
    if (typeof collection !== 'string' || collection.trim() === '') {
      suggestions.push({
        id: `mongo-collection:${node.id}`,
        nodeId: node.id,
        kind: 'patch',
        title: 'MongoDB collection',
        message: 'Name the MongoDB collection for exported query modules.',
        patches: [{ key: 'collection', value: 'records' }],
      });
    }
  }

  if (node.type === 'visual.chart.bar' && hasDateRangeSource(context)) {
    suggestions.push({
      id: `chart-type-line:${node.id}`,
      nodeId: node.id,
      kind: 'hint',
      title: 'Chart type',
      message:
        'This dashboard includes a date range filter. A Line Chart is usually better for time-series trends.',
    });
  }

  suggestions.push(...companionHintsForNode(context, node, registry));

  return suggestions;
}

function companionHintsForNode(
  context: DefaultsContext,
  node: DefaultsContext['nodes'][number],
  registry: ComponentRegistry,
): DefaultSuggestion[] {
  const guide = getGroupingGuide(node.type);
  if (!guide) {
    return [];
  }

  const canvasTypes = context.nodes.map((entry) => entry.type);
  const missing = listMissingCompanionTypes(node.type, canvasTypes).slice(0, 2);

  return missing.map((companionType) => {
    const companion = registry.get(companionType);
    return {
      id: `companion:${node.id}:${companionType}`,
      nodeId: node.id,
      kind: 'hint',
      title: 'Typical grouping',
      message: `Consider adding ${companion?.label ?? companionType}. ${guide.placementMessage}`,
    };
  });
}

function suggestionsForBindingCreated(
  context: DefaultsContext,
  bindingId: string,
  registry: ComponentRegistry,
): DefaultSuggestion[] {
  const binding = context.bindings.find((entry) => entry.id === bindingId);
  if (!binding) {
    return [];
  }

  const targetNode = context.nodes.find((node) => node.id === binding.targetNodeId);
  if (!targetNode) {
    return [];
  }

  if (!ROWSET_DATA_INPUTS.has(binding.targetPortId)) {
    return [];
  }

  return suggestionsForMissingDateRangeFilter(context, targetNode, registry);
}

function suggestionsForUnboundRequiredInputs(
  context: DefaultsContext,
  node: DefaultsContext['nodes'][number],
  registry: ComponentRegistry,
): DefaultSuggestion[] {
  const definition = registry.get(node.type);
  if (!definition) {
    return [];
  }

  const suggestions: DefaultSuggestion[] = [];

  for (const input of definition.inputs) {
    if (!input.required) {
      continue;
    }

    const bound = context.bindings.some(
      (binding) =>
        binding.targetNodeId === node.id && binding.targetPortId === input.id,
    );

    if (!bound) {
      suggestions.push({
        id: `bind-required:${node.id}:${input.id}`,
        nodeId: node.id,
        kind: 'hint',
        title: 'Required binding',
        message: `Connect a ${input.dataType} source to the ${input.name} input.`,
      });
    }
  }

  return suggestions;
}

function suggestionsForMissingDateRangeFilter(
  context: DefaultsContext,
  node: DefaultsContext['nodes'][number],
  registry: ComponentRegistry,
): DefaultSuggestion[] {
  const definition = registry.get(node.type);
  if (!definition) {
    return [];
  }

  const dateInput = definition.inputs.find((input) => DATE_RANGE_INPUTS.has(input.id));
  if (!dateInput) {
    return [];
  }

  const hasDataBinding = context.bindings.some(
    (binding) =>
      binding.targetNodeId === node.id && ROWSET_DATA_INPUTS.has(binding.targetPortId),
  );
  if (!hasDataBinding) {
    return [];
  }

  const hasDateBinding = context.bindings.some(
    (binding) =>
      binding.targetNodeId === node.id && binding.targetPortId === dateInput.id,
  );
  if (hasDateBinding) {
    return [];
  }

  const hasDateRangeNode = context.nodes.some((entry) => entry.type === 'visual.input.date-range');
  if (!hasDateRangeNode) {
    return [
      {
        id: `add-date-range:${node.id}`,
        nodeId: node.id,
        kind: 'hint',
        title: 'Date filter',
        message: 'Add a Date Range component and bind it to filter time-scoped table or chart data.',
      },
    ];
  }

  return [
    {
      id: `bind-date-range:${node.id}:${dateInput.id}`,
      nodeId: node.id,
      kind: 'hint',
      title: 'Date filter',
      message: `Bind the Date Range output to the ${dateInput.name} input for time-scoped queries.`,
    },
  ];
}

function hasDateRangeSource(context: DefaultsContext): boolean {
  return context.nodes.some((node) => node.type === 'visual.input.date-range');
}
