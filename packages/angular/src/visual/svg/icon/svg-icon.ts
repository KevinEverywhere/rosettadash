import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface SvgIconProps {
  markup?: string;
  title?: string;
  color?: string;
  size?: number | string;
  className?: string;
}

/** @rosettadash/angular/visual/svg/icon — visual.svg.icon */
@Component({
  selector: 'rd-svg-icon',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span [attr.data-testid]="'rd-svg-icon'" [ngClass]="rootClass()" [style.width.px]="size() ?? 28" [style.height.px]="size() ?? 28" [style.color]="color()" [title]="title() ?? ''" [innerHTML]="markup() ?? defaultIconSvg"></span>
  `,
})
export class SvgIcon {
  readonly className = input<string | undefined>(undefined);
  readonly markup = input<string | undefined>(undefined);
  readonly title = input<string | undefined>(undefined);
  readonly color = input<string | undefined>(undefined);
  readonly size = input<number | string | undefined>(undefined);

  readonly rootClass = computed(() =>
    ['rd-svg-icon', this.className()].filter(Boolean).join(' '),
  );
  readonly defaultIconSvg = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7-6.3-4.6L5.7 21l2.3-7-6-4.6h7.6z" fill="currentColor"/></svg>';
}
