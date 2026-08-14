import { forwardRef, useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export interface ScatterPlotPoint {
  id: string;
  label?: string;
  x: number;
  y: number;
  z: number;
}

export interface ThreeScatterPlotProps {
  title?: string;
  points?: ScatterPlotPoint[];
  xAxisLabel?: string;
  yAxisLabel?: string;
  zAxisLabel?: string;
  selectedId?: string;
  onPointSelect?: (id: string) => void;
  minHeight?: string | number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

const FALLBACK_POINTS: ScatterPlotPoint[] = [
  { id: 'a', label: 'A', x: 1, y: 2, z: 3 },
  { id: 'b', label: 'B', x: 3, y: 1, z: 2 },
  { id: 'c', label: 'C', x: 2, y: 3, z: 1 },
];

function normalizePoints(points: ScatterPlotPoint[]): Array<ScatterPlotPoint & { nx: number; ny: number; nz: number }> {
  if (!points.length) {
    return [];
  }
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const zs = points.map((point) => point.z);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const minZ = Math.min(...zs);
  const maxZ = Math.max(...zs);
  const spanX = maxX - minX || 1;
  const spanY = maxY - minY || 1;
  const spanZ = maxZ - minZ || 1;

  return points.map((point) => ({
    ...point,
    nx: ((point.x - minX) / spanX - 0.5) * 4,
    ny: ((point.y - minY) / spanY - 0.5) * 4,
    nz: ((point.z - minZ) / spanZ - 0.5) * 4,
  }));
}

/** @rosettadash/react/visual/display/3d-scatter — Three.js scatter plot (price / distance / rating) */
export const ThreeScatterPlot = forwardRef<HTMLElement, ThreeScatterPlotProps>(function ThreeScatterPlot(
  {
    title,
    points = [],
    xAxisLabel,
    yAxisLabel,
    zAxisLabel,
    selectedId,
    onPointSelect,
    minHeight = '20rem',
    className,
    style,
    children,
  },
  ref,
) {
  const hostRef = useRef<HTMLDivElement>(null);
  const pointMeshesRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const syncPointsRef = useRef<(() => void) | null>(null);
  const propsRef = useRef({ points, selectedId, onPointSelect });
  propsRef.current = { points, selectedId, onPointSelect };

  const rootClass = ['rd-display-3d-scatter', className].filter(Boolean).join(' ');
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
    scene.background = new THREE.Color('#0f172a');

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(5, 4, 6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    host.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.75));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);

    const grid = new THREE.GridHelper(5, 10, '#334155', '#1e293b');
    grid.position.y = -2.2;
    scene.add(grid);

    const axes = new THREE.AxesHelper(2.5);
    scene.add(axes);

    const pointGeometry = new THREE.SphereGeometry(0.12, 12, 12);
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const syncPoints = () => {
      const { points: nextPoints, selectedId: nextSelected } = propsRef.current;
      const meshes = pointMeshesRef.current;
      const normalized = normalizePoints(nextPoints.length ? nextPoints : FALLBACK_POINTS);

      for (const id of [...meshes.keys()]) {
        if (!normalized.some((point) => point.id === id)) {
          const mesh = meshes.get(id);
          if (mesh) {
            (mesh.material as THREE.Material).dispose();
            mesh.removeFromParent();
          }
          meshes.delete(id);
        }
      }

      for (const point of normalized) {
        let mesh = meshes.get(point.id);
        if (!mesh) {
          mesh = new THREE.Mesh(pointGeometry, new THREE.MeshStandardMaterial({ color: '#38bdf8' }));
          mesh.userData['id'] = point.id;
          scene.add(mesh);
          meshes.set(point.id, mesh);
        }
        mesh.position.set(point.nx, point.ny, point.nz);
        const material = mesh.material as THREE.MeshStandardMaterial;
        const selected = point.id === nextSelected;
        material.color.set(selected ? '#fbbf24' : '#38bdf8');
        material.emissive.set(selected ? '#92400e' : '#000000');
        material.emissiveIntensity = selected ? 0.35 : 0;
      }
    };

    syncPoints();
    syncPointsRef.current = syncPoints;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 3;
    controls.maxDistance = 14;

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
      const hits = raycaster.intersectObjects([...pointMeshesRef.current.values()]);
      const hit = hits[0]?.object as THREE.Mesh | undefined;
      const id = hit?.userData?.['id'] as string | undefined;
      if (id) {
        propsRef.current.onPointSelect?.(id);
      }
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);

    return () => {
      syncPointsRef.current = null;
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      controls.dispose();
      pointMeshesRef.current.forEach((mesh) => {
        (mesh.material as THREE.Material).dispose();
        mesh.removeFromParent();
      });
      pointMeshesRef.current.clear();
      pointGeometry.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  useEffect(() => {
    syncPointsRef.current?.();
  }, [points, selectedId]);

  const axisHint = [xAxisLabel, yAxisLabel, zAxisLabel].filter(Boolean).join(' · ');

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={rootClass}
      style={hostStyle}
      data-testid="rd-display-3d-scatter"
      aria-label={title ?? '3D scatter plot'}
    >
      {title ? <header className="rd-display-3d-scatter__header">{title}</header> : null}
      {axisHint ? <p className="rd-display-3d-scatter__axes">{axisHint}</p> : null}
      <div ref={hostRef} className="rd-display-3d-scatter__canvas-host" />
      {children}
    </section>
  );
});
