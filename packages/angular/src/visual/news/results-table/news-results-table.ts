import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface NewsResultsTableProps {
  title?: string;
  className?: string;
}

/** @rosettadash/angular/visual/news/results-table — visual.news.results-table */
@Component({
  selector: 'rd-news-results-table',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section [attr.data-testid]="'rd-news-results-table'" [ngClass]="rootClass()">
      <header class="rd-table__header"><span>{{ title() ?? 'News results' }}</span></header>
      <table class="rd-table"><thead><tr><th>Headline</th><th>Source</th><th>Region</th><th>Published</th></tr></thead><tbody></tbody></table>
      <ng-content />
    </section>
  `,
})
export class NewsResultsTable {
  readonly className = input<string | undefined>(undefined);
  readonly title = input<string | undefined>(undefined);

  readonly rootClass = computed(() =>
    ['rd-news-results-table', this.className()].filter(Boolean).join(' '),
  );
}
