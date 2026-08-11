export { RdVideoSourceElement, DB_VIDEO_SOURCE_TAG, registerRdVideoSource } from './video-source';
export {
  RdEquirectViewportElement,
  DB_EQUIRECT_VIEWPORT_TAG,
  registerRdEquirectViewport,
  type EquirectPreviewMode,
} from './equirect-viewport';

import { registerRdEquirectViewport } from './equirect-viewport';
import { registerRdVideoSource } from './video-source';

export function registerRosettaDashMediaElements(): void {
  registerRdVideoSource();
  registerRdEquirectViewport();
}
