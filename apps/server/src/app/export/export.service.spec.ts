import { ExportBuildError, defaultComponentRegistry } from '@dashbuilder/core';
import { ExportService } from './export.service';

describe('ExportService', () => {
  let service: ExportService;

  beforeEach(() => {
    service = new ExportService();
  });

  it('returns ExportIR for a valid composite', () => {
    const pg = defaultComponentRegistry.createNode('infra.postgresql', { id: 'pg1' });
    const table = defaultComponentRegistry.createNode('visual.table', { id: 't1' });

    const ir = service.buildIr({
      id: 'c1',
      name: 'Export me',
      version: 1,
      nodes: [pg, table],
      bindings: [
        {
          id: 'b1',
          sourceNodeId: 'pg1',
          sourcePortId: 'rowset',
          targetNodeId: 't1',
          targetPortId: 'data',
        },
      ],
    });

    expect(ir.meta.compositeName).toBe('Export me');
    expect(ir.events).toHaveLength(1);
  });

  it('returns generated React files for a valid composite', () => {
    const pg = defaultComponentRegistry.createNode('infra.postgresql', { id: 'pg1' });
    const table = defaultComponentRegistry.createNode('visual.table', { id: 't1' });

    const result = service.buildReactExport({
      id: 'c1',
      name: 'Export me',
      version: 1,
      exportTargets: { ui: 'react', server: 'nest' },
      nodes: [pg, table],
      bindings: [
        {
          id: 'b1',
          sourceNodeId: 'pg1',
          sourcePortId: 'rowset',
          targetNodeId: 't1',
          targetPortId: 'data',
        },
      ],
    });

    expect(result.ir.meta.compositeName).toBe('Export me');
    expect(result.files.some((file) => file.path === 'src/Dashboard.tsx')).toBe(true);
    expect(result.files.some((file) => file.path.startsWith('src/components/'))).toBe(true);
  });

  it('returns generated Angular files for a valid composite', () => {
    const pg = defaultComponentRegistry.createNode('infra.postgresql', { id: 'pg1' });
    const table = defaultComponentRegistry.createNode('visual.table', { id: 't1' });

    const result = service.buildAngularExport({
      id: 'c1',
      name: 'Export me',
      version: 1,
      exportTargets: { ui: 'angular', server: 'nest' },
      nodes: [pg, table],
      bindings: [
        {
          id: 'b1',
          sourceNodeId: 'pg1',
          sourcePortId: 'rowset',
          targetNodeId: 't1',
          targetPortId: 'data',
        },
      ],
    });

    expect(result.ir.meta.compositeName).toBe('Export me');
    expect(result.files.some((file) => file.path === 'src/dashboard.component.ts')).toBe(true);
    expect(result.files.some((file) => file.path.startsWith('src/components/'))).toBe(true);
  });

  it('returns generated NestJS files for a valid composite', () => {
    const pg = defaultComponentRegistry.createNode('infra.postgresql', {
      id: 'pg1',
      properties: { connectionEnvKey: 'DATABASE_URL', table: 'sales' },
    });
    const table = defaultComponentRegistry.createNode('visual.table', { id: 't1' });
    const server = defaultComponentRegistry.createNode('infra.server.nest', { id: 's1' });

    const result = service.buildNestExport({
      id: 'c1',
      name: 'Export me',
      version: 1,
      exportTargets: { ui: 'react', server: 'nest', database: 'postgresql' },
      nodes: [pg, table, server],
      bindings: [
        {
          id: 'b1',
          sourceNodeId: 'pg1',
          sourcePortId: 'rowset',
          targetNodeId: 't1',
          targetPortId: 'data',
        },
      ],
    });

    expect(result.ir.meta.compositeName).toBe('Export me');
    expect(result.files.some((file) => file.path === 'server/src/main.ts')).toBe(true);
    expect(result.files.some((file) => file.path === 'server/src/sales/sales.controller.ts')).toBe(
      true,
    );
  });

  it('returns combined React and NestJS files for a valid composite', () => {
    const pg = defaultComponentRegistry.createNode('infra.postgresql', {
      id: 'pg1',
      properties: { connectionEnvKey: 'DATABASE_URL', table: 'sales' },
    });
    const table = defaultComponentRegistry.createNode('visual.table', { id: 't1' });
    const server = defaultComponentRegistry.createNode('infra.server.nest', { id: 's1' });

    const result = service.buildBundleExport({
      id: 'c1',
      name: 'Export me',
      version: 1,
      exportTargets: { ui: 'react', server: 'nest', database: 'postgresql' },
      nodes: [pg, table, server],
      bindings: [
        {
          id: 'b1',
          sourceNodeId: 'pg1',
          sourcePortId: 'rowset',
          targetNodeId: 't1',
          targetPortId: 'data',
        },
      ],
    });

    expect(result.files.some((file) => file.path === 'src/Dashboard.tsx')).toBe(true);
    expect(result.files.some((file) => file.path === 'server/src/main.ts')).toBe(true);
    expect(result.files.length).toBeGreaterThan(10);
  });

  it('returns combined Angular and NestJS files for a valid composite', () => {
    const pg = defaultComponentRegistry.createNode('infra.postgresql', {
      id: 'pg1',
      properties: { connectionEnvKey: 'DATABASE_URL', table: 'sales' },
    });
    const table = defaultComponentRegistry.createNode('visual.table', { id: 't1' });
    const server = defaultComponentRegistry.createNode('infra.server.nest', { id: 's1' });

    const result = service.buildBundleExport({
      id: 'c1',
      name: 'Export me',
      version: 1,
      exportTargets: { ui: 'angular', server: 'nest', database: 'postgresql' },
      nodes: [pg, table, server],
      bindings: [
        {
          id: 'b1',
          sourceNodeId: 'pg1',
          sourcePortId: 'rowset',
          targetNodeId: 't1',
          targetPortId: 'data',
        },
      ],
    });

    expect(result.files.some((file) => file.path === 'src/dashboard.component.ts')).toBe(true);
    expect(result.files.some((file) => file.path === 'server/src/main.ts')).toBe(true);
    expect(result.files.some((file) => file.path === 'src/Dashboard.tsx')).toBe(false);
  });

  it('throws ExportBuildError for invalid composites', () => {
    const table = defaultComponentRegistry.createNode('visual.table', { id: 't1' });

    expect(() =>
      service.buildIr({
        id: 'c1',
        name: 'Broken',
        version: 1,
        nodes: [table],
        bindings: [],
      }),
    ).toThrow(ExportBuildError);
  });
});
