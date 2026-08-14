export interface DateRangeFilterProps {
  label?: string;
  startDate?: string;
  endDate?: string;
  presetLabel?: string;
  onChange?: (range: { startDate: string; endDate: string }) => void;
  className?: string;
}
