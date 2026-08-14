import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface SvgInlineProps {
  markup?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
}

/** @rosettadash/angular/visual/svg/inline — visual.svg.inline */
@Component({
  selector: 'rd-svg-inline',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [attr.data-testid]="'rd-svg-inline'" [ngClass]="rootClass()" [style.width.px]="width() ?? 96" [style.height.px]="height() ?? 96" [innerHTML]="markup() ?? defaultSvg"></div>
  `,
})
export class SvgInline {
  readonly className = input<string | undefined>(undefined);
  readonly markup = input<string | undefined>(undefined);
  readonly width = input<number | string | undefined>(undefined);
  readonly height = input<number | string | undefined>(undefined);

  readonly rootClass = computed(() =>
    ['rd-svg-inline', this.className()].filter(Boolean).join(' '),
  );
  readonly defaultSvg = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.2"/></svg>';
}
