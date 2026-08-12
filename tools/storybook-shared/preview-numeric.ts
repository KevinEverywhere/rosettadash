import { isNumericFieldKey } from '@rosettadash/core';

/** Keys whose detail-panel values should be right-aligned (money, counts). */
export const isNumericDetailKey = isNumericFieldKey;

export const PREVIEW_TABLE_NUMERIC_CLASS = 'preview-table__cell--numeric';
export const PREVIEW_DETAIL_NUMERIC_CLASS = 'preview-detail__value--numeric';
