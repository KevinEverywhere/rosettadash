import { mount } from '@vue/test-utils';
import { DB_APP_LANGUAGE_SELECT_TAG } from '@rosettadash/web-components/domain/i18n/app-language-select';
import { AppLanguageSelect } from './index';

describe('@rosettadash/vue/domain/i18n/app-language-select', () => {
  it('renders and registers the WC host', () => {
    const wrapper = mount(AppLanguageSelect, {
      props: {
        label: 'App language',
        value: 'en',
        locales: [{ code: 'en', label: 'English' }],
      },
    });

    const host = wrapper.find(DB_APP_LANGUAGE_SELECT_TAG);
    expect(host.exists()).toBe(true);
    expect(host.attributes('label')).toBe('App language');
    expect(customElements.get(DB_APP_LANGUAGE_SELECT_TAG)).toBeTruthy();
  });
});
