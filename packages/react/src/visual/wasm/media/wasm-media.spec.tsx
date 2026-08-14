import { render } from '@testing-library/react';
import { DB_WASM_MEDIA_TAG } from '@rosettadash/web-components/visual/wasm/media';
import { WasmMedia } from './WasmMedia';

describe('@rosettadash/react/visual/wasm/media', () => {
  it('renders and registers the WC host', () => {
    const { container } = render(
      <WasmMedia label="Transcode" operation="equirect-extract" outputFormat="mp4" />,
    );
    const host = container.querySelector(DB_WASM_MEDIA_TAG);
    expect(host).toBeTruthy();
    expect(host?.getAttribute('label')).toBe('Transcode');
    expect(host?.getAttribute('operation')).toBe('equirect-extract');
    expect(customElements.get(DB_WASM_MEDIA_TAG)).toBeTruthy();
  });
});
