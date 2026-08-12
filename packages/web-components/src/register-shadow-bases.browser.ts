import {
  registerAllShadowBases,
  resolvePackageSrcRootFromModule,
  setShadowPackageSrcRoot,
} from './lib/shadow-base.js';

/** Browser-only: register co-located shadow asset bases (not loaded in Jest). */
setShadowPackageSrcRoot(resolvePackageSrcRootFromModule(import.meta.url));
registerAllShadowBases();
