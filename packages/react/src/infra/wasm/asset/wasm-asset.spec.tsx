import { render, screen } from '@testing-library/react';
import { WasmAsset } from './WasmAsset.js';

describe('WasmAsset', () => {
  it('renders with taxonomy-aligned BEM root block', () => {
    render(<WasmAsset />);
    expect(screen.getByTestId('rd-wasm-asset')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = { current: null as HTMLElement | null };
    render(<WasmAsset ref={ref} />);
    expect(ref.current).toBeTruthy();
  });
});
