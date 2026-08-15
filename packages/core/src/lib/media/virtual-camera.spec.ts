import { virtualCameraToCropRegion, VirtualCamera } from './virtual-camera';

describe('virtual-camera', () => {
  it('normalizes pitch and locks roll', () => {
    const camera = new VirtualCamera({ pitch: 120, roll: 45 });
    camera.normalizeReadable();
    expect(camera.pitch).toBe(89);
    expect(camera.roll).toBe(0);
  });

  it('builds rectilinear crop region for wasm media', () => {
    const region = virtualCameraToCropRegion({
      camera: { yaw: 25, pitch: -8, roll: 0, fov: 75 },
      sourceWidth: 3840,
      sourceHeight: 1920,
      outputWidth: 640,
      outputHeight: 360,
    });

    expect(region.previewMode).toBe('rectilinear');
    expect(region.yaw).toBe(25);
    expect(String(region.filter)).toContain('v360=input=equirect');
    expect(String(region.filter)).toContain('scale=640:360');
  });
});
