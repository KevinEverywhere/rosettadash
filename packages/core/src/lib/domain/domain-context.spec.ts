import {
  mergeDomainContext,
  normalizeDomainContext,
  slugifyDomainId,
} from './domain-context';

describe('domain context helpers', () => {
  it('slugifies domain ids', () => {
    expect(slugifyDomainId('Northwind Logistics')).toBe('northwind-logistics');
  });

  it('normalizes client and scoped project refs', () => {
    expect(
      normalizeDomainContext({
        client: { id: '', name: 'Acme Corp' },
        project: { id: 'proj-1', name: 'Revenue Ops' },
        defaultTimeRange: 'last-30-days',
      }),
    ).toEqual({
      client: { id: 'acme-corp', name: 'Acme Corp' },
      project: { id: 'proj-1', name: 'Revenue Ops' },
      defaultTimeRange: 'last-30-days',
    });
  });

  it('returns undefined for empty context', () => {
    expect(normalizeDomainContext({})).toBeUndefined();
  });

  it('merges partial updates', () => {
    expect(
      mergeDomainContext(
        {
          client: { id: 'acme', name: 'Acme Corp' },
          defaultTimeRange: 'last-7-days',
        },
        {
          project: { id: 'rev', name: 'Revenue Ops' },
        },
      ),
    ).toEqual({
      client: { id: 'acme', name: 'Acme Corp' },
      project: { id: 'rev', name: 'Revenue Ops' },
      defaultTimeRange: 'last-7-days',
    });
  });
});
