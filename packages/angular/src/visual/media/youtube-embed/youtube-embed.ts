import {
  Component,
  effect,
  ElementRef,
  inject,
  input,
  OnInit,
} from '@angular/core';
import {
  DB_YOUTUBE_EMBED_TAG,
  registerRdYoutubeEmbed,
} from '@rosettadash/web-components/visual/media/youtube-embed';
import { setHostAttribute } from '../../../lib/custom-element-host';

/** Public props for visual/media/youtube-embed. */
export interface YoutubeEmbedProps {
  videoId?: string;
  url?: string;
  start?: number;
  autoplay?: boolean;
  mute?: boolean;
  controls?: boolean;
  title?: string;
  className?: string;
}

@Component({
  selector: DB_YOUTUBE_EMBED_TAG,
  standalone: true,
  template: '',
})
export class YoutubeEmbed implements OnInit {
  private readonly host = inject(ElementRef<HTMLElement>);
  private ready = false;

  readonly videoId = input<string | undefined>(undefined);
  readonly url = input<string | undefined>(undefined);
  readonly start = input<number | undefined>(undefined);
  readonly autoplay = input<boolean | undefined>(undefined);
  readonly mute = input<boolean | undefined>(undefined);
  readonly controls = input<boolean | undefined>(undefined);
  readonly title = input<string | undefined>(undefined);
  readonly className = input<string | undefined>(undefined);

  constructor() {
    effect(() => {
      this.videoId();
      this.url();
      this.start();
      this.autoplay();
      this.mute();
      this.controls();
      this.title();
      this.className();
      if (this.ready) {
        this.syncFromInputs();
      }
    });
  }

  ngOnInit(): void {
    registerRdYoutubeEmbed();
    this.ready = true;
    this.syncFromInputs();
  }

  private syncFromInputs(): void {
    const el = this.host.nativeElement;
    setHostAttribute(el, 'video-id', this.videoId());
    setHostAttribute(el, 'url', this.url());
    setHostAttribute(el, 'start', this.start());
    setHostAttribute(el, 'autoplay', this.autoplay());
    setHostAttribute(el, 'mute', this.mute());
    if (this.controls() === false) {
      el.setAttribute('controls', 'false');
    } else {
      el.removeAttribute('controls');
    }
    setHostAttribute(el, 'embed-title', this.title());
    if (this.className()) {
      el.setAttribute('class', this.className()!);
    } else {
      el.removeAttribute('class');
    }
  }
}
