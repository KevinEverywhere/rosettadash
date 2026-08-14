export interface NewsSearchBoxProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onSearch?: (query: string) => void;
  className?: string;
}
