import {
  buildMongoScopeFilter,
  buildPostgresScopeClause,
  hasQueryScope,
  resolveQueryScope,
} from './query-scope';

describe('query scope helpers', () => {
  it('resolves client, project, and time range from domain context', () => {
    expect(
      resolveQueryScope(
        {
          client: { id: 'acme', name: 'Acme Corp' },
          project: { id: 'rev-ops', name: 'Revenue Ops' },
          defaultTimeRange: 'last-7-days',
        },
        new Date('2026-08-08T12:00:00.000Z'),
      ),
    ).toEqual({
      clientId: 'acme',
      projectId: 'rev-ops',
      rangeStart: '2026-08-01',
      rangeEnd: '2026-08-08',
    });
  });

  it('builds postgres scope clauses with positional params', () => {
    expect(
      buildPostgresScopeClause({
        clientId: 'acme',
        projectId: 'rev-ops',
        rangeStart: '2026-08-01',
        rangeEnd: '2026-08-08',
      }),
    ).toEqual({
      sql: ' AND client_id = $2 AND project_id = $3 AND created_at >= $4 AND created_at <= $5',
      params: ['acme', 'rev-ops', '2026-08-01', '2026-08-08'],
    });
  });

  it('builds mongo scope filters', () => {
    expect(
      buildMongoScopeFilter({
        clientId: 'acme',
        rangeStart: '2026-08-01',
        rangeEnd: '2026-08-08',
      }),
    ).toEqual({
      client_id: 'acme',
      created_at: { $gte: '2026-08-01', $lte: '2026-08-08' },
    });
  });

  it('returns undefined when domain has no scope fields', () => {
    expect(resolveQueryScope({})).toBeUndefined();
    expect(hasQueryScope(undefined)).toBe(false);
  });
});
