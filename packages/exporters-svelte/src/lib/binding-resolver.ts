import type { ExportIR, IRComponent, IREventBinding } from '@dashbuilder/core';
import { dataModuleName, stateVarName } from './utils';

export interface ComponentBindingContext {
  exportName: string;
  nodeId: string;
  bindings: string[];
}

export interface DashboardContext {
  components: ComponentBindingContext[];
  dataModuleImports: string[];
  dataModuleCalls: string[];
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
      return `  let ${varName} = $state<DateRange | undefined>();`;
    }
    if (dataType === 'string') {
      return `  let ${varName} = $state('');`;
    }
    if (dataType === 'row') {
      return `  let ${varName} = $state<Row | undefined>();`;
    }
    return `  let ${varName} = $state<unknown>();`;
  });

  const dataModuleImports: string[] = [];
  const dataModuleCalls: string[] = [];

  for (const source of ir.dataSources.filter((entry) => entry.type === 'infra.postgresql')) {
    const name = dataModuleName(source.id, exportNames);
    dataModuleImports.push(name);
    dataModuleCalls.push(`  const ${source.id}Data = ${name}();`);
  }

  const components = ir.components.map((component) => {
    const exportName = exportNames.get(component.id) ?? component.id;
    const bindings: string[] = [`id="${component.id}"`];

    for (const [key, value] of Object.entries(component.properties)) {
      if (typeof value === 'string') {
        bindings.push(`${key}="${value.replace(/"/g, '&quot;')}"`);
      } else if (typeof value === 'number' || typeof value === 'boolean') {
        bindings.push(`${key}={${String(value)}}`);
      }
    }

    for (const input of component.inputs) {
      const bindingKey = `${component.id}:${input.id}`;
      const bound = propExpressions.get(bindingKey)?.[input.id];

      if (bound?.endsWith('_rowset')) {
        const sourceId = bound.replace('_rowset', '');
        bindings.push(`data={${sourceId}Data.data ?? []}`);
        continue;
      }

      if (bound) {
        bindings.push(`${input.name}={${bound}}`);
        continue;
      }

      bindings.push(`${input.name}={${input.dataType === 'rowset' ? '[]' : 'undefined'}}`);
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
    dataModuleImports,
    dataModuleCalls,
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
      bindings.push(`bind:${output.name}={${state.varName}}`);
    }

    if (output.dataType === 'row') {
      bindings.push(`selectedRow={${state.varName}}`);
      bindings.push(`onSelectRow={(next) => { ${state.varName} = next; }}`);
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
