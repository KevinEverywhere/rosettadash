export {
  DB_APP_LANGUAGE_SELECT_TAG,
  RdAppLanguageSelectElement,
  registerRdAppLanguageSelect,
  type AppLanguageSelectProps,
  type AppLocaleOption,
} from './app-language-select/index.js';

import { registerRdAppLanguageSelect } from './app-language-select/index.js';

export function registerRosettaDashDomainElements(): void {
  registerRdAppLanguageSelect();
}
