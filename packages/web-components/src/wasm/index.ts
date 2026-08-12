export { RdWasmMediaElement, DB_WASM_MEDIA_TAG, registerRdWasmMedia } from './wasm-media/index.js';

import { registerRdWasmMedia } from './wasm-media/index.js';

export function registerRosettaDashWasmElements(): void {
  registerRdWasmMedia();
}
