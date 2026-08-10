import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { PreviewChartPoint } from '@dashbuilder/ui-primitives';

export type ThreeCameraPreset = 'orbit' | 'front' | 'iso';
export type ThreeVisualMode = 'bar-chart' | 'scatter' | 'scene';

export interface ThreePreviewOptions {
  backgroundColor: string;
  cameraPreset: ThreeCameraPreset;
  autoRotate: boolean;
  showGrid: boolean;
}

export interface ThreePreviewData {
  points: PreviewChartPoint[];
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
    this.applyCameraPreset(options.cameraPreset);

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

  private applyCameraPreset(preset: ThreeCameraPreset): void {
    const positions: Record<ThreeCameraPreset, THREE.Vector3> = {
      orbit: new THREE.Vector3(8, 6, 8),
      front: new THREE.Vector3(0, 4, 12),
      iso: new THREE.Vector3(10, 10, 10),
    };

    this.camera.position.copy(positions[preset]);
    this.camera.lookAt(0, 1.5, 0);
    this.controls?.target.set(0, 1.5, 0);
    this.controls?.update();
  }

  private rebuildContent(data: ThreePreviewData): void {
    this.clearContentGroup();

    const points = data.points.length > 0 ? data.points : defaultPreviewPoints();

    if (data.mode === 'bar-chart') {
      this.addBars(points);
      return;
    }

    if (data.mode === 'scatter') {
      this.addScatter(points);
      return;
    }

    this.addSceneMarkers(points);
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

  private addScatter(points: PreviewChartPoint[]): void {
    const maxValue = Math.max(...points.map((point) => point.value), 1);
    const geometry = new THREE.SphereGeometry(0.18, 16, 16);

    points.forEach((point, index) => {
      const material = new THREE.MeshStandardMaterial({
        color: BAR_COLORS[index % BAR_COLORS.length],
      });
      const mesh = new THREE.Mesh(geometry, material);
      const angle = (index / Math.max(points.length, 1)) * Math.PI * 2;
      mesh.position.set(
        Math.cos(angle) * 3,
        (point.value / maxValue) * 4 + 0.2,
        Math.sin(angle) * 3,
      );
      this.contentGroup.add(mesh);
    });
  }

  private addSceneMarkers(points: PreviewChartPoint[]): void {
    if (points.length === 0) {
      const geometry = new THREE.BoxGeometry(1.2, 0.2, 1.2);
      const material = new THREE.MeshStandardMaterial({ color: '#64748b' });
      const platform = new THREE.Mesh(geometry, material);
      platform.position.y = 0.1;
      this.contentGroup.add(platform);
      return;
    }

    const maxValue = Math.max(...points.map((point) => point.value), 1);
    const geometry = new THREE.SphereGeometry(0.12, 12, 12);
    points.slice(0, 24).forEach((point, index) => {
      const material = new THREE.MeshStandardMaterial({
        color: BAR_COLORS[index % BAR_COLORS.length],
      });
      const mesh = new THREE.Mesh(geometry, material);
      const angle = (index / Math.max(points.length, 1)) * Math.PI * 2;
      mesh.position.set(
        Math.cos(angle) * 2.5,
        (point.value / maxValue) * 2 + 0.2,
        Math.sin(angle) * 2.5,
      );
      this.contentGroup.add(mesh);
    });
  }

  private clearContentGroup(): void {
    for (const child of [...this.contentGroup.children]) {
      this.contentGroup.remove(child);
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        if (Array.isArray(child.material)) {
          child.material.forEach((material: THREE.Material) => material.dispose());
        } else {
          child.material.dispose();
        }
      }
    }
  }
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
