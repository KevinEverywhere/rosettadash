export { RdWasmMediaElement, DB_WASM_MEDIA_TAG, registerRdWasmMedia } from './wasm-media';

import { registerRdWasmMedia } from './wasm-media';

export function registerRosettaDashWasmElements(): void {
  registerRdWasmMedia();
}
