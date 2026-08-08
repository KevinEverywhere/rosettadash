import { resolvePreviewGraph } from './generate-preview-data';

describe('resolvePreviewGraph', () => {
  const nodes = [
    { id: 'dr1', type: 'visual.input.date-range', properties: { preset: 'last-7-days' } },
    { id: 't1', type: 'visual.table' },
    { id: 'c1', type: 'visual.chart.line' },
  ];

  it('filters table rows when date range is bound to table filter', () => {
    const bound = resolvePreviewGraph({
      projectName: 'Sales',
      compositeName: 'Overview',
      limit: 10,
      nodes,
      bindings: [
        {
          id: 'b1',
          sourceNodeId: 'dr1',
          sourcePortId: 'range',
          targetNodeId: 't1',
          targetPortId: 'filter',
        },
      ],
    });

    const unbound = resolvePreviewGraph({
      projectName: 'Sales',
      compositeName: 'Overview',
      limit: 10,
      nodes,
      bindings: [],
    });

    const tableSlice = bound.nodes['t1'];
    expect(tableSlice?.filteredByDateRange).toBe(true);
    expect(tableSlice?.tableRows?.length).toBeLessThan(
      unbound.nodes['t1']?.tableRows?.length ?? Number.MAX_SAFE_INTEGER,
    );
  });

  it('derives chart points from table rowset when table is present', () => {
    const result = resolvePreviewGraph({
      projectName: 'Sales',
      compositeName: 'Overview',
      limit: 8,
      nodes,
      bindings: [
        {
          id: 'b1',
          sourceNodeId: 'dr1',
          sourcePortId: 'range',
          targetNodeId: 't1',
          targetPortId: 'filter',
        },
        {
          id: 'b2',
          sourceNodeId: 'dr1',
          sourcePortId: 'range',
          targetNodeId: 'c1',
          targetPortId: 'range',
        },
      ],
    });

    const chartSlice = result.nodes['c1'];
    expect(chartSlice?.linkedFromTable).toBe(true);
    expect(chartSlice?.filteredByDateRange).toBe(true);
    expect(chartSlice?.chartPoints?.length).toBeGreaterThan(0);
    expect(chartSlice?.chartPoints?.[0]?.label).toMatch(/\d{2}-\d{2}/);
  });
});
