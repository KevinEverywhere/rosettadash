export interface TextareaInputProps {
  label?: string;
  placeholder?: string;
  rows?: number;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}
