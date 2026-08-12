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
  DB_EQUIRECT_VIEWPORT_TAG,
  registerRdEquirectViewport,
  type EquirectPreviewMode,
} from '@rosettadash/web-components/visual/media/equirect-viewport';
import {
  attachHostEvents,
  setHostAttribute,
} from '../../../lib/custom-element-host';

export type { EquirectPreviewMode };

/** Public props for visual/media/equirect-viewport. */
export interface EquirectViewportProps {
  label?: string;
  previewMode?: EquirectPreviewMode;
  sourceWidth?: number;
  sourceHeight?: number;
  cropX?: number;
  cropY?: number;
  cropWidth?: number;
  cropHeight?: number;
  outputWidth?: number;
  outputHeight?: number;
  yaw?: number;
  pitch?: number;
  horizontalFov?: number;
  className?: string;
}

/** Angular host for `<rd-equirect-viewport>`. */
@Component({
  selector: DB_EQUIRECT_VIEWPORT_TAG,
  standalone: true,
  template: '',
})
export class EquirectViewport implements OnInit, OnDestroy {
  private readonly host = inject(ElementRef<HTMLElement>);
  private detachEvents: (() => void) | undefined;
  private ready = false;

  readonly label = input<string | undefined>(undefined);
  readonly previewMode = input<EquirectPreviewMode | undefined>(undefined);
  readonly sourceWidth = input<number | undefined>(undefined);
  readonly sourceHeight = input<number | undefined>(undefined);
  readonly cropX = input<number | undefined>(undefined);
  readonly cropY = input<number | undefined>(undefined);
  readonly cropWidth = input<number | undefined>(undefined);
  readonly cropHeight = input<number | undefined>(undefined);
  readonly outputWidth = input<number | undefined>(undefined);
  readonly outputHeight = input<number | undefined>(undefined);
  readonly yaw = input<number | undefined>(undefined);
  readonly pitch = input<number | undefined>(undefined);
  readonly horizontalFov = input<number | undefined>(undefined);
  readonly className = input<string | undefined>(undefined);

  readonly cropRegion = output<
    Record<string, string | number | boolean | null | undefined>
  >();

  constructor() {
    effect(() => {
      this.label();
      this.previewMode();
      this.sourceWidth();
      this.sourceHeight();
      this.cropX();
      this.cropY();
      this.cropWidth();
      this.cropHeight();
      this.outputWidth();
      this.outputHeight();
      this.yaw();
      this.pitch();
      this.horizontalFov();
      this.className();
      if (this.ready) {
        this.syncFromInputs();
      }
    });
  }

  ngOnInit(): void {
    registerRdEquirectViewport();
    this.ready = true;
    this.syncFromInputs();
    this.detachEvents = attachHostEvents(this.host.nativeElement, {
      'crop-region': (detail: unknown) =>
        this.cropRegion.emit(
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
    setHostAttribute(el, 'preview-mode', this.previewMode());
    setHostAttribute(el, 'source-width', this.sourceWidth());
    setHostAttribute(el, 'source-height', this.sourceHeight());
    setHostAttribute(el, 'crop-x', this.cropX());
    setHostAttribute(el, 'crop-y', this.cropY());
    setHostAttribute(el, 'crop-width', this.cropWidth());
    setHostAttribute(el, 'crop-height', this.cropHeight());
    setHostAttribute(el, 'output-width', this.outputWidth());
    setHostAttribute(el, 'output-height', this.outputHeight());
    setHostAttribute(el, 'yaw', this.yaw());
    setHostAttribute(el, 'pitch', this.pitch());
    setHostAttribute(el, 'horizontal-fov', this.horizontalFov());
    if (this.className()) {
      el.setAttribute('class', this.className()!);
    } else {
      el.removeAttribute('class');
    }
  }
}
