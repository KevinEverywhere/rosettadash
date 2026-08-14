export interface KpiCardProps {
  title?: string;
  value?: string | number;
  delta?: string;
  format?: 'number' | 'currency' | 'percent';
  className?: string;
}
