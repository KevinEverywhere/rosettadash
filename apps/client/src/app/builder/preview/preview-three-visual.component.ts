import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  computed,
  effect,
  inject,
  input,
} from '@angular/core';
import type { ComponentNode } from '@dashbuilder/core';
import { PreviewDataService } from './preview-data.service';
import {
  ThreePreviewRuntime,
  type ThreeCameraPreset,
  type ThreeVisualMode,
} from './three-preview-runtime';

@Component({
  selector: 'app-preview-three-visual',
  templateUrl: './preview-three-visual.component.html',
  styleUrl: './preview-three-visual.component.scss',
})
export class PreviewThreeVisualComponent implements AfterViewInit, OnDestroy {
  readonly node = input.required<ComponentNode>();
  readonly mode = input.required<ThreeVisualMode>();

  @ViewChild('host', { static: true }) host!: ElementRef<HTMLDivElement>;

  private readonly previewData = inject(PreviewDataService);
  private runtime?: ThreePreviewRuntime;

  private readonly slice = computed(() => this.previewData.sliceForNode(this.node().id));

  protected readonly chartPoints = computed(
    () => this.slice()?.chartPoints ?? this.previewData.bundle().chartPoints,
  );

  protected readonly linkedHint = computed(() => {
    if (this.slice()?.linkedFromTable) {
      return 'Uses table rowset';
    }
    if (this.slice()?.filteredByDateRange) {
      return `Filtered: ${this.slice()?.dateRangeLabel ?? 'date range'}`;
    }
    return null;
  });

  protected readonly testId = computed(() => {
    switch (this.mode()) {
      case 'bar-chart':
        return 'preview-3d-bar-chart';
      case 'scatter':
        return 'preview-3d-scatter';
      default:
        return 'preview-3d-scene';
    }
  });

  constructor() {
    effect(() => {
      this.node();
      this.mode();
      this.chartPoints();
      this.syncRuntime();
    });
  }

  ngAfterViewInit(): void {
    this.runtime = new ThreePreviewRuntime();
    this.runtime.mount(this.host.nativeElement);
    this.syncRuntime();
  }

  ngOnDestroy(): void {
    this.runtime?.dispose();
    this.runtime = undefined;
  }

  protected title(): string {
    return this.readString(this.node(), 'title', this.node().label);
  }

  private syncRuntime(): void {
    if (!this.runtime) {
      return;
    }

    const node = this.node();
    this.runtime.update(
      {
        backgroundColor: this.readString(node, 'backgroundColor', '#0f172a'),
        cameraPreset: this.readCameraPreset(node),
        autoRotate: this.readBoolean(node, 'autoRotate', false),
        showGrid: this.mode() === 'scene' ? this.readBoolean(node, 'showGrid', true) : true,
      },
      {
        points: this.chartPoints(),
        mode: this.mode(),
      },
    );
  }

  private readString(node: ComponentNode, key: string, fallback: string): string {
    const value = node.properties[key];
    return typeof value === 'string' ? value : fallback;
  }

  private readBoolean(node: ComponentNode, key: string, fallback: boolean): boolean {
    const value = node.properties[key];
    return typeof value === 'boolean' ? value : fallback;
  }

  private readCameraPreset(node: ComponentNode): ThreeCameraPreset {
    const value = node.properties['cameraPreset'];
    if (value === 'front' || value === 'iso' || value === 'orbit') {
      return value;
    }
    return 'orbit';
  }
}
