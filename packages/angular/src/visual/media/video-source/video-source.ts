import {
  Component,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
} from '@angular/core';
import {
  DB_VIDEO_SOURCE_TAG,
  registerRdVideoSource,
} from '@rosettadash/web-components/visual/media/video-source';
import {
  attachHostEvents,
  setHostAttribute,
} from '../../../lib/custom-element-host';

export interface VideoFileDetail {
  file: File;
  metadata: Record<string, string | number | boolean | null | undefined>;
}

/** Public props for visual/media/video-source. */
export interface VideoSourceProps {
  label?: string;
  accept?: string;
  sourceWidth?: number;
  sourceHeight?: number;
  presentation?: 'default' | 'authoring-source' | 'authoring-frame';
  hint?: string;
  className?: string;
}

/**
 * Angular host for `<rd-video-source>`.
 * Selector matches the WC tag; attrs sync with setAttribute only.
 */
@Component({
  selector: DB_VIDEO_SOURCE_TAG,
  standalone: true,
  template: '',
})
export class VideoSource implements OnInit, OnDestroy {
  private readonly host = inject(ElementRef<HTMLElement>);
  private detachEvents: (() => void) | undefined;
  private ready = false;

  readonly label = input<string | undefined>(undefined);
  readonly accept = input<string | undefined>(undefined);
  readonly sourceWidth = input<number | undefined>(undefined);
  readonly sourceHeight = input<number | undefined>(undefined);
  readonly presentation = input<'default' | 'authoring-source' | 'authoring-frame' | undefined>(undefined);
  readonly hint = input<string | undefined>(undefined);
  readonly className = input<string | undefined>(undefined);

  readonly videoFile = output<VideoFileDetail>();
  readonly metadata = output<
    Record<string, string | number | boolean | null | undefined>
  >();

  constructor() {
    effect(() => {
      this.label();
      this.accept();
      this.sourceWidth();
      this.sourceHeight();
      this.presentation();
      this.hint();
      this.className();
      if (this.ready) {
        this.syncFromInputs();
      }
    });
  }

  ngOnInit(): void {
    registerRdVideoSource();
    this.ready = true;
    this.syncFromInputs();
    this.detachEvents = attachHostEvents(this.host.nativeElement, {
      'video-file': (detail: unknown) =>
        this.videoFile.emit(detail as VideoFileDetail),
      metadata: (detail: unknown) =>
        this.metadata.emit(
          detail as Record<string, string | number | boolean | null | undefined>,
        ),
    });
  }

  ngOnDestroy(): void {
    this.detachEvents?.();
  }

  private syncFromInputs(): void {
    const el = this.host.nativeElement;
    setHostAttribute(el, 'label', this.label());
    setHostAttribute(el, 'accept', this.accept());
    setHostAttribute(el, 'source-width', this.sourceWidth());
    setHostAttribute(el, 'source-height', this.sourceHeight());
    setHostAttribute(el, 'presentation', this.presentation());
    setHostAttribute(el, 'hint', this.hint());
    if (this.className()) {
      el.setAttribute('class', this.className()!);
    } else {
      el.removeAttribute('class');
    }
  }
}
