import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface ThreeGltfModelProps {
  title?: string;
  mode?: string;
  className?: string;
}

/** @rosettadash/angular/visual/display/3d-gltf-model — visual.display.3d-gltf-model */
@Component({
  selector: 'rd-display-3d-gltf-model',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section [attr.data-testid]="'rd-display-3d-gltf-model'" [ngClass]="rootClass()" [attr.data-three-mode]="mode()" [attr.data-three-title]="title()" [attr.aria-label]="title() ?? '3D host'"><ng-content /></section>
  `,
})
export class ThreeGltfModel {
  readonly className = input<string | undefined>(undefined);
  readonly title = input<string | undefined>(undefined);
  readonly mode = input<string | undefined>(undefined);

  readonly rootClass = computed(() =>
    ['rd-display-3d-gltf-model', this.className()].filter(Boolean).join(' '),
  );
}
