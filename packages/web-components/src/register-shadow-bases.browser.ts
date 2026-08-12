import { registerAllShadowBases, setShadowPackageSrcRoot } from './lib/shadow-base.js';

/** Browser-only: register co-located shadow asset bases (not loaded in Jest). */
setShadowPackageSrcRoot(new URL('./', import.meta.url).href);
registerAllShadowBases();
