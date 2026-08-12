import { buildEquirectFlatCropFilter } from '@rosettadash/core';
import { RdWasmMediaElement, DB_WASM_MEDIA_TAG, registerRdWasmMedia } from './wasm-media/rd-wasm-media.js';

describe('@rosettadash/web-components/wasm', () => {
  beforeAll(() => {
    registerRdWasmMedia();
  });

  it('registers rd-wasm-media tag', () => {
    expect(customElements.get(DB_WASM_MEDIA_TAG)).toBeDefined();
  });

  it('shows equirect-extract filter preview from crop region', () => {
    const media = document.createElement(DB_WASM_MEDIA_TAG) as RdWasmMediaElement;
    document.body.appendChild(media);

    media.setAttribute('operation', 'equirect-extract');
    media.setAttribute('extraction-mode', 'flat-crop');
    media.setProperty('cropRegion', {
      cropX: 1508,
      cropY: 664,
      cropWidth: 1080,
      cropHeight: 720,
      outputWidth: 720,
      outputHeight: 480,
    });

    expect(media.filterPreview).toBe(
      buildEquirectFlatCropFilter({
        cropX: 1508,
        cropY: 664,
        cropWidth: 1080,
        cropHeight: 720,
        outputWidth: 720,
        outputHeight: 480,
      }),
    );

    media.remove();
  });
});
