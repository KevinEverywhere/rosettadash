import { render, screen } from '@testing-library/react';
import { WasmWorkerHost } from './WasmWorkerHost.js';

describe('WasmWorkerHost', () => {
  it('renders with taxonomy-aligned BEM root block', () => {
    render(<WasmWorkerHost />);
    expect(screen.getByTestId('rd-wasm-worker-host')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = { current: null as HTMLElement | null };
    render(<WasmWorkerHost ref={ref} />);
    expect(ref.current).toBeTruthy();
  });
});
