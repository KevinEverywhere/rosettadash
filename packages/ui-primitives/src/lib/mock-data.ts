import type {
  PreviewChartPoint,
  PreviewRow,
  PreviewSelectOption,
} from './preview-types';
import { generatePreviewData } from './generate-preview-data';

export type { PreviewRow, PreviewSelectOption, PreviewChartPoint };

const defaults = generatePreviewData();

export const PREVIEW_TABLE_ROWS: PreviewRow[] = defaults.tableRows;
export const PREVIEW_SELECT_OPTIONS: PreviewSelectOption[] = defaults.selectOptions;
export const PREVIEW_KPI_VALUE = defaults.kpiValue;
export const PREVIEW_KPI_DELTA = defaults.kpiDelta;
export const PREVIEW_CHART_POINTS: PreviewChartPoint[] = defaults.chartPoints;
export const PREVIEW_DATE_RANGE_LABEL = defaults.dateRangeLabel;
