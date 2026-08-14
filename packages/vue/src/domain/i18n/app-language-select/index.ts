import {
  DB_APP_LANGUAGE_SELECT_TAG,
  registerRdAppLanguageSelect,
  type AppLocaleOption,
} from '@rosettadash/web-components/domain/i18n/app-language-select';
import { defineCustomElementHost } from '../../../lib/custom-element-host';

export type { AppLocaleOption };

export interface AppLanguageSelectProps {
  locales?: AppLocaleOption[];
  value?: string;
  defaultLocale?: string;
  label?: string;
  placeholder?: string;
  className?: string;
}

/** Vue wrapper around `<rd-app-language-select>`. */
export const AppLanguageSelect = defineCustomElementHost(
  {
    name: 'RdAppLanguageSelect',
    tagName: DB_APP_LANGUAGE_SELECT_TAG,
    register: registerRdAppLanguageSelect,
    attrs: {
      defaultLocale: 'default-locale',
    },
    properties: ['locales'],
    events: {
      'locale-change': 'localeChange',
    },
  },
  {
    locales: { type: Array as () => AppLocaleOption[], default: undefined },
    value: { type: String, default: undefined },
    defaultLocale: { type: String, default: undefined },
    label: { type: String, default: undefined },
    placeholder: { type: String, default: undefined },
  },
);

export type AppLanguageSelectComponent = typeof AppLanguageSelect;
