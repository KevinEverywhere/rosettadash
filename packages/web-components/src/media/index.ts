export { DbVideoSourceElement, DB_VIDEO_SOURCE_TAG, registerDbVideoSource } from './video-source';
export {
  DbEquirectViewportElement,
  DB_EQUIRECT_VIEWPORT_TAG,
  registerDbEquirectViewport,
  type EquirectPreviewMode,
} from './equirect-viewport';

import { registerDbEquirectViewport } from './equirect-viewport';
import { registerDbVideoSource } from './video-source';

export function registerDashBuilderMediaElements(): void {
  registerDbVideoSource();
  registerDbEquirectViewport();
}
