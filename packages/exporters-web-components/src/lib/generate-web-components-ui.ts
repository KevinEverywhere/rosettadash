import type { ExportIR } from '@dashbuilder/core';
import { buildDashboardContext } from './binding-resolver';
import {
  generateComponentFile,
  generateDefineElementHelper,
  generateRegisterAllFile,
} from './component-templates';
import type { GeneratedFile, WebComponentsExportOptions } from './types';
import { WebComponentsExportError } from './types';
import { componentExportName, customElementTag, joinLines, pascalFromId } from './utils';

export function generateWebComponentsUiFiles(
  ir: ExportIR,
  options: WebComponentsExportOptions = {},
): GeneratedFile[] {
  if (ir.targets.ui !== 'web-components') {
    throw new WebComponentsExportError(
      `Web Components exporter cannot generate UI target "${ir.targets.ui}"`,
    );
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
  const componentNames: string[] = [];

  for (const component of ir.components) {
    const exportName = exportNames.get(component.id);
    if (!exportName) {
      continue;
    }
    componentNames.push(exportName);
    files.push({
      path: `${root}/components/${exportName}.ts`,
      content: generateComponentFile(component, exportName),
      encoding: 'utf-8',
      description: `Custom Element for ${component.label}`,
    });
  }

  files.push({
    path: `${root}/define-element.ts`,
    content: generateDefineElementHelper(),
    encoding: 'utf-8',
    description: 'Safe customElements.define helper',
  });

  files.push({
    path: `${root}/types.ts`,
    content: generateTypesFile(),
    encoding: 'utf-8',
    description: 'Shared dashboard types',
  });

  files.push({
    path: `${root}/styles/tokens.css`,
    content: generateTokensCss(ir),
    encoding: 'utf-8',
    description: 'Neutral style tokens for exported dashboard',
  });

  for (const source of ir.dataSources.filter((entry) => entry.type === 'infra.postgresql')) {
    const fnName = `fetch${exportNames.get(source.id) ?? pascalFromId(source.id)}Data`;
    const route = ir.routes.find((entry) => entry.method === 'GET')?.path ?? '/api/records';
    files.push({
      path: `${root}/lib/data/${fnName}.ts`,
      content: generateDataModule(fnName, route),
      encoding: 'utf-8',
      description: `Data fetcher for ${source.label}`,
    });
  }

  files.push({
    path: `${root}/dashboard.ts`,
    content: generateDashboardFile(ir, exportNames),
    encoding: 'utf-8',
    description: 'Composed dashboard Custom Element wired from ExportIR bindings',
  });

  files.push({
    path: `${root}/register.ts`,
    content: generateRegisterAllFile(componentNames),
    encoding: 'utf-8',
    description: 'Registers all generated Custom Elements',
  });

  files.push({
    path: 'README.export.md',
    content: generateReadme(ir),
    encoding: 'utf-8',
    description: 'Setup notes for exported Web Components bundle',
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

function generateTokensCss(ir: ExportIR): string {
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
    `  font-family: system-ui, sans-serif;`,
    `}`,
    ``,
    `/* styling: ${ir.styles.framework} · generated for ${ir.meta.compositeName} */`,
    ``,
  ]);
}

function generateDataModule(fnName: string, route: string): string {
  return joinLines([
    `import type { Row } from '../../types';`,
    ``,
    `export async function ${fnName}(): Promise<Row[]> {`,
    `  const response = await fetch('${route}');`,
    `  if (!response.ok) {`,
    `    throw new Error(\`Request failed: \${response.status}\`);`,
    `  }`,
    `  return (await response.json()) as Row[];`,
    `}`,
    ``,
  ]);
}

function generateDashboardFile(ir: ExportIR, exportNames: Map<string, string>): string {
  const context = buildDashboardContext(ir, exportNames);
  const componentImportLines = context.componentImports.map(
    (name) => `import { ${name} } from './components/${name}';`,
  );
  const dataImportLines = context.dataModuleImports.map(
    (name) => `import { ${name} } from './lib/data/${name}';`,
  );
  const dataSourceFields = ir.dataSources
    .filter((entry) => entry.type === 'infra.postgresql')
    .map((source) => `  private ${source.id}Data: Row[] = [];`);
  const fieldRefs = context.components.map(
    (component) => `  private ${component.nodeId}El!: ${component.exportName};`,
  );
  const mountLines = context.components.flatMap((component) => component.mountLines);
  const syncLines = context.components.flatMap((component) =>
    component.mountLines
      .filter(
        (line) =>
          line.includes('setProperty') ||
          line.includes('.data =') ||
          line.includes('selectedRow'),
      )
      .map((line) => line.replace(/shell\.appendChild\(this\.[^)]+\);?\s*$/, '').trim())
      .filter(Boolean),
  );

  return joinLines([
    `import type { DateRange, Row } from './types';`,
    `import { defineDashElement } from './define-element';`,
    ...componentImportLines,
    ...dataImportLines,
    ``,
    `export class DbDashboard extends HTMLElement {`,
    `  static readonly tagName = '${customElementTag('Dashboard')}';`,
    ...context.fieldDeclarations,
    ...fieldRefs,
    ...dataSourceFields,
    ``,
    `  connectedCallback(): void {`,
    `    void this.mount();`,
    `  }`,
    ``,
    `  private async mount(): Promise<void> {`,
    `    if (this.shadowRoot) {`,
    `      return;`,
    `    }`,
    `    const root = this.attachShadow({ mode: 'open' });`,
    `    root.innerHTML = \`<link rel="stylesheet" href="./styles/tokens.css" /><main class="dashboard"><header><h1>${ir.meta.compositeName}</h1></header><section class="dashboard__content"></section></main>\`;`,
    `    const shell = root.querySelector('.dashboard__content') as HTMLElement;`,
    ...context.dataModuleCalls,
    ...mountLines,
    `  }`,
    ``,
    `  private syncBindings(): void {`,
    ...syncLines,
    `  }`,
    `}`,
    ``,
    `export function registerDbDashboard(): void {`,
    `  defineDashElement(DbDashboard.tagName, DbDashboard);`,
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
    `# ${ir.meta.compositeName} — Web Components Export`,
    ``,
    `Generated at ${ir.meta.generatedAt} from composite \`${ir.meta.compositeId}\` v${ir.meta.version}.`,
    ``,
    `## Files`,
    ``,
    `- \`src/dashboard.ts\` — root \`<db-dashboard>\` Custom Element composed from builder bindings`,
    `- \`src/components/*.ts\` — W3C Custom Elements (native \`HTMLElement\` + Shadow DOM)`,
    `- \`src/register.ts\` — calls \`customElements.define\` for all generated tags`,
    `- \`src/lib/data/*.ts\` — fetch helpers targeting exported API routes`,
    `- \`src/styles/tokens.css\` — neutral dashboard styling tokens`,
    ``,
    `## Environment`,
    ``,
    ...envLines,
    ``,
    `## Next steps`,
    ``,
    `1. Import \`registerDashBuilderElements()\` from \`src/register.ts\` in your app entry.`,
    `2. Add \`<db-dashboard></db-dashboard>\` to your page (or embed in React/Vue/Angular via the tag).`,
    `3. Ensure server routes referenced by data modules are available.`,
    ``,
  ]);
}
