import { defineRosettaElement, readString } from '../../../lib/element-utils.js';
import { escapeHtml } from '../../../lib/parse-link-items.js';
import { applyShadowMount, ensureShadowBase, loadShadowPairForTag } from '../../../lib/shadow-base.js';
import {
  formatLocaleLabel,
  parseAppLocaleOptions,
  type AppLocaleOption,
} from './parse-locale-options.js';

export const DB_APP_LANGUAGE_SELECT_TAG = 'rd-app-language-select';

export type { AppLocaleOption };

/** Public props contract for domain/i18n/app-language-select. */
export interface AppLanguageSelectProps {
  locales?: AppLocaleOption[];
  value?: string;
  defaultLocale?: string;
  label?: string;
  placeholder?: string;
  className?: string;
}

export class RdAppLanguageSelectElement extends HTMLElement {
  static readonly tagName = DB_APP_LANGUAGE_SELECT_TAG;

  private localesValue: AppLocaleOption[] = [];
  private resourcesReady: Promise<void> | null = null;
  private changeListener: (() => void) | null = null;
  private selectEl: HTMLSelectElement | null = null;

  static get observedAttributes(): string[] {
    return ['locales', 'value', 'default-locale', 'label', 'placeholder'];
  }

  connectedCallback(): void {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
    }
    this.syncLocalesFromAttribute();
    this.resourcesReady = this.mountShadow();
    void this.resourcesReady.then(() => this.paint());
  }

  disconnectedCallback(): void {
    if (this.selectEl && this.changeListener) {
      this.selectEl.removeEventListener('change', this.changeListener);
    }
    this.changeListener = null;
    this.selectEl = null;
  }

  attributeChangedCallback(name: string): void {
    if (name === 'locales') {
      this.syncLocalesFromAttribute();
    }
    if (this.shadowRoot && this.resourcesReady) {
      void this.resourcesReady.then(() => this.paint());
    }
  }

  setProperty(name: string, value: unknown): void {
    (this as Record<string, unknown>)[name] = value;
    if (name === 'locales' && Array.isArray(value)) {
      this.localesValue = value as AppLocaleOption[];
      this.setAttribute('locales', JSON.stringify(this.localesValue));
    }
    if (this.resourcesReady) {
      void this.resourcesReady.then(() => this.paint());
    }
  }

  whenReady(): Promise<void> {
    return this.resourcesReady ?? Promise.resolve();
  }

  get locales(): AppLocaleOption[] {
    return this.localesValue;
  }

  set locales(value: AppLocaleOption[]) {
    this.localesValue = Array.isArray(value) ? value : [];
    this.setAttribute('locales', JSON.stringify(this.localesValue));
  }

  get value(): string {
    return readString(this.getAttribute('value'), '');
  }

  set value(next: string) {
    if (next) {
      this.setAttribute('value', next);
    } else {
      this.removeAttribute('value');
    }
  }

  get defaultLocale(): string {
    return readString(this.getAttribute('default-locale'), '');
  }

  get label(): string {
    return readString(this.getAttribute('label'), 'App language');
  }

  get placeholder(): string {
    return readString(this.getAttribute('placeholder'), 'Select language…');
  }

  private syncLocalesFromAttribute(): void {
    this.localesValue = parseAppLocaleOptions(this.getAttribute('locales'));
  }

  private async mountShadow(): Promise<void> {
    const root = this.shadowRoot;
    if (!root || root.querySelector('[data-ref="select"]')) {
      return;
    }
    const pair = await loadShadowPairForTag(
      DB_APP_LANGUAGE_SELECT_TAG,
      './rd-app-language-select.html',
      './rd-app-language-select.css',
    );
    applyShadowMount(root, pair);
    this.selectEl = root.querySelector('[data-ref="select"]');
    this.changeListener = () => this.handleChange();
    this.selectEl?.addEventListener('change', this.changeListener);
  }

  private resolveSelectedLocale(): string {
    if (this.value) {
      return this.value;
    }
    if (this.defaultLocale) {
      return this.defaultLocale;
    }
    return this.localesValue[0]?.code ?? '';
  }

  private handleChange(): void {
    const locale = this.selectEl?.value ?? '';
    if (locale) {
      this.setAttribute('value', locale);
    }
    this.dispatchEvent(
      new CustomEvent('locale-change', {
        detail: { locale },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private paint(): void {
    const root = this.shadowRoot;
    if (!root) {
      return;
    }

    const labelEl = root.querySelector('[data-ref="label"]');
    const select = root.querySelector<HTMLSelectElement>('[data-ref="select"]');
    if (!labelEl || !select) {
      return;
    }

    labelEl.textContent = this.label;

    const selected = this.resolveSelectedLocale();
    const placeholder = this.placeholder;
    const options = this.localesValue
      .map(
        (option) =>
          `<option value="${escapeHtml(option.code)}"${option.code === selected ? ' selected' : ''}>${escapeHtml(formatLocaleLabel(option))}</option>`,
      )
      .join('');

    select.innerHTML = `<option value="">${escapeHtml(placeholder)}</option>${options}`;
    if (selected) {
      select.value = selected;
    }
  }
}

export function registerRdAppLanguageSelect(): void {
  ensureShadowBase(DB_APP_LANGUAGE_SELECT_TAG);
  defineRosettaElement(DB_APP_LANGUAGE_SELECT_TAG, RdAppLanguageSelectElement);
}
