export interface TimerProps {
  label?: string;
  mode?: 'interval' | 'countdown';
  intervalMs?: number;
  tickCount?: number;
  className?: string;
}
