import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface VideoMetadataItem {
  label: string;
  value: string;
}

@Component({
  selector: 'da-video-metadata-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="rd-video-metadata" data-testid="rd-video-metadata">
      <h3 class="rd-video-metadata__title">{{ panelTitle() }}</h3>
      <dl class="rd-video-metadata__list">
        @for (item of items(); track item.label) {
          <div>
            <dt>{{ item.label }}</dt>
            <dd>{{ item.value }}</dd>
          </div>
        }
      </dl>
    </section>
  `,
})
export class VideoMetadataPanelComponent {
  readonly panelTitle = input('Video characteristics');
  readonly items = input<VideoMetadataItem[]>([]);
}
