export { RdVideoSourceElement, DB_VIDEO_SOURCE_TAG, registerRdVideoSource } from './video-source.js';
export {
  RdEquirectViewportElement,
  DB_EQUIRECT_VIEWPORT_TAG,
  registerRdEquirectViewport,
  type EquirectPreviewMode,
} from './equirect-viewport.js';

import { registerRdEquirectViewport } from './equirect-viewport.js';
import { registerRdVideoSource } from './video-source.js';

export function registerRosettaDashMediaElements(): void {
  registerRdVideoSource();
  registerRdEquirectViewport();
}
