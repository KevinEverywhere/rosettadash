/** CSS class for right-aligned table money/count columns in exported dashboards. */
export const TABLE_NUMERIC_CELL_CLASS = 'table-cell--numeric';

/** CSS class for right-aligned detail-panel numeric values in exported dashboards. */
export const DETAIL_NUMERIC_VALUE_CLASS = 'detail-panel__value--numeric';

const NUMERIC_FIELD_KEY_PATTERN =
  /^(amount|count|total|qty|quantity|price|revenue|value|delta|percent|progress|ticks?)$/i;

/** True when a row field or table column key should be right-aligned. */
export function isNumericFieldKey(key: string): boolean {
  return NUMERIC_FIELD_KEY_PATTERN.test(key);
}

const NUMERIC_PRESENTATION_TYPES = new Set([
  'visual.table',
  'visual.detail',
  'visual.kpi',
  'visual.input.number',
  'logic.timer',
  'visual.news.results-table',
  'visual.news.article-detail',
]);

export function irUsesNumericPresentation(components: Array<{ type: string }>): boolean {
  return components.some((component) => NUMERIC_PRESENTATION_TYPES.has(component.type));
}

/** CSS rules for numeric alignment in generated dashboard UIs. */
export function numericPresentationCssLines(scope = ''): string[] {
  const prefix = scope ? `${scope} ` : '';

  return [
    `${prefix}.table th.${TABLE_NUMERIC_CELL_CLASS}, ${prefix}.table td.${TABLE_NUMERIC_CELL_CLASS} { text-align: right; font-variant-numeric: tabular-nums; }`,
    `${prefix}.detail-panel__field dd.${DETAIL_NUMERIC_VALUE_CLASS} { text-align: right; font-variant-numeric: tabular-nums; }`,
    `${prefix}.kpi-card__value, ${prefix}.kpi-value { text-align: right; font-variant-numeric: tabular-nums; }`,
    `${prefix}.input[type="number"], ${prefix}input[type="number"] { text-align: right; font-variant-numeric: tabular-nums; }`,
    `${prefix}.timer__value { text-align: right; }`,
  ];
}

/** Runtime helper file emitted into exported apps that render tables or detail panels. */
export function generateNumericFieldsRuntimeFile(): string {
  return [
    '/** Generated — numeric column/field alignment helpers. */',
    `export const TABLE_NUMERIC_CELL_CLASS = '${TABLE_NUMERIC_CELL_CLASS}';`,
    `export const DETAIL_NUMERIC_VALUE_CLASS = '${DETAIL_NUMERIC_VALUE_CLASS}';`,
    '',
    'export function isNumericFieldKey(key: string): boolean {',
    '  return /^(amount|count|total|qty|quantity|price|revenue|value|delta|percent|progress|ticks?)$/i.test(',
    '    key,',
    '  );',
    '}',
    '',
  ].join('\n');
}
