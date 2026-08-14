jest.mock('three/examples/jsm/controls/OrbitControls.js', () => ({
  OrbitControls: jest.fn().mockImplementation(() => ({
    enableDamping: false,
    dampingFactor: 0,
    minDistance: 0,
    maxDistance: 0,
    update: jest.fn(),
    dispose: jest.fn(),
  })),
}));

jest.mock('three', () => {
  class MockVector2 {
    x = 0;
    y = 0;
  }

  const mockRenderer = {
    domElement: document.createElement('canvas'),
    setPixelRatio: jest.fn(),
    setSize: jest.fn(),
    render: jest.fn(),
    dispose: jest.fn(),
  };

  return {
    Scene: jest.fn().mockImplementation(() => ({ add: jest.fn(), background: null })),
    PerspectiveCamera: jest.fn().mockImplementation(() => ({
      position: { set: jest.fn() },
      aspect: 1,
      updateProjectionMatrix: jest.fn(),
    })),
    WebGLRenderer: jest.fn(() => mockRenderer),
    Color: jest.fn(),
    AmbientLight: jest.fn(),
    DirectionalLight: jest.fn().mockImplementation(() => ({ position: { set: jest.fn() } })),
    GridHelper: jest.fn().mockImplementation(() => ({ position: { y: 0 } })),
    AxesHelper: jest.fn(),
    Mesh: jest.fn().mockImplementation(() => ({
      position: { set: jest.fn() },
      material: {
        dispose: jest.fn(),
        color: { set: jest.fn() },
        emissive: { set: jest.fn() },
        emissiveIntensity: 0,
      },
      removeFromParent: jest.fn(),
      userData: {},
    })),
    SphereGeometry: jest.fn().mockImplementation(() => ({ dispose: jest.fn() })),
    MeshStandardMaterial: jest.fn().mockImplementation(() => ({
      color: { set: jest.fn() },
      emissive: { set: jest.fn() },
      emissiveIntensity: 0,
      dispose: jest.fn(),
    })),
    Raycaster: jest.fn().mockImplementation(() => ({
      setFromCamera: jest.fn(),
      intersectObjects: jest.fn(() => []),
    })),
    Vector2: MockVector2,
  };
});

import { render, screen } from '@testing-library/react';
import { ThreeScatterPlot } from './ThreeScatterPlot.js';

describe('ThreeScatterPlot', () => {
  beforeAll(() => {
    class MockResizeObserver {
      observe = jest.fn();
      disconnect = jest.fn();
    }
    global.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;
    global.requestAnimationFrame = jest.fn(() => 1);
    global.cancelAnimationFrame = jest.fn();
  });

  it('renders with taxonomy-aligned BEM root block', () => {
    render(<ThreeScatterPlot />);
    expect(screen.getByTestId('rd-display-3d-scatter')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = { current: null as HTMLElement | null };
    render(<ThreeScatterPlot ref={ref} />);
    expect(ref.current).toBeTruthy();
  });
});
