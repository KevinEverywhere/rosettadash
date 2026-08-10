import type { Composite, StackProfile } from '../model/types';

/** Request body for combined UI + server export bundle generation. */
export interface ExportBundleRequest {
  composite: Composite;
  stackProfile?: StackProfile;
}
