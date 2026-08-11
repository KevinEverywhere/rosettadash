import type { ExportIR, IRComponent, IREventBinding } from '@rosettadash/core';
import { composableName, stateVarName } from './utils';

export interface ComponentBindingContext {
  exportName: string;
  nodeId: string;
  bindings: string[];
}

export interface DashboardContext {
  components: ComponentBindingContext[];
  composableImports: string[];
  composableCalls: string[];
  componentImports: string[];
  stateDeclarations: string[];
}

export function buildDashboardContext(
  ir: ExportIR,
  exportNames: Map<string, string>,
): DashboardContext {
  const dataSourceIds = new Set(ir.dataSources.map((source) => source.id));
  const stateBySource = new Map<string, { varName: string; dataType: string }>();
  const propExpressions = new Map<string, Record<string, string>>();

  for (const event of ir.events) {
    const targetKey = `${event.targetNodeId}:${event.targetPortId}`;
    const targetProps = propExpressions.get(targetKey) ?? {};
    targetProps[event.targetPortId] = resolveSourceExpression(event, dataSourceIds, stateBySource);
    propExpressions.set(targetKey, targetProps);
  }

  const stateDeclarations = [...stateBySource.values()].map(({ varName, dataType }) => {
    if (dataType === 'date-range') {
      return `const ${varName} = ref<DateRange | undefined>();`;
    }
    if (dataType === 'string') {
      return `const ${varName} = ref('');`;
    }
    if (dataType === 'row') {
      return `const ${varName} = ref<Row | undefined>();`;
    }
    return `const ${varName} = ref<unknown>();`;
  });

  const composableImports: string[] = [];
  const composableCalls: string[] = [];

  for (const source of ir.dataSources.filter((entry) => entry.type === 'infra.postgresql')) {
    const name = composableName(source.id, exportNames);
    composableImports.push(name);
    composableCalls.push(`const ${source.id}Data = ${name}();`);
  }

  const components = ir.components.map((component) => {
    const exportName = exportNames.get(component.id) ?? component.id;
    const bindings: string[] = [`id="${component.id}"`];

    for (const [key, value] of Object.entries(component.properties)) {
      if (typeof value === 'string') {
        bindings.push(`${key}="${value.replace(/"/g, '&quot;')}"`);
      } else if (typeof value === 'number' || typeof value === 'boolean') {
        bindings.push(`:${key}="${String(value)}"`);
      }
    }

    for (const input of component.inputs) {
      const bindingKey = `${component.id}:${input.id}`;
      const bound = propExpressions.get(bindingKey)?.[input.id];

      if (bound?.endsWith('_rowset')) {
        const sourceId = bound.replace('_rowset', '');
        bindings.push(`:data="${sourceId}Data.data ?? []"`);
        continue;
      }

      if (bound) {
        bindings.push(`:${input.name}="${bound}"`);
        continue;
      }

      bindings.push(`:${input.name}="${input.dataType === 'rowset' ? '[]' : 'undefined'}"`);
    }

    wireComponentOutputs(component, bindings, stateBySource);

    return {
      exportName,
      nodeId: component.id,
      bindings,
    };
  });

  return {
    components,
    composableImports,
    composableCalls,
    componentImports: components.map((component) => component.exportName),
    stateDeclarations,
  };
}

function wireComponentOutputs(
  component: IRComponent,
  bindings: string[],
  stateBySource: Map<string, { varName: string; dataType: string }>,
): void {
  for (const output of component.outputs) {
    const sourceKey = `${component.id}:${output.id}`;
    const state = stateBySource.get(sourceKey);
    if (!state) {
      continue;
    }

    if (output.dataType === 'date-range' || output.dataType === 'string') {
      bindings.push(`v-model="${state.varName}"`);
    }

    if (output.dataType === 'row') {
      bindings.push(`:selected-row="${state.varName}"`);
      bindings.push(`@select-row="${state.varName} = $event"`);
    }
  }
}

function resolveSourceExpression(
  event: IREventBinding,
  dataSourceIds: Set<string>,
  stateBySource: Map<string, { varName: string; dataType: string }>,
): string {
  const sourceKey = `${event.sourceNodeId}:${event.sourcePortId}`;

  if (dataSourceIds.has(event.sourceNodeId) && event.sourcePortId === 'rowset') {
    return `${event.sourceNodeId}_rowset`;
  }

  if (!stateBySource.has(sourceKey)) {
    const varName = stateVarName(event.sourceNodeId, event.sourcePortId);
    stateBySource.set(sourceKey, {
      varName,
      dataType: event.dataType,
    });
  }

  return stateBySource.get(sourceKey)?.varName ?? 'undefined';
}
