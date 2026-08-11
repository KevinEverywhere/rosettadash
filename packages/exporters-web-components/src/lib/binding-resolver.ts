import type { ExportIR, IRComponent, IREventBinding } from '@rosettadash/core';
import { getRuntimePackageSpec, usesRuntimePackage } from './package-runtime';
import { customElementTag, dataModuleName, stateVarName } from './utils';

export interface ComponentMountContext {
  exportName: string;
  tagName: string;
  nodeId: string;
  createLines: string[];
  mountLines: string[];
}

export interface DashboardContext {
  components: ComponentMountContext[];
  dataModuleImports: string[];
  dataModuleCalls: string[];
  componentImports: string[];
  fieldDeclarations: string[];
  registerImports: string[];
  registerCalls: string[];
}

export function buildDashboardContext(
  ir: ExportIR,
  exportNames: Map<string, string>,
  exportMode: 'standalone' | 'package' = 'standalone',
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

  const fieldDeclarations = [...stateBySource.values()].map(({ varName, dataType }) => {
    if (dataType === 'date-range') {
      return `  private ${varName}: DateRange | undefined;`;
    }
    if (dataType === 'string') {
      return `  private ${varName} = '';`;
    }
    if (dataType === 'row') {
      return `  private ${varName}: Row | undefined;`;
    }
    return `  private ${varName}: unknown;`;
  });

  const dataModuleImports: string[] = [];
  const dataModuleCalls: string[] = [];

  for (const source of ir.dataSources.filter((entry) => entry.type === 'infra.postgresql')) {
    const name = dataModuleName(source.id, exportNames);
    dataModuleImports.push(name);
    dataModuleCalls.push(`    this.${source.id}Data = await ${name}();`);
  }

  const components = ir.components.map((component) => {
    const exportName = exportNames.get(component.id) ?? component.id;
    const runtimeSpec =
      exportMode === 'package' && usesRuntimePackage(component.type, component)
        ? getRuntimePackageSpec(component.type)
        : undefined;
    const tagName = runtimeSpec?.tagName ?? customElementTag(exportName);
    const varName = `this.${component.id}El`;
    const mountLines: string[] = [`    ${varName} = document.createElement('${tagName}');`];

    if (component.id) {
      mountLines.push(`    ${varName}.id = '${component.id}';`);
    }

    for (const [key, value] of Object.entries(component.properties)) {
      if (typeof value === 'string') {
        mountLines.push(`    ${varName}.setProperty('${key}', ${JSON.stringify(value)});`);
      } else if (typeof value === 'number' || typeof value === 'boolean') {
        mountLines.push(`    ${varName}.setProperty('${key}', ${String(value)});`);
      }
    }

    for (const input of component.inputs) {
      const bindingKey = `${component.id}:${input.id}`;
      const bound = propExpressions.get(bindingKey)?.[input.id];

      if (bound?.endsWith('_rowset')) {
        const sourceId = bound.replace('_rowset', '');
        mountLines.push(`    ${varName}.data = this.${sourceId}Data ?? [];`);
        continue;
      }

      if (bound) {
        mountLines.push(`    ${varName}.setProperty('${input.name}', this.${bound});`);
        continue;
      }

      mountLines.push(
        `    ${varName}.setProperty('${input.name}', ${input.dataType === 'rowset' ? '[]' : 'undefined'});`,
      );
    }

    wireComponentOutputs(component, varName, mountLines, stateBySource);
    mountLines.push(`    shell.appendChild(${varName});`);

    return {
      exportName,
      tagName,
      nodeId: component.id,
      createLines: [],
      mountLines,
    };
  });

  const componentImports = components
    .filter((component) => {
      const irComponent = ir.components.find((entry) => entry.id === component.nodeId);
      return !(
        exportMode === 'package' &&
        irComponent &&
        usesRuntimePackage(irComponent.type, irComponent)
      );
    })
    .map((component) => component.exportName);
  const registerImports = [...componentImports, 'RdDashboard'];
  const registerCalls = componentImports.map(
    (name) => `  register${name}();`,
  );

  return {
    components,
    dataModuleImports,
    dataModuleCalls,
    componentImports,
    fieldDeclarations,
    registerImports,
    registerCalls: [...registerCalls, '  registerRdDashboard();'],
  };
}

function wireComponentOutputs(
  component: IRComponent,
  elementVar: string,
  mountLines: string[],
  stateBySource: Map<string, { varName: string; dataType: string }>,
): void {
  for (const output of component.outputs) {
    const sourceKey = `${component.id}:${output.id}`;
    const state = stateBySource.get(sourceKey);
    if (!state) {
      continue;
    }

    if (output.dataType === 'date-range') {
      mountLines.push(
        `    ${elementVar}.addEventListener('range-change', (event) => { this.${state.varName} = (event as CustomEvent<DateRange>).detail; this.syncBindings(); });`,
      );
    }

    if (output.dataType === 'string') {
      mountLines.push(
        `    ${elementVar}.addEventListener('value-change', (event) => { this.${state.varName} = (event as CustomEvent<string>).detail; });`,
      );
    }

    if (output.dataType === 'row') {
      const rowEvent = resolveRowOutputEvent(output.id);
      if (rowEvent) {
        mountLines.push(
          `    ${elementVar}.addEventListener('${rowEvent}', (event) => { this.${state.varName} = (event as CustomEvent<Row>).detail; this.syncBindings(); });`,
        );
      } else {
        mountLines.push(`    ${elementVar}.selectedRow = this.${state.varName};`);
        mountLines.push(
          `    ${elementVar}.addEventListener('row-select', (event) => { this.${state.varName} = (event as CustomEvent<Row | undefined>).detail; this.syncBindings(); });`,
        );
      }
    }

    if (output.dataType === 'any') {
      if (output.id === 'video-file') {
        mountLines.push(
          `    ${elementVar}.addEventListener('video-file', (event) => { this.${state.varName} = (event as CustomEvent<{ file: File | Blob }>).detail.file; this.syncBindings(); });`,
        );
        continue;
      }

      const anyEvent = resolveAnyOutputEvent(output.id);
      if (anyEvent) {
        mountLines.push(
          `    ${elementVar}.addEventListener('${anyEvent}', (event) => { this.${state.varName} = (event as CustomEvent).detail; this.syncBindings(); });`,
        );
      }
    }
  }
}

function resolveRowOutputEvent(portId: string): string | undefined {
  if (portId === 'crop-region') {
    return 'crop-region';
  }
  if (portId === 'metadata') {
    return 'metadata';
  }
  return undefined;
}

function resolveAnyOutputEvent(portId: string): string | undefined {
  if (portId === 'video-file') {
    return 'video-file';
  }
  if (portId === 'capture-blob') {
    return 'capture-blob';
  }
  return undefined;
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
