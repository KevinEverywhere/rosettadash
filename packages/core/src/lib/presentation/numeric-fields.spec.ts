import {
  DETAIL_NUMERIC_VALUE_CLASS,
  TABLE_NUMERIC_CELL_CLASS,
  generateNumericFieldsRuntimeFile,
  irUsesNumericPresentation,
  isNumericFieldKey,
  numericPresentationCssLines,
} from './numeric-fields';

describe('numeric-fields', () => {
  it('detects numeric field keys', () => {
    expect(isNumericFieldKey('amount')).toBe(true);
    expect(isNumericFieldKey('Amount')).toBe(true);
    expect(isNumericFieldKey('tick')).toBe(true);
    expect(isNumericFieldKey('name')).toBe(false);
    expect(isNumericFieldKey('date')).toBe(false);
  });

  it('returns css lines with optional scope prefix', () => {
    const lines = numericPresentationCssLines('.dashboard');
    expect(lines.some((line) => line.includes('.dashboard .table th.table-cell--numeric'))).toBe(true);
    expect(lines.some((line) => line.includes(DETAIL_NUMERIC_VALUE_CLASS))).toBe(true);
  });

  it('detects when export IR needs numeric presentation helpers', () => {
    expect(irUsesNumericPresentation([{ type: 'visual.table' }])).toBe(true);
    expect(irUsesNumericPresentation([{ type: 'visual.chart.line' }])).toBe(false);
  });

  it('generates runtime helper file with constants', () => {
    const file = generateNumericFieldsRuntimeFile();
    expect(file).toContain(TABLE_NUMERIC_CELL_CLASS);
    expect(file).toContain('isNumericFieldKey');
  });
});
