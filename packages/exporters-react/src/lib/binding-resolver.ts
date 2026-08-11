import type { ExportIR, IRComponent, IREventBinding } from '@rosettadash/core';
import { pascalFromId, setterName, stateVarName } from './utils';

export interface ComponentBindingContext {
  exportName: string;
  nodeId: string;
  props: Record<string, string>;
}

export interface DashboardContext {
  components: ComponentBindingContext[];
  hookImports: string[];
  hookCalls: string[];
  stateDeclarations: string[];
}

export function buildDashboardContext(
  ir: ExportIR,
  exportNames: Map<string, string>,
): DashboardContext {
  const dataSourceIds = new Set(ir.dataSources.map((source) => source.id));
  const stateBySource = new Map<string, { varName: string; setter: string; dataType: string }>();
  const propExpressions = new Map<string, Record<string, string>>();

  for (const event of ir.events) {
    const targetKey = `${event.targetNodeId}:${event.targetPortId}`;
    const targetProps = propExpressions.get(targetKey) ?? {};
    targetProps[event.targetPortId] = resolveSourceExpression(event, dataSourceIds, stateBySource);
    propExpressions.set(targetKey, targetProps);
  }

  const stateDeclarations = [...stateBySource.values()].map(({ varName, setter, dataType }) => {
    if (dataType === 'date-range') {
      return `  const [${varName}, ${setter}] = useState<DateRange | undefined>();`;
    }
    if (dataType === 'string') {
      return `  const [${varName}, ${setter}] = useState<string>('');`;
    }
    if (dataType === 'number') {
      return `  const [${varName}, ${setter}] = useState<number>(0);`;
    }
    if (dataType === 'boolean') {
      return `  const [${varName}, ${setter}] = useState<boolean>(false);`;
    }
    if (dataType === 'row') {
      return `  const [${varName}, ${setter}] = useState<Record<string, unknown> | undefined>();`;
    }
    return `  const [${varName}, ${setter}] = useState<unknown>();`;
  });

  const hookImports: string[] = [];
  const hookCalls: string[] = [];

  for (const source of ir.dataSources.filter((entry) => entry.type === 'infra.postgresql')) {
    const hookName = `use${exportNames.get(source.id) ?? pascalFromId(source.id)}Data`;
    hookImports.push(hookName);
    const varName = `${source.id}_rowset`;
    hookCalls.push(
      `  const { data: ${varName}, loading: ${varName}Loading, error: ${varName}Error } = ${hookName}();`,
    );
  }

  const components = ir.components.map((component) => {
    const exportName = exportNames.get(component.id) ?? component.id;
    const props: Record<string, string> = {
      id: `'${component.id}'`,
    };

    for (const [key, value] of Object.entries(component.properties)) {
      const propKey =
        component.type === 'domain.role-gate' && key === 'roles' ? 'allowedRoles' : key;
      if (Array.isArray(value)) {
        props[propKey] = JSON.stringify(value);
      } else if (typeof value === 'string') {
        props[propKey] = `'${value.replace(/'/g, "\\'")}'`;
      } else if (typeof value === 'number' || typeof value === 'boolean') {
        props[propKey] = String(value);
      }
    }

    for (const input of component.inputs) {
      const bindingKey = `${component.id}:${input.id}`;
      const bound = propExpressions.get(bindingKey)?.[input.id];
      props[input.name] = bound ?? (input.dataType === 'rowset' ? '[]' : 'undefined');
    }

    wireComponentOutputs(component, props, stateBySource);

    return {
      exportName,
      nodeId: component.id,
      props,
    };
  });

  return {
    components,
    hookImports,
    hookCalls,
    stateDeclarations,
  };
}

function wireComponentOutputs(
  component: IRComponent,
  props: Record<string, string>,
  stateBySource: Map<string, { varName: string; setter: string; dataType: string }>,
): void {
  for (const output of component.outputs) {
    const sourceKey = `${component.id}:${output.id}`;
    const state = stateBySource.get(sourceKey);
    if (!state) {
      continue;
    }

    if (
      output.dataType === 'date-range' ||
      output.dataType === 'string' ||
      output.dataType === 'number' ||
      output.dataType === 'boolean'
    ) {
      props['value'] = state.varName;
      props['onChange'] = state.setter;
    }

    if (output.dataType === 'row') {
      props['selectedRow'] = state.varName;
      props['onSelectRow'] = state.setter;
    }
  }
}

function resolveSourceExpression(
  event: IREventBinding,
  dataSourceIds: Set<string>,
  stateBySource: Map<string, { varName: string; setter: string; dataType: string }>,
): string {
  const sourceKey = `${event.sourceNodeId}:${event.sourcePortId}`;

  if (dataSourceIds.has(event.sourceNodeId) && event.sourcePortId === 'rowset') {
    return `${event.sourceNodeId}_rowset ?? []`;
  }

  if (!stateBySource.has(sourceKey)) {
    const varName = stateVarName(event.sourceNodeId, event.sourcePortId);
    stateBySource.set(sourceKey, {
      varName,
      setter: setterName(varName),
      dataType: event.dataType,
    });
  }

  return stateBySource.get(sourceKey)?.varName ?? 'undefined';
}
