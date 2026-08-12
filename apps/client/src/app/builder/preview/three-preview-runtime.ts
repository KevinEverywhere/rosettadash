import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { PreviewChartPoint, PreviewGlobeMarker, PreviewScatterPoint } from '@rosettadash/ui-primitives';
import { latLngToGlobePosition } from '@rosettadash/ui-primitives';

export type ThreeCameraPreset = 'orbit' | 'front' | 'iso';
export type ThreeVisualMode = 'bar-chart' | 'scatter' | 'scene' | 'gltf-model' | 'geo-globe';

export interface ThreeGltfModelConfig {
  url: string;
  scale: number;
}

export interface ThreeGlobeConfig {
  textureUrl: string;
  radius: number;
}

export interface ThreePreviewOptions {
  backgroundColor: string;
  cameraPreset: ThreeCameraPreset;
  autoRotate: boolean;
  showGrid: boolean;
}

export interface ThreePreviewData {
  points: PreviewChartPoint[];
  scatterPoints?: PreviewScatterPoint[];
  globeMarkers?: PreviewGlobeMarker[];
  gltfModel?: ThreeGltfModelConfig;
  globe?: ThreeGlobeConfig;
  mode: ThreeVisualMode;
}

const BAR_COLORS = ['#38bdf8', '#818cf8', '#34d399', '#fbbf24', '#f472b6', '#fb7185'];

export class ThreePreviewRuntime {
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(45, 1, 0.1, 200);
  private renderer?: THREE.WebGLRenderer;
  private controls?: OrbitControls;
  private animationId?: number;
  private resizeObserver?: ResizeObserver;
  private contentGroup = new THREE.Group();
  private gridHelper?: THREE.GridHelper;
  private gltfLoadId = 0;
  private loadedGltfKey?: string;
  private globeTextureLoadId = 0;

  mount(host: HTMLElement): void {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    host.appendChild(this.renderer.domElement);

    this.scene.add(this.contentGroup);
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.65));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.1);
    keyLight.position.set(6, 10, 4);
    this.scene.add(keyLight);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.minDistance = 4;
    this.controls.maxDistance = 40;

    this.resizeObserver = new ResizeObserver(() => this.resize(host));
    this.resizeObserver.observe(host);
    this.resize(host);
    this.startLoop();
  }

  update(options: ThreePreviewOptions, data: ThreePreviewData): void {
    this.scene.background = new THREE.Color(options.backgroundColor);
    this.applyCameraPreset(options.cameraPreset, data.mode);

    if (this.controls) {
      this.controls.autoRotate = options.autoRotate;
      this.controls.autoRotateSpeed = 1.2;
    }

    if (this.gridHelper) {
      this.scene.remove(this.gridHelper);
      this.gridHelper.dispose();
      this.gridHelper = undefined;
    }

    if (options.showGrid) {
      this.gridHelper = new THREE.GridHelper(12, 12, 0x475569, 0x334155);
      this.gridHelper.position.y = -0.01;
      this.scene.add(this.gridHelper);
    }

    this.rebuildContent(data);
  }

  dispose(): void {
    if (this.animationId !== undefined) {
      cancelAnimationFrame(this.animationId);
      this.animationId = undefined;
    }

    this.resizeObserver?.disconnect();
    this.controls?.dispose();

    this.clearContentGroup();
    if (this.gridHelper) {
      this.gridHelper.dispose();
    }

    this.renderer?.dispose();
    this.renderer?.domElement.remove();
    this.renderer = undefined;
    this.controls = undefined;
  }

  private startLoop(): void {
    const tick = () => {
      this.controls?.update();
      if (this.renderer) {
        this.renderer.render(this.scene, this.camera);
      }
      this.animationId = requestAnimationFrame(tick);
    };
    tick();
  }

  private resize(host: HTMLElement): void {
    if (!this.renderer) {
      return;
    }

    const width = Math.max(host.clientWidth, 1);
    const height = Math.max(host.clientHeight, 1);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  private applyCameraPreset(preset: ThreeCameraPreset, mode: ThreeVisualMode): void {
    const positions: Record<ThreeCameraPreset, THREE.Vector3> = {
      orbit: mode === 'geo-globe' ? new THREE.Vector3(0, 0, 7) : new THREE.Vector3(8, 6, 8),
      front: mode === 'geo-globe' ? new THREE.Vector3(0, 0, 10) : new THREE.Vector3(0, 4, 12),
      iso: mode === 'geo-globe' ? new THREE.Vector3(7, 7, 7) : new THREE.Vector3(10, 10, 10),
    };

    const targetY = mode === 'geo-globe' ? 0 : 1.5;
    this.camera.position.copy(positions[preset]);
    this.camera.lookAt(0, targetY, 0);
    this.controls?.target.set(0, targetY, 0);
    this.controls?.update();
  }

  private rebuildContent(data: ThreePreviewData): void {
    if (data.mode !== 'gltf-model') {
      this.gltfLoadId += 1;
      this.loadedGltfKey = undefined;
    }

    if (data.mode !== 'geo-globe') {
      this.globeTextureLoadId += 1;
    }

    this.clearContentGroup();

    const points = data.points.length > 0 ? data.points : defaultPreviewPoints();

    if (data.mode === 'bar-chart') {
      this.addBars(points);
      return;
    }

    if (data.mode === 'scatter') {
      this.addScatter(data.scatterPoints ?? []);
      return;
    }

    if (data.mode === 'scene') {
      this.addScenePointCloud(data.scatterPoints ?? []);
      return;
    }

    if (data.mode === 'gltf-model') {
      this.loadGltfModel(data.gltfModel);
      return;
    }

    if (data.mode === 'geo-globe') {
      this.addGeoGlobe(data.globe, data.globeMarkers ?? []);
    }
  }

  private addGeoGlobe(config: ThreeGlobeConfig | undefined, markers: PreviewGlobeMarker[]): void {
    const radius = config?.radius ?? 2;
    const geometry = new THREE.SphereGeometry(radius, 48, 48);
    const material = new THREE.MeshStandardMaterial({ color: '#1d4ed8' });
    const globe = new THREE.Mesh(geometry, material);
    this.contentGroup.add(globe);

    const textureUrl = config?.textureUrl?.trim();
    if (textureUrl) {
      const loadId = ++this.globeTextureLoadId;
      const loader = new THREE.TextureLoader();
      loader.load(
        textureUrl,
        (texture) => {
          if (loadId !== this.globeTextureLoadId) {
            texture.dispose();
            return;
          }
          material.map = texture;
          material.color.set('#ffffff');
          material.needsUpdate = true;
        },
        undefined,
        () => {
          if (loadId !== this.globeTextureLoadId) {
            return;
          }
        },
      );
    }

    const markerGeometry = new THREE.SphereGeometry(0.08, 10, 10);
    markers.forEach((marker, index) => {
      const position = latLngToGlobePosition(marker.lat, marker.lng, radius);
      const markerMaterial = new THREE.MeshStandardMaterial({
        color: BAR_COLORS[index % BAR_COLORS.length],
      });
      const mesh = new THREE.Mesh(markerGeometry, markerMaterial);
      mesh.position.set(position.x, position.y, position.z);
      this.contentGroup.add(mesh);
    });
  }

  private loadGltfModel(config?: ThreeGltfModelConfig): void {
    const url = config?.url?.trim();
    const scale = config?.scale ?? 1.5;

    if (!url) {
      this.loadedGltfKey = undefined;
      this.addGltfFallback();
      return;
    }

    const loadKey = `${url}::${scale}`;
    this.loadedGltfKey = loadKey;
    const loadId = ++this.gltfLoadId;
    const loader = new GLTFLoader();

    loader.load(
      url,
      (gltf) => {
        if (loadId !== this.gltfLoadId) {
          return;
        }

        this.clearContentGroup();
        const model = gltf.scene.clone(true);
        model.scale.setScalar(scale);

        const bounds = new THREE.Box3().setFromObject(model);
        const center = bounds.getCenter(new THREE.Vector3());
        model.position.sub(center);
        model.position.y += (bounds.max.y - bounds.min.y) / 2;

        this.contentGroup.add(model);
      },
      undefined,
      () => {
        if (loadId !== this.gltfLoadId) {
          return;
        }

        this.loadedGltfKey = undefined;
        this.addGltfFallback();
      },
    );
  }

  private addGltfFallback(): void {
    this.clearContentGroup();
    const geometry = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    const material = new THREE.MeshStandardMaterial({ color: '#64748b' });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = 0.6;
    this.contentGroup.add(mesh);
  }

  private addScenePointCloud(scatterPoints: PreviewScatterPoint[]): void {
    if (scatterPoints.length === 0) {
      const geometry = new THREE.BoxGeometry(1.2, 0.2, 1.2);
      const material = new THREE.MeshStandardMaterial({ color: '#64748b' });
      const platform = new THREE.Mesh(geometry, material);
      platform.position.y = 0.1;
      this.contentGroup.add(platform);
      return;
    }

    const geometry = new THREE.SphereGeometry(0.1, 10, 10);
    scatterPoints.forEach((point, index) => {
      const material = new THREE.MeshStandardMaterial({
        color: BAR_COLORS[index % BAR_COLORS.length],
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(point.x, point.y, point.z);
      this.contentGroup.add(mesh);
    });
  }

  private addBars(points: PreviewChartPoint[]): void {
    const maxValue = Math.max(...points.map((point) => point.value), 1);
    const spacing = 1.4;
    const offset = ((points.length - 1) * spacing) / 2;

    points.forEach((point, index) => {
      const height = Math.max(0.2, (point.value / maxValue) * 4);
      const geometry = new THREE.BoxGeometry(0.9, height, 0.9);
      const material = new THREE.MeshStandardMaterial({
        color: BAR_COLORS[index % BAR_COLORS.length],
        metalness: 0.15,
        roughness: 0.35,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(index * spacing - offset, height / 2, 0);
      this.contentGroup.add(mesh);
    });
  }

  private addScatter(scatterPoints: PreviewScatterPoint[]): void {
    const points = scatterPoints.length > 0 ? scatterPoints : defaultScatterPoints();
    const geometry = new THREE.SphereGeometry(0.18, 16, 16);

    points.forEach((point, index) => {
      const material = new THREE.MeshStandardMaterial({
        color: BAR_COLORS[index % BAR_COLORS.length],
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(point.x, point.y, point.z);
      this.contentGroup.add(mesh);
    });
  }

  private clearContentGroup(): void {
    for (const child of [...this.contentGroup.children]) {
      this.contentGroup.remove(child);
      this.disposeObject3D(child);
    }
  }

  private disposeObject3D(object: THREE.Object3D): void {
    object.traverse((node) => {
      if (node instanceof THREE.Mesh) {
        node.geometry.dispose();
        if (Array.isArray(node.material)) {
          node.material.forEach((material: THREE.Material) => material.dispose());
        } else {
          node.material.dispose();
        }
      }
    });
  }
}

function defaultScatterPoints(): PreviewScatterPoint[] {
  return [
    { x: -2, y: 1.2, z: -2, label: 'A' },
    { x: 0, y: 2.4, z: 1, label: 'B' },
    { x: 2, y: 0.8, z: 2, label: 'C' },
    { x: -1, y: 3.1, z: -1, label: 'D' },
    { x: 1.5, y: 1.6, z: -2.5, label: 'E' },
  ];
}

function defaultPreviewPoints(): PreviewChartPoint[] {
  return [
    { label: 'Mon', value: 12 },
    { label: 'Tue', value: 18 },
    { label: 'Wed', value: 9 },
    { label: 'Thu', value: 22 },
    { label: 'Fri', value: 15 },
  ];
}
