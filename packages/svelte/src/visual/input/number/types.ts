export interface NumberInputProps {
  label?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  onChange?: (value: number) => void;
  className?: string;
}
