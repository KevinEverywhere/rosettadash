import {
  Component,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
} from '@angular/core';
import {
  DB_APP_LANGUAGE_SELECT_TAG,
  registerRdAppLanguageSelect,
  type AppLocaleOption,
} from '@rosettadash/web-components/domain/i18n/app-language-select';
import {
  attachHostEvents,
  setHostAttribute,
} from '../../../lib/custom-element-host';

export type { AppLocaleOption };

/** Public props for domain/i18n/app-language-select. */
export interface AppLanguageSelectProps {
  locales?: AppLocaleOption[];
  value?: string;
  defaultLocale?: string;
  label?: string;
  placeholder?: string;
  className?: string;
}

@Component({
  selector: DB_APP_LANGUAGE_SELECT_TAG,
  standalone: true,
  template: '',
})
export class AppLanguageSelect implements OnInit, OnDestroy {
  private readonly host = inject(ElementRef<HTMLElement>);
  private detachEvents: (() => void) | undefined;
  private ready = false;

  readonly locales = input<AppLocaleOption[] | undefined>(undefined);
  readonly value = input<string | undefined>(undefined);
  readonly defaultLocale = input<string | undefined>(undefined);
  readonly label = input<string | undefined>(undefined);
  readonly placeholder = input<string | undefined>(undefined);
  readonly className = input<string | undefined>(undefined);

  readonly localeChange = output<{ locale: string }>();

  constructor() {
    effect(() => {
      this.locales();
      this.value();
      this.defaultLocale();
      this.label();
      this.placeholder();
      this.className();
      if (this.ready) {
        this.syncFromInputs();
      }
    });
  }

  ngOnInit(): void {
    registerRdAppLanguageSelect();
    this.ready = true;
    this.syncFromInputs();
    this.detachEvents = attachHostEvents(this.host.nativeElement, {
      'locale-change': (detail: unknown) =>
        this.localeChange.emit(detail as { locale: string }),
    });
  }

  ngOnDestroy(): void {
    this.detachEvents?.();
  }

  private syncFromInputs(): void {
    const el = this.host.nativeElement;
    const locales = this.locales();
    setHostAttribute(el, 'locales', locales ? JSON.stringify(locales) : undefined);
    setHostAttribute(el, 'value', this.value());
    setHostAttribute(el, 'default-locale', this.defaultLocale());
    setHostAttribute(el, 'label', this.label());
    setHostAttribute(el, 'placeholder', this.placeholder());
    if (this.className()) {
      el.setAttribute('class', this.className()!);
    } else {
      el.removeAttribute('class');
    }
  }
}
