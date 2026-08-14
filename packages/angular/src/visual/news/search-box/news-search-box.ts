import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface NewsSearchBoxProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

/** @rosettadash/angular/visual/news/search-box — visual.news.search-box */
@Component({
  selector: 'rd-news-search-box',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section [attr.data-testid]="'rd-news-search-box'" [ngClass]="rootClass()">
      @if (label()) { <span class="rd-field__label">{{ label() }}</span> }
      <div class="rd-search__row">
        <input type="search" class="rd-input" [placeholder]="placeholder() ?? 'Search news…'" [value]="value() ?? ''" />
        <button type="button" class="rd-button">Search</button>
      </div>
      <ng-content />
    </section>
  `,
})
export class NewsSearchBox {
  readonly className = input<string | undefined>(undefined);
  readonly label = input<string | undefined>(undefined);
  readonly placeholder = input<string | undefined>(undefined);
  readonly value = input<string | undefined>(undefined);

  readonly rootClass = computed(() =>
    ['rd-news-search-box', this.className()].filter(Boolean).join(' '),
  );
}
