import { createElement, forwardRef, type CSSProperties } from 'react';
import {
  DB_APP_LANGUAGE_SELECT_TAG,
  registerRdAppLanguageSelect,
  type AppLocaleOption,
} from '@rosettadash/web-components/domain/i18n/app-language-select';
import { useCustomElementHost } from '../../../lib/custom-element-host.js';

export type { AppLocaleOption };

export interface AppLanguageSelectProps {
  locales?: AppLocaleOption[];
  value?: string;
  defaultLocale?: string;
  label?: string;
  placeholder?: string;
  className?: string;
  style?: CSSProperties;
  onLocaleChange?: (detail: { locale: string }) => void;
}

/** React wrapper around `<rd-app-language-select>`. */
export const AppLanguageSelect = forwardRef<HTMLElement, AppLanguageSelectProps>(
  function AppLanguageSelect(
    {
      locales,
      value,
      defaultLocale,
      label,
      placeholder,
      className,
      style,
      onLocaleChange,
    },
    ref,
  ) {
    const hostRef = useCustomElementHost(
      {
        register: registerRdAppLanguageSelect,
        attrs: {
          defaultLocale: 'default-locale',
        },
        properties: ['locales'],
        events: {
          'locale-change': 'onLocaleChange',
        },
      },
      { value, defaultLocale, label, placeholder },
      {
        onLocaleChange: onLocaleChange as ((detail: unknown) => void) | undefined,
      },
      ref,
      { locales },
    );

    return createElement(DB_APP_LANGUAGE_SELECT_TAG, {
      ref: hostRef,
      className,
      style,
    });
  },
);
