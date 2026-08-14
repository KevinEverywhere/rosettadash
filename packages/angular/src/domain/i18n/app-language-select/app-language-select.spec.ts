import type { AppLanguageSelectProps } from './app-language-select';

describe('@rosettadash/angular/domain/i18n/app-language-select', () => {
  it('exposes a typed props contract', () => {
    const props: AppLanguageSelectProps = {
      value: 'en',
      locales: [{ code: 'en', label: 'English' }],
    };
    expect(props.value).toBe('en');
  });
});
