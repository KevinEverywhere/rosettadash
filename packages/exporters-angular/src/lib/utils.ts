import type { IRComponent } from '@dashbuilder/core';

const DEFAULT_NAMES: Record<string, string> = {
  'visual.input.text': 'TextInput',
  'visual.input.select': 'SelectInput',
  'visual.input.date-range': 'DateRangeFilter',
  'domain.time-preset': 'TimePreset',
  'visual.table': 'DataTable',
  'visual.detail': 'DetailPanel',
  'visual.skeleton': 'LoadingSkeleton',
  'visual.kpi': 'KpiCard',
  'visual.chart.line': 'LineChart',
  'visual.chart.bar': 'BarChart',
  'visual.chart.pie': 'PieChart',
  'visual.display.3d-bar-chart': 'ThreeBarChart',
  'visual.display.3d-scatter': 'ThreeScatterPlot',
  'visual.display.3d-scene': 'ThreeScenePointCloud',
  'logic.timer': 'Timer',
};

export function pascalCase(value: string): string {
  return value
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('');
}

export function componentExportName(component: IRComponent, usedNames: Set<string>): string {
  const fromLabel = pascalCase(component.label);
  const base = fromLabel || DEFAULT_NAMES[component.type] || pascalCase(component.id);
  let candidate = `${base}Component`;
  let suffix = 2;

  while (usedNames.has(candidate)) {
    candidate = `${base}${suffix}Component`;
    suffix += 1;
  }

  usedNames.add(candidate);
  return candidate;
}

export function serviceClassName(sourceId: string, exportNames: Map<string, string>): string {
  const base = exportNames.get(sourceId) ?? pascalFromId(sourceId);
  return `${base}DataService`;
}

export function selectorFromClass(className: string): string {
  return `app-${className.replace(/Component$/, '').replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`;
}

export function stateVarName(nodeId: string, portId: string): string {
  return `${nodeId}_${portId}`.replace(/[^a-zA-Z0-9_]/g, '_');
}

export function joinLines(lines: string[]): string {
  return `${lines.filter((line) => line !== undefined).join('\n')}\n`;
}

export function pascalFromId(id: string): string {
  return id
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}
