export interface AppLocaleOption {
  code: string;
  label: string;
  nativeLabel?: string;
}

export interface AppLanguageSelectProps {
  locales?: AppLocaleOption[];
  value?: string;
  defaultLocale?: string;
  label?: string;
  placeholder?: string;
  className?: string;
  onLocaleChange?: (detail: { locale: string }) => void;
}
