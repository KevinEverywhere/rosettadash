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
import type { ComponentNode } from '@rosettadash/core';
import { DEFAULT_GLTF_MODEL_URL, DEFAULT_GLOBE_TEXTURE_URL } from '@rosettadash/core';
import {
  mapRowsToGlobeMarkers,
  mapRowsToScatterPoints,
  resolveGlobeFields,
  resolveScatterFields,
} from '@rosettadash/ui-primitives';
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

  protected readonly scatterPoints = computed(() => {
    if (this.mode() === 'gltf-model' || this.mode() === 'geo-globe') {
      return [];
    }

    const slice = this.slice();
    if (slice?.scatterPoints?.length) {
      return slice.scatterPoints;
    }

    const tableRows = slice?.tableRows ?? this.previewData.bundle().tableRows;
    return mapRowsToScatterPoints(tableRows, resolveScatterFields(this.node().properties));
  });

  protected readonly gltfModel = computed(() => ({
    url: this.readString(this.node(), 'modelUrl', DEFAULT_GLTF_MODEL_URL),
    scale: this.readNumber(this.node(), 'modelScale', 1.5),
  }));

  protected readonly globeMarkers = computed(() => {
    if (this.mode() !== 'geo-globe') {
      return [];
    }

    const slice = this.slice();
    if (slice?.globeMarkers?.length) {
      return slice.globeMarkers;
    }

    const tableRows = slice?.tableRows ?? this.previewData.bundle().tableRows;
    return mapRowsToGlobeMarkers(tableRows, resolveGlobeFields(this.node().properties));
  });

  protected readonly globeConfig = computed(() => ({
    textureUrl: this.readString(this.node(), 'textureUrl', DEFAULT_GLOBE_TEXTURE_URL),
    radius: this.readNumber(this.node(), 'globeRadius', 2),
  }));

  protected readonly linkedHint = computed(() => {
    if (this.mode() === 'gltf-model') {
      return 'GLTF model host';
    }
    if (this.mode() === 'geo-globe') {
      if (this.slice()?.linkedFromTable) {
        return 'Uses table rowset lat/lng';
      }
      return 'Geo globe markers';
    }

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
      case 'gltf-model':
        return 'preview-3d-gltf-model';
      case 'geo-globe':
        return 'preview-3d-geo-globe';
      default:
        return 'preview-3d-scene';
    }
  });

  constructor() {
    effect(() => {
      this.node();
      this.mode();
      this.chartPoints();
      this.scatterPoints();
      this.gltfModel();
      this.globeMarkers();
      this.globeConfig();
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
        showGrid:
          this.mode() === 'geo-globe'
            ? false
            : this.mode() === 'scene' || this.mode() === 'gltf-model'
              ? this.readBoolean(node, 'showGrid', true)
              : true,
      },
      {
        points: this.chartPoints(),
        scatterPoints: this.scatterPoints(),
        gltfModel: this.mode() === 'gltf-model' ? this.gltfModel() : undefined,
        globe: this.mode() === 'geo-globe' ? this.globeConfig() : undefined,
        globeMarkers: this.mode() === 'geo-globe' ? this.globeMarkers() : undefined,
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

  private readNumber(node: ComponentNode, key: string, fallback: number): number {
    const value = node.properties[key];
    return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
  }

  private readCameraPreset(node: ComponentNode): ThreeCameraPreset {
    const value = node.properties['cameraPreset'];
    if (value === 'front' || value === 'iso' || value === 'orbit') {
      return value;
    }
    return 'orbit';
  }
}
