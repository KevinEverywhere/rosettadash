import type { ExportIR } from '@dashbuilder/core';
import { buildDashboardContext } from './binding-resolver';
import { generateComponentFile } from './component-templates';
import type { AngularExportOptions, GeneratedFile } from './types';
import { AngularExportError } from './types';
import { componentExportName, joinLines, pascalFromId, serviceClassName } from './utils';

export function generateAngularUiFiles(
  ir: ExportIR,
  options: AngularExportOptions = {},
): GeneratedFile[] {
  if (ir.targets.ui !== 'angular') {
    throw new AngularExportError(`Angular exporter cannot generate UI target "${ir.targets.ui}"`);
  }

  const root = options.rootDir ?? 'src';
  const usedNames = new Set<string>();
  const exportNames = new Map<string, string>();

  for (const component of ir.components) {
    exportNames.set(component.id, componentExportName(component, usedNames));
  }

  for (const source of ir.dataSources) {
    exportNames.set(source.id, pascalFromId(source.id));
  }

  const files: GeneratedFile[] = [];

  for (const component of ir.components) {
    const exportName = exportNames.get(component.id);
    if (!exportName) {
      continue;
    }

    files.push({
      path: `${root}/components/${exportName}.ts`,
      content: generateComponentFile(component, exportName),
      encoding: 'utf-8',
      description: `Angular component for ${component.label}`,
    });
  }

  files.push({
    path: `${root}/types.ts`,
    content: generateTypesFile(),
    encoding: 'utf-8',
    description: 'Shared dashboard types',
  });

  files.push({
    path: `${root}/styles/tokens.scss`,
    content: generateTokensScss(ir),
    encoding: 'utf-8',
    description: 'Neutral style tokens for exported dashboard',
  });

  for (const source of ir.dataSources.filter((entry) => entry.type === 'infra.postgresql')) {
    const serviceName = serviceClassName(source.id, exportNames);
    const route = ir.routes.find((entry) => entry.method === 'GET')?.path ?? '/api/records';
    files.push({
      path: `${root}/services/${serviceName}.ts`,
      content: generateDataService(serviceName, route),
      encoding: 'utf-8',
      description: `Data service for ${source.label}`,
    });
  }

  files.push({
    path: `${root}/dashboard.component.ts`,
    content: generateDashboardFile(ir, exportNames),
    encoding: 'utf-8',
    description: 'Composed dashboard wired from ExportIR bindings',
  });

  files.push({
    path: 'README.export.md',
    content: generateReadme(ir),
    encoding: 'utf-8',
    description: 'Setup notes for exported Angular UI fragment',
  });

  return files;
}

function generateTypesFile(): string {
  return joinLines([
    `export interface DateRange {`,
    `  start: string;`,
    `  end: string;`,
    `}`,
    ``,
    `export type Row = Record<string, string | number | boolean | null | undefined>;`,
    ``,
  ]);
}

function generateTokensScss(ir: ExportIR): string {
  return joinLines([
    `:root {`,
    `  --db-surface: #ffffff;`,
    `  --db-border: #d9dee7;`,
    `  --db-text: #1f2937;`,
    `  --db-accent: #2563eb;`,
    `  --db-muted: #6b7280;`,
    `}`,
    ``,
    `.dashboard {`,
    `  display: grid;`,
    `  gap: 1rem;`,
    `  padding: 1.5rem;`,
    `  color: var(--db-text);`,
    `  background: var(--db-surface);`,
    `}`,
    ``,
    `.field, .input, .select, .table, .kpi-card, .chart-card {`,
    `  border: 1px solid var(--db-border);`,
    `  border-radius: 0.5rem;`,
    `}`,
    ``,
    `.table { width: 100%; border-collapse: collapse; }`,
    `.table th, .table td { padding: 0.5rem 0.75rem; text-align: left; }`,
    `.kpi-card, .chart-card, .table-card { padding: 1rem; }`,
    `.bar-chart { display: flex; align-items: flex-end; gap: 0.25rem; height: 8rem; }`,
    `.bar { flex: 1; background: var(--db-accent); min-height: 0.25rem; }`,
    `.pie-chart { width: 8rem; height: 8rem; margin: 0 auto; border-radius: 999px; border: 1px solid var(--db-border); }`,
    `.pie-chart--donut { mask: radial-gradient(circle, transparent 42%, #000 43%); }`,
    `.pie-chart__legend { list-style: none; margin: 0.75rem 0 0; padding: 0; display: flex; flex-wrap: wrap; gap: 0.5rem; font-size: 0.75rem; }`,
    `.pie-chart__legend li { display: inline-flex; align-items: center; gap: 0.25rem; }`,
    `.pie-chart__legend span { width: 0.625rem; height: 0.625rem; border-radius: 999px; }`,
    `.table-row { cursor: pointer; }`,
    `.table-row--selected { background: color-mix(in srgb, var(--db-accent) 12%, transparent); }`,
    `.detail-panel, .detail-panel__fields { margin: 0; }`,
    `.detail-panel { padding: 1rem; }`,
    `.detail-panel__fields { display: grid; gap: 0.5rem; }`,
    `.detail-panel__field { display: grid; grid-template-columns: minmax(5rem, 30%) 1fr; gap: 0.5rem; font-size: 0.875rem; }`,
    `.detail-panel__field dt { font-weight: 600; color: var(--db-muted); text-transform: capitalize; }`,
    `.detail-panel__empty { margin: 0; color: var(--db-muted); font-size: 0.875rem; }`,
    `.time-preset { display: flex; flex-direction: column; gap: 0.5rem; }`,
    `.time-preset__buttons { display: flex; flex-wrap: wrap; gap: 0.375rem; }`,
    `.time-preset__button { padding: 0.375rem 0.625rem; border: 1px solid var(--db-border); border-radius: 999px; background: #fff; font: inherit; font-size: 0.75rem; cursor: pointer; }`,
    `.time-preset__button--active { border-color: var(--db-accent); background: color-mix(in srgb, var(--db-accent) 12%, transparent); color: var(--db-accent); font-weight: 600; }`,
    `/* preset: ${ir.styles.preset} · generated for ${ir.meta.compositeName} */`,
    ``,
  ]);
}

function generateDataService(serviceName: string, route: string): string {
  return joinLines([
    `import { Injectable, signal } from '@angular/core';`,
    `import type { Row } from '../types';`,
    ``,
    `@Injectable({ providedIn: 'root' })`,
    `export class ${serviceName} {`,
    `  readonly data = signal<Row[] | undefined>(undefined);`,
    `  readonly loading = signal(true);`,
    `  readonly error = signal<Error | undefined>(undefined);`,
    ``,
    `  constructor() {`,
    `    void this.load();`,
    `  }`,
    ``,
    `  private async load(): Promise<void> {`,
    `    try {`,
    `      const response = await fetch('${route}');`,
    `      if (!response.ok) {`,
    `        throw new Error(\`Request failed: \${response.status}\`);`,
    `      }`,
    `      const rows = (await response.json()) as Row[];`,
    `      this.data.set(rows);`,
    `    } catch (nextError) {`,
    `      this.error.set(nextError as Error);`,
    `    } finally {`,
    `      this.loading.set(false);`,
    `    }`,
    `  }`,
    `}`,
    ``,
  ]);
}

function generateDashboardFile(ir: ExportIR, exportNames: Map<string, string>): string {
  const context = buildDashboardContext(ir, exportNames);
  const componentImportLines = context.componentImports.map(
    (name) => `import { ${name} } from './components/${name}';`,
  );
  const serviceImportLines = context.serviceImports.map(
    (name) => `import { ${name} } from './services/${name}';`,
  );

  const templateLines = context.components.map((component) => {
    const attrs = component.bindings.map((binding) => `        ${binding}`).join('\n');
    return [`      <${component.selector}`, attrs, `      />`].join('\n');
  });

  return joinLines([
    `import { Component, inject, signal } from '@angular/core';`,
    `import type { DateRange, Row } from './types';`,
    ...componentImportLines,
    ...serviceImportLines,
    ``,
    `@Component({`,
    `  selector: 'app-dashboard',`,
    `  standalone: true,`,
    `  imports: [${context.componentImports.join(', ')}],`,
    `  template: \``,
    `    <main class="dashboard">`,
    `      <header>`,
    `        <h1>${ir.meta.compositeName}</h1>`,
    `      </header>`,
    ...templateLines,
    `    </main>`,
    `  \`,`,
    `  styleUrls: ['./styles/tokens.scss'],`,
    `})`,
    `export class DashboardComponent {`,
    ...context.serviceFields,
    ...context.stateDeclarations,
    `}`,
    ``,
  ]);
}

function generateReadme(ir: ExportIR): string {
  const envLines =
    ir.envVars.length === 0
      ? ['No environment variables required for the UI fragment.']
      : ir.envVars.map((env) => `- \`${env.key}\`${env.required ? ' (required)' : ''}`);

  return joinLines([
    `# ${ir.meta.compositeName} — Angular UI Export`,
    ``,
    `Generated at ${ir.meta.generatedAt} from composite \`${ir.meta.compositeId}\` v${ir.meta.version}.`,
    ``,
    `## Files`,
    ``,
    `- \`src/dashboard.component.ts\` — composed page wired from builder bindings`,
    `- \`src/components/*.ts\` — standalone P0 visual components`,
    `- \`src/services/*.ts\` — data services targeting exported API routes`,
    `- \`src/styles/tokens.scss\` — neutral dashboard styling`,
    ``,
    `## Environment`,
    ``,
    ...envLines,
    ``,
    `## Next steps`,
    ``,
    `1. Copy the generated \`src/\` folder into your Angular app.`,
    `2. Register \`DashboardComponent\` on a route.`,
    `3. Ensure server routes referenced by data services are available.`,
    ``,
  ]);
}
