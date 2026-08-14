import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface ThreeGeoGlobeProps {
  title?: string;
  mode?: string;
  className?: string;
}

/** @rosettadash/angular/visual/display/3d-geo-globe — visual.display.3d-geo-globe */
@Component({
  selector: 'rd-display-3d-geo-globe',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section [attr.data-testid]="'rd-display-3d-geo-globe'" [ngClass]="rootClass()" [attr.data-three-mode]="mode()" [attr.data-three-title]="title()" [attr.aria-label]="title() ?? '3D host'"><ng-content /></section>
  `,
})
export class ThreeGeoGlobe {
  readonly className = input<string | undefined>(undefined);
  readonly title = input<string | undefined>(undefined);
  readonly mode = input<string | undefined>(undefined);

  readonly rootClass = computed(() =>
    ['rd-display-3d-geo-globe', this.className()].filter(Boolean).join(' '),
  );
}
