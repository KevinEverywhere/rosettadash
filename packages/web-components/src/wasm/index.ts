export { DbWasmMediaElement, DB_WASM_MEDIA_TAG, registerDbWasmMedia } from './wasm-media';

import { registerDbWasmMedia } from './wasm-media';

export function registerDashBuilderWasmElements(): void {
  registerDbWasmMedia();
}
