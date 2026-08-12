export type DataType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'date'
  | 'date-range'
  | 'rowset'
  | 'row'
  | 'event'
  | 'any';

export const DATA_TYPE_COMPATIBILITY: Record<DataType, DataType[]> = {
  string: ['string', 'any'],
  number: ['number', 'any'],
  boolean: ['boolean', 'any'],
  date: ['date', 'string', 'any'],
  'date-range': ['date-range', 'any'],
  rowset: ['rowset', 'any'],
  row: ['row', 'rowset', 'any'],
  event: ['event', 'any'],
  any: ['string', 'number', 'boolean', 'date', 'date-range', 'rowset', 'row', 'event', 'any'],
};

export function areDataTypesCompatible(source: DataType, target: DataType): boolean {
  return DATA_TYPE_COMPATIBILITY[source]?.includes(target) ?? false;
}
