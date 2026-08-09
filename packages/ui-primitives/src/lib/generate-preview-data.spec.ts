import {
  generatePreviewData,
  hashSeed,
} from './generate-preview-data';

describe('generatePreviewData', () => {
  it('returns deterministic data for the same seed inputs', () => {
    const first = generatePreviewData({
      projectName: 'Sales',
      compositeName: 'Overview',
      dateRangePreset: 'last-7-days',
    });
    const second = generatePreviewData({
      projectName: 'Sales',
      compositeName: 'Overview',
      dateRangePreset: 'last-7-days',
    });

    expect(second).toEqual(first);
  });

  it('varies output when project or composite name changes', () => {
    const baseline = generatePreviewData({
      projectName: 'Sales',
      compositeName: 'Overview',
    });
    const changed = generatePreviewData({
      projectName: 'Marketing',
      compositeName: 'Overview',
    });

    expect(changed.kpiValue).not.toBe(baseline.kpiValue);
    expect(changed.tableRows[0]?.name).not.toBe(baseline.tableRows[0]?.name);
  });

  it('hashes seed strings to positive integers', () => {
    expect(hashSeed('abc')).toBeGreaterThan(0);
    expect(hashSeed('abc')).toBe(hashSeed('abc'));
  });

  it('uses domain context in preview seed and row labels', () => {
    const baseline = generatePreviewData({
      projectName: 'Sales',
      compositeName: 'Overview',
    });
    const scoped = generatePreviewData({
      projectName: 'Sales',
      compositeName: 'Overview',
      domainContext: {
        client: { id: 'acme', name: 'Acme Corp' },
        project: { id: 'rev', name: 'Revenue Ops' },
        defaultTimeRange: 'last-30-days',
      },
    });

    expect(scoped.kpiValue).not.toBe(baseline.kpiValue);
    expect(scoped.tableRows[0]?.name).toContain('Acme Corp');
    expect(scoped.selectOptions.some((option) => option.label.includes('Revenue Ops'))).toBe(
      true,
    );
  });
});
