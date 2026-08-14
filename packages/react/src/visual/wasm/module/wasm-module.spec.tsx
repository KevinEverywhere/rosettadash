import { render, screen } from '@testing-library/react';
import { WasmModule } from './WasmModule.js';

describe('WasmModule', () => {
  it('renders with taxonomy-aligned BEM root block', () => {
    render(<WasmModule />);
    expect(screen.getByTestId('rd-wasm-module')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = { current: null as HTMLElement | null };
    render(<WasmModule ref={ref} />);
    expect(ref.current).toBeTruthy();
  });
});
