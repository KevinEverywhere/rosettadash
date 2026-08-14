import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface GridLayoutProps {
  title?: string;
  columns?: number;
  gap?: number | string;
  className?: string;
}

/** @rosettadash/angular/layout/grid — layout.grid */
@Component({
  selector: 'rd-grid',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section [attr.data-testid]="'rd-grid'" [ngClass]="rootClass()">
      @if (title()) { <span class="rd-grid__title">{{ title() }}</span> }
      <div class="rd-grid__grid" [style.grid-template-columns]="gridColumns()" [style.gap.px]="gridGap()"><ng-content /></div>
    </section>
  `,
})
export class GridLayout {
  readonly className = input<string | undefined>(undefined);
  readonly title = input<string | undefined>(undefined);
  readonly columns = input<number | undefined>(undefined);
  readonly gap = input<number | string | undefined>(undefined);

  readonly rootClass = computed(() =>
    ['rd-grid', this.className()].filter(Boolean).join(' '),
  );
  gridColumns(): string {
    return `repeat(${this.columns() ?? 3}, 1fr)`;
  }
  gridGap(): number {
    const gap = this.gap();
    return typeof gap === 'number' ? gap : 12;
  }
}
