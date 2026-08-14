import { forwardRef, useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export interface GlobeMarker {
  id: string;
  lat: number;
  lng: number;
  label?: string;
}

export interface ThreeGeoGlobeProps {
  title?: string;
  textureUrl?: string;
  markers?: GlobeMarker[];
  selectedId?: string;
  onMarkerSelect?: (id: string) => void;
  minHeight?: string | number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
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

/** @rosettadash/react/visual/display/3d-geo-globe — Three.js globe with destination markers */
export const ThreeGeoGlobe = forwardRef<HTMLElement, ThreeGeoGlobeProps>(function ThreeGeoGlobe(
  {
    title,
    textureUrl,
    markers = [],
    selectedId,
    onMarkerSelect,
    minHeight = '28rem',
    className,
    style,
    children,
  },
  ref,
) {
  const hostRef = useRef<HTMLDivElement>(null);
  const markerMeshesRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const syncMarkersRef = useRef<(() => void) | null>(null);
  const propsRef = useRef({ markers, selectedId, onMarkerSelect });
  propsRef.current = { markers, selectedId, onMarkerSelect };

  const rootClass = ['rd-display-3d-geo-globe', className].filter(Boolean).join(' ');
  const hostStyle: CSSProperties = {
    ...style,
    minHeight: typeof minHeight === 'number' ? `${minHeight}px` : minHeight,
  };

  useEffect(() => {
    const host = hostRef.current;
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
      const { markers: nextMarkers, selectedId: nextSelected } = propsRef.current;
      const meshes = markerMeshesRef.current;

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

    syncMarkers();
    syncMarkersRef.current = syncMarkers;

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
      const hits = raycaster.intersectObjects([...markerMeshesRef.current.values()]);
      const hit = hits[0]?.object as THREE.Mesh | undefined;
      const id = hit?.userData?.['id'] as string | undefined;
      if (id) {
        propsRef.current.onMarkerSelect?.(id);
      }
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);

    return () => {
      syncMarkersRef.current = null;
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      controls.dispose();
      markerMeshesRef.current.forEach((mesh) => {
        (mesh.material as THREE.Material).dispose();
        mesh.removeFromParent();
      });
      markerMeshesRef.current.clear();
      globeGeometryDispose(globe);
      markerGeometry.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      textureLoadId += 1;
    };
  }, [textureUrl]);

  useEffect(() => {
    syncMarkersRef.current?.();
  }, [markers, selectedId]);

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={rootClass}
      style={hostStyle}
      data-testid="rd-display-3d-geo-globe"
      aria-label={title ?? '3D destination globe'}
    >
      {title ? <header className="rd-display-3d-geo-globe__header">{title}</header> : null}
      <div ref={hostRef} className="rd-display-3d-geo-globe__canvas-host" />
      {children}
    </section>
  );
});

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
