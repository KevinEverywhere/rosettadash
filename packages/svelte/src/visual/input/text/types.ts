export interface TextInputProps {
  label?: string;
  placeholder?: string;
  required?: boolean;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
}
