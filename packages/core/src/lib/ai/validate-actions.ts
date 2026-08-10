import type { ComponentRegistry } from '../registry/component-registry';
import { areDataTypesCompatible } from '../model/data-types';
import { listCompositeTemplates } from '../templates/composite-template-registry';
import type { AiBuilderAction, AiActionValidationResult, AiNodeSummary } from './types';

function resolveNodeId(
  action: { nodeId?: string; nodeRef?: string } | { sourceNodeId?: string; sourceRef?: string },
  side: 'node' | 'source' | 'target',
  nodeIds: Set<string>,
  pendingRefs: Set<string>,
): string | null {
  if (side === 'node') {
    const typed = action as { nodeId?: string; nodeRef?: string };
    if (typed.nodeId) {
      return typed.nodeId;
    }
    if (typed.nodeRef) {
      return pendingRefs.has(typed.nodeRef) || nodeIds.has(typed.nodeRef) ? typed.nodeRef : null;
    }
    return null;
  }

  const bind = action as {
    sourceNodeId?: string;
    sourceRef?: string;
    targetNodeId?: string;
    targetRef?: string;
  };

  if (side === 'source') {
    if (bind.sourceNodeId) {
      return bind.sourceNodeId;
    }
    if (bind.sourceRef) {
      return pendingRefs.has(bind.sourceRef) || nodeIds.has(bind.sourceRef) ? bind.sourceRef : null;
    }
    return null;
  }

  if (bind.targetNodeId) {
    return bind.targetNodeId;
  }
  if (bind.targetRef) {
    return pendingRefs.has(bind.targetRef) || nodeIds.has(bind.targetRef) ? bind.targetRef : null;
  }
  return null;
}

export function validateAiBuilderActions(
  actions: AiBuilderAction[],
  registry: ComponentRegistry,
  nodes: AiNodeSummary[],
): AiActionValidationResult {
  const issues: AiActionValidationResult['issues'] = [];
  const applicableActions: AiBuilderAction[] = [];
  const explainActions: Array<{ op: 'explain'; markdown: string }> = [];
  const nodeIds = new Set(nodes.map((node) => node.id));
  const pendingRefs = new Set<string>();
  const templateIds = new Set(listCompositeTemplates().map((template) => template.id));

  actions.forEach((action, index) => {
    if (action.op === 'explain') {
      if (typeof action.markdown === 'string' && action.markdown.trim()) {
        explainActions.push(action);
      } else {
        issues.push({ index, message: 'Explain actions require markdown text.' });
      }
      return;
    }

    if (action.op === 'add_node') {
      if (!action.type?.trim()) {
        issues.push({ index, message: 'add_node requires a component type.' });
        return;
      }
      if (!registry.get(action.type)) {
        issues.push({ index, message: `Unknown component type: ${action.type}` });
        return;
      }
      if (action.ref) {
        if (pendingRefs.has(action.ref) || nodeIds.has(action.ref)) {
          issues.push({ index, message: `Duplicate node ref: ${action.ref}` });
          return;
        }
        pendingRefs.add(action.ref);
      }
      applicableActions.push(action);
      return;
    }

    if (action.op === 'apply_template') {
      if (!templateIds.has(action.templateId)) {
        issues.push({ index, message: `Unknown template id: ${action.templateId}` });
        return;
      }
      applicableActions.push(action);
      return;
    }

    if (action.op === 'set_property') {
      const target = resolveNodeId(action, 'node', nodeIds, pendingRefs);
      if (!target) {
        issues.push({ index, message: 'set_property requires nodeId or nodeRef.' });
        return;
      }
      if (!action.key?.trim()) {
        issues.push({ index, message: 'set_property requires a property key.' });
        return;
      }
      applicableActions.push(action);
      return;
    }

    if (action.op === 'bind') {
      const source = resolveNodeId(action, 'source', nodeIds, pendingRefs);
      const target = resolveNodeId(action, 'target', nodeIds, pendingRefs);
      if (!source || !target) {
        issues.push({ index, message: 'bind requires source and target node identifiers.' });
        return;
      }
      if (!action.sourcePort?.trim() || !action.targetPort?.trim()) {
        issues.push({ index, message: 'bind requires sourcePort and targetPort.' });
        return;
      }

      const sourceNode = nodes.find((node) => node.id === source);
      const targetNode = nodes.find((node) => node.id === target);
      if (sourceNode && !sourceNode.outputs.includes(action.sourcePort)) {
        issues.push({ index, message: `Unknown output port ${action.sourcePort} on ${source}.` });
        return;
      }
      if (targetNode && !targetNode.inputs.includes(action.targetPort)) {
        issues.push({ index, message: `Unknown input port ${action.targetPort} on ${target}.` });
        return;
      }

      if (sourceNode && targetNode) {
        const sourceDef = registry.get(sourceNode.type);
        const targetDef = registry.get(targetNode.type);
        const sourcePort = sourceDef?.outputs.find((port) => port.id === action.sourcePort);
        const targetPort = targetDef?.inputs.find((port) => port.id === action.targetPort);
        if (sourcePort && targetPort && !areDataTypesCompatible(sourcePort.dataType, targetPort.dataType)) {
          issues.push({
            index,
            message: `Incompatible bind: ${sourcePort.dataType} → ${targetPort.dataType}`,
          });
          return;
        }
      }

      applicableActions.push(action);
    }
  });

  return {
    valid: issues.length === 0,
    issues,
    applicableActions,
    explainActions,
  };
}
