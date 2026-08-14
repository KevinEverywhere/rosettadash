export interface NewsLanguageSelectProps {
  label?: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}
