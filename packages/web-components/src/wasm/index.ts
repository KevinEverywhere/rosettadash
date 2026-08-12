export { RdWasmMediaElement, DB_WASM_MEDIA_TAG, registerRdWasmMedia } from './wasm-media.js';

import { registerRdWasmMedia } from './wasm-media.js';

export function registerRosettaDashWasmElements(): void {
  registerRdWasmMedia();
}
