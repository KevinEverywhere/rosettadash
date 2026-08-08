import type { ExportIR } from '@dashbuilder/core';
import { buildDashboardContext } from './binding-resolver';
import { generateComponentFile } from './component-templates';
import type { GeneratedFile, ReactExportOptions } from './types';
import { ReactExportError } from './types';
import { componentExportName, joinLines, pascalFromId } from './utils';

export function generateReactUiFiles(
  ir: ExportIR,
  options: ReactExportOptions = {},
): GeneratedFile[] {
  if (ir.targets.ui !== 'react') {
    throw new ReactExportError(`React exporter cannot generate UI target "${ir.targets.ui}"`);
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
  const componentImports: string[] = [];

  for (const component of ir.components) {
    const exportName = exportNames.get(component.id);
    if (!exportName) {
      continue;
    }
    componentImports.push(exportName);
    files.push({
      path: `${root}/components/${exportName}.tsx`,
      content: generateComponentFile(component, exportName),
      encoding: 'utf-8',
      description: `React component for ${component.label}`,
    });
  }

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
    const hookName = `use${exportNames.get(source.id) ?? pascalFromId(source.id)}Data`;
    const route = ir.routes.find((entry) => entry.method === 'GET')?.path ?? '/api/records';
    files.push({
      path: `${root}/hooks/${hookName}.ts`,
      content: generateDataHook(hookName, route),
      encoding: 'utf-8',
      description: `Data hook for ${source.label}`,
    });
  }

  files.push({
    path: `${root}/Dashboard.tsx`,
    content: generateDashboardFile(ir, exportNames, componentImports),
    encoding: 'utf-8',
    description: 'Composed dashboard page wired from ExportIR bindings',
  });

  files.push({
    path: 'README.export.md',
    content: generateReadme(ir),
    encoding: 'utf-8',
    description: 'Setup notes for exported React UI fragment',
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
    `/* preset: ${ir.styles.preset} · generated for ${ir.meta.compositeName} */`,
    ``,
  ]);
}

function generateDataHook(hookName: string, route: string): string {
  return joinLines([
    `'use client';`,
    ``,
    `import { useEffect, useState } from 'react';`,
    `import type { Row } from '../types';`,
    ``,
    `export function ${hookName}() {`,
    `  const [data, setData] = useState<Row[] | undefined>();`,
    `  const [loading, setLoading] = useState(true);`,
    `  const [error, setError] = useState<Error | undefined>();`,
    ``,
    `  useEffect(() => {`,
    `    let cancelled = false;`,
    ``,
    `    fetch('${route}')`,
    `      .then(async (response) => {`,
    `        if (!response.ok) {`,
    `          throw new Error(\`Request failed: \${response.status}\`);`,
    `        }`,
    `        return response.json() as Promise<Row[]>;`,
    `      })`,
    `      .then((rows) => {`,
    `        if (!cancelled) {`,
    `          setData(rows);`,
    `        }`,
    `      })`,
    `      .catch((nextError: Error) => {`,
    `        if (!cancelled) {`,
    `          setError(nextError);`,
    `        }`,
    `      })`,
    `      .finally(() => {`,
    `        if (!cancelled) {`,
    `          setLoading(false);`,
    `        }`,
    `      });`,
    ``,
    `    return () => {`,
    `      cancelled = true;`,
    `    };`,
    `  }, []);`,
    ``,
    `  return { data, loading, error };`,
    `}`,
    ``,
  ]);
}

function generateDashboardFile(
  ir: ExportIR,
  exportNames: Map<string, string>,
  componentImports: string[],
): string {
  const context = buildDashboardContext(ir, exportNames);
  const hookImportLines = context.hookImports.map(
    (hook) => `import { ${hook} } from './hooks/${hook}';`,
  );
  const componentImportLines = componentImports.map(
    (name) => `import { ${name} } from './components/${name}';`,
  );

  const renderLines = context.components.map((component) => {
    const propLines = Object.entries(component.props).map(([key, value]) => `        ${key}={${value}}`);
    return [`      <${component.exportName}`, ...propLines, `      />`].join('\n');
  });

  return joinLines([
    `'use client';`,
    ``,
    `import { useState } from 'react';`,
    `import './styles/tokens.css';`,
    `import type { DateRange } from './types';`,
    ...componentImportLines,
    ...hookImportLines,
    ``,
    `export default function Dashboard() {`,
    ...context.stateDeclarations,
    ...context.hookCalls,
    ``,
    `  return (`,
    `    <main className="dashboard">`,
    `      <header>`,
    `        <h1>${ir.meta.compositeName}</h1>`,
    `      </header>`,
    ...renderLines,
    `    </main>`,
    `  );`,
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
    `# ${ir.meta.compositeName} — React UI Export`,
    ``,
    `Generated at ${ir.meta.generatedAt} from composite \`${ir.meta.compositeId}\` v${ir.meta.version}.`,
    ``,
    `## Files`,
    ``,
    `- \`src/Dashboard.tsx\` — composed page wired from builder bindings`,
    `- \`src/components/*.tsx\` — P0 visual components`,
    `- \`src/hooks/*.ts\` — data hooks targeting exported API routes`,
    `- \`src/styles/tokens.css\` — neutral dashboard styling`,
    ``,
    `## Environment`,
    ``,
    ...envLines,
    ``,
    `## Next steps`,
    ``,
    `1. Copy the generated \`src/\` folder into your React or Next.js app.`,
    `2. Mount \`Dashboard\` on a route.`,
    `3. Ensure server routes referenced by data hooks are available.`,
    ``,
  ]);
}
