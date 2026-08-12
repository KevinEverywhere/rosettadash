/** Keys whose detail-panel values should be right-aligned (money, counts). */
export function isNumericDetailKey(key: string): boolean {
  return /^(amount|count|total|qty|quantity|price|revenue|value|delta|percent|progress|ticks?)$/i.test(
    key,
  );
}

export const PREVIEW_TABLE_NUMERIC_CLASS = 'preview-table__cell--numeric';
