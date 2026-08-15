import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import type { MapsPanelId } from '@rosettadash/core';

@Component({
  selector: 'da-maps-panel-nav',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="da-tabbar da-maps-tabbar" aria-label="Map views">
      <button
        type="button"
        class="da-tabbar__tab da-tabbar__tab--left"
        [attr.aria-current]="panel() === 'map' ? 'page' : null"
        (click)="selectPanel.emit('map')"
      >
        Map
      </button>
      <button
        type="button"
        class="da-tabbar__tab da-tabbar__tab--right"
        [attr.aria-current]="panel() === 'globe' ? 'page' : null"
        (click)="selectPanel.emit('globe')"
      >
        Globe
      </button>
    </nav>
  `,
})
export class MapsPanelNavComponent {
  readonly panel = input.required<MapsPanelId>();
  readonly selectPanel = output<MapsPanelId>();
}
