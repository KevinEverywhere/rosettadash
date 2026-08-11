import { buildEquirectFlatCropFilter } from '@dashbuilder/core';
import {
  DbEquirectViewportElement,
  DB_EQUIRECT_VIEWPORT_TAG,
  registerDbEquirectViewport,
} from './equirect-viewport';
import { DbVideoSourceElement, DB_VIDEO_SOURCE_TAG, registerDbVideoSource } from './video-source';

describe('@dashbuilder/web-components/media', () => {
  beforeAll(() => {
    registerDbVideoSource();
    registerDbEquirectViewport();
  });

  it('registers db-video-source and db-equirect-viewport tags', () => {
    expect(customElements.get(DB_VIDEO_SOURCE_TAG)).toBe(DbVideoSourceElement);
    expect(customElements.get(DB_EQUIRECT_VIEWPORT_TAG)).toBe(DbEquirectViewportElement);
  });

  it('emits crop-region with flat-crop filter defaults', () => {
    const viewport = document.createElement(DB_EQUIRECT_VIEWPORT_TAG) as DbEquirectViewportElement;
    document.body.appendChild(viewport);

    const handler = jest.fn();
    viewport.addEventListener('crop-region', handler);

    viewport.setAttribute('preview-mode', 'flat-crop');
    viewport.setAttribute('crop-x', '1508');
    viewport.setAttribute('crop-y', '664');
    viewport.setAttribute('crop-width', '1080');
    viewport.setAttribute('crop-height', '720');
    viewport.setAttribute('output-width', '720');
    viewport.setAttribute('output-height', '480');

    expect(handler).toHaveBeenCalled();
    const detail = handler.mock.calls.at(-1)?.[0]?.detail;
    expect(detail.filter).toBe(
      buildEquirectFlatCropFilter({
        cropX: 1508,
        cropY: 664,
        cropWidth: 1080,
        cropHeight: 720,
        outputWidth: 720,
        outputHeight: 480,
      }),
    );

    viewport.remove();
  });

  it('renders rectilinear preview mode with v360 filter', () => {
    const viewport = document.createElement(DB_EQUIRECT_VIEWPORT_TAG) as DbEquirectViewportElement;
    document.body.appendChild(viewport);

    viewport.setAttribute('preview-mode', 'rectilinear');
    viewport.setAttribute('yaw', '90');
    viewport.setAttribute('pitch', '10');
    viewport.setAttribute('horizontal-fov', '75');
    viewport.setAttribute('output-width', '720');
    viewport.setAttribute('output-height', '480');

    expect(viewport.shadowRoot?.textContent).toContain('Rectilinear');
    expect(viewport.cropRegion['filter']).toContain('v360=input=equirect:output=rectilinear:yaw=90');

    viewport.remove();
  });
});
