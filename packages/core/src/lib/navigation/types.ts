/** Supported client-side router implementations for proof / host apps. */
export type ClientRouterMode = 'browser';

export interface ClientRouterModeOption {
  id: ClientRouterMode;
  label: string;
  description: string;
}
