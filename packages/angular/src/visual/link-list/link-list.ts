import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** Single link item for visual/link-list. */
export interface LinkListItem {
  label: string;
  href: string;
}

/** Public props contract for visual/link-list. */
export interface LinkListProps {
  items?: LinkListItem[];
  className?: string;
  dense?: boolean;
}

@Component({
  selector: 'rd-link-list',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ul data-testid="rd-link-list" [ngClass]="rootClass()">
      @for (item of items(); track item.href + ':' + item.label) {
        <li class="rd-link-list__item">
          <a class="rd-link-list__link" [href]="item.href">{{ item.label }}</a>
        </li>
      }
    </ul>
  `,
})
export class LinkList {
  readonly items = input<LinkListItem[]>([]);
  readonly className = input<string | undefined>(undefined);
  readonly dense = input(false);

  readonly rootClass = computed(() =>
    [
      'rd-link-list',
      this.dense() ? 'rd-link-list--dense' : '',
      this.className(),
    ]
      .filter(Boolean)
      .join(' '),
  );
}
