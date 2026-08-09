import { buildExportIR, defaultComponentRegistry } from '@dashbuilder/core';
import { generateSupabaseInfraFiles } from './generate-supabase-infra';
import { SupabaseExportError } from './types';

describe('generateSupabaseInfraFiles', () => {
  const registry = defaultComponentRegistry;

  it('generates Supabase database files for a supabase-backed composite', () => {
    const table = registry.createNode('visual.table', { id: 't1' });
    const supabase = registry.createNode('infra.supabase', {
      id: 'sb1',
      properties: { urlEnvKey: 'SUPABASE_URL', anonKeyEnvKey: 'SUPABASE_ANON_KEY', table: 'sales' },
    });
    const server = registry.createNode('infra.server.nest', { id: 's1' });

    const ir = buildExportIR(
      {
        id: 'comp1',
        name: 'Sales Dashboard',
        version: 2,
        exportTargets: { ui: 'react', server: 'nest', database: 'supabase' },
        nodes: [table, supabase, server],
        bindings: [
          {
            id: 'b1',
            sourceNodeId: 'sb1',
            sourcePortId: 'rowset',
            targetNodeId: 't1',
            targetPortId: 'data',
          },
        ],
      },
      registry,
      { generatedAt: '2026-08-08T00:00:00.000Z' },
    );

    const files = generateSupabaseInfraFiles(ir);
    const paths = files.map((file) => file.path);

    expect(paths).toEqual(
      expect.arrayContaining([
        '.env.example',
        'database/src/supabase.client.ts',
        'database/src/queries/list-rows.ts',
        'database/src/tables/sales.ts',
        'README.export.database.md',
      ]),
    );

    const tableModule = files.find((file) => file.path === 'database/src/tables/sales.ts');
    expect(tableModule?.content).toContain('listSalesRows');
    expect(tableModule?.content).toContain("'sales'");

    const client = files.find((file) => file.path === 'database/src/supabase.client.ts');
    expect(client?.content).toContain("process.env['SUPABASE_URL']");
    expect(client?.content).toContain("process.env['SUPABASE_ANON_KEY']");

    const env = files.find((file) => file.path === '.env.example');
    expect(env?.content).toContain('SUPABASE_URL=');
    expect(env?.content).toContain('SUPABASE_ANON_KEY=');
  });

  it('rejects non-supabase database targets', () => {
    const ir = buildExportIR(
      {
        id: 'comp1',
        name: 'Mongo only',
        version: 1,
        exportTargets: { ui: 'react', server: 'nest', database: 'mongodb' },
        nodes: [
          registry.createNode('infra.supabase', {
            id: 'sb1',
            properties: { table: 'sales' },
          }),
        ],
        bindings: [],
      },
      registry,
    );

    expect(() => generateSupabaseInfraFiles(ir)).toThrow(/cannot generate database target "mongodb"/);
  });

  it('requires a Supabase data source', () => {
    const ir = buildExportIR(
      {
        id: 'comp1',
        name: 'No database',
        version: 1,
        exportTargets: { ui: 'react', server: 'nest', database: 'supabase' },
        nodes: [registry.createNode('infra.server.nest', { id: 's1' })],
        bindings: [],
      },
      registry,
    );

    expect(() => generateSupabaseInfraFiles(ir)).toThrow(SupabaseExportError);
    expect(() => generateSupabaseInfraFiles(ir)).toThrow(/Supabase data source/);
  });
});
