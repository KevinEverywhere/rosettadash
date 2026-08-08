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
