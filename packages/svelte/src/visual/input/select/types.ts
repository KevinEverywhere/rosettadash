export interface SelectInputOption {
  value: string;
  label: string;
}

export interface SelectInputProps {
  label?: string;
  placeholder?: string;
  options?: SelectInputOption[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}
