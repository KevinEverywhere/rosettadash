import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface LoadingSkeletonProps {
  lines?: number;
  className?: string;
}

/** @rosettadash/angular/visual/skeleton — visual.skeleton */
@Component({
  selector: 'rd-skeleton',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section [attr.data-testid]="'rd-skeleton'" [ngClass]="rootClass()">
      @for (line of skeletonLines(); track line) {
        <span [class]="line"></span>
      }
      <ng-content />
    </section>
  `,
})
export class LoadingSkeleton {
  readonly className = input<string | undefined>(undefined);
  readonly lines = input<number | undefined>(undefined);

  readonly rootClass = computed(() =>
    ['rd-skeleton', this.className()].filter(Boolean).join(' '),
  );
  readonly skeletonLines = computed(() => {
    const count = this.lines() ?? 4;
    return Array.from({ length: count }, (_, i) =>
      ['rd-skeleton__line', i === 2 ? 'rd-skeleton__line--short' : ''].filter(Boolean).join(' '),
    );
  });
}
