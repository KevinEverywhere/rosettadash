import { formatLocaleLabel, parseAppLocaleOptions } from './parse-locale-options.js';
import {
  DB_APP_LANGUAGE_SELECT_TAG,
  RdAppLanguageSelectElement,
  registerRdAppLanguageSelect,
} from './rd-app-language-select.js';

const SAMPLE_LOCALES = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'es', label: 'Spanish', nativeLabel: 'Español' },
];

describe('parseAppLocaleOptions', () => {
  it('parses locale rows', () => {
    const rows = parseAppLocaleOptions(
      JSON.stringify([{ code: 'en', label: 'English', nativeLabel: 'English' }]),
    );
    expect(rows).toHaveLength(1);
    expect(rows[0]?.code).toBe('en');
  });
});

describe('formatLocaleLabel', () => {
  it('includes native label when different', () => {
    expect(formatLocaleLabel({ code: 'es', label: 'Spanish', nativeLabel: 'Español' })).toBe(
      'Spanish (Español)',
    );
  });
});

describe('rd-app-language-select', () => {
  beforeAll(() => {
    registerRdAppLanguageSelect();
  });

  it('registers the custom element', () => {
    expect(customElements.get(DB_APP_LANGUAGE_SELECT_TAG)).toBe(RdAppLanguageSelectElement);
  });

  it('renders locale options and emits locale-change', async () => {
    const el = document.createElement(DB_APP_LANGUAGE_SELECT_TAG) as RdAppLanguageSelectElement;
    const handler = jest.fn();
    el.addEventListener('locale-change', handler);
    document.body.appendChild(el);
    el.setAttribute('locales', JSON.stringify(SAMPLE_LOCALES));
    el.setAttribute('value', 'en');
    await el.whenReady();

    const select = el.shadowRoot?.querySelector('select');
    expect(select?.options.length).toBeGreaterThan(1);

    if (select) {
      select.value = 'es';
      select.dispatchEvent(new Event('change', { bubbles: true }));
    }

    expect(handler).toHaveBeenCalled();
    expect(handler.mock.calls.at(-1)?.[0]?.detail).toEqual({ locale: 'es' });
    expect(el.getAttribute('value')).toBe('es');

    el.remove();
  });
});
