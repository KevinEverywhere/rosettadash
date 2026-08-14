import type { AppLanguageSelectProps } from './types';

describe('@rosettadash/svelte/domain/i18n/app-language-select', () => {
  it('exposes a typed props contract', () => {
    const props: AppLanguageSelectProps = {
      value: 'fr',
      locales: [{ code: 'fr', label: 'French', nativeLabel: 'Français' }],
    };
    expect(props.value).toBe('fr');
  });
});
