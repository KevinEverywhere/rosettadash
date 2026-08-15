import { NgClass } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  computed,
  effect,
  input,
  output,
  viewChild,
} from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export interface GlobeMarker {
  id: string;
  lat: number;
  lng: number;
  label?: string;
}

/** Public props for visual/display/3d-geo-globe. */
export interface ThreeGeoGlobeProps {
  title?: string;
  textureUrl?: string;
  markers?: GlobeMarker[];
  selectedId?: string;
  minHeight?: string | number;
  className?: string;
}

const GLOBE_RADIUS = 1.6;

function latLngToGlobePosition(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lng + 180) * Math.PI) / 180;
  const surfaceRadius = radius + 0.04;
  return new THREE.Vector3(
    -surfaceRadius * Math.sin(phi) * Math.cos(theta),
    surfaceRadius * Math.cos(phi),
    surfaceRadius * Math.sin(phi) * Math.sin(theta),
  );
}

function globeGeometryDispose(globe: THREE.Mesh): void {
  globe.geometry.dispose();
  const material = globe.material;
  if (Array.isArray(material)) {
    material.forEach((entry) => entry.dispose());
  } else {
    material.dispose();
    if (material instanceof THREE.MeshStandardMaterial && material.map) {
      material.map.dispose();
    }
  }
}

/** @rosettadash/angular/visual/display/3d-geo-globe — Three.js globe with destination markers */
@Component({
  selector: 'rd-display-3d-geo-globe',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section
      [attr.data-testid]="'rd-display-3d-geo-globe'"
      [ngClass]="rootClass()"
      [attr.aria-label]="title() ?? '3D destination globe'"
      [style.minHeight]="minHeightStyle()"
    >
      @if (title()) {
        <header class="rd-display-3d-geo-globe__header">{{ title() }}</header>
      }
      <div #canvasHost class="rd-display-3d-geo-globe__canvas-host"></div>
      <ng-content />
    </section>
  `,
})
export class ThreeGeoGlobe implements AfterViewInit, OnDestroy {
  readonly className = input<string | undefined>(undefined);
  readonly title = input<string | undefined>(undefined);
  readonly textureUrl = input<string | undefined>(undefined);
  readonly markers = input<GlobeMarker[]>([]);
  readonly selectedId = input<string | undefined>(undefined);
  readonly minHeight = input<string | number>('28rem');

  readonly markerSelect = output<string>();

  private readonly canvasHost = viewChild<ElementRef<HTMLDivElement>>('canvasHost');

  readonly rootClass = computed(() =>
    ['rd-display-3d-geo-globe', this.className()].filter(Boolean).join(' '),
  );

  readonly minHeightStyle = computed(() => {
    const value = this.minHeight();
    return typeof value === 'number' ? `${value}px` : value;
  });

  private markerMeshes = new Map<string, THREE.Mesh>();
  private syncMarkers: (() => void) | null = null;
  private flyToLatLng: ((lat: number, lng: number) => void) | null = null;
  private disposeRuntime: (() => void) | null = null;
  private mounted = false;

  constructor() {
    effect(() => {
      this.markers();
      this.selectedId();
      if (this.mounted) {
        this.syncMarkers?.();
      }
    });

    effect(() => {
      const selectedId = this.selectedId();
      const markers = this.markers();
      if (!this.mounted || !selectedId) {
        return;
      }
      const marker = markers.find((entry) => entry.id === selectedId);
      if (marker) {
        this.flyToLatLng?.(marker.lat, marker.lng);
      }
    });
  }

  ngAfterViewInit(): void {
    this.mountScene();
    this.mounted = true;
    this.syncMarkers?.();
  }

  ngOnDestroy(): void {
    this.disposeRuntime?.();
    this.mounted = false;
  }

  private mountScene(): void {
    const host = this.canvasHost()?.nativeElement;
    if (!host) {
      return;
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0b1220');

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0.4, 4.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    host.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.72));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.05);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);

    const globeMaterial = new THREE.MeshStandardMaterial({ color: '#1d4ed8' });
    const globe = new THREE.Mesh(new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64), globeMaterial);
    scene.add(globe);

    let textureLoadId = 0;
    const textureUrl = this.textureUrl();
    if (textureUrl) {
      const loadId = ++textureLoadId;
      new THREE.TextureLoader().load(textureUrl, (texture) => {
        if (loadId !== textureLoadId) {
          texture.dispose();
          return;
        }
        globeMaterial.map = texture;
        globeMaterial.color.set('#ffffff');
        globeMaterial.needsUpdate = true;
      });
    }

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 2.8;
    controls.maxDistance = 8;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.6;

    const markerGeometry = new THREE.SphereGeometry(0.06, 12, 12);
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const syncMarkers = () => {
      const nextMarkers = this.markers();
      const nextSelected = this.selectedId();
      const meshes = this.markerMeshes;

      for (const id of [...meshes.keys()]) {
        if (!nextMarkers.some((marker) => marker.id === id)) {
          const mesh = meshes.get(id);
          if (mesh) {
            (mesh.material as THREE.Material).dispose();
            mesh.removeFromParent();
          }
          meshes.delete(id);
        }
      }

      for (const marker of nextMarkers) {
        let mesh = meshes.get(marker.id);
        if (!mesh) {
          mesh = new THREE.Mesh(markerGeometry, new THREE.MeshStandardMaterial({ color: '#f87171' }));
          mesh.userData['id'] = marker.id;
          scene.add(mesh);
          meshes.set(marker.id, mesh);
        }
        const position = latLngToGlobePosition(marker.lat, marker.lng, GLOBE_RADIUS);
        mesh.position.copy(position);
        const material = mesh.material as THREE.MeshStandardMaterial;
        const selected = marker.id === nextSelected;
        material.color.set(selected ? '#fbbf24' : '#f87171');
        material.emissive.set(selected ? '#92400e' : '#000000');
        material.emissiveIntensity = selected ? 0.35 : 0;
      }
    };

    this.syncMarkers = syncMarkers;

    let flyFrameId = 0;
    this.flyToLatLng = (lat: number, lng: number) => {
      cancelAnimationFrame(flyFrameId);
      controls.autoRotate = false;

      const markerPos = latLngToGlobePosition(lat, lng, GLOBE_RADIUS);
      const distance = camera.position.length() || 4.8;
      const endPos = markerPos.clone().normalize().multiplyScalar(distance);
      const startPos = camera.position.clone();
      const flyStart = performance.now();
      const flyDuration = 900;

      const animateFly = (now: number) => {
        const t = Math.min((now - flyStart) / flyDuration, 1);
        const eased = 1 - (1 - t) ** 3;
        camera.position.lerpVectors(startPos, endPos, eased);
        controls.update();
        if (t < 1) {
          flyFrameId = requestAnimationFrame(animateFly);
        } else {
          controls.autoRotate = true;
        }
      };

      flyFrameId = requestAnimationFrame(animateFly);
    };

    const resize = () => {
      const width = host.clientWidth || 1;
      const height = host.clientHeight || 1;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();

    let animationId = 0;
    const tick = () => {
      controls.update();
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(tick);
    };
    tick();

    const onPointerDown = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects([...this.markerMeshes.values()]);
      const hit = hits[0]?.object as THREE.Mesh | undefined;
      const id = hit?.userData?.['id'] as string | undefined;
      if (id) {
        this.markerSelect.emit(id);
      }
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);

    this.disposeRuntime = () => {
      this.syncMarkers = null;
      this.flyToLatLng = null;
      cancelAnimationFrame(flyFrameId);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      controls.dispose();
      this.markerMeshes.forEach((mesh) => {
        (mesh.material as THREE.Material).dispose();
        mesh.removeFromParent();
      });
      this.markerMeshes.clear();
      globeGeometryDispose(globe);
      markerGeometry.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      textureLoadId += 1;
    };
  }
}
